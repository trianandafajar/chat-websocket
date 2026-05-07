import { PreviewSidebar } from "@/components/landing/preview/preview-sidebar";
import { PreviewChatPane } from "@/components/landing/preview/preview-chat-pane";

export function PreviewSection() {
  return (
    <section id="preview" className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,660px)_minmax(320px,1fr)] lg:items-center">
        <div className="w-full max-w-[660px] overflow-hidden rounded-xl border border-border bg-card shadow-sm lg:justify-self-end">
          <div className="flex items-center gap-2.5 border-b border-border bg-background/80 px-3.5 py-2">
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
              <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
              <span className="h-2 w-2 rounded-full bg-[#28c840]" />
            </div>
            <div className="min-w-0 rounded-md border border-border bg-card px-3 py-0.5 font-mono text-[10px] text-muted-foreground select-none cursor-default">
              <span className="block truncate">
                chat-app.trianandafajar.com/messages
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr]">
            <PreviewSidebar />
            <PreviewChatPane />
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
