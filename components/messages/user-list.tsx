"use client";

import { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";

interface Participant {
  id: string;
  name?: string | null;
  picture?: string | null;
  isOnline?: boolean;
}

interface SessionItem {
  id: string;
  title?: string | null;
  isGroup?: boolean;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  participants?: Participant[];
}

interface User {
  id: string;
  name?: string | null;
  picture?: string | null;
  isOnline?: boolean;
}

interface UserListProps {
  sessions: SessionItem[];
  users: User[];
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onStartChat: (userId: string) => void;
  collapsed?: boolean;
}

export function UserList({
  sessions,
  users,
  selectedSessionId,
  onSelectSession,
  onStartChat,
  collapsed,
}: UserListProps) {
  const [search, setSearch] = useState("");
  const [showUsers, setShowUsers] = useState(false);

  const filteredSessions = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return sessions;

    return sessions.filter((s) => {
      const title = s.title?.toLowerCase() ?? "";
      const lastMessage = s.lastMessage?.toLowerCase() ?? "";
      const participantNames =
        s.participants?.map((p) => p.name?.toLowerCase()).join(" ") ?? "";

      return (
        title.includes(q) ||
        lastMessage.includes(q) ||
        participantNames.includes(q)
      );
    });
  }, [search, sessions]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-sidebar">
      {/* Header */}
      {!collapsed && (
        <button
          onClick={() => setShowUsers(!showUsers)}
          className="fixed bottom-5 left-5 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition"
          aria-label="New Chat"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Search */}
      {!collapsed && (
        <div className="p-3 border-b border-sidebar-border bg-sidebar/60">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-input border border-sidebar-border rounded-md"
            />
          </div>
        </div>
      )}

      {/* USER PICKER */}
      {showUsers && !collapsed && (
        <div className="border-b border-sidebar-border">
          {users.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">
              No users available
            </p>
          ) : (
            users.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  onStartChat(user.id);
                  setShowUsers(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-sidebar-accent text-sm flex items-center justify-between"
              >
                <span>{user.name ?? "Unknown User"}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    user.isOnline ? "bg-green-500" : "bg-muted-foreground"
                  }`}
                />
              </button>
            ))
          )}
        </div>
      )}

      {/* SESSION LIST */}
      <div className="flex-1 overflow-y-auto">
        {filteredSessions.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground text-center">
            No conversations yet
          </div>
        ) : (
          filteredSessions.map((session) => {
            const active = selectedSessionId === session.id;

            const displayName = session.isGroup
              ? session.title ?? "Group Chat"
              : session.participants?.[0]?.name ?? "Unknown User";

            const avatar = session.isGroup
              ? "👥"
              : session.participants?.[0]?.name?.[0]?.toUpperCase() ?? "?";

            const online =
              !session.isGroup && session.participants?.[0]?.isOnline;

            return (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full px-4 py-3 justify-start flex items-center gap-3 border-b border-sidebar-border
                  ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-sidebar-accent"
                  }
                `}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center bg-card border">
                  {avatar}
                </div>

                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate text-start">
                      {displayName}
                    </p>
                    <p className="text-xs truncate opacity-70 text-start">
                      {session.lastMessage ?? "No messages yet"}
                    </p>
                  </div>
                )}

                {!session.isGroup && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      online ? "bg-green-500" : "bg-muted-foreground"
                    }`}
                  />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
