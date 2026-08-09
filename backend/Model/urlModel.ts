import prisma from "./prismaClient.js";
import client from "./redisClient.js";

const CACHE_TTL = 10800; // 3 hours

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
  fromCached: boolean;
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

// ─── Get URL for redirect (with cache + expiry check) ───────────────

const getUrlForRedirect = async (
  shortCode: string
): Promise<RedirectResult | null> => {
  const cacheKey = `cache:url:${shortCode}`;

  // Check cache first
  const cached = await client.get(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as {
        id: string;
        originalURL: string;
        isActive: boolean;
        expiresAt: string | null;
      };

      // Check if expired or inactive
      if (!parsed.isActive) return null;
      if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date())
        return null;

      // Fire-and-forget increment
      prisma.url
        .update({
          where: { shortCode },
          data: { accessCounter: { increment: 1 } },
        })
        .catch((err: Error) =>
          console.error(`Update counter error: ${err}`)
        );

      return {
        id: parsed.id,
        originalURL: parsed.originalURL,
        fromCached: true,
      };
    } catch {
      // Invalid cache entry — fall through to DB
    }
  }

  // Fallback to DB
  const record = await prisma.url.findUnique({ where: { shortCode } });

  if (!record) return null;
  if (!record.isActive) return null;
  if (record.expiresAt && record.expiresAt < new Date()) return null;

  // Cache the record
  await client.setEx(
    cacheKey,
    CACHE_TTL,
    JSON.stringify({
      id: record.id,
      originalURL: record.originalURL,
      isActive: record.isActive,
      expiresAt: record.expiresAt?.toISOString() ?? null,
    })
  );

  // Increment counter
  await prisma.url.update({
    where: { id: record.id },
    data: { accessCounter: { increment: 1 } },
  });

  return {
    id: record.id,
    originalURL: record.originalURL,
    fromCached: false,
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

  // Invalidate cache
  await client.del(`cache:url:${url.shortCode}`).catch(() => {});

  return updated;
};

const deleteUrl = async (
  id: string,
  userId: string
): Promise<boolean> => {
  const url = await prisma.url.findFirst({ where: { id, userId } });
  if (!url) return false;

  await prisma.url.delete({ where: { id } });

  // Invalidate cache
  await client.del(`cache:url:${url.shortCode}`).catch(() => {});

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
