import { ReactNode, useEffect, useRef } from "react";
import {
  DetailDrawerCategoryPill,
  DetailDrawerCloseIcon,
  DetailDrawerDecorativeEdge,
} from "./detail-drawer-primitives";

interface DetailDrawerProps {
  children?: ReactNode;
  onClose?: () => void;
  categoryLabel?: string;
  resetKey?: string;
}

export function DetailDrawer({ children, onClose, categoryLabel, resetKey }: DetailDrawerProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [categoryLabel, resetKey]);

  return (
    <div className="absolute inset-0 z-20">
      <div className="absolute inset-0 bg-[#191a1c]/40" />
      <div className="absolute inset-y-0 right-0 flex justify-end overflow-visible">
        <div
          className="relative h-full overflow-visible"
          style={{
            width: "min(100vw, 374px)",
          }}
        >
          <DetailDrawerDecorativeEdge />
          <aside
            ref={scrollRef}
            className="relative z-[1] h-full overflow-x-visible overflow-y-auto rounded-l-[8px]"
            style={{
              backgroundColor: "#191A1C",
            }}
          >
            <div className="relative z-[1] flex min-h-full flex-col px-8 pb-7 pt-6">
              <div className="flex items-start justify-between gap-6">
                <DetailDrawerCategoryPill label={categoryLabel ?? "Skill"} />
                <button
                  onClick={onClose}
                  className="flex h-6 w-6 shrink-0 items-center justify-center opacity-90 transition-opacity hover:opacity-100"
                  aria-label="Close drawer"
                >
                  <DetailDrawerCloseIcon />
                </button>
              </div>
              <div className="mt-6">{children}</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
