"use client"

import Image from "next/image"
import { MailCheck } from "lucide-react"
import Link from "next/link";

export default function EmailSentPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="bg-card p-6 space-y-6 border border-border rounded-lg text-center">

          <Link href="/" className="flex items-center justify-center gap-1.5">
            <Image
              src="/android-chrome-512x512.png"
              alt="Logo"
              width={42}
              height={42}
              className="rounded-md ring-1 ring-primary/20 shadow-sm"
              priority
            />
            <span className="text-lg font-bold tracking-[-0.01em] leading-none text-foreground">
              <span className="text-primary">Chat</span>
              <span className="ml-0.5">App</span>
            </span>
          </Link>

          {/* Icon */}
          <div className="flex justify-center">
            <MailCheck className="w-14 h-14 text-primary" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-foreground">
            Check Your Email
          </h2>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            We've sent a password reset link to your email address.  
            Please check your inbox and follow the instructions to reset your password.
          </p>

          {/* Buttons */}
          <div className="space-y-3">

            <button
              onClick={() => (window.location.href = "/login")}
              className="w-full cursor-pointer bg-primary hover:bg-primary/90 
              text-primary-foreground font-semibold py-2 rounded-md transition-colors"
            >
              Back to Login
            </button>

            <button
              onClick={() => (window.location.href = "/forgot-password")}
              className="w-full cursor-pointer border border-border hover:bg-accent 
              text-foreground py-2 rounded-md transition-colors"
            >
              Resend Email
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}
