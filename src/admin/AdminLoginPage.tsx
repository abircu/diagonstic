import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";

export function AdminLoginPage() {
  const { signIn, session, isAdmin, loading } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (!loading && session && isAdmin) {
    return <Navigate to={from} replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const profile = await signIn(email.trim(), password);
      const role = profile?.role;
      if (role !== "admin" && role !== "editor") {
        setError("Signed in, but this account is not an admin. Set role in Supabase profiles.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={onSubmit}>
        <h1>Admin login</h1>
        <p className="admin-lead">Sign in with your Supabase Auth account.</p>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>
        {error ? <p className="admin-error">{error}</p> : null}
        <button className="btn btn-primary" type="submit" disabled={busy || loading} style={{ width: "100%", marginTop: "0.5rem" }}>
          {busy || loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
