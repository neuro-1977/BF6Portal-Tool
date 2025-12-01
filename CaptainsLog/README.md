# Captain's Log

## Overview
This log serves as the central repository for all project documentation, decisions, and progress updates. It is designed to be easily exportable and readable.

## Entries

### [2025-12-01] The "Wake Up Button" & Serenity Brain
- **Objective**: Establish a resilient, multi-workspace "Brain" that allows the project to resume instantly after crashes or session loss.
- **Changes**:
    - **Master Database**: `serenity.db` created as the single source of truth for Logs and Blocks.
    - **Instructions**:
        - `START.md`: Deployed to Serenity root. Acts as the "Wake Up" instruction for the AI.
        - `DISCORD_BOT_INSTRUCTIONS.md`: Deployed to Serenity root. Guides Discord bot behavior.
    - **Sync Tools**:
        - `tools/export_package.py`: Exports local data to JSON.
        - `tools/sync_from_serenity.py`: Pulls updates from the Brain back to this workspace.
        - `tools/sync_all_workspaces.py`: Master script to push Brain updates to all registered workspaces.
    - **Setup Script**: `setup_database.ps1` updated to deploy all of the above to the Serenity project folder.
- **Status**: Operational.
- **Concept**: "The Wake Up Button". Running `start` (reading START.md) in Serenity instantly loads the entire project context from `serenity.db`, allowing seamless continuation of work.

### [2025-12-01] Serenity Database & Nifty Export
- **Objective**: Establish a master SQLite database (`serenity.db`) for the Serenity project and enable easy export of BF6 Portal assets.
- **Changes**:
    - Created `setup_database.ps1`:
        - Installs "DB Browser for SQLite".
        - Prompts for target directory (default: `D:\=Code=\Serenity`).
        - Creates `serenity.db` with `LogEntries` and `Blocks` tables.
        - Imports current log and block definitions.
    - Created `tools/export_package.py`:
        - Exports Captain's Log to `export/captains_log.json`.
        - Parses and exports block definitions to `export/bf6_blocks.json`.
        - Copies key JS files (`bf6_blocks.js`, `bf6_toolbox.js`, `bf6_startup.js`) to `export/`.
- **Status**: Completed.

### [2025-12-01] IDE Freeze Fix & Boot Script Rename
- **Objective**: Fix IDE freeze caused by splash screen locking up on error, and rename "boot" related files to avoid confusion/conflicts.
- **Changes**:
    - Renamed `web_ui/boot.js` to `web_ui/startup.js`.
    - Updated `web_ui/index.html` to reference `startup.js`.
    - Renamed `BootSequence` class to `StartupSequence` in `startup.js`.
    - Modified `web_ui/main.js` to disable the splash screen overlay when errors occur.
    - Updated splash screen text from "booting" to "starting".
- **Status**: Completed.

### [2025-12-01] Project Initialization & UI Restoration
- **Objective**: Restore the "awesome" window UI while maintaining the stable `blockly_compressed.js` core.
- **Status**: In Progress.
- **Notes**:
    - Identified need for verbose logging in generator scripts.
    - Consolidating documentation here.
    - Restoring "awesome" UI from archives.
    - **Requirement**: Built-in error checker (boot sequence/error log).

## References
- [Blockly Developer Tools](https://developers.google.com/blockly)
- [Project Vision](file:///d:/=Code=/BF6Portal%20Tool/.agent/workflows/project_vision.md)
