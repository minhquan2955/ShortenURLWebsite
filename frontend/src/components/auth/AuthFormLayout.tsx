"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Link2, Eye, EyeOff } from "lucide-react";

interface AuthFormLayoutProps {
  mode: "login" | "register";
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading?: boolean;
  error?: string | null;
}

export default function AuthFormLayout({
  mode,
  onSubmit,
  loading = false,
  error = null,
}: AuthFormLayoutProps) {
  const isLogin = mode === "login";
  const [showPassword, setShowPassword] = useState(false);
  const [imgError, setImgError] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:8000/api/auth/google";
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row bg-white text-[#0e0f0c] font-sans overflow-x-hidden">
      {/* ── Left Column: Form Section ── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-12 xl:p-16 min-h-screen bg-white">
        <div className="w-full max-w-[440px] mx-auto flex flex-col justify-between flex-1">
          {/* Top Brand Logo */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 group mb-8 lg:mb-12">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-ink)] flex items-center justify-center text-[var(--color-primary)] font-bold shadow-sm transition-transform group-hover:scale-105">
                <Link2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-[var(--color-ink)] font-wise">
                Shorten<span className="text-[#ee6c4d]">URL</span>
              </span>
            </Link>

            {/* Form Title & Subtitle */}
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0e0f0c] mb-2 font-wise">
                {isLogin ? "Log in and start sharing" : "Create your account and start sharing"}
              </h1>
              <p className="text-sm text-[#454745]">
                {isLogin ? (
                  <>
                    Don't have an account?{" "}
                    <Link
                      href="/register"
                      className="text-[#2563eb] hover:text-[#1d4ed8] font-semibold underline decoration-1 underline-offset-2"
                    >
                      Sign up
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-[#2563eb] hover:text-[#1d4ed8] font-semibold underline decoration-1 underline-offset-2"
                    >
                      Log in
                    </Link>
                  </>
                )}
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2">
                <span className="font-semibold">Lỗi:</span>
                <span>{error}</span>
              </div>
            )}

            {/* OAuth Button (Google Only) */}
            <div className="mb-6 w-full">
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50/80 transition-colors flex items-center justify-center gap-3 text-sm font-semibold text-gray-700 shadow-2xs cursor-pointer active:scale-[0.99]"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6 text-center w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <span className="relative bg-white px-4 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                OR
              </span>
            </div>

            {/* Input Form */}
            <form onSubmit={onSubmit} className="space-y-4 w-full">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full h-11 px-3.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-11 px-3.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Password
                  </label>
                </div>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 pl-3.5 pr-10 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="text-right pt-1">
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#2563eb] hover:text-[#1d4ed8] font-semibold underline decoration-1 underline-offset-2"
                  >
                    Forgot your password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-[#1e40af] text-white font-bold text-base rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isLogin ? (
                  "Log in"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>

          {/* Legal Footer Notice */}
          <div className="mt-8 pt-6 text-center text-xs text-gray-500 leading-relaxed border-t border-gray-100 w-full">
            By {isLogin ? "logging in with an account" : "creating an account"}, you agree to
            ShortenURL's{" "}
            <Link href="/terms" className="underline hover:text-gray-700">
              Terms of Service
            </Link>
            ,{" "}
            <Link href="/privacy" className="underline hover:text-gray-700">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/acceptable-use" className="underline hover:text-gray-700">
              Acceptable Use Policy
            </Link>
            .
          </div>
        </div>
      </div>

      {/* ── Right Column: Promo & Illustration ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-[#f4f3ef] p-8 xl:p-16 text-center relative border-l border-gray-200/60 select-none min-h-screen">
        {/* Background Decorative Glow */}
        <div className="absolute top-12 right-12 w-72 h-72 bg-amber-100/50 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="absolute bottom-12 left-12 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl -z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-[520px] mx-auto flex flex-col items-center justify-center text-center px-4">
          {/* Main Illustration */}
          {!imgError ? (
            <div className="w-full max-w-[420px] mb-8 drop-shadow-md flex items-center justify-center">
              <img
                src="/auth_illustration.png"
                alt="Connect tools illustration"
                onError={() => setImgError(true)}
                className="w-full h-auto max-h-[360px] object-contain rounded-xl"
              />
            </div>
          ) : (
            // Fallback Graphic
            <div className="w-72 h-64 mb-8 bg-white/80 rounded-2xl p-6 border border-gray-200/80 shadow-sm flex flex-col items-center justify-center relative">
              <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-ink-deep)] flex items-center justify-center mb-4">
                <Link2 className="w-10 h-10" />
              </div>
              <div className="space-y-2 w-full">
                <div className="h-3 bg-gray-200 rounded-full w-3/4 mx-auto" />
                <div className="h-2.5 bg-gray-100 rounded-full w-1/2 mx-auto" />
              </div>
            </div>
          )}

          <h2 className="w-full text-2xl xl:text-3xl font-extrabold text-[#0e0f0c] leading-snug mb-4 font-wise text-center">
            Connect ShortenURL to the tools you use every day
          </h2>
          <p className="w-full text-base xl:text-lg text-[#454745] leading-relaxed max-w-[480px] mx-auto text-center">
            Create branded links, generate QR codes, and track audience engagement across all your channels in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}
