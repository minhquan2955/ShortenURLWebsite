import { rateLimit } from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import client from "../Model/redisClient.js";

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 20, // Limit each IP to 20 requests per `window` (here, per 10 minutes).
  standardHeaders: "draft-8", // send `RateLimit` header let clients know they have how many requests
  legacyHeaders: false, // Disable the old headers.
  ipv6Subnet: 56, // Gom nhóm các IP cùng 1 subnet áp dụng limit
  store: new RedisStore({
    sendCommand: (...args: string[]) => client.sendCommand(args),
    prefix: "rl:shorten:",
  }),
  message: {
    error: "Too many short URLs created! Please try again later.",
  },
});

export default limiter;
