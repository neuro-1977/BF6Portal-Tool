# File Knowledgebase Entries (2025-11-29)

This file provides detailed knowledgebase entries for all major files and folders in the BF6Portal Tool project. Each entry describes the file's purpose, usage, and any special notes for maintainers or future developers.

---

## Root Files
- **ANALYSIS_SUMMARY.md**: Summarizes project analysis, progress, and key decisions.
- **BF6Portal Tool.code-workspace**: VS Code workspace configuration for project layout and settings.
- **BLOCK_CATALOG_TEMPLATE.md**: Template for documenting block types and categories.
- **COMMANDS.md**: Reference for all available commands and their syntax.
- **CONCEPT_ART.md**: Visual style and UI/UX guidelines for the editor.
- **IMPLEMENTATION_STATUS.md**: Tracks the implementation status of features and modules.
- **IMPROVEMENTS.md**: Ongoing list of improvements and feature ideas.
- **LICENSE**: MIT License for open-source distribution.
- **MISSING_INFO_REQUESTS.txt**: Tracks missing screenshots, block types, or documentation.
- **PORTAL_REFERENCE.md**: Battlefield Portal scripting reference and block documentation.
- **PROMPT.md**: The master prompt and workflow reference; always check first.
- **README.md**: Main documentation, setup, and usage instructions.
- **SCREENSHOT_PALLET.md**: Maps screenshots to block types for visual reference.
- **START.bat**: Batch script to launch the editor (Windows).
- **Things. WE NEED.md**: Miscellaneous needs, requests, and unresolved issues.
- **TODO.md**: Live todo list; always reference PROMPT.md for workflow.
- **pyproject.toml**: Python project configuration and metadata.
- **requirements.txt**: Python dependencies for the project.
- **run_editor.bat / run_editor.ps1**: Scripts to launch the editor (Windows, PowerShell).
- **updateUI.prompt.md**: Prompt for UI/UX update tasks.
- **VERSION**: Current version string for the project.

## Folders
- **assets/**: Contains all block definitions (JSON), help text, and images for the editor.
- **backups/**: Snapshots of important files/folders for disaster recovery.
- **blockly/**: (Legacy) Blockly engine or related files; may be deprecated in favor of vendor/.
- **command_pallet/**: Command reference files and related assets.
- **dev/**: Development workspace, including legacy and experimental files.
- **Dump/**: Raw screenshots and assets awaiting processing.
- **knowledgebase/**: Centralized documentation, prompts, screenshots, and logs.
- **old/**: Legacy Python code and modules, kept for reference.
- **publish/**: (If present) Distribution or release artifacts.
- **source/**: Main Python source code for the legacy editor.
- **tests/**: Python unit tests for core modules.
- **tools/**: Helper scripts for asset generation, cataloging, and maintenance.
- **vendor/**: Third-party libraries (e.g., blockly.min.js, media/); do not modify.
- **web_ui/**: Main web UI for the Blockly editor (HTML, JS, CSS, images). All robust UI logic lives here.

---

**For more details, see knowledgebase/docs/PROJECT_FILE_CATALOG.md and FILE_FORMATS.md.**

_Last updated: 2025-11-29_