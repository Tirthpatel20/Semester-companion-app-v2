"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPassword } from "@/services/auth";
import { toast } from "sonner";
import {
  forgotPasswordSchema,
  ForgotPasswordInput,
} from "@/lib/validations/forgot-password";

export default function ForgotPasswordClient() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("Password reset email sent.");
      setIsSubmitted(true);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    setSubmittedEmail(data.email);
    forgotPasswordMutation.mutate(data.email);
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
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-primary to-accent/80 mb-4">
            <span className="text-white font-bold text-lg">SS</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
          <p className="text-sm text-muted-foreground mt-2">
            {isSubmitted
              ? "Check your email for reset instructions"
              : "Enter your email to receive password reset instructions"}
          </p>
        </div>

        {/* Reset Card */}
        <div className="glass-card rounded-2xl p-8 mb-6">
          {!isSubmitted ? (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="name@university.edu"
                  {...form.register("email")}
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-red-500 text-sm">
                  {form.formState.errors.email?.message}
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={forgotPasswordMutation.isPending}
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {forgotPasswordMutation.isPending
                  ? "Sending..."
                  : "Send Reset Link"}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Email Sent
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                We&apos;ve sent password reset instructions to{" "}
                <span className="font-medium text-foreground">{submittedEmail}</span>
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                Check your spam folder if you don&apos;t see it in a few
                minutes.
              </p>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setSubmittedEmail("");
                  form.reset();
                }}
                className="w-full py-3 rounded-lg border border-border text-foreground font-semibold transition-all duration-200 hover:bg-secondary/50"
              >
                Try Another Email
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/auth/login"
            className="text-primary hover:underline font-medium"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
