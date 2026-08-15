import { useEffect, useState, type FormEvent } from "react";
import type { Database, Localized } from "../lib/database.types";
import { useToast } from "../components/Toast";
import { supabase } from "../lib/supabase";
import { LocalizedInputs, asLocalized, emptyLocalized } from "./adminForm";

type Settings = Database["public"]["Tables"]["site_settings"]["Row"];

export function AdminSettingsPage() {
  const toast = useToast();
  const [form, setForm] = useState<Partial<Settings> | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error: err } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (err) toast.error(err.message);
      else if (data) {
        const row = data as Settings;
        setForm({
          ...row,
          tagline: asLocalized(row.tagline),
          address: asLocalized(row.address),
          hours: asLocalized(row.hours),
          marquee_text: (() => {
            const col = asLocalized(row.marquee_text);
            if (col.en.trim() || col.bn.trim()) return col;
            const social = (row.social ?? {}) as { marquee?: unknown };
            return asLocalized(social.marquee);
          })(),
        });
      } else {
        setForm({
          brand: "Suborno physiotherapy and Autism Care",
          brand_short: "Suborno",
          tagline: emptyLocalized(),
          phone_main: "",
          phone_main_display: "",
          phone_medical: "",
          phone_medical_display: "",
          phone_admission: "",
          phone_admission_display: "",
          email_info: "",
          email_admission: "",
          address: emptyLocalized(),
          hours: emptyLocalized(),
          social: {},
          marquee_text: emptyLocalized(),
        });
      }
    })();
  }, [toast]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    const marquee = asLocalized(form.marquee_text);
    const social = {
      ...((form.social as Record<string, unknown>) ?? {}),
      marquee,
    };
    const payload = { ...form, id: 1, social, marquee_text: marquee, updated_at: new Date().toISOString() };
    let { error: err } = await supabase.from("site_settings").upsert(payload as never);
    if (err && /marquee_text/i.test(err.message)) {
      const { marquee_text: _drop, ...withoutCol } = payload;
      const retry = await supabase.from("site_settings").upsert(withoutCol as never);
      err = retry.error;
    }
    setBusy(false);
    if (err) toast.error(err.message);
    else toast.success("Settings saved");
  }

  if (!form) return <p>Loading settings…</p>;

  return (
    <div className="admin-page">
      <h1>Site settings</h1>
      <p className="admin-lead">Phone, email, address, hours used across the public site.</p>
      <form className="admin-form" onSubmit={onSubmit}>
        <div className="row-2">
          <label>
            Brand
            <input value={form.brand ?? ""} onChange={(e) => setForm({ ...form, brand: e.target.value })} required />
          </label>
          <label>
            Short brand
            <input value={form.brand_short ?? ""} onChange={(e) => setForm({ ...form, brand_short: e.target.value })} required />
          </label>
        </div>
        <LocalizedInputs
          label="Tagline"
          value={(form.tagline as Localized) ?? emptyLocalized()}
          onChange={(tagline) => setForm({ ...form, tagline })}
        />
        <div className="row-2">
          <label>
            Phone main (tel)
            <input value={form.phone_main ?? ""} onChange={(e) => setForm({ ...form, phone_main: e.target.value })} />
          </label>
          <label>
            Phone main display
            <input value={form.phone_main_display ?? ""} onChange={(e) => setForm({ ...form, phone_main_display: e.target.value })} />
          </label>
        </div>
        <div className="row-2">
          <label>
            Phone medical
            <input value={form.phone_medical ?? ""} onChange={(e) => setForm({ ...form, phone_medical: e.target.value })} />
          </label>
          <label>
            Medical display
            <input
              value={form.phone_medical_display ?? ""}
              onChange={(e) => setForm({ ...form, phone_medical_display: e.target.value })}
            />
          </label>
        </div>
        <div className="row-2">
          <label>
            Phone admission
            <input value={form.phone_admission ?? ""} onChange={(e) => setForm({ ...form, phone_admission: e.target.value })} />
          </label>
          <label>
            Admission display
            <input
              value={form.phone_admission_display ?? ""}
              onChange={(e) => setForm({ ...form, phone_admission_display: e.target.value })}
            />
          </label>
        </div>
        <div className="row-2">
          <label>
            Email info
            <input value={form.email_info ?? ""} onChange={(e) => setForm({ ...form, email_info: e.target.value })} />
          </label>
          <label>
            Email admission
            <input value={form.email_admission ?? ""} onChange={(e) => setForm({ ...form, email_admission: e.target.value })} />
          </label>
        </div>
        <LocalizedInputs
          label="Address"
          value={(form.address as Localized) ?? emptyLocalized()}
          onChange={(address) => setForm({ ...form, address })}
          multiline
        />
        <LocalizedInputs
          label="Hours"
          value={(form.hours as Localized) ?? emptyLocalized()}
          onChange={(hours) => setForm({ ...form, hours })}
          multiline
        />
        <div className="row-2">
          <label>
            Hero marquee (EN)
            <input
              value={((form.marquee_text as Localized) ?? emptyLocalized()).en}
              onChange={(e) =>
                setForm({
                  ...form,
                  marquee_text: { ...((form.marquee_text as Localized) ?? emptyLocalized()), en: e.target.value },
                })
              }
              placeholder="Scrolling announcement on homepage hero"
            />
          </label>
          <label>
            Hero marquee (BN)
            <input
              value={((form.marquee_text as Localized) ?? emptyLocalized()).bn}
              onChange={(e) =>
                setForm({
                  ...form,
                  marquee_text: { ...((form.marquee_text as Localized) ?? emptyLocalized()), bn: e.target.value },
                })
              }
              placeholder="হিরোতে চলমান ঘোষণা"
            />
          </label>
        </div>
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save settings"}
        </button>
      </form>
    </div>
  );
}
