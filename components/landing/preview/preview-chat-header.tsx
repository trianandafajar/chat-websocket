import { Menu } from "lucide-react";
import type { SessionItem } from "@/components/landing/preview/preview-data";

type PreviewChatHeaderProps = {
  session: SessionItem;
  onOpenSidebar: () => void;
};

export function PreviewChatHeader({ session, onOpenSidebar }: PreviewChatHeaderProps) {
  return (
    <div className="px-4 py-3 border-b border-border bg-background flex items-center justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground sm:hidden"
          aria-label="Open conversations"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="min-w-0">
          <h4 className="text-[20px] font-semibold leading-none tracking-tight text-foreground truncate">
            {session.name}
          </h4>
          <p className="font-mono text-[10px] text-muted-foreground">
            {session.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
}
