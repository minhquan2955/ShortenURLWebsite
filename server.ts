import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import router from "./backend/Router/url.js";
import authRouter from "./backend/Router/auth.js";
import configurePassport from "./backend/Config/passportConfig.js";
import { initGeoDb } from "./backend/Service/geoService.js";

const app = express();
const PORT = process.env.PORT || 8000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

// ─── Middleware ──────────────────────────────────────────────────────

app.set("trust proxy", 1);
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true, // Allow cookies (refresh token)
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ─── Passport ───────────────────────────────────────────────────────

configurePassport();
app.use(passport.initialize());

// ─── Routes ─────────────────────────────────────────────────────────

app.use("/api/auth", authRouter);
app.use("/", router);

// ─── Startup ────────────────────────────────────────────────────────

const start = async () => {
  // Load GeoIP database (non-blocking — warns if missing)
  await initGeoDb();

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
};

start();
