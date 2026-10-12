"use client";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "./button";

export function SessionExpiredModal() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted && window.location.pathname.startsWith('/login')) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#120E1D] dark:border dark:border-white/10">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10">
          <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        
        <h2 className="mb-2 text-center text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Session Expired
        </h2>
        
        <p className="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">
          For your security, your session has expired. Please log in again to continue learning.
        </p>

        <Button
          variant="default"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => {
            // Reload the page. If the session is truly expired, they will be sent to /login (or show the logged out state).
            // If the session was recovered, they'll stay where they are.
            window.location.reload();
          }}
        >
          Refresh to Continue
        </Button>
      </div>
    </div>
  );
}

