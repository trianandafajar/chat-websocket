import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HeroWordRotator } from "@/components/landing/sections/hero-word-rotator";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* Image - Show FIRST on mobile, SECOND on desktop */}
          <div className="relative -mx-6 px-6 py-4 select-none lg:order-2 lg:mx-0">
            <Image
              src="/svg/hero_ilus.svg"
              alt="Chat Illustration"
              width={500}
              priority
              height={500}
              className="h-auto w-full select-none pointer-events-none"
            />
          </div>

          {/* Text - Show SECOND on mobile, FIRST on desktop */}
          <div className="lg:order-1">
            <h1 className="max-w-3xl text-[44px] font-semibold leading-none tracking-[-0.025em] text-foreground sm:text-[64px]">
              <span className="whitespace-nowrap">
                Talk with <HeroWordRotator />,
              </span>
              <br />
              <span className="text-primary">without the noise.</span>
            </h1>

            <p className="mt-4 max-w-xl text-[15.5px] leading-tight text-muted-foreground sm:text-base">
              Chat App is a simple place to talk. Send a message to anyone,
              build a small group, and see when your friends are around - all in
              a single window.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-[14px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Create an account
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-10 items-center rounded-md border border-border px-5 text-[14px] font-medium text-foreground transition-colors hover:bg-card"
              >
                I already have one
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}