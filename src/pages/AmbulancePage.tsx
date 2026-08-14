import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { RequireAuth } from "../components/RequireAuth";
import { Seo } from "../seo/Seo";
import { useAuth } from "../lib/auth";
import { submitAmbulance } from "../services/content";
import { langPath, useLang } from "../hooks/useLang";

const phoneOk = (v: string) => /^[+0-9\s()-]{8,}$/.test(v.trim());

function AmbulanceForm() {
  const { t } = useTranslation();
  const lang = useLang();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickup, setPickup] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = t("common.required");
    if (!phone.trim()) next.phone = t("common.required");
    else if (!phoneOk(phone)) next.phone = t("common.invalidPhone");
    if (!pickup.trim()) next.pickup = t("common.required");
    setErrors(next);
    setSubmitError(null);
    if (Object.keys(next).length) return;
    setSending(true);
    try {
      await submitAmbulance({
        user_id: user.id,
        contact_name: name.trim(),
        phone: phone.trim(),
        pickup_location: pickup.trim(),
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
      <Seo title={`${t("ambulance.title")} | ${t("brand.short")}`} description={t("ambulance.sub")} lang={lang} path="/ambulance" />
      <PageHero title={t("ambulance.title")} subtitle={t("ambulance.sub")} crumbs={[{ label: t("nav.ambulance") }]} />
      <section className="section">
        <div className="container">
          {done ? (
            <div>
              <p className="form-success">{t("common.successAmbulance")}</p>
              <Link className="btn btn-secondary" to={langPath(lang, "/bookings")} style={{ marginTop: "1rem" }}>
                {t("nav.bookings")}
              </Link>
            </div>
          ) : (
            <form className="form-stack" onSubmit={onSubmit} noValidate>
              <div className="form-field">
                <label htmlFor="am-name">{t("ambulance.name")}</label>
                <input id="am-name" value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name ? <p className="error">{errors.name}</p> : null}
              </div>
              <div className="form-field">
                <label htmlFor="am-phone">{t("ambulance.phone")}</label>
                <input id="am-phone" value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" />
                {errors.phone ? <p className="error">{errors.phone}</p> : null}
              </div>
              <div className="form-field">
                <label htmlFor="am-pickup">{t("ambulance.pickup")}</label>
                <input id="am-pickup" value={pickup} onChange={(e) => setPickup(e.target.value)} />
                {errors.pickup ? <p className="error">{errors.pickup}</p> : null}
              </div>
              <div className="form-field">
                <label htmlFor="am-notes">{t("ambulance.notes")}</label>
                <textarea id="am-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
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

export function AmbulancePage() {
  return (
    <RequireAuth>
      <AmbulanceForm />
    </RequireAuth>
  );
}
