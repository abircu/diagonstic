import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Database, Localized } from "../lib/database.types";
import { useToast } from "../components/Toast";
import { parseYoutubeId } from "../lib/youtube";
import { supabase } from "../lib/supabase";
import { LocalizedInputs, asLocalized, emptyLocalized } from "./adminForm";

type Row = Database["public"]["Tables"]["youtube_videos"]["Row"];
type Input = Database["public"]["Tables"]["youtube_videos"]["Insert"];

const blank = (): Input => ({
  title: emptyLocalized(),
  youtube_url: "",
  sort_order: 0,
  published: true,
});

export function AdminVideosPage() {
  const toast = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Input>(blank());
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase.from("youtube_videos").select("*").order("sort_order");
    if (err) toast.error(err.message);
    else setRows((data ?? []) as Row[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function startEdit(row: Row) {
    setEditId(row.id);
    setForm({
      title: asLocalized(row.title),
      youtube_url: row.youtube_url,
      sort_order: row.sort_order,
      published: row.published,
    });
  }

  function reset() {
    setEditId(null);
    setForm(blank());
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const url = (form.youtube_url ?? "").trim();
    if (!parseYoutubeId(url)) {
      toast.error("Enter a valid YouTube link (watch, youtu.be, or Shorts)");
      return;
    }
    setBusy(true);
    const payload = {
      title: form.title,
      youtube_url: url,
      sort_order: form.sort_order ?? 0,
      published: form.published ?? true,
    };
    const q = editId
      ? supabase.from("youtube_videos").update(payload as never).eq("id", editId)
      : supabase.from("youtube_videos").insert(payload as never);
    const { error: err } = await q;
    setBusy(false);
    if (err) {
      toast.error(err.message);
      return;
    }
    toast.success(editId ? "Video updated" : "Video added");
    reset();
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this video?")) return;
    const { error: err } = await supabase.from("youtube_videos").delete().eq("id", id);
    if (err) toast.error(err.message);
    else {
      toast.success("Deleted");
      await load();
    }
  }

  return (
    <div className="admin-page">
      <h1>YouTube videos</h1>
      <p className="admin-lead">Paste a YouTube link. Published videos show on the public Videos page.</p>
      <form className="admin-form" onSubmit={onSubmit}>
        <LocalizedInputs label="Title" value={form.title as Localized} onChange={(title) => setForm({ ...form, title })} />
        <label>
          YouTube URL
          <input
            value={form.youtube_url ?? ""}
            onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
            placeholder="https://www.youtube.com/watch?v=…"
            required
          />
        </label>
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
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {editId ? "Update" : "Add"} video
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
              <th>Title</th>
              <th>URL</th>
              <th>Published</th>
              <th className="admin-col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4}>No videos yet. Add a YouTube link above.</td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td>{(r.title as Localized).en || "—"}</td>
                  <td className="admin-url-cell">
                    <a href={r.youtube_url} target="_blank" rel="noreferrer" title={r.youtube_url}>
                      {r.youtube_url}
                    </a>
                  </td>
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
