import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { Lead } from "../../types";


export default function IndustryChart({ leads }: { leads: Lead[] }) {
  // Aggregate avg score per industry
  const agg: Record<string, { sum: number; count: number }> = {};
  leads.forEach((l) => {
    if (!l.industry) return;
    if (!agg[l.industry]) agg[l.industry] = { sum: 0, count: 0 };
    agg[l.industry].sum += l.score ?? 0;
    agg[l.industry].count += 1;
  });
  const data = Object.entries(agg)
    .map(([industry, { sum, count }]) => ({ industry, score: Math.round(sum / count) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-6">
      <h2 className="text-lg font-semibold mb-4">Top 5 Industries by Score</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="industry" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
