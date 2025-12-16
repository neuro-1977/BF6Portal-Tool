# BF6Portal Tool — Release Notes (v1.2.6)

Date: 2025-12-15

This release focuses on **Portal template compatibility**, **quality-of-life editor features**, and **packaged-app reliability**.

---

## Highlights

### Portal JSON import now “just works” for community templates
- Switched JSON load/save to Blockly’s modern serialization API: `Blockly.serialization.workspaces.save/load`.
- Added workspace-state normalization so exports wrapped like `{ "mod": { ... } }` load correctly.
- Added **auto-registration of placeholder blocks** for missing `type`s during import so templates still render even when this build doesn’t yet ship the native block definitions.
- Improved post-load UX: automatic zoom/center so imported workspaces don’t appear “blank” due to off-screen blocks.

### Help system (offline) + per-block right-click help
- Added a Help modal powered by the shipped local docs (`bf6portal_blocks.json`).
- Added a block context-menu entry: **“Help: <type>”**.

### Presets + TypeScript Code Preview drawer
- Added a **Presets** dropdown with 3 locked built-ins:
  - Andy6170 — Rush (V1.0)
  - Andy6170 — Conquest (7.2)
  - Andy6170 — Breakthrough (V1.1)
- User presets are stored in `localStorage` (save/delete supported; built-ins require “Save as new”).
- Added a resizable **Code Preview** drawer showing a TypeScript export of the current workspace state.

### Packaged Electron build reliability
- Fixed packaged runtime issues related to module resolution (`xterm`), keeping UI assets inside `app.asar` and resolving production paths via `app.getAppPath()`.

---

## Editor/UI fixes
- Toolbox/menu: **RULES** is now the single menu containing exactly:
  - `MOD_BLOCK`
  - `RULE_HEADER`
  - `CONDITION_BLOCK`
- MOD block visual cleanup: the MOD block is labeled **“MOD” only** (no extra “RULES” label).
- Imported placeholder blocks now attempt to **match category colours** using:
  - known Portal structural type hints (e.g., `modBlock`, `ruleBlock`, …)
  - local docs colour metadata when available

---

## Maintenance / developer experience
- Updated several Python helper scripts under `tools/` to avoid hard-coded absolute paths, making the repo more portable across machines and folder names.

---

## Files of interest
- `web_ui/main.js` — JSON import/export, template normalization, placeholder block registration, presets, help, and code preview.
- `web_ui/toolbox.js` — toolbox menu structure.
- `web_ui/block_definitions.js` — MOD/RULE/Condition block visuals.
- `web_ui/webpack.config.js` — copies `bf6portal_blocks.json` + preset JSONs into `web_ui/dist/`.
- `electron-main.js` — Electron production path/module resolution fixes.

---

## Known limitations
- Imported placeholder blocks are visual stand-ins for missing definitions. They preserve structure for editing/viewing, but they are not guaranteed to have full generator logic until their real block definitions are implemented.
