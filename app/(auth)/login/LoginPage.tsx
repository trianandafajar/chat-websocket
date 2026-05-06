"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, MessageCircle } from "lucide-react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCredentialsLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/messages",
    });

    if (res?.error) {
      setError("Email or password is incorrect.");
      return;
    }

    if (res?.ok) {
      window.location.href = "/messages";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-4 mx-auto">
            <MessageCircle className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-muted-foreground">Your conversations are waiting</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleCredentialsLogin}
          className="bg-white p-8 space-y-6 rounded-2xl shadow-lg border border-border"
        >
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-foreground">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="email"
                name="email"
                type="email"
                defaultValue="user@gmail.com"
                required
                placeholder="Enter your email"
                className="w-full pl-11 pr-4 py-3 bg-input text-sm text-foreground placeholder-muted-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                Password
              </label>
              <button
                type="button"
                onClick={() => (window.location.href = "/forgot-password")}
                className="text-xs text-primary hover:text-accent transition"
              >
                Forgot?
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="password"
                defaultValue="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                className="w-full pl-11 pr-11 py-3 bg-input text-sm text-foreground placeholder-muted-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              defaultValue="true"
              id="remember"
              type="checkbox"
              className="w-4 h-4 rounded border-border bg-input accent-primary"
            />
            <span className="text-sm text-muted-foreground">Remember me</span>
          </label>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-primary hover:bg-accent text-primary-foreground font-semibold py-3 rounded-lg transition-colors duration-200"
          >
            Sign in
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don’t have an account?{" "}
          <button
            onClick={() => (window.location.href = "/register")}
            className="text-primary font-semibold cursor-pointer hover:text-accent transition"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
