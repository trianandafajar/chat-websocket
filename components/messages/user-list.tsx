"use client";

import { useState, useMemo } from "react";
import { Inbox, Search, Plus, X, Users } from "lucide-react";
import { Avatar } from "./avatar";

interface Participant {
  id: string;
  name?: string | null;
  picture?: string | null;
  isOnline?: boolean;
}

type Session = {
  id: string;
  isGroup?: boolean;
  title?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  participants?: Participant[];
};

interface User {
  id: string;
  name?: string | null;
  picture?: string | null;
  isOnline?: boolean;
}

interface UserListProps {
  sessions: Session[];
  users: User[];
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onStartChat: (userId: string) => void;
  collapsed?: boolean;
  currentUserId?: string | null;
}

export function UserList({
  sessions,
  users,
  selectedSessionId,
  onSelectSession,
  onStartChat,
  collapsed,
  currentUserId,
}: UserListProps) {
  const [search, setSearch] = useState("");
  const [showUsers, setShowUsers] = useState(false);
  const [modalQuery, setModalQuery] = useState("");

  const filteredSessions = useMemo(() => {
    const q = search.toLowerCase().trim();

    const matched = q
      ? sessions.filter((s) => {
          const title = s.title?.toLowerCase() ?? "";
          const lastMessage = s.lastMessage?.toLowerCase() ?? "";
          const participantNames =
            s.participants?.map((p) => p.name?.toLowerCase()).join(" ") ?? "";

          return (
            title.includes(q) ||
            lastMessage.includes(q) ||
            participantNames.includes(q)
          );
        })
      : sessions;

    // Sort: sessions with messages first (newest -> oldest), then no-message sessions.
    return [...matched].sort((a, b) => {
      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [search, sessions]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-card">
      {/* New Chat Button */}
      {!collapsed && (
        <button
          onClick={() => setShowUsers(!showUsers)}
          className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-primary hover:bg-accent text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition cursor-pointer duration-200"
          aria-label="New Chat"
          title="Start new chat"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Header */}
      {!collapsed && (
        <div className="p-[calc(var(--spacing)*4.3)] border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
        </div>
      )}

      {/* USER PICKER MODAL */}
      {showUsers && !collapsed && (
        <div className="fixed w-[100vw] inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-[min(500px,95vw)] bg-white rounded-2xl shadow-2xl overflow-hidden border border-border">
            {/* Modal Header */}
            <div className="flex gap-2 items-center justify-between p-4 border-b">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={modalQuery}
                  onChange={(e) => setModalQuery(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                />
              </div>
              <button
                className="p-2 rounded-lg cursor-pointer hover:bg-muted transition"
                onClick={() => setShowUsers(false)}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>


            <div className="flex items-center justify-between px-4 pt-4 pb-2">
              <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Recommendations
              </h2>
              <span className="text-[11px] font-medium text-muted-foreground/70">
                {
                  users.filter((u) =>
                    (u.name ?? "")
                      .toLowerCase()
                      .includes(modalQuery.toLowerCase().trim()),
                  ).length
                }
              </span>
            </div>

            {/* User List */}
            <div className="max-h-[60vh] min-h-[60vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
              {users.filter((u) =>
                (u.name ?? "")
                  .toLowerCase()
                  .includes(modalQuery.toLowerCase().trim()),
              ).length === 0 ? (
                <p className="p-8 text-sm text-muted-foreground text-center">
                  No users found
                </p>
              ) : (
                users
                  .filter((u) =>
                    (u.name ?? "")
                      .toLowerCase()
                      .includes(modalQuery.toLowerCase().trim()),
                  )
                  .map((user) => (
                    <div
                      key={user.id}
                      className="w-full flex items-center justify-between px-4 py-4 text-left border-b border-border/30 transition"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0 text-left">
                        <Avatar
                          name={user.name}
                          picture={user.picture}
                          size={40}
                        />
                        <div className="min-w-0 text-left">
                          <div className="font-medium text-sm text-foreground truncate">
                            {user.name ?? "Unknown"}
                          </div>
                          <div
                            className={`text-xs ${user.isOnline ? "text-green-600" : "text-muted-foreground"}`}
                          >
                            {user.isOnline ? "● Online" : "Offline"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 ml-3">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${user.isOnline ? "bg-green-500" : "bg-muted-foreground"}`}
                        />
                        <button
                          className="text-sm font-medium cursor-pointer hover:bg-primary/90 bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg transition"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await onStartChat(user.id);
                              setShowUsers(false);
                            } catch (err) {
                              console.error("Start chat error", err);
                              alert("Failed to start chat.");
                            }
                          }}
                        >
                          Chat
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SESSIONS LIST */}
      <div className="flex-1 overflow-y-auto max-h-[calc(100vh-6rem)] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
        {filteredSessions.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground text-center">
            <Inbox className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
            <p className="font-medium">No conversations yet</p>
            <p className="text-xs mt-1">Click the + button to start chatting</p>
          </div>
        ) : (
          filteredSessions.map((session) => {
            const active = selectedSessionId === session.id;

            // pick the other participant for one-to-one chats
            const other = session.isGroup
              ? null
              : (session.participants?.find((p) => p.id !== currentUserId) ??
                session.participants?.[0]);

            const displayName = session.isGroup
              ? (session.title ?? "Group Chat")
              : (other?.name ?? "Unknown User");

            const timeStr = session.lastMessageAt
              ? new Date(session.lastMessageAt).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            return (
              <div
                key={session.id}
                className={`w-full px-4 py-3 flex items-center gap-3 border-b border-border/30 transition-colors duration-150
                  ${
                    active
                      ? "bg-primary/10 border-border/10"
                      : "hover:bg-muted/40"
                  }
                `}
              >
                {/* Avatar - opens conversation (profile shows in right panel) */}
                {!session.isGroup && other ? (
                  <button
                    onClick={() => onSelectSession(session.id)}
                    className="rounded-full shrink-0 cursor-pointer hover:ring-2 hover:ring-primary/40 transition"
                    aria-label="Open conversation"
                  >
                    <Avatar
                      name={other.name}
                      picture={other.picture}
                      size={40}
                    />
                  </button>
                ) : (
                  <div
                    aria-hidden="true"
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-muted text-foreground border border-border shrink-0"
                  >
                    <Users className="w-4 h-4" />
                  </div>
                )}

                {/* Body - opens conversation */}
                {!collapsed && (
                  <button
                    onClick={() => onSelectSession(session.id)}
                    className="flex-1 min-w-0 text-left cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p
                        className={`font-medium text-sm truncate ${active ? "text-foreground font-semibold" : "text-foreground"}`}
                      >
                        {displayName}
                      </p>
                      {timeStr && (
                        <span className="text-xs text-muted-foreground shrink-0">
                          {timeStr}
                        </span>
                      )}
                    </div>
                    <p className="text-xs truncate text-muted-foreground">
                      {session.lastMessage ?? "No messages yet"}
                    </p>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
