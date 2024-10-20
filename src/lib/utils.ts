import { type ClassValue, clsx } from "clsx";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUrlWithProtocol(url: string) {
  return url.startsWith("http") ? url : `https://${url}`;
}

export function cleanUrl(url: string) {
  let newUrl = url;

  newUrl = newUrl.replace(/\/$/, ""); // Remove trailing slash
  newUrl = newUrl.split("#")[0]; // Remove hash
  newUrl = newUrl.split("?")[0]; // Remove search string

  return newUrl;
}

export function sanitizeFilename(url: string) {
  // Replace / with -
  url = url.replace(/\//g, "-");

  // Replace . with space
  url = url.replace(/\./g, "");

  // Remove special characters
  return slugify(url, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function getUrlWithoutProtocol(url: string) {
  // Remove "https://" if present
  let modifiedUrl = url.replace(/^https:\/\//i, "");

  // Remove "http://" if present
  modifiedUrl = modifiedUrl.replace(/^http:\/\//i, "");

  // Remove / if present last
  modifiedUrl = modifiedUrl.replace(/\/$/i, "");

  return modifiedUrl;
}

export function getDomainName(url: string) {
  return new URL(getUrlWithProtocol(url?.trim()))?.hostname;
}

export function getImageLinkFromAWS(key: string) {
  return `https://${process.env.AWS_CDN_HOSTNAME}/${key}`;
}

export function getSnippetHowToUse({
  host,
  domain,
}: {
  host: string;
  domain: string;
}) {
  return `<!-- Put in your <head> tag -->
<meta
  property="og:image"
  content="${getLinkSmartOGImage({ host, url: domain })}"
/>`;
}

export function getLinkSmartOGImage({
  host,
  url,
}: {
  host: string;
  url: string;
}) {
  return `https://${host}/api/get-image?url=${getUrlWithoutProtocol(url)}`;
}

export function getKeyPathsCache({
  functionName,
  value,
}: {
  functionName: string;
  value?: any;
}) {
  return `${functionName}-${value}`;
}

export function formatPrice(priceInCents: string) {
  const price = parseFloat(priceInCents);
  const dollars = price / 100;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    // Use minimumFractionDigits to handle cases like $59.00 -> $59
    minimumFractionDigits: dollars % 1 !== 0 ? 2 : 0,
  }).format(dollars);
}

export function formatDate(date: string | number | Date | null | undefined) {
  if (!date) return "";

  return new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
