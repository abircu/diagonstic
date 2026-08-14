import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DoctorPhoto } from "../components/DoctorPhoto";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { useAsyncData } from "../hooks/useAsyncData";
import { asLocalized, fetchDepartmentBySlug, fetchDoctorBySlug } from "../services/content";
import { langPath, localized, useLang } from "../hooks/useLang";

export function DoctorDetailPage() {
  const { slug = "" } = useParams();
  const { t } = useTranslation();
  const lang = useLang();
  const link = (p: string) => langPath(lang, p);
  const { data: doctor, loading, error } = useAsyncData(() => fetchDoctorBySlug(slug), [slug]);
  const { data: dept } = useAsyncData(
    () => (doctor?.department_slug ? fetchDepartmentBySlug(doctor.department_slug) : Promise.resolve(null)),
    [doctor?.department_slug],
  );

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p className="empty-note">{t("common.loading")}</p>
        </div>
      </section>
    );
  }

  if (error || !doctor) {
    return (
      <section className="section">
        <div className="container">
          <h1>{t("common.notFound")}</h1>
          <p>{error || t("common.notFoundText")}</p>
          <Link to={link("/doctors")}>{t("common.back")}</Link>
        </div>
      </section>
    );
  }

  const name = localized(asLocalized(doctor.name), lang);

  return (
    <>
      <Seo
        title={`${name} | ${t("brand.short")}`}
        description={localized(asLocalized(doctor.bio), lang)}
        lang={lang}
        path={`/doctors/${doctor.slug}`}
      />
      <PageHero
        title={name}
        subtitle={localized(asLocalized(doctor.title), lang)}
        crumbs={[
          { label: t("nav.doctors"), to: link("/doctors") },
          { label: name },
        ]}
      />
      <section className="section">
        <div className="container doctor-detail">
          <div className="doctor-detail-photo doctor-avatar doctor-avatar--lg doctor-photo-wrap">
            <DoctorPhoto url={doctor.photo_url} name={name} />
            <div className="doctor-photo doctor-photo--fallback" hidden aria-hidden />
          </div>
          <div>
            <p>{localized(asLocalized(doctor.bio), lang)}</p>
            <p>
              <strong>{t("common.schedule")}:</strong> {localized(asLocalized(doctor.schedule), lang)}
            </p>
            {dept ? (
              <p>
                <Link to={link(`/departments/${dept.slug}`)}>{localized(asLocalized(dept.name), lang)}</Link>
              </p>
            ) : null}
            <div className="btn-row" style={{ marginTop: "var(--space-5)" }}>
              <Link className="btn btn-primary" to={link(`/appointment?doctor=${doctor.slug}`)}>
                {t("common.bookWith")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
