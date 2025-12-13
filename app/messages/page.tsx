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
  pending?: boolean;
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
  const { data: session } = useSession();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [inputValue, setInputValue] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [wsAlive, setWsAlive] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const lastPongRef = useRef(Date.now());
  const reconnectTimerRef = useRef<number | null>(null);
  const pingTimerRef = useRef<number | null>(null);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    fetch("/api/sessions", { credentials: "include" })
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (!data) return;
        setSessions(data);
        if (!selectedSessionId && data.length) {
          setSelectedSessionId(data[0].id);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/api/users", { credentials: "include" })
      .then((r) => r.ok && r.json())
      .then((data) => data && setUsers(data))
      .catch(console.error);
  }, []);

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

  /* ================= WEBSOCKET ================= */

  useEffect(() => {
    if (!session?.user?.id) return;

    let mounted = true;

    const connect = () => {
      if (!mounted) return;

      const protocol = location.protocol === "https:" ? "wss" : "ws";
      const ws = new WebSocket(`${protocol}://${location.host}/api/ws`);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsAlive(true);
        lastPongRef.current = Date.now();

        ws.send(
          JSON.stringify({
            type: "auth",
            userId: session.user.id,
          })
        );


        if (pingTimerRef.current) clearInterval(pingTimerRef.current);
        pingTimerRef.current = window.setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
            if (Date.now() - lastPongRef.current > 60_000) ws.close();
          }
        }, 20_000);
      };

      ws.onmessage = (evt) => {
        const data = JSON.parse(evt.data);

        if (data.type === "pong") {
          lastPongRef.current = Date.now();
          return;
        }

        if (data.type === "message") {
          const sid = data.sessionId;

          setMessages((prev) => {
            const list = prev[sid] ?? [];
            if (list.some((m) => m.id === data.message.id)) return prev;

            return {
              ...prev,
              [sid]: [...list.filter((m) => !m.pending), data.message],
            };
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
      };

      ws.onclose = () => {
        setWsAlive(false);
        reconnectTimerRef.current = window.setTimeout(connect, 2000);
      };

      ws.onerror = () => ws.close();
    };

    connect();

    return () => {
      mounted = false;
      wsRef.current?.close();
      if (pingTimerRef.current) clearInterval(pingTimerRef.current);
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };
  }, [session?.user?.id]);

  /* ================= ACTIONS ================= */

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
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedSessionId) return;

    const tempId = crypto.randomUUID();
    const text = inputValue.trim();

    // optimistic UI
    setMessages((prev) => ({
      ...prev,
      [selectedSessionId]: [
        ...(prev[selectedSessionId] ?? []),
        {
          id: tempId,
          sessionId: selectedSessionId,
          text,
          senderId: session?.user?.id,
          createdAt: new Date().toISOString(),
          pending: true,
        },
      ],
    }));

    wsRef.current?.send(
      JSON.stringify({
        type: "message",
        sessionId: selectedSessionId,
        text,
      })
    );

    setInputValue("");
  };

  /* ================= UI ================= */

  return (
    <div className="h-screen flex bg-background">
      <button
        className="md:hidden fixed top-3 left-4 z-50"
        onClick={() => setShowMobileMenu((v) => !v)}
      >
        {showMobileMenu ? <X /> : <Menu />}
      </button>

      <div className={`w-72 border-r ${showMobileMenu ? "block" : "hidden md:block"}`}>
        <UserList
          sessions={sessions}
          users={users}
          selectedSessionId={selectedSessionId}
          onSelectSession={setSelectedSessionId}
          onStartChat={startChat}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-2 text-xs">
          WebSocket:{" "}
          <span className={wsAlive ? "text-green-500" : "text-red-500"}>
            {wsAlive ? "connected" : "disconnected"}
          </span>
        </div>

        {selectedSessionId ? (
          <>
            <ChatWindow
              sessionId={selectedSessionId}
              messages={messages[selectedSessionId] ?? []}
              sessions={sessions}
              currentUserId={session?.user?.id}
            />

            <div className="p-4 border-t flex gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 border rounded px-3 py-2"
                placeholder="Type message..."
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="bg-primary text-white px-4 rounded"
              >
                <Send size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            Pilih user untuk mulai chat
          </div>
        )}
      </div>
    </div>
  );
}
