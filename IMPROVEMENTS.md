# November 2025: Import/Export Parity & TypeScript Beta 1.02

## Major Feature: Official Portal Import/Export Parity
- Import and export workspaces in JSON format, preserving block layout, snapping, and TypeScript code.
- Imported workspaces match the official Battlefield Portal editor layout and logic, including block snapping and grouping.
- TypeScript code is generated for each block, matching the official scripting system.
- All snapping, block placement, and export logic now mirrors the official Portal editor.

## Beta Version 1.02
- Version bumped to 1.02-beta.
- Project status: **Active Beta**. Please report issues and feature requests on GitHub.

---
# Recent Improvements to Portal Block Editor

## Overview
This document summarizes the latest enhancements to the BF6 Portal Block Editor, adding professional UI features, improved user experience, and comprehensive testing.

---

## New Features (November 2025)

### 1. **Visual & Layout Refinements**
- **Horizontal Layout for Logic Chains**: CONDITIONS and ACTIONS now stack horizontally (side-by-side) instead of vertically, matching the Portal editor style.
- **Improved Sidebar**: Sidebar items now render as miniature blocks (using `tk.Canvas`) instead of simple buttons, providing a better visual preview.
- **Color Updates**: ACTIONS blocks are now Yellow (`#FFC107`) to match the official Portal editor.
- **Ghost Placeholders**: "Add Action/Condition" placeholders (+) are now correctly positioned to the right of horizontal chains.

### 2. **Zoom & Navigation Fixes**
- **Zoom Crash Fix**: Fixed a critical issue where zooming caused widgets (inputs/dropdowns) to detach or crash the app.
- **Smoother Dragging**: Optimized drag logic to account for zoom scale, preventing "jumpy" movement when zoomed in.
- **Reset UI**: Added a "Reset UI" button to clear the workspace and restore defaults.
- **Redraw Refresh**: Added a "Refresh" button to force a complete redraw of all blocks if visual glitches occur.

### 3. **Code Preview & Export**
- **Regenerate Code**: Renamed "Apply Code Changes" to "Regenerate Code" to clarify its function (updates the preview from the workspace).
- **Export Options**: The Export button now opens a dialog allowing you to choose between **Workspace JSON** (`.json`) and **Portal Script** (`.txt`) formats.
- **Minimizable Preview**: Fixed the "Live Code Output" pane so it can be properly toggled/minimized.

### 4. **Bug Fixes**
- **Double Spawn**: Fixed an issue where clicking a sidebar item would spawn two blocks.
- **Missing Categories**: Restored visibility of "MOD", "RULES", "CONDITIONS", "ACTIONS", and "EVENTS" in the sidebar.
- **Import Layout**: Fixed import logic to correctly position horizontal blocks.

### 5. **Codebase Refactoring (November 27, 2025)**

- **Modular Architecture**: Split the monolithic `Block_Editor.py` into specialized managers:
  - `Sidebar_Manager.py`: Handles category lists, search, and block spawning menu.
  - `TopBar_Manager.py`: Manages top toolbar (Import/Export, Analyze) and floating zoom controls.
- **Reduced Complexity**: Significantly reduced the size of `Block_Editor.py` by delegating UI logic.
- **Improved Maintainability**: Easier to update specific UI components without affecting the core editor logic.

### 6. **UI Polish & Fixes (November 27, 2025)**

- **Window Icon**: Added support for loading `assets/icon.ico` or `assets/icon.png` as the application icon.
- **Dark Title Bar**: Enabled immersive dark mode for the window title bar on Windows 10/11.
- **Grid Redraw Fix**: Fixed an issue where the grid was not redrawing correctly when zooming.
- **Input Handling**: Refactored input logic to `Input_Handler.py` for better separation of concerns.

---

## Previous Improvements

### 1. **Resizable Splitter Between Canvas and Code Pane**
- **Location:** Between canvas workspace and live code output panel
- **Interaction:** Click and drag the vertical separator (middle divider) to resize panels
- **Minimum Width:** 200px for the code pane (prevents collapsing too small)
- **Benefit:** Users can now adjust the workspace vs. preview ratio based on their workflow
- **Implementation:** Uses frame geometry management with mouse event handlers (`on_splitter_press`, `on_splitter_drag`)

### 2. **On-Demand Scrollbars for Canvas**
- **Vertical Scrollbar:** Appears only when content exceeds canvas height
- **Horizontal Scrollbar:** Appears only when content exceeds canvas width
- **Mousewheel Support:** Use mouse wheel to scroll up/down on canvas
- **Auto-Hide:** Scrollbars automatically hide when content fits within view
- **Benefit:** Cleaner interface when scrolling isn't needed; scrollbars available when needed
- **Methods:** `update_scrollbars()`, `on_canvas_scroll()`

### 3. **Grid Snapping for Placed Panels**
- **Grid Size:** 20-pixel grid
- **Snap Threshold:** 12 pixels (brings snapping within 12px of grid line to that grid line)
- **Stacking:** Panels snap to grid, canvas edges, and other placed panels
- **Priority:** Grid snaps first, then edges, then other panels
- **Benefit:** Organized, aligned workspace layout without manual positioning
- **Implementation:** Enhanced `compute_snap_position()` method

### 4. **Right-Click Context Menu for Panel Management**
- **Menu Options:**
  - **Remove Panel:** Delete selected panel from workspace
  - **Details:** Display panel information in a popup window
- **Details Window Shows:**
  - Tab name (ACTIONS, EVENTS, CONDITIONS, RULES, MOD)
  - Action key (internal identifier)
  - X/Y position on canvas
  - Width and height
- **Binding:** Auto-attached to all placed panels and their child widgets
- **Benefit:** Quick panel management without cluttering the UI
- **Methods:** `show_panel_context_menu()`, `remove_panel()`, `show_panel_details()`

