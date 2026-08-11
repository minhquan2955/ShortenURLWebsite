import prisma from "./prismaClient.js";

interface UrlRecord {
  id: string;
  originalURL: string;
  shortCode: string;
  accessCounter: number;
  isActive: boolean;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface RedirectResult {
  id: string;
  originalURL: string;
}

// ─── Create URL ─────────────────────────────────────────────────────

const createNewUrl = async (
  originalURL: string,
  shortCode: string,
  userId: string,
  expiresAt?: Date | null
) => {
  return await prisma.url.create({
    data: {
      originalURL,
      shortCode,
      userId,
      expiresAt: expiresAt ?? null,
    },
  });
};

// ─── Get URL for redirect (with expiry check) ──────────────────────

const getUrlForRedirect = async (
  shortCode: string
): Promise<RedirectResult | null> => {
  const record = await prisma.url.findUnique({ where: { shortCode } });

  if (!record) return null;
  if (!record.isActive) return null;
  if (record.expiresAt && record.expiresAt < new Date()) return null;

  // Increment counter
  await prisma.url.update({
    where: { id: record.id },
    data: { accessCounter: { increment: 1 } },
  });

  return {
    id: record.id,
    originalURL: record.originalURL,
  };
};

// ─── User URL Management ────────────────────────────────────────────

const getUrlsByUserId = async (
  userId: string,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;
  const [urls, total] = await Promise.all([
    prisma.url.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.url.count({ where: { userId } }),
  ]);

  return {
    urls,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

const getUrlById = async (
  id: string,
  userId: string
): Promise<UrlRecord | null> => {
  return await prisma.url.findFirst({
    where: { id, userId },
  });
};

const updateUrl = async (
  id: string,
  userId: string,
  data: { originalURL?: string; expiresAt?: Date | null }
) => {
  // Verify ownership
  const url = await prisma.url.findFirst({ where: { id, userId } });
  if (!url) return null;

  const updated = await prisma.url.update({
    where: { id },
    data,
  });

  return updated;
};

const deleteUrl = async (
  id: string,
  userId: string
): Promise<boolean> => {
  const url = await prisma.url.findFirst({ where: { id, userId } });
  if (!url) return false;

  await prisma.url.delete({ where: { id } });

  return true;
};

// ─── Health Check ───────────────────────────────────────────────────

const check = async () => {
  return await prisma.$queryRaw`SELECT 1`;
};

export {
  createNewUrl,
  getUrlForRedirect,
  getUrlsByUserId,
  getUrlById,
  updateUrl,
  deleteUrl,
  check,
};
export type { UrlRecord, RedirectResult };
