import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { langPath, useLang } from "../hooks/useLang";

export function AdmissionsPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const link = (p: string) => langPath(lang, p);
  const steps = ["s1", "s2", "s3", "s4", "s5"] as const;
  const docs = ["d1", "d2", "d3", "d4"] as const;

  return (
    <>
      <Seo title={`${t("admissions.title")} | ${t("brand.short")}`} description={t("admissions.sub")} lang={lang} path="/admissions" />
      <PageHero title={t("admissions.title")} subtitle={t("admissions.sub")} crumbs={[{ label: t("nav.admissions") }]} />
      <section className="section">
        <div className="container" style={{ maxWidth: "44rem" }}>
          <h2>{t("admissions.whoTitle")}</h2>
          <p>{t("admissions.who")}</p>
          <h2>{t("admissions.stepsTitle")}</h2>
          <ol>
            {steps.map((s) => (
              <li key={s}>{t(`admissions.${s}`)}</li>
            ))}
          </ol>
          <h2>{t("admissions.docsTitle")}</h2>
          <ul>
            {docs.map((d) => (
              <li key={d}>{t(`admissions.${d}`)}</li>
            ))}
          </ul>
          <div className="btn-row" style={{ marginTop: "var(--space-5)" }}>
            <Link className="btn btn-primary" to={link("/assessment")}>
              {t("admissions.cta")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
