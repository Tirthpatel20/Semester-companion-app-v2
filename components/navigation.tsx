"use client";
 
import { LogOut, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/auth-client";
import { signOut } from "@/services/auth";
import { toast } from "sonner";
 
export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
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

  const showAiButton = pathname !== "/ai";
 
  return (
    <>
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

      {/* Floating AI Logo Button */}
      {showAiButton && (
        <Link
          href="/ai"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center group"
          aria-label="Open AI Assistant"
        >
          {/* Outer Pulsing Glow */}
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-md group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300 animate-pulse" />
          
          {/* Rotating Gradient Border Ring */}
          <div className="absolute -inset-1 rounded-full bg-linear-to-r from-violet-600 to-primary opacity-70 group-hover:opacity-100 blur-[2px] transition-all duration-300 animate-pulse" />
          
          {/* Main Button Body */}
          <div className="relative w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-primary/50 active:scale-95 transition-all duration-300">
            <Sparkles className="w-6 h-6 text-primary group-hover:text-primary transition-colors duration-300" />
          </div>

          {/* Premium Tooltip */}
          <span className="absolute right-16 scale-0 group-hover:scale-100 transition-all duration-200 origin-right bg-popover text-popover-foreground text-xs font-medium px-3 py-2 rounded-xl border border-border shadow-2xl whitespace-nowrap backdrop-blur-md">
            Ask SemesterSync AI
          </span>
        </Link>
      )}
    </>
  );
}
