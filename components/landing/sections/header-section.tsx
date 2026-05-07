import Image from "next/image";
import Link from "next/link";

export function HeaderSection() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="group flex items-center gap-1 rounded-md px-1.5 py-1 -mx-1.5 transition-colors hover:bg-muted/40"
        >
          <Image
            src="/android-chrome-512x512.png"
            alt="Logo"
            width={28}
            height={28}
            className="rounded-md ring-1 ring-primary/20 shadow-sm"
            priority
          />
          <span className="text-[16px] font-bold tracking-[-0.01em] leading-none text-foreground">
            <span className="text-primary">Chat</span>
            <span className="ml-0.5">App</span>
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
