import { OrnateFrame } from "./ornate-frame";

interface StatBadgeProps {
  value: number;
  label: string;
}

export function StatBadge({ value, label }: StatBadgeProps) {
  return (
    <div className="flex shrink-0 flex-col items-center" style={{ width: "77.72px" }}>
      <div className="mb-[-7px]">
        <OrnateFrame size={77.72}>
          <span
            className="text-center text-white"
            style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "39.166px", fontWeight: 600, lineHeight: 1 }}
          >
            {value}
          </span>
        </OrnateFrame>
      </div>
      <div
        className="flex h-4 w-full items-center justify-center px-1"
        style={{
          background:
            "linear-gradient(90deg, rgba(53,54,56,0) 0%, rgba(20,12,5,1) 50.5%, rgba(53,54,56,0) 100%)",
        }}
      >
        <p
          className="whitespace-nowrap text-center"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "12.953px",
            fontWeight: 600,
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
