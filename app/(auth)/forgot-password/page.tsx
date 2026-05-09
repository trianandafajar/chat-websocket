"use client"

import { useState } from "react"
import Image from "next/image"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Form */}
        <div className="bg-white p-8 space-y-6 rounded-2xl shadow-lg border border-border">
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

          {!emailSent ? (
            <>
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full pl-11 pr-4 py-3 bg-input text-sm text-foreground
                    placeholder-muted-foreground border border-border rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={() => setEmailSent(true)}
                className="w-full cursor-pointer bg-primary hover:bg-accent
                text-primary-foreground font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                Send reset link
              </button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-foreground text-sm leading-relaxed">
                If an account exists for this email, a password reset link has been sent.
              </p>

              <button
                onClick={() => setEmailSent(false)}
                className="inline-flex items-center gap-2 text-primary hover:text-accent text-sm font-medium transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Try again
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Remember your password?{" "}
          <button
            onClick={() => (window.location.href = "/login")}
            className="text-primary font-semibold cursor-pointer hover:text-accent transition"
          >
            Sign in
          </button>
        </p>

      </div>
    </div>
  )
}