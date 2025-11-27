# Version 1.0.4beta (2025-11-27)

- Web UI sidebar/toolbox is now always expanded and flat, matching the official Portal system. All categories/blocks are visible under group headers, no nested categories.
- Packaging improvements: PyInstaller spec updated to include all modules and assets, preventing missing module errors in the executable.

# BF6 Portal-Tool

![UI Mockup](docs/ui_mockup.svg)

Visual block editor for building Battlefield Portal scripts.

> **NOTICE (Nov 2025)**: This project is transitioning from a Python/Tkinter desktop app to a **Web-based Google Blockly interface**. The Python app (`source/Block_Editor.py`) is now considered legacy.

## Testing & Refresh Instructions

**When to restart or refresh:**

- **If you change Python source code** (in `source/`):
  - **Restart the Python application** (close and re-run the editor) to ensure all code changes are loaded.
- **If you only change assets or block data** (in `assets/`):
  - You can usually just re-import your workspace or refresh the UI.
- **If you are using the web/Blockly version**:
  - **Refresh your browser** to load the latest frontend code.
  - If you change backend code, restart the backend server as well.

**To avoid errors with old files:**
- Always re-import your workspace after making code changes.
- If you see unexpected behavior, try resetting the workspace and re-importing your file.
- If you get errors, check the console/log for details and ensure you are not using an outdated or incompatible file format.

**Summary Table:**

| Change Type         | Action Required                |
|---------------------|-------------------------------|
| Python code change  | Restart the app/editor        |
| Asset/data change   | Re-import or refresh UI       |
| Web UI/frontend     | Refresh browser               |
| Backend/server      | Restart backend, refresh page |
| Import old file     | Re-import after restart       |

If in doubt, restart the app and re-import your workspace for a clean test.

## Quick Start (New Web Editor)

1. **Run the Launcher**:
   ```powershell
   python tools/launch_blockly.py
   ```
2. **Browser**: The editor will open automatically at `http://localhost:8000`.

## Legacy Quick Start (Python/Tkinter)

**PowerShell:**

```powershell
# Create and activate a virtualenv
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install requirements
pip install -r requirements.txt

# Run the legacy editor
python .\source\Block_Editor.py
```

**Note:** `tkinter` is part of the Python standard library (Windows users: install the official CPython build).

## Features (Web Editor)

- **Import/Export Parity with Official Portal**: Import and export workspaces in JSON format, preserving block layout, snapping, and TypeScript code. Imported workspaces match the official Battlefield Portal editor layout and logic.
- **TypeScript Generation**: Each block generates TypeScript code that matches the official Portal scripting system, ensuring functional parity.
- **Google Blockly Engine**: Industry-standard visual programming interface.
- **Clean Palette**: Modern, dark-themed UI with "puzzle piece" connectors.
- **Auto-Generated Blocks**: Block definitions are automatically generated from the existing `assets/` JSON library.
- **Smart Snapping**: Robust connection logic handled by the Blockly engine.

## Codebase Architecture

The project is organized into modular components:

- **`web_ui/`**: **(NEW)** The new Web/Blockly frontend.
  - `index.html`: Main editor entry point.
  - `definitions.js`: Generated block definitions.
  - `toolbox.js`: Generated sidebar configuration.

- **`tools/`**: Utility scripts.
  - `export_to_blockly.py`: Converts `assets/` JSON data into Blockly definitions.
  - `launch_blockly.py`: Local server for the web editor.

- **`source/`**: **(LEGACY)** Original Python/Tkinter application code.
  - **`Block_Editor.py`**: Main application entry point and controller.
  - **`Block_Renderer.py`**: Handles all visual drawing on the canvas (blocks, grid, connections).
  - **`Input_Handler.py`**: Manages user input (mouse clicks, drags, keyboard shortcuts).
  - **`Sidebar_Manager.py`**: Manages the left sidebar (categories, search, block spawning).
  - **`TopBar_Manager.py`**: Manages the top toolbar (Import/Export, Analyze) and zoom controls.
  - **`Block_Mover.py`**: Handles block movement and snapping logic.
  - **`Block_Data_Manager.py`**: Loads and manages block definitions from JSON assets.
  - **`Code_Generator.py`**: Generates text code from the visual block structure.
  - **`workspace_loader.py`**: Handles loading saved workspaces from JSON.
