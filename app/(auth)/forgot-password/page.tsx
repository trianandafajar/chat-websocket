"use client"

import { useState } from "react"
import { Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="bg-card p-6 space-y-6 border border-border rounded-lg">

          <h2 className="text-2xl font-bold text-center border-b border-border pb-5 text-foreground">
            Forgot Password
          </h2>

          {!emailSent ? (
            <>
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2 bg-input text-sm text-foreground 
                    placeholder-muted-foreground border border-border rounded-md
                    focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={() => setEmailSent(true)}
                className="w-full cursor-pointer bg-primary hover:bg-primary/90 
                text-primary-foreground font-semibold py-2 rounded-md transition-colors"
              >
                Send Reset Link
              </button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-foreground text-sm leading-relaxed">
                If an account exists for this email, a password reset link has been sent.
              </p>

              <button
                onClick={() => setEmailSent(false)}
                className="text-primary hover:underline text-sm"
              >
                Back
              </button>
            </div>
          )}

        </div>

        <p className="text-center text-sm text-muted-foreground mt-5">
          Remember your password?{" "}
          <button
            onClick={() => (window.location.href = "/login")}
            className="text-primary hover:underline font-medium"
          >
            Login
          </button>
        </p>

      </div>
    </div>
  )
}