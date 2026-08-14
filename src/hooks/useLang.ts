import { useParams } from "react-router-dom";
import type { Lang } from "../config/site";
import { langs } from "../config/site";

export function useLang(): Lang {
  const { lang } = useParams();
  return langs.includes(lang as Lang) ? (lang as Lang) : "en";
}

export function localized<T extends { en: string; bn: string }>(item: T, lang: Lang) {
  return item[lang] || item.en;
}

export function langPath(lang: Lang, path = "") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (clean === "/") return `/${lang}`;
  return `/${lang}${clean}`;
}