---

## Code Organization Improvements

### New Module: `editor_helpers.py`
Extracted helper functions to keep main UI file clean:
- `get_dropdown_items(block_data, tab_name)` - Flattens JSON data for dropdown population
- `update_code_output(editor)` - Updates live code preview pane

### Main File: `Block_Editor.py`
Refactored with new methods:
- `on_splitter_press()` / `on_splitter_drag()` - Splitter resize logic
- `update_scrollbars()` - Manages conditional scrollbar visibility
- `on_canvas_scroll()` - Mouse wheel scrolling
- `show_panel_context_menu()` - Right-click menu
- `remove_panel()` - Panel deletion
- `show_panel_details()` - Details popup

---

## Testing

### Unit Tests: `tests/test_editor_helpers.py`
Comprehensive test suite with 11 tests covering:

#### `TestGetDropdownItems` (6 tests)
- Empty block data
- Simple flat structures
- Nested subcategories (like AI actions)
- Missing tabs
- Conditions tab
- Deeply nested structures
- Return type validation

#### `TestUpdateCodeOutput` (5 tests)
- No placed panels
- Single placed panel
- Multiple placed panels
- Code output formatting
- Output contains expected data

**Run Tests:**
```powershell
cd "d:\=Code=\BF6-Portal-Block-Editor\bf6-portal-block-editor"
python -m unittest tests.test_editor_helpers -v
```

**Current Status:** ✅ All 11 tests passing

---

## Updated UI Layout

```
┌─────────────────────────────────────────────┐
│        Top Bar (Icons, Export)              │
├─────────────────────────────────────┬───────┤
│                                     │▌      │
│     Canvas (Workspace)              │ Code  │
│     - Grid snapping                 │ Pane  │
│     - Placed panels                 │ (Live │
│     - Scrollbars (on-demand)        │ Output)
│                                     │       │
└─────────────────────────────────────┴───────┘
```

---

## Usage Guide

### Resizing Code Pane
1. Locate the vertical separator between canvas and code pane
2. Cursor changes to resize cursor (↔)
3. Click and drag left/right to resize
4. Minimum width: 200px

### Grid Snapping
1. Drag panels on canvas
2. Position near grid lines (every 20px)
3. When within 12px of grid line, panel snaps to alignment
4. Panels also snap to edges and other panels

### Managing Placed Panels
1. Right-click on a placed panel
2. Choose:
   - **Remove Panel** - Delete from workspace
   - **Details** - View panel information popup

### Scrolling Canvas
1. Position mouse over canvas
2. Scroll mouse wheel up/down
3. Scrollbars appear automatically if content exceeds view

---

## Performance Notes

- **Scrollbar Management:** Updated only when needed (avoids constant recalculation)
- **Grid Snapping:** Uses threshold-based snapping (efficient)
- **Context Menus:** Created on-demand, destroyed after use
- **Memory:** Test suite runs with minimal overhead; 11 tests execute in ~4ms

---

## Backwards Compatibility

✅ All previous features maintained:
- Drag/drop dropdowns
- Color palette system
- Live code preview
- Block chaining logic
- Export functionality
- Close behavior fix (sys.exit instead of blocking input)

---

## Files Modified/Created

### Modified
- `source/Block_Editor.py` - Added new UI features and methods
- `tests/test_editor_helpers.py` - Fixed test cases to match actual implementation

### Created
- `tests/test_editor_helpers.py` - Comprehensive unit test suite
- `IMPROVEMENTS.md` - This documentation file

---

## Future Enhancement Ideas

1. **Keyboard Shortcuts**
   - Delete key to remove selected panel
   - Ctrl+C/Ctrl+V for copy/paste panels
   - Arrow keys for fine-position adjustment

2. **Advanced Snapping**
   - Snap to alignment guides (visual guides when positioning)
   - Magnetic snapping (smoother alignment)

3. **Panel Grouping**
   - Select multiple panels
   - Group/ungroup with locking

4. **Undo/Redo**
   - Action history tracking
   - Revert recent changes

5. **Customizable Grid**
   - User-adjustable grid size
   - Toggle grid visibility

---

## Commit History

All changes have been committed to the `main` branch with descriptive messages documenting each feature addition.

---

**Last Updated:** November 26, 2025

---

## Recent Updates (November 26, 2025)

### Added Dropdown Support for Additional Block Categories

Extended the dropdown menu system to support all block categories with sub-menus:

**New Dropdown Categories Added:**
- **VALUES** - Editable value blocks (Number, String, Boolean, Variables)
- **LOGIC** - Logic operations
- **MATH** - Mathematical operations  
- **ARRAYS** - Array manipulation
- **PLAYER** - Player-related blocks
- **GAMEPLAY** - Gameplay mechanics
- **TRANSFORM** - Transform/vector blocks

**Implementation Details:**
- Updated `dropdown_states` dict to include all 11 categories (was only 3)
- Modified `on_tab_click()` to handle dropdown toggles for all categories
- Existing `get_dropdown_items()` helper already handles nested sub-category structures

**Files Modified:**
- `source/Block_Editor.py` - Added dropdown support for VALUES, LOGIC, MATH, ARRAYS, PLAYER, GAMEPLAY, TRANSFORM

### Code Cleanup

**Removed Unused Imports:**
- Commented out `Snap_Handler` import - not used in Portal-style block system
- Snap points are not created; blocks connect via proximity detection
- Snap_Handler.py file retained for reference but is inactive

**Notes on Architecture:**
- Portal-style blocks DO NOT use visible snap points/handles
- Connection logic handled in Block_Mover via proximity detection
- No snap handles/receptors are created during block drawing
- This matches authentic Battlefield Portal editor behavior

---
