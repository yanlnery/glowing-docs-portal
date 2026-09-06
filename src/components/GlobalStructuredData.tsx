import { useLayoutEffect } from "react";

const BASE_URL = "https://petserpentes.com.br";

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Pet Serpentes & Companhia",
  legalName: "Pet Serpentes & Companhia LTDA",
  url: `${BASE_URL}/`,
  logo: `${BASE_URL}/lovable-uploads/7cf1001e-0989-475f-aaf5-fb56c4fb22a4.png`,
  email: "contato@petserpentes.com.br",
  telephone: "+55 21 96780-2174",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Duque de Caxias",
    addressRegion: "RJ",
    addressCountry: "BR",
  },
  identifier: [
    {
      "@type": "PropertyValue",
      name: "CTF IBAMA",
      value: "6654937",
    },
  ],
  sameAs: [
    "https://www.instagram.com/petserpentes/",
    "https://www.youtube.com/@PETSerpentes",
  ],
};

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BASE_URL}/#localbusiness`,
  name: "Pet Serpentes & Companhia",
  description:
    "Criadouro comercial legalizado de répteis nativos brasileiros, certificado pelo IBAMA (CTF nº 6654937) e licenciado pelo INEA-RJ.",
  url: `${BASE_URL}/`,
  image: `${BASE_URL}/lovable-uploads/7cf1001e-0989-475f-aaf5-fb56c4fb22a4.png`,
  telephone: "+55 21 96780-2174",
  email: "contato@petserpentes.com.br",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Duque de Caxias",
    addressRegion: "RJ",
    addressCountry: "BR",
  },
  areaServed: "BR",
  parentOrganization: { "@id": `${BASE_URL}/#organization` },
  sameAs: [
    "https://www.instagram.com/petserpentes/",
    "https://www.youtube.com/@PETSerpentes",
  ],
};

/** Site-wide Organization + LocalBusiness JSON-LD, present on every page. */
export default function GlobalStructuredData() {
  useLayoutEffect(() => {
    const selector = 'script[data-global-seo="true"]';
    document.head.querySelectorAll(selector).forEach((s) => s.remove());
    [organization, localBusiness].forEach((schema) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.globalSeo = "true";
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
    return () => {
      document.head.querySelectorAll(selector).forEach((s) => s.remove());
    };
  }, []);

  return null;
}
