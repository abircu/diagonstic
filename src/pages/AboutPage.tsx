import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { useAsyncData } from "../hooks/useAsyncData";
import { asLocalized, fetchAboutPage } from "../services/content";
import { localized, useLang } from "../hooks/useLang";

type TimelineItem = { year?: string; text?: unknown };

export function AboutPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const { data, loading } = useAsyncData(() => fetchAboutPage(), []);

  const title = (data ? localized(asLocalized(data.title), lang) : "") || t("about.title");
  const sub = (data ? localized(asLocalized(data.subtitle), lang) : "") || t("about.sub");
  const missionTitle = (data ? localized(asLocalized(data.mission_title), lang) : "") || t("about.missionTitle");
  const mission = (data ? localized(asLocalized(data.mission), lang) : "") || t("about.mission");
  const visionTitle = (data ? localized(asLocalized(data.vision_title), lang) : "") || t("about.visionTitle");
  const vision = (data ? localized(asLocalized(data.vision), lang) : "") || t("about.vision");
  const valuesTitle = (data ? localized(asLocalized(data.values_title), lang) : "") || t("about.valuesTitle");
  const valuesBody = (data ? localized(asLocalized(data.values_body), lang) : "") || t("about.values");
  const timelineTitle = (data ? localized(asLocalized(data.timeline_title), lang) : "") || t("about.timelineTitle");

  const timeline: TimelineItem[] = Array.isArray(data?.timeline) ? (data!.timeline as TimelineItem[]) : [];
  const fallbackTimeline = [
    { year: "2018", text: t("about.t1") },
    { year: "2020", text: t("about.t2") },
    { year: "2022", text: t("about.t3") },
    { year: "2024+", text: t("about.t4") },
  ];

  return (
    <>
      <Seo title={`${title} | ${t("brand.short")}`} description={sub} lang={lang} path="/about" />
      <PageHero title={title} subtitle={sub} crumbs={[{ label: t("nav.about") }]} />
      <section className="section">
        {loading ? (
          <div className="container">
            <p className="empty-note">{t("common.loading")}</p>
          </div>
        ) : (
          <>
            <div className="container card-grid cols-3">
              <article className="surface-card">
                <h2>{missionTitle}</h2>
                <p>{mission}</p>
              </article>
              <article className="surface-card">
                <h2>{visionTitle}</h2>
                <p>{vision}</p>
              </article>
              <article className="surface-card">
                <h2>{valuesTitle}</h2>
                <p>{valuesBody}</p>
              </article>
            </div>
            <div className="container" style={{ marginTop: "var(--space-7)", maxWidth: "44rem" }}>
              <h2>{timelineTitle}</h2>
              <ol>
                {timeline.length > 0
                  ? timeline.map((item, i) => (
                      <li key={`${item.year}-${i}`}>
                        <strong>{item.year || "—"}</strong> — {localized(asLocalized(item.text), lang)}
                      </li>
                    ))
                  : fallbackTimeline.map((item) => (
                      <li key={item.year}>
                        <strong>{item.year}</strong> — {item.text}
                      </li>
                    ))}
              </ol>
            </div>
          </>
        )}
      </section>
    </>
  );
}
