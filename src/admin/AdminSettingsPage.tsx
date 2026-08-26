import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Database, Localized } from "../lib/database.types";
import { useToast } from "../components/Toast";
import { supabase } from "../lib/supabase";
import { LocalizedInputs, asLocalized, emptyLocalized } from "./adminForm";

type Settings = Database["public"]["Tables"]["site_settings"]["Row"];

export function AdminSettingsPage() {
  const toast = useToast();
  const [form, setForm] = useState<Partial<Settings> | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingLogo, setPendingLogo] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    };
  }, [pendingPreview]);

  useEffect(() => {
    (async () => {
      const { data, error: err } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (err) toast.error("Load failed");
      else if (data) {
        const row = data as Settings;
        const social = (row.social ?? {}) as { marquee?: unknown; logo?: string };
        setForm({
          ...row,
          tagline: asLocalized(row.tagline),
          address: asLocalized(row.address),
          hours: asLocalized(row.hours),
          logo_url: row.logo_url || social.logo || "",
          marquee_text: (() => {
            const col = asLocalized(row.marquee_text);
            if (col.en.trim() || col.bn.trim()) return col;
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
          logo_url: "",
        });
      }
    })();
  }, [toast]);

  function onLogoPick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    if (!file) {
      setPendingLogo(null);
      setPendingPreview(null);
      return;
    }
    if (!/\.(jpe?g|png|svg|webp)$/i.test(file.name) && !file.type.startsWith("image/")) {
      toast.error("Invalid file type");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File too large");
      return;
    }
    setPendingLogo(file);
    setPendingPreview(URL.createObjectURL(file));
  }

  async function uploadLogo() {
    if (!pendingLogo || !form) {
      toast.error("Select a logo first");
      return;
    }
    setUploading(true);
    const ext = pendingLogo.name.split(".").pop()?.toLowerCase() || "png";
    const mime =
      pendingLogo.type ||
      (ext === "svg" ? "image/svg+xml" : ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg");
    const path = `logo/brand-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("site-assets").upload(path, pendingLogo, {
      cacheControl: "3600",
      upsert: false,
      contentType: mime,
    });
    if (upErr) {
      setUploading(false);
      toast.error("Upload failed");
      return;
    }
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    const logoUrl = data.publicUrl;
    setForm({ ...form, logo_url: logoUrl });
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingLogo(null);
    setPendingPreview(null);

    const marquee = asLocalized(form.marquee_text);
    const social = {
      ...((form.social as Record<string, unknown>) ?? {}),
      marquee,
      logo: logoUrl,
    };
    const payload = {
      ...form,
      id: 1,
      logo_url: logoUrl,
      social,
      marquee_text: marquee,
      updated_at: new Date().toISOString(),
    };
    let { error: err } = await supabase.from("site_settings").upsert(payload as never);
    if (err && /marquee_text|logo_url/i.test(err.message)) {
      const { marquee_text: _m, logo_url: _l, ...withoutCols } = payload;
      const retry = await supabase.from("site_settings").upsert({ ...withoutCols, social } as never);
      err = retry.error;
    }
    setUploading(false);
    if (err) toast.error("Save failed");
    else toast.success("Logo uploaded");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    const marquee = asLocalized(form.marquee_text);
    const logo = (form.logo_url ?? "").trim() || null;
    const social = {
      ...((form.social as Record<string, unknown>) ?? {}),
      marquee,
      logo: logo ?? "",
    };
    const payload = {
      ...form,
      id: 1,
      social,
      marquee_text: marquee,
      logo_url: logo,
      updated_at: new Date().toISOString(),
    };
    let { error: err } = await supabase.from("site_settings").upsert(payload as never);
    if (err && /marquee_text|logo_url/i.test(err.message)) {
      const { marquee_text: _m, logo_url: _l, ...withoutCols } = payload;
      const retry = await supabase.from("site_settings").upsert({ ...withoutCols, social } as never);
      err = retry.error;
    }
    setBusy(false);
    if (err) toast.error("Save failed");
    else toast.success("Settings saved");
  }

  if (!form) return <p>Loading settings…</p>;

  const logoPreview = (form.logo_url ?? "").trim();

  return (
    <div className="admin-page">
      <h1>Site settings</h1>
      <p className="admin-lead">Phone, email, address, hours, and navbar logo used across the public site.</p>
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

        <div className="admin-logo-block">
          <strong>Navbar logo</strong>
          {(pendingPreview || logoPreview) ? (
            <div className="admin-logo-preview">
              <img src={pendingPreview || logoPreview} alt="Logo preview" />
            </div>
          ) : null}
          {pendingLogo ? <p className="admin-lead" style={{ margin: 0 }}>{pendingLogo.name}</p> : null}
          <label>
            Choose logo
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
              onChange={onLogoPick}
              disabled={uploading || busy}
            />
          </label>
          <div className="admin-actions">
            <button type="button" className="btn btn-primary" onClick={() => void uploadLogo()} disabled={!pendingLogo || uploading || busy}>
              {uploading ? "Uploading…" : "Upload logo"}
            </button>
            {logoPreview ? (
              <button
                type="button"
                className="admin-btn"
                onClick={() => setForm({ ...form, logo_url: "" })}
                disabled={busy || uploading}
              >
                Remove logo
              </button>
            ) : null}
          </div>
          <label>
            Or logo URL
            <input
              value={form.logo_url ?? ""}
              onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
              placeholder="https://…"
            />
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
        <button className="btn btn-primary" type="submit" disabled={busy || uploading}>
          {busy ? "Saving…" : "Save settings"}
        </button>
      </form>
    </div>
  );
}
