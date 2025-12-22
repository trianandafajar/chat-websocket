"use client";

import { useEffect, useRef, useState } from "react";
import { UserList } from "@/components/messages/user-list";
import { ChatWindow } from "@/components/messages/chat-window";
import { Send, Menu, X } from "lucide-react";
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
  participants?: {
    user: User;
  }[];
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

  const wsRef = useRef<WebSocket | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const lastPongRef = useRef<number>(Date.now());
  const reconnectTimerRef = useRef<number | null>(null);
  const pingTimerRef = useRef<number | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);

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
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (!showMobileMenu) return;
      const target = (e as MouseEvent).target as Node | null;
      if (menuRef.current && target && !menuRef.current.contains(target)) {
        setShowMobileMenu(false);
      }
    }

    document.addEventListener("click", handleOutside);
    document.addEventListener("touchstart", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
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
        console.log("❌ WS closed");
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

    if (!res.ok) return;

    const newSession: Session = await res.json();

    setSessions((prev) =>
      prev.some((s) => s.id === newSession.id)
        ? prev
        : [newSession, ...prev]
    );

    setSelectedSessionId(newSession.id);
    // close mobile menu after starting chat
    setShowMobileMenu(false);
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
    <div className="h-screen flex bg-background">
      <button
        className="md:hidden fixed top-3 left-4 z-40"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <X /> : <Menu />}
      </button>

      <div
        ref={menuRef}
        className={`w-72 border-r bg-card/90 backdrop-blur-md fixed md:relative top-0 h-full z-50 transition-all duration-300 ease-out md:translate-x-0 md:opacity-100
          ${showMobileMenu
            ? "translate-x-0 opacity-100 w-2xs"
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
            console.log('id', id);
            
            setShowMobileMenu(false);
          }}
          onStartChat={async (userId) => {
            await startChat(userId);
            setShowMobileMenu(false);
          }}
        />
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
            />

            <div className="p-4 border-t flex gap-2 sticky bottom-0 bg-background/80 backdrop-blur-sm">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onInput={() => {
                  if (wsRef.current?.readyState === WebSocket.OPEN && selectedSessionId) {
                    wsRef.current.send(JSON.stringify({
                      type: "typing",
                      sessionId: selectedSessionId,
                      userId: session?.user?.id,
                    }));
                    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

                    // Set timeout to stop typing
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
                className="flex-1 border rounded px-3 py-2"
                placeholder="Type message..."
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="bg-primary text-white px-4 rounded cursor-pointer"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Select User to Start Chating 
          </div>
        )}
      </div>
    </div>
  );
}
