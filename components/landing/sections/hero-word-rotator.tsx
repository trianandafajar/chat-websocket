"use client";

import { useEffect, useState } from "react";

const WORDS = [
  { text: "friends" },
  { text: "family" },
  { text: "team" },
];

export function HeroWordRotator() {
  const [position, setPosition] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPosition((prev) => prev + 1);
    }, 1800);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (position !== WORDS.length) {
      return;
    }

    const resetTimer = window.setTimeout(() => {
      setIsTransitioning(false);
      setPosition(0);

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      });
    }, 500);

    return () => window.clearTimeout(resetTimer);
  }, [position]);

  return (
    <span className="relative inline-block h-[1em]  overflow-hidden whitespace-nowrap align-baseline leading-none -mb-2.5">
      <span className="invisible block leading-none" aria-hidden="true">
        friends
      </span>
      <span
        className={[
          "absolute left-0 top-0 block motion-reduce:transition-none",
          isTransitioning
            ? "transition-transform duration-500 ease-out"
            : "transition-none",
        ].join(" ")}
        style={{ transform: `translateY(-${position}em)` }}
      >
        {[...WORDS, WORDS[0]].map((word, wordIndex) => (
          <span
            key={`${word.text}-${wordIndex}`}
            className="block h-[1em] whitespace-nowrap leading-none text-foreground"
          >
            {word.text}
          </span>
        ))}
      </span>
    </span>
  );
}
