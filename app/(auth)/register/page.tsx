"use client"

import { useState } from "react"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">

        <div className="bg-card p-5 sm:p-6 space-y-5 sm:space-y-6 border border-border rounded-xl">

          <h2 className="text-xl sm:text-2xl font-bold text-center border-b border-border pb-4 sm:pb-5 text-foreground">
            Create Account
          </h2>

          {/* Name */}
          <div className="space-y-1.5 sm:space-y-2">
            <label htmlFor="name" className="block text-sm sm:text-base font-medium text-foreground">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <input
                id="name"
                type="text"
                placeholder="Your name"
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-input text-sm sm:text-base 
                text-foreground placeholder-muted-foreground border border-border rounded-md
                focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5 sm:space-y-2">
            <label htmlFor="email" className="block text-sm sm:text-base font-medium text-foreground">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-input text-sm sm:text-base 
                text-foreground placeholder-muted-foreground border border-border rounded-md
                focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5 sm:space-y-2">
            <label htmlFor="password" className="block text-sm sm:text-base font-medium text-foreground">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 sm:pr-12 py-2 sm:py-2.5 bg-input text-sm sm:text-base 
                text-foreground placeholder-muted-foreground border border-border rounded-md
                focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5 sm:space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm sm:text-base font-medium text-foreground">
              Confirm Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />

              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 sm:pr-12 py-2 sm:py-2.5 bg-input text-sm sm:text-base 
                text-foreground placeholder-muted-foreground border border-border rounded-md
                focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Create Account */}
          <button
            onClick={() => (window.location.href = "/auth/verify")}
            className="w-full cursor-pointer bg-primary hover:bg-primary/90 
            text-primary-foreground font-semibold py-2 sm:py-2.5 rounded-md 
            text-sm sm:text-base transition-colors"
          >
            Create Account
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="px-2 bg-card text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google */}
          <button
            className="flex items-center gap-2 w-full cursor-pointer justify-center py-2 sm:py-2.5
            border border-border rounded-md hover:bg-accent 
            transition-colors text-foreground text-sm sm:text-base"
          >
            <img
              src="/svg/google.svg"
              alt="Google"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
            <span>Google</span>
          </button>
        </div>

        {/* Bottom text */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-5">
          Already have an account?{" "}
          <button 
            onClick={() => window.location.href = "/login"}
            className="text-primary cursor-pointer hover:underline font-medium"
            >
            Sign in
          </button>
        </p>

      </div>
    </div>
  )
}