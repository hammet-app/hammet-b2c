"use client";

import { useState, useEffect, useRef } from "react";
import { AuthUser } from "@/lib/utils/roles";

export function useOnlineStatus(
  user: AuthUser,
  accessToken: string | null,
  refreshToken: () => Promise<string | null>
): boolean {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  )
  const isSyncing = useRef(false)

  useEffect(() => {
    async function handleOnline() {
      setIsOnline(true)
    }

    function handleOffline() {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [accessToken, refreshToken])

  return isOnline
}