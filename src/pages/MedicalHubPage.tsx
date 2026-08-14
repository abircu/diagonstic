import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { Seo } from "../seo/Seo";
import { orgJsonLd } from "../seo/jsonLd";
import { patientServices } from "../data/medical";
import { diagnosticGallery, media } from "../assets/media";
import { useAsyncData } from "../hooks/useAsyncData";
import {
  asLocalized,
  fetchDepartments,
  fetchDiagnostics,
  fetchPackages,
  fetchSpecialties,
} from "../services/content";
import { langPath, localized, useLang } from "../hooks/useLang";

export function MedicalHubPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const link = (p: string) => langPath(lang, p);
  const { data: specialties, loading: specLoading } = useAsyncData(() => fetchSpecialties(), []);
  const { data: departments, loading: deptLoading } = useAsyncData(() => fetchDepartments(), []);
  const { data: diagnostics, loading: diagLoading } = useAsyncData(() => fetchDiagnostics(), []);
  const { data: packages, loading: pkgLoading } = useAsyncData(() => fetchPackages(), []);

  return (
    <>
      <Seo
        title={`${t("medical.title")} | ${t("brand.short")}`}
        description={t("medical.sub")}
        lang={lang}
        path="/medical"
        jsonLd={orgJsonLd(lang)}
      />
      <PageHero
        title={t("medical.title")}
        subtitle={t("medical.sub")}
        crumbs={[{ label: t("nav.medical") }]}
        image={media.diagnostic.two}
      />
      <section className="section">
        <div className="container btn-row" style={{ marginBottom: "var(--space-6)" }}>
          <Link className="btn btn-primary" to={link("/doctors")}>
            {t("medical.ctaDoctors")}
          </Link>
          <Link className="btn btn-secondary" to={link("/appointment")}>
            {t("medical.ctaAppoint")}
          </Link>
          <Link className="btn btn-outline" to={link("/ambulance")}>
            {t("nav.ambulance")}
          </Link>
        </div>

        <Reveal>
          <div className="container">
            <div className="section-head">
              <h2>{t("medical.specialtiesTitle")}</h2>
            </div>
            {specLoading ? (
              <p className="empty-note">{t("common.loading")}</p>
            ) : (
              <div className="card-grid cols-3">
                {(specialties ?? []).map((s, i) => (
                  <article key={s.slug} className="surface-card media-card">
                    <img src={diagnosticGallery[i % diagnosticGallery.length].src} alt="" loading="lazy" />
                    <div className="media-card-body">
                      <h3>{localized(asLocalized(s.name), lang)}</h3>
                      <p>{localized(asLocalized(s.summary), lang)}</p>
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
              <h2>{t("medical.deptsTitle")}</h2>
              <p>
                <Link to={link("/departments")}>{t("common.viewAll")}</Link>
              </p>
            </div>
            {deptLoading ? (
              <p className="empty-note">{t("common.loading")}</p>
            ) : (
              <div className="card-grid cols-3">
                {(departments ?? []).slice(0, 6).map((d) => (
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
            )}
          </div>
        </Reveal>

        <Reveal>
          <div className="container" style={{ marginTop: "var(--space-7)" }}>
            <div className="section-head">
              <h2>{t("medical.diagnosticsTitle")}</h2>
              <p>
                <Link to={link("/diagnostics")}>{t("common.viewAll")}</Link>
              </p>
            </div>
            {diagLoading ? (
              <p className="empty-note">{t("common.loading")}</p>
            ) : (
              <div className="card-grid cols-3">
                {(diagnostics ?? []).map((d, i) => (
                  <article key={d.slug} className="surface-card media-card">
                    <img
                      src={d.image_url || diagnosticGallery[i % diagnosticGallery.length].src}
                      alt=""
                      loading="lazy"
                    />
                    <div className="media-card-body">
                      <h3>{localized(asLocalized(d.name), lang)}</h3>
                      <p>{localized(asLocalized(d.summary), lang)}</p>
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
              <h2>{t("medical.packagesTitle")}</h2>
              <p>
                <Link to={link("/packages")}>{t("common.viewAll")}</Link>
              </p>
            </div>
            {pkgLoading ? (
              <p className="empty-note">{t("common.loading")}</p>
            ) : (
              <div className="card-grid cols-3">
                {(packages ?? []).map((p) => (
                  <article key={p.slug} className="surface-card">
                    <h3>{localized(asLocalized(p.name), lang)}</h3>
                    <p>{localized(asLocalized(p.summary), lang)}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        <Reveal>
          <div className="container" style={{ marginTop: "var(--space-7)" }}>
            <div className="section-head">
              <h2>{t("medical.servicesTitle")}</h2>
            </div>
            <div className="card-grid cols-4">
              {patientServices.map((s) => (
                <article key={s.slug} className="surface-card">
                  <h3>
                    {s.slug === "ambulance" ? (
                      <Link className="title-link" to={link("/ambulance")}>
                        {localized(s.name, lang)}
                      </Link>
                    ) : (
                      localized(s.name, lang)
                    )}
                  </h3>
                  <p>{localized(s.summary, lang)}</p>
                </article>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
