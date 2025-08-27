import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import type { Lead } from "../../types";

const COLORS = ["#6366f1","#22c55e","#f59e0b","#ef4444","#3b82f6"];

export default function GeoChart({ leads }: { leads: Lead[] }) {
  const agg: Record<string, number> = {};
  leads.forEach(l => {
    if (!l.country || (l.score||0) < 70) return;
    agg[l.country] = (agg[l.country]||0)+1;
  });
  const data = Object.entries(agg).map(([country, count])=>({country,count}));
  return (
    <div id="chart" className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-6">
      <h2 className="text-lg font-semibold mb-4">Hot Leads by Country</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="country" outerRadius={100} label>
            {data.map((entry, index) => (
              <Cell key={entry.country} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
