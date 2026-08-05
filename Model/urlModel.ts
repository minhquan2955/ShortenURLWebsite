import prisma from "./prismaClient.js";
import client from "./redisClient.js";

const CACHE_TTL = 10800; // 3 hours

interface CacheResult {
  originalURL: string;
  fromCached?: boolean;
}

const createNewUrl = async (originalURL: string, shortCode: string) => {
  return await prisma.url.create({
    data: { originalURL, shortCode },
  });
};

const updateAccessCounter = async (
  shortCode: string
): Promise<CacheResult | null> => {
  const cacheKey = `cache:url:${shortCode}`;
  const cacheUrl = await client.get(cacheKey);

  // Found in cache
  if (cacheUrl) {
    prisma.url
      .update({
        where: { shortCode },
        data: { accessCounter: { increment: 1 } },
      })
      .catch((err: Error) => console.error(`Update counter error: ${err}`));
    return { originalURL: cacheUrl, fromCached: true };
  }

  // Fallback to DB
  const record = await prisma.url.findUnique({
    where: { shortCode },
  });

  if (record) {
    await client.setEx(cacheKey, CACHE_TTL, record.originalURL);
    await prisma.url.update({
      where: { id: record.id },
      data: { accessCounter: { increment: 1 } },
    });
    return { originalURL: record.originalURL, fromCached: false };
  }

  // Not Found
  return null;
};

const updateAccessCounterNoCache = async (
  shortCode: string
): Promise<CacheResult | null> => {
  const record = await prisma.url.findUnique({
    where: { shortCode },
  });

  if (record) {
    await prisma.url.update({
      where: { id: record.id },
      data: { accessCounter: { increment: 1 } },
    });
    return { originalURL: record.originalURL };
  }

  // Not Found
  return null;
};

const check = async () => {
  return await prisma.$queryRaw`SELECT 1`;
};

export { createNewUrl, updateAccessCounter, updateAccessCounterNoCache, check };
