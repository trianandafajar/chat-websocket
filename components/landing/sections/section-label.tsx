import { cn } from "@/lib/utils";

export function SectionLabel({
  index,
  title,
  className,
}: {
  index: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={
      cn("flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground", className)
    }>
      <span>{index}</span>
      <span>{title}</span>
    </div>
  );
}
