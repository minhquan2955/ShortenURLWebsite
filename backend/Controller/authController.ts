import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import type { Request, Response } from "express";
import {
  createUser,
  findUserByEmail,
  findUserById,
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  deleteAllRefreshTokens,
} from "../Model/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "15m";
const JWT_REFRESH_EXPIRY_DAYS = parseInt(
  process.env.JWT_REFRESH_EXPIRY_DAYS || "7",
  10
);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ─── Helpers ────────────────────────────────────────────────────────

const generateAccessToken = (userId: string, email: string): string => {
  const payload = { id: userId, email };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRY as string,
  } as jwt.SignOptions);
};

const generateRefreshTokenValue = (): string => {
  return crypto.randomBytes(40).toString("hex");
};

const setRefreshTokenCookie = (res: Response, token: string): void => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: JWT_REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    path: "/",
  });
};

// ─── Register ───────────────────────────────────────────────────────

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    if (typeof password !== "string" || password.length < 8) {
      res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
      return;
    }

    // Check if email already registered
    const existing = await findUserByEmail(email);
    if (existing) {
      res.status(409).json({ error: "Email is already registered" });
      return;
    }

    // Hash password & create user
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser(email, passwordHash, name);

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshTokenValue = generateRefreshTokenValue();
    const expiresAt = new Date(
      Date.now() + JWT_REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );
    await createRefreshToken(user.id, refreshTokenValue, expiresAt);

    setRefreshTokenCookie(res, refreshTokenValue);
    res.status(201).json({
      accessToken,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ─── Login ──────────────────────────────────────────────────────────

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await findUserByEmail(email);
    if (!user || !user.passwordHash) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshTokenValue = generateRefreshTokenValue();
    const expiresAt = new Date(
      Date.now() + JWT_REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );
    await createRefreshToken(user.id, refreshTokenValue, expiresAt);

    setRefreshTokenCookie(res, refreshTokenValue);
    res.status(200).json({
      accessToken,
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ─── Refresh Token ──────────────────────────────────────────────────

const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      res.status(401).json({ error: "No refresh token provided" });
      return;
    }

    const record = await findRefreshToken(token);
    if (!record || record.expiresAt < new Date()) {
      // Delete stale token if exists
      if (record) await deleteRefreshToken(token);
      res.status(401).json({ error: "Invalid or expired refresh token" });
      return;
    }

    // Token rotation: delete old, create new
    await deleteRefreshToken(token);

    const newAccessToken = generateAccessToken(
      record.user.id,
      record.user.email
    );
    const newRefreshTokenValue = generateRefreshTokenValue();
    const expiresAt = new Date(
      Date.now() + JWT_REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );
    await createRefreshToken(record.user.id, newRefreshTokenValue, expiresAt);

    setRefreshTokenCookie(res, newRefreshTokenValue);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ─── Logout ─────────────────────────────────────────────────────────

const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      await deleteRefreshToken(token);
    }
    res.clearCookie("refreshToken", { path: "/" });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ─── Get Current User ───────────────────────────────────────────────

const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user is set by authMiddleware
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const user = await findUserById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ─── Google OAuth Callback Handler ──────────────────────────────────

const googleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.redirect(`${FRONTEND_URL}/login?error=oauth_failed`);
      return;
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id, user.email);
    const refreshTokenValue = generateRefreshTokenValue();
    const expiresAt = new Date(
      Date.now() + JWT_REFRESH_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );
    await createRefreshToken(user.id, refreshTokenValue, expiresAt);

    setRefreshTokenCookie(res, refreshTokenValue);

    // Redirect to frontend with accessToken in URL
    res.redirect(`${FRONTEND_URL}/login?token=${accessToken}`);
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(`${FRONTEND_URL}/login?error=server_error`);
  }
};

export { register, login, refresh, logout, getMe, googleCallback };
