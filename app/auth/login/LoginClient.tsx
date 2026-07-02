"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInInput } from "@/lib/validations/login";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/services/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/services/auth";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoginClient() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: signIn,
    onSuccess: () => {
      toast.success("Logged in successfully!");
      router.replace("/");
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignInInput) => {
    mutation.mutate(data);
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-6 md:py-12">
      {/* Decorative blur elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Branding */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-linear-to-br from-primary to-accent/80 mb-3 md:mb-4">
            <span className="text-white font-bold text-base md:text-lg">
              SS
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Semester Sync
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1.5 md:mt-2">
            Welcome back to your academic dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-2xl p-5 md:p-8 mb-5 md:mb-6">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 md:space-y-5"
            noValidate
          >
            {/* Email Field */}
            <div className="space-y-1.5 md:space-y-2">
              <label
                htmlFor="email"
                className="block text-xs md:text-sm font-medium text-foreground"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...form.register("email")}
                placeholder="name@university.edu"
                className="w-full px-3.5 py-2.5 md:px-4 md:py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <p className="text-red-500 text-xs md:text-sm">
                {form.formState.errors.email?.message}
              </p>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 md:space-y-2">
              <label
                htmlFor="password"
                className="block text-xs md:text-sm font-medium text-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  {...form.register("password")}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 md:px-4 md:py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
                <p className="text-red-500 text-xs md:text-sm">
                  {form.formState.errors.password?.message}
                </p>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                ></button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                href="/auth/forgot-password"
                className="text-xs md:text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-2.5 md:py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm md:text-base transition-all duration-200 hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? "Logging In" : "Log In"}
            </button>
          </form>

          <div className="my-3 md:my-4 flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full py-2.5 md:py-3 rounded-lg border border-border hover:bg-secondary transition-all flex items-center justify-center gap-2.5 md:gap-3 text-sm"
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-4 h-4 md:w-5 md:h-5"
                >
                  <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.3 14.7l6.6 4.8C14.7 15.2 19 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.4 5.7-6.4 7.3l6.3 5.2C39.2 37 44 31.1 44 24c0-1.3-.1-2.4-.4-3.5z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="my-5 md:my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] md:text-xs text-muted-foreground">
              New to Semester Companion?
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Sign Up Link */}
          <Link
            href="/auth/signup"
            className="w-full py-2.5 md:py-3 rounded-lg border border-border text-foreground font-semibold text-sm transition-all duration-200 hover:bg-secondary/50 flex items-center justify-center gap-2"
          >
            Create Account
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          By logging in, you agree to our{" "}
          <Link href="#" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
