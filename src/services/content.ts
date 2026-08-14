import { supabase } from "../lib/supabase";
import type { Database, Localized } from "../lib/database.types";

export type DoctorRow = Database["public"]["Tables"]["doctors"]["Row"];
export type DepartmentRow = Database["public"]["Tables"]["departments"]["Row"];
export type TherapyRow = Database["public"]["Tables"]["therapies"]["Row"];
export type ProgramRow = Database["public"]["Tables"]["programs"]["Row"];
export type FaqRow = Database["public"]["Tables"]["faqs"]["Row"];
export type TestimonialRow = Database["public"]["Tables"]["testimonials"]["Row"];
export type SpecialtyRow = Database["public"]["Tables"]["specialties"]["Row"];
export type DiagnosticRow = Database["public"]["Tables"]["diagnostics"]["Row"];
export type PackageRow = Database["public"]["Tables"]["packages"]["Row"];
export type StatRow = Database["public"]["Tables"]["stats"]["Row"];
export type SiteSettingsRow = Database["public"]["Tables"]["site_settings"]["Row"];

async function listPublished<T>(table: string) {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as T[];
}

export async function fetchDoctors() {
  return listPublished<DoctorRow>("doctors");
}

export async function fetchDoctorBySlug(slug: string) {
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data as DoctorRow | null;
}

export async function fetchDepartments() {
  return listPublished<DepartmentRow>("departments");
}

export async function fetchDepartmentBySlug(slug: string) {
  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data as DepartmentRow | null;
}

export async function fetchTherapies() {
  return listPublished<TherapyRow>("therapies");
}

export async function fetchTherapyBySlug(slug: string) {
  const { data, error } = await supabase
    .from("therapies")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data as TherapyRow | null;
}

export async function fetchPrograms() {
  return listPublished<ProgramRow>("programs");
}

export async function fetchProgramBySlug(slug: string) {
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data as ProgramRow | null;
}

export async function fetchFaqs() {
  return listPublished<FaqRow>("faqs");
}

export async function fetchTestimonials() {
  return listPublished<TestimonialRow>("testimonials");
}

export async function fetchSpecialties() {
  return listPublished<SpecialtyRow>("specialties");
}

export async function fetchDiagnostics() {
  return listPublished<DiagnosticRow>("diagnostics");
}

export async function fetchPackages() {
  return listPublished<PackageRow>("packages");
}

export async function fetchStats() {
  return listPublished<StatRow>("stats");
}

export async function fetchSiteSettings() {
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw error;
  return data as SiteSettingsRow | null;
}

export async function submitAppointment(input: {
  full_name: string;
  phone: string;
  email: string;
  department_slug?: string;
  doctor_slug?: string;
  preferred_date?: string;
  notes?: string;
}) {
  const { error } = await supabase.from("appointment_requests").insert(input as never);
  if (error) throw error;
}

export async function submitAssessment(input: {
  parent_name: string;
  phone: string;
  email: string;
  child_age: string;
  concerns: string;
  prior_diagnosis?: string;
  preferred_shift?: string;
  notes?: string;
}) {
  const { error } = await supabase.from("assessment_requests").insert(input as never);
  if (error) throw error;
}

export async function submitAmbulance(input: {
  contact_name: string;
  phone: string;
  email: string;
  pickup_location: string;
  notes?: string;
}) {
  const { error } = await supabase.from("ambulance_requests").insert(input as never);
  if (error) throw error;
}

export function asLocalized(value: unknown): Localized {
  if (value && typeof value === "object" && "en" in (value as object)) {
    const v = value as Localized;
    return { en: String(v.en ?? ""), bn: String(v.bn ?? v.en ?? "") };
  }
  return { en: String(value ?? ""), bn: String(value ?? "") };
}
