"use client";

import React, { useState } from "react";
import AuthFormLayout from "@/components/auth/AuthFormLayout";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại email/mật khẩu.");
      }

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
