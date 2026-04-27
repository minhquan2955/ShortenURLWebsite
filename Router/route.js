import express from "express";
import {
  createShortUrl,
  getOriginalUrl,
  client,
} from "../Controller/urlController.js";
import { rateLimit } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
const router = express.Router();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 20, // Limit each IP to 20 requests per `window` (here, per 10 minutes).
  standardHeaders: "draft-8", // send `RateLimit` header let clients know they have how many requests
  legacyHeaders: false, // Disable the old headers.
  ipv6Subnet: 56, // Gom nhóm các IP cùng 1 subnet áp dụng limit
  store: new RedisStore({
    //lưu trữ số lần đã POST repuest của từng IP trên redis thay vì RAM
    sendCommand: (...args) => client.sendCommand(args), //chọn redis client để gửi lệnh
    prefix: "rl:shorten:", // tạo key với từng IP lưu vào redis: rl:shorten:IP
  }),
  message: {
    error: "Too many short URLs created! Please try again later.",
  },
});
//Create short URL/QrCode
router.post("/shorten", limiter, createShortUrl); //Put rate limit for POST request

//Get original Url
router.get("/:shortCode", getOriginalUrl);

export default router;
