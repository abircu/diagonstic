import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { useAsyncData } from "../hooks/useAsyncData";
import { asLocalized, fetchTherapies } from "../services/content";
import { langPath, localized, useLang } from "../hooks/useLang";

export function TherapyPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const link = (p: string) => langPath(lang, p);
  const { data: therapies, loading, error } = useAsyncData(() => fetchTherapies(), []);

  return (
    <>
      <Seo title={`${t("therapy.title")} | ${t("brand.short")}`} description={t("therapy.sub")} lang={lang} path="/therapy" />
      <PageHero title={t("therapy.title")} subtitle={t("therapy.sub")} crumbs={[{ label: t("nav.therapy") }]} />
      <section className="section">
        <div className="container">
          {loading ? <p className="empty-note">{t("common.loading")}</p> : null}
          {error ? <p className="empty-note">{error}</p> : null}
          <div className="card-grid cols-3">
            {(therapies ?? []).map((th) => (
              <article key={th.slug} className="surface-card">
                <h3>
                  <Link className="title-link" to={link(`/therapy/${th.slug}`)}>
                    {localized(asLocalized(th.name), lang)}
                  </Link>
                </h3>
                <p>{localized(asLocalized(th.summary), lang)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
