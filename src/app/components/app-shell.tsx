import { ReactNode } from "react";
import imgClaudeSkillTreeBg from "../../assets/claude-skill-tree-bg.png";

interface AppShellProps {
  topBar: ReactNode;
  categoryRail: ReactNode;
  detailDrawer?: ReactNode;
}

export function AppShell({ topBar, categoryRail, detailDrawer }: AppShellProps) {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0500] to-[#0e0900]" />
        <img src={imgClaudeSkillTreeBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="relative flex h-full min-w-0 flex-col">
        {topBar}
        {categoryRail}
      </div>
      {detailDrawer}
    </div>
  );
}
