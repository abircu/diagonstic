import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DoctorPhoto } from "../components/DoctorPhoto";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { useAsyncData } from "../hooks/useAsyncData";
import { asLocalized, fetchDepartments, fetchDoctors } from "../services/content";
import { langPath, localized, useLang } from "../hooks/useLang";

export function DoctorsPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const link = (p: string) => langPath(lang, p);
  const [q, setQ] = useState("");
  const [dept, setDept] = useState("all");
  const { data: doctors, loading, error } = useAsyncData(() => fetchDoctors(), []);
  const { data: departments } = useAsyncData(() => fetchDepartments(), []);

  const filtered = useMemo(() => {
    const list = doctors ?? [];
    return list.filter((d) => {
      const name = localized(asLocalized(d.name), lang).toLowerCase();
      const matchQ = !q || name.includes(q.toLowerCase());
      const matchD = dept === "all" || d.department_slug === dept;
      return matchQ && matchD;
    });
  }, [q, dept, lang, doctors]);

  return (
    <>
      <Seo title={`${t("doctors.title")} | ${t("brand.short")}`} description={t("doctors.sub")} lang={lang} path="/doctors" />
      <PageHero title={t("doctors.title")} subtitle={t("doctors.sub")} crumbs={[{ label: t("nav.doctors") }]} />
      <section className="section">
        <div className="container">
          <div className="form-stack" style={{ marginBottom: "var(--space-5)", maxWidth: "100%", gridTemplateColumns: "1fr" }}>
            <div className="form-field">
              <label htmlFor="doctor-search">{t("common.search")}</label>
              <input id="doctor-search" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="form-field">
              <label htmlFor="doctor-dept">{t("common.filter")}</label>
              <select id="doctor-dept" value={dept} onChange={(e) => setDept(e.target.value)}>
                <option value="all">{t("common.all")}</option>
                {(departments ?? []).map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {localized(asLocalized(d.name), lang)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {loading ? <p className="empty-note">{t("common.loading")}</p> : null}
          {error ? <p className="empty-note">{error}</p> : null}
          {!loading && !error && filtered.length === 0 ? (
            <p className="empty-note">{t("common.notFoundText")}</p>
          ) : null}
          {!loading && filtered.length > 0 ? (
            <div className="card-grid cols-3">
              {filtered.map((d) => {
                const name = localized(asLocalized(d.name), lang);
                return (
                  <article key={d.slug} className="surface-card doctor-card">
                    <div className="doctor-card-top">
                      <div className="doctor-avatar doctor-photo-wrap">
                        <DoctorPhoto url={d.photo_url} name={name} />
                        <div className="doctor-photo doctor-photo--fallback" hidden aria-hidden />
                      </div>
                      <div className="doctor-card-meta">
                        <span className="chip">
                          {d.hub === "both" ? t("common.hubBoth") : d.hub === "autism" ? t("common.hubAutism") : t("common.hubMedical")}
                        </span>
                        <h3>
                          <Link className="title-link" to={link(`/doctors/${d.slug}`)}>
                            {name}
                          </Link>
                        </h3>
                        <p>{localized(asLocalized(d.title), lang)}</p>
                      </div>
                    </div>
                    <p className="doctor-card-action">
                      <Link to={link(`/appointment?doctor=${d.slug}`)}>{t("common.bookWith")}</Link>
                    </p>
                  </article>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
