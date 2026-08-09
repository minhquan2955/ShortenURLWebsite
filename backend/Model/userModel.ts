import prisma from "./prismaClient.js";
import type { User, RefreshToken } from "../generated/prisma/index.js";

// ─── User Operations ────────────────────────────────────────────────

const createUser = async (
  email: string,
  passwordHash: string,
  name?: string
): Promise<User> => {
  return await prisma.user.create({
    data: { email, passwordHash, name },
  });
};

const findUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { email } });
};

const findUserById = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({ where: { id } });
};

const findOrCreateOAuthUser = async (
  provider: string,
  providerId: string,
  email: string,
  name?: string
): Promise<User> => {
  // Try to find existing user by provider + providerId
  const existing = await prisma.user.findUnique({
    where: { provider_providerId: { provider, providerId } },
  });
  if (existing) return existing;

  // Try to find by email (link accounts)
  const byEmail = await prisma.user.findUnique({ where: { email } });
  if (byEmail) {
    return await prisma.user.update({
      where: { id: byEmail.id },
      data: { provider, providerId },
    });
  }

  // Create new user
  return await prisma.user.create({
    data: { email, name, provider, providerId },
  });
};

// ─── Refresh Token Operations ───────────────────────────────────────

const createRefreshToken = async (
  userId: string,
  token: string,
  expiresAt: Date
): Promise<RefreshToken> => {
  return await prisma.refreshToken.create({
    data: { userId, token, expiresAt },
  });
};

const findRefreshToken = async (
  token: string
): Promise<(RefreshToken & { user: User }) | null> => {
  return await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true },
  });
};

const deleteRefreshToken = async (token: string): Promise<void> => {
  await prisma.refreshToken.delete({ where: { token } }).catch(() => {});
};

const deleteAllRefreshTokens = async (userId: string): Promise<void> => {
  await prisma.refreshToken.deleteMany({ where: { userId } });
};

export {
  createUser,
  findUserByEmail,
  findUserById,
  findOrCreateOAuthUser,
  createRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
  deleteAllRefreshTokens,
};
