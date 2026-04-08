import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/app-shell";
import { TopBar } from "./components/top-bar";
import { CategoryRail } from "./components/category-rail";
import { DetailDrawer } from "./components/detail-drawer";
import { CategoryCluster } from "./components/category-cluster";
import { SkillDetailPanel } from "./components/skill-detail-panel";
import { SplashScreen } from "./components/splash-screen";
import { useSkillData } from "./lib/skill-data";
import { getRelatedConflicts, getSelectedSkill, groupSkillsByCategory } from "./lib/skill-tree";

// Phase 'content'  — splash bg + content visible, app hidden
// Phase 'fading'   — splash content faded, splash bg still present, app fading in underneath
// Phase 'done'     — splash fully unmounted, app fully visible
type SplashPhase = "content" | "fading" | "done";

export default function App() {
  const [splashPhase, setSplashPhase] = useState<SplashPhase>("content");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: skillData, schemaDifferences } = useSkillData();

  const { skills: skillsCount, categories, conflicting: overlapping } = skillData.meta.counts;
  const groupedCategories = useMemo(() => groupSkillsByCategory(skillData), [skillData]);
  const selectedSkill = getSelectedSkill(skillData, selectedId);
  const relatedConflicts = getRelatedConflicts(skillData, selectedId);

  useEffect(() => {
    // t=2700ms: content fades out, app starts fading in simultaneously
    const t1 = setTimeout(() => setSplashPhase("fading"), 2700);
    // t=3500ms: splash background unmounts (app is fully visible by now)
    const t2 = setTimeout(() => setSplashPhase("done"), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (selectedId && !selectedSkill) {
      setSelectedId(null);
      setDrawerOpen(false);
    }
  }, [selectedId, selectedSkill]);

  useEffect(() => {
    if (schemaDifferences.length > 0) {
      console.warn("Skill data normalization notes:", schemaDifferences);
    }
  }, [schemaDifferences]);

  return (
    <>
      {splashPhase !== "done" && (
        <SplashScreen contentVisible={splashPhase === "content"} />
      )}

      {/* App fades in while the splash background is still covering it — backgrounds are identical so it's seamless */}
      <div style={{
        opacity: splashPhase === "content" ? 0 : 1,
        transition: splashPhase !== "content" ? "opacity 0.5s ease" : "none",
        pointerEvents: splashPhase === "content" ? "none" : "all",
      }}>
        <AppShell
          topBar={<TopBar stats={{ skills: skillsCount, categories, overlapping }} />}
          categoryRail={
            <CategoryRail>
              {groupedCategories.map((group) => (
                <CategoryCluster
                  key={group.category}
                  categoryName={group.category}
                  skills={group.skills}
                  selectedId={selectedId}
                  onSelectSkill={(skillId) => {
                    setSelectedId(skillId);
                    setDrawerOpen(true);
                  }}
                />
              ))}
            </CategoryRail>
          }
          detailDrawer={
            drawerOpen && selectedSkill ? (
              <DetailDrawer
                categoryLabel={selectedSkill.category}
                resetKey={selectedSkill.id}
                onClose={() => {
                  setDrawerOpen(false);
                  setSelectedId(null);
                }}
              >
                <SkillDetailPanel
                  skill={selectedSkill}
                  relatedConflicts={relatedConflicts}
                  onSelectConflict={(skillId) => {
                    setSelectedId(skillId);
                    setDrawerOpen(true);
                  }}
                />
              </DetailDrawer>
            ) : undefined
          }
        />
      </div>
    </>
  );
}
