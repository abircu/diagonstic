import { langs } from "../config/site";
import { departments } from "../data/departments";
import { doctors } from "../data/doctors";
import { therapies } from "../data/therapies";
import { programs } from "../data/programs";

export const staticRoutes = [
  "",
  "/about",
  "/contact",
  "/faq",
  "/team",
  "/gallery",
  "/medical",
  "/autism",
  "/doctors",
  "/departments",
  "/appointment",
  "/ambulance",
  "/packages",
  "/diagnostics",
  "/therapy",
  "/programs",
  "/admissions",
  "/assessment",
  "/activities",
  ...doctors.map((d) => `/doctors/${d.slug}`),
  ...departments.map((d) => `/departments/${d.slug}`),
  ...therapies.map((t) => `/therapy/${t.slug}`),
  ...programs.map((p) => `/programs/${p.slug}`),
];

export function prerenderPaths() {
  return langs.flatMap((lang) => staticRoutes.map((r) => (r ? `/${lang}${r}` : `/${lang}`)));
}
