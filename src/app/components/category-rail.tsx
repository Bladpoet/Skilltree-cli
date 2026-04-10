import { type ReactNode, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import railDividerBrush from "../../assets/category-rail-divider-brush.svg";
import { useSoundEffects } from "../hooks/use-sound-effects";

interface CategoryRailProps {
  children?: ReactNode;
}

const RAIL_FADE_WIDTH_PX = 400;

function getRailMask(canScrollLeft: boolean, canScrollRight: boolean): string | undefined {
  if (canScrollLeft && canScrollRight) {
    return `linear-gradient(to right, transparent 0px, black ${RAIL_FADE_WIDTH_PX}px, black calc(100% - ${RAIL_FADE_WIDTH_PX}px), transparent 100%)`;
  }

  if (canScrollLeft) {
    return `linear-gradient(to right, transparent 0px, black ${RAIL_FADE_WIDTH_PX}px, black 100%)`;
  }

  if (canScrollRight) {
    return `linear-gradient(to right, black 0px, black calc(100% - ${RAIL_FADE_WIDTH_PX}px), transparent 100%)`;
  }

  return undefined;
}

export function CategoryRail({ children }: CategoryRailProps) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { playScroll } = useSoundEffects();

  useEffect(() => {
    const node = railRef.current;
    if (!node) {
      return;
    }

    const updateScrollState = () => {
      const maxScrollLeft = node.scrollWidth - node.clientWidth;
      setCanScrollLeft(node.scrollLeft > 8);
      setCanScrollRight(node.scrollLeft < maxScrollLeft - 8);
    };

    updateScrollState();
    node.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

    return () => {
      node.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [children]);

  const scrollByAmount = (direction: "left" | "right") => {
    const node = railRef.current;
    if (!node) {
      return;
    }

    const amount = Math.max(360, Math.floor(node.clientWidth * 0.65));
    node.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const railMask = getRailMask(canScrollLeft, canScrollRight);

  return (
    <div className="relative flex-1">
      <div className="pointer-events-none absolute top-0 left-12 right-12 h-[6px] overflow-hidden">
        <img src={railDividerBrush} alt="" className="block h-full w-full object-fill opacity-60" draggable={false} />
      </div>

      <button
        type="button"
        onClick={() => { playScroll(); scrollByAmount("left"); }}
        disabled={!canScrollLeft}
        className={`absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#4c3b20] bg-[#120b04]/88 text-[#efe0bc] backdrop-blur transition-all duration-200 ${canScrollLeft ? "opacity-100 hover:border-[#d4a24f] hover:text-white" : "pointer-events-none opacity-0"}`}
        aria-label="Scroll categories left"
      >
        <ChevronLeft size={18} strokeWidth={2.2} />
      </button>

      <button
        type="button"
        onClick={() => { playScroll(); scrollByAmount("right"); }}
        disabled={!canScrollRight}
        className={`absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#4c3b20] bg-[#120b04]/88 text-[#efe0bc] backdrop-blur transition-all duration-200 ${canScrollRight ? "opacity-100 hover:border-[#d4a24f] hover:text-white" : "pointer-events-none opacity-0"}`}
        aria-label="Scroll categories right"
      >
        <ChevronRight size={18} strokeWidth={2.2} />
      </button>

      <div
        ref={railRef}
        className="h-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={
          railMask
            ? {
                WebkitMaskImage: railMask,
                maskImage: railMask,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
              }
            : undefined
        }
      >
        <div className="flex h-full min-w-full w-max items-start gap-[95px] px-12 pt-16 pb-16">
          {children}
        </div>
      </div>
    </div>
  );
}
