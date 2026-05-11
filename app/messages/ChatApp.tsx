"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { UserList } from "@/components/messages/user-list";
import { ChatWindow } from "@/components/messages/chat-window";
import { ProfilePanel } from "@/components/messages/profile-panel";
import { GroupInfoPanel } from "@/components/messages/group-info-panel";
import { NewChatModal } from "@/components/messages/new-chat-modal";
import { CreateGroupModal } from "@/components/messages/create-group-modal";
import { MyProfileProvider } from "@/components/messages/my-profile-context";
import { Send, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";

type User = {
  id: string;
  name?: string | null;
  picture?: string | null;
  isOnline?: boolean;
  isAI?: boolean;
};

type Message = {
  id: string;
  sessionId?: string;
  text: string;
  senderId?: string;
  createdAt: string;
};

type Session = {
  id: string;
  isGroup?: boolean;
  isAi?: boolean;
  title?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  participantIds?: string[];
  participants?: User[];
};

const AI_USER_ID = "ai-assistant";
const AI_SESSION_ID = "ai-assistant-session";
const AI_MESSAGES_STORAGE_KEY = "ai-assistant-messages";

function createAiSession(currentUser?: User | null, messages: Message[] = []): Session {
  const lastMessage = messages.at(-1);

  return {
    id: AI_SESSION_ID,
    isAi: true,
    isGroup: false,
    title: "Chattie",
    lastMessage: lastMessage?.text ?? "Chat with AI anytime",
    lastMessageAt: lastMessage?.createdAt ?? new Date(0).toISOString(),
    participantIds: [currentUser?.id ?? "me", AI_USER_ID],
    participants: [
      ...(currentUser
        ? [
            {
              id: currentUser.id,
              name: currentUser.name ?? "You",
              picture: currentUser.picture ?? null,
              isOnline: true,
            },
          ]
        : []),
      {
        id: AI_USER_ID,
        name: "Chattie AI",
        picture: null,
        isOnline: true,
        isAI: true,
      },
    ],
  };
}

export default function ChatApp() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [inputValue, setInputValue] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [wsAlive, setWsAlive] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [sidebarWidth, setSidebarWidth] = useState(288);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [showProfilePanel, setShowProfilePanel] = useState(true);
  const [panelUserId, setPanelUserId] = useState<string | null>(null);
  const [profilePanelWidth, setProfilePanelWidth] = useState(300);
  const [isResizingProfile, setIsResizingProfile] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [aiIsResponding, setAiIsResponding] = useState(false);

  const SIDEBAR_MIN = 220;
  const SIDEBAR_MAX = 480;
  const SIDEBAR_COLLAPSED = 72;
  const PROFILE_PANEL_MIN = 260;
  const PROFILE_PANEL_MAX = 480;

  useEffect(() => {
    const w = Number(localStorage.getItem("sidebarWidth"));
    if (w) setSidebarWidth(Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, w)));
    if (localStorage.getItem("sidebarCollapsed") === "1") setSidebarCollapsed(true);

    const pw = Number(localStorage.getItem("profilePanelWidth"));
    if (pw) setProfilePanelWidth(Math.min(PROFILE_PANEL_MAX, Math.max(PROFILE_PANEL_MIN, pw)));

    const stored = localStorage.getItem("profilePanelHidden");
    if (stored === "1") {
      setShowProfilePanel(false);
    } else if (stored === null && typeof window !== "undefined") {
      // default: hide on mobile, show on desktop
      setShowProfilePanel(window.matchMedia("(min-width: 768px)").matches);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("profilePanelHidden", showProfilePanel ? "0" : "1");
  }, [showProfilePanel]);

  useEffect(() => {
    localStorage.setItem("profilePanelWidth", String(profilePanelWidth));
  }, [profilePanelWidth]);

  const handleShowProfile = (userId: string) => {
    setPanelUserId(userId);
    setShowProfilePanel(true);
  };

  useEffect(() => {
    localStorage.setItem("sidebarWidth", String(sidebarWidth));
  }, [sidebarWidth]);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", sidebarCollapsed ? "1" : "0");
  }, [sidebarCollapsed]);

  const startResize = (e: React.MouseEvent) => {
    if (sidebarCollapsed) return;
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMove = (ev: MouseEvent) => {
      const next = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, ev.clientX));
      setSidebarWidth(next);
    };
    const onUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const startProfileResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingProfile(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMove = (ev: MouseEvent) => {
      const next = Math.min(
        PROFILE_PANEL_MAX,
        Math.max(PROFILE_PANEL_MIN, window.innerWidth - ev.clientX)
      );
      setProfilePanelWidth(next);
    };
    const onUp = () => {
      setIsResizingProfile(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const wsRef = useRef<WebSocket | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const lastPongRef = useRef<number>(Date.now());
  const reconnectTimerRef = useRef<number | null>(null);
  const pingTimerRef = useRef<number | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const aiPendingRequestRef = useRef<string | null>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [inputValue]);


  const { data: session } = useSession();
  const aiMessages = messages[AI_SESSION_ID] ?? [];

  const aiSession = useMemo(
    () =>
      createAiSession(
        session?.user?.id
          ? {
              id: session.user.id,
              name: session.user.name ?? "You",
              picture: session.user.image ?? null,
              isOnline: true,
            }
          : null,
        aiMessages,
      ),
    [aiMessages, session?.user?.id, session?.user?.image, session?.user?.name],
  );

  const allSessions = useMemo(() => {
    const withoutAi = sessions.filter((item) => item.id !== AI_SESSION_ID);
    return [aiSession, ...withoutAi];
  }, [aiSession, sessions]);

  useEffect(() => {
    if (!selectedSessionId) {
      setPanelUserId(null);
      return;
    }
    const activeSession = allSessions.find((item) => item.id === selectedSessionId);
    if (!activeSession || activeSession.isGroup || activeSession.isAi) {
      setPanelUserId(null);
      return;
    }
    const otherId =
      activeSession.participants?.find((participant) => participant.id !== session?.user?.id)?.id ?? null;
    setPanelUserId(otherId);
  }, [allSessions, selectedSessionId, session?.user?.id]);

  /**
   * GET SESSIONS
   */
  useEffect(() => {
    fetch("/api/sessions", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setSessions(data);
        if (data.length && !selectedSessionId) {
          setSelectedSessionId(data[0].id);
        } else if (!data.length && !selectedSessionId) {
          setSelectedSessionId(AI_SESSION_ID);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(AI_MESSAGES_STORAGE_KEY);
      if (!raw) return;

      const stored = JSON.parse(raw);
      if (!Array.isArray(stored)) return;

      setMessages((prev) => ({
        ...prev,
        [AI_SESSION_ID]: stored,
      }));
    } catch (error) {
      console.error("Failed to load AI messages", error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      AI_MESSAGES_STORAGE_KEY,
      JSON.stringify(aiMessages),
    );
  }, [aiMessages]);

  /**
   * GET USERS
   */
  useEffect(() => {
    if (!session?.user?.id) return;

    fetch("/api/users", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then(setUsers)
      .catch(console.error);
  }, [session?.user?.id]);

  // Close mobile menu when clicking/touching outside the menu panel
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (!showMobileMenu) return;

      const target = e.target as Node;

      // ignore klik hamburger
      if (toggleRef.current?.contains(target)) return;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setShowMobileMenu(false);
      }
    }

    document.addEventListener("click", handleOutside);

    return () => {
      document.removeEventListener("click", handleOutside);
    };
  }, [showMobileMenu]);

  /**
   * GET MESSAGES
   */
  useEffect(() => {
    if (!selectedSessionId) return;
    if (selectedSessionId === AI_SESSION_ID) return;

    fetch(`/api/sessions/${selectedSessionId}/messages`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((msgs) =>
        setMessages((prev) => ({ ...prev, [selectedSessionId]: msgs }))
      )
      .catch(console.error);
  }, [selectedSessionId]);

  /**
   * WEBSOCKET CONNECT
   */
  useEffect(() => {
    if (!session?.user?.id) return;

    let mounted = true;

    const connect = () => {
      if (!mounted) return;

      const protocol = location.protocol === "https:" ? "wss" : "ws";
      const url = `${protocol}://${location.host}/api/ws`;

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsAlive(true);
        lastPongRef.current = Date.now();

        ws.send(JSON.stringify({ type: "auth", userId: session.user.id }));

        fetch("/api/users", { credentials: "include" })
          .then((r) => (r.ok ? r.json() : []))
          .then(setUsers)
          .catch(console.error);

        if (pingTimerRef.current) clearInterval(pingTimerRef.current);
        pingTimerRef.current = window.setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: "ping" }));

            if (Date.now() - lastPongRef.current > 60_000) {
              console.warn("⚠️ WS timeout, reconnecting...");
              wsRef.current.close();
            }
          }
        }, 20_000);
      };

      ws.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data);

          if (data.type === "pong") {
            lastPongRef.current = Date.now();
            setWsAlive(true);
            return;
          }

          if (data.type === "message") {
            const sid = data.sessionId;

            setMessages((prev) => {
              const list = prev[sid] ?? [];
              if (list.some((m) => m.id === data.message.id)) return prev;
              return { ...prev, [sid]: [...list, data.message] };
            });

            setSessions((prev) =>
              prev.map((s) =>
                s.id === sid
                  ? {
                      ...s,
                      lastMessage: data.message.text,
                      lastMessageAt: data.message.createdAt,
                    }
                  : s
              )
            );
          }

          if (data.type === "ai-start") {
            setAiIsResponding(true);
            aiPendingRequestRef.current = data.requestId;
            return;
          }

          if (data.type === "ai-chunk") {
            const requestId = data.requestId as string;
            const chunk = typeof data.chunk === "string" ? data.chunk : "";
            if (!requestId || !chunk) return;

            setMessages((prev) => ({
              ...prev,
              [AI_SESSION_ID]: (prev[AI_SESSION_ID] ?? []).map((message) =>
                message.id === requestId
                  ? { ...message, text: `${message.text}${chunk}` }
                  : message,
              ),
            }));
            return;
          }

          if (data.type === "ai-end") {
            if (aiPendingRequestRef.current === data.requestId) {
              aiPendingRequestRef.current = null;
              setAiIsResponding(false);
            }
            return;
          }

          if (data.type === "ai-error") {
            const requestId = data.requestId as string;
            const errorText =
              typeof data.error === "string"
                ? data.error
                : "AI sedang belum bisa membalas. Coba lagi sebentar ya.";

            setMessages((prev) => ({
              ...prev,
              [AI_SESSION_ID]: (prev[AI_SESSION_ID] ?? []).map((message) =>
                message.id === requestId
                  ? { ...message, text: errorText }
                  : message,
              ),
            }));

            if (aiPendingRequestRef.current === requestId) {
              aiPendingRequestRef.current = null;
              setAiIsResponding(false);
            }
            return;
          }

          if (data.type === "presence") {
            setUsers((prev) => {
              const updated = prev.map((u) =>
                u.id === data.userId ? { ...u, isOnline: data.online } : u
              );
              return updated;
            });
            // Update sessions participants
            setSessions((prev) =>
              prev.map((s) => ({
                ...s,
                participants: s.participants?.map((p) =>
                  p.id === data.userId ? { ...p, isOnline: data.online } : p
                ),
              }))
            );
          }

          if (data.type === "typing") {
            if (data.userId === session?.user?.id) return;
            setTypingUsers((prev) => new Set(prev).add(data.userId));
          }

          if (data.type === "stop-typing") {
            setTypingUsers((prev) => {
              const newSet = new Set(prev);
              newSet.delete(data.userId);
              return newSet;
            });
          }

          if (data.type === "session-changed") {
            const incoming: Session = data.session;
            const me = session?.user?.id;
            const stillMember = me
              ? (incoming.participantIds ?? []).includes(me)
              : false;

            if (!stillMember) {
              // I was removed from this group — drop it locally
              setSessions((prev) => prev.filter((s) => s.id !== incoming.id));
              setMessages((prev) => {
                const next = { ...prev };
                delete next[incoming.id];
                return next;
              });
              setSelectedSessionId((curr) =>
                curr === incoming.id ? null : curr,
              );
              return;
            }

            setSessions((prev) => {
              const exists = prev.find((s) => s.id === incoming.id);
              if (exists) {
                return prev.map((s) =>
                  s.id === incoming.id ? { ...s, ...incoming } : s,
                );
              }
              return [incoming, ...prev];
            });
          }
        } catch (e) {
          console.error("WS message error", e);
        }
      };

      ws.onclose = () => {
        setWsAlive(false);
        aiPendingRequestRef.current = null;
        setAiIsResponding(false);

        if (reconnectTimerRef.current)
          clearTimeout(reconnectTimerRef.current);

        reconnectTimerRef.current = window.setTimeout(connect, 2000);
      };

      ws.onerror = (err) => {
        console.error("WS error", err);
        ws.close();
      };
    };

    connect();

    return () => {
      mounted = false;
      wsRef.current?.close();
      if (pingTimerRef.current) clearInterval(pingTimerRef.current);
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };
  }, [session?.user?.id]);

  /**
   * START CHAT
   */
  const startChat = async (userId: string) => {
    const res = await fetch("/api/sessions/start", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || "Failed to start session");
    }

    const newSession: Session = await res.json();

    // ensure we have participant data; fetch detail if needed
    let enriched = newSession as Session & { participants?: any };
    if (!enriched.participants || enriched.participants.length === 0) {
      const r2 = await fetch(`/api/sessions/${newSession.id}`, { credentials: 'include' });
      if (r2.ok) {
        const full = await r2.json();
        enriched = { ...enriched, participants: full.participants };
      }
    }

    setSessions((prev) => {
      // if session already exists, replace it with enriched version
      const exists = prev.find((s) => s.id === enriched.id);
      if (exists) {
        return prev.map((s) => (s.id === enriched.id ? enriched : s));
      }
      return [enriched, ...prev];
    });

    setSelectedSessionId(enriched.id);
    // close mobile menu after starting chat
    setShowMobileMenu(false);

    return enriched;
  };

  const notifySessionChanged = (sessionId: string, removedUserIds?: string[]) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "session-changed",
          sessionId,
          ...(removedUserIds?.length ? { removedUserIds } : {}),
        }),
      );
    }
  };

  /**
   * CREATE GROUP
   */
  const createGroup = async (title: string, userIds: string[]) => {
    const res = await fetch("/api/sessions/group", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, userIds }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || "Failed to create group");
    }

    const newSession: Session = await res.json();

    setSessions((prev) => {
      const exists = prev.find((s) => s.id === newSession.id);
      if (exists) {
        return prev.map((s) => (s.id === newSession.id ? newSession : s));
      }
      return [newSession, ...prev];
    });

    setSelectedSessionId(newSession.id);
    setShowMobileMenu(false);
    notifySessionChanged(newSession.id);
  };

  /**
   * JOIN GROUP (auto-add current user to a discoverable group)
   */
  const joinGroup = async (sessionId: string) => {
    const res = await fetch(`/api/sessions/${sessionId}/join`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || "Failed to join group");
    }
    const joined: Session = await res.json();
    setSessions((prev) => {
      const exists = prev.find((s) => s.id === joined.id);
      if (exists) {
        return prev.map((s) => (s.id === joined.id ? { ...s, ...joined } : s));
      }
      return [joined, ...prev];
    });
    setSelectedSessionId(joined.id);
    setShowMobileMenu(false);
    notifySessionChanged(joined.id);
  };

  /**
   * UPDATE GROUP (title / add / remove members)
   */
  const updateGroup = async (
    sessionId: string,
    patch: { title?: string; addUserIds?: string[]; removeUserIds?: string[] },
  ) => {
    const res = await fetch(`/api/sessions/${sessionId}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || "Failed to update group");
    }

    const updated: Session = await res.json();
    setSessions((prev) =>
      prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)),
    );
    notifySessionChanged(updated.id, patch.removeUserIds);
  };

  /**
   * SEND MESSAGE
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedSessionId) return;
    const trimmed = inputValue.trim();

    if (selectedSessionId === AI_SESSION_ID) {
      if (!session?.user?.id || aiIsResponding) return;
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        setMessages((prev) => ({
          ...prev,
          [AI_SESSION_ID]: [
            ...(prev[AI_SESSION_ID] ?? []),
            {
              id: `ai-local-error-${Date.now()}`,
              sessionId: AI_SESSION_ID,
              text: "Koneksi WebSocket belum siap. Coba lagi sebentar ya.",
              senderId: AI_USER_ID,
              createdAt: new Date().toISOString(),
            },
          ],
        }));
        return;
      }

      const userMessage: Message = {
        id: `ai-user-${Date.now()}`,
        sessionId: AI_SESSION_ID,
        text: trimmed,
        senderId: session.user.id,
        createdAt: new Date().toISOString(),
      };

      const assistantMessageId = `ai-assistant-${Date.now() + 1}`;
      const assistantPlaceholder: Message = {
        id: assistantMessageId,
        sessionId: AI_SESSION_ID,
        text: "",
        senderId: AI_USER_ID,
        createdAt: new Date().toISOString(),
      };

      const history = [...aiMessages, userMessage];

      setMessages((prev) => ({
        ...prev,
        [AI_SESSION_ID]: [...history, assistantPlaceholder],
      }));
      setInputValue("");
      setAiIsResponding(true);
      aiPendingRequestRef.current = assistantMessageId;

      wsRef.current.send(
        JSON.stringify({
          type: "ai-message",
          requestId: assistantMessageId,
          messages: history.map((message) => ({
            role: message.senderId === session.user.id ? "user" : "assistant",
            content: message.text,
          })),
        }),
      );

      return;
    }

    const payload = {
      type: "message",
      sessionId: selectedSessionId,
      text: trimmed,
      userId: session?.user?.id,
    };

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    } else {
        await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: selectedSessionId,
            text: trimmed,
            userId: session?.user?.id,
          }),
        });
    }

    setInputValue("");
  };

  return (
    <MyProfileProvider>
    <div className="h-screen flex bg-background overflow-hidden">
      <button
        ref={toggleRef}
        className="md:hidden fixed cursor-pointer top-6 left-4 z-40"
        onClick={() => setShowMobileMenu((v) => !v)}
      >
        {showMobileMenu ? <X /> : <Menu />}
      </button>

      {showMobileMenu && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
          onClick={() => setShowMobileMenu(false)}
          aria-hidden="true"
        />
      )}

      <div
        ref={menuRef}
        style={{ width: sidebarCollapsed ? SIDEBAR_COLLAPSED : sidebarWidth }}
        className={`shrink-0 border-r bg-card/90 backdrop-blur-md max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-50 max-md:max-w-[85vw] md:relative md:translate-x-0 md:opacity-100 ${isResizing ? "" : "transition-[transform,opacity,width] duration-300"}
          ${showMobileMenu
            ? "max-md:translate-x-0 max-md:opacity-100"
            : "max-md:-translate-x-full max-md:opacity-0"
          }
        `}
      >
        {showMobileMenu && (
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b">
            <span className="font-semibold text-sm">Messages</span>

            <button
              onClick={() => setShowMobileMenu(false)}
              className="p-2 rounded-md hover:bg-muted"
              aria-label="Close menu"
            >
              <X />
            </button>
          </div>
        )}
        <UserList
          sessions={allSessions}
          users={users}
          selectedSessionId={selectedSessionId}
          onSelectSession={(id) => {
            setSelectedSessionId(id);
            setShowMobileMenu(false);
          }}
          currentUserId={session?.user?.id}
          collapsed={sidebarCollapsed}
          onOpenNewChat={() => setShowNewChat(true)}
        />

        <div
          onMouseDown={startResize}
          className={`hidden md:block absolute top-0 -right-1 h-full w-2 ${sidebarCollapsed ? "" : "cursor-col-resize"} group`}
        >
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 h-full w-px ${sidebarCollapsed ? "" : "group-hover:bg-primary/50"} transition-colors`}
          />
          <button
            type="button"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setSidebarCollapsed((v) => !v)}
            className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 w-5 h-5 rounded-full bg-card border border-border shadow-sm flex items-center justify-center cursor-pointer hover:bg-muted hover:border-primary/40 transition"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={sidebarCollapsed ? "Expand" : "Collapse"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronLeft className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">

        {selectedSessionId ? (
          <>
            <ChatWindow
              sessionId={selectedSessionId}
              messages={messages[selectedSessionId] ?? []}
              sessions={allSessions}
              currentUserId={session?.user?.id ?? ""}
              typingUsers={Array.from(typingUsers)}
              users={users}
              onShowProfile={handleShowProfile}
              onShowGroupInfo={() => setShowProfilePanel(true)}
            />

            <div className="p-4 border-t flex gap-3 items-end sticky bottom-0 bg-background/80 backdrop-blur-sm">
              <textarea
                ref={inputRef}
                value={inputValue}
                rows={1}
                onChange={(e) => setInputValue(e.target.value)}
                onInput={() => {
                  if (
                    selectedSessionId !== AI_SESSION_ID &&
                    wsRef.current?.readyState === WebSocket.OPEN &&
                    selectedSessionId
                  ) {
                    wsRef.current.send(JSON.stringify({
                      type: "typing",
                      sessionId: selectedSessionId,
                      userId: session?.user?.id,
                    }));
                    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

                    typingTimeoutRef.current = window.setTimeout(() => {
                      if (wsRef.current?.readyState === WebSocket.OPEN && selectedSessionId) {
                        wsRef.current.send(JSON.stringify({
                          type: "stop-typing",
                          sessionId: selectedSessionId,
                          userId: session?.user?.id,
                        }));
                      }
                    }, 2000);
                  }
                }}
                className="flex-1 resize-none border border-border bg-input rounded-lg px-4 py-3 text-sm leading-5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition max-h-40 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                placeholder={selectedSessionId === AI_SESSION_ID ? "Ask Chattie AI anything..." : "Type your message..."}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={selectedSessionId === AI_SESSION_ID && aiIsResponding}
                className="bg-primary hover:bg-accent disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200 flex items-center justify-center shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-3">
            <div className="text-5xl mb-2">💬</div>
            <p className="text-lg font-semibold">Start a conversation</p>
            <p className="text-sm max-w-xs text-center">Select a user from the left or click the + button to begin chatting</p>
          </div>
        )}
      </div>

      {showProfilePanel && (() => {
        const activeSession = selectedSessionId
          ? allSessions.find((s) => s.id === selectedSessionId)
          : undefined;

        if (activeSession?.isGroup) {
          return (
            <>
              <div
                className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
                onClick={() => setShowProfilePanel(false)}
                aria-hidden="true"
              />
              <GroupInfoPanel
                sessionId={activeSession.id}
                session={activeSession}
                currentUserId={session?.user?.id}
                allUsers={users}
                onClose={() => setShowProfilePanel(false)}
                onUpdate={updateGroup}
                width={profilePanelWidth}
                onResizeStart={startProfileResize}
                isResizing={isResizingProfile}
              />
            </>
          );
        }

        if (panelUserId) {
          return (
            <>
              <div
                className="md:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
                onClick={() => setShowProfilePanel(false)}
                aria-hidden="true"
              />
              <ProfilePanel
                userId={panelUserId}
                isSelf={panelUserId === session?.user?.id}
                onClose={() => setShowProfilePanel(false)}
                width={profilePanelWidth}
                onResizeStart={startProfileResize}
                isResizing={isResizingProfile}
              />
            </>
          );
        }

        return null;
      })()}

      {showNewChat && (
        <NewChatModal
          users={users}
          onClose={() => setShowNewChat(false)}
          onStartChat={async (userId) => {
            await startChat(userId);
          }}
          onJoinGroup={async (groupId) => {
            await joinGroup(groupId);
          }}
          onOpenCreateGroup={() => {
            setShowNewChat(false);
            setShowCreateGroup(true);
          }}
        />
      )}

      {showCreateGroup && (
        <CreateGroupModal
          users={users}
          onClose={() => setShowCreateGroup(false)}
          onCreate={async (title, userIds) => {
            await createGroup(title, userIds);
          }}
        />
      )}
    </div>
    </MyProfileProvider>
  );
}
