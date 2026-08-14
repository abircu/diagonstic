import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { useAsyncData } from "../hooks/useAsyncData";
import { asLocalized, fetchDepartments } from "../services/content";
import { langPath, localized, useLang } from "../hooks/useLang";

export function DepartmentsPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const link = (p: string) => langPath(lang, p);
  const { data: departments, loading, error } = useAsyncData(() => fetchDepartments(), []);

  return (
    <>
      <Seo title={`${t("departments.title")} | ${t("brand.short")}`} description={t("departments.sub")} lang={lang} path="/departments" />
      <PageHero title={t("departments.title")} subtitle={t("departments.sub")} crumbs={[{ label: t("nav.departments") }]} />
      <section className="section">
        <div className="container">
          {loading ? <p className="empty-note">{t("common.loading")}</p> : null}
          {error ? <p className="empty-note">{error}</p> : null}
          <div className="card-grid cols-3">
            {(departments ?? []).map((d) => (
              <article key={d.slug} className="surface-card">
                <h3>
                  <Link className="title-link" to={link(`/departments/${d.slug}`)}>
                    {localized(asLocalized(d.name), lang)}
                  </Link>
                </h3>
                <p>{localized(asLocalized(d.summary), lang)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
