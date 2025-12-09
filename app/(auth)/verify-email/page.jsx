"use client"

import { ShieldCheck } from "lucide-react"

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="bg-card p-6 space-y-6 border border-border rounded-lg text-center">

          {/* Icon */}
          <div className="flex justify-center">
            <ShieldCheck className="w-14 h-14 text-primary" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-foreground">
            Verify Your Email
          </h2>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            We've sent a verification link to your email address.  
            Please check your inbox and click the link to activate your account.
          </p>

          {/* Buttons */}
          <div className="space-y-3">

            <button
              onClick={() => (window.location.href = "/auth/login")}
              className="w-full cursor-pointer bg-primary hover:bg-primary/90 
              text-primary-foreground font-semibold py-2 rounded-md transition-colors"
            >
              Back to Login
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-full cursor-pointer border border-border hover:bg-accent 
              text-foreground py-2 rounded-md transition-colors"
            >
              Resend Verification Email
            </button>
          </div>

        </div>

        <p className="text-center text-sm text-muted-foreground mt-5">
          Didn’t receive anything?  
          <button className="text-primary hover:underline font-medium ml-1">
            Try again
          </button>
        </p>

      </div>
    </div>
  )
}
