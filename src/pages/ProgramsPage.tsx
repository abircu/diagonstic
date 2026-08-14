import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { useAsyncData } from "../hooks/useAsyncData";
import { asLocalized, fetchPrograms } from "../services/content";
import { langPath, localized, useLang } from "../hooks/useLang";

export function ProgramsPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const link = (p: string) => langPath(lang, p);
  const { data: programs, loading, error } = useAsyncData(() => fetchPrograms(), []);

  return (
    <>
      <Seo title={`${t("programs.title")} | ${t("brand.short")}`} description={t("programs.sub")} lang={lang} path="/programs" />
      <PageHero title={t("programs.title")} subtitle={t("programs.sub")} crumbs={[{ label: t("nav.programs") }]} />
      <section className="section">
        <div className="container">
          {loading ? <p className="empty-note">{t("common.loading")}</p> : null}
          {error ? <p className="empty-note">{error}</p> : null}
          <div className="card-grid cols-3">
            {(programs ?? []).map((p) => (
              <article key={p.slug} className="surface-card">
                <span className="chip">{localized(asLocalized(p.age), lang)}</span>
                <h3>
                  <Link className="title-link" to={link(`/programs/${p.slug}`)}>
                    {localized(asLocalized(p.name), lang)}
                  </Link>
                </h3>
                <p>{localized(asLocalized(p.summary), lang)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
