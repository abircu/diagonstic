import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Database, Localized } from "../lib/database.types";
import { useToast } from "../components/Toast";
import { supabase } from "../lib/supabase";
import { LocalizedInputs, asLocalized, emptyLocalized } from "./adminForm";

type Row = Database["public"]["Tables"]["activities"]["Row"];
type Input = Database["public"]["Tables"]["activities"]["Insert"];

const blank = (): Input => ({
  title: emptyLocalized(),
  image_url: "",
  sort_order: 0,
  published: true,
});

export function AdminActivitiesPage() {
  const toast = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Input>(blank());
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase.from("activities").select("*").order("sort_order");
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
      title: asLocalized(row.title),
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
      const path = `activities/${Date.now()}.${ext}`;
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
    const existing = (form.image_url ?? "").trim();
    return existing || null;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const imageUrl = await resolveImageUrl();
    const payload = {
      title: asLocalized(form.title),
      image_url: imageUrl,
      sort_order: form.sort_order ?? 0,
      published: form.published ?? true,
    };
    const q = editId
      ? supabase.from("activities").update(payload as never).eq("id", editId)
      : supabase.from("activities").insert(payload as never);
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
    if (!confirm("Delete this activity?")) return;
    const { error: err } = await supabase.from("activities").delete().eq("id", id);
    if (err) toast.error(err.message);
    else {
      toast.success("Deleted");
      await load();
    }
  }

  return (
    <div className="admin-page">
      <h1>Activities</h1>
      <p className="admin-lead">Cards on /activities — title (EN/BN) and optional image.</p>
      <form className="admin-form" onSubmit={(e) => void onSubmit(e)}>
        <LocalizedInputs label="Title" value={form.title as Localized} onChange={(title) => setForm({ ...form, title })} />
        <label>
          Image URL
          <input
            value={form.image_url ?? ""}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
            placeholder="optional — or upload"
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
            {uploading ? "Uploading…" : busy ? "Saving…" : editId ? "Update" : "Add"} activity
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
              <th>Published</th>
              <th className="admin-col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4}>No activities yet.</td>
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
