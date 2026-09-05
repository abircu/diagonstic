import { useEffect, useState, type FormEvent } from "react";
import type { Database, Localized } from "../lib/database.types";
import { useToast } from "../components/Toast";
import { supabase } from "../lib/supabase";
import { LocalizedInputs, asLocalized, emptyLocalized } from "./adminForm";

type Row = Database["public"]["Tables"]["about_page"]["Row"];

export type TimelineItem = {
  year: string;
  text: Localized;
};

type FormState = {
  title: Localized;
  subtitle: Localized;
  mission_title: Localized;
  mission: Localized;
  vision_title: Localized;
  vision: Localized;
  values_title: Localized;
  values_body: Localized;
  timeline_title: Localized;
  timeline: TimelineItem[];
};

function parseTimeline(raw: unknown): TimelineItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const row = (item ?? {}) as { year?: string; text?: unknown };
    return {
      year: String(row.year ?? ""),
      text: asLocalized(row.text),
    };
  });
}

const blank = (): FormState => ({
  title: emptyLocalized(),
  subtitle: emptyLocalized(),
  mission_title: emptyLocalized(),
  mission: emptyLocalized(),
  vision_title: emptyLocalized(),
  vision: emptyLocalized(),
  values_title: emptyLocalized(),
  values_body: emptyLocalized(),
  timeline_title: emptyLocalized(),
  timeline: [],
});

export function AdminAboutPage() {
  const toast = useToast();
  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error: err } = await supabase.from("about_page").select("*").eq("id", 1).maybeSingle();
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
          mission_title: asLocalized(row.mission_title),
          mission: asLocalized(row.mission),
          vision_title: asLocalized(row.vision_title),
          vision: asLocalized(row.vision),
          values_title: asLocalized(row.values_title),
          values_body: asLocalized(row.values_body),
          timeline_title: asLocalized(row.timeline_title),
          timeline: parseTimeline(row.timeline),
        });
      } else setForm(blank());
    })();
  }, []);

  function updateTimeline(index: number, patch: Partial<TimelineItem>) {
    if (!form) return;
    const timeline = form.timeline.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setForm({ ...form, timeline });
  }

  function addTimeline() {
    if (!form) return;
    setForm({
      ...form,
      timeline: [...form.timeline, { year: "", text: emptyLocalized() }],
    });
  }

  function removeTimeline(index: number) {
    if (!form) return;
    setForm({ ...form, timeline: form.timeline.filter((_, i) => i !== index) });
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setBusy(true);
    const payload = {
      id: 1,
      title: asLocalized(form.title),
      subtitle: asLocalized(form.subtitle),
      mission_title: asLocalized(form.mission_title),
      mission: asLocalized(form.mission),
      vision_title: asLocalized(form.vision_title),
      vision: asLocalized(form.vision),
      values_title: asLocalized(form.values_title),
      values_body: asLocalized(form.values_body),
      timeline_title: asLocalized(form.timeline_title),
      timeline: form.timeline.map((item) => ({
        year: item.year.trim(),
        text: asLocalized(item.text),
      })),
      updated_at: new Date().toISOString(),
    };
    const { error: err } = await supabase.from("about_page").upsert(payload as never);
    setBusy(false);
    if (err) toast.error(err.message);
    else toast.success("About page saved");
  }

  if (!form) return <p className="admin-page">Loading…</p>;

  return (
    <div className="admin-page">
      <h1>About page</h1>
      <p className="admin-lead">Edit /about — mission, vision, values, and timeline (EN + BN).</p>

      <form className="admin-form" onSubmit={(e) => void onSave(e)}>
        <h2 className="admin-subhead">Page header</h2>
        <LocalizedInputs label="Title" value={form.title} onChange={(title) => setForm({ ...form, title })} />
        <LocalizedInputs
          label="Subtitle"
          value={form.subtitle}
          onChange={(subtitle) => setForm({ ...form, subtitle })}
          multiline
        />

        <h2 className="admin-subhead">Mission</h2>
        <LocalizedInputs
          label="Mission title"
          value={form.mission_title}
          onChange={(mission_title) => setForm({ ...form, mission_title })}
        />
        <LocalizedInputs
          label="Mission text"
          value={form.mission}
          onChange={(mission) => setForm({ ...form, mission })}
          multiline
        />

        <h2 className="admin-subhead">Vision</h2>
        <LocalizedInputs
          label="Vision title"
          value={form.vision_title}
          onChange={(vision_title) => setForm({ ...form, vision_title })}
        />
        <LocalizedInputs
          label="Vision text"
          value={form.vision}
          onChange={(vision) => setForm({ ...form, vision })}
          multiline
        />

        <h2 className="admin-subhead">Values</h2>
        <LocalizedInputs
          label="Values title"
          value={form.values_title}
          onChange={(values_title) => setForm({ ...form, values_title })}
        />
        <LocalizedInputs
          label="Values text"
          value={form.values_body}
          onChange={(values_body) => setForm({ ...form, values_body })}
          multiline
        />

        <h2 className="admin-subhead">Timeline</h2>
        <LocalizedInputs
          label="Timeline title"
          value={form.timeline_title}
          onChange={(timeline_title) => setForm({ ...form, timeline_title })}
        />

        {form.timeline.map((item, index) => (
          <div key={index} className="admin-timeline-row">
            <label>
              Year
              <input value={item.year} onChange={(e) => updateTimeline(index, { year: e.target.value })} placeholder="2018" />
            </label>
            <LocalizedInputs
              label={`Event ${index + 1}`}
              value={item.text}
              onChange={(text) => updateTimeline(index, { text })}
              multiline
            />
            <button type="button" className="admin-btn danger" onClick={() => removeTimeline(index)}>
              Remove
            </button>
          </div>
        ))}

        <div className="admin-actions">
          <button type="button" className="admin-btn" onClick={addTimeline}>
            Add timeline item
          </button>
          <button className="btn btn-primary" type="submit" disabled={busy}>
            {busy ? "Saving…" : "Save about page"}
          </button>
        </div>
      </form>
    </div>
  );
}
