import type { Localized } from "./database.types";
import type { Lang } from "../config/site";

export function loc(value: Localized | null | undefined, lang: Lang): string {
  if (!value) return "";
  return value[lang] || value.en || "";
}
