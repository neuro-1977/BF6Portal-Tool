# BF6Portal Tool: Custom Battlefield Portal Block Editor

This project is a modern, custom block-based editor for Battlefield Portal logic, featuring a unique web UI with minimal design and robust Blockly integration. It enables users to visually create, edit, and export Portal logic scripts for Battlefield 2042.

## Features

- Modern web UI with top bar, left menu placeholder, and large canvas
- Robust Blockly integration (in progress)
- Import/export of Portal logic scripts
- Minimal, dark-themed interface
- Code view and export options

## Getting Started

1. Run `run_editor.bat` or `run_editor.ps1` to launch the editor.
2. The web UI will open in your browser.
3. Use the top bar for About, Save, Load, Code, Export, Import, and Zoom controls.
4. (When enabled) Drag blocks from the left menu onto the canvas to build your logic.

## UI Overview

![UI Mockup](docs/ui_mockup.svg)

- **Top Bar:** About, Save, Load, Code, Export, Import, Zoom controls
- **Left Menu:** Placeholder for block categories (MOD, RULES, ACTIONS, etc.)
- **Canvas:** Large area for block arrangement
- **Recenter:** Button to recenter the canvas

See also: [Concept UI](docs/CONCEPT_UI.svg)

## Version History

- **1.0.4:** Initial web UI, basic Blockly integration
- **1.0.5-beta:** Major UI refactor, new load order, updated documentation and mockups, improved separation of DOS, Web UI, and Blockly UI stages. All documentation and UI mockups now reflect the current web UI state and load order. Legacy references removed.

## Documentation

See the `docs/` folder for:
- `CONCEPT_UI.svg`: Conceptual UI layout (matches current web UI)
- `ui_mockup.svg`: UI mockup matching the current web UI
- `MAIN_CONCEPT.md`, `SIDEBAR_LAYOUT.md`, `SNAP_LOGIC.md`: Detailed documentation (all updated for v1.0.5-beta)

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
