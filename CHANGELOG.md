# Changelog

This project follows a pragmatic changelog style (human-written notes) rather than auto-generated commit dumps.

## Unreleased

- (nothing yet)

## v1.3.0

### Features & Improvements (v1.3.0)

- **Header/layout cleanup:** brand/logo aligned left, toolbox search moved into the header, and the app version is shown top-right.
- **Workspace controls in header:** zoom in/out/reset/fit + trash moved to the top-right header to keep the canvas clear.
- **Default focus point on load:** after loading presets/files, the viewport lands at the **top of the MOD block** (start of the rules chain).
- **UI clutter removed:** removed the unused Live Diagnostics overlay and the floating Code Preview button (Code Preview is now a normal header button).
- **Collections UX:** COLLECTIONS toolbox category now dynamically lists existing collections and includes a “Convert selection to collection” action.
- **Collections visuals:** collection call/definition blocks are taller (easier to spot in large workspaces).
- **Variables toolbox:** restored a working VARIABLES category (manage/create button + existing variables listed as pre-filled GET/SET blocks).
- **Selection Lists:** regenerated `selection-lists.md` so `widget 1` uses the base enum name (no `Item` suffix).
- **Selection Lists dropdowns:** runtime lookups are now case-insensitive and support alias mapping for mismatched enum names.

### Fixes (v1.3.0)

- **Selection Lists dropdowns:** address cases where dropdowns get stuck on “(loading selection lists…)” by improving runtime asset loading for Electron `file://` contexts.
- **Presets:** allow saving after loading and editing a built-in preset (save-as copy / overwrite flow).

- **Performance polish:** reduced redundant toolbox refresh work after programmatic loads.
- **Console noise reduction:** reduced noisy informational logs during preset loads (opt-in debug via `localStorage.bf6_debug = "1"`).

- **Presets (Electron file://):** built-in preset loading now falls back to reading JSON from disk when `fetch()` is unavailable/restricted in packaged builds.

- **Electron compatibility:** removed remaining native `prompt()` usage by routing prompts through Blockly dialogs (Electron does not support `window.prompt`).
- **Presets/imports:** ensure critical Portal structural types (like `modBlock` with a `RULES` statement) are defined before loading templates.
- **Version label:** app version now resolves in both dev and packaged `app.asar` layouts.

### Credits (v1.3.0)

- Add explicit credit for the **Portal Docs** dataset used to populate block help/tooltips:
    - [battlefield-portal-community/portal-docs](https://github.com/battlefield-portal-community/portal-docs)

### CI/CD (v1.3.0)

- GitHub Actions: release automation on tag push (creates GitHub Release and uploads Windows artifacts).

### Notes / Investigations log (v1.3.0)

These are the key issues encountered recently and how they were fixed:

- **“Container menuBarContainer not found”**: fixed by guarding MenuBar initialization when optional container isn’t present.
- **Preset templates failing to load (`MissingConnection` / `modBlock` RULES)**: fixed by ensuring `modBlock` always provides a `RULES` statement input before loading presets.
- **Packaged app missing `selection-lists.md`**: Electron build excludes `*.md`, so runtime now ships/loads `selection-lists.txt` instead.
- **Code Preview stopped showing TypeScript**: caused by loading two Blockly instances (global script + webpack import) and serializing a workspace created by the “other” instance. Fixed by making the webpack Blockly instance the global `window.Blockly` and explicitly initializing the preview after workspace creation.

## v1.2.9

### Features & Improvements (v1.2.9)

- **Collections / Bookmarks (MVP):** convert a stack into an offscreen collection definition and leave a compact call/bookmark block in place.
    - Right-click: **Convert to collection (bookmark + move stack)**
    - Right-click: **Jump to collection definition** (teleport)
- **Canvas navigation (right-click teleport):** fast jumping around large workspaces.
    - MOD: jump to the MOD container
    - Rules: jump to owning Rule / first Rule
    - Variables: jump between first getter/setter
    - Generic: jump to stack root
    - Subroutines: jump Call ↔ Definition

### Fixes (v1.2.9)

- **Portal JSON compatibility:** export wrapped Portal-style JSON (`{"mod":{"blocks":...}}`) and accept both wrapped + raw Blockly workspace JSON on import.
- **Help system:** stable search input (no scrambled text while typing) and right-click help opens the same local docs as the main Help UI.

## v1.2.8

### Features & Improvements (v1.2.8)

- Presets dropdown restored with **3 locked built-ins** (Andy6170 templates) + user save/delete.
- Placeholder block auto-registration so community templates still render even if some block types are missing.
- Selection list blocks use dynamic dropdowns (values sourced from `selection-lists` data).

### Fixes (v1.2.8)

- Guarded UI init to avoid runtime errors when optional containers aren’t present.
- Improved preset loading resilience and viewport focus (avoid “loaded offscreen / looks empty”).

### Known Issues (v1.2.8)

- A persistent vertical scrollbar may still appear next to the toolbox flyout in certain states.
