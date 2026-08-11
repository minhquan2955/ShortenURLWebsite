"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import {
  Link2,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Download,
  X,
  Palette,
  Maximize2,
} from "lucide-react";

const API_BASE = "http://localhost:8000";

interface UrlItem {
  id: string;
  originalURL: string;
  shortCode: string;
  accessCounter: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
}

interface QrModalState {
  open: boolean;
  urlId: string;
  shortCode: string;
  originalURL: string;
  qrDataUrl: string | null;
  loading: boolean;
  size: number;
  darkColor: string;
  lightColor: string;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

function DashboardContent() {
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [qrModal, setQrModal] = useState<QrModalState>({
    open: false,
    urlId: "",
    shortCode: "",
    originalURL: "",
    qrDataUrl: null,
    loading: false,
    size: 300,
    darkColor: "#000000",
    lightColor: "#ffffff",
  });

  // ─── Fetch URLs ─────────────────────────────────────────────────────

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/urls?page=${page}&limit=10`, {
        headers: authHeaders(),
      });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      const data = await res.json();
      setUrls(data.urls || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      setError("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  // ─── Copy Short URL ────────────────────────────────────────────────

  const copyUrl = async (shortCode: string, id: string) => {
    const url = `${API_BASE}/${shortCode}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ─── Delete URL ────────────────────────────────────────────────────

  const deleteUrl = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa URL này?")) return;
    try {
      await fetch(`${API_BASE}/api/urls/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      fetchUrls();
    } catch {
      setError("Xóa URL thất bại.");
    }
  };

  // ─── QR Code Modal ────────────────────────────────────────────────

  const openQrModal = (url: UrlItem) => {
    setQrModal({
      open: true,
      urlId: url.id,
      shortCode: url.shortCode,
      originalURL: url.originalURL,
      qrDataUrl: null,
      loading: true,
      size: 300,
      darkColor: "#000000",
      lightColor: "#ffffff",
    });
    fetchQrCode(url.id, 300, "#000000", "#ffffff");
  };

  const fetchQrCode = async (
    urlId: string,
    size: number,
    dark: string,
    light: string
  ) => {
    setQrModal((prev) => ({ ...prev, loading: true }));
    try {
      const darkEnc = encodeURIComponent(dark + "ff");
      const lightEnc = encodeURIComponent(light + "ff");
      const res = await fetch(
        `${API_BASE}/api/urls/${urlId}/qrcode?size=${size}&dark=${darkEnc}&light=${lightEnc}`,
        { headers: authHeaders() }
      );
      const data = await res.json();
      setQrModal((prev) => ({ ...prev, qrDataUrl: data.qrCode, loading: false }));
    } catch {
      setQrModal((prev) => ({ ...prev, loading: false }));
    }
  };

  const updateQrOptions = (field: string, value: string | number) => {
    setQrModal((prev) => {
      const updated = { ...prev, [field]: value };
      // Debounce re-fetch
      fetchQrCode(updated.urlId, updated.size, updated.darkColor, updated.lightColor);
      return updated;
    });
  };

  const downloadQr = () => {
    if (!qrModal.qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `qr-${qrModal.shortCode}.png`;
    link.href = qrModal.qrDataUrl;
    link.click();
  };

  // ─── Logout ────────────────────────────────────────────────────────

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore errors — still clear local state
    }
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  // ─── Render ────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-[#0e0f0c]">
      {/* Top Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-ink)] flex items-center justify-center text-[var(--color-primary)] font-bold">
              <Link2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-xl font-black tracking-tight text-[var(--color-ink)]">
              Shorten<span className="text-[#ee6c4d]">URL</span>
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Đăng xuất
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-extrabold tracking-tight">Các URL của bạn</h1>
          <Link
            href="/"
            className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-active)] text-[var(--color-on-primary)] px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
          >
            <Link2 className="w-4 h-4" />
            Tạo mới
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* URL Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-gray-300 border-t-[var(--color-primary)] rounded-full animate-spin" />
          </div>
        ) : urls.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Link2 className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-semibold mb-2">Chưa có URL nào</p>
            <p className="text-sm">Hãy tạo short link đầu tiên của bạn!</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 uppercase tracking-wider text-xs">
                        Short Link
                      </th>
                      <th className="text-left px-6 py-3.5 font-semibold text-gray-500 uppercase tracking-wider text-xs">
                        URL gốc
                      </th>
                      <th className="text-center px-6 py-3.5 font-semibold text-gray-500 uppercase tracking-wider text-xs">
                        Clicks
                      </th>
                      <th className="text-center px-6 py-3.5 font-semibold text-gray-500 uppercase tracking-wider text-xs">
                        Ngày tạo
                      </th>
                      <th className="text-center px-6 py-3.5 font-semibold text-gray-500 uppercase tracking-wider text-xs">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {urls.map((url) => (
                      <tr
                        key={url.id}
                        className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                      >
                        {/* Short Link */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <a
                              href={`${API_BASE}/${url.shortCode}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#2563eb] font-semibold hover:underline flex items-center gap-1"
                            >
                              /{url.shortCode}
                              <ExternalLink className="w-3 h-3 opacity-50" />
                            </a>
                          </div>
                        </td>

                        {/* Original URL */}
                        <td className="px-6 py-4">
                          <span className="text-gray-600 truncate max-w-[300px] block" title={url.originalURL}>
                            {url.originalURL.length > 50
                              ? url.originalURL.slice(0, 50) + "…"
                              : url.originalURL}
                          </span>
                        </td>

                        {/* Clicks */}
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center min-w-[40px] px-2.5 py-1 bg-green-50 text-green-700 font-bold text-xs rounded-full">
                            {url.accessCounter}
                          </span>
                        </td>

                        {/* Created Date */}
                        <td className="px-6 py-4 text-center text-gray-500 text-xs">
                          {new Date(url.createdAt).toLocaleDateString("vi-VN")}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Copy */}
                            <button
                              onClick={() => copyUrl(url.shortCode, url.id)}
                              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 cursor-pointer"
                              title="Sao chép link"
                            >
                              {copiedId === url.id ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>

                            {/* QR Code */}
                            <button
                              onClick={() => openQrModal(url)}
                              className="p-2 rounded-lg hover:bg-blue-50 transition-colors text-gray-500 hover:text-[#2563eb] cursor-pointer"
                              title="Tạo QR Code"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => deleteUrl(url.id)}
                              className="p-2 rounded-lg hover:bg-red-50 transition-colors text-gray-400 hover:text-red-600 cursor-pointer"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600 font-medium">
                  Trang {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── QR Code Modal ── */}
      {qrModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#2563eb]" />
                <h3 className="text-lg font-bold">Tạo QR Code</h3>
              </div>
              <button
                onClick={() => setQrModal((prev) => ({ ...prev, open: false }))}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              {/* URL Info */}
              <div className="mb-6 p-3 bg-gray-50 rounded-xl text-sm">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Short Link</p>
                <p className="text-[#2563eb] font-semibold">/{qrModal.shortCode}</p>
                <p className="text-gray-400 text-xs mt-1 truncate">{qrModal.originalURL}</p>
              </div>

              {/* QR Preview */}
              <div className="flex justify-center mb-6">
                {qrModal.loading ? (
                  <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 border-3 border-gray-300 border-t-[var(--color-primary)] rounded-full animate-spin" />
                  </div>
                ) : qrModal.qrDataUrl ? (
                  <div className="p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <img
                      src={qrModal.qrDataUrl}
                      alt="QR Code"
                      className="w-[200px] h-[200px] object-contain"
                    />
                  </div>
                ) : null}
              </div>

              {/* Customization Options */}
              <div className="space-y-4">
                {/* Size */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24 flex-shrink-0">
                    <Maximize2 className="w-3.5 h-3.5" />
                    Kích thước
                  </label>
                  <input
                    type="range"
                    min={100}
                    max={600}
                    step={50}
                    value={qrModal.size}
                    onChange={(e) => updateQrOptions("size", parseInt(e.target.value))}
                    className="flex-1 accent-[#2563eb]"
                  />
                  <span className="text-xs text-gray-500 font-mono w-12 text-right">
                    {qrModal.size}px
                  </span>
                </div>

                {/* Colors */}
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24 flex-shrink-0">
                    <Palette className="w-3.5 h-3.5" />
                    Màu QR
                  </label>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={qrModal.darkColor}
                        onChange={(e) => updateQrOptions("darkColor", e.target.value)}
                        className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer"
                      />
                      <span className="text-xs text-gray-400">Tối</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={qrModal.lightColor}
                        onChange={(e) => updateQrOptions("lightColor", e.target.value)}
                        className="w-8 h-8 rounded-lg border border-gray-200 cursor-pointer"
                      />
                      <span className="text-xs text-gray-400">Sáng</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={downloadQr}
                disabled={!qrModal.qrDataUrl}
                className="flex-1 flex items-center justify-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Tải xuống PNG
              </button>
              <button
                onClick={() => setQrModal((prev) => ({ ...prev, open: false }))}
                className="px-4 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
