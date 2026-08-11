import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 20, // Limit each IP to 20 requests per `window` (here, per 10 minutes).
  standardHeaders: "draft-8", // send `RateLimit` header let clients know they have how many requests
  legacyHeaders: false, // Disable the old headers.
  ipv6Subnet: 56, // Gom nhóm các IP cùng 1 subnet áp dụng limit
  message: {
    error: "Too many short URLs created! Please try again later.",
  },
});

export default limiter;
