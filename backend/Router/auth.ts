import express from "express";
import passport from "passport";
import {
  register,
  login,
  refresh,
  logout,
  getMe,
  googleCallback,
} from "../Controller/authController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const authRouter = express.Router();

// Local auth
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
authRouter.get("/me", authMiddleware, getMe);

// Google OAuth
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:3000"}/login?error=oauth_failed`,
  }),
  googleCallback
);

export default authRouter;
