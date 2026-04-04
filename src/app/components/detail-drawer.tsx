import { ReactNode, useEffect, useRef } from "react";
import {
  DetailDrawerCategoryPill,
  DetailDrawerCloseButton,
  DetailDrawerDecorativeEdge,
} from "./detail-drawer-primitives";
import { useSoundEffects } from "../hooks/use-sound-effects";

interface DetailDrawerProps {
  children?: ReactNode;
  onClose?: () => void;
  categoryLabel?: string;
  resetKey?: string;
}

const DRAWER_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DRAWER_OVERLAY_ANIMATION = `drawer-overlay-enter 260ms ${DRAWER_EASE} both`;
const DRAWER_PANEL_ANIMATION = `drawer-panel-enter 320ms ${DRAWER_EASE} both`;

export function DetailDrawer({ children, onClose, categoryLabel, resetKey }: DetailDrawerProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { playDrawerOpen, playDrawerClose } = useSoundEffects();

  // Play sound when drawer opens
  useEffect(() => {
    playDrawerOpen();
  }, [playDrawerOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [categoryLabel, resetKey]);

  return (
    <div className="absolute inset-0 z-20">
      <style>{`
        @keyframes drawer-overlay-enter {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes drawer-panel-enter {
          from {
            opacity: 0;
            transform: translateX(24px) scale(0.99);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      `}</style>
      <button
        type="button"
        aria-label="Close drawer overlay"
        className="absolute inset-0 bg-[#191a1c]/40"
        style={{ animation: DRAWER_OVERLAY_ANIMATION }}
        onClick={() => { playDrawerClose(); onClose?.(); }}
      />
      <div className="absolute inset-y-0 right-0 flex justify-end overflow-visible">
        <div
          className="relative h-full overflow-visible"
          style={{ width: "min(100vw, 403px)", animation: DRAWER_PANEL_ANIMATION }}
        >
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
                    onClick={() => { playDrawerClose(); onClose?.(); }}
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
    </div>
  );
}
