# TODO (Live)

---

## Workflow

- GEMINI.md is the master source of truth. Always check it first.
- Update all documentation and references with each new addition or change.

---

## Current Tasks (Completed)

- [x] Serve minimal blockly-only UI for / (no web_ui)
- [x] Patch server to serve /vendor/blockly/* from project root
- [x] Remove os.chdir(WEB_DIR) for correct static file resolution
- [x] Verify blockly.min.js loads (no errors)
- [x] Document and log all steps
- [x] Save working state (standalone blockly)
- [x] Update all documentation and version to 1.0.6-beta
- [x] Restore web_ui menus and controls (robust overlay, fixed sidebar, top menu always on top)
- [x] Implement placeholder boot screen and add documentation.
- [x] Adjust tools/generate_blockly_defs.py for "RULES" menu, "Literals" blocks, and tooltips.
- [x] Consolidate root text files.
- [x] Implement "Manage Variables" button in web_ui/toolbox.js.
- [x] Centre boot screen.

---

## Main Task: Build and Maintain Robust web_ui/Blockly

- [ ] Ensure robust web_ui/Blockly interface is always served (never the white screen/test UI)
- [ ] Continue building, refactoring, and documenting the main web UI (menus, overlays, sidebar, block integration)
- [ ] Review and update all documentation (README, etc.) to reflect this as the main task
- [ ] Rescan all files/folders and update comments for maintainability
- [ ] Document all changes and update master lists/action log

---

## Reference

- All menus and overlays must use fixed/absolute positioning and high z-index to guarantee visibility above Blockly/canvas.

---

## Pending Tasks

- [ ] Implement Icons (if feasible and safe).
- [ ] Implement "Manage Variables" button functionality (JavaScript callback).

---

## Version

- Updated with each major change.