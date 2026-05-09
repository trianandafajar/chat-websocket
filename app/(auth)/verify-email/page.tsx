"use client"

import React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import Link from "next/link";

const VerifyEmailPage: React.FC = () => {
  const router = useRouter()

  const handleBackToLogin = (): void => {
    router.push("/login")
  }

  const handleResendEmail = (): void => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Content */}
        <div className="bg-white p-8 space-y-6 rounded-2xl shadow-lg border border-border text-center">
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            We’ve sent a verification link to your email address.
            <br />
            Click the link to activate your account and start chatting.
          </p>

          {/* Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full cursor-pointer bg-primary hover:bg-accent
              text-primary-foreground font-semibold py-3 rounded-lg transition-colors duration-200"
            >
              Back to login
            </button>

            <button
              type="button"
              onClick={handleResendEmail}
              className="w-full cursor-pointer border border-border hover:bg-blue-50
              text-foreground py-3 rounded-lg transition-colors duration-200 font-medium"
            >
              Resend link
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Didn’t get the email?{" "}
          <button
            type="button"
            onClick={handleResendEmail}
            className="text-primary font-semibold cursor-pointer hover:text-accent transition"
          >
            Check spam or resend
          </button>
        </p>
      </div>
    </div>
  )
}

export default VerifyEmailPage