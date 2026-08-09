import { UAParser } from "ua-parser-js";

interface UaResult {
  deviceType: string;
  os: string;
  browser: string;
}

const parseUserAgent = (uaString: string | undefined): UaResult => {
  if (!uaString) {
    return { deviceType: "unknown", os: "unknown", browser: "unknown" };
  }

  const parser = new UAParser(uaString);
  const result = parser.getResult();

  // Map device type
  let deviceType = "desktop";
  if (result.device.type === "mobile") deviceType = "mobile";
  else if (result.device.type === "tablet") deviceType = "tablet";

  return {
    deviceType,
    os: result.os.name || "unknown",
    browser: result.browser.name || "unknown",
  };
};

export { parseUserAgent };
export type { UaResult };
