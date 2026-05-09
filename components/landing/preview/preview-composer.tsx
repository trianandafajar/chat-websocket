import { Send } from "lucide-react";

type PreviewComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
};

export function PreviewComposer({ value, onChange, onSend }: PreviewComposerProps) {
  return (
    <div className="border-t border-border px-4 py-3 bg-background">
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSend();
            }
          }}
          className="min-w-0 flex-1 rounded-md border border-border bg-input px-3.5 py-2 text-xs text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Type a message..."
        />
        <button
          type="button"
          onClick={onSend}
          className="flex h-9 w-9 shrink-0 items-center cursor-pointer justify-center rounded-md bg-primary text-primary-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!value.trim()}
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
