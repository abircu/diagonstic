import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Database, Localized } from "../lib/database.types";
import { supabase } from "../lib/supabase";
import { LocalizedInputs, asLocalized, emptyLocalized, slugify } from "./adminForm";

type Row = Database["public"]["Tables"]["programs"]["Row"];
type Input = Database["public"]["Tables"]["programs"]["Insert"];

const blank = (): Input => ({
  slug: "",
  name: emptyLocalized(),
  age: emptyLocalized(),
  summary: emptyLocalized(),
  offer: emptyLocalized(),
  why: emptyLocalized(),
  benefits: [],
  featured: false,
  sort_order: 0,
  published: true,
});

function benefitsToText(list: Localized[] | undefined) {
  return (list ?? []).map((b) => `${b.en} | ${b.bn}`).join("\n");
}

function textToBenefits(text: string): Localized[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [en, bn] = line.split("|").map((s) => s.trim());
      return { en: en || line, bn: bn || en || line };
    });
}

export function AdminProgramsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Input>(blank());
  const [benefitsText, setBenefitsText] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase.from("programs").select("*").order("sort_order");
    if (err) setError(err.message);
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
      age: asLocalized(row.age),
      summary: asLocalized(row.summary),
      offer: asLocalized(row.offer),
      why: asLocalized(row.why),
      benefits: row.benefits as Localized[],
      featured: row.featured,
      sort_order: row.sort_order,
      published: row.published,
    });
    setBenefitsText(benefitsToText(row.benefits as Localized[]));
  }

  function reset() {
    setEditId(null);
    setForm(blank());
    setBenefitsText("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name.en),
      benefits: textToBenefits(benefitsText),
    };
    const q = editId
      ? supabase.from("programs").update(payload as never).eq("id", editId)
      : supabase.from("programs").insert(payload as never);
    const { error: err } = await q;
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    reset();
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this program?")) return;
    const { error: err } = await supabase.from("programs").delete().eq("id", id);
    if (err) setError(err.message);
    else await load();
  }

  return (
    <div className="admin-page">
      <h1>Programs</h1>
      <form className="admin-form" onSubmit={onSubmit}>
        <LocalizedInputs label="Name" value={form.name} onChange={(name) => setForm({ ...form, name })} />
        <LocalizedInputs label="Age" value={form.age} onChange={(age) => setForm({ ...form, age })} />
        <label>
          Slug
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
        </label>
        <LocalizedInputs label="Summary" value={form.summary} onChange={(summary) => setForm({ ...form, summary })} multiline />
        <LocalizedInputs label="Offer" value={form.offer} onChange={(offer) => setForm({ ...form, offer })} multiline />
        <LocalizedInputs label="Why" value={form.why} onChange={(why) => setForm({ ...form, why })} multiline />
        <label>
          Benefits (EN | BN per line)
          <textarea value={benefitsText} onChange={(e) => setBenefitsText(e.target.value)} />
        </label>
        <div className="row-2">
          <label>
            Featured
            <select value={form.featured ? "1" : "0"} onChange={(e) => setForm({ ...form, featured: e.target.value === "1" })}>
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </label>
          <label>
            Sort
            <input type="number" value={form.sort_order ?? 0} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
          </label>
        </div>
        <label>
          Published
          <select value={form.published ? "1" : "0"} onChange={(e) => setForm({ ...form, published: e.target.value === "1" })}>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </label>
        {error ? <p className="admin-error">{error}</p> : null}
        <div className="admin-actions">
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {editId ? "Update" : "Add"} program
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
              <th>Age</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{(r.name as Localized).en}</td>
                <td>{(r.age as Localized).en}</td>
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
