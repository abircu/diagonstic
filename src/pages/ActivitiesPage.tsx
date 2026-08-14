import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { media } from "../assets/media";
import { useLang } from "../hooks/useLang";

export function ActivitiesPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const items = ["dance", "art", "hydro", "yoga", "play", "outings"] as const;
  const imgs = [media.school.one, media.school.two];

  return (
    <>
      <Seo title={`${t("activities.title")} | ${t("brand.short")}`} description={t("activities.sub")} lang={lang} path="/activities" />
      <PageHero
        title={t("activities.title")}
        subtitle={t("activities.sub")}
        crumbs={[{ label: t("nav.activities") }]}
        image={media.school.two}
      />
      <section className="section">
        <div className="container card-grid cols-3">
          {items.map((id, i) => (
            <article key={id} className="surface-card media-card">
              <img src={imgs[i % imgs.length]} alt="" loading="lazy" />
              <div className="media-card-body">
                <h3>{t(`activities.items.${id}`)}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
