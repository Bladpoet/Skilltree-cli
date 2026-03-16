import { FigmaCategoryTab } from "./figma-category-tab";

interface CategoryHeaderProps {
  name: string;
}

export function CategoryHeader({ name }: CategoryHeaderProps) {
  return <FigmaCategoryTab name={name} />;
}
