"use client"

import { Mail, Lock } from "lucide-react"

export default function LoginPage() {

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="w-full max-w-md">


        <div className="bg-black p-6 space-y-6 border border-border">

          <h2 className="text-2xl font-bold text-center border-b border-border pb-5">Login</h2>
          
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
                defaultValue="demo@darkchatt.com"
                className="w-full pl-10 pr-4 py-2 bg-[#111111] text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                defaultValue="demo123"
                className="w-full pl-10 pr-4 py-2 bg-[#111111] text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input id="remember" type="checkbox" className="w-4 h-4 rounded border-border bg-input accent-primary" />
            <label htmlFor="remember" className="ml-2 text-sm text-muted-foreground">
              Remember me
            </label>
          </div>

          <button
            onClick={() => window.location.href = "/messages"}
            className="w-full cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 transition-colors"
          >
            Sign In
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <button className="flex items-center w-full cursor-pointer justify-center py-1 border border-border hover:bg-secondary transition-colors text-foreground">
            <span className="text-xl">G</span>
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-5">
          Don't have an account? <button className="text-primary hover:underline font-medium">Sign up</button>
        </p>
      </div>
    </div>
  )
}
