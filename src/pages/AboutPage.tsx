import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { useLang } from "../hooks/useLang";

export function AboutPage() {
  const { t } = useTranslation();
  const lang = useLang();

  return (
    <>
      <Seo title={`${t("about.title")} | ${t("brand.short")}`} description={t("about.sub")} lang={lang} path="/about" />
      <PageHero title={t("about.title")} subtitle={t("about.sub")} crumbs={[{ label: t("nav.about") }]} />
      <section className="section">
        <div className="container card-grid cols-3">
          <article className="surface-card">
            <h2>{t("about.missionTitle")}</h2>
            <p>{t("about.mission")}</p>
          </article>
          <article className="surface-card">
            <h2>{t("about.visionTitle")}</h2>
            <p>{t("about.vision")}</p>
          </article>
          <article className="surface-card">
            <h2>{t("about.valuesTitle")}</h2>
            <p>{t("about.values")}</p>
          </article>
        </div>
        <div className="container" style={{ marginTop: "var(--space-7)", maxWidth: "44rem" }}>
          <h2>{t("about.timelineTitle")}</h2>
          <ol>
            <li>
              <strong>2018</strong> — {t("about.t1")}
            </li>
            <li>
              <strong>2020</strong> — {t("about.t2")}
            </li>
            <li>
              <strong>2022</strong> — {t("about.t3")}
            </li>
            <li>
              <strong>2024+</strong> — {t("about.t4")}
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}
