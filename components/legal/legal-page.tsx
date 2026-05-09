"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FooterSection } from "@/components/landing/sections/footer-section";

export type LegalTextPart =
  | string
  | {
      text: string;
      mark: "strong" | "em" | "code";
    }
  | {
      text: string;
      mark: "link";
      href: string;
    };

export type LegalSection = {
  title: string;
  body: Array<string | LegalTextPart[]>;
};

type LegalPageProps = {
  label: string;
  title: string;
  description: string;
  updatedAt: string;
  sections: LegalSection[];
};

export function LegalPage({
  label,
  title,
  description,
  updatedAt,
  sections,
}: LegalPageProps) {
  const anchors = useMemo(
    () =>
      sections.map((section) => ({
        id: toAnchor(section.title),
        title: section.title,
      })),
    [sections],
  );
  const [activeId, setActiveId] = useState(anchors[0]?.id ?? "");

  useEffect(() => {
    if (!anchors.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: "-18% 0px -68% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      },
    );

    anchors.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [anchors]);

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-foreground">
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

          <div className="flex h-8 items-center gap-2">
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
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <section className="border-b border-border/70 bg-gradient-to-b from-blue-50/70 to-background">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:py-14">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {label}
            </p>
            <h1 className="mt-3 text-[36px] font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[52px]">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.65] text-muted-foreground sm:text-[16px]">
              {description}
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Last updated: {updatedAt}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 border-l border-border pl-5">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                Contents
              </p>
              <nav className="mt-4 flex flex-col gap-2">
                {anchors.map((section) => (
                  <a
                    key={section.title}
                    href={`#${section.id}`}
                    aria-current={activeId === section.id ? "true" : undefined}
                    className={`border-l-2 py-1 pl-3 text-[13.5px] transition-colors ${
                      activeId === section.id
                        ? "-ml-[21px] border-primary font-medium text-foreground"
                        : "-ml-[21px] border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="max-w-3xl">
            {sections.map((section) => (
              <section
                key={section.title}
                id={toAnchor(section.title)}
                className="scroll-mt-24 border-b border-border py-5 first:pt-0 last:border-b-0 last:pb-0"
              >
                <h2 className="text-[22px] font-semibold leading-tight tracking-[-0.02em]">
                  {section.title}
                </h2>
                <div className="mt-2 space-y-2">
                  {section.body.map((paragraph, index) => (
                    <p
                      key={`${section.title}-${index}`}
                      className="text-[15px] leading-[1.65] text-muted-foreground"
                    >
                      {renderParagraph(paragraph)}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}

function toAnchor(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function renderParagraph(paragraph: string | LegalTextPart[]) {
  if (typeof paragraph === "string") {
    return paragraph;
  }

  return paragraph.map((part, index) => {
    if (typeof part === "string") {
      return part;
    }

    if (part.mark === "strong") {
      return (
        <strong key={`${part.text}-${index}`} className="font-semibold text-foreground">
          {part.text}
        </strong>
      );
    }

    if (part.mark === "em") {
      return (
        <em key={`${part.text}-${index}`} className="text-foreground/90">
          {part.text}
        </em>
      );
    }

    if (part.mark === "link") {
      return (
        <Link
          key={`${part.text}-${index}`}
          href={part.href}
          className="font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent/60"
        >
          {part.text}
        </Link>
      );
    }

    return (
      <code
        key={`${part.text}-${index}`}
        className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground"
      >
        {part.text}
      </code>
    );
  });
}
