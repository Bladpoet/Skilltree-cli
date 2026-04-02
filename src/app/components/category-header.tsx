import brushStroke from "../../assets/category-header-stroke.png";

export type CategoryHeaderVariant = "indented" | "full";

interface CategoryHeaderProps {
  name: string;
  variant?: CategoryHeaderVariant;
}

export function CategoryHeader({ name, variant = "indented" }: CategoryHeaderProps) {
  const isFull = variant === "full";

  return (
    <div style={{ width: isFull ? 240 : 174 }}>
      <div className="flex flex-col" style={{ gap: 8 }}>
        <span
          className="whitespace-nowrap"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "1.25",
            color: "rgb(255,255,255)",
            textTransform: "uppercase",
            letterSpacing: "0.96px",
            textAlign: "center",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          {name}
        </span>
        {/* Brush-stroke underline image */}
        <div className="relative w-full" style={{ height: 4 }}>
          <img
            src={brushStroke}
            alt=""
            className="absolute block w-full"
            style={{ height: "auto", top: 0, left: 0 }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
