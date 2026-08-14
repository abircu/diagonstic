import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { useAsyncData } from "../hooks/useAsyncData";
import { asLocalized, fetchPackages } from "../services/content";
import type { Localized } from "../lib/database.types";
import { localized, useLang } from "../hooks/useLang";

export function PackagesPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const { data: packages, loading, error } = useAsyncData(() => fetchPackages(), []);

  return (
    <>
      <Seo title={`${t("packages.title")} | ${t("brand.short")}`} description={t("packages.sub")} lang={lang} path="/packages" />
      <PageHero title={t("packages.title")} subtitle={t("packages.sub")} crumbs={[{ label: t("nav.packages") }]} />
      <section className="section">
        <div className="container">
          {error ? <p className="empty-note">{error}</p> : null}
          {loading ? (
            <p className="empty-note">{t("common.loading")}</p>
          ) : (
            <div className="card-grid cols-3">
              {(packages ?? []).map((p) => (
                <article key={p.slug} className="surface-card">
                  <h3>{localized(asLocalized(p.name), lang)}</h3>
                  <p>{localized(asLocalized(p.summary), lang)}</p>
                  <h4>{t("packages.includes")}</h4>
                  <ul>
                    {((p.includes as Localized[]) ?? []).map((item, idx) => (
                      <li key={`${asLocalized(item).en}-${idx}`}>{localized(asLocalized(item), lang)}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
