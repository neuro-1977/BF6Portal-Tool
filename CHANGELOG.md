# Changelog

This project follows a pragmatic changelog style (human-written notes) rather than auto-generated commit dumps.

## Unreleased (planned for v1.3.0)

### Fixes
- **Custom variables list:** ensure all custom/user variables are shown consistently (toolbox + manager + preset imports).
- **Selection Lists dropdowns:** continue hardening edge cases where dropdowns can get stuck on “(loading selection lists…)” under Electron `file://` contexts.

### Improvements
- **Presets:** richer preset UX (save-as copy / overwrite flow for built-ins, better naming + metadata).

### Credits
- Add explicit credit for the **Portal Docs** dataset used to populate block help/tooltips:
  - https://github.com/battlefield-portal-community/portal-docs

### CI/CD
- GitHub Actions: release automation on tag push (creates GitHub Release and uploads Windows artifacts).

### Notes / Investigations log
These are the key issues encountered recently and how they were fixed:
- **“Container menuBarContainer not found”**: fixed by guarding MenuBar initialization when optional container isn’t present.
- **Preset templates failing to load (`MissingConnection` / `modBlock` RULES)**: fixed by ensuring `modBlock` always provides a `RULES` statement input before loading presets.
- **Packaged app missing `selection-lists.md`**: Electron build excludes `*.md`, so runtime now ships/loads `selection-lists.txt` instead.
- **Code Preview stopped showing TypeScript**: caused by loading two Blockly instances (global script + webpack import) and serializing a workspace created by the “other” instance. Fixed by making the webpack Blockly instance the global `window.Blockly` and explicitly initializing the preview after workspace creation.

## v1.2.9

### Fixes
- **Packaged app dialogs:** removed reliance on native `prompt()/alert()/confirm()` (blocked in Electron packaged builds) by using in-app modal dialogs and hooking Blockly’s dialog APIs.
- **Subroutines:** restored toolbox entries / UI flows so creating and calling subroutines works again.
- **Variables:** “Manage Variables” button works again; variables can be created and the toolbox updates appropriately.
- **Presets:** fixed the built-in/custom Conquest template import by making legacy variable blocks (`SetVariable`/`GetVariable`/`variableReferenceBlock`) schema-compatible with the preset JSON (`VALUE-0`/`VALUE-1`).

### Build / tooling
- Added a headless smoke test to validate that presets load via Blockly serialization (`tools/smoke_test_preset_load.js`).
- Added a safe cleanup helper for `dist-*` folders that are sometimes locked by Windows (`tools/cleanup_dist.ps1`).
- Improved electron-builder output overrides for local builds (`dist:test`, `dist:unpacked`).

## v1.2.8

### Features & Improvements
- Presets dropdown restored with **3 locked built-ins** (Andy6170 templates) + user save/delete.
- Placeholder block auto-registration so community templates still render even if some block types are missing.
- Selection list blocks use dynamic dropdowns (values sourced from `selection-lists` data).

### Fixes
- Guarded UI init to avoid runtime errors when optional containers aren’t present.
- Improved preset loading resilience and viewport focus (avoid “loaded offscreen / looks empty”).

### Known Issues
- A persistent vertical scrollbar may still appear next to the toolbox flyout in certain states.
