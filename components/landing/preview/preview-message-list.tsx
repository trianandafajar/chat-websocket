import { MESSAGES } from "@/components/landing/preview/preview-data";

export function PreviewMessageList() {
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4 pb-8 bg-background">
      {MESSAGES.map((message) => (
        <div
          key={message.id}
          className={`flex items-end gap-2.5 ${message.self ? "justify-end" : "justify-start"}`}
        >
          {!message.self && (
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0 border border-border">
              TG
            </div>
          )}

          <div className="max-w-[74%]">
            <div
              className={`rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                message.self
                  ? "bg-primary/15 text-foreground ring-1 ring-primary/25"
                  : "bg-muted/60 text-foreground"
              }`}
            >
              <p className="break-words">{message.text}</p>
            </div>
            <p
              className={`mt-1 font-mono text-[11px] ${
                message.self ? "text-right text-muted-foreground" : "text-muted-foreground"
              }`}
            >
              {message.self ? "you - " : ""}
              {message.time}
            </p>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-2 pt-2 font-mono text-[11px] text-muted-foreground">
        <span className="flex gap-1">
          <span className="typing-dot-fast" />
          <span className="typing-dot-fast" style={{ animationDelay: "80ms" }} />
          <span className="typing-dot-fast" style={{ animationDelay: "160ms" }} />
        </span>
        Lina is typing...
      </div>
    </div>
  );
}
