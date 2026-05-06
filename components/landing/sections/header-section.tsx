import Link from "next/link";

export function HeaderSection() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-6 w-6 place-items-center rounded-sm bg-primary/15 ring-1 ring-primary/30">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            Chat App
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {[
            { href: "#preview", label: "Preview" },
            { href: "#features", label: "Features" },
            { href: "#how", label: "How it works" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-md px-3 py-1.5 text-[13.5px] text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-[13.5px] font-medium text-background transition-opacity hover:opacity-90"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
