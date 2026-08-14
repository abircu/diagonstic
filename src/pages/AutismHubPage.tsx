import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { Seo } from "../seo/Seo";
import { orgJsonLd } from "../seo/jsonLd";
import { media } from "../assets/media";
import { useAsyncData } from "../hooks/useAsyncData";
import { asLocalized, fetchPrograms, fetchTherapies } from "../services/content";
import { langPath, localized, useLang } from "../hooks/useLang";

export function AutismHubPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const link = (p: string) => langPath(lang, p);
  const schoolImgs = [media.school.one, media.school.two];
  const { data: therapies, loading: therapyLoading } = useAsyncData(() => fetchTherapies(), []);
  const { data: programs, loading: programLoading } = useAsyncData(() => fetchPrograms(), []);

  return (
    <>
      <Seo
        title={`${t("autism.title")} | ${t("brand.short")}`}
        description={t("autism.sub")}
        lang={lang}
        path="/autism"
        jsonLd={orgJsonLd(lang)}
      />
      <PageHero
        title={t("autism.title")}
        subtitle={t("autism.sub")}
        crumbs={[{ label: t("nav.autism") }]}
        image={media.school.one}
      />
      <section className="section">
        <div className="container btn-row" style={{ marginBottom: "var(--space-6)" }}>
          <Link className="btn btn-primary" to={link("/assessment")}>
            {t("nav.assessment")}
          </Link>
          <Link className="btn btn-secondary" to={link("/admissions")}>
            {t("autism.ctaAdmissions")}
          </Link>
        </div>

        <Reveal>
          <div className="container">
            <div className="section-head">
              <h2>{t("autism.pathwayTitle")}</h2>
            </div>
            <div className="card-grid cols-3">
              <article className="surface-card media-card">
                <img src={media.school.one} alt="" loading="lazy" />
                <div className="media-card-body">
                  <span className="chip">A</span>
                  <h3>{t("autism.pathA")}</h3>
                  {therapyLoading ? (
                    <p>{t("common.loading")}</p>
                  ) : (
                    <ul>
                      {(therapies ?? []).slice(0, 5).map((th) => (
                        <li key={th.slug}>{localized(asLocalized(th.name), lang)}</li>
                      ))}
                    </ul>
                  )}
                  <Link to={link("/therapy")}>{t("autism.ctaTherapy")} →</Link>
                </div>
              </article>
              <article className="surface-card media-card">
                <img src={media.school.two} alt="" loading="lazy" />
                <div className="media-card-body">
                  <span className="chip">B</span>
                  <h3>{t("autism.pathB")}</h3>
                  {programLoading ? (
                    <p>{t("common.loading")}</p>
                  ) : (
                    <ul>
                      {(programs ?? []).slice(0, 4).map((p) => (
                        <li key={p.slug}>{localized(asLocalized(p.name), lang)}</li>
                      ))}
                    </ul>
                  )}
                  <Link to={link("/programs")}>{t("autism.ctaPrograms")} →</Link>
                </div>
              </article>
              <article className="surface-card media-card">
                <img src={media.diagnostic.four} alt="" loading="lazy" />
                <div className="media-card-body">
                  <span className="chip">C</span>
                  <h3>{t("autism.pathC")}</h3>
                  <ul>
                    <li>{t("activities.items.dance")}</li>
                    <li>{t("activities.items.hydro")}</li>
                    <li>{t("activities.items.play")}</li>
                    <li>{t("activities.items.outings")}</li>
                  </ul>
                  <Link to={link("/activities")}>{t("nav.activities")} →</Link>
                </div>
              </article>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="container" style={{ marginTop: "var(--space-7)" }}>
            <div className="section-head">
              <h2>{t("therapy.title")}</h2>
            </div>
            {therapyLoading ? (
              <p className="empty-note">{t("common.loading")}</p>
            ) : (
              <div className="card-grid cols-3">
                {(therapies ?? [])
                  .filter((x) => x.featured)
                  .map((th, i) => (
                    <article key={th.slug} className="surface-card media-card">
                      <img src={schoolImgs[i % schoolImgs.length]} alt="" loading="lazy" />
                      <div className="media-card-body">
                        <h3>
                          <Link className="title-link" to={link(`/therapy/${th.slug}`)}>
                            {localized(asLocalized(th.name), lang)}
                          </Link>
                        </h3>
                        <p>{localized(asLocalized(th.summary), lang)}</p>
                      </div>
                    </article>
                  ))}
              </div>
            )}
          </div>
        </Reveal>

        <Reveal>
          <div className="container" style={{ marginTop: "var(--space-7)" }}>
            <div className="section-head">
              <h2>{t("programs.title")}</h2>
            </div>
            {programLoading ? (
              <p className="empty-note">{t("common.loading")}</p>
            ) : (
              <div className="card-grid cols-3">
                {(programs ?? [])
                  .filter((x) => x.featured)
                  .map((p, i) => (
                    <article key={p.slug} className="surface-card media-card">
                      <img src={schoolImgs[i % schoolImgs.length]} alt="" loading="lazy" />
                      <div className="media-card-body">
                        <span className="chip">{localized(asLocalized(p.age), lang)}</span>
                        <h3>
                          <Link className="title-link" to={link(`/programs/${p.slug}`)}>
                            {localized(asLocalized(p.name), lang)}
                          </Link>
                        </h3>
                        <p>{localized(asLocalized(p.summary), lang)}</p>
                      </div>
                    </article>
                  ))}
              </div>
            )}
          </div>
        </Reveal>
      </section>
    </>
  );
}
