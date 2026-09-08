/**
 * Snapshot of the head metadata shipped in index.html, captured once at module
 * load (before any page SEO component mutates document.head).
 * Page SEO components restore it on unmount, so routes without their own
 * metadata never inherit the previous page's title/description/canonical.
 */

const META_KEYS: Array<{ attribute: "name" | "property"; key: string }> = [
  { attribute: "name", key: "description" },
  { attribute: "name", key: "robots" },
  { attribute: "property", key: "og:type" },
  { attribute: "property", key: "og:title" },
  { attribute: "property", key: "og:description" },
  { attribute: "property", key: "og:url" },
  { attribute: "property", key: "og:image" },
  { attribute: "name", key: "twitter:title" },
  { attribute: "name", key: "twitter:description" },
  { attribute: "name", key: "twitter:image" },
];

interface HeadSnapshot {
  title: string;
  metas: Record<string, string | null>;
  canonical: string | null;
}

const snapshotKey = (attribute: string, key: string) => `${attribute}|${key}`;

const captureSnapshot = (): HeadSnapshot => {
  const metas: Record<string, string | null> = {};
  META_KEYS.forEach(({ attribute, key }) => {
    const element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
    metas[snapshotKey(attribute, key)] = element ? element.content : null;
  });
  return {
    title: document.title,
    metas,
    canonical:
      document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? null,
  };
};

const defaults: HeadSnapshot =
  typeof document !== "undefined"
    ? captureSnapshot()
    : { title: "", metas: {}, canonical: null };

/** Default social share image declared in index.html (absolute URL). */
export const DEFAULT_OG_IMAGE =
  defaults.metas[snapshotKey("property", "og:image")] ||
  "https://petserpentes.com.br/lovable-uploads/7cf1001e-0989-475f-aaf5-fb56c4fb22a4.png";

/** Restores the head metadata exactly as it was served in index.html. */
export function restoreSeoDefaults() {
  if (typeof document === "undefined") return;

  document.title = defaults.title;

  META_KEYS.forEach(({ attribute, key }) => {
    const value = defaults.metas[snapshotKey(attribute, key)];
    const element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
    if (value === null || value === undefined) {
      element?.remove();
      return;
    }
    if (element) {
      element.content = value;
      return;
    }
    const created = document.createElement("meta");
    created.setAttribute(attribute, key);
    created.content = value;
    document.head.appendChild(created);
  });

  const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (defaults.canonical) {
    if (canonical) {
      canonical.href = defaults.canonical;
    } else {
      const created = document.createElement("link");
      created.rel = "canonical";
      created.href = defaults.canonical;
      document.head.appendChild(created);
    }
  } else {
    canonical?.remove();
  }
}
