import { useState, type FormEvent } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useToast } from "../components/Toast";
import { useAuth } from "../lib/auth";
import "./admin.css";

export function AdminLoginPage() {
  const { signIn, session, isAdmin, loading } = useAuth();
  const toast = useToast();
  const [params] = useSearchParams();
  const nextRaw = params.get("next") || "/admin";
  const next = nextRaw.startsWith("/admin") ? nextRaw : "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && session && isAdmin) {
    return <Navigate to={next} replace />;
  }

  if (!loading && session && !isAdmin) {
    return (
      <div className="admin-loading">
        <h1>Access denied</h1>
        <p>This account is not an admin. Use an admin profile, or set role to admin in Supabase.</p>
        <p>
          <Link to="/en">Back to site</Link>
        </p>
      </div>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await signIn(email.trim(), password);
      toast.success("Signed in");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <h1>Admin login</h1>
        <p className="admin-lead">Staff only. There is no public login on the site.</p>
        <form className="admin-form" onSubmit={onSubmit}>
          <label htmlFor="admin-email">
            Email
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          <label htmlFor="admin-password">
            Password
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="current-password"
            />
          </label>
          <button className="admin-btn" type="submit" disabled={busy || loading}>
            {busy || loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p style={{ marginTop: "1.25rem" }}>
          <Link to="/en">← Public site</Link>
        </p>
      </div>
    </div>
  );
}
