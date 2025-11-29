

# TODO (Live, always reference PROMPT.md)

---
## Workflow
- PROMPT.md is the master source of truth. Always check it first.
- All session memory and action logs are referenced in PROMPT.md and session_db.
- Update all documentation and references with each new addition or change.

---
## Current Tasks
- [x] Serve minimal blockly-only UI for / (no web_ui)
- [x] Patch server to serve /vendor/blockly/* from project root
- [x] Remove os.chdir(WEB_DIR) for correct static file resolution
- [x] Verify blockly.min.js loads (no errors)
- [x] Document and log all steps
- [x] Save working state (standalone blockly)
- [x] Update all documentation and version to 1.0.6-beta
- [x] Restore web_ui menus and controls (robust overlay, fixed sidebar, top menu always on top)

---
## Next Steps
- [ ] Review and update all documentation (README, PROMPT, etc.)
- [ ] Rescan all files/folders and update comments for maintainability
- [ ] Refactor/clean up web_ui and blockly integration as needed
- [ ] Document all changes and update master lists/action log

---
## Reference
- PROMPT.md is the master reference for all architecture, workflow, and UI/UX
- All menus and overlays must use fixed/absolute positioning and high z-index to guarantee visibility above Blockly/canvas.

---
## Version
- 1.0.6-beta (2025-11-29)
