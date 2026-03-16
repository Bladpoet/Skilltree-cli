import { StatBadge } from "./stat-badge";

interface TopBarProps {
  stats: {
    categories: number;
    conflicting: number;
    similar: number;
  };
}

const STAT_LABELS: { key: keyof TopBarProps["stats"]; label: string }[] = [
  { key: "categories", label: "Categories" },
  { key: "conflicting", label: "Conflicting" },
  { key: "similar", label: "Similar" },
];

export function TopBar({ stats }: TopBarProps) {
  return (
    <div className="flex shrink-0 items-start justify-between px-12 pt-10 pb-6">
      <h1
        className="whitespace-nowrap text-[#b79962]"
        style={{
          fontFamily: "'Marcellus', serif",
          fontSize: "40px",
          lineHeight: "50px",
        }}
      >
        Claude Skills
      </h1>
      <div className="flex items-start gap-[18px]">
        {STAT_LABELS.map(({ key, label }) => (
          <StatBadge key={key} value={stats[key]} label={label} />
        ))}
      </div>
    </div>
  );
}
