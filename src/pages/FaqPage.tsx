import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { useAsyncData } from "../hooks/useAsyncData";
import { asLocalized, fetchFaqs } from "../services/content";
import { localized, useLang } from "../hooks/useLang";
import "./Faq.css";

export function FaqPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const { data: faqs, loading, error } = useAsyncData(() => fetchFaqs(), []);
  const [open, setOpen] = useState<string | null>(null);

  const list = faqs ?? [];
  const active = open ?? list[0]?.id ?? null;

  return (
    <>
      <Seo title={`${t("faq.title")} | ${t("brand.short")}`} description={t("faq.sub")} lang={lang} path="/faq" />
      <PageHero title={t("faq.title")} subtitle={t("faq.sub")} crumbs={[{ label: t("nav.faq") }]} />
      <section className="section">
        <div className="container faq-list">
          {loading ? <p className="empty-note">{t("common.loading")}</p> : null}
          {error ? <p className="empty-note">{error}</p> : null}
          {list.map((f) => {
            const isOpen = active === f.id;
            return (
              <div key={f.id} className="faq-item">
                <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : f.id)}>
                  {localized(asLocalized(f.question), lang)}
                </button>
                {isOpen ? <p>{localized(asLocalized(f.answer), lang)}</p> : null}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
