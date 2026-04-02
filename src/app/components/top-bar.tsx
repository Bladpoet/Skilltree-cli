import { StatBadge } from "./stat-badge";

interface TopBarProps {
  stats: {
    skills: number;
    categories: number;
    overlapping: number;
  };
}

const STAT_LABELS: { key: keyof TopBarProps["stats"]; label: string }[] = [
  { key: "skills", label: "Skills" },
  { key: "categories", label: "Categories" },
  { key: "overlapping", label: "Overlapping" },
];

export function TopBar({ stats }: TopBarProps) {
  return (
    <div className="flex shrink-0 items-start justify-between px-12 pt-10 pb-6">
      <h1
        className="whitespace-nowrap"
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 600,
          fontSize: "40px",
          lineHeight: "normal",
          letterSpacing: "-1.2px",
          textTransform: "uppercase",
          color: "#d4992c",
        }}
      >
        Claude Skills
      </h1>
      <div className="flex items-start gap-[22.206px]">
        {STAT_LABELS.map(({ key, label }) => (
          <StatBadge key={key} value={stats[key]} label={label} />
        ))}
      </div>
    </div>
  );
}
