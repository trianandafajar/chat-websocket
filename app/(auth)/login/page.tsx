"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/messages",
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleCredentialsLogin}
          className="bg-card p-5 sm:p-6 space-y-5 sm:space-y-6 border border-border rounded-xl"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-center border-b border-border pb-4 sm:pb-5 text-foreground">
            Login
          </h2>

          {/* Email */}
          <div className="space-y-1.5 sm:space-y-2">
            <label
              htmlFor="email"
              className="block text-sm sm:text-base font-medium text-foreground"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-input text-sm sm:text-base 
                text-foreground placeholder-muted-foreground border border-border rounded-md
                focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5 sm:space-y-2">
            <label
              htmlFor="password"
              className="block text-sm sm:text-base font-medium text-foreground"
            >
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-11 sm:pr-12 py-2 sm:py-2.5 bg-input text-sm sm:text-base 
                text-foreground placeholder-muted-foreground border border-border rounded-md
                focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 
                text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-border bg-input accent-primary"
              />
              <span className="text-sm sm:text-base text-muted-foreground">
                Remember me
              </span>
            </label>

            <button
              type="button"
              onClick={() => (window.location.href = "/forgot-password")}
              className="text-xs sm:text-sm text-primary hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-primary hover:bg-primary/90 
            text-primary-foreground font-semibold py-2 sm:py-2.5 rounded-md 
            text-sm sm:text-base transition-colors"
          >
            Sign In
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
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/messages" })}
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
        </form>

        {/* Bottom text */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-5">
          Don’t have an account?{" "}
          <button
            onClick={() => (window.location.href = "/register")}
            className="text-primary cursor-pointer hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
