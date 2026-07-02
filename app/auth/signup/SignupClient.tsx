"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpInput } from "@/lib/validations/signup";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "@/services/auth";
import { toast } from "sonner";


export default function SignupClient() {
  const mutation = useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success("Account created successfully!");
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignUpInput) => {
    mutation.mutate(data);
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
            <span className="text-white font-bold text-base md:text-lg">SS</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">Create Account</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1.5 md:mt-2">
            Start tracking your academic performance
          </p>
        </div>

        {/* Signup Card */}
        <div className="glass-card rounded-2xl p-5 md:p-8 mb-5 md:mb-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5 md:space-y-4" noValidate>
            {/* Username Field */}
            <div className="space-y-1.5 md:space-y-2">
              <label
                htmlFor="username"
                className="block text-xs md:text-sm font-medium text-foreground"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                {...form.register("name")}
                placeholder="johndoe"
                className="w-full px-3.5 py-2.5 md:px-4 md:py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <p className="text-red-500 text-xs md:text-sm">
                {form.formState.errors.name?.message}
              </p>
            </div>

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
                placeholder="name@university.edu"
                {...form.register("email")}
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
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  {...form.register("password")}
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

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full py-2.5 md:py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm md:text-base transition-all duration-200 hover:shadow-lg hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed mt-4 md:mt-6"
            >
              {mutation.isPending ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 md:my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] md:text-xs text-muted-foreground">
              Already have an account?
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Login Link */}
          <Link
            href="/auth/login"
            className="w-full py-2.5 md:py-3 rounded-lg border border-border text-foreground font-semibold text-sm transition-all duration-200 hover:bg-secondary/50 flex items-center justify-center"
          >
            Login
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
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
