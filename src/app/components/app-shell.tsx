import { ReactNode } from "react";

interface AppShellProps {
  topBar: ReactNode;
  categoryRail: ReactNode;
  detailDrawer?: ReactNode;
}

export function AppShell({ topBar, categoryRail, detailDrawer }: AppShellProps) {
  return (
    <div
      className="relative h-screen w-screen overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #151821 0%, #050814 100%)",
      }}
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(196,182,138,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(72,87,122,0.10),transparent_30%)]" />
      <div className="relative flex h-full min-w-0 flex-col">
        {topBar}
        {categoryRail}
      </div>
      {detailDrawer}
    </div>
  );
}
