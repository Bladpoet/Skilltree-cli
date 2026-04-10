import labelStrip from "../../assets/stat-badge-label-strip.svg";
import ring from "../../assets/stat-badge-ring.svg";

interface StatBadgeProps {
  value: number;
  label: string;
}

interface StatBadgeGroupItem {
  key: string;
  value: number;
  label: string;
}

interface StatBadgeGroupProps {
  items: StatBadgeGroupItem[];
}

const STAT_BADGE_SCALE = 1;
const BADGE_WIDTH = 77.72;
const BADGE_HEIGHT = 87.467;
const BADGE_RING_SIZE = 77.72;
const BADGE_LABEL_HEIGHT = 19;
const BADGE_GAP = 22.206;

export function StatBadge({ value, label }: StatBadgeProps) {
  const scaledWidth = BADGE_WIDTH * STAT_BADGE_SCALE;
  const scaledHeight = BADGE_HEIGHT * STAT_BADGE_SCALE;
  const scaledRingSize = BADGE_RING_SIZE * STAT_BADGE_SCALE;
  const scaledLabelHeight = BADGE_LABEL_HEIGHT * STAT_BADGE_SCALE;

  return (
    <div className="relative shrink-0" style={{ width: scaledWidth, height: scaledHeight }}>
      <img
        src={ring}
        alt=""
        className="absolute left-0 top-0"
        style={{ width: scaledRingSize, height: scaledRingSize }}
        draggable={false}
      />
      <div
        className="absolute left-0 top-0 flex items-center justify-center"
        style={{ width: scaledRingSize, height: scaledRingSize }}
      >
        <span
          className="text-center text-white"
          style={{ fontFamily: "'Albertus Nova', serif", fontSize: "32px", fontWeight: 700, lineHeight: 1 }}
        >
          {value}
        </span>
      </div>
      <div className="absolute bottom-0 left-0" style={{ width: scaledWidth, height: scaledLabelHeight }}>
        <img src={labelStrip} alt="" className="absolute inset-0 h-full w-full object-fill" draggable={false} />
        <p
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap text-center"
          style={{
            fontFamily: "'Albertus Nova', serif",
            fontSize: "13px",
            fontWeight: 700,
            lineHeight: "1.5",
            color: "#ffefbe",
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

export function StatBadgeGroup({ items }: StatBadgeGroupProps) {
  return (
    <div className="flex items-start" style={{ gap: BADGE_GAP * STAT_BADGE_SCALE }}>
      {items.map((item) => (
        <StatBadge key={item.key} value={item.value} label={item.label} />
      ))}
    </div>
  );
}
