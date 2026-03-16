import { ReactNode, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface DetailDrawerProps {
  children?: ReactNode;
  onClose?: () => void;
  categoryLabel?: string;
  resetKey?: string;
}

export function DetailDrawer({ children, onClose, categoryLabel, resetKey }: DetailDrawerProps) {
  const scrollRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [categoryLabel, resetKey]);

  return (
    <div className="absolute inset-0 z-20">
      <div className="absolute inset-0 bg-[#191a1c]/40" />
      <aside
        ref={scrollRef}
        className="absolute right-0 top-0 h-full w-[443px] overflow-y-auto"
        style={{ backgroundColor: "#191A1C" }}
      >
        <div className="relative h-full px-8 pt-6 pb-10">
          <div className="absolute left-0 top-0 h-full w-px bg-[#191A1C]" />
          <div className="flex items-center justify-between pb-3">
            <div className="flex h-[24px] min-w-[69px] items-center justify-center rounded-sm border border-[#5f946a] bg-[linear-gradient(180deg,#1d3823_0%,#5f9469_100%)] px-4 opacity-90">
              <span
                className="text-[12px] text-white"
                style={{ fontFamily: "'Marcellus', serif", lineHeight: "8px" }}
              >
                {categoryLabel ?? "Skill"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center text-[#c7c7c7] transition-colors hover:text-white"
              aria-label="Close drawer"
            >
              <X size={14} />
            </button>
          </div>
          <div className="mt-3 border-t border-[#837e76] pt-10">{children}</div>
        </div>
      </aside>
    </div>
  );
}
