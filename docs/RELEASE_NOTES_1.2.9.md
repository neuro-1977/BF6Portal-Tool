# Release Notes - v1.2.9

## Hotfix 1 (2025-12-18)

This is a **v1.2.9 hotfix** (the installer still reports **1.2.9**). It focuses on Portal/community JSON interoperability and small editor UX fixes.

### Portal / community JSON interoperability (in progress)

- **TS/webpack runtime “Save JSON” now exports Portal/community wrapped JSON** by default:
  - `{ "mod": { "blocks": { "blocks": [...] }, "variables": [...] } }`
- **Portal-shaped JSON imports are hardened**:
  - unknown Portal block types (e.g. `modBlock`, `ruleBlock`, `conditionBlock`, `Wait`, etc.) are auto-registered as **placeholder blocks** during import so deserialization doesn’t crash.

> Note: official Portal import/export compatibility is still being validated in the wild. If a file imports but loses block details/options, please report the JSON + what blocks were involved.

### UX fixes

- **Toolbox search** restored (search box above the toolbox).
- **Right-click Help** now opens local/offline docs when available.
- **Selection list dropdown colour** made consistent across enum blocks.
- **Preset/import variable visibility** improved for presets that include typed variables.

## Summary

This release focuses on **packaged-app reliability** (Electron), and restores key editor workflows: **Subroutines**, **Variables**, and **Preset imports** (including Conquest).

## Fixes

- **Conquest preset loads correctly**
  - Fixed Blockly deserialization failures caused by legacy variable blocks in community templates.
  - The legacy block types `SetVariable`, `GetVariable`, and `variableReferenceBlock` are now schema-compatible with preset JSON that uses `VALUE-0` / `VALUE-1` input names.

- **Subroutines restored**
  - Toolbox entries and UI flows are back (create + call subroutines works again).

- **Variables restored**
  - “Manage Variables” button works again.
  - Toolbox variable blocks update based on current variables.

- **Packaged Electron dialogs**
  - Removed reliance on native `prompt()/alert()/confirm()` (blocked in packaged Electron).
  - Added in-app modal dialogs and installed them into Blockly’s dialog hooks.

## Build / tooling

- Added a headless preset-load smoke test: `tools/smoke_test_preset_load.js`.
- Added a safe dist cleanup helper: `tools/cleanup_dist.ps1`.
- Added build script helpers for alternate output folders:
  - `npm run dist:test` → `dist-test/`
  - `npm run dist:unpacked` → `dist-dev/`

## Known issues

- Custom/user variables may not yet appear in every list/context consistently (planned for v1.3.0).

- Official Portal editor compatibility for *all* block types is still a work-in-progress:
  - some blocks may import but appear as defaults if their field/value mappings differ from the official schema.

## Credits

- Portal data and block help/tooltips are derived from **Portal Docs** by the Battlefield Portal Community:
  - <https://github.com/battlefield-portal-community/portal-docs>
