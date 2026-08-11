"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:8000";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard wraps protected pages.
 * - Checks for access_token in localStorage on mount.
 * - Validates the token by calling GET /api/auth/me.
 * - If invalid or missing, redirects to /login.
 * - Shows a loading spinner while validating.
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setStatus("unauthenticated");
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          // Token invalid or expired — try refresh
          const refreshRes = await fetch(`${API_BASE}/api/auth/refresh`, {
            method: "POST",
            credentials: "include", // send httpOnly cookie
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            localStorage.setItem("access_token", data.accessToken);
            setStatus("authenticated");
          } else {
            // Refresh also failed — force login
            localStorage.removeItem("access_token");
            setStatus("unauthenticated");
            router.replace("/login");
          }
        } else {
          setStatus("authenticated");
        }
      } catch {
        localStorage.removeItem("access_token");
        setStatus("unauthenticated");
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#2563eb] rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Đang xác thực...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    // Render nothing while redirecting
    return null;
  }

  return <>{children}</>;
}
