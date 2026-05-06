import { PreviewSidebar } from "@/components/landing/preview/preview-sidebar";
import { PreviewChatPane } from "@/components/landing/preview/preview-chat-pane";

export function PreviewSection() {
  return (
    <section id="preview" className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>01</span>
        <span>Preview</span>
      </div>
      <h2 className="mt-4 max-w-2xl text-[28px] font-semibold leading-tight tracking-[-0.02em] sm:text-[34px]">
        A familiar chat experience from the first click.
      </h2>
      <p className="mt-2 max-w-2xl text-[15px] leading-[1.65] text-muted-foreground">
        Designed to feel instantly comfortable, with a clean conversation layout, clear
        message flow, and live typing activity that keeps every chat feeling active.
      </p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center border-b border-border bg-background/80 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="mx-auto ml-2 rounded-md border border-border bg-card px-3 py-1 font-mono text-[11px] text-muted-foreground select-none cursor-default">
            chatapp.io/messages
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[320px_1fr]">
          <PreviewSidebar />
          <PreviewChatPane />
        </div>
      </div>
    </section>
  );
}
