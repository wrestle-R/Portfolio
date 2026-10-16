export const ROOT_DOMAIN = "russeldanielpaul.is-a.dev";
export const BLOG_URL = import.meta.env.DEV ? "http://localhost:4321" : "https://blogs.russel.is-a.dev";

export const buildSubdomainUrl = (subdomain) => {
  const cleanSubdomain = (subdomain || "").trim().toLowerCase();

  if (!cleanSubdomain) {
    return `https://${ROOT_DOMAIN}`;
  }

  return `https://${cleanSubdomain}.${ROOT_DOMAIN}`;
};
