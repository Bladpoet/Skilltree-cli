# Claude Code Agent Instructions

## Figma Console MCP
When the user mentions "Figma console mcp", always use the **WebSocket/Desktop Bridge connection** approach, not the REST API.

This means:
- Use `figma_capture_screenshot` (not `figma_take_screenshot`)
- Use `figma_execute` for plugin code
- Use `figma_get_selection` to read current selection
- Use `figma_get_file_for_plugin` for file structure
- Assume Figma Desktop with the plugin is running

Do NOT rely on FIGMA_ACCESS_TOKEN or REST API when WebSocket is available.
