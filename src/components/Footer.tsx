import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { langPath, localized, useLang } from "../hooks/useLang";
import { useSiteSettings } from "../hooks/useSiteSettings";
import "./Footer.css";

export function Footer() {
  const { t } = useTranslation();
  const lang = useLang();
  const { site } = useSiteSettings();
  const link = (path: string) => langPath(lang, path);

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h2 className="footer-brand">{site.brand || t("brand.name")}</h2>
          <p>{localized(site.tagline, lang)}</p>
        </div>
        <div>
          <h3>{t("footer.quick")}</h3>
          <ul>
            <li>
              <Link to={link("/medical")}>{t("nav.medical")}</Link>
            </li>
            <li>
              <Link to={link("/autism")}>{t("nav.autism")}</Link>
            </li>
            <li>
              <Link to={link("/appointment")}>{t("nav.appointment")}</Link>
            </li>
            <li>
              <Link to={link("/assessment")}>{t("nav.assessment")}</Link>
            </li>
            <li>
              <Link to={link("/faq")}>{t("nav.faq")}</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3>{t("footer.contact")}</h3>
          <ul>
            <li>
              <a href={`tel:${site.phones.main}`}>{site.phones.mainDisplay}</a>
            </li>
            <li>
              <a href={`mailto:${site.email.info}`}>{site.email.info}</a>
            </li>
          </ul>
        </div>
        <div>
          <h3>{t("footer.location")}</h3>
          <p>{localized(site.address, lang)}</p>
          <p>{localized(site.hours, lang)}</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} {site.brandShort || t("brand.short")}. {t("footer.rights")}
        </p>
      </div>
    </footer>
  );
}
