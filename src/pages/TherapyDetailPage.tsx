import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { useAsyncData } from "../hooks/useAsyncData";
import { asLocalized, fetchTherapies, fetchTherapyBySlug } from "../services/content";
import { langPath, localized, useLang } from "../hooks/useLang";

export function TherapyDetailPage() {
  const { slug = "" } = useParams();
  const { t } = useTranslation();
  const lang = useLang();
  const link = (p: string) => langPath(lang, p);
  const { data: item, loading, error } = useAsyncData(() => fetchTherapyBySlug(slug), [slug]);
  const { data: therapies } = useAsyncData(() => fetchTherapies(), []);

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p className="empty-note">{t("common.loading")}</p>
        </div>
      </section>
    );
  }

  if (error || !item) {
    return (
      <section className="section">
        <div className="container">
          <h1>{t("common.notFound")}</h1>
          <Link to={link("/therapy")}>{t("common.back")}</Link>
        </div>
      </section>
    );
  }

  const name = localized(asLocalized(item.name), lang);
  const related = (therapies ?? []).filter((x) => x.slug !== item.slug).slice(0, 3);
  const benefits = Array.isArray(item.benefits) ? item.benefits : [];

  return (
    <>
      <Seo title={`${name} | ${t("brand.short")}`} description={localized(asLocalized(item.summary), lang)} lang={lang} path={`/therapy/${item.slug}`} />
      <PageHero
        title={name}
        subtitle={localized(asLocalized(item.summary), lang)}
        crumbs={[
          { label: t("nav.therapy"), to: link("/therapy") },
          { label: name },
        ]}
      />
      <section className="section">
        <div className="container" style={{ maxWidth: "44rem" }}>
          <h2>{t("common.what")}</h2>
          <p>{localized(asLocalized(item.what), lang)}</p>
          <h2>{t("common.how")}</h2>
          <p>{localized(asLocalized(item.how), lang)}</p>
          <h2>{t("common.benefits")}</h2>
          <ul>
            {benefits.map((b, i) => (
              <li key={i}>{localized(asLocalized(b), lang)}</li>
            ))}
          </ul>
          <div className="btn-row" style={{ margin: "var(--space-5) 0" }}>
            <Link className="btn btn-primary" to={link("/assessment")}>
              {t("nav.assessment")}
            </Link>
          </div>
          <h2>{t("common.related")}</h2>
          <ul>
            {related.map((r) => (
              <li key={r.slug}>
                <Link to={link(`/therapy/${r.slug}`)}>{localized(asLocalized(r.name), lang)}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
