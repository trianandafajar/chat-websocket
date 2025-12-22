"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck } from "lucide-react"

const VerifyEmailPage: React.FC = () => {
  const router = useRouter()

  const handleBackToLogin = (): void => {
    router.push("/auth/login")
  }

  const handleResendEmail = (): void => {
    window.location.reload()
  }

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
            <br />
            Please check your inbox and click the link to activate your account.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full cursor-pointer bg-primary hover:bg-primary/90 
              text-primary-foreground font-semibold py-2 rounded-md transition-colors"
            >
              Back to Login
            </button>

            <button
              type="button"
              onClick={handleResendEmail}
              className="w-full cursor-pointer border border-border hover:bg-accent 
              text-foreground py-2 rounded-md transition-colors"
            >
              Resend Verification Email
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-5">
          Didn’t receive anything?
          <button
            type="button"
            onClick={handleResendEmail}
            className="text-primary hover:underline font-medium ml-1"
          >
            Try again
          </button>
        </p>
      </div>
    </div>
  )
}

export default VerifyEmailPage