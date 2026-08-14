import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DoctorPhoto } from "../components/DoctorPhoto";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { useAsyncData } from "../hooks/useAsyncData";
import { asLocalized, fetchDoctors } from "../services/content";
import { langPath, localized, useLang } from "../hooks/useLang";

export function TeamPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const link = (p: string) => langPath(lang, p);
  const [filter, setFilter] = useState<"all" | "medical" | "autism">("all");
  const { data: doctors, loading, error } = useAsyncData(() => fetchDoctors(), []);

  const list = useMemo(() => {
    return (doctors ?? []).filter((d) => {
      if (filter === "all") return true;
      if (filter === "medical") return d.hub === "medical" || d.hub === "both";
      return d.hub === "autism" || d.hub === "both";
    });
  }, [filter, doctors]);

  return (
    <>
      <Seo title={`${t("team.title")} | ${t("brand.short")}`} description={t("team.sub")} lang={lang} path="/team" />
      <PageHero title={t("team.title")} subtitle={t("team.sub")} crumbs={[{ label: t("nav.team") }]} />
      <section className="section">
        <div className="container">
          <div className="btn-row" style={{ marginBottom: "var(--space-5)" }}>
            <button type="button" className={`btn ${filter === "all" ? "btn-primary" : "btn-outline"}`} onClick={() => setFilter("all")}>
              {t("team.filterAll")}
            </button>
            <button
              type="button"
              className={`btn ${filter === "medical" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setFilter("medical")}
            >
              {t("team.filterMedical")}
            </button>
            <button
              type="button"
              className={`btn ${filter === "autism" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setFilter("autism")}
            >
              {t("team.filterAutism")}
            </button>
          </div>
          {loading ? <p className="empty-note">{t("common.loading")}</p> : null}
          {error ? <p className="empty-note">{error}</p> : null}
          <div className="card-grid cols-3">
            {list.map((d) => {
              const name = localized(asLocalized(d.name), lang);
              return (
                <article key={d.slug} className="surface-card doctor-card">
                  <div className="doctor-card-top">
                    <div className="doctor-avatar doctor-photo-wrap">
                      <DoctorPhoto url={d.photo_url} name={name} />
                      <div className="doctor-photo doctor-photo--fallback" hidden aria-hidden />
                    </div>
                    <div className="doctor-card-meta">
                      <h3>
                        <Link className="title-link" to={link(`/doctors/${d.slug}`)}>
                          {name}
                        </Link>
                      </h3>
                      <p>{localized(asLocalized(d.title), lang)}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
