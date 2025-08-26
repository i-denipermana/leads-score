import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { Lead, ICPPrefs } from "./types";
import ScoreBadge from "./components/ScoreBadge";

function parseCSVish(input: string): string[] {
  return input
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI state for filters / prefs
  const [onlyTop, setOnlyTop] = useState(true); // default show top
  const [industriesStr, setIndustriesStr] = useState("Manufacturing, Logistics");
  const [countriesStr, setCountriesStr] = useState("US, CA");
  const [revMin, setRevMin] = useState<number>(1_000_000);
  const [revMax, setRevMax] = useState<number>(50_000_000);

  const prefs: ICPPrefs = useMemo(
    () => ({
      industries: parseCSVish(industriesStr),
      countries: parseCSVish(countriesStr),
      rev_min: Number.isFinite(revMin) ? revMin : undefined,
      rev_max: Number.isFinite(revMax) ? revMax : undefined,
    }),
    [industriesStr, countriesStr, revMin, revMax]
  );

  async function fetchLeads() {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {
        sort: "score_desc",
        prefs: JSON.stringify(prefs),
      };
      if (onlyTop) {
        params.min_score = "70";
      }
      const res = await axios.get<Lead[]>("/api/leads", { params });
      setLeads(res.data || []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads(); // initial load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "24px auto", padding: "0 16px" }}>
      <h1 style={{ marginBottom: 8 }}>Leads (Scored)</h1>
      <p style={{ opacity: 0.7, marginTop: 0 }}>
        Sorted by score (desc). Toggle “Top leads only” and tweak ICP to refetch.
      </p>

      {/* Controls */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gap: 12,
        alignItems: "end",
        margin: "12px 0 16px"
      }}>
        <div>
          <label style={{ display: "block", fontSize: 12, opacity: 0.7 }}>Industries (comma-separated)</label>
          <input value={industriesStr} onChange={(e) => setIndustriesStr(e.target.value)}
                 placeholder="Manufacturing, Logistics"
                 style={{ width: "100%", padding: 8 }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, opacity: 0.7 }}>Countries (comma-separated)</label>
          <input value={countriesStr} onChange={(e) => setCountriesStr(e.target.value)}
                 placeholder="US, CA"
                 style={{ width: "100%", padding: 8 }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, opacity: 0.7 }}>Revenue min (USD)</label>
          <input type="number" value={revMin} onChange={(e) => setRevMin(parseInt(e.target.value || "0", 10))}
                 style={{ width: "100%", padding: 8 }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, opacity: 0.7 }}>Revenue max (USD)</label>
          <input type="number" value={revMax} onChange={(e) => setRevMax(parseInt(e.target.value || "0", 10))}
                 style={{ width: "100%", padding: 8 }} />
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <label>
          <input type="checkbox" checked={onlyTop} onChange={(e) => setOnlyTop(e.target.checked)} />
          {" "}Top leads only (≥ 70)
        </label>
        <button onClick={fetchLeads} disabled={loading} style={{ padding: "6px 10px" }}>
          {loading ? "Loading..." : "Refetch"}
        </button>
        {error && <span style={{ color: "crimson" }}>Error: {error}</span>}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th align="left">Company</th>
              <th align="left">Industry</th>
              <th align="left">Geo</th>
              <th align="left">Contacts</th>
              <th align="left">Score</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(ld => (
              <tr key={ld.id} style={{ borderBottom: "1px solid #eee" }}>
                <td>{ld.name}</td>
                <td>{ld.industry || "-"}</td>
                <td>{[ld.state, ld.country].filter(Boolean).join(", ") || "-"}</td>
                <td>{[ld.email && "Email", ld.phone && "Phone", ld.linkedin && "LinkedIn"].filter(Boolean).join(" · ") || "-"}</td>
                <td><ScoreBadge score={ld.score} /></td>
              </tr>
            ))}
            {(!loading && leads.length === 0) && (
              <tr><td colSpan={5} style={{ opacity: 0.7, padding: 16 }}>No leads match the criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
