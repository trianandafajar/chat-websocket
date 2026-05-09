"use client";

import { useEffect, useRef } from "react";
import type { PreviewMessage, SessionItem } from "@/components/landing/preview/preview-data";

type PreviewMessageListProps = {
  messages: PreviewMessage[];
  session: SessionItem;
};

export function PreviewMessageList({ messages, session }: PreviewMessageListProps) {
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    list.scrollTop = list.scrollHeight;
  }, [messages.length, session.id]);

  return (
    <div
      ref={listRef}
      className="min-h-0 flex-1 overflow-y-auto px-4 py-3 space-y-3 pb-6 bg-background"
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-end gap-2 ${message.self ? "justify-end" : "justify-start"}`}
        >
          {!message.self && (
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[11px] font-medium shrink-0 border border-border">
              {message.sender ?? session.name.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="max-w-[74%]">
            <div
              className={`rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                message.self
                  ? "bg-primary/15 text-foreground ring-1 ring-primary/25"
                  : "bg-muted/60 text-foreground"
              }`}
            >
              <p className="break-words">{message.text}</p>
            </div>
            <p
              className={`mt-1 font-mono text-[10px] ${
                message.self ? "text-right text-muted-foreground" : "text-muted-foreground"
              }`}
            >
              {message.self ? "you - " : ""}
              {message.time}
            </p>
          </div>
        </div>
      ))}

      {session.typing && (
        <div className="flex items-center gap-2 pt-1 font-mono text-[10px] text-muted-foreground">
          <span className="flex gap-1">
            <span className="typing-dot-fast" />
            <span className="typing-dot-fast" style={{ animationDelay: "80ms" }} />
            <span className="typing-dot-fast" style={{ animationDelay: "160ms" }} />
          </span>
          {session.typing}
        </div>
      )}
    </div>
  );
}
