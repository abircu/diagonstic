import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Database, Localized } from "../lib/database.types";
import { useToast } from "../components/Toast";
import { supabase } from "../lib/supabase";
import { LocalizedInputs, asLocalized, emptyLocalized, slugify } from "./adminForm";

type Row = Database["public"]["Tables"]["packages"]["Row"];
type Input = Database["public"]["Tables"]["packages"]["Insert"];

const blank = (): Input => ({
  slug: "",
  name: emptyLocalized(),
  summary: emptyLocalized(),
  includes: [],
  sort_order: 0,
  published: true,
});

export function AdminPackagesPage() {
  const toast = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Input>(blank());
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase.from("packages").select("*").order("sort_order");
    if (err) toast.error(err.message);
    else setRows((data ?? []) as Row[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function startEdit(row: Row) {
    setEditId(row.id);
    setForm({
      slug: row.slug,
      name: asLocalized(row.name),
      summary: asLocalized(row.summary),
      includes: ((row.includes as Localized[]) ?? []).map((x) => asLocalized(x)),
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
    setBusy(true);
    const payload = {
      slug: form.slug || slugify(form.name.en),
      name: asLocalized(form.name),
      summary: asLocalized(form.summary),
      includes: ((form.includes as Localized[]) ?? []).map((x) => asLocalized(x)),
      sort_order: form.sort_order ?? 0,
      published: form.published ?? true,
    };
    const q = editId
      ? supabase.from("packages").update(payload as never).eq("id", editId)
      : supabase.from("packages").insert(payload as never);
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
    if (!confirm("Delete this package?")) return;
    const { error: err } = await supabase.from("packages").delete().eq("id", id);
    if (err) toast.error(err.message);
    else {
      toast.success("Deleted");
      await load();
    }
  }

  const includes = ((form.includes as Localized[]) ?? []) as Localized[];

  return (
    <div className="admin-page">
      <h1>Packages</h1>
      <p className="admin-lead">Health check-up packages shown on /packages and Medical hub.</p>
      <form className="admin-form" onSubmit={(e) => void onSubmit(e)}>
        <LocalizedInputs label="Name" value={form.name as Localized} onChange={(name) => setForm({ ...form, name })} />
        <LocalizedInputs
          label="Summary"
          value={form.summary as Localized}
          onChange={(summary) => setForm({ ...form, summary })}
          multiline
        />
        <label>
          Slug
          <input value={form.slug ?? ""} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto from name" />
        </label>

        <h2 className="admin-subhead">Includes</h2>
        {includes.map((item, index) => (
          <div key={index} className="admin-timeline-row">
            <LocalizedInputs
              label={`Item ${index + 1}`}
              value={item}
              onChange={(v) => {
                const next = includes.map((x, i) => (i === index ? v : x));
                setForm({ ...form, includes: next });
              }}
            />
            <button
              type="button"
              className="admin-btn danger"
              onClick={() => setForm({ ...form, includes: includes.filter((_, i) => i !== index) })}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-btn"
          onClick={() => setForm({ ...form, includes: [...includes, emptyLocalized()] })}
        >
          Add include
        </button>

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
            {editId ? "Update" : "Add"} package
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
              <th>Name</th>
              <th>Slug</th>
              <th>Published</th>
              <th className="admin-col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4}>No packages yet.</td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td>{(r.name as Localized).en || "—"}</td>
                  <td>{r.slug}</td>
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
