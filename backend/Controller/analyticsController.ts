import type { Request, Response } from "express";
import {
  getClickSummary,
  getGeoStats,
  getDeviceStats,
  getTimeline,
} from "../Model/clickModel.js";
import prisma from "../Model/prismaClient.js";
import type { DateRange } from "../Model/clickModel.js";
import type { AuthPayload } from "../Middleware/authMiddleware.js";

// ─── Helpers ────────────────────────────────────────────────────────

const parseDateRange = (req: Request): DateRange => {
  const range: DateRange = {};
  const from = req.query.from;
  const to = req.query.to;
  if (typeof from === "string") range.from = new Date(from);
  if (typeof to === "string") range.to = new Date(to);
  return range;
};

const verifyUrlOwnership = async (
  urlId: string,
  userId: string
): Promise<boolean> => {
  const url = await prisma.url.findFirst({
    where: { id: urlId, userId },
  });
  return url !== null;
};

// ─── Summary ────────────────────────────────────────────────────────

const getSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = ((req as any).user as AuthPayload).id;

    if (!(await verifyUrlOwnership(id, userId))) {
      res.status(404).json({ error: "URL not found" });
      return;
    }

    const range = parseDateRange(req);
    const summary = await getClickSummary(id, range);
    res.status(200).json(summary);
  } catch (error) {
    console.error("Analytics summary error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ─── Geo ────────────────────────────────────────────────────────────

const getGeo = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = ((req as any).user as AuthPayload).id;

    if (!(await verifyUrlOwnership(id, userId))) {
      res.status(404).json({ error: "URL not found" });
      return;
    }

    const range = parseDateRange(req);
    const geo = await getGeoStats(id, range);
    res.status(200).json(geo);
  } catch (error) {
    console.error("Analytics geo error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ─── Devices ────────────────────────────────────────────────────────

const getDevices = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = ((req as any).user as AuthPayload).id;

    if (!(await verifyUrlOwnership(id, userId))) {
      res.status(404).json({ error: "URL not found" });
      return;
    }

    const range = parseDateRange(req);
    const devices = await getDeviceStats(id, range);
    res.status(200).json(devices);
  } catch (error) {
    console.error("Analytics devices error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ─── Timeline ───────────────────────────────────────────────────────

const getTimelineData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = ((req as any).user as AuthPayload).id;

    if (!(await verifyUrlOwnership(id, userId))) {
      res.status(404).json({ error: "URL not found" });
      return;
    }

    const range = parseDateRange(req);
    const interval =
      typeof req.query.interval === "string" ? req.query.interval : "day";
    const timeline = await getTimeline(id, interval, range);
    res.status(200).json(timeline);
  } catch (error) {
    console.error("Analytics timeline error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { getSummary, getGeo, getDevices, getTimelineData };
