import { OrnateFrame } from "./ornate-frame";

interface StatBadgeProps {
  value: number;
  label: string;
}

export function StatBadge({ value, label }: StatBadgeProps) {
  return (
    <div className="flex shrink-0 flex-col items-center" style={{ width: "63.663px" }}>
      <div className="mb-[-7px]">
        <OrnateFrame size={64}>
          <span
            className="text-center text-white"
            style={{ fontFamily: "'Cinzel', serif", fontSize: "31px", lineHeight: 1 }}
          >
            {value}
          </span>
        </OrnateFrame>
      </div>
      <div
        className="flex h-4 w-full items-center justify-center px-1"
        style={{
          background:
            "linear-gradient(90deg, rgba(53,54,56,0) 0%, rgba(94,95,98,1) 50.5%, rgba(53,54,56,0) 100%)",
        }}
      >
        <p
          className="whitespace-nowrap text-center text-white"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            lineHeight: "16px",
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
