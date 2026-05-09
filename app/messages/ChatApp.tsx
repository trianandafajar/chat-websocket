"use client";

import { useEffect, useRef, useState } from "react";
import { UserList } from "@/components/messages/user-list";
import { ChatWindow } from "@/components/messages/chat-window";
import { ProfilePanel } from "@/components/messages/profile-panel";
import { MyProfileProvider } from "@/components/messages/my-profile-context";
import { Send, Menu, X, ChevronLeft, ChevronRight, UserCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";

type User = {
  id: string;
  name?: string | null;
  picture?: string | null;
  isOnline?: boolean;
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
  title?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  participants?: User[];
};

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

  const SIDEBAR_MIN = 220;
  const SIDEBAR_MAX = 480;
  const SIDEBAR_COLLAPSED = 72;

  useEffect(() => {
    const w = Number(localStorage.getItem("sidebarWidth"));
    if (w) setSidebarWidth(Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, w)));
    if (localStorage.getItem("sidebarCollapsed") === "1") setSidebarCollapsed(true);
    if (localStorage.getItem("profilePanelHidden") === "1") setShowProfilePanel(false);
  }, []);

  useEffect(() => {
    localStorage.setItem("profilePanelHidden", showProfilePanel ? "0" : "1");
  }, [showProfilePanel]);

  useEffect(() => {
    if (!selectedSessionId) {
      setPanelUserId(null);
      return;
    }
    const s = sessions.find((x) => x.id === selectedSessionId);
    if (!s || s.isGroup) {
      setPanelUserId(null);
      return;
    }
    const otherId =
      s.participants?.find((p) => p.id !== session?.user?.id)?.id ?? null;
    setPanelUserId(otherId);
  }, [selectedSessionId]);

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

  const wsRef = useRef<WebSocket | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const lastPongRef = useRef<number>(Date.now());
  const reconnectTimerRef = useRef<number | null>(null);
  const pingTimerRef = useRef<number | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [inputValue]);


  const { data: session } = useSession();

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
        }
      })
      .catch(console.error);
  }, []);

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
        console.log("✅ WS connected");
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
            console.log("ping");

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

          if (data.type === "presence") {
            console.log("👤 presence", data);
            setUsers((prev) => {
              const updated = prev.map((u) =>
                u.id === data.userId ? { ...u, isOnline: data.online } : u
              );
              console.log("Updated users:", updated);
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
        } catch (e) {
          console.error("WS message error", e);
        }
      };

      ws.onclose = () => {
        console.log("WS closed");
        setWsAlive(false);

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

  /**
   * SEND MESSAGE
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedSessionId) return;

    const payload = {
      type: "message",
      sessionId: selectedSessionId,
      text: inputValue.trim(),
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
          text: inputValue.trim(),
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

      <div
        ref={menuRef}
        style={{ width: sidebarCollapsed ? SIDEBAR_COLLAPSED : sidebarWidth }}
        className={`relative shrink-0 border-r bg-card/90 backdrop-blur-md fixed md:relative top-0 h-full z-50 ease-out md:translate-x-0 md:opacity-100 ${isResizing ? "" : "transition-[transform,opacity,width] duration-300"}
          ${showMobileMenu
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
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
          sessions={sessions}
          users={users}
          selectedSessionId={selectedSessionId}
          onSelectSession={(id) => {
            setSelectedSessionId(id);
            setShowMobileMenu(false);
          }}
          currentUserId={session?.user?.id}
          collapsed={sidebarCollapsed}
          onStartChat={async (userId) => {
            await startChat(userId);
            setShowMobileMenu(false);
          }}
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
              sessions={sessions}
              currentUserId={session?.user?.id}
              typingUsers={Array.from(typingUsers)}
              users={users}
              onShowProfile={handleShowProfile}
            />

            <div className="p-4 border-t flex gap-3 items-end sticky bottom-0 bg-background/80 backdrop-blur-sm">
              <textarea
                ref={inputRef}
                value={inputValue}
                rows={1}
                onChange={(e) => setInputValue(e.target.value)}
                onInput={() => {
                  if (wsRef.current?.readyState === WebSocket.OPEN && selectedSessionId) {
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
                placeholder="Type your message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                className="bg-primary hover:bg-accent text-primary-foreground px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200 flex items-center justify-center shrink-0"
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

      {showProfilePanel && panelUserId ? (
        <ProfilePanel
          userId={panelUserId}
          isSelf={panelUserId === session?.user?.id}
          onClose={() => setShowProfilePanel(false)}
        />
      ) : null}
    </div>
    </MyProfileProvider>
  );
}
