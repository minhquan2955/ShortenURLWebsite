import crypto from "crypto";
import QRCode from "qrcode";
import {
  createNewUrl,
  updateAccessCounter,
  updateAccessCounterNoCache,
  check,
} from "../Model/urlModel.js";
const generateCode = () => crypto.randomBytes(4).toString("base64url");
const createShortUrl = async (req, res) => {
  try {
    const { originalURL, generateQR } = req.body;
    if (!originalURL) {
      return res.status(400).json({ error: "Bad request" });
    }
    const shortCode = generateCode();
    const result = await createNewUrl(originalURL, shortCode);
    const shortUrl = `${req.protocol}://${req.get("host")}/${result.shortCode}`;
    const responseObj = { shortUrl };
    if (generateQR === true) {
      responseObj.qrCode = await QRCode.toDataURL(originalURL);
    }
    res.status(201).json(responseObj);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOriginalUrl = async (req, res) => {
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

const checkHealth = async (req, res) => {
  try {
    await check();
    res.status(200).json({ status: "active", database: "connected" });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "error",
      database: "disconnected",
      details: error.message,
    });
  }
};
export { createShortUrl, getOriginalUrl, checkHealth };
