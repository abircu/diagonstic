import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { langPath, useLang } from "../hooks/useLang";
import type { ReactNode } from "react";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const lang = useLang();
  const location = useLocation();

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p className="empty-note">Loading…</p>
        </div>
      </section>
    );
  }

  if (!session) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${langPath(lang, "/login")}?next=${next}`} replace />;
  }

  return <>{children}</>;
}
