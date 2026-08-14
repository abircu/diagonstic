/**
 * Generates supabase/seed.sql from src/data/*.ts
 * Run: npx tsx scripts/generate-seed.ts
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { departments } from "../src/data/departments.ts";
import { doctors } from "../src/data/doctors.ts";
import { therapies } from "../src/data/therapies.ts";
import { programs } from "../src/data/programs.ts";
import { specialties, diagnostics, packages } from "../src/data/medical.ts";
import { faqs, testimonials, galleryItems } from "../src/data/content.ts";
import { homeStats } from "../src/data/stats.ts";
import { siteConfig } from "../src/config/site.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "..", "supabase", "seed.sql");

function j(v: unknown) {
  return JSON.stringify(v).replace(/'/g, "''");
}

const lines: string[] = [
  "-- Auto-generated seed — run AFTER schema.sql",
  "-- npx tsx scripts/generate-seed.ts",
  "",
  "delete from public.ambulance_requests;",
  "delete from public.assessment_requests;",
  "delete from public.appointment_requests;",
  "delete from public.youtube_videos;",
  "delete from public.sliders;",
  "delete from public.gallery_items;",
  "delete from public.testimonials;",
  "delete from public.faqs;",
  "delete from public.stats;",
  "delete from public.packages;",
  "delete from public.diagnostics;",
  "delete from public.specialties;",
  "delete from public.programs;",
  "delete from public.therapies;",
  "delete from public.doctors;",
  "delete from public.departments;",
  "delete from public.site_settings;",
  "",
];

lines.push(`insert into public.site_settings (
  id, brand, brand_short, tagline,
  phone_main, phone_main_display, phone_medical, phone_medical_display,
  phone_admission, phone_admission_display, email_info, email_admission,
  address, hours, social
) values (
  1,
  '${siteConfig.brand.replace(/'/g, "''")}',
  '${siteConfig.brandShort.replace(/'/g, "''")}',
  '${j(siteConfig.tagline)}'::jsonb,
  '${siteConfig.phones.main}',
  '${siteConfig.phones.mainDisplay}',
  '${siteConfig.phones.medical}',
  '${siteConfig.phones.medicalDisplay}',
  '${siteConfig.phones.admission}',
  '${siteConfig.phones.admissionDisplay}',
  '${siteConfig.email.info}',
  '${siteConfig.email.admission}',
  '${j(siteConfig.address)}'::jsonb,
  '${j(siteConfig.hours)}'::jsonb,
  '${j(siteConfig.social)}'::jsonb
);`);
lines.push("");

departments.forEach((d, i) => {
  lines.push(`insert into public.departments (slug, name, group_key, summary, body, sort_order) values (
  '${d.slug}', '${j(d.name)}'::jsonb, '${d.group}', '${j(d.summary)}'::jsonb, '${j(d.body)}'::jsonb, ${i}
);`);
});
lines.push("");

doctors.forEach((d, i) => {
  lines.push(`insert into public.doctors (slug, name, title, department_slug, hub, bio, schedule, sort_order) values (
  '${d.slug}', '${j(d.name)}'::jsonb, '${j(d.title)}'::jsonb, '${d.departmentSlug}', '${d.hub}',
  '${j(d.bio)}'::jsonb, '${j(d.schedule)}'::jsonb, ${i}
);`);
});
lines.push("");

therapies.forEach((t, i) => {
  lines.push(`insert into public.therapies (slug, name, summary, what, how, benefits, featured, sort_order) values (
  '${t.slug}', '${j(t.name)}'::jsonb, '${j(t.summary)}'::jsonb, '${j(t.what)}'::jsonb, '${j(t.how)}'::jsonb,
  '${j(t.benefits)}'::jsonb, ${t.featured ? "true" : "false"}, ${i}
);`);
});
lines.push("");

programs.forEach((p, i) => {
  lines.push(`insert into public.programs (slug, name, age, summary, offer, why, benefits, featured, sort_order) values (
  '${p.slug}', '${j(p.name)}'::jsonb, '${j(p.age)}'::jsonb, '${j(p.summary)}'::jsonb,
  '${j(p.offer)}'::jsonb, '${j(p.why)}'::jsonb, '${j(p.benefits)}'::jsonb, ${p.featured ? "true" : "false"}, ${i}
);`);
});
lines.push("");

specialties.forEach((s, i) => {
  lines.push(`insert into public.specialties (slug, name, summary, sort_order) values (
  '${s.slug}', '${j(s.name)}'::jsonb, '${j(s.summary)}'::jsonb, ${i}
);`);
});
lines.push("");

diagnostics.forEach((d, i) => {
  lines.push(`insert into public.diagnostics (slug, name, summary, sort_order) values (
  '${d.slug}', '${j(d.name)}'::jsonb, '${j(d.summary)}'::jsonb, ${i}
);`);
});
lines.push("");

packages.forEach((p, i) => {
  lines.push(`insert into public.packages (slug, name, summary, includes, sort_order) values (
  '${p.slug}', '${j(p.name)}'::jsonb, '${j(p.summary)}'::jsonb, '${j(p.includes)}'::jsonb, ${i}
);`);
});
lines.push("");

faqs.forEach((f, i) => {
  lines.push(`insert into public.faqs (id, category, question, answer, sort_order) values (
  '${f.id}', '${f.category}', '${j(f.question)}'::jsonb, '${j(f.answer)}'::jsonb, ${i}
);`);
});
lines.push("");

testimonials.forEach((t, i) => {
  lines.push(`insert into public.testimonials (id, quote, author, sort_order) values (
  '${t.id}', '${j(t.quote)}'::jsonb, '${j(t.author)}'::jsonb, ${i}
);`);
});
lines.push("");

galleryItems.forEach((g, i) => {
  lines.push(`insert into public.gallery_items (id, title, kind, sort_order) values (
  '${g.id}', '${j(g.title)}'::jsonb, '${g.kind}', ${i}
);`);
});
lines.push("");

const labelMap: Record<string, { en: string; bn: string }> = {
  doctors: { en: "Doctors & specialists", bn: "ডাক্তার ও বিশেষজ্ঞ" },
  departments: { en: "Departments", bn: "বিভাগ" },
  children: { en: "Children supported", bn: "সহায়তাপ্রাপ্ত শিশু" },
  therapists: { en: "Therapists", bn: "থেরাপিস্ট" },
};

homeStats.forEach((s, i) => {
  lines.push(`insert into public.stats (id, value, suffix, label, sort_order) values (
  '${s.id}', ${s.value}, '${s.suffix}', '${j(labelMap[s.id])}'::jsonb, ${i}
);`);
});

lines.push("");
lines.push("-- Done. Verify: select count(*) from doctors;");

writeFileSync(out, lines.join("\n"), "utf8");
console.log(`Wrote ${out}`);
