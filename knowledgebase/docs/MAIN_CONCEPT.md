# Main Concept: BF6Portal Tool Web UI

**Last Updated:** November 27, 2025

## Overview

The BF6Portal Tool is a modern, custom web-based editor for visually creating and editing logic scripts for Battlefield 2042's Portal mode. It features a unique, minimal UI and robust Blockly integration (in progress).

## UI Structure (v1.0.6-beta)

- **Top Bar:** About, Save, Load, Code, Export, Import, Zoom controls
- **Left Menu:** Placeholder for block categories (MOD, RULES, ACTIONS, etc.)
- **Canvas:** Main area for arranging blocks
- **Recenter:** Button to recenter the canvas

See [CONCEPT_UI.svg](CONCEPT_UI.svg) and [ui_mockup.svg](ui_mockup.svg) for updated visual references.

## Load Order (v1.0.6-beta)

1. DOS/CLI launches the web UI (run_editor.bat or run_editor.ps1)
2. Web UI loads in browser (index.html)
3. Scripts load in order: toolbox.js → blockly.min.js → definitions.js → block_images.js → main.js
4. Blockly and toolbox are initialized (in progress)

## Version 1.0.6-beta Changes

- Major UI refactor and modernization
- New load order: DOS/CLI → Web UI → Blockly UI
- All documentation and mockups updated to match current UI
- Legacy references and images removed

## Future Work

- Restore full Blockly toolbox and block categories
- Enhance onboarding and help system
- Improve export and code generation features
