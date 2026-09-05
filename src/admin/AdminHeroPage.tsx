import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Database, Localized } from "../lib/database.types";
import { useToast } from "../components/Toast";
import { supabase } from "../lib/supabase";
import { LocalizedInputs, asLocalized, emptyLocalized } from "./adminForm";

type Settings = Database["public"]["Tables"]["site_settings"]["Row"];
type SliderRow = Database["public"]["Tables"]["sliders"]["Row"];
type SliderInput = Database["public"]["Tables"]["sliders"]["Insert"];

const blankSlide = (): SliderInput => ({
  title: emptyLocalized(),
  subtitle: emptyLocalized(),
  image_url: "",
  link_url: "",
  sort_order: 0,
  published: true,
});

export function AdminHeroPage() {
  const toast = useToast();
  const [textForm, setTextForm] = useState<{
    hero_headline: Localized;
    hero_sub: Localized;
    hero_cta_primary: Localized;
    hero_cta_secondary: Localized;
  } | null>(null);
  const [slides, setSlides] = useState<SliderRow[]>([]);
  const [slideForm, setSlideForm] = useState<SliderInput>(blankSlide());
  const [editId, setEditId] = useState<string | null>(null);
  const [busyText, setBusyText] = useState(false);
  const [busySlide, setBusySlide] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);

  const loadSlides = useCallback(async () => {
    const { data, error: err } = await supabase.from("sliders").select("*").order("sort_order");
    if (err) toast.error(err.message);
    else setSlides((data ?? []) as SliderRow[]);
  }, []);

  useEffect(() => {
    (async () => {
      const { data, error: err } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (err) toast.error(err.message);
      else if (data) {
        const row = data as Settings;
        setTextForm({
          hero_headline: asLocalized(row.hero_headline),
          hero_sub: asLocalized(row.hero_sub),
          hero_cta_primary: asLocalized(row.hero_cta_primary),
          hero_cta_secondary: asLocalized(row.hero_cta_secondary),
        });
      } else {
        setTextForm({
          hero_headline: emptyLocalized(),
          hero_sub: emptyLocalized(),
          hero_cta_primary: emptyLocalized(),
          hero_cta_secondary: emptyLocalized(),
        });
      }
    })();
    void loadSlides();
  }, [loadSlides]);

  useEffect(() => {
    return () => {
      if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    };
  }, [pendingPreview]);

  async function saveText(e: FormEvent) {
    e.preventDefault();
    if (!textForm) return;
    setBusyText(true);
    const payload = {
      hero_headline: asLocalized(textForm.hero_headline),
      hero_sub: asLocalized(textForm.hero_sub),
      hero_cta_primary: asLocalized(textForm.hero_cta_primary),
      hero_cta_secondary: asLocalized(textForm.hero_cta_secondary),
      updated_at: new Date().toISOString(),
    };
    const { error: err } = await supabase.from("site_settings").update(payload as never).eq("id", 1);
    setBusyText(false);
    if (err) toast.error(err.message);
    else toast.success("Hero text saved");
  }

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    e.target.value = "";
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    if (!file) {
      setPendingFile(null);
      setPendingPreview(null);
      return;
    }
    if (!/\.(jpe?g|png|webp|gif)$/i.test(file.name) && !file.type.startsWith("image/")) {
      toast.error("Use JPG, PNG, or WebP");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max 5MB");
      return;
    }
    setPendingFile(file);
    setPendingPreview(URL.createObjectURL(file));
  }

  async function uploadImage(): Promise<string | null> {
    if (!pendingFile) return (slideForm.image_url ?? "").trim() || null;
    setUploading(true);
    const ext = pendingFile.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `hero/slide-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("site-assets").upload(path, pendingFile, {
      cacheControl: "3600",
      upsert: false,
      contentType: pendingFile.type || "image/jpeg",
    });
    setUploading(false);
    if (upErr) {
      toast.error(upErr.message);
      return null;
    }
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    return data.publicUrl;
  }

  function startEdit(row: SliderRow) {
    setEditId(row.id);
    setSlideForm({
      title: asLocalized(row.title),
      subtitle: asLocalized(row.subtitle),
      image_url: row.image_url,
      link_url: row.link_url ?? "",
      sort_order: row.sort_order,
      published: row.published,
    });
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(null);
    setPendingPreview(null);
  }

  function resetSlide() {
    setEditId(null);
    setSlideForm(blankSlide());
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(null);
    setPendingPreview(null);
  }

  async function saveSlide(e: FormEvent) {
    e.preventDefault();
    setBusySlide(true);
    const imageUrl = await uploadImage();
    if (!imageUrl) {
      setBusySlide(false);
      if (!pendingFile) toast.error("Add an image URL or upload a file");
      return;
    }
    const payload = {
      title: asLocalized(slideForm.title),
      subtitle: asLocalized(slideForm.subtitle),
      image_url: imageUrl,
      link_url: (slideForm.link_url ?? "").trim() || null,
      sort_order: slideForm.sort_order ?? 0,
      published: slideForm.published ?? true,
    };
    const q = editId
      ? supabase.from("sliders").update(payload as never).eq("id", editId)
      : supabase.from("sliders").insert(payload as never);
    const { error: err } = await q;
    setBusySlide(false);
    if (err) {
      toast.error(err.message);
      return;
    }
    toast.success(editId ? "Slide updated" : "Slide added");
    resetSlide();
    await loadSlides();
  }

  async function removeSlide(id: string) {
    if (!confirm("Delete this hero slide?")) return;
    const { error: err } = await supabase.from("sliders").delete().eq("id", id);
    if (err) toast.error(err.message);
    else {
      toast.success("Deleted");
      await loadSlides();
    }
  }

  if (!textForm) return <p className="admin-page">Loading…</p>;

  return (
    <div className="admin-page">
      <h1>Homepage hero</h1>
      <p className="admin-lead">Control hero headline, CTAs, marquee is in Settings. Manage carousel images below.</p>

      <h2 className="admin-subhead">Hero text</h2>
      <form className="admin-form" onSubmit={(e) => void saveText(e)}>
        <LocalizedInputs
          label="Headline"
          value={textForm.hero_headline}
          onChange={(hero_headline) => setTextForm({ ...textForm, hero_headline })}
          multiline
        />
        <LocalizedInputs
          label="Supporting text"
          value={textForm.hero_sub}
          onChange={(hero_sub) => setTextForm({ ...textForm, hero_sub })}
          multiline
        />
        <LocalizedInputs
          label="Primary CTA (Appointment)"
          value={textForm.hero_cta_primary}
          onChange={(hero_cta_primary) => setTextForm({ ...textForm, hero_cta_primary })}
        />
        <LocalizedInputs
          label="Secondary CTA (Assessment)"
          value={textForm.hero_cta_secondary}
          onChange={(hero_cta_secondary) => setTextForm({ ...textForm, hero_cta_secondary })}
        />
        <div className="admin-actions">
          <button className="btn btn-primary" type="submit" disabled={busyText}>
            {busyText ? "Saving…" : "Save hero text"}
          </button>
        </div>
      </form>

      <h2 className="admin-subhead">Hero slides (images)</h2>
      <form className="admin-form" onSubmit={(e) => void saveSlide(e)}>
        <LocalizedInputs
          label="Slide title (optional)"
          value={(slideForm.title as Localized) ?? emptyLocalized()}
          onChange={(title) => setSlideForm({ ...slideForm, title })}
        />
        <label>
          Image URL
          <input
            value={slideForm.image_url ?? ""}
            onChange={(e) => setSlideForm({ ...slideForm, image_url: e.target.value })}
            placeholder="https://… or upload below"
          />
        </label>
        <label>
          Upload image
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onPick} />
        </label>
        {(pendingPreview || slideForm.image_url) && (
          <img
            src={pendingPreview || slideForm.image_url || ""}
            alt=""
            style={{ maxWidth: "16rem", borderRadius: "0.5rem", display: "block" }}
          />
        )}
        <div className="row-2">
          <label>
            Sort
            <input
              type="number"
              value={slideForm.sort_order ?? 0}
              onChange={(e) => setSlideForm({ ...slideForm, sort_order: Number(e.target.value) })}
            />
          </label>
          <label>
            Published
            <select
              value={slideForm.published ? "1" : "0"}
              onChange={(e) => setSlideForm({ ...slideForm, published: e.target.value === "1" })}
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </label>
        </div>
        <div className="admin-actions">
          <button className="btn btn-primary" type="submit" disabled={busySlide || uploading}>
            {uploading ? "Uploading…" : busySlide ? "Saving…" : editId ? "Update slide" : "Add slide"}
          </button>
          {editId ? (
            <button type="button" className="admin-btn" onClick={resetSlide}>
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Title</th>
              <th>Sort</th>
              <th>Published</th>
              <th className="admin-col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slides.length === 0 ? (
              <tr>
                <td colSpan={5}>No slides yet. Add images — homepage falls back to default photos until then.</td>
              </tr>
            ) : (
              slides.map((r) => (
                <tr key={r.id}>
                  <td>
                    <img src={r.image_url} alt="" style={{ width: "4.5rem", height: "2.5rem", objectFit: "cover", borderRadius: 4 }} />
                  </td>
                  <td>{(asLocalized(r.title).en || "—")}</td>
                  <td>{r.sort_order}</td>
                  <td>{r.published ? "Yes" : "No"}</td>
                  <td className="admin-col-actions">
                    <div className="admin-actions">
                      <button type="button" onClick={() => startEdit(r)}>
                        Edit
                      </button>
                      <button type="button" className="danger" onClick={() => void removeSlide(r.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
