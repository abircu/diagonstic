import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../components/Toast";
import { supabase } from "../lib/supabase";

type Tab = "appointments" | "assessments" | "ambulances";

type AnyRow = Record<string, unknown> & { id: string; status: string; created_at: string };

const tables: Record<Tab, string> = {
  appointments: "appointment_requests",
  assessments: "assessment_requests",
  ambulances: "ambulance_requests",
};

export function AdminRequestsPage() {
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("appointments");
  const [rows, setRows] = useState<AnyRow[]>([]);
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error: err } = await supabase
      .from(tables[tab])
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (err) {
      toast.error(err.message);
      setRows([]);
      return;
    }
    setRows((data ?? []) as AnyRow[]);
  }, [tab, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const phone = String(r.phone ?? "").toLowerCase();
      const email = String(r.email ?? "").toLowerCase();
      const name = String(r.full_name ?? r.parent_name ?? r.contact_name ?? "").toLowerCase();
      return phone.includes(q) || email.includes(q) || name.includes(q);
    });
  }, [rows, query]);

  async function setStatus(id: string, status: string) {
    setBusyId(id);
    const { error: err } = await supabase.from(tables[tab]).update({ status } as never).eq("id", id);
    setBusyId(null);
    if (err) {
      toast.error(err.message);
      return;
    }
    toast.success(`Marked as ${status}`);
    await load();
  }

  return (
    <div className="admin-page">
      <h1>Requests</h1>
      <p className="admin-lead">Find bookings by phone or email. No user accounts — contact fields only.</p>
      <div className="admin-toolbar">
        {(["appointments", "assessments", "ambulances"] as Tab[]).map((t) => (
          <button key={t} type="button" className="admin-btn" onClick={() => setTab(t)} style={{ opacity: tab === t ? 1 : 0.6 }}>
            {t}
          </button>
        ))}
        <span className="spacer" />
        <input
          className="admin-search"
          type="search"
          placeholder="Search phone / email / name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search requests"
        />
        <button type="button" className="admin-btn" onClick={() => void load()}>
          Refresh
        </button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>When</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Details</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>{rows.length === 0 ? "No requests yet." : "No matches for this search."}</td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                  <td>{String(r.full_name ?? r.parent_name ?? r.contact_name ?? "—")}</td>
                  <td>{String(r.phone ?? "—")}</td>
                  <td>{String(r.email ?? "—")}</td>
                  <td>
                    {tab === "appointments" && (
                      <>
                        {String(r.department_slug ?? "")} / {String(r.preferred_date ?? "")}
                        <br />
                        <small>{String(r.notes ?? "")}</small>
                      </>
                    )}
                    {tab === "assessments" && (
                      <>
                        Age: {String(r.child_age ?? "")} · Shift: {String(r.preferred_shift ?? "")}
                        <br />
                        <small>{String(r.concerns ?? "")}</small>
                      </>
                    )}
                    {tab === "ambulances" && (
                      <>
                        Pickup: {String(r.pickup_location ?? "")}
                        <br />
                        <small>{String(r.notes ?? "")}</small>
                      </>
                    )}
                  </td>
                  <td>
                    <span className="badge">{r.status}</span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button type="button" disabled={busyId === r.id} onClick={() => void setStatus(r.id, "reviewed")}>
                        Reviewed
                      </button>
                      <button type="button" disabled={busyId === r.id} onClick={() => void setStatus(r.id, "closed")}>
                        Close
                      </button>
                      <button type="button" disabled={busyId === r.id} onClick={() => void setStatus(r.id, "new")}>
                        Reopen
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
