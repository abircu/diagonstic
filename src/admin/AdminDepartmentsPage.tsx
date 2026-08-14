import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Database, Localized } from "../lib/database.types";
import { useToast } from "../components/Toast";
import { supabase } from "../lib/supabase";
import { LocalizedInputs, asLocalized, emptyLocalized, slugify } from "./adminForm";

type Row = Database["public"]["Tables"]["departments"]["Row"];
type Input = Database["public"]["Tables"]["departments"]["Insert"];

const blank = (): Input => ({
  slug: "",
  name: emptyLocalized(),
  group_key: "medicine",
  summary: emptyLocalized(),
  body: emptyLocalized(),
  sort_order: 0,
  published: true,
});

export function AdminDepartmentsPage() {
  const toast = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Input>(blank());
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase.from("departments").select("*").order("sort_order");
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
      group_key: row.group_key,
      summary: asLocalized(row.summary),
      body: asLocalized(row.body),
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
    const payload = { ...form, slug: form.slug || slugify(form.name.en) };
    const q = editId
      ? supabase.from("departments").update(payload as never).eq("id", editId)
      : supabase.from("departments").insert(payload as never);
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
    if (!confirm("Delete this department?")) return;
    const { error: err } = await supabase.from("departments").delete().eq("id", id);
    if (err) toast.error(err.message);
    else {
      toast.success("Deleted");
      await load();
    }
  }

  return (
    <div className="admin-page">
      <h1>Departments</h1>
      <form className="admin-form" onSubmit={onSubmit}>
        <LocalizedInputs label="Name" value={form.name} onChange={(name) => setForm({ ...form, name })} />
        <div className="row-2">
          <label>
            Slug
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </label>
          <label>
            Group
            <select value={form.group_key} onChange={(e) => setForm({ ...form, group_key: e.target.value })}>
              <option value="medicine">medicine</option>
              <option value="surgery">surgery</option>
              <option value="gynae">gynae</option>
              <option value="investigation">investigation</option>
              <option value="dental">dental</option>
            </select>
          </label>
        </div>
        <LocalizedInputs label="Summary" value={form.summary} onChange={(summary) => setForm({ ...form, summary })} multiline />
        <LocalizedInputs label="Body" value={form.body} onChange={(body) => setForm({ ...form, body })} multiline />
        <div className="row-2">
          <label>
            Sort
            <input type="number" value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
          </label>
          <label>
            Published
            <select value={form.published ? "1" : "0"} onChange={(e) => setForm({ ...form, published: e.target.value === "1" })}>
              <option value="1">Yes</option>
              <option value="0">No</option>
            </select>
          </label>
        </div>
        <div className="admin-actions">
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {editId ? "Update" : "Add"} department
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
              <th>Group</th>
              <th>Slug</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{(r.name as Localized).en}</td>
                <td>{r.group_key}</td>
                <td>{r.slug}</td>
                <td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
