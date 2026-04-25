import express from "express";
import { createShortUrl, getOriginalUrl } from "../Controller/urlController.js";

const router = express.Router();

//Create short URL/QrCode
router.post("/shorten", createShortUrl);

//Get original Url
router.get("/:shortCode", getOriginalUrl);

export default router;
