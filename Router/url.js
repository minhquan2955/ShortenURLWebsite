import express from "express";
import {
  createShortUrl,
  getOriginalUrl,
  checkHealth,
} from "../Controller/urlController.js";
import limiter from "../Middleware/rateLimiter.js";
const router = express.Router();

//Create short URL/QrCode
router.post("/shorten", limiter, createShortUrl); //Put rate limit for POST request

//Maintain Supabase and Render work
router.get("/health", checkHealth);

//Get original Url (must be LAST — /:shortCode matches any path)
router.get("/:shortCode", getOriginalUrl);
export default router;
