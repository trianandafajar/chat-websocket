"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Pencil, Plus, Search, UserMinus, Users, X } from "lucide-react";
import { Avatar } from "./avatar";

interface Member {
  id: string;
  name?: string | null;
  picture?: string | null;
  isOnline?: boolean;
}

interface Session {
  id: string;
  isGroup?: boolean;
  title?: string | null;
  participantIds?: string[];
  participants?: Member[];
}

interface GroupInfoPanelProps {
  sessionId: string | null;
  session: Session | undefined;
  currentUserId?: string | null;
  allUsers: Member[];
  onClose?: () => void;
  onUpdate: (
    sessionId: string,
    patch: { title?: string; addUserIds?: string[]; removeUserIds?: string[] },
  ) => Promise<void> | void;
  width?: number;
  onResizeStart?: (e: React.MouseEvent) => void;
  isResizing?: boolean;
}

export function GroupInfoPanel({
  sessionId,
  session,
  currentUserId,
  allUsers,
  onClose,
  onUpdate,
  width = 300,
  onResizeStart,
  isResizing,
}: GroupInfoPanelProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [savingTitle, setSavingTitle] = useState(false);

  const [adding, setAdding] = useState(false);
  const [addQuery, setAddQuery] = useState("");
  const [addSelected, setAddSelected] = useState<Set<string>>(new Set());
  const [savingAdd, setSavingAdd] = useState(false);

  const [removingId, setRemovingId] = useState<string | null>(null);

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditingTitle(false);
    setTitleDraft(session?.title ?? "");
    setAdding(false);
    setAddQuery("");
    setAddSelected(new Set());
  }, [sessionId, session?.title]);

  useEffect(() => {
    if (editingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [editingTitle]);

  const members = session?.participants ?? [];
  const memberIds = useMemo(
    () => new Set(members.map((m) => m.id)),
    [members],
  );
  const onlineCount = members.filter(
    (m) => m.id === currentUserId || m.isOnline,
  ).length;

  const candidates = useMemo(() => {
    const q = addQuery.toLowerCase().trim();
    return allUsers.filter((u) => {
      if (memberIds.has(u.id)) return false;
      if (u.id === currentUserId) return false;
      if (!q) return true;
      return (u.name ?? "").toLowerCase().includes(q);
    });
  }, [allUsers, addQuery, memberIds, currentUserId]);

  if (!sessionId || !session) return null;

  const handleSaveTitle = async () => {
    const next = titleDraft.trim();
    if (!next || next === (session.title ?? "") || savingTitle) {
      setEditingTitle(false);
      setTitleDraft(session.title ?? "");
      return;
    }
    setSavingTitle(true);
    try {
      await onUpdate(sessionId, { title: next });
      setEditingTitle(false);
    } catch (err) {
      console.error("Update title error", err);
      alert("Failed to update title.");
    } finally {
      setSavingTitle(false);
    }
  };

  const toggleAdd = (id: string) => {
    setAddSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConfirmAdd = async () => {
    if (addSelected.size === 0 || savingAdd) return;
    setSavingAdd(true);
    try {
      await onUpdate(sessionId, { addUserIds: Array.from(addSelected) });
      setAdding(false);
      setAddQuery("");
      setAddSelected(new Set());
    } catch (err) {
      console.error("Add members error", err);
      alert("Failed to add members.");
    } finally {
      setSavingAdd(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (id === currentUserId) return;
    if (members.length <= 3) {
      alert("Group needs at least 3 members.");
      return;
    }
    if (!confirm("Remove this member from the group?")) return;
    setRemovingId(id);
    try {
      await onUpdate(sessionId, { removeUserIds: [id] });
    } catch (err) {
      console.error("Remove member error", err);
      alert("Failed to remove member.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <aside
      style={{ width }}
      className={`shrink-0 border-l border-border bg-card flex flex-col max-md:fixed max-md:inset-y-0 max-md:right-0 max-md:z-50 max-md:w-[min(92vw,380px)]! max-md:shadow-2xl md:relative ${isResizing ? "" : "transition-[width] duration-300"}`}
    >
      <div
        onMouseDown={onResizeStart}
        className="hidden md:block absolute top-0 -left-1 h-full w-2 cursor-col-resize group z-10"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px group-hover:bg-primary/50 transition-colors" />
      </div>

      <div className="flex items-center justify-between px-4 py-4 md:py-6 border-b border-border bg-card sticky top-0 z-10">
        <h3 className="text-sm font-semibold text-foreground">Group Info</h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition cursor-pointer"
            aria-label="Hide group info"
            title="Hide"
          >
            <X className="w-5 h-5 md:w-4 md:h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="flex flex-col items-center px-6 py-8 border-b border-border bg-muted/30">
          <div className="w-24 h-24 rounded-full bg-primary/15 ring-4 ring-primary/20 flex items-center justify-center text-primary">
            <Users className="w-10 h-10" strokeWidth={1.75} />
          </div>

          {editingTitle ? (
            <div className="mt-3 w-full flex items-center gap-2">
              <input
                ref={titleInputRef}
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveTitle();
                  if (e.key === "Escape") {
                    setEditingTitle(false);
                    setTitleDraft(session.title ?? "");
                  }
                }}
                maxLength={60}
                className="flex-1 px-3 py-1.5 text-sm bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-center"
              />
              <button
                type="button"
                onClick={handleSaveTitle}
                disabled={savingTitle}
                className="p-1.5 rounded-md bg-primary text-primary-foreground hover:bg-accent transition disabled:opacity-50 cursor-pointer"
                aria-label="Save title"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setTitleDraft(session.title ?? "");
                setEditingTitle(true);
              }}
              className="mt-3 group inline-flex items-center gap-2 text-base font-semibold text-foreground hover:text-primary transition cursor-pointer"
              title="Edit title"
            >
              <span className="truncate max-w-[220px]">
                {session.title ?? "Group Chat"}
              </span>
              <Pencil className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
            </button>
          )}

          <p className="mt-0.5 text-xs text-muted-foreground">
            {members.length} members
            {onlineCount > 0 ? ` · ${onlineCount} online` : ""}
          </p>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
              Members
            </h4>
            {!adding && (
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            )}
          </div>

          {adding && (
            <div className="rounded-lg border border-border bg-muted/30 p-2 space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={addQuery}
                  onChange={(e) => setAddQuery(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
              </div>

              <div className="max-h-48 overflow-y-auto rounded-md bg-card border border-border [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
                {candidates.length === 0 ? (
                  <p className="px-3 py-4 text-xs text-muted-foreground text-center">
                    No more users to add
                  </p>
                ) : (
                  candidates.map((u) => {
                    const selected = addSelected.has(u.id);
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => toggleAdd(u.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-left border-b border-border/30 last:border-b-0 transition cursor-pointer ${
                          selected ? "bg-primary/10" : "hover:bg-muted/40"
                        }`}
                      >
                        <Avatar name={u.name} picture={u.picture} size={28} />
                        <span className="flex-1 min-w-0 text-sm text-foreground truncate">
                          {u.name ?? "Unknown"}
                        </span>
                        <span
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition ${
                            selected
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-border bg-white"
                          }`}
                          aria-hidden="true"
                        >
                          {selected && <Check className="w-3 h-3" />}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAdding(false);
                    setAddQuery("");
                    setAddSelected(new Set());
                  }}
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-foreground hover:bg-muted transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAdd}
                  disabled={addSelected.size === 0 || savingAdd}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {savingAdd
                    ? "Adding..."
                    : `Add${addSelected.size > 0 ? ` (${addSelected.size})` : ""}`}
                </button>
              </div>
            </div>
          )}

          <ul className="space-y-1">
            {members.map((m) => {
              const isMe = m.id === currentUserId;
              const isOnline = isMe || !!m.isOnline;
              return (
                <li
                  key={m.id}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted/40 transition"
                >
                  <div className="relative shrink-0">
                    <Avatar name={m.name} picture={m.picture} size={36} />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${isOnline ? "bg-green-500" : "bg-muted-foreground"}`}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {m.name ?? "Unknown"}
                      {isMe && (
                        <span className="ml-1.5 text-[10px] font-normal text-muted-foreground">
                          (you)
                        </span>
                      )}
                    </p>
                    <p
                      className={`text-xs ${isOnline ? "text-green-600" : "text-muted-foreground"}`}
                    >
                      {isOnline ? "● Online" : "Offline"}
                    </p>
                  </div>
                  {!isMe && (
                    <button
                      type="button"
                      onClick={() => handleRemove(m.id)}
                      disabled={removingId === m.id}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50 cursor-pointer"
                      aria-label={`Remove ${m.name ?? "member"}`}
                      title="Remove from group"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}
