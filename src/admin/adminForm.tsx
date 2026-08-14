import type { Localized } from "../lib/database.types";

export function emptyLocalized(en = "", bn = ""): Localized {
  return { en, bn };
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function asLocalized(value: unknown): Localized {
  if (value && typeof value === "object" && "en" in value) {
    const v = value as Localized;
    return { en: String(v.en ?? ""), bn: String(v.bn ?? "") };
  }
  return emptyLocalized(String(value ?? ""));
}

export function LocalizedInputs({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: Localized;
  onChange: (next: Localized) => void;
  multiline?: boolean;
}) {
  const Field = multiline ? "textarea" : "input";
  return (
    <div className="row-2">
      <label>
        {label} (EN)
        <Field
          value={value.en}
          onChange={(e) => onChange({ ...value, en: (e.target as HTMLInputElement).value })}
          required
        />
      </label>
      <label>
        {label} (BN)
        <Field
          value={value.bn}
          onChange={(e) => onChange({ ...value, bn: (e.target as HTMLInputElement).value })}
          required
        />
      </label>
    </div>
  );
}
