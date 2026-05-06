"use client"

import { useState } from "react"
import { Mail, MessageCircle, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-4 mx-auto">
            <MessageCircle className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Reset password</h1>
          <p className="text-muted-foreground">We'll send you a link to get back in</p>
        </div>

        {/* Form */}
        <div className="bg-white p-8 space-y-6 rounded-2xl shadow-lg border border-border">

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