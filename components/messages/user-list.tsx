"use client";

import { useState, useMemo } from "react";
import { Search, Plus, X } from "lucide-react";

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
          className="fixed bottom-5 left-5 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition cursor-pointer"
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
      {/* Modal-based user picker for mobile/desktop */}
      {showUsers && !collapsed && (
        <div className="fixed w-[100vw] inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowUsers(false)}
          />

          <div className="relative w-[min(640px,95%)] bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-sm font-semibold">Start new chat</h3>
              <button
                className="p-1 rounded cursor-pointer hover:bg-accent"
                onClick={() => setShowUsers(false)}
                aria-label="Close"
              >
                <X />
              </button>
            </div>

            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={modalQuery}
                  onChange={(e) => setModalQuery(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-input border rounded-md"
                />
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {users.filter(u => (u.name ?? '').toLowerCase().includes(modalQuery.toLowerCase().trim())).length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">No users found</p>
              ) : (
                users
                  .filter((u) => (u.name ?? "").toLowerCase().includes(modalQuery.toLowerCase().trim()))
                  .map((user) => (
                    <div key={user.id} className="flex items-center justify-between px-4 py-3 hover:bg-sidebar-accent">
                      <div className="flex items-center gap-3">
                        <img src={user.picture ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name ?? 'User')}`} alt={user.name ?? 'User'} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <div className="font-semibold text-sm">{user.name ?? 'Unknown'}</div>
                          <div className="text-xs text-muted-foreground">{user.isOnline ? 'Online' : 'Offline'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-muted-foreground'}`} />
                        <button
                          className="text-sm cursor-pointer hover:bg-green-600 bg-primary text-primary-foreground px-3 py-1 rounded"
                          onClick={async () => {
                            try {
                              await onStartChat(user.id);
                              setShowUsers(false);
                            } catch (err) {
                              console.error('Start chat error', err);
                              alert('Gagal memulai chat. Cek console untuk detail.');
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

      {/* SESSION LIST */}
      <div className="flex-1 overflow-y-auto">
        {filteredSessions.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground text-center">
            No conversations yet
          </div>
        ) : (
          filteredSessions.map((session) => {
            const active = selectedSessionId === session.id;

            // pick the other participant for one-to-one chats
            const other = session.isGroup
              ? null
              : session.participants?.find((p) => p.id !== currentUserId) ?? session.participants?.[0];

            const displayName = session.isGroup
              ? session.title ?? "Group Chat"
              : other?.name ?? "Unknown User";

            const avatar = session.isGroup
              ? "👥"
              : other?.name?.[0]?.toUpperCase() ?? "?";

            const online = !session.isGroup && !!other?.isOnline;

            return (
              <button
                key={session.id}
                onClick={() => {
                  console.log(session.id)
                  
                  onSelectSession(
                  session.id
                )}}
                className={`w-full z-[999] px-4 py-3 justify-start flex items-center gap-3 border-b border-sidebar-border cursor-pointer
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
