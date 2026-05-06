export function PreviewChatHeader() {
  return (
    <div className="px-4 md:px-6 py-4 border-b border-border bg-background flex items-center justify-between">
      <div className="min-w-0">
        <h4 className="text-[22px] font-semibold leading-none tracking-tight text-foreground truncate">
          Trip Group
        </h4>
        <p className="font-mono text-[11px] text-muted-foreground">Online</p>
      </div>
    </div>
  );
}
