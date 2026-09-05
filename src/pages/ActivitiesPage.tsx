import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { media } from "../assets/media";
import { useAsyncData } from "../hooks/useAsyncData";
import { asLocalized, fetchActivities } from "../services/content";
import { localized, useLang } from "../hooks/useLang";

const fallbackKeys = ["dance", "art", "hydro", "yoga", "play", "outings"] as const;

export function ActivitiesPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const { data, loading } = useAsyncData(() => fetchActivities(), []);
  const imgs = [media.school.one, media.school.two];

  const cms = data ?? [];
  const useCms = cms.length > 0;

  return (
    <>
      <Seo title={`${t("activities.title")} | ${t("brand.short")}`} description={t("activities.sub")} lang={lang} path="/activities" />
      <PageHero
        title={t("activities.title")}
        subtitle={t("activities.sub")}
        crumbs={[{ label: t("nav.activities") }]}
        image={cms[0]?.image_url || media.school.two}
      />
      <section className="section">
        <div className="container card-grid cols-3">
          {loading ? <p className="empty-note">{t("common.loading")}</p> : null}
          {!loading && useCms
            ? cms.map((item, i) => (
                <article key={item.id} className="surface-card media-card">
                  <img src={item.image_url || imgs[i % imgs.length]} alt="" loading="lazy" />
                  <div className="media-card-body">
                    <h3>{localized(asLocalized(item.title), lang)}</h3>
                  </div>
                </article>
              ))
            : !loading
              ? fallbackKeys.map((id, i) => (
                  <article key={id} className="surface-card media-card">
                    <img src={imgs[i % imgs.length]} alt="" loading="lazy" />
                    <div className="media-card-body">
                      <h3>{t(`activities.items.${id}`)}</h3>
                    </div>
                  </article>
                ))
              : null}
        </div>
      </section>
    </>
  );
}
