import prisma from "./prismaClient.js";

interface ClickData {
  urlId: string;
  ipAddress?: string;
  country?: string | null;
  city?: string | null;
  deviceType?: string;
  os?: string;
  browser?: string;
  userAgent?: string;
}

interface StatRow {
  label: string;
  count: number;
}

interface TimeSeriesRow {
  date: string;
  count: number;
}

interface DateRange {
  from?: Date;
  to?: Date;
}

// ─── Record a click (fire-and-forget) ───────────────────────────────

const recordClick = async (data: ClickData): Promise<void> => {
  await prisma.urlClick.create({
    data: {
      urlId: data.urlId,
      ipAddress: data.ipAddress,
      country: data.country ?? undefined,
      city: data.city ?? undefined,
      deviceType: data.deviceType,
      os: data.os,
      browser: data.browser,
      userAgent: data.userAgent,
    },
  });
};

// ─── Build date filter ──────────────────────────────────────────────

const buildDateFilter = (range: DateRange) => {
  const filter: { gte?: Date; lte?: Date } = {};
  if (range.from) filter.gte = range.from;
  if (range.to) filter.lte = range.to;
  return Object.keys(filter).length ? { clickedAt: filter } : {};
};

// ─── Summary ────────────────────────────────────────────────────────

const getClickSummary = async (urlId: string, range: DateRange) => {
  const dateFilter = buildDateFilter(range);

  const [totalClicks, uniqueCountries, topDevice, topBrowser] =
    await Promise.all([
      prisma.urlClick.count({
        where: { urlId, ...dateFilter },
      }),
      prisma.urlClick.groupBy({
        by: ["country"],
        where: { urlId, country: { not: null }, ...dateFilter },
      }),
      prisma.urlClick.groupBy({
        by: ["deviceType"],
        where: { urlId, deviceType: { not: null }, ...dateFilter },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 1,
      }),
      prisma.urlClick.groupBy({
        by: ["browser"],
        where: { urlId, browser: { not: null }, ...dateFilter },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 1,
      }),
    ]);

  return {
    totalClicks,
    uniqueCountries: uniqueCountries.length,
    topDevice: topDevice[0]?.deviceType ?? "N/A",
    topBrowser: topBrowser[0]?.browser ?? "N/A",
  };
};

// ─── Geo Stats ──────────────────────────────────────────────────────

const getGeoStats = async (
  urlId: string,
  range: DateRange
): Promise<StatRow[]> => {
  const dateFilter = buildDateFilter(range);

  const result = await prisma.urlClick.groupBy({
    by: ["country"],
    where: { urlId, country: { not: null }, ...dateFilter },
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 20,
  });

  return result.map((r: { country: string | null; _count: { id: number } }) => ({
    label: r.country || "Unknown",
    count: r._count.id,
  }));
};

// ─── Device Stats ───────────────────────────────────────────────────

const getDeviceStats = async (
  urlId: string,
  range: DateRange
): Promise<{ devices: StatRow[]; browsers: StatRow[]; oses: StatRow[] }> => {
  const dateFilter = buildDateFilter(range);

  const [devices, browsers, oses] = await Promise.all([
    prisma.urlClick.groupBy({
      by: ["deviceType"],
      where: { urlId, deviceType: { not: null }, ...dateFilter },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
    prisma.urlClick.groupBy({
      by: ["browser"],
      where: { urlId, browser: { not: null }, ...dateFilter },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    prisma.urlClick.groupBy({
      by: ["os"],
      where: { urlId, os: { not: null }, ...dateFilter },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
  ]);

  return {
    devices: devices.map((d: { deviceType: string | null; _count: { id: number } }) => ({
      label: d.deviceType || "Unknown",
      count: d._count.id,
    })),
    browsers: browsers.map((b: { browser: string | null; _count: { id: number } }) => ({
      label: b.browser || "Unknown",
      count: b._count.id,
    })),
    oses: oses.map((o: { os: string | null; _count: { id: number } }) => ({
      label: o.os || "Unknown",
      count: o._count.id,
    })),
  };
};

// ─── Timeline ───────────────────────────────────────────────────────

const getTimeline = async (
  urlId: string,
  interval: string,
  range: DateRange
): Promise<TimeSeriesRow[]> => {
  // Build WHERE clause
  const conditions: string[] = [`"urlId" = '${urlId}'`];
  if (range.from) conditions.push(`"clickedAt" >= '${range.from.toISOString()}'`);
  if (range.to) conditions.push(`"clickedAt" <= '${range.to.toISOString()}'`);
  const where = conditions.join(" AND ");

  // Choose date_trunc interval
  let trunc = "day";
  if (interval === "hour") trunc = "hour";
  else if (interval === "week") trunc = "week";
  else if (interval === "month") trunc = "month";

  const result = await prisma.$queryRawUnsafe<
    { date: Date; count: bigint }[]
  >(
    `SELECT date_trunc('${trunc}', "clickedAt") as date, COUNT(*)::bigint as count
     FROM "UrlClick"
     WHERE ${where}
     GROUP BY date
     ORDER BY date ASC`
  );

  return result.map((r: { date: Date; count: bigint }) => ({
    date: r.date.toISOString(),
    count: Number(r.count),
  }));
};

export {
  recordClick,
  getClickSummary,
  getGeoStats,
  getDeviceStats,
  getTimeline,
};
export type { ClickData, StatRow, TimeSeriesRow, DateRange };
