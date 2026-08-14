import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "../lib/supabase";

type Counts = {
  doctors: number;
  departments: number;
  therapies: number;
  programs: number;
  faqs: number;
  appointments: number;
  assessments: number;
  ambulances: number;
};

type RequestRow = {
  id: string;
  status: string;
  created_at: string;
  kind: "appointment" | "assessment" | "ambulance";
  label: string;
};

const PIE_COLORS = ["#0d9488", "#033367", "#c45c26", "#64748b"];
const STATUS_COLORS: Record<string, string> = {
  new: "#0d9488",
  reviewed: "#033367",
  closed: "#94a3b8",
};

async function count(table: string) {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

function dayKey(iso: string) {
  return iso.slice(0, 10);
}

function lastNDays(n: number) {
  const days: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export function AdminDashboardPage() {
  const [counts, setCounts] = useState<Counts | null>(null);
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const [
          doctors,
          departments,
          therapies,
          programs,
          faqs,
          appointments,
          assessments,
          ambulances,
          appts,
          assesses,
          ambs,
        ] = await Promise.all([
          count("doctors"),
          count("departments"),
          count("therapies"),
          count("programs"),
          count("faqs"),
          count("appointment_requests"),
          count("assessment_requests"),
          count("ambulance_requests"),
          supabase
            .from("appointment_requests")
            .select("id, status, created_at, full_name")
            .order("created_at", { ascending: false })
            .limit(100),
          supabase
            .from("assessment_requests")
            .select("id, status, created_at, parent_name")
            .order("created_at", { ascending: false })
            .limit(100),
          supabase
            .from("ambulance_requests")
            .select("id, status, created_at, contact_name")
            .order("created_at", { ascending: false })
            .limit(100),
        ]);

        if (appts.error) throw appts.error;
        if (assesses.error) throw assesses.error;
        if (ambs.error) throw ambs.error;

        const merged: RequestRow[] = [
          ...((appts.data ?? []) as { id: string; status: string; created_at: string; full_name: string }[]).map(
            (r) => ({
              id: r.id,
              status: r.status,
              created_at: r.created_at,
              kind: "appointment" as const,
              label: r.full_name,
            }),
          ),
          ...((assesses.data ?? []) as { id: string; status: string; created_at: string; parent_name: string }[]).map(
            (r) => ({
              id: r.id,
              status: r.status,
              created_at: r.created_at,
              kind: "assessment" as const,
              label: r.parent_name,
            }),
          ),
          ...((ambs.data ?? []) as { id: string; status: string; created_at: string; contact_name: string }[]).map(
            (r) => ({
              id: r.id,
              status: r.status,
              created_at: r.created_at,
              kind: "ambulance" as const,
              label: r.contact_name,
            }),
          ),
        ].sort((a, b) => b.created_at.localeCompare(a.created_at));

        if (!cancelled) {
          setCounts({ doctors, departments, therapies, programs, faqs, appointments, assessments, ambulances });
          setRequests(merged);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalRequests = (counts?.appointments ?? 0) + (counts?.assessments ?? 0) + (counts?.ambulances ?? 0);
  const openRequests = requests.filter((r) => r.status === "new" || r.status === "reviewed").length;

  const requestMix = useMemo(() => {
    if (!counts) return [];
    return [
      { name: "Appointments", value: counts.appointments },
      { name: "Assessments", value: counts.assessments },
      { name: "Ambulance", value: counts.ambulances },
    ].filter((x) => x.value > 0);
  }, [counts]);

  const contentBars = useMemo(() => {
    if (!counts) return [];
    return [
      { name: "Doctors", count: counts.doctors },
      { name: "Departments", count: counts.departments },
      { name: "Therapies", count: counts.therapies },
      { name: "Programs", count: counts.programs },
      { name: "FAQs", count: counts.faqs },
    ];
  }, [counts]);

  const trend = useMemo(() => {
    const days = lastNDays(14);
    const map = Object.fromEntries(
      days.map((d) => [d, { day: d.slice(5), appointments: 0, assessments: 0, ambulances: 0 }]),
    );
    for (const r of requests) {
      const key = dayKey(r.created_at);
      if (!map[key]) continue;
      if (r.kind === "appointment") map[key].appointments += 1;
      if (r.kind === "assessment") map[key].assessments += 1;
      if (r.kind === "ambulance") map[key].ambulances += 1;
    }
    return days.map((d) => map[d]);
  }, [requests]);

  const statusBars = useMemo(() => {
    const map: Record<string, number> = { new: 0, reviewed: 0, closed: 0 };
    for (const r of requests) {
      const key = map[r.status] !== undefined ? r.status : "new";
      map[key] = (map[key] ?? 0) + 1;
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [requests]);

  const recent = requests.slice(0, 8);

  return (
    <div className="admin-page admin-dashboard">
      <div className="dash-header">
        <div>
          <h1>Dashboard</h1>
          <p className="admin-lead">Operations overview — requests, content, and trends.</p>
        </div>
        <div className="dash-actions">
          <Link className="admin-btn" to="/admin/requests">
            Requests inbox
          </Link>
          <Link className="btn btn-primary" to="/admin/doctors">
            Manage doctors
          </Link>
        </div>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      {loading || !counts ? (
        <p className="empty-note">Loading dashboard…</p>
      ) : (
        <>
          <div className="dash-kpis">
            <article className="dash-kpi dash-kpi--teal">
              <span>Total requests</span>
              <strong>{totalRequests}</strong>
              <small>All channels</small>
            </article>
            <article className="dash-kpi dash-kpi--navy">
              <span>Open queue</span>
              <strong>{openRequests}</strong>
              <small>New + reviewed</small>
            </article>
            <article className="dash-kpi dash-kpi--orange">
              <span>Appointments</span>
              <strong>{counts.appointments}</strong>
              <small>
                <Link to="/admin/requests">View →</Link>
              </small>
            </article>
            <article className="dash-kpi">
              <span>Clinical content</span>
              <strong>{counts.doctors + counts.departments}</strong>
              <small>
                {counts.doctors} doctors · {counts.departments} depts
              </small>
            </article>
          </div>

          <div className="dash-grid">
            <section className="dash-panel dash-panel--wide">
              <div className="dash-panel-head">
                <h2>Request volume (14 days)</h2>
              </div>
              <div className="dash-chart">
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={trend} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gAppt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0d9488" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gAssess" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#033367" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#033367" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={32} />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="appointments" stroke="#0d9488" fill="url(#gAppt)" strokeWidth={2} />
                    <Area type="monotone" dataKey="assessments" stroke="#033367" fill="url(#gAssess)" strokeWidth={2} />
                    <Area type="monotone" dataKey="ambulances" stroke="#c45c26" fill="transparent" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="dash-panel">
              <div className="dash-panel-head">
                <h2>Request mix</h2>
              </div>
              <div className="dash-chart dash-chart--center">
                {requestMix.length === 0 ? (
                  <p className="empty-note">No requests yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={requestMix} dataKey="value" nameKey="name" innerRadius={58} outerRadius={90} paddingAngle={3}>
                        {requestMix.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>

            <section className="dash-panel">
              <div className="dash-panel-head">
                <h2>Status breakdown</h2>
              </div>
              <div className="dash-chart">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={statusBars} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={28} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {statusBars.map((row) => (
                        <Cell key={row.name} fill={STATUS_COLORS[row.name] || "#64748b"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="dash-panel">
              <div className="dash-panel-head">
                <h2>Content inventory</h2>
              </div>
              <div className="dash-chart">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={contentBars} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="name" width={88} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0a635f" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>

          <section className="dash-panel">
            <div className="dash-panel-head">
              <h2>Recent activity</h2>
              <Link to="/admin/requests">See all</Link>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.length === 0 ? (
                    <tr>
                      <td colSpan={4}>No requests yet.</td>
                    </tr>
                  ) : (
                    recent.map((r) => (
                      <tr key={`${r.kind}-${r.id}`}>
                        <td>{new Date(r.created_at).toLocaleString()}</td>
                        <td>
                          <span className="badge">{r.kind}</span>
                        </td>
                        <td>{r.label}</td>
                        <td>
                          <span className={`dash-status dash-status--${r.status}`}>{r.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
