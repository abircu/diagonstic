import { Helmet } from "react-helmet-async";
import { siteConfig } from "../config/site";
import type { Lang } from "../config/site";

type Props = {
  title: string;
  description: string;
  lang: Lang;
  /** Path without language prefix, e.g. "" or "/about" */
  path: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

export function Seo({ title, description, lang, path, jsonLd }: Props) {
  const bare = path === "/" ? "" : path;
  const enUrl = `${siteConfig.url}/en${bare}`;
  const bnUrl = `${siteConfig.url}/bn${bare}`;
  const canonical = lang === "bn" ? bnUrl : enUrl;

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={enUrl} />
      <link rel="alternate" hrefLang="bn" href={bnUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={siteConfig.brand} />
      <meta name="twitter:card" content="summary_large_image" />
      {jsonLd ? <script type="application/ld+json">{JSON.stringify(jsonLd)}</script> : null}
    </Helmet>
  );
}