- **`assets/`**: JSON data files defining block behavior and appearance.
- **`docs/`**: Documentation and reference materials.
- **`tools/`**: Helper scripts for cataloging and maintenance.

## Usage

### Creating Blocks
1. Click category buttons (MOD, RULES, CONDITIONS, ACTIONS, EVENTS) in the sidebar
2. **Single-click** a menu item to spawn a block at the center of the view

### Moving Blocks
- **Click and drag** any block to move it
- Parent blocks automatically move their snapped children (chains move together)
- Hold **Shift** while dragging to detach a block from its parent

### Snapping Blocks Together
- Drag a block near a compatible connection point to snap it
- **Hierarchy Rules:**
  - **MOD**: The root container. Contains RULES.
  - **RULES**: Snaps inside MOD. Contains CONDITIONS and ACTIONS.
  - **CONDITIONS**: Snaps inside RULES (top slot). Connects horizontally.
  - **ACTIONS**: Snaps inside RULES (bottom slot). Connects horizontally.
  - **EVENTS**: Snaps inside CONDITIONS or ACTIONS.
- Blocks will visually "snap" into place when released near a valid target.
- **Horizontal Snapping**: Actions and Conditions now snap side-by-side (left-to-right) like puzzle pieces, matching the BF Portal interface.

### Zoom Controls
- **Ctrl + Mouse Wheel**: Zoom in/out
- **Ctrl + Plus/Minus**: Zoom in/out
- **Ctrl + 0**: Reset zoom to 100%

### Code Output

- View generated code in the right pane
- **Edit code directly** in the code pane
- Click **"⬅ Update Blocks"** to parse edited code and regenerate blocks on canvas
- Click **"🔄 Refresh Code"** to regenerate code from current blocks

### Help System

- **Right-click any block** to open the context menu
- Select **"Help & Examples"** to see usage instructions and examples
- Help content is extensible via JSON files in `assets/`

## Extending the Editor

You can add new block definitions as JSON files in the `assets/` folder:

- `assets/mod_data.json` — MOD (mod settings) blocks
- `assets/rules_data.json` — Rule header blocks
- `assets/events/event_data.json` — Event (start) blocks
- `assets/conditions/condition_data.json` — Condition blocks
- `assets/actions/action_data.json` — Action and control blocks

### JSON Structure

Each JSON file follows this structure:

```json
{
	"color": "#ff9800",
	"sub_categories": {
		"Category Name": {
			"BLOCK_ID": {
				"label": "Block Display Name",
				"type": "SEQUENCE",
				"args": ["arg1", "arg2"]
			}
		}
	}
}
```

**Block Types:**
- `SEQUENCE`: Regular action block with bottom notch for chaining
- `START`: Starting block (e.g., MOD, RULE)
- `CONDITION`: Conditional block (boolean expressions)
- `C_WRAP`: Control wrapper block (e.g., IF, WHILE)

After adding or editing JSON files, restart the editor to load changes.

## Project Structure

```
source/
  Block_Editor.py         # Main UI and canvas management
  Block_Mover.py          # Block spawning and snapping logic
  Block_Data_Manager.py   # Block data loading and management
  io_handlers.py          # Import/export dialogs
  workspace_loader.py     # JSON workspace loading
  editor_helpers.py       # Utility functions
assets/
  mod_data.json           # MOD block definitions
  rules_data.json         # RULE block definitions
  actions/                # Action block definitions
  conditions/             # Condition block definitions
  events/                 # Event block definitions
```


## Beta Status

**Version: 1.02-beta**

This project is in active beta. Import/export, snapping, and TypeScript generation are under continuous improvement to match the official Battlefield Portal experience. Please report issues or feature requests on GitHub.

---
Files added by this scaffolding:
- `pyproject.toml` - project metadata
- `requirements.txt` - runtime deps
- `.gitignore` - common ignores
- `run_editor.ps1` - convenience PowerShell runner
- `.vscode/launch.json` - VS Code run configuration

Next steps:
- Run the PowerShell commands above to set up the environment.
- Tell me if you want a package layout (installable) or CI config added.
