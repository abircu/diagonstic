import { useState, type FormEvent } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageHero } from "../components/PageHero";
import { Seo } from "../seo/Seo";
import { useAuth } from "../lib/auth";
import { langPath, useLang } from "../hooks/useLang";

export function LoginPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const { signIn, signUp, session, isAdmin, loading } = useAuth();
  const [params] = useSearchParams();
  const nextRaw = params.get("next") || "";
  const next = nextRaw.startsWith("/") ? nextRaw : langPath(lang, "/bookings");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && session) {
    if (isAdmin && (next.startsWith("/admin") || params.get("admin") === "1")) {
      return <Navigate to={next.startsWith("/admin") ? next : "/admin"} replace />;
    }
    return <Navigate to={next.includes("/login") ? langPath(lang, "/bookings") : next} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "login") {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password, fullName.trim());
        // If confirm-email is on and no session, try login once; otherwise stay on form with error from signUp
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.failed"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Seo title={`${t("auth.login")} | ${t("brand.short")}`} description={t("auth.sub")} lang={lang} path="/login" />
      <PageHero title={mode === "login" ? t("auth.login") : t("auth.signup")} subtitle={t("auth.sub")} crumbs={[{ label: t("auth.login") }]} />
      <section className="section">
        <div className="container" style={{ maxWidth: "26rem" }}>
          <div className="btn-row" style={{ marginBottom: "1rem" }}>
            <button type="button" className={`btn ${mode === "login" ? "btn-primary" : "btn-outline"}`} onClick={() => setMode("login")}>
              {t("auth.login")}
            </button>
            <button type="button" className={`btn ${mode === "signup" ? "btn-primary" : "btn-outline"}`} onClick={() => setMode("signup")}>
              {t("auth.signup")}
            </button>
          </div>
          <form className="form-stack" onSubmit={onSubmit}>
            {mode === "signup" ? (
              <div className="form-field">
                <label htmlFor="auth-name">{t("auth.fullName")}</label>
                <input id="auth-name" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
              </div>
            ) : null}
            <div className="form-field">
              <label htmlFor="auth-email">{t("auth.email")}</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="form-field">
              <label htmlFor="auth-password">{t("auth.password")}</label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </div>
            {error ? <p className="error">{error}</p> : null}
            <button className="btn btn-primary" type="submit" disabled={busy || loading}>
              {busy || loading ? t("common.loading") : mode === "login" ? t("auth.login") : t("auth.signup")}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
