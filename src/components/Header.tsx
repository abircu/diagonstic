import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { type Lang } from "../config/site";
import { useAuth } from "../lib/auth";
import { langPath, useLang } from "../hooks/useLang";
import "./Header.css";

export function Header() {
  const { t, i18n } = useTranslation();
  const lang = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, signOut, loading } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (i18n.language !== lang) void i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const switchLang = (next: Lang) => {
    const rest = location.pathname.replace(/^\/(en|bn)/, "") || "";
    navigate(`/${next}${rest}${location.search}`);
  };

  const link = (path: string) => langPath(lang, path);

  const onLogout = async () => {
    await signOut();
    navigate(link("/"));
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to={link("/")} className="brand" aria-label={t("brand.name")}>
          <span className="brand-mark" aria-hidden>
            S
          </span>
          <span className="brand-text">
            <strong>{t("brand.short")}</strong>
            <small>{t("brand.taglineSmall")}</small>
          </span>
        </Link>

        <nav id="site-nav" className={`site-nav ${open ? "is-open" : ""}`} aria-label="Primary">
          <NavLink to={link("/")} end>
            {t("nav.home")}
          </NavLink>
          <NavLink to={link("/medical")}>{t("nav.medical")}</NavLink>
          <NavLink to={link("/autism")}>{t("nav.autism")}</NavLink>
          <NavLink to={link("/doctors")}>{t("nav.doctors")}</NavLink>
          <NavLink to={link("/therapy")}>{t("nav.therapy")}</NavLink>
          <NavLink to={link("/admissions")}>{t("nav.admissions")}</NavLink>
          <NavLink to={link("/about")}>{t("nav.about")}</NavLink>
          <NavLink to={link("/contact")}>{t("nav.contact")}</NavLink>
          <div className="nav-more">
            <span>{t("nav.more")}</span>
            <div className="nav-more-panel">
              <NavLink to={link("/departments")}>{t("nav.departments")}</NavLink>
              <NavLink to={link("/programs")}>{t("nav.programs")}</NavLink>
              <NavLink to={link("/appointment")}>{t("nav.appointment")}</NavLink>
              <NavLink to={link("/assessment")}>{t("nav.assessment")}</NavLink>
              <NavLink to={link("/team")}>{t("nav.team")}</NavLink>
              <NavLink to={link("/gallery")}>{t("nav.gallery")}</NavLink>
              <NavLink to={link("/faq")}>{t("nav.faq")}</NavLink>
              <NavLink to={link("/packages")}>{t("nav.packages")}</NavLink>
              <NavLink to={link("/diagnostics")}>{t("nav.diagnostics")}</NavLink>
              <NavLink to={link("/ambulance")}>{t("nav.ambulance")}</NavLink>
              <NavLink to={link("/activities")}>{t("nav.activities")}</NavLink>
            </div>
          </div>

          {!loading && isAdmin ? (
            <div className="nav-auth-mobile">
              <Link to="/admin">{t("auth.admin")}</Link>
              <button type="button" className="nav-auth-logout" onClick={() => void onLogout()}>
                {t("auth.logout")}
              </button>
            </div>
          ) : null}
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="site-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span />
            <span />
            <span />
          </button>
          {!loading && isAdmin ? (
            <div className="header-auth-desktop">
              <Link className="header-auth-link" to="/admin">
                {t("auth.admin")}
              </Link>
              <button type="button" className="header-auth-btn" onClick={() => void onLogout()}>
                {t("auth.logout")}
              </button>
            </div>
          ) : null}
          <label className="lang-select-wrap">
            <span className="sr-only">Language</span>
            <select
              className="lang-select"
              value={lang}
              onChange={(e) => switchLang(e.target.value as Lang)}
              aria-label="Language"
            >
              <option value="en">EN</option>
              <option value="bn">বাং</option>
            </select>
          </label>
        </div>
      </div>
    </header>
  );
}
