/**
 * Skill-to-icon mapping for hex nodes.
 * Keys are skill name slugs (from mock-skills.json `name` field).
 * Values are lucide-react icon component names.
 *
 * Icon source priority (per Technical PRD):
 * 1. Custom uploaded icon asset (not yet supported)
 * 2. Mapped icon from this file
 * 3. Default fallback icon (Hexagon)
 */

export const skillIconMap: Record<string, string> = {
  // Design
  "implement-design": "Figma",
  "ui-polish": "Paintbrush",
  "design-system-ops": "Palette",
  // Finance
  "expense-analyst": "Receipt",
  "pricing-model": "DollarSign",
  "forecast-helper": "TrendingUp",
  // Development
  "react-ui-builder": "PanelsTopLeft",
  "api-logs": "ScrollText",
  "debug-assistant": "Bug",
  "supabase-helper": "DatabaseZap",
  "ci-setup": "Workflow",
  "postgres-checker": "Database",
  // Marketing
  "content-engine": "PenLine",
  "brand-voice": "MessagesSquare",
  // General fallback aliases
  "supabase-postgres-best-practices": "Database",
  "frontend-skill": "Code",
};

/** The fallback icon used when no mapping is found */
export const FALLBACK_ICON = "Hexagon";
