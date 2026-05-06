import { SectionLabel } from "@/components/landing/sections/section-label";

export function HowItWorksSection() {
  const steps = [
    {
      n: "01",
      t: "Create an account",
      d: "Sign up with an email or your Google account. Just once, then you're set whenever you want to chat.",
    },
    {
      n: "02",
      t: "Start a chat",
      d: "Pick a friend from the user list, or start a new group to talk with several people at once.",
    },
    {
      n: "03",
      t: "Talk freely",
      d: "Send messages, see who's online, and enjoy a chat that doesn't get in your way.",
    },
  ];

  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <SectionLabel className="w-full justify-center text-center" index="03" title="How it works" />
      <h2 className="mt-4 mx-auto max-w-2xl text-center text-[28px] font-semibold leading-tight tracking-[-0.02em] sm:text-[34px]">
        Start chatting in three simple steps.
      </h2>
      <p className="mt-3 mx-auto max-w-xl text-center text-[15px] leading-tight text-muted-foreground">
        Create your account, open a conversation, and enjoy real-time messaging in seconds.
      </p>

      <ol className="mt-10 grid grid-cols-1 gap-y-8 sm:grid-cols-3 sm:gap-x-10">
        {steps.map((s) => (
          <li
            key={s.n}
            className="flex flex-col gap-3 border-t border-border pt-5"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {s.n}
            </span>
            <h3 className="text-[18px] font-semibold tracking-tight text-foreground">
              {s.t}
            </h3>
            <p className="text-[14px] leading-[1.6] text-muted-foreground">
              {s.d}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
