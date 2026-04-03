import { ReactNode, useEffect, useRef } from "react";
import {
  DetailDrawerCategoryPill,
  DetailDrawerCloseButton,
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
      <button
        type="button"
        aria-label="Close drawer overlay"
        className="absolute inset-0 bg-[#191a1c]/40"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 flex justify-end overflow-visible">
        <div
          className="relative h-full overflow-visible"
          style={{ width: "min(100vw, 403px)" }}
        >
          <DetailDrawerDecorativeEdge />
          <aside
            ref={scrollRef}
            className="relative z-[1] h-full overflow-x-visible overflow-y-auto rounded-l-[8px]"
            style={{ backgroundColor: "rgb(255,247,227)" }}
          >
            <div className="relative z-[1] flex min-h-full flex-col p-6">
              {/* Header row: tab pill LEFT, close button RIGHT */}
              <div className="flex items-center justify-between gap-4">
                <DetailDrawerCategoryPill label={categoryLabel ?? "Skill"} />
                <button
                  onClick={onClose}
                  className="flex shrink-0 items-center justify-center opacity-80 transition-opacity hover:opacity-100"
                  aria-label="Close drawer"
                  style={{ width: 32, height: 32 }}
                >
                  <DetailDrawerCloseButton />
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
