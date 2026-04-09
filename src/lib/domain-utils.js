const STRIP_PREFIXES = new Set(["www", "blogs", "runny"]);
const FALLBACK_ROOT_DOMAIN = "russeldanielpaul.tech";

const isLocalHost = (hostname) => {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
};

export const getRootDomain = (hostname) => {
  if (!hostname || isLocalHost(hostname)) {
    return FALLBACK_ROOT_DOMAIN;
  }

  const labels = hostname.split(".").filter(Boolean);
  if (labels.length <= 1) {
    return FALLBACK_ROOT_DOMAIN;
  }

  if (STRIP_PREFIXES.has(labels[0])) {
    return labels.slice(1).join(".");
  }

  return hostname;
};

export const buildSubdomainUrl = (subdomain) => {
  const protocol = typeof window !== "undefined" && window.location?.protocol
    ? window.location.protocol
    : "https:";

  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const rootDomain = getRootDomain(hostname);
  const cleanSubdomain = (subdomain || "").trim().toLowerCase();

  if (!cleanSubdomain) {
    return `${protocol}//${rootDomain}`;
  }

  return `${protocol}//${cleanSubdomain}.${rootDomain}`;
};
