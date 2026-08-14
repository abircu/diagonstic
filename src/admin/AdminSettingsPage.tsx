import { useEffect, useState, type FormEvent } from "react";
import type { Database, Localized } from "../lib/database.types";
import { supabase } from "../lib/supabase";
import { LocalizedInputs, asLocalized, emptyLocalized } from "./adminForm";

type Settings = Database["public"]["Tables"]["site_settings"]["Row"];

export function AdminSettingsPage() {
  const [form, setForm] = useState<Partial<Settings> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error: err } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (err) setError(err.message);
      else if (data) {
        const row = data as Settings;
        setForm({
          ...row,
          tagline: asLocalized(row.tagline),
          address: asLocalized(row.address),
          hours: asLocalized(row.hours),
        });
      } else {
        setForm({
          brand: "Daig Medical & Autism Care",
          brand_short: "Daig",
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
        });
      }
    })();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    setError(null);
    setOk(null);
    const payload = { ...form, id: 1, updated_at: new Date().toISOString() };
    const { error: err } = await supabase.from("site_settings").upsert(payload as never);
    setBusy(false);
    if (err) setError(err.message);
    else setOk("Settings saved");
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
        {error ? <p className="admin-error">{error}</p> : null}
        {ok ? <p className="admin-ok">{ok}</p> : null}
        <button className="btn btn-primary" type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save settings"}
        </button>
      </form>
    </div>
  );
}
