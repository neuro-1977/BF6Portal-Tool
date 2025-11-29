# Session Knowledgebase Database

This folder contains persistent session summaries, chat notes, and project history for the BF6Portal Tool workspace. Each file is a snapshot of key progress, decisions, and context, including information from chat, Copilot memory, and git history.

## Structure
- `session-YYYY-MM-DD.md`: Daily session summaries and chat notes
- `project-history.md`: Chronological summary of major git commits and project milestones
- `important-decisions.md`: Key architectural or UX decisions

---

## session-2025-11-29.md
See `/memories/session-2025-11-29.md` for today’s session summary.

## project-history.md
- Initial Release: BF6Portal Tool
- Major Visual Overhaul: Portal Style Colors, Flush Blocks, Subroutine Navigation
- Content Update: Added Missing Logic, Math, and Player Blocks
- Refactor: Extract Sidebar Logic, TopBarManager, Zoom Controls
- Pivot to Web/Blockly interface: Added web_ui, migration tools, updated docs
- v1.0.6-beta: All docs and UI mockups updated to match new web UI, load order, minimal design
- v1.0.6-beta: Add new web UI assets, blockly/ directory, favicon, error/status box
- Fix: Populate Blockly toolbox with categories
- Fix: Correct Python application launch and restore old Tkinter editor

## important-decisions.md
- Web UI and blockly are now the primary interface; legacy Tkinter is legacy only
- All controls must be vertically stacked and centered
- Splash/boot and blockly desktop logic/styles must remain separate
- Ticker must cycle quirky comments on splash
- Error/status reporting must be robust and visible

---

Add new session summaries and decisions as needed.
