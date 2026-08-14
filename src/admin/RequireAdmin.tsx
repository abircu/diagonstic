import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";

export function RequireAdmin() {
  const { loading, session, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Loading…</p>
      </div>
    );
  }

  if (!session) {
    const next = encodeURIComponent(location.pathname || "/admin");
    return <Navigate to={`/admin/login?next=${next}`} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="admin-loading">
        <h1>Access denied</h1>
        <p>Your account is signed in but not an admin. Set role to admin in Supabase profiles.</p>
      </div>
    );
  }

  return <Outlet />;
}
