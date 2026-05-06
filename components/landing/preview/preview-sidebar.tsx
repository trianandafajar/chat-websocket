import { Search } from "lucide-react";
import { SESSIONS } from "@/components/landing/preview/preview-data";
import { previewInitials } from "@/components/landing/preview/preview-utils";

export function PreviewSidebar() {
  return (
    <aside className="flex min-h-[460px] flex-col border-b border-border bg-card sm:border-r sm:border-b-0">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-bold text-foreground mb-3">Messages</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <div className="w-full pl-10 pr-4 py-2.5 text-sm bg-input border border-border rounded-lg text-muted-foreground">
            Search conversations...
          </div>
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto">
        {SESSIONS.map((session) => (
          <li key={session.id}>
            <div
              className={`w-full px-4 py-3 text-left flex items-center gap-3 border-b border-border/30 ${
                session.active ? "bg-primary/10 border-primary/30" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-muted text-foreground border border-border text-sm font-semibold shrink-0">
                {previewInitials(session.name)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <p className="font-medium text-sm truncate text-foreground">
                    {session.name}
                  </p>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {session.time}
                  </span>
                </div>
                <p className="text-xs truncate text-muted-foreground">{session.message}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
