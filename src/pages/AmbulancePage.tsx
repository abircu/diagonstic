import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { useToast } from "../components/Toast";
import { submitAmbulance } from "../services/content";
import { useLang } from "../hooks/useLang";

const phoneOk = (v: string) => /^[+0-9\s()-]{8,}$/.test(v.trim());
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export function AmbulancePage() {
  const { t } = useTranslation();
  const lang = useLang();
  const toast = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pickup, setPickup] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = t("common.required");
    if (!phone.trim()) next.phone = t("common.required");
    else if (!phoneOk(phone)) next.phone = t("common.invalidPhone");
    if (!email.trim()) next.email = t("common.required");
    else if (!emailOk(email)) next.email = t("common.invalidEmail");
    if (!pickup.trim()) next.pickup = t("common.required");
    setErrors(next);
    if (Object.keys(next).length) {
      toast.error(t("common.formFix"));
      return;
    }
    setSending(true);
    try {
      await submitAmbulance({
        contact_name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        pickup_location: pickup.trim(),
        notes: notes.trim() || undefined,
      });
      setDone(true);
      toast.success(t("common.successAmbulance"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("common.submitFailed"));
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
            <p className="form-success">{t("common.successAmbulance")}</p>
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
                <label htmlFor="am-email">{t("ambulance.email")}</label>
                <input id="am-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
                {errors.email ? <p className="error">{errors.email}</p> : null}
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
