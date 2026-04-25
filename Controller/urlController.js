import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
const { Pool } = pg;
import { PrismaClient } from "../generated/prisma/index.js";
import crypto from "crypto";
import QRCode from "qrcode";
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
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
  const record = await prisma.url.findUnique({ where: { shortCode } });
  if (record) {
    await prisma.url.update({
      where: { id: record.id },
      data: {
        accessCounter: { increment: 1 },
      },
    });
    return res.status(302).redirect(record.originalURL);
  }
  res.status(404).send("URL not found");
};

export { createShortUrl, getOriginalUrl };
