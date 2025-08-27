import { useEffect, useState } from "react";
import axios from "axios";
import ScoreBadge from "./components/ScoreBadge";
import Stepper from "./components/Stepper";
import IndustryChart from "./components/IndustryChart";
import GeoChart from "./components/GeoChart";
import type { Lead, ICPPrefs } from "./types/scoring";

function parseCSVish(input: string): string[] {
  return input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI state for filters / prefs
  const [onlyTop, setOnlyTop] = useState(true);
  const [industriesStr, setIndustriesStr] = useState("Manufacturing, Logistics");
  const [countriesStr, setCountriesStr] = useState("US, CA");
  const [revMin, setRevMin] = useState<number>(1_000_000);
  const [revMax, setRevMax] = useState<number>(50_000_000);

  const prefs: ICPPrefs = {
    industries: parseCSVish(industriesStr),
    countries: parseCSVish(countriesStr),
    rev_min: revMin,
    rev_max: revMax,
  };

  async function fetchLeads() {
    setLoading(true);
    setError(null);
    try {
      const API_BASE = import.meta.env.VITE_BACKEND_URL || "";
      const params: Record<string, any> = {
        sort: "score_desc",
        prefs: JSON.stringify(prefs),
      };
      if (onlyTop) params.min_score = 70;

      const res = await axios.get<Lead[]>(`${API_BASE}/api/leads`, { params });
      setLeads(res.data || []);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const avgScore = leads.length
    ? Math.round(leads.reduce((s, l) => s + (l.score || 0), 0) / leads.length)
    : 0;
  const hotPct = leads.length
    ? Math.round(
        (leads.filter((l) => (l.score || 0) >= 70).length / leads.length) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Navbar */}
      <div className="bg-white dark:bg-gray-800 shadow px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
          Caprae Leads
        </span>
        <div className="flex gap-4 items-center">
          <a
            href="#charts"
            className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
          >
            Stats
          </a>
          {/* <DarkModeToggle /> */}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Sort and filter leads based on Intelligent Scoring
        </p>

        {/* Stepper */}
        <Stepper active={2} />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Leads</p>
            <p className="text-2xl font-bold">{leads.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Score</p>
            <p className="text-2xl font-bold">{avgScore}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500 dark:text-gray-400">% Hot Leads</p>
            <p className="text-2xl font-bold">{hotPct}%</p>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Industries
            </label>
            <input
              value={industriesStr}
              onChange={(e) => setIndustriesStr(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Countries
            </label>
            <input
              value={countriesStr}
              onChange={(e) => setCountriesStr(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Revenue Min
            </label>
            <input
              type="number"
              value={revMin}
              onChange={(e) => setRevMin(parseInt(e.target.value))}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Revenue Max
            </label>
            <input
              type="number"
              value={revMax}
              onChange={(e) => setRevMax(parseInt(e.target.value))}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 dark:bg-gray-800 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={onlyTop}
              onChange={(e) => setOnlyTop(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Top leads only (≥70)
          </label>
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin inline-block">⏳</span>
            ) : (
              "Refetch"
            )}
          </button>
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>

        {/* Leads Table */}
        <div className="overflow-x-auto rounded-lg shadow bg-white dark:bg-gray-800 transition-opacity">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {["Company", "Industry", "Geo", "Contacts", "Score"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {leads.map((ld) => (
                <tr key={ld.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2">{ld.name}</td>
                  <td className="px-4 py-2">{ld.industry || "-"}</td>
                  <td className="px-4 py-2">
                    {[ld.state, ld.country].filter(Boolean).join(", ") || "-"}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-300">
                    {[ld.email && "Email", ld.phone && "Phone", ld.linkedin && "LinkedIn"]
                      .filter(Boolean)
                      .join(" · ") || "-"}
                  </td>
                  <td className="px-4 py-2">
                    <ScoreBadge score={ld.score} />
                  </td>
                </tr>
              ))}
              {!loading && leads.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No leads match the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Charts */}
        <div id="charts">
          <IndustryChart leads={leads} />
          <GeoChart leads={leads} />
        </div>
      </div>
    </div>
  );
}
