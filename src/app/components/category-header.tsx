import brushStroke from "../../assets/category-header-stroke.svg";

export type CategoryHeaderVariant = "indented" | "full";

interface CategoryHeaderProps {
  name: string;
  variant?: CategoryHeaderVariant;
}

export function CategoryHeader({ name, variant = "indented" }: CategoryHeaderProps) {
  const isFull = variant === "full";
  const headerWidth = isFull ? 240 : 174;

  return (
    <div style={{ width: headerWidth }}>
      <div className="flex flex-col" style={{ gap: 8 }}>
        <span
          className="block w-full whitespace-nowrap text-center"
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "1.25",
            color: "rgb(255,255,255)",
            textTransform: "uppercase",
            letterSpacing: "0.96px",
            textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          }}
        >
          {name}
        </span>
        <div className="relative" style={{ width: headerWidth, height: 8 }}>
          <img
            src={brushStroke}
            alt=""
            className="block h-full w-full object-fill"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
