"use client";

import { useEffect, useMemo, useState } from "react";

const WORDS = [
  { text: "friends" },
  { text: "family" },
  { text: "team" },
];

export function HeroWordRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 1800);

    return () => window.clearInterval(timer);
  }, []);

  const active = useMemo(() => WORDS[index], [index]);

  return (
    <span className="inline-flex items-baseline align-baseline">
      <span
        key={active.text}
        className="inline-block leading-none text-foreground motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 motion-safe:duration-300"
      >
        {active.text}
      </span>
    </span>
  );
}
