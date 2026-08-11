"use client";

import React, { useState, useEffect, Suspense } from "react";
import AuthFormLayout from "@/components/auth/AuthFormLayout";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Handle OAuth redirect (token in URL from Google callback) ────
  useEffect(() => {
    const token = searchParams.get("token");
    const oauthError = searchParams.get("error");

    if (token) {
      localStorage.setItem("access_token", token);
      router.replace("/dashboard");
    } else if (oauthError) {
      setError("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
    }
  }, [searchParams, router]);

  // ─── Handle email/password login ──────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Đăng nhập thất bại. Vui lòng kiểm tra lại email/mật khẩu.");
      }

      localStorage.setItem("access_token", data.accessToken);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout
      mode="login"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#2563eb] rounded-full animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
