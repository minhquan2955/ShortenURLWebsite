import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "../generated/prisma/index.js";
import crypto from "crypto";
import QRCode from "qrcode";
import redis from "redis";

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
client.on("error", (err) => console.error(`Redis error: ${err}`));
await client.connect();

const generateCode = () => crypto.randomBytes(4).toString("base64url");
const createShortUrl = async (req, res) => {
  try {
    const { originalURL, generateQR } = req.body;
    if (!originalURL) {
      return res.status(400).json({ error: "Bad request" });
    }
    const shortCode = generateCode();
    const result = await prisma.url.create({
      data: { originalURL, shortCode },
    });
    const shortUrl = `http://localhost:8000/${result.shortCode}`;
    const responseObj = { shortUrl };
    if (generateQR === true) {
      responseObj.qrCode = await QRCode.toDataURL(originalURL);
    }
    res.status(201).json(responseObj);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOriginalUrl = async (req, res) => {
  const { shortCode } = req.params;
  const cacheKey = `cache:url:${shortCode}`;
  const cacheUrl = await client.get(cacheKey);
  if (cacheUrl) {
    // Url đã tồn tại trong cache
    prisma.url
      .update({
        where: { shortCode },
        data: { accessCounter: { increment: 1 } },
      })
      .catch((err) => console.error("Update counter error: ", err));
    return res.redirect(301, cacheUrl);
  }
  //Url ko tồn tại trong cache
  const record = await prisma.url.findUnique({ where: { shortCode } });
  if (record) {
    await client.setEx(cacheKey, 10800, record.originalURL);
    await prisma.url.update({
      where: { id: record.id },
      data: {
        accessCounter: { increment: 1 },
      },
    });
    return res.status(301).redirect(record.originalURL);
  }
  //ko tồn tại trong cache và db
  res.status(404).send("URL not found");
};

export { createShortUrl, getOriginalUrl, client };
