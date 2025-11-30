
# 2025-11-30: Workspace Reset and Default Blockly Restore

**[2025-11-30  Workspace Log]**
- All custom menu structure and blockly setup have been safely backed up.
- The web_ui/blockly directory is now restored to a default Blockly install (from vendor/blockly if needed).
- The custom boot screen is disabled but preserved for future use.
- Serenity/other projects are paused; all focus is on clean, default Blockly integration and safe backup of all customizations.



## Current Action
- All custom menu structure and blockly setup have been backed up to `backups/menu_structure_2025-11-30/` and `backups/blockly_custom_2025-11-30/`.
- The web_ui/blockly directory is now a clean, default Blockly install (copied from vendor/blockly if needed).
- The custom boot/splash screen is commented out in index.html and preserved for future restoration.
- All settings and extensions should reflect the BF6Portal Tool workspace only.
- Serenity/other projects are paused; focus is on clean, default Blockly integration and safe backup of all customizations.

## Next Steps
- Test that the default Blockly loads and runs in the main web UI.
- Re-enable or rebuild features as needed, using the backed-up customizations as reference.
- Keep this README and all documentation up to date with every major workspace change.

# BF6Portal Tool: Custom Battlefield Portal Block Editor


This project is a modern, custom block-based editor for Battlefield Portal logic, featuring a robust, branded web UI with full Blockly integration. **The only supported UI is the one in `web_ui/`—never use or serve the test/standalone/blank UI.**

**Main Task:** Build, maintain, and extend the robust web_ui/Blockly interface. All menus, overlays, and block integration must be robust, maintainable, and always on top. All documentation and workflow should reflect this as the ongoing main priority.

## Features

- Modern web UI with fixed top menu and left sidebar (always on top of Blockly/canvas)
- Robust, maintainable overlay system (z-index, fixed/absolute positioning for all menus and modals)
- Clean, dark-themed interface styled after VS Code and Battlefield Portal
- Import/export of Portal logic scripts
- Code view and export options
- Fully refactored and documented HTML/CSS/JS for maintainability

## Getting Started


### VS Code Autoload (Recommended)
1. **Open the workspace in VS Code** (`BF6Portal Tool.code-workspace`).
2. The web editor server will auto-launch via the "Launch Web Editor" task.
3. Your browser should open to [http://localhost:8000](http://localhost:8000) automatically (if supported by your setup).
4. If the browser does not open, open it manually and go to [http://localhost:8000](http://localhost:8000).
5. Use the vertical, centered controls for About, Save, Load, Code, Export, Import, Zoom, and Recenter.
6. (When enabled) Drag blocks from the left menu onto the canvas to build your logic.

#### Troubleshooting Autoload
- If the server or browser does not start, use the "Start WEBUI" or "Launch Web Editor" task from the VS Code Run/Tasks menu.
- Ensure your Python environment is activated and requirements are installed.
- If you see errors in the terminal, check for missing files or permissions.


## UI Overview

![UI Mockup](docs/ui_mockup.svg)

- **Top Menu Bar:** Fixed, always visible, overlays all content (About, Save, Load, Code, Export, Import, Zoom, Recenter)
- **Left Sidebar:** Fixed, always visible, overlays all content (Categories, Search, Code Menu)
- **Canvas:** Large area for block arrangement (Blockly engine)
- **All modals and menus:** Robust overlay (high z-index, fixed/absolute, never hidden by Blockly)

See also: [Concept UI](docs/CONCEPT_UI.svg)

## Version History

- **1.0.4:** Initial web UI, basic Blockly integration
- **1.0.6-beta:** Blockly standalone server fix, staged integration, and persistent action logging. All documentation and UI mockups now reflect the current web UI state and load order. Legacy references removed.

## Documentation

See the `docs/` folder for:
- `CONCEPT_UI.svg`: Conceptual UI layout (matches current web UI)
- `ui_mockup.svg`: UI mockup matching the current web UI
- `MAIN_CONCEPT.md`, `SIDEBAR_LAYOUT.md`, `SNAP_LOGIC.md`: Detailed documentation (all updated for v1.0.6-beta)

## License

This project is licensed under the MIT License.

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
  - `index.html`: Main editor entry point. Fixed top menu, fixed left sidebar, robust overlay for all menus/modals. All markup and comments refactored for clarity and maintainability.
  - `main.js`: Handles all menu/modal logic, sidebar/category selection, and robust overlay.
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
1. Click category buttons (MOD, RULES, CONDITIONS, ACTIONS, EVENTS) in the sidebar or use the vertical controls.
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
