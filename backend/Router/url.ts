import express from "express";
import {
  createShortUrl,
  getOriginalUrl,
  getUserUrls,
  getUrlDetail,
  updateUrl,
  deleteUrl,
  checkHealth,
} from "../Controller/urlController.js";
import {
  getSummary,
  getGeo,
  getDevices,
  getTimelineData,
} from "../Controller/analyticsController.js";
import authMiddleware from "../Middleware/authMiddleware.js";
import limiter from "../Middleware/rateLimiter.js";

const router = express.Router();

// ─── Public Routes ──────────────────────────────────────────────────

// Health check
router.get("/health", checkHealth);

// ─── Authenticated API Routes (/api/urls/*) ─────────────────────────

// URL CRUD
router.post("/api/urls/shorten", authMiddleware, limiter, createShortUrl);
router.get("/api/urls", authMiddleware, getUserUrls);
router.get("/api/urls/:id", authMiddleware, getUrlDetail);
router.put("/api/urls/:id", authMiddleware, updateUrl);
router.delete("/api/urls/:id", authMiddleware, deleteUrl);

// Analytics (nested under URL)
router.get("/api/urls/:id/analytics/summary", authMiddleware, getSummary);
router.get("/api/urls/:id/analytics/geo", authMiddleware, getGeo);
router.get("/api/urls/:id/analytics/devices", authMiddleware, getDevices);
router.get("/api/urls/:id/analytics/timeline", authMiddleware, getTimelineData);

// ─── Redirect (MUST be LAST — /:shortCode matches any path) ────────

router.get("/:shortCode", getOriginalUrl);

export default router;
