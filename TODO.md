# TODO

- [ ] **UI/UX:** Fix persistent vertical scrollbar appearing next to the toolbox flyout after interacting with menus. 
    - **Location:** Left side of the screen, adjacent to the Blockly toolbox category list.
    - **Current State:** CSS attempts to hide scrollbars on `.blocklyToolboxDiv`, `.blocklyToolbox`, and `.blocklyFlyout` have reduced but not fully eliminated the artifact in some states.
    - **Potential Cause:** Electron/Chromium native scrollbar rendering on a dynamic container created by Blockly or the custom search bar injection.

## Upcoming (target: v1.3.0)

- [x] **Toolbox search:** restore the search box above the toolbox (above **RULES**) and keep it working in packaged Electron builds.

- [x] **Custom variables imports:** ensure variables from Andy6170 presets (and other imported JSON) are visible in the **VARIABLES** toolbox category and variable dropdowns.

- [x] **Right-click Help:** right-clicking a block should open the local Help topic (not “no help info yet” when we have docs).

- [x] **Selection list colours:** selection-list dropdown blocks (e.g. **Vehicles**) should use a consistent colour (no random red outlier).

- [x] **Portal JSON compatibility:** exported/imported workspace JSON matches Portal-style wrapper (`{"mod":{"blocks":...}}`), and importer accepts both wrapped and raw Blockly workspace formats.

- [ ] **TypeScript import:** add a TypeScript → Blocks import flow. For now, show an **Import TS (Coming soon)** button until we can guarantee correctness.

- [ ] **External reference:** review `deluca-mike/bf6-portal-scripting-template` for ideas (TS bundling, debug UI patterns). **Do not reuse code** unless a license/permission is clarified; keep notes/attribution up to date.

- [ ] **Project cleanup / stabilization (v1.3.0 goal):**
    - remove unnecessary comments, dead code paths, and stale file references
    - consolidate duplicate logic (especially toolbox/presets/selection-lists)
    - ensure naming and folder layout is consistent
    - add or update documentation for the final structure

- [ ] **Toolbox parity + ordering:** user-provided lists will define the exact order and membership of blocks in each menu; implement parity checks so we can confirm “everything is present” and in the right spot.

- [ ] **Variables UX:** decide and implement whether “custom variables” should be listed (and where). Ensure variable creation + listing + toolbox generation are consistent across:
    - fresh workspaces
    - imported community templates
    - built-in presets

- [ ] **Selection Lists:** continue hardening edge cases where dropdowns can get stuck on “(loading selection lists…)” under Electron `file://`.

- [ ] **Presets:** richer preset UX (save-as copy / overwrite flow for built-ins, better naming + metadata).

- [ ] **Build outputs:** reduce `dist-*` folder sprawl and add a safe cleanup flow (Windows file locks on `app.asar` are common).

- [ ] **Testing:** keep the headless preset-load smoke test and consider running it in CI for regressions.
