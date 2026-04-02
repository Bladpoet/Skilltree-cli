import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/app-shell";
import { TopBar } from "./components/top-bar";
import { CategoryRail } from "./components/category-rail";
import { DetailDrawer } from "./components/detail-drawer";
import { CategoryCluster } from "./components/category-cluster";
import { SkillDetailPanel } from "./components/skill-detail-panel";
import { useSkillData } from "./lib/skill-data";
import { getRelatedConflicts, getSelectedSkill, groupSkillsByCategory } from "./lib/skill-tree";

export default function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: skillData, schemaDifferences } = useSkillData();

  const { skills: skillsCount, categories, conflicting: overlapping } = skillData.meta.counts;
  const groupedCategories = useMemo(() => groupSkillsByCategory(skillData), [skillData]);
  const selectedSkill = getSelectedSkill(skillData, selectedId);
  const relatedConflicts = getRelatedConflicts(skillData, selectedId);

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
  );
}
