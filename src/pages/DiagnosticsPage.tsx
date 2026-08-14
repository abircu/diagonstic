import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { diagnosticGallery } from "../assets/media";
import { useAsyncData } from "../hooks/useAsyncData";
import { asLocalized, fetchDiagnostics } from "../services/content";
import { localized, useLang } from "../hooks/useLang";

export function DiagnosticsPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const { data: diagnostics, loading, error } = useAsyncData(() => fetchDiagnostics(), []);

  return (
    <>
      <Seo title={`${t("diagnostics.title")} | ${t("brand.short")}`} description={t("diagnostics.sub")} lang={lang} path="/diagnostics" />
      <PageHero
        title={t("diagnostics.title")}
        subtitle={t("diagnostics.sub")}
        crumbs={[{ label: t("nav.diagnostics") }]}
        image={diagnosticGallery[0].src}
      />
      <section className="section">
        <div className="container">
          {error ? <p className="empty-note">{error}</p> : null}
          {loading ? (
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
      </section>
    </>
  );
}
