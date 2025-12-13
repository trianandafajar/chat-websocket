"use client";

import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerAction } from "@/app/actions/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);

    const res = await registerAction(formData);

    if (res.error) {
      setLoading(false);
      setError(res.error);
      return;
    }

    // Optionally auto-login
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="bg-card p-5 sm:p-6 space-y-5 sm:space-y-6 border border-border rounded-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-center border-b border-border pb-4 sm:pb-5 text-foreground">
            Create Account
          </h2>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <form action={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-sm sm:text-base font-medium text-foreground">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="w-full pl-10 pr-4 py-2 bg-input text-sm border border-border rounded-md"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-sm sm:text-base font-medium text-foreground">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2 bg-input text-sm border border-border rounded-md"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-sm sm:text-base font-medium text-foreground">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2 bg-input text-sm border border-border rounded-md"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5 sm:space-y-2">
              <label className="block text-sm sm:text-base font-medium text-foreground">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                <input
                  name="confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-2 bg-input text-sm border border-border rounded-md"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-2 rounded-md font-semibold"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

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
            onClick={() => signIn("google")}
            className="flex items-center gap-2 w-full justify-center py-2 border border-border rounded-md"
          >
            <img src="/svg/google.svg" className="w-5 h-5" />
            <span>Google</span>
          </button>
        </div>

        {/* Bottom text */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-primary underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
