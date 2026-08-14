import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Database, Localized } from "../lib/database.types";
import { supabase } from "../lib/supabase";
import { LocalizedInputs, asLocalized, emptyLocalized, slugify } from "./adminForm";

type Row = Database["public"]["Tables"]["faqs"]["Row"];
type Input = Database["public"]["Tables"]["faqs"]["Insert"];

const blank = (): Input => ({
  id: "",
  category: "general",
  question: emptyLocalized(),
  answer: emptyLocalized(),
  sort_order: 0,
  published: true,
});

export function AdminFaqsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Input>(blank());
  const [editId, setEditId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase.from("faqs").select("*").order("sort_order");
    if (err) setError(err.message);
    else setRows((data ?? []) as Row[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function startEdit(row: Row) {
    setEditId(row.id);
    setForm({
      id: row.id,
      category: row.category,
      question: asLocalized(row.question),
      answer: asLocalized(row.answer),
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
    setError(null);
    const id = form.id || slugify(form.question.en);
    const payload = { ...form, id };
    const q = editId
      ? supabase.from("faqs").update(payload as never).eq("id", editId)
      : supabase.from("faqs").insert(payload as never);
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
    if (!confirm("Delete this FAQ?")) return;
    const { error: err } = await supabase.from("faqs").delete().eq("id", id);
    if (err) setError(err.message);
    else await load();
  }

  return (
    <div className="admin-page">
      <h1>FAQs</h1>
      <form className="admin-form" onSubmit={onSubmit}>
        <div className="row-2">
          <label>
            ID
            <input
              value={form.id}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              disabled={Boolean(editId)}
              placeholder="auto from question"
            />
          </label>
          <label>
            Category
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          </label>
        </div>
        <LocalizedInputs label="Question" value={form.question} onChange={(question) => setForm({ ...form, question })} multiline />
        <LocalizedInputs label="Answer" value={form.answer} onChange={(answer) => setForm({ ...form, answer })} multiline />
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
        {error ? <p className="admin-error">{error}</p> : null}
        <div className="admin-actions">
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {editId ? "Update" : "Add"} FAQ
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
              <th>Category</th>
              <th>Question</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.category}</td>
                <td>{(r.question as Localized).en}</td>
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
