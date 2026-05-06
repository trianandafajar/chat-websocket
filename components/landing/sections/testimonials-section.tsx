import { SectionLabel } from "@/components/landing/sections/section-label";

export function TestimonialsSection() {
  const quotes = [
    {
      q: "Finally, a chat app that isn't packed with stickers, statuses, and ads. The look is calm, which makes it nice for everyday use.",
      n: "Rara",
      r: "Student",
    },
    {
      q: "I use it to talk with a small team. The moment someone replies, I see it - no jumping between tabs all day.",
      n: "Bagas",
      r: "Freelancer",
    },
    {
      q: "The clean design makes it comfortable to use anytime - not too bright, not too dim. Perfect for all-day conversations.",
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

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {quotes.map((t) => (
          <figure
            key={t.n}
            className="flex h-full flex-col justify-between gap-8 rounded-lg border border-border bg-card p-6"
          >
            <blockquote className="text-[14.5px] leading-[1.65] text-foreground">
              "{t.q}"
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-border pt-4">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-muted text-[11.5px] font-medium tracking-tight text-foreground">
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
    </section>
  );
}
