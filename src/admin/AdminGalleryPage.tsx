import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Database, Localized } from "../lib/database.types";
import { useToast } from "../components/Toast";
import { supabase } from "../lib/supabase";
import { LocalizedInputs, asLocalized, emptyLocalized, slugify } from "./adminForm";

type Row = Database["public"]["Tables"]["gallery_items"]["Row"];
type Input = Database["public"]["Tables"]["gallery_items"]["Insert"];

const blank = (): Input => ({
  id: "",
  title: emptyLocalized(),
  kind: "photo",
  image_url: "",
  sort_order: 0,
  published: true,
});

export function AdminGalleryPage() {
  const toast = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Input>(blank());
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase.from("gallery_items").select("*").order("sort_order");
    if (err) toast.error(err.message);
    else setRows((data ?? []) as Row[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    return () => {
      if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    };
  }, [pendingPreview]);

  function startEdit(row: Row) {
    setEditId(row.id);
    setForm({
      id: row.id,
      title: asLocalized(row.title),
      kind: row.kind,
      image_url: row.image_url ?? "",
      sort_order: row.sort_order,
      published: row.published,
    });
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(null);
    setPendingPreview(null);
  }

  function reset() {
    setEditId(null);
    setForm(blank());
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingFile(null);
    setPendingPreview(null);
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

  async function resolveImageUrl(): Promise<string | null> {
    if (pendingFile) {
      setUploading(true);
      const ext = pendingFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `gallery/${Date.now()}.${ext}`;
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
      return supabase.storage.from("site-assets").getPublicUrl(path).data.publicUrl;
    }
    return (form.image_url ?? "").trim() || null;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const imageUrl = await resolveImageUrl();
    if (!imageUrl) {
      setBusy(false);
      if (!pendingFile) toast.error("Add image URL or upload a file");
      return;
    }
    const id = editId || form.id || slugify(form.title.en) || `g-${Date.now()}`;
    const payload = {
      id,
      title: asLocalized(form.title),
      kind: (form.kind === "video" ? "video" : "photo") as "photo" | "video",
      image_url: imageUrl,
      sort_order: form.sort_order ?? 0,
      published: form.published ?? true,
    };
    const q = editId
      ? supabase.from("gallery_items").update(payload as never).eq("id", editId)
      : supabase.from("gallery_items").insert(payload as never);
    const { error: err } = await q;
    setBusy(false);
    if (err) {
      toast.error(err.message);
      return;
    }
    toast.success(editId ? "Updated" : "Created");
    reset();
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this gallery item?")) return;
    const { error: err } = await supabase.from("gallery_items").delete().eq("id", id);
    if (err) toast.error(err.message);
    else {
      toast.success("Deleted");
      await load();
    }
  }

  return (
    <div className="admin-page">
      <h1>Gallery</h1>
      <p className="admin-lead">Upload photos for the public Gallery page.</p>
      <form className="admin-form" onSubmit={(e) => void onSubmit(e)}>
        <LocalizedInputs label="Title" value={form.title as Localized} onChange={(title) => setForm({ ...form, title })} />
        <div className="row-2">
          <label>
            ID
            <input
              value={form.id ?? ""}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              disabled={Boolean(editId)}
              placeholder="auto from title"
            />
          </label>
          <label>
            Kind
            <select
              value={form.kind ?? "photo"}
              onChange={(e) => setForm({ ...form, kind: e.target.value as "photo" | "video" })}
            >
              <option value="photo">photo</option>
              <option value="video">video</option>
            </select>
          </label>
        </div>
        <label>
          Image URL
          <input
            value={form.image_url ?? ""}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            placeholder="https://… or upload"
          />
        </label>
        <label>
          Upload image
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onPick} />
        </label>
        {(pendingPreview || form.image_url) && (
          <img
            src={pendingPreview || form.image_url || ""}
            alt=""
            style={{ maxWidth: "14rem", borderRadius: "0.5rem", display: "block" }}
          />
        )}
        <div className="row-2">
          <label>
            Sort
            <input
              type="number"
              value={form.sort_order ?? 0}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            />
          </label>
          <label>
            Published
            <select
              value={form.published ? "1" : "0"}
              onChange={(e) => setForm({ ...form, published: e.target.value === "1" })}
            >
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </label>
        </div>
        <div className="admin-actions">
          <button className="btn btn-primary" type="submit" disabled={busy || uploading}>
            {uploading ? "Uploading…" : busy ? "Saving…" : editId ? "Update" : "Add"} item
          </button>
          {editId ? (
            <button type="button" className="admin-btn" onClick={reset}>
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
              <th>Kind</th>
              <th>Published</th>
              <th className="admin-col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5}>No gallery items yet. Homepage will fall back to bundled photos until you add some.</td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    {r.image_url ? (
                      <img src={r.image_url} alt="" style={{ width: "4rem", height: "2.5rem", objectFit: "cover", borderRadius: 4 }} />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{(r.title as Localized).en || "—"}</td>
                  <td>{r.kind}</td>
                  <td>{r.published ? "Yes" : "No"}</td>
                  <td className="admin-col-actions">
                    <div className="admin-actions">
                      <button type="button" onClick={() => startEdit(r)}>
                        Edit
                      </button>
                      <button type="button" className="danger" onClick={() => void remove(r.id)}>
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
