"use client";

import { useMemo, useState } from "react";
import { PreviewSidebar } from "@/components/landing/preview/preview-sidebar";
import { PreviewChatPane } from "@/components/landing/preview/preview-chat-pane";
import {
  MESSAGES_BY_SESSION,
  SESSIONS,
  type PreviewMessage,
  type SessionItem,
} from "@/components/landing/preview/preview-data";

export function PreviewSection() {
  const [sessions, setSessions] = useState<SessionItem[]>(SESSIONS);
  const [selectedSessionId, setSelectedSessionId] = useState(SESSIONS[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [messagesBySession, setMessagesBySession] =
    useState<Record<string, PreviewMessage[]>>(MESSAGES_BY_SESSION);

  const filteredSessions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return sessions;

    return sessions.filter((session) =>
      [session.name, session.message].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [search, sessions]);

  const selectedSession =
    sessions.find((session) => session.id === selectedSessionId) ?? sessions[0];

  const selectedMessages = messagesBySession[selectedSession.id] ?? [];

  function handleSelectSession(sessionId: string) {
    setSelectedSessionId(sessionId);
    setInputValue("");
    setSidebarOpen(false);
  }

  function handleSend() {
    const text = inputValue.trim();
    if (!text) return;

    const now = new Date();
    const message: PreviewMessage = {
      id: `${selectedSession.id}-${now.getTime()}`,
      text,
      time: now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      self: true,
    };

    setMessagesBySession((current) => ({
      ...current,
      [selectedSession.id]: [...(current[selectedSession.id] ?? []), message],
    }));
    setSessions((current) =>
      current.map((session) =>
        session.id === selectedSession.id
          ? { ...session, message: text, time: message.time }
          : session
      )
    );
    setInputValue("");
  }

  return (
    <section id="preview" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,660px)_minmax(320px,1fr)] lg:items-center">
        <div className="w-full max-w-[660px] overflow-hidden rounded-xl border border-border bg-card shadow-sm lg:justify-self-end">
          <div className="relative grid h-[420px] grid-cols-1 sm:grid-cols-[200px_1fr]">
            {sidebarOpen && (
              <button
                type="button"
                className="absolute inset-0 z-20 bg-background/70 backdrop-blur-[1px] sm:hidden"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close conversations"
              />
            )}
            <PreviewSidebar
              sessions={filteredSessions}
              selectedSessionId={selectedSession.id}
              search={search}
              onSearchChange={setSearch}
              onSelectSession={handleSelectSession}
              onClose={() => setSidebarOpen(false)}
              mobileOpen={sidebarOpen}
            />
            <PreviewChatPane
              session={selectedSession}
              messages={selectedMessages}
              inputValue={inputValue}
              onInputChange={setInputValue}
              onSend={handleSend}
              onOpenSidebar={() => setSidebarOpen(true)}
            />
          </div>
        </div>

        <div className="lg:pl-2">
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span>01</span>
            <span>Preview</span>
          </div>
          <h2 className="mt-4 max-w-xl text-[28px] font-semibold leading-tight tracking-[-0.02em] text-foreground sm:text-[34px]">
            A familiar chat experience from the first click.
          </h2>
          <p className="mt-3 max-w-lg text-[15px] leading-[1.65] text-muted-foreground">
            Designed to feel instantly comfortable, with a clean conversation
            layout, clear message flow, and live typing activity that keeps
            every chat feeling active.
          </p>
        </div>
      </div>
    </section>
  );
}
