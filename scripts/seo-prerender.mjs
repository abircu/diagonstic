import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");
const siteUrl = "https://daig.example.com";

const staticRoutes = [
  "",
  "/about",
  "/contact",
  "/faq",
  "/team",
  "/gallery",
  "/medical",
  "/autism",
  "/doctors",
  "/departments",
  "/appointment",
  "/ambulance",
  "/packages",
  "/diagnostics",
  "/therapy",
  "/programs",
  "/admissions",
  "/assessment",
  "/activities",
  "/doctors/dr-rahman",
  "/doctors/dr-karim",
  "/doctors/dr-sultana",
  "/doctors/dr-hossain",
  "/doctors/ms-jahan",
  "/doctors/ms-akhtar",
  "/departments/cardiology",
  "/departments/pediatrics",
  "/departments/neurology",
  "/departments/psychiatry",
  "/departments/orthopedics",
  "/departments/neurosurgery",
  "/departments/emergency",
  "/departments/obgyn",
  "/departments/radiology",
  "/departments/laboratory",
  "/departments/dentistry",
  "/therapy/aba-therapy",
  "/therapy/speech-language-therapy",
  "/therapy/occupational-therapy",
  "/therapy/physiotherapy",
  "/therapy/psychological-counseling",
  "/therapy/behavior-management",
  "/therapy/comprehensive-assessment",
  "/programs/early-intervention",
  "/programs/pre-schooling",
  "/programs/special-education",
  "/programs/vocational-life-skills",
  "/programs/structured-academic-support",
];

const langs = ["en", "bn"];
const paths = langs.flatMap((lang) => staticRoutes.map((r) => (r ? `/${lang}${r}` : `/${lang}`)));

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths
  .map((path) => {
    const loc = `${siteUrl}${path}`;
    const bare = path.replace(/^\/(en|bn)/, "") || "";
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en${bare}" />
    <xhtml:link rel="alternate" hreflang="bn" href="${siteUrl}/bn${bare}" />
  </url>`;
  })
  .join("\n")}
</urlset>
`;

writeFileSync(join(root, "public", "sitemap.xml"), sitemap);
if (existsSync(dist)) {
  writeFileSync(join(dist, "sitemap.xml"), sitemap);
}

const indexHtmlPath = join(dist, "index.html");
if (existsSync(indexHtmlPath)) {
  const html = readFileSync(indexHtmlPath, "utf8");
  for (const path of paths) {
    const outDir = join(dist, path.replace(/^\//, ""));
    mkdirSync(outDir, { recursive: true });
    const routeHtml = html
      .replace(/<html lang=".*?">/, `<html lang="${path.startsWith("/bn") ? "bn" : "en"}">`)
      .replace(
        /<title>.*?<\/title>/,
        `<title>Daig Medical & Autism Care</title>`,
      );
    writeFileSync(join(outDir, "index.html"), routeHtml);
  }
  console.log(`Prerender shells written for ${paths.length} routes`);
} else {
  console.log("sitemap.xml written to public/ (dist not found yet)");
}
