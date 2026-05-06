import { MessageCircle, Users, Bell, Sparkles } from "lucide-react";
import { SectionLabel } from "@/components/landing/sections/section-label";

export function FeaturesSection() {
  const items = [
    {
      icon: MessageCircle,
      label: "Messages arrive instantly",
      desc: "The moment you hit send, your message shows up on the other side. No waiting, no refreshing.",
    },
    {
      icon: Users,
      label: "See who's around",
      desc: "Know which friends are active right now, and when they're typing a reply back to you.",
    },
    {
      icon: Bell,
      label: "Tidy group rooms",
      desc: "Create a space for family, classmates, or a small work team - everything stays in one neat list.",
    },
    {
      icon: Sparkles,
      label: "Easy on the eyes",
      desc: "A clean, simple design with light theme and a layout that puts the conversation first - not ads, not notifications.",
    },
  ];

  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <SectionLabel className="w-full justify-center text-center" index="02" title="Features" />
      <h2 className="mt-4 mx-auto text-center max-w-2xl text-[28px] font-semibold leading-tight tracking-[-0.02em] sm:text-[34px]">
        Powerful essentials for everyday conversations.
      </h2>
      <p className="mt-3 text-center mx-auto text-[15px] leading-tight text-muted-foreground">
        Built to keep your chats fast and focused, with practical features that help you
        stay connected without extra clutter.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
        {items.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="flex flex-col gap-3 bg-background p-7 transition-colors hover:bg-card"
          >
            <Icon className="h-4 w-4 text-primary" strokeWidth={1.75} />
            <h3 className="text-[16px] font-semibold tracking-tight text-foreground">
              {label}
            </h3>
            <p className="text-[14px] leading-[1.6] text-muted-foreground">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
