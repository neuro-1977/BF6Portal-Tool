# Changelog

This project follows a pragmatic changelog style (human-written notes) rather than auto-generated commit dumps.

## Unreleased (planned for v1.3.0)

### Fixes
- **Selection Lists dropdowns:** address cases where dropdowns get stuck on “(loading selection lists…)” by improving runtime asset loading for Electron `file://` contexts.
- **Presets:** allow saving after loading and editing a built-in preset (save-as copy / overwrite flow).

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

### Features & Improvements
- **Collections / Bookmarks (MVP):** convert a stack into an offscreen collection definition and leave a compact call/bookmark block in place.
  - Right-click: **Convert to collection (bookmark + move stack)**
  - Right-click: **Jump to collection definition** (teleport)
- **Canvas navigation (right-click teleport):** fast jumping around large workspaces.
  - MOD: jump to the MOD container
  - Rules: jump to owning Rule / first Rule
  - Variables: jump between first getter/setter
  - Generic: jump to stack root
  - Subroutines: jump Call ↔ Definition

### Fixes
- **Portal JSON compatibility:** export wrapped Portal-style JSON (`{"mod":{"blocks":...}}`) and accept both wrapped + raw Blockly workspace JSON on import.
- **Help system:** stable search input (no scrambled text while typing) and right-click help opens the same local docs as the main Help UI.

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
