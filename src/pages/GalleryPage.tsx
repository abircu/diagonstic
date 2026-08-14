import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { diagnosticGallery, schoolGallery } from "../assets/media";
import { useLang } from "../hooks/useLang";
import "./Gallery.css";

export function GalleryPage() {
  const { t } = useTranslation();
  const lang = useLang();

  const items = [
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

  return (
    <>
      <Seo title={`${t("gallery.title")} | ${t("brand.short")}`} description={t("gallery.sub")} lang={lang} path="/gallery" />
      <PageHero
        title={t("gallery.title")}
        subtitle={t("gallery.sub")}
        crumbs={[{ label: t("nav.gallery") }]}
        image={schoolGallery[0].src}
      />
      <section className="section">
        <div className="container gallery-grid">
          {items.map((g) => (
            <figure key={g.id} className="gallery-tile gallery-tile--photo">
              <img src={g.src} alt={g.title} loading="lazy" />
              <div className="gallery-tile-meta">
                <span className="chip">{t("gallery.photo")}</span>
                <figcaption>{g.title}</figcaption>
              </div>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
