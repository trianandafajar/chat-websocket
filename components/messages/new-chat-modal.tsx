"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Users, X } from "lucide-react";
import { Avatar } from "./avatar";

interface UserItem {
  id: string;
  name?: string | null;
  picture?: string | null;
  isOnline?: boolean;
}

interface GroupItem {
  id: string;
  title?: string | null;
  participants?: UserItem[];
}

interface NewChatModalProps {
  users: UserItem[];
  onClose: () => void;
  onStartChat: (userId: string) => Promise<void> | void;
  onJoinGroup: (sessionId: string) => Promise<void> | void;
  onOpenCreateGroup: () => void;
}

export function NewChatModal({
  users,
  onClose,
  onStartChat,
  onJoinGroup,
  onOpenCreateGroup,
}: NewChatModalProps) {
  const [tab, setTab] = useState<"direct" | "group">("direct");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  useEffect(() => {
    if (tab !== "group") return;
    setLoadingGroups(true);
    fetch("/api/sessions/discover", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: GroupItem[]) => setGroups(Array.isArray(data) ? data : []))
      .catch(() => setGroups([]))
      .finally(() => setLoadingGroups(false));
  }, [tab]);

  const filteredUsers = useMemo(() => {
    const q = query.toLowerCase().trim();
    return users.filter((u) =>
      q ? (u.name ?? "").toLowerCase().includes(q) : true,
    );
  }, [users, query]);

  const filteredGroups = useMemo(() => {
    const q = query.toLowerCase().trim();
    return groups.filter((g) => {
      if (!q) return true;
      const title = (g.title ?? "").toLowerCase();
      const memberNames = (g.participants ?? [])
        .map((p) => (p.name ?? "").toLowerCase())
        .join(" ");
      return title.includes(q) || memberNames.includes(q);
    });
  }, [groups, query]);

  const handleStartChat = async (userId: string) => {
    setBusyId(userId);
    try {
      await onStartChat(userId);
      onClose();
    } catch (err) {
      console.error("Start chat error", err);
      alert("Failed to start chat.");
    } finally {
      setBusyId(null);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    setBusyId(groupId);
    try {
      await onJoinGroup(groupId);
      onClose();
    } catch (err) {
      console.error("Join group error", err);
      alert("Failed to join group.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-[min(500px,95vw)] bg-white rounded-2xl shadow-2xl overflow-hidden border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-4 pt-4">
          <div className="inline-flex rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => setTab("direct")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                tab === "direct"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Direct
            </button>
            <button
              type="button"
              onClick={() => setTab("group")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer inline-flex items-center gap-1.5 ${
                tab === "group"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Groups
            </button>
          </div>
          <button
            className="p-2 rounded-lg cursor-pointer hover:bg-muted transition"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 pb-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tab === "group" ? "Search groups..." : "Search users..."}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
        </div>

        {tab === "group" && (
          <div className="px-4 pb-2">
            <button
              type="button"
              onClick={onOpenCreateGroup}
              className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-primary/50 text-primary text-sm font-semibold hover:bg-primary/5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create new group
            </button>
          </div>
        )}

        <div className="flex items-center justify-between px-4 pb-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {tab === "group" ? "Recommendations" : "People"}
          </h2>
          <span className="text-[11px] font-medium text-muted-foreground/70">
            {tab === "group" ? filteredGroups.length : filteredUsers.length}
          </span>
        </div>

        {/* List */}
        <div className="max-h-[55vh] min-h-[40vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
          {tab === "direct" ? (
            filteredUsers.length === 0 ? (
              <p className="p-8 text-sm text-muted-foreground text-center">
                No users found
              </p>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="w-full flex items-center justify-between px-4 py-3 text-left border-b border-border/30"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar name={user.name} picture={user.picture} size={40} />
                    <div className="min-w-0">
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
                  <button
                    className="text-sm font-medium cursor-pointer hover:bg-primary/90 bg-primary text-primary-foreground px-3.5 py-1.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={busyId === user.id}
                    onClick={() => handleStartChat(user.id)}
                  >
                    {busyId === user.id ? "..." : "Chat"}
                  </button>
                </div>
              ))
            )
          ) : loadingGroups ? (
            <p className="p-8 text-sm text-muted-foreground text-center">
              Loading groups...
            </p>
          ) : filteredGroups.length === 0 ? (
            <p className="p-8 text-sm text-muted-foreground text-center">
              No groups to join.
              <br />
              Create one to get started.
            </p>
          ) : (
            filteredGroups.map((group) => {
              const memberCount = group.participants?.length ?? 0;
              return (
                <button
                  key={group.id}
                  type="button"
                  disabled={busyId === group.id}
                  onClick={() => handleJoinGroup(group.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left border-b border-border/30 hover:bg-muted/40 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div
                    aria-hidden="true"
                    className="w-10 h-10 rounded-full bg-primary/15 ring-2 ring-primary/20 flex items-center justify-center text-primary shrink-0"
                  >
                    <Users className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {group.title ?? "Group Chat"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {memberCount} {memberCount === 1 ? "member" : "members"}
                      {group.participants && group.participants.length > 0
                        ? ` · ${group.participants
                            .slice(0, 3)
                            .map((p) => p.name)
                            .filter(Boolean)
                            .join(", ")}${memberCount > 3 ? "..." : ""}`
                        : ""}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-primary shrink-0">
                    {busyId === group.id ? "Joining..." : "Join"}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
