import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { langPath, useLang } from "../hooks/useLang";

export function NotFoundPage() {
  const { t } = useTranslation();
  const lang = useLang();

  return (
    <section className="section">
      <div className="container">
        <h1>{t("common.notFound")}</h1>
        <p>{t("common.notFoundText")}</p>
        <Link className="btn btn-primary" to={langPath(lang, "/")}>
          {t("common.home")}
        </Link>
      </div>
    </section>
  );
}
