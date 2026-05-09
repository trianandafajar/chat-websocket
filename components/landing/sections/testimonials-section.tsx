import { Quote, Send } from "lucide-react";
import { SectionLabel } from "@/components/landing/sections/section-label";

function TestimonialsIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[300px]">
      {/* Phone frame */}
      <div className="relative rounded-[2rem] border border-border bg-background shadow-xl ring-8 ring-primary/10 overflow-hidden">
        {/* Phone notch */}
        <div className="flex h-6 items-center justify-center bg-primary">
          <div className="h-1 w-12 rounded-full bg-primary-foreground/40" />
        </div>

        {/* Chat header */}
        <div className="flex items-center gap-3 border-b border-border bg-card/40 px-4 py-3">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-[12px] font-semibold text-primary-foreground">
            E
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-semibold text-foreground truncate">Emily</p>
            <p className="font-mono text-[10px] text-primary">● Active now</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex flex-col gap-2.5 px-4 py-4">
          {/* Other - left */}
          <div className="flex items-end gap-1.5">
            <div className="grid h-6 w-6 place-items-center rounded-full bg-muted text-[9px] font-semibold text-foreground shrink-0">
              E
            </div>
            <div className="max-w-[78%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2">
              <p className="text-[12px] leading-snug text-foreground">Hey! How are you?</p>
            </div>
          </div>

          {/* Me - right */}
          <div className="flex justify-end">
            <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 shadow-sm">
              <p className="text-[12px] leading-snug text-primary-foreground">I&apos;m doing great ✨</p>
            </div>
          </div>

          {/* Other - left */}
          <div className="flex items-end gap-1.5">
            <div className="grid h-6 w-6 place-items-center rounded-full bg-muted text-[9px] font-semibold text-foreground shrink-0">
              E
            </div>
            <div className="max-w-[78%] rounded-2xl rounded-bl-sm bg-muted px-3 py-2">
              <p className="text-[12px] leading-snug text-foreground">Let&apos;s meet tomorrow!</p>
            </div>
          </div>

          {/* Me - right */}
          <div className="flex justify-end">
            <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 shadow-sm">
              <p className="text-[12px] leading-snug text-primary-foreground">Sure, sounds good 👍</p>
            </div>
          </div>

          {/* Typing indicator */}
          <div className="mt-1 flex items-end gap-1.5">
            <div className="grid h-6 w-6 place-items-center rounded-full bg-muted text-[9px] font-semibold text-foreground shrink-0">
              E
            </div>
            <div className="rounded-2xl rounded-bl-sm bg-muted px-3 py-2.5">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:240ms]" />
              </span>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 border-t border-border bg-card/40 px-3 py-2.5">
          <div className="flex-1 rounded-full bg-muted px-3 py-1.5 font-mono text-[10.5px] text-muted-foreground">
            Write a message…
          </div>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Floating side bubble - top left */}
      <div className="absolute -left-6 top-16 hidden rounded-xl border border-border bg-background px-3 py-2 shadow-lg sm:block">
        <p className="text-[10.5px] font-semibold text-foreground">John</p>
        <p className="font-mono text-[9.5px] text-muted-foreground">Good morning!</p>
      </div>

      {/* Floating side bubble - bottom right */}
      <div className="absolute -right-4 bottom-24 hidden rounded-xl border border-border bg-background px-3 py-2 shadow-lg sm:block">
        <p className="text-[10.5px] font-semibold text-primary">Abel</p>
        <p className="font-mono text-[9.5px] text-muted-foreground">How are you?</p>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const quotes = [
    {
      q: "Finally, a chat app that isn't packed with stickers, statuses, and ads. The look is calm, which makes it nice for everyday use.",
      n: "Rara",
      r: "Student",
    },
    {
      q: "I use it to talk with a small team. The moment someone replies, I see it — no jumping between tabs all day.",
      n: "Bagas",
      r: "Freelancer",
    },
    {
      q: "The clean design makes it comfortable to use anytime — not too bright, not too dim. Perfect for all-day conversations.",
      n: "Nadia",
      r: "Writer",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <SectionLabel index="04" title="What people say" />
      <h2 className="mt-4 max-w-2xl text-[28px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[34px]">
        Used for everyday chats, not just tried once.
      </h2>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
        {/* Illustration */}
        <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6 py-12 sm:px-12 sm:py-16">
          {/* Soft background blobs */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 -right-10 h-56 w-56 rounded-full bg-primary/15 blur-3xl"
          />

          <div className="relative z-10 w-full">
            <TestimonialsIllustration />
          </div>
        </div>

        {/* Testimonials list */}
        <div className="flex flex-col gap-2">
          {quotes.map((t) => (
            <figure
              key={t.n}
              className="group relative rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-background"
            >
              <Quote
                aria-hidden="true"
                className="absolute right-4 top-4 h-5 w-5 text-primary/25 transition-colors group-hover:text-primary/50"
              />
              <blockquote className="pr-8 text-[14.5px] leading-[1.65] text-foreground">
                {t.q}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-[12.5px] font-semibold tracking-tight text-primary ring-1 ring-primary/20">
                  {t.n[0]}
                </span>
                <div className="flex flex-col">
                  <span className="text-[13.5px] font-medium tracking-tight text-foreground">
                    {t.n}
                  </span>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                    {t.r}
                  </span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
