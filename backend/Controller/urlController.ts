import crypto from "crypto";
import QRCode from "qrcode";
import type { Request, Response } from "express";
import type { AuthPayload } from "../Middleware/authMiddleware.js";
import {
  createNewUrl,
  getUrlForRedirect,
  getUrlsByUserId,
  getUrlById,
  updateUrl as updateUrlModel,
  deleteUrl as deleteUrlModel,
  check,
} from "../Model/urlModel.js";
import { recordClick } from "../Model/clickModel.js";
import { lookupIp } from "../Service/geoService.js";
import { parseUserAgent } from "../Service/uaService.js";

// ─── Helpers ────────────────────────────────────────────────────────

const generateCode = (): string => crypto.randomBytes(4).toString("base64url");

// ─── Create Short URL (auth required) ──────────────────────────────

const createShortUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { originalURL, generateQR, expiresAt } = req.body;
    const userId = ((req as any).user as AuthPayload).id;

    if (!originalURL) {
      res.status(400).json({ error: "originalURL is required" });
      return;
    }

    const shortCode = generateCode();
    const expiry = expiresAt ? new Date(expiresAt) : null;
    const result = await createNewUrl(originalURL, shortCode, userId, expiry);
    const shortUrl = `${req.protocol}://${req.get("host")}/${result.shortCode}`;

    const responseObj: Record<string, unknown> = { shortUrl, id: result.id };
    if (generateQR === true) {
      responseObj.qrCode = await QRCode.toDataURL(originalURL);
    }

    res.status(201).json(responseObj);
  } catch (error) {
    console.error("Create short URL error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ─── Redirect (public — no auth) ───────────────────────────────────

const getOriginalUrl = async (
  req: Request<{ shortCode: string }>,
  res: Response
): Promise<void> => {
  try {
    const { shortCode } = req.params;
    const result = await getUrlForRedirect(shortCode);

    if (!result) {
      res.status(404).send("URL not found or has expired");
      return;
    }

    // Redirect immediately
    res.redirect(302, result.originalURL);

    // Fire-and-forget: record click analytics
    const ip = req.ip || "unknown";
    const ua = req.headers["user-agent"];
    const geo = lookupIp(ip);
    const parsed = parseUserAgent(ua);

    recordClick({
      urlId: result.id,
      ipAddress: ip,
      country: geo.country,
      city: geo.city,
      deviceType: parsed.deviceType,
      os: parsed.os,
      browser: parsed.browser,
      userAgent: ua,
    }).catch((err) => console.error("Record click error:", err));
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ─── List User URLs (auth required) ────────────────────────────────

const getUserUrls = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = ((req as any).user as AuthPayload).id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getUrlsByUserId(userId, page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error("Get user URLs error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ─── Get URL Detail (auth required) ────────────────────────────────

const getUrlDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const urlId = req.params.id as string;
    const userId = ((req as any).user as AuthPayload).id;

    const url = await getUrlById(urlId, userId);
    if (!url) {
      res.status(404).json({ error: "URL not found" });
      return;
    }

    res.status(200).json(url);
  } catch (error) {
    console.error("Get URL detail error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ─── Update URL (auth required) ────────────────────────────────────

const updateUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const urlId = req.params.id as string;
    const userId = ((req as any).user as AuthPayload).id;
    const { originalURL, expiresAt } = req.body;

    const data: { originalURL?: string; expiresAt?: Date | null } = {};
    if (originalURL !== undefined) data.originalURL = originalURL;
    if (expiresAt !== undefined)
      data.expiresAt = expiresAt ? new Date(expiresAt) : null;

    const updated = await updateUrlModel(urlId, userId, data);
    if (!updated) {
      res.status(404).json({ error: "URL not found" });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update URL error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ─── Delete URL (auth required) ────────────────────────────────────

const deleteUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const urlId = req.params.id as string;
    const userId = ((req as any).user as AuthPayload).id;

    const deleted = await deleteUrlModel(urlId, userId);
    if (!deleted) {
      res.status(404).json({ error: "URL not found" });
      return;
    }

    res.status(200).json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error("Delete URL error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ─── Health Check ───────────────────────────────────────────────────

const checkHealth = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    await check();
    res.status(200).json({ status: "active", database: "connected" });
  } catch (error: any) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "error",
      database: "disconnected",
      details: error?.message || "Unknown error",
    });
  }
};

export {
  createShortUrl,
  getOriginalUrl,
  getUserUrls,
  getUrlDetail,
  updateUrl,
  deleteUrl,
  checkHealth,
};
