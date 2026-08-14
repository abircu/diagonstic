import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import "./admin.css";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/requests", label: "Requests" },
  { to: "/admin/doctors", label: "Doctors" },
  { to: "/admin/departments", label: "Departments" },
  { to: "/admin/therapies", label: "Therapies" },
  { to: "/admin/programs", label: "Programs" },
  { to: "/admin/faqs", label: "FAQs" },
  { to: "/admin/settings", label: "Settings" },
];

export function AdminLayout() {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <strong>Suborno Admin</strong>
          <small>{profile?.full_name || user?.email}</small>
        </div>
        <nav className="admin-nav">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <a href="/en" target="_blank" rel="noreferrer">
            View site
          </a>
          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate("/admin/login");
            }}
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
