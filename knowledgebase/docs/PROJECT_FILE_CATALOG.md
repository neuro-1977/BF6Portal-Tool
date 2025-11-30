# Project File Catalog (2025-11-29)

This document catalogs all files and folders in the BF6Portal Tool project from the root, describing their purpose and usage. Use this as a reference for onboarding, maintenance, and future development.

---

## Root Directory
- **ANALYSIS_SUMMARY.md**: High-level project analysis and progress summary.
- **BF6Portal Tool.code-workspace**: VS Code workspace settings.
- **BLOCK_CATALOG_TEMPLATE.md**: Template for block cataloging.
- **COMMANDS.md**: List of available commands and their usage.
- **CONCEPT_ART.md**: Visual style guide and UI/UX concept notes.
- **IMPLEMENTATION_STATUS.md**: Status of major features and modules.
- **IMPROVEMENTS.md**: Suggestions and planned improvements.
- **LICENSE**: Project license (MIT).
- **MISSING_INFO_REQUESTS.txt**: List of missing screenshots, info, or assets.
- **PORTAL_REFERENCE.md**: Reference for Battlefield Portal scripting.
- **PROMPT.md**: Master workflow, vision, and prompt for project regeneration.
- **README.md**: Main project documentation and getting started guide.
- **SCREENSHOT_PALLET.md**: Table mapping screenshots to block types.
- **START.bat**: Batch file to launch the editor (Windows).
- **Things. WE NEED.md**: Miscellaneous needs and requests.
- **TODO.md**: Live, rolling todo list (always reference PROMPT.md).
- **pyproject.toml**: Python project metadata.
- **requirements.txt**: Python dependencies.
- **run_editor.bat / run_editor.ps1**: Scripts to launch the editor (Windows, PowerShell).
- **updateUI.prompt.md**: Prompt for UI/UX updates.
- **VERSION**: Current version string.

## Folders
- **assets/**: All block definitions, help, and images (JSON, PNG, etc.).
- **backups/**: Snapshots of key files/folders for recovery.
- **blockly/**: (Legacy) Blockly engine or related files (may be deprecated).
- **command_pallet/**: Command reference and related assets.
- **dev/**: Development workspace, legacy and in-progress files.
- **Dump/**: Raw screenshots and assets to be processed.
- **knowledgebase/**: All documentation, prompts, screenshots, and session logs.
- **old/**: Legacy Python code and modules.
- **publish/**: (If present) Distribution or release artifacts.
- **source/**: Main Python source code for the legacy editor.
- **tests/**: Python unit tests.
- **tools/**: Helper scripts for asset generation, cataloging, and maintenance.
- **vendor/**: Third-party libraries (e.g., blockly.min.js, media/).
- **web_ui/**: Main web UI for the Blockly editor (HTML, JS, CSS, images).

---

**See knowledgebase/docs/FILE_FORMATS.md for file format details.**

_Last updated: 2025-11-29_