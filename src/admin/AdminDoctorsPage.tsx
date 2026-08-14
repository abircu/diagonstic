import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Database, Localized } from "../lib/database.types";
import { useToast } from "../components/Toast";
import { supabase } from "../lib/supabase";
import { LocalizedInputs, asLocalized, emptyLocalized, slugify } from "./adminForm";

type Doctor = Database["public"]["Tables"]["doctors"]["Row"];
type DoctorInput = Database["public"]["Tables"]["doctors"]["Insert"];

const blank = (): DoctorInput => ({
  slug: "",
  name: emptyLocalized(),
  title: emptyLocalized(),
  department_slug: null,
  hub: "medical",
  bio: emptyLocalized(),
  schedule: emptyLocalized(),
  photo_url: "",
  sort_order: 0,
  published: true,
});

type DeptOption = { slug: string; name: Localized };

export function AdminDoctorsPage() {
  const toast = useToast();
  const [rows, setRows] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<DeptOption[]>([]);
  const [form, setForm] = useState<DoctorInput>(blank());
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [{ data, error: err }, { data: deps, error: depErr }] = await Promise.all([
      supabase.from("doctors").select("*").order("sort_order"),
      supabase.from("departments").select("slug, name").order("sort_order"),
    ]);
    if (err) toast.error(err.message);
    else setRows((data ?? []) as Doctor[]);
    if (depErr) toast.error(depErr.message);
    else setDepartments((deps ?? []) as DeptOption[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function startEdit(row: Doctor) {
    setEditId(row.id);
    setForm({
      slug: row.slug,
      name: asLocalized(row.name),
      title: asLocalized(row.title),
      department_slug: row.department_slug,
      hub: row.hub,
      bio: asLocalized(row.bio),
      schedule: asLocalized(row.schedule),
      photo_url: row.photo_url ?? "",
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
      ...form,
      slug: form.slug || slugify(form.name.en),
      photo_url: form.photo_url || null,
      department_slug: form.department_slug || null,
    };
    const q = editId
      ? supabase.from("doctors").update(payload as never).eq("id", editId)
      : supabase.from("doctors").insert(payload as never);
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
    if (!confirm("Delete this doctor?")) return;
    const { error: err } = await supabase.from("doctors").delete().eq("id", id);
    if (err) toast.error(err.message);
    else {
      toast.success("Deleted");
      await load();
    }
  }

  return (
    <div className="admin-page">
      <h1>Doctors</h1>
      <p className="admin-lead">Create and edit doctor profiles (EN + BN).</p>
      <form className="admin-form" onSubmit={onSubmit}>
        <LocalizedInputs label="Name" value={form.name} onChange={(name) => setForm({ ...form, name })} />
        <LocalizedInputs label="Title" value={form.title} onChange={(title) => setForm({ ...form, title })} />
        <div className="row-2">
          <label>
            Slug
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto from EN name" />
          </label>
          <label>
            Hub
            <select value={form.hub} onChange={(e) => setForm({ ...form, hub: e.target.value as DoctorInput["hub"] })}>
              <option value="medical">medical</option>
              <option value="autism">autism</option>
              <option value="both">both</option>
            </select>
          </label>
        </div>
        <div className="row-2">
          <label>
            Department
            <select
              value={form.department_slug ?? ""}
              onChange={(e) => setForm({ ...form, department_slug: e.target.value || null })}
            >
              <option value="">— None —</option>
              {departments.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {asLocalized(d.name).en} ({d.slug})
                </option>
              ))}
            </select>
          </label>
          <label>
            Photo URL
            <input
              value={form.photo_url ?? ""}
              onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
              placeholder="https://… (shown on Doctors & Team pages)"
            />
          </label>
        </div>
        <LocalizedInputs label="Bio" value={form.bio} onChange={(bio) => setForm({ ...form, bio })} multiline />
        <LocalizedInputs
          label="Schedule"
          value={form.schedule}
          onChange={(schedule) => setForm({ ...form, schedule })}
          multiline
        />
        <div className="row-2">
          <label>
            Sort order
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
            {busy ? "Saving…" : editId ? "Update doctor" : "Add doctor"}
          </button>
          {editId ? (
            <button type="button" className="admin-btn" onClick={reset}>
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Hub</th>
              <th>Dept</th>
              <th>Order</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  {(r.name as Localized).en}
                  {!r.published ? " (draft)" : ""}
                </td>
                <td>{r.hub}</td>
                <td>{r.department_slug}</td>
                <td>{r.sort_order}</td>
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
