import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { findOrCreateOAuthUser } from "../Model/userModel.js";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const OAUTH_CALLBACK_BASE_URL =
  process.env.OAUTH_CALLBACK_BASE_URL || "http://localhost:8080";

const configurePassport = (): void => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn(
      "⚠️  Google OAuth credentials not set. Google login will be disabled."
    );
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${OAUTH_CALLBACK_BASE_URL}/api/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email =
            profile.emails && profile.emails[0]
              ? profile.emails[0].value
              : "";
          if (!email) {
            return done(new Error("No email returned from Google"), undefined);
          }

          const user = await findOrCreateOAuthUser(
            "google",
            profile.id,
            email,
            profile.displayName
          );

          done(null, user);
        } catch (error) {
          done(error as Error, undefined);
        }
      }
    )
  );

  // Passport serialization is not needed since we use JWT, not sessions
  passport.serializeUser((user: any, done) => done(null, user));
  passport.deserializeUser((user: any, done) => done(null, user));
};

export default configurePassport;
