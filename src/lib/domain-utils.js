export const ROOT_DOMAIN = "russeldanielpaul.is-a.dev";
export const BLOG_URL = "https://blogs.russel.is-a.dev";

export const buildSubdomainUrl = (subdomain) => {
  const cleanSubdomain = (subdomain || "").trim().toLowerCase();

  if (!cleanSubdomain) {
    return `https://${ROOT_DOMAIN}`;
  }

  return `https://${cleanSubdomain}.${ROOT_DOMAIN}`;
};
