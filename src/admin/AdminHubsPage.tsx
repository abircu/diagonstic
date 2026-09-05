import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Database, Localized } from "../lib/database.types";
import { useToast } from "../components/Toast";
import { supabase } from "../lib/supabase";
import { LocalizedInputs, asLocalized, emptyLocalized } from "./adminForm";

type Settings = Database["public"]["Tables"]["site_settings"]["Row"];

type HubForm = {
  hubs_title: Localized;
  hubs_sub: Localized;
  hub_medical_title: Localized;
  hub_medical_text: Localized;
  hub_medical_image: string;
  hub_medical_link: string;
  hub_autism_title: Localized;
  hub_autism_text: Localized;
  hub_autism_image: string;
  hub_autism_link: string;
};

async function uploadHubImage(file: File, folder: string) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `hubs/${folder}-${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("site-assets").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });
  if (error) throw error;
  return supabase.storage.from("site-assets").getPublicUrl(path).data.publicUrl;
}

export function AdminHubsPage() {
  const toast = useToast();
  const [form, setForm] = useState<HubForm | null>(null);
  const [busy, setBusy] = useState(false);
  const [upMedical, setUpMedical] = useState(false);
  const [upAutism, setUpAutism] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error: err } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (err) {
        toast.error(err.message);
        return;
      }
      if (data) {
        const row = data as Settings;
        setForm({
          hubs_title: asLocalized(row.hubs_title),
          hubs_sub: asLocalized(row.hubs_sub),
          hub_medical_title: asLocalized(row.hub_medical_title),
          hub_medical_text: asLocalized(row.hub_medical_text),
          hub_medical_image: row.hub_medical_image ?? "",
          hub_medical_link: row.hub_medical_link || "/medical",
          hub_autism_title: asLocalized(row.hub_autism_title),
          hub_autism_text: asLocalized(row.hub_autism_text),
          hub_autism_image: row.hub_autism_image ?? "",
          hub_autism_link: row.hub_autism_link || "/autism",
        });
      } else {
        setForm({
          hubs_title: emptyLocalized(),
          hubs_sub: emptyLocalized(),
          hub_medical_title: emptyLocalized(),
          hub_medical_text: emptyLocalized(),
          hub_medical_image: "",
          hub_medical_link: "/medical",
          hub_autism_title: emptyLocalized(),
          hub_autism_text: emptyLocalized(),
          hub_autism_image: "",
          hub_autism_link: "/autism",
        });
      }
    })();
  }, []);

  async function onUpload(which: "medical" | "autism", e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !form) return;
    if (!/\.(jpe?g|png|webp|gif)$/i.test(file.name) && !file.type.startsWith("image/")) {
      toast.error("Use JPG, PNG, or WebP");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max 5MB");
      return;
    }
    if (which === "medical") setUpMedical(true);
    else setUpAutism(true);
    try {
      const url = await uploadHubImage(file, which);
      setForm(
        which === "medical"
          ? { ...form, hub_medical_image: url }
          : { ...form, hub_autism_image: url },
      );
      toast.success("Image uploaded — click Save to publish");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      if (which === "medical") setUpMedical(false);
      else setUpAutism(false);
    }
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    const payload = {
      hubs_title: asLocalized(form.hubs_title),
      hubs_sub: asLocalized(form.hubs_sub),
      hub_medical_title: asLocalized(form.hub_medical_title),
      hub_medical_text: asLocalized(form.hub_medical_text),
      hub_medical_image: form.hub_medical_image.trim() || null,
      hub_medical_link: form.hub_medical_link.trim() || "/medical",
      hub_autism_title: asLocalized(form.hub_autism_title),
      hub_autism_text: asLocalized(form.hub_autism_text),
      hub_autism_image: form.hub_autism_image.trim() || null,
      hub_autism_link: form.hub_autism_link.trim() || "/autism",
      updated_at: new Date().toISOString(),
    };
    const { error: err } = await supabase.from("site_settings").update(payload as never).eq("id", 1);
    setBusy(false);
    if (err) toast.error(err.message);
    else toast.success("Hubs section saved");
  }

  if (!form) return <p className="admin-page">Loading…</p>;

  return (
    <div className="admin-page">
      <h1>Hubs section</h1>
      <p className="admin-lead">Homepage “Two hubs” block — section title, both cards’ text, and images.</p>

      <form className="admin-form" onSubmit={(e) => void onSave(e)}>
        <h2 className="admin-subhead">Section heading</h2>
        <LocalizedInputs label="Title" value={form.hubs_title} onChange={(hubs_title) => setForm({ ...form, hubs_title })} />
        <LocalizedInputs
          label="Subtitle"
          value={form.hubs_sub}
          onChange={(hubs_sub) => setForm({ ...form, hubs_sub })}
          multiline
        />

        <h2 className="admin-subhead">Medical hub card</h2>
        <LocalizedInputs
          label="Card title"
          value={form.hub_medical_title}
          onChange={(hub_medical_title) => setForm({ ...form, hub_medical_title })}
        />
        <LocalizedInputs
          label="Card text"
          value={form.hub_medical_text}
          onChange={(hub_medical_text) => setForm({ ...form, hub_medical_text })}
          multiline
        />
        <label>
          Link path
          <input
            value={form.hub_medical_link}
            onChange={(e) => setForm({ ...form, hub_medical_link: e.target.value })}
            placeholder="/medical"
          />
        </label>
        <label>
          Image URL
          <input
            value={form.hub_medical_image}
            onChange={(e) => setForm({ ...form, hub_medical_image: e.target.value })}
            placeholder="https://… or upload"
          />
        </label>
        <label>
          Upload image
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => void onUpload("medical", e)} />
        </label>
        {upMedical ? <p className="admin-lead">Uploading…</p> : null}
        {form.hub_medical_image ? (
          <img src={form.hub_medical_image} alt="" style={{ maxWidth: "18rem", borderRadius: "0.5rem", display: "block" }} />
        ) : null}

        <h2 className="admin-subhead">Autism hub card</h2>
        <LocalizedInputs
          label="Card title"
          value={form.hub_autism_title}
          onChange={(hub_autism_title) => setForm({ ...form, hub_autism_title })}
        />
        <LocalizedInputs
          label="Card text"
          value={form.hub_autism_text}
          onChange={(hub_autism_text) => setForm({ ...form, hub_autism_text })}
          multiline
        />
        <label>
          Link path
          <input
            value={form.hub_autism_link}
            onChange={(e) => setForm({ ...form, hub_autism_link: e.target.value })}
            placeholder="/autism"
          />
        </label>
        <label>
          Image URL
          <input
            value={form.hub_autism_image}
            onChange={(e) => setForm({ ...form, hub_autism_image: e.target.value })}
            placeholder="https://… or upload"
          />
        </label>
        <label>
          Upload image
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => void onUpload("autism", e)} />
        </label>
        {upAutism ? <p className="admin-lead">Uploading…</p> : null}
        {form.hub_autism_image ? (
          <img src={form.hub_autism_image} alt="" style={{ maxWidth: "18rem", borderRadius: "0.5rem", display: "block" }} />
        ) : null}

        <div className="admin-actions">
          <button className="btn btn-primary" type="submit" disabled={busy || upMedical || upAutism}>
            {busy ? "Saving…" : "Save hubs section"}
          </button>
        </div>
      </form>
    </div>
  );
}
