export function normalizeBrowser(name?: string): string {
  if (!name) return "Unknown";

  const n = name.toLowerCase();

  if (n.includes("chrome")) return "Chrome";
  if (n.includes("chromium")) return "Chrome";
  if (n.includes("firefox")) return "Firefox";
  if (n.includes("safari")) return "Safari";
  if (n.includes("edge")) return "Microsoft Edge";
  if (n.includes("opera")) return "Opera";
  if (n.includes("samsung")) return "Samsung Browser";
  if (n.includes("brave")) return "Brave";

  // Future browsers pass through safely
  return name;
}

export function normalizeOS(name?: string): string {
  if (!name) return "Unknown";

  const n = name.toLowerCase();

  if (n.includes("windows")) return "Windows";
  if (n.includes("android")) return "Android";
  if (n.includes("ios")) return "iOS";
  if (n.includes("mac")) return "macOS";
  if (n.includes("linux")) return "Linux";

  // Future OSes pass through safely
  return name;
}
