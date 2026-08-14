import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { RequireAuth } from "../components/RequireAuth";
import { Seo } from "../seo/Seo";
import { useAuth } from "../lib/auth";
import { submitAssessment } from "../services/content";
import { langPath, useLang } from "../hooks/useLang";

const phoneOk = (v: string) => /^[+0-9\s()-]{8,}$/.test(v.trim());

function AssessmentForm() {
  const { t } = useTranslation();
  const lang = useLang();
  const { user } = useAuth();
  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [childAge, setChildAge] = useState("");
  const [concerns, setConcerns] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [shift, setShift] = useState("morning");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    const next: Record<string, string> = {};
    if (!parentName.trim()) next.parentName = t("common.required");
    if (!phone.trim()) next.phone = t("common.required");
    else if (!phoneOk(phone)) next.phone = t("common.invalidPhone");
    if (!childAge.trim()) next.childAge = t("common.required");
    if (!concerns.trim()) next.concerns = t("common.required");
    setErrors(next);
    setSubmitError(null);
    if (Object.keys(next).length) return;
    setSending(true);
    try {
      await submitAssessment({
        user_id: user.id,
        parent_name: parentName.trim(),
        phone: phone.trim(),
        child_age: childAge.trim(),
        concerns: concerns.trim(),
        prior_diagnosis: diagnosis.trim() || undefined,
        preferred_shift: shift,
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
      <Seo title={`${t("assessment.title")} | ${t("brand.short")}`} description={t("assessment.sub")} lang={lang} path="/assessment" />
      <PageHero title={t("assessment.title")} subtitle={t("assessment.sub")} crumbs={[{ label: t("nav.assessment") }]} />
      <section className="section">
        <div className="container">
          {done ? (
            <div>
              <p className="form-success">{t("common.successAssess")}</p>
              <Link className="btn btn-secondary" to={langPath(lang, "/bookings")} style={{ marginTop: "1rem" }}>
                {t("nav.bookings")}
              </Link>
            </div>
          ) : (
            <form className="form-stack" onSubmit={onSubmit} noValidate>
              <div className="form-field">
                <label htmlFor="as-parent">{t("assessment.parentName")}</label>
                <input id="as-parent" value={parentName} onChange={(e) => setParentName(e.target.value)} />
                {errors.parentName ? <p className="error">{errors.parentName}</p> : null}
              </div>
              <div className="form-field">
                <label htmlFor="as-phone">{t("assessment.phone")}</label>
                <input id="as-phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
                {errors.phone ? <p className="error">{errors.phone}</p> : null}
              </div>
              <div className="form-field">
                <label htmlFor="as-age">{t("assessment.childAge")}</label>
                <input id="as-age" value={childAge} onChange={(e) => setChildAge(e.target.value)} />
                {errors.childAge ? <p className="error">{errors.childAge}</p> : null}
              </div>
              <div className="form-field">
                <label htmlFor="as-concerns">{t("assessment.concerns")}</label>
                <textarea id="as-concerns" value={concerns} onChange={(e) => setConcerns(e.target.value)} />
                {errors.concerns ? <p className="error">{errors.concerns}</p> : null}
              </div>
              <div className="form-field">
                <label htmlFor="as-dx">{t("assessment.diagnosis")}</label>
                <input id="as-dx" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
              </div>
              <div className="form-field">
                <label htmlFor="as-shift">{t("assessment.shift")}</label>
                <select id="as-shift" value={shift} onChange={(e) => setShift(e.target.value)}>
                  <option value="morning">{t("assessment.shiftMorning")}</option>
                  <option value="afternoon">{t("assessment.shiftAfternoon")}</option>
                  <option value="evening">{t("assessment.shiftEvening")}</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="as-notes">{t("assessment.notes")}</label>
                <textarea id="as-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
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

export function AssessmentPage() {
  return (
    <RequireAuth>
      <AssessmentForm />
    </RequireAuth>
  );
}
