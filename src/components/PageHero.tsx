import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { langPath, useLang } from "../hooks/useLang";

type Crumb = { label: string; to?: string };

type Props = {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  image?: string;
};

export function PageHero({ title, subtitle, crumbs = [], image }: Props) {
  const { t } = useTranslation();
  const lang = useLang();

  return (
    <header
      className={`page-hero${image ? " page-hero--photo" : ""}`}
      style={image ? { "--hero-image": `url(${image})` } as React.CSSProperties : undefined}
    >
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to={langPath(lang, "/")}>{t("common.home")}</Link>
          {crumbs.map((c) => (
            <span key={c.label}>
              <span aria-hidden> / </span>
              {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </header>
  );
}
