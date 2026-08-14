import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { useAsyncData } from "../hooks/useAsyncData";
import { asLocalized, fetchProgramBySlug, fetchPrograms } from "../services/content";
import { langPath, localized, useLang } from "../hooks/useLang";

export function ProgramDetailPage() {
  const { slug = "" } = useParams();
  const { t } = useTranslation();
  const lang = useLang();
  const link = (p: string) => langPath(lang, p);
  const { data: item, loading, error } = useAsyncData(() => fetchProgramBySlug(slug), [slug]);
  const { data: programs } = useAsyncData(() => fetchPrograms(), []);

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
          <Link to={link("/programs")}>{t("common.back")}</Link>
        </div>
      </section>
    );
  }

  const name = localized(asLocalized(item.name), lang);
  const related = (programs ?? []).filter((x) => x.slug !== item.slug).slice(0, 3);
  const benefits = Array.isArray(item.benefits) ? item.benefits : [];

  return (
    <>
      <Seo title={`${name} | ${t("brand.short")}`} description={localized(asLocalized(item.summary), lang)} lang={lang} path={`/programs/${item.slug}`} />
      <PageHero
        title={name}
        subtitle={localized(asLocalized(item.summary), lang)}
        crumbs={[
          { label: t("nav.programs"), to: link("/programs") },
          { label: name },
        ]}
      />
      <section className="section">
        <div className="container" style={{ maxWidth: "44rem" }}>
          <p>
            <span className="chip">{localized(asLocalized(item.age), lang)}</span>
          </p>
          <h2>{t("common.offer")}</h2>
          <p>{localized(asLocalized(item.offer), lang)}</p>
          <h2>{t("common.why")}</h2>
          <p>{localized(asLocalized(item.why), lang)}</p>
          <h2>{t("common.benefits")}</h2>
          <ul>
            {benefits.map((b, i) => (
              <li key={i}>{localized(asLocalized(b), lang)}</li>
            ))}
          </ul>
          <div className="btn-row" style={{ margin: "var(--space-5) 0" }}>
            <Link className="btn btn-primary" to={link("/admissions")}>
              {t("nav.admissions")}
            </Link>
            <Link className="btn btn-outline" to={link("/assessment")}>
              {t("nav.assessment")}
            </Link>
          </div>
          <h2>{t("common.related")}</h2>
          <ul>
            {related.map((r) => (
              <li key={r.slug}>
                <Link to={link(`/programs/${r.slug}`)}>{localized(asLocalized(r.name), lang)}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
