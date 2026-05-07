import { Search } from "lucide-react";
import { SESSIONS } from "@/components/landing/preview/preview-data";
import { previewInitials } from "@/components/landing/preview/preview-utils";

export function PreviewSidebar() {
  return (
    <aside className="flex min-h-[380px] flex-col border-b border-border bg-card sm:border-r sm:border-b-0">
      <div className="border-b border-border p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <div className="w-full rounded-md border border-border bg-input py-2 pl-9 pr-3 text-xs text-muted-foreground">
            Search conversations...
          </div>
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto">
        {SESSIONS.map((session) => (
          <li key={session.id}>
            <div
              className={`w-full px-3 py-2.5 text-left flex items-center gap-2.5 border-b border-border/30 ${
                session.active ? "bg-primary/10 border-primary/30" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted text-foreground border border-border text-xs font-semibold shrink-0">
                {previewInitials(session.name)}
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
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
