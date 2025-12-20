# Release Notes - v1.3.0

## Highlights

- **Collections / Bookmarks (quality-of-life):** COLLECTIONS is now a dynamic toolbox category with a one-click “Convert selection to collection” action and improved visuals.
- **Navigation (“teleport”):** right-click jump helpers expanded (MOD / rules / stack root / variables / subroutine call ⇄ definition).
- **Cleaner workspace controls:** zoom in/out/reset/fit + trash moved to the top-right header (no on-canvas zoom/trash UI).
- **Preset workflow stability:** built-in presets remain locked, but you can save copies and overwrite your own presets safely.
- **Import resilience:** community/Portal JSON imports now auto-register placeholder blocks for missing types so templates still load instead of failing hard.
- **Portal export compatibility:** exported templates now round-trip more reliably into the official Battlefield Portal editor (preserves critical metadata like `extraState`).

## Changes

### UI / UX

- Header/layout cleanup: brand/logo aligned left, toolbox search moved into the header, app version shown top-right.
- Reduced UI clutter: Code Preview is a normal header button; removed unused diagnostics overlay.
- Workspace controls moved to the header (top-right): zoom in/out/reset/fit + trash (Blockly’s on-canvas zoom/trash UI is disabled/hidden).
- **Default window size / fullscreen feel:** the app now opens maximized with a 1920×1080 (1080p) target size (clamped to your display work area) so it fills the screen on standard 1080p desktops.
- Fixed the persistent toolbox/flyout vertical scrollbar artifact by hiding native scrollbar chrome on Blockly’s inner scroll containers.
- **Default focus point on load:** when you load a preset or import a workspace, the view now lands at the **top of the MOD block** (start of the rules chain) so you don’t have to scroll around to find the beginning.

### Collections

- Collection call/definition blocks are taller and more visible.
- Toolbox flyout lists existing collections and can create one from the current selection.
- Context menus support convert, jump, and rename flows.
- **Collection names now render reliably** in the flyout and on spawned call blocks (no more “COLLECT” with a blank name).
- **Jump-to-definition is centered** (accounts for the fixed header) and the menu label is now contextual (e.g. “Jump to Coll 3”).
- **Right-click Help** now shows local documentation for Collections blocks.

### Variables

- Restored a working VARIABLES category:
  - “New / Manage Variables” button.
  - Existing variables appear as pre-filled GET/SET templates.
- **Electron compatibility:** replaced native `prompt()` flows with a Blockly dialog prompt modal (Electron doesn’t support `window.prompt`).

### Selection Lists

- Regenerated `selection-lists` enums so widget naming is normalized (no `Item` suffix where it shouldn’t be).
- Runtime dropdown lookup is case-insensitive and supports alias mapping.
- Packaged builds load `selection-lists.txt` (Electron builds exclude `*.md`).

### Import / Presets compatibility

- Portal/community wrapper formats supported (e.g. `{ "mod": { ... } }`).
- Placeholder block auto-registration prevents missing block types from breaking loads.
- Ensured critical Portal structural blocks (like `modBlock` with `RULES`) exist before loading templates.
- Built-in presets load reliably in packaged Electron builds under `file://` by falling back to disk reads when `fetch()` is unavailable.
- **Portal JSON round-trip:** preserve Portal-required `extraState` on structural blocks and subroutines so exports import cleanly in the official editor.
- **Export correctness:** expanding collections during export now reassigns block IDs to avoid duplicate IDs.
- **Performance polish:** reduced redundant toolbox refresh work after programmatic loads.
- **Console noise reduction:** noisy informational logs during preset loads are now gated behind an opt-in debug flag (`localStorage.bf6_debug = "1"`).

## Notes

- Windows icon assets are sourced from the project’s `web_ui/assets/img/` and built into the installer via electron-builder.
