import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { diagnosticGallery, schoolGallery } from "../assets/media";
import { useAsyncData } from "../hooks/useAsyncData";
import { asLocalized, fetchGalleryItems } from "../services/content";
import { localized, useLang } from "../hooks/useLang";
import "./Gallery.css";

export function GalleryPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const { data, loading } = useAsyncData(() => fetchGalleryItems(), []);

  const cmsItems = (data ?? [])
    .filter((g) => g.image_url)
    .map((g) => ({
      id: g.id,
      src: g.image_url as string,
      title: localized(asLocalized(g.title), lang),
      kind: g.kind,
    }));

  const fallbackItems = [
    ...diagnosticGallery.map((item, i) => ({
      id: `d-${item.key}`,
      src: item.src,
      title: lang === "bn" ? `ডায়াগনস্টিক ${i + 1}` : `Diagnostics ${i + 1}`,
      kind: "photo" as const,
    })),
    ...schoolGallery.map((item, i) => ({
      id: `s-${item.key}`,
      src: item.src,
      title: lang === "bn" ? `স্কুল ${i + 1}` : `School ${i + 1}`,
      kind: "photo" as const,
    })),
  ];

  const items = cmsItems.length > 0 ? cmsItems : fallbackItems;
  const heroImage = items[0]?.src || schoolGallery[0].src;

  return (
    <>
      <Seo title={`${t("gallery.title")} | ${t("brand.short")}`} description={t("gallery.sub")} lang={lang} path="/gallery" />
      <PageHero title={t("gallery.title")} subtitle={t("gallery.sub")} crumbs={[{ label: t("nav.gallery") }]} image={heroImage} />
      <section className="section">
        <div className="container gallery-grid">
          {loading ? <p className="empty-note">{t("common.loading")}</p> : null}
          {!loading &&
            items.map((g) => (
              <figure key={g.id} className={`gallery-tile gallery-tile--${g.kind}`}>
                <img src={g.src} alt={g.title} loading="lazy" />
                <div className="gallery-tile-meta">
                  <span className="chip">{g.kind === "video" ? t("gallery.video") : t("gallery.photo")}</span>
                  <figcaption>{g.title}</figcaption>
                </div>
              </figure>
            ))}
        </div>
      </section>
    </>
  );
}
