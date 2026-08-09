import maxmind, { CityResponse, Reader } from "maxmind";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface GeoResult {
  country: string | null;
  city: string | null;
}

let reader: Reader<CityResponse> | null = null;

const initGeoDb = async (): Promise<void> => {
  try {
    const dbPath = path.join(__dirname, "..", "data", "GeoLite2-City.mmdb");
    reader = await maxmind.open<CityResponse>(dbPath);
    console.log("✅ GeoLite2-City database loaded");
  } catch (error) {
    console.warn(
      "⚠️  GeoLite2-City.mmdb not found. Geo lookups will return null.",
      (error as Error).message
    );
  }
};

const lookupIp = (ip: string): GeoResult => {
  if (!reader) return { country: null, city: null };

  // Skip private / localhost IPs
  if (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.")
  ) {
    return { country: null, city: null };
  }

  try {
    const result = reader.get(ip);
    if (!result) return { country: null, city: null };

    return {
      country: result.country?.names?.en ?? null,
      city: result.city?.names?.en ?? null,
    };
  } catch {
    return { country: null, city: null };
  }
};

export { initGeoDb, lookupIp };
export type { GeoResult };
