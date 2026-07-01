"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/services/auth";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import {
  resetPasswordSchema,
  ResetPasswordInput,
} from "@/lib/validations/reset-password";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get("token");

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),

    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordInput) =>
      resetPassword(token!, data.password),

    onSuccess: () => {
      toast.success("Password reset successfully.");
      router.replace("/auth/login");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: ResetPasswordInput) => {
    if (!token) {
      toast.error("Invalid reset link.");
      return;
    }

    resetPasswordMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      {/* Decorative blur elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <button
          onClick={() => router.push("/auth/login")}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-medium"
        >
          ← Back to Login
        </button>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary to-accent/80 mb-4">
            <span className="text-white font-bold text-lg">SS</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>

          <p className="text-sm text-muted-foreground mt-2">
            Enter your new password below.
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                New Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  placeholder="Enter your new password"
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <p className="text-red-500 text-sm">
                {form.formState.errors.password?.message}
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...form.register("confirmPassword")}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div> 

              <p className="text-red-500 text-sm">
                {form.formState.errors.confirmPassword?.message}
              </p>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={resetPasswordMutation.isPending}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resetPasswordMutation.isPending
                ? "Resetting Password..."
                : "Reset Password"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Remembered your password?{" "}
          <button
            onClick={() => router.push("/auth/login")}
            className="text-primary hover:underline font-medium"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}
