import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  noindex?: boolean;
}

const BASE_URL = "https://petserpentes.com.br";

export function SEO({ title, description, canonical, ogImage, noindex = false }: SEOProps) {
  const canonicalUrl = `${BASE_URL}${canonical}`;
  const robotsContent = noindex ? "noindex, follow" : "index, follow";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      {ogImage && <meta property="og:image" content={ogImage} />}
    </Helmet>
  );
}
