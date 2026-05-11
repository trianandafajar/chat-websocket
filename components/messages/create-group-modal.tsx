"use client";

import { useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";
import { Avatar } from "./avatar";

interface UserItem {
  id: string;
  name?: string | null;
  picture?: string | null;
  isOnline?: boolean;
}

interface CreateGroupModalProps {
  users: UserItem[];
  onClose: () => void;
  onCreate: (title: string, userIds: string[]) => Promise<void> | void;
}

export function CreateGroupModal({
  users,
  onClose,
  onCreate,
}: CreateGroupModalProps) {
  const [title, setTitle] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);

  const filteredUsers = useMemo(() => {
    const q = query.toLowerCase().trim();
    return users.filter((u) =>
      q ? (u.name ?? "").toLowerCase().includes(q) : true,
    );
  }, [users, query]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const canSubmit = title.trim().length > 0 && selected.size >= 2 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await onCreate(title.trim(), Array.from(selected));
      onClose();
    } catch (err) {
      console.error("Create group error", err);
      alert("Failed to create group.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-[min(500px,95vw)] bg-white rounded-2xl shadow-2xl overflow-hidden border border-border flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            Create new group
          </h2>
          <button
            className="p-2 rounded-lg cursor-pointer hover:bg-muted transition"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Group title */}
        <div className="px-4 pt-4">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Group name
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Project Alpha"
            maxLength={60}
            autoFocus
            className="w-full px-3 py-2 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>

        {/* Search members */}
        <div className="px-4 pt-3 pb-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search members to add..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-4 pb-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Members{selected.size > 0 ? ` (${selected.size} selected)` : ""}
          </h3>
          <span className="text-[11px] font-medium text-muted-foreground/70">
            {filteredUsers.length}
          </span>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
          {filteredUsers.length === 0 ? (
            <p className="p-8 text-sm text-muted-foreground text-center">
              No users found
            </p>
          ) : (
            filteredUsers.map((user) => {
              const isSelected = selected.has(user.id);
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => toggle(user.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left border-b border-border/30 transition cursor-pointer ${
                    isSelected ? "bg-primary/10" : "hover:bg-muted/40"
                  }`}
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
                  <span
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition ${
                      isSelected
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border bg-white"
                    }`}
                    aria-hidden="true"
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            {selected.size < 2
              ? `Select at least ${2 - selected.size} more`
              : `${selected.size + 1} members (incl. you)`}
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? "Creating..." : "Create group"}
          </button>
        </div>
      </div>
    </div>
  );
}
