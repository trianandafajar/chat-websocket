import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:py-28">
      <div className="flex flex-col items-start gap-8 rounded-lg border border-border bg-card p-10 sm:flex-row sm:items-end sm:justify-between sm:p-14">
        <div className="max-w-xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Try it
          </span>
          <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[40px]">
            Start chatting in under a minute.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.65] text-muted-foreground">
            Sign up with an email and you can send your first message right
            away. Free, with none of the back-and-forth onboarding.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/register"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get started
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="inline-flex h-11 items-center rounded-md border border-border px-5 text-[14px] font-medium text-foreground transition-colors hover:bg-background"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
