"use client";

import React, { useState } from "react";
import AuthFormLayout from "@/components/auth/AuthFormLayout";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Đăng ký thất bại. Email có thể đã được sử dụng.");
      }

      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout
      mode="register"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}
