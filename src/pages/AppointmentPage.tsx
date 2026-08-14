import { useMemo, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { RequireAuth } from "../components/RequireAuth";
import { Seo } from "../seo/Seo";
import { useAuth } from "../lib/auth";
import { useAsyncData } from "../hooks/useAsyncData";
import { asLocalized, fetchDepartments, fetchDoctors, submitAppointment } from "../services/content";
import { langPath, localized, useLang } from "../hooks/useLang";

const phoneOk = (v: string) => /^[+0-9\s()-]{8,}$/.test(v.trim());

function AppointmentForm() {
  const { t } = useTranslation();
  const lang = useLang();
  const { user } = useAuth();
  const [params] = useSearchParams();
  const { data: departments } = useAsyncData(() => fetchDepartments(), []);
  const { data: doctors } = useAsyncData(() => fetchDoctors(), []);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState(params.get("department") || "");
  const [doctor, setDoctor] = useState(params.get("doctor") || "");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const doctorOptions = useMemo(() => {
    const list = doctors ?? [];
    if (!department) return list;
    return list.filter((d) => d.department_slug === department);
  }, [department, doctors]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = t("common.required");
    if (!phone.trim()) next.phone = t("common.required");
    else if (!phoneOk(phone)) next.phone = t("common.invalidPhone");
    if (!department) next.department = t("common.required");
    if (!date) next.date = t("common.required");
    setErrors(next);
    setSubmitError(null);
    if (Object.keys(next).length) return;
    setSending(true);
    try {
      await submitAppointment({
        user_id: user.id,
        full_name: name.trim(),
        phone: phone.trim(),
        department_slug: department || undefined,
        doctor_slug: doctor || undefined,
        preferred_date: date || undefined,
        notes: notes.trim() || undefined,
      });
      setDone(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Seo title={`${t("appointment.title")} | ${t("brand.short")}`} description={t("appointment.sub")} lang={lang} path="/appointment" />
      <PageHero title={t("appointment.title")} subtitle={t("appointment.sub")} crumbs={[{ label: t("nav.appointment") }]} />
      <section className="section">
        <div className="container">
          {done ? (
            <div>
              <p className="form-success" role="status">
                {t("common.successAppoint")}
              </p>
              <Link className="btn btn-secondary" to={langPath(lang, "/bookings")} style={{ marginTop: "1rem" }}>
                {t("nav.bookings")}
              </Link>
            </div>
          ) : (
            <form className="form-stack" onSubmit={onSubmit} noValidate>
              <div className="form-field">
                <label htmlFor="ap-name">{t("appointment.name")}</label>
                <input id="ap-name" value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name ? <p className="error">{errors.name}</p> : null}
              </div>
              <div className="form-field">
                <label htmlFor="ap-phone">{t("appointment.phone")}</label>
                <input id="ap-phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
                {errors.phone ? <p className="error">{errors.phone}</p> : null}
              </div>
              <div className="form-field">
                <label htmlFor="ap-dept">{t("appointment.department")}</label>
                <select
                  id="ap-dept"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setDoctor("");
                  }}
                >
                  <option value="">—</option>
                  {(departments ?? []).map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {localized(asLocalized(d.name), lang)}
                    </option>
                  ))}
                </select>
                {errors.department ? <p className="error">{errors.department}</p> : null}
              </div>
              <div className="form-field">
                <label htmlFor="ap-doc">{t("appointment.doctor")}</label>
                <select id="ap-doc" value={doctor} onChange={(e) => setDoctor(e.target.value)}>
                  <option value="">—</option>
                  {doctorOptions.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {localized(asLocalized(d.name), lang)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="ap-date">{t("appointment.date")}</label>
                <input id="ap-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                {errors.date ? <p className="error">{errors.date}</p> : null}
              </div>
              <div className="form-field">
                <label htmlFor="ap-notes">{t("appointment.notes")}</label>
                <textarea id="ap-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              {submitError ? <p className="error">{submitError}</p> : null}
              <button className="btn btn-primary" type="submit" disabled={sending}>
                {sending ? t("common.sending") : t("common.submit")}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

export function AppointmentPage() {
  return (
    <RequireAuth>
      <AppointmentForm />
    </RequireAuth>
  );
}
