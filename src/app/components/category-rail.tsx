import { type ReactNode, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface CategoryRailProps {
  children?: ReactNode;
}

export function CategoryRail({ children }: CategoryRailProps) {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  return (
    <div className="relative flex-1">
      <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-[#837e76] to-transparent" />

      <div
        className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#0c1018] to-transparent transition-opacity duration-200 ${canScrollLeft ? "opacity-100" : "opacity-0"}`}
      />
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#0c1018] to-transparent transition-opacity duration-200 ${canScrollRight ? "opacity-100" : "opacity-0"}`}
      />

      <button
        type="button"
        onClick={() => scrollByAmount("left")}
        disabled={!canScrollLeft}
        className={`absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#3a404b] bg-[#11151d]/90 text-[#d4d8df] backdrop-blur transition-all duration-200 ${canScrollLeft ? "opacity-100 hover:border-[#6b654f] hover:text-white" : "pointer-events-none opacity-0"}`}
        aria-label="Scroll categories left"
      >
        <ChevronLeft size={18} strokeWidth={2.2} />
      </button>

      <button
        type="button"
        onClick={() => scrollByAmount("right")}
        disabled={!canScrollRight}
        className={`absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#3a404b] bg-[#11151d]/90 text-[#d4d8df] backdrop-blur transition-all duration-200 ${canScrollRight ? "opacity-100 hover:border-[#6b654f] hover:text-white" : "pointer-events-none opacity-0"}`}
        aria-label="Scroll categories right"
      >
        <ChevronRight size={18} strokeWidth={2.2} />
      </button>

      <div
        ref={railRef}
        className="h-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex h-full min-w-full w-max items-start gap-[95px] px-12 pt-8 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
}
