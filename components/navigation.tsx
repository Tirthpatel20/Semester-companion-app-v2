"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/auth-client";
import { signOut } from "@/services/auth";
import { toast } from "sonner";

export function Navigation() {
  const router = useRouter();
  const { data } = authClient.useSession();
  const userName = data?.user?.name || "Student";

  const signOutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      toast.success("Logged out successfully.");
      router.replace("/auth/login");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-lg p-1 transition-transform hover:scale-102"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">
              SS
            </span>
          </div>
          <span className="text-lg font-semibold text-foreground hidden sm:inline">
            Semester Sync
          </span>
        </Link>

        {/* User Menu */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground hidden sm:inline">
              {userName}
            </span>
          </div>
          <button
            onClick={() => signOutMutation.mutate()}
            disabled={signOutMutation.isPending}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-secondary/30 text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-all text-xs font-semibold focus-visible:ring-2 focus-visible:ring-destructive focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
