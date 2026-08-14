import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { orgJsonLd } from "../seo/jsonLd";
import { localized, useLang } from "../hooks/useLang";
import { useSiteSettings } from "../hooks/useSiteSettings";

export function ContactPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const { site } = useSiteSettings();

  return (
    <>
      <Seo
        title={`${t("contact.title")} | ${site.brandShort}`}
        description={t("contact.sub")}
        lang={lang}
        path="/contact"
        jsonLd={orgJsonLd(lang, site)}
      />
      <PageHero title={t("contact.title")} subtitle={t("contact.sub")} crumbs={[{ label: t("nav.contact") }]} />
      <section className="section">
        <div className="container card-grid cols-3">
          <article className="surface-card">
            <h2>{t("contact.hotlines")}</h2>
            <p>
              {t("contact.mainLine")}:{" "}
              <a href={`tel:${site.phones.main}`}>{site.phones.mainDisplay}</a>
            </p>
            <p>
              {t("contact.medicalLine")}:{" "}
              <a href={`tel:${site.phones.medical}`}>{site.phones.medicalDisplay}</a>
            </p>
            <p>
              {t("contact.admissionLine")}:{" "}
              <a href={`tel:${site.phones.admission}`}>{site.phones.admissionDisplay}</a>
            </p>
          </article>
          <article className="surface-card">
            <h2>{t("contact.email")}</h2>
            <p>
              <a href={`mailto:${site.email.info}`}>{site.email.info}</a>
            </p>
            <p>
              <a href={`mailto:${site.email.admission}`}>{site.email.admission}</a>
            </p>
            <h3 style={{ marginTop: "var(--space-4)" }}>{t("contact.hours")}</h3>
            <p>{localized(site.hours, lang)}</p>
          </article>
          <article className="surface-card">
            <h2>{t("contact.address")}</h2>
            <p>{localized(site.address, lang)}</p>
          </article>
        </div>
        <div className="container" style={{ marginTop: "var(--space-6)" }}>
          <h2>{t("contact.map")}</h2>
          <div
            className="empty-note"
            style={{ minHeight: "14rem", display: "grid", placeItems: "center" }}
            role="img"
            aria-label={t("contact.map")}
          >
            {localized(site.address, lang)}
          </div>
        </div>
      </section>
    </>
  );
}
