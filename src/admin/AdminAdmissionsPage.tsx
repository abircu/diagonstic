import { useEffect, useState, type FormEvent } from "react";
import type { Database, Localized } from "../lib/database.types";
import { useToast } from "../components/Toast";
import { supabase } from "../lib/supabase";
import { LocalizedInputs, asLocalized, emptyLocalized } from "./adminForm";

type Row = Database["public"]["Tables"]["admissions_page"]["Row"];

type FormState = {
  title: Localized;
  subtitle: Localized;
  who_title: Localized;
  who_body: Localized;
  steps_title: Localized;
  steps: Localized[];
  docs_title: Localized;
  docs: Localized[];
  cta_label: Localized;
  cta_link: string;
};

function parseList(raw: unknown): Localized[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => asLocalized(item));
}

const blank = (): FormState => ({
  title: emptyLocalized(),
  subtitle: emptyLocalized(),
  who_title: emptyLocalized(),
  who_body: emptyLocalized(),
  steps_title: emptyLocalized(),
  steps: [],
  docs_title: emptyLocalized(),
  docs: [],
  cta_label: emptyLocalized(),
  cta_link: "/assessment",
});

export function AdminAdmissionsPage() {
  const toast = useToast();
  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error: err } = await supabase.from("admissions_page").select("*").eq("id", 1).maybeSingle();
      if (err) {
        toast.error(err.message);
        setForm(blank());
        return;
      }
      if (data) {
        const row = data as Row;
        setForm({
          title: asLocalized(row.title),
          subtitle: asLocalized(row.subtitle),
          who_title: asLocalized(row.who_title),
          who_body: asLocalized(row.who_body),
          steps_title: asLocalized(row.steps_title),
          steps: parseList(row.steps),
          docs_title: asLocalized(row.docs_title),
          docs: parseList(row.docs),
          cta_label: asLocalized(row.cta_label),
          cta_link: row.cta_link || "/assessment",
        });
      } else setForm(blank());
    })();
  }, []);

  function updateStep(index: number, value: Localized) {
    if (!form) return;
    setForm({ ...form, steps: form.steps.map((s, i) => (i === index ? value : s)) });
  }

  function updateDoc(index: number, value: Localized) {
    if (!form) return;
    setForm({ ...form, docs: form.docs.map((d, i) => (i === index ? value : d)) });
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    const payload = {
      id: 1,
      title: asLocalized(form.title),
      subtitle: asLocalized(form.subtitle),
      who_title: asLocalized(form.who_title),
      who_body: asLocalized(form.who_body),
      steps_title: asLocalized(form.steps_title),
      steps: form.steps.map((s) => asLocalized(s)),
      docs_title: asLocalized(form.docs_title),
      docs: form.docs.map((d) => asLocalized(d)),
      cta_label: asLocalized(form.cta_label),
      cta_link: form.cta_link.trim() || "/assessment",
      updated_at: new Date().toISOString(),
    };
    const { error: err } = await supabase.from("admissions_page").upsert(payload as never);
    setBusy(false);
    if (err) toast.error(err.message);
    else toast.success("Admissions page saved");
  }

  if (!form) return <p className="admin-page">Loading…</p>;

  return (
    <div className="admin-page">
      <h1>Admissions page</h1>
      <p className="admin-lead">Edit /admissions — who can apply, steps, documents, and CTA.</p>

      <form className="admin-form" onSubmit={(e) => void onSave(e)}>
        <h2 className="admin-subhead">Page header</h2>
        <LocalizedInputs label="Title" value={form.title} onChange={(title) => setForm({ ...form, title })} />
        <LocalizedInputs
          label="Subtitle"
          value={form.subtitle}
          onChange={(subtitle) => setForm({ ...form, subtitle })}
          multiline
        />

        <h2 className="admin-subhead">Who can apply</h2>
        <LocalizedInputs label="Section title" value={form.who_title} onChange={(who_title) => setForm({ ...form, who_title })} />
        <LocalizedInputs
          label="Section text"
          value={form.who_body}
          onChange={(who_body) => setForm({ ...form, who_body })}
          multiline
        />

        <h2 className="admin-subhead">Enrollment steps</h2>
        <LocalizedInputs
          label="Steps title"
          value={form.steps_title}
          onChange={(steps_title) => setForm({ ...form, steps_title })}
        />
        {form.steps.map((step, index) => (
          <div key={index} className="admin-timeline-row">
            <LocalizedInputs label={`Step ${index + 1}`} value={step} onChange={(v) => updateStep(index, v)} />
            <button
              type="button"
              className="admin-btn danger"
              onClick={() => setForm({ ...form, steps: form.steps.filter((_, i) => i !== index) })}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-btn"
          onClick={() => setForm({ ...form, steps: [...form.steps, emptyLocalized()] })}
        >
          Add step
        </button>

        <h2 className="admin-subhead">Documents checklist</h2>
        <LocalizedInputs label="Docs title" value={form.docs_title} onChange={(docs_title) => setForm({ ...form, docs_title })} />
        {form.docs.map((doc, index) => (
          <div key={index} className="admin-timeline-row">
            <LocalizedInputs label={`Document ${index + 1}`} value={doc} onChange={(v) => updateDoc(index, v)} />
            <button
              type="button"
              className="admin-btn danger"
              onClick={() => setForm({ ...form, docs: form.docs.filter((_, i) => i !== index) })}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-btn"
          onClick={() => setForm({ ...form, docs: [...form.docs, emptyLocalized()] })}
        >
          Add document
        </button>

        <h2 className="admin-subhead">CTA</h2>
        <LocalizedInputs label="Button label" value={form.cta_label} onChange={(cta_label) => setForm({ ...form, cta_label })} />
        <label>
          Button link path
          <input
            value={form.cta_link}
            onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
            placeholder="/assessment"
          />
        </label>

        <div className="admin-actions">
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "Saving…" : "Save admissions page"}
          </button>
        </div>
      </form>
    </div>
  );
}
