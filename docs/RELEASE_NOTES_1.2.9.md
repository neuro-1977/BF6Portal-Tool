# Release Notes - v1.2.9

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

## Credits

- Portal data and block help/tooltips are derived from **Portal Docs** by the Battlefield Portal Community:
  - https://github.com/battlefield-portal-community/portal-docs
