import { useLayoutEffect, useMemo } from "react";

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  noindex?: boolean;
  /** JSON-LD schemas injected in <head> (kept in sync with the page state) */
  jsonLd?: Record<string, unknown>[];
  /** unique marker used to clean up this page's JSON-LD scripts */
  jsonLdKey?: string;
}

const BASE_URL = "https://petserpentes.com.br";

export function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

/**
 * Writes SEO tags directly into document.head (no Helmet), so metadata is always
 * in sync with the rendered page — including loading/error states and hard reloads.
 */
export function SEO({
  title,
  description,
  canonical,
  ogImage,
  noindex = false,
  jsonLd,
  jsonLdKey = "page",
}: SEOProps) {
  const canonicalUrl = `${BASE_URL}${canonical}`;
  const serializedJsonLd = useMemo(
    () => (jsonLd && jsonLd.length ? jsonLd.map((schema) => JSON.stringify(schema)) : []),
    [jsonLd]
  );

  useLayoutEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, follow" : "index, follow");
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);

    let canonicalTag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.rel = "canonical";
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.href = canonicalUrl;

    if (ogImage) {
      upsertMeta("property", "og:image", ogImage);
      upsertMeta("name", "twitter:image", ogImage);
    } else {
      document.head.querySelector('meta[property="og:image"]')?.remove();
      document.head.querySelector('meta[name="twitter:image"]')?.remove();
    }

    const selector = `script[data-page-seo="${jsonLdKey}"]`;
    document.head.querySelectorAll(selector).forEach((script) => script.remove());
    serializedJsonLd.forEach((json) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.pageSeo = jsonLdKey;
      script.textContent = json;
      document.head.appendChild(script);
    });

    return () => {
      document.head.querySelectorAll(selector).forEach((script) => script.remove());
    };
  }, [title, description, canonicalUrl, ogImage, noindex, serializedJsonLd, jsonLdKey]);

  return null;
}
