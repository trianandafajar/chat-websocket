"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";

const QUICK_ACCOUNTS = [
  { name: "Alice", email: "alice@gmail.com", avatar: "/avatar1.jpg" },
  { name: "Bob", email: "bob@gmail.com", avatar: "/avatar2.jpg" },
  { name: "Carol", email: "carol@gmail.com", avatar: "/avatar3.jpg" },
  { name: "Triananda", email: "user@gmail.com", avatar: null },
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quickLoading, setQuickLoading] = useState<string | null>(null);

  const doLogin = async (email: string, password: string) => {
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/messages",
    });

    if (res?.error) {
      setError("Email or password is incorrect.");
      return false;
    }
    if (res?.ok) {
      window.location.href = "/messages";
      return true;
    }
    return false;
  };

  const handleCredentialsLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    await doLogin(email, password);
  };

  const handleQuickLogin = async (email: string) => {
    if (quickLoading) return;
    setQuickLoading(email);
    const ok = await doLogin(email, "password");
    if (!ok) setQuickLoading(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Form */}
        <form
          onSubmit={handleCredentialsLogin}
          className="bg-white p-8 space-y-6 rounded-2xl shadow-lg border border-border"
        >
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

        {/* Quick Login (demo accounts) */}
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Quick login
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-4 gap-2">
            {QUICK_ACCOUNTS.map((acc) => {
              const loading = quickLoading === acc.email;
              const initial = acc.name.charAt(0).toUpperCase();
              return (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickLogin(acc.email)}
                  disabled={!!quickLoading}
                  title={`Sign in as ${acc.name}`}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white border border-border hover:border-primary hover:bg-blue-50 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted flex items-center justify-center text-sm font-semibold text-foreground border border-border">
                    {acc.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initial
                    )}
                    {loading && (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-foreground truncate max-w-full">
                    {acc.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

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
