"use client";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { useAuth } from "@/lib/auth/auth-context";

export function SessionExpiredModal() {
  const router = useRouter();
  const { dismissSessionExpired } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted && window.location.pathname.startsWith('/login')) {
    return null;
  }

  const handleLogin = () => {
    dismissSessionExpired?.();
    router.push("/login");
  };

  const handleDismiss = () => {
    dismissSessionExpired?.();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#120E1D] dark:border dark:border-white/10 text-center animate-in fade-in zoom-in-95 duration-200">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        
        <h2 className="mb-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Session Expired
        </h2>
        
        <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
          Your cloud session has ended. You can log in again to sync your progress across devices or continue offline.
        </p>

        <div className="flex flex-col gap-2.5">
          <Button
            variant="default"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
            onClick={handleLogin}
          >
            Log In Again
          </Button>
          <Button
            variant="outline"
            className="w-full border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
            onClick={handleDismiss}
          >
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
}

