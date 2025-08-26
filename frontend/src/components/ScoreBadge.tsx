type Props = { score: number | undefined };

export default function ScoreBadge({ score }: Props) {
  const s = score ?? 0;
  const label = s >= 70 ? "Hot" : s >= 40 ? "Warm" : "Cold";
  const style: React.CSSProperties =
    s >= 70
      ? { background: "#e6f4ea", color: "#137333" }
      : s >= 40
      ? { background: "#fff8e1", color: "#8a6d1a" }
      : { background: "#eceff1", color: "#37474f" };

  return (
    <span
      style={{
        ...style,
        borderRadius: 999,
        padding: "2px 8px",
        fontSize: 12,
        whiteSpace: "nowrap",
      }}
      title="Score blends size/revenue fit, ICP match, contact completeness, and growth."
    >
      {label} · {s}
    </span>
  );
}
