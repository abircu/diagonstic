import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { RequireAuth } from "../components/RequireAuth";
import { useAuth } from "../lib/auth";
import { useAsyncData } from "../hooks/useAsyncData";
import { fetchMyAmbulances, fetchMyAppointments, fetchMyAssessments } from "../services/content";
import { langPath, useLang } from "../hooks/useLang";

function BookingsInner() {
  const { t } = useTranslation();
  const lang = useLang();
  const { user, isAdmin } = useAuth();
  const userId = user?.id ?? "";
  const { data: appointments, loading: aLoad } = useAsyncData(() => fetchMyAppointments(userId), [userId]);
  const { data: assessments, loading: sLoad } = useAsyncData(() => fetchMyAssessments(userId), [userId]);
  const { data: ambulances, loading: mLoad } = useAsyncData(() => fetchMyAmbulances(userId), [userId]);
  const link = (p: string) => langPath(lang, p);
  const loading = aLoad || sLoad || mLoad;

  return (
    <>
      <Seo title={`${t("bookings.title")} | ${t("brand.short")}`} description={t("bookings.sub")} lang={lang} path="/bookings" />
      <PageHero title={t("bookings.title")} subtitle={t("bookings.sub")} crumbs={[{ label: t("nav.bookings") }]} />
      <section className="section">
        <div className="container">
          <div className="btn-row" style={{ marginBottom: "1.25rem" }}>
            <Link className="btn btn-primary" to={link("/appointment")}>
              {t("nav.appointment")}
            </Link>
            <Link className="btn btn-secondary" to={link("/assessment")}>
              {t("nav.assessment")}
            </Link>
            <Link className="btn btn-outline" to={link("/ambulance")}>
              {t("nav.ambulance")}
            </Link>
            {isAdmin ? (
              <Link className="btn btn-ghost" to="/admin">
                {t("auth.openAdmin")}
              </Link>
            ) : null}
          </div>

          {loading ? <p className="empty-note">{t("common.loading")}</p> : null}

          <h2>{t("bookings.appointments")}</h2>
          {(appointments ?? []).length === 0 && !loading ? (
            <p className="empty-note">{t("common.empty")}</p>
          ) : (
            <div className="card-grid cols-2" style={{ marginBottom: "var(--space-6)" }}>
              {(appointments ?? []).map((r) => (
                <article key={r.id} className="surface-card">
                  <p>
                    <strong>{r.full_name}</strong> · <span className="chip">{r.status}</span>
                  </p>
                  <p>
                    {r.phone}
                    {r.department_slug ? ` · ${r.department_slug}` : ""}
                    {r.preferred_date ? ` · ${r.preferred_date}` : ""}
                  </p>
                  <p style={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
                    {new Date(r.created_at).toLocaleString()}
                  </p>
                </article>
              ))}
            </div>
          )}

          <h2>{t("bookings.assessments")}</h2>
          {(assessments ?? []).length === 0 && !loading ? (
            <p className="empty-note">{t("common.empty")}</p>
          ) : (
            <div className="card-grid cols-2" style={{ marginBottom: "var(--space-6)" }}>
              {(assessments ?? []).map((r) => (
                <article key={r.id} className="surface-card">
                  <p>
                    <strong>{r.parent_name}</strong> · <span className="chip">{r.status}</span>
                  </p>
                  <p>
                    {r.phone} · {t("assessment.childAge")}: {r.child_age}
                  </p>
                  <p>{r.concerns}</p>
                  <p style={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
                    {new Date(r.created_at).toLocaleString()}
                  </p>
                </article>
              ))}
            </div>
          )}

          <h2>{t("bookings.ambulances")}</h2>
          {(ambulances ?? []).length === 0 && !loading ? (
            <p className="empty-note">{t("common.empty")}</p>
          ) : (
            <div className="card-grid cols-2">
              {(ambulances ?? []).map((r) => (
                <article key={r.id} className="surface-card">
                  <p>
                    <strong>{r.contact_name}</strong> · <span className="chip">{r.status}</span>
                  </p>
                  <p>
                    {r.phone} · {r.pickup_location}
                  </p>
                  <p style={{ color: "var(--color-muted)", fontSize: "0.85rem" }}>
                    {new Date(r.created_at).toLocaleString()}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export function MyBookingsPage() {
  return (
    <RequireAuth>
      <BookingsInner />
    </RequireAuth>
  );
}
