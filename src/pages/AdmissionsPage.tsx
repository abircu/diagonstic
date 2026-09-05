import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { useAsyncData } from "../hooks/useAsyncData";
import { asLocalized, fetchAdmissionsPage } from "../services/content";
import { langPath, localized, useLang } from "../hooks/useLang";

export function AdmissionsPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const link = (p: string) => langPath(lang, p);
  const { data, loading } = useAsyncData(() => fetchAdmissionsPage(), []);

  const title = (data ? localized(asLocalized(data.title), lang) : "") || t("admissions.title");
  const sub = (data ? localized(asLocalized(data.subtitle), lang) : "") || t("admissions.sub");
  const whoTitle = (data ? localized(asLocalized(data.who_title), lang) : "") || t("admissions.whoTitle");
  const whoBody = (data ? localized(asLocalized(data.who_body), lang) : "") || t("admissions.who");
  const stepsTitle = (data ? localized(asLocalized(data.steps_title), lang) : "") || t("admissions.stepsTitle");
  const docsTitle = (data ? localized(asLocalized(data.docs_title), lang) : "") || t("admissions.docsTitle");
  const ctaLabel = (data ? localized(asLocalized(data.cta_label), lang) : "") || t("admissions.cta");
  const ctaLink = data?.cta_link?.trim() || "/assessment";

  const steps = Array.isArray(data?.steps) ? data!.steps : null;
  const docs = Array.isArray(data?.docs) ? data!.docs : null;
  const fallbackSteps = ["s1", "s2", "s3", "s4", "s5"] as const;
  const fallbackDocs = ["d1", "d2", "d3", "d4"] as const;

  return (
    <>
      <Seo title={`${title} | ${t("brand.short")}`} description={sub} lang={lang} path="/admissions" />
      <PageHero title={title} subtitle={sub} crumbs={[{ label: t("nav.admissions") }]} />
      <section className="section">
        <div className="container" style={{ maxWidth: "44rem" }}>
          {loading ? (
            <p className="empty-note">{t("common.loading")}</p>
          ) : (
            <>
              <h2>{whoTitle}</h2>
              <p>{whoBody}</p>
              <h2>{stepsTitle}</h2>
              <ol>
                {steps && steps.length > 0
                  ? steps.map((s, i) => <li key={i}>{localized(asLocalized(s), lang)}</li>)
                  : fallbackSteps.map((s) => <li key={s}>{t(`admissions.${s}`)}</li>)}
              </ol>
              <h2>{docsTitle}</h2>
              <ul>
                {docs && docs.length > 0
                  ? docs.map((d, i) => <li key={i}>{localized(asLocalized(d), lang)}</li>)
                  : fallbackDocs.map((d) => <li key={d}>{t(`admissions.${d}`)}</li>)}
              </ul>
              <div className="btn-row" style={{ marginTop: "var(--space-5)" }}>
                <Link className="btn btn-primary" to={link(ctaLink)}>
                  {ctaLabel}
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
