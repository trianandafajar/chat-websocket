"use client";

import { Search, X } from "lucide-react";
import type { SessionItem } from "@/components/landing/preview/preview-data";
import { previewInitials } from "@/components/landing/preview/preview-utils";

type PreviewSidebarProps = {
  sessions: SessionItem[];
  selectedSessionId: string;
  search: string;
  onSearchChange: (value: string) => void;
  onSelectSession: (sessionId: string) => void;
  onClose?: () => void;
  mobileOpen?: boolean;
};

export function PreviewSidebar({
  sessions,
  selectedSessionId,
  search,
  onSearchChange,
  onSelectSession,
  onClose,
  mobileOpen = false,
}: PreviewSidebarProps) {
  return (
    <aside
      className={`absolute inset-y-0 left-0 z-30 flex h-full w-[220px] min-h-0 flex-col border-r border-border bg-card shadow-xl transition-transform duration-200 ease-out sm:static sm:w-auto sm:translate-x-0 sm:shadow-none ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-2.5 sm:hidden">
        <span className="text-xs font-semibold text-foreground">Messages</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Close conversations"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="border-b border-border p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full rounded-md border border-border bg-input py-2 pl-9 pr-3 text-xs text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Search conversations..."
          />
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <li className="px-3 py-6 text-center text-[11px] text-muted-foreground">
            No conversations found
          </li>
        ) : (
          sessions.map((session) => {
            const active = selectedSessionId === session.id;

            return (
              <li key={session.id}>
                <button
                  type="button"
                  onClick={() => onSelectSession(session.id)}
                  className={`w-full px-3 py-2.5 cursor-pointer text-left flex items-center gap-2.5 border-b border-border/30 transition ${
                    active ? "bg-primary/10 border-primary/30" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="relative w-8 h-8 rounded-full flex items-center justify-center bg-muted text-foreground border border-border text-xs font-semibold shrink-0">
                    {previewInitials(session.name)}
                    {session.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-emerald-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="font-medium text-xs truncate text-foreground">
                        {session.name}
                      </p>
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {session.time}
                      </span>
                    </div>
                    <p className="text-[11px] truncate text-muted-foreground">{session.message}</p>
                  </div>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </aside>
  );
}
