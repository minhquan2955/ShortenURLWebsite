import express from "express";
import { createShortUrl, getOriginalUrl } from "../Controller/urlController.js";
import limiter from "../Middleware/rateLimiter.js";
const router = express.Router();

//Create short URL/QrCode
router.post("/shorten", limiter, createShortUrl); //Put rate limit for POST request

//Get original Url
router.get("/:shortCode", getOriginalUrl);

export default router;
