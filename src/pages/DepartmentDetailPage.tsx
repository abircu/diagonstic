import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { useAsyncData } from "../hooks/useAsyncData";
import { asLocalized, fetchDepartmentBySlug, fetchDoctors } from "../services/content";
import { langPath, localized, useLang } from "../hooks/useLang";

export function DepartmentDetailPage() {
  const { slug = "" } = useParams();
  const { t } = useTranslation();
  const lang = useLang();
  const link = (p: string) => langPath(lang, p);
  const { data: dept, loading, error } = useAsyncData(() => fetchDepartmentBySlug(slug), [slug]);
  const { data: doctors } = useAsyncData(() => fetchDoctors(), []);

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p className="empty-note">{t("common.loading")}</p>
        </div>
      </section>
    );
  }

  if (error || !dept) {
    return (
      <section className="section">
        <div className="container">
          <h1>{t("common.notFound")}</h1>
          <Link to={link("/departments")}>{t("common.back")}</Link>
        </div>
      </section>
    );
  }

  const name = localized(asLocalized(dept.name), lang);
  const related = (doctors ?? []).filter((d) => d.department_slug === dept.slug);

  return (
    <>
      <Seo
        title={`${name} | ${t("brand.short")}`}
        description={localized(asLocalized(dept.summary), lang)}
        lang={lang}
        path={`/departments/${dept.slug}`}
      />
      <PageHero
        title={name}
        subtitle={localized(asLocalized(dept.summary), lang)}
        crumbs={[
          { label: t("nav.departments"), to: link("/departments") },
          { label: name },
        ]}
      />
      <section className="section">
        <div className="container" style={{ maxWidth: "44rem" }}>
          <p>{localized(asLocalized(dept.body), lang)}</p>
          <div className="btn-row" style={{ margin: "var(--space-5) 0" }}>
            <Link className="btn btn-primary" to={link(`/appointment?department=${dept.slug}`)}>
              {t("nav.appointment")}
            </Link>
          </div>
          {related.length ? (
            <>
              <h2>{t("common.related")}</h2>
              <ul>
                {related.map((d) => (
                  <li key={d.slug}>
                    <Link to={link(`/doctors/${d.slug}`)}>{localized(asLocalized(d.name), lang)}</Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </section>
    </>
  );
}
