import crypto from "crypto";
import QRCode from "qrcode";
import type { Request, Response } from "express";
import {
  createNewUrl,
  updateAccessCounter,
  check,
} from "../Model/urlModel.js";

interface CreateShortUrlRequestBody {
  originalURL?: string;
  generateQR?: boolean;
}

interface ResponseObj {
  shortUrl: string;
  qrCode?: string;
}

const generateCode = (): string => crypto.randomBytes(4).toString("base64url");

const createShortUrl = async (
  req: Request<{}, {}, CreateShortUrlRequestBody>,
  res: Response
): Promise<Response | void> => {
  try {
    const { originalURL, generateQR } = req.body;
    if (!originalURL) {
      return res.status(400).json({ error: "Bad request" });
    }
    const shortCode = generateCode();
    const result = await createNewUrl(originalURL, shortCode);
    const shortUrl = `${req.protocol}://${req.get("host")}/${result.shortCode}`;
    const responseObj: ResponseObj = { shortUrl };
    if (generateQR === true) {
      responseObj.qrCode = await QRCode.toDataURL(originalURL);
    }
    res.status(201).json(responseObj);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOriginalUrl = async (
  req: Request<{ shortCode: string }>,
  res: Response
): Promise<Response | void> => {
  try {
    const { shortCode } = req.params;
    const result = await updateAccessCounter(shortCode);
    if (result) {
      return res.redirect(302, result.originalURL);
    }
    res.status(404).send("URL not found");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const checkHealth = async (_req: Request, res: Response): Promise<Response | void> => {
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

export { createShortUrl, getOriginalUrl, checkHealth };
