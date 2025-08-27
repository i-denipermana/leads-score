// src/components/ScoreBadge.tsx
import { Flame, Sun, Snowflake } from "lucide-react";

type Props = { score?: number };

export default function ScoreBadge({ score = 0 }: Props) {
  let label = "Cold";
  let classes = "bg-gray-200 text-gray-700";
  let icon = <Snowflake size={14} />;

  if (score >= 70) {
    label = "Hot";
    classes = "bg-green-100 text-green-700";
    icon = <Flame size={14} />;
  } else if (score >= 40) {
    label = "Warm";
    classes = "bg-amber-100 text-amber-700";
    icon = <Sun size={14} />;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${classes}`}
      title={`Score: ${score}`}
    >
      {icon} {label} · {score}
    </span>
  );
}
