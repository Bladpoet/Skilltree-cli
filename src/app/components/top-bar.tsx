import { StatBadgeGroup } from "./stat-badge";

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
    <div className="flex shrink-0 items-center justify-between px-12 pt-10 pb-6">
      <h1
        className="whitespace-nowrap"
        style={{
          fontFamily: "'Albertus Nova', serif",
          fontWeight: 700,
          fontSize: "28px",
          lineHeight: "normal",
          letterSpacing: "-0.5px",
          textTransform: "uppercase",
          background: "linear-gradient(180deg, #D49A2C 0%, #B67600 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25))",
          textShadow: "inset 0px 1px 2px rgba(255, 255, 255, 0.3)",
        }}
      >
        Skill Tree
      </h1>
      <StatBadgeGroup
        items={STAT_LABELS.map(({ key, label }) => ({
          key,
          value: stats[key],
          label,
        }))}
      />
    </div>
  );
}
