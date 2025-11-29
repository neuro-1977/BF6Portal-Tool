# Sidebar Layout (v1.0.5-beta)

The left sidebar is currently a placeholder in the BF6Portal Tool web UI (v1.0.5-beta). Block categories (MOD, RULES, ACTIONS, etc.) will be restored in a future update as part of the Blockly toolbox integration.
## Planned Categories

- MOD
- RULES
- ACTIONS
- LOGIC
- MATH
- CONDITIONS
- EVENTS
- PLAYER
- OBJECTIVE
- UI
- AUDIO
- CAMERA
- EFFECTS
- EMPLACEMENTS
- GAMEPLAY
- TRANSFORM
- VALUES
- VEHICLES
- ARRAYS
- AI

See [ui_mockup.svg](ui_mockup.svg) for the current placeholder layout.
## Version 1.0.5-beta Note

In this version, the left menu is a placeholder. Full block categories and toolbox integration will be restored in a future update.
# Portal-Style Left Sidebar Layout

## Overview

The editor now uses a **left sidebar layout** matching Battlefield Portal's actual interface design. This resolves the horizontal menu overflow issue and provides unlimited vertical space for all block categories.

## Layout Structure

### Before (Top Bar Menu)
```
┌─────────────────────────────────────────────────────────────┐
│ [MOD] [RULES] [EVENTS] [CONDITIONS] [ACTIONS] ... [OVERFLOW]│ ← 13+ categories cramped
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                   Canvas Area                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### After (Left Sidebar)
```
┌──────┬──────────────────────────────────────────────────────┐
│ CATEG│ [Active Tab] [Import] [Export] [Zoom]               │ ← Minimal top bar
├──────┼──────────────────────────────────────────────────────┤
│ MOD  │                                                      │
│ RULES│                                                      │
│ EVENT│                Canvas Area                           │
│ COND │                (More Space!)                         │
│ ACTIO│                                                      │
│ VALUE│                                                      │
│ LOGIC│                                                      │
│ MATH │                                                      │
│ ARRAY│                                                      │
│ PLAYE│                                                      │
│ GAMEP│                                                      │
│ TRANS│                                                      │
│ SUBRO│                                                      │
│  ▼   │                                                      │ ← Scrollable
└──────┴──────────────────────────────────────────────────────┘
  200px   Remainder of screen width
```

## Key Improvements

### 1. **No More Overflow**
- All 13+ categories fit comfortably in vertical space
- Scrollable sidebar handles unlimited categories
- No cramped buttons or tiny fonts

### 2. **Matches Portal Design**
- Portal's actual interface uses left sidebar
- Professional, industry-standard layout
- Familiar to Portal users

### 3. **Better Screen Usage**
- Canvas gets more horizontal width (critical for complex block chains)
- Top bar reduced from 70px to 50px
- More workspace area overall

### 4. **Extensibility**
- Easy to add new categories (AI, AUDIO, CAMERA, EFFECTS, etc.)
- Can add collapsible sections in future
- Room for category icons/badges

## Technical Implementation

### New Constants
```python
self.SIDEBAR_WIDTH = 200      # Left sidebar width
self.TOP_BAR_HEIGHT = 50      # Reduced from 70px
```

### Layout Hierarchy
```
master (root window)
├── top_bar_frame (50px height)
│   ├── active_tab_label (left)
│   ├── import_btn (right)
│   ├── export_btn (right)
│   └── zoom_controls (right)
└── main_container (fills remainder)
    ├── sidebar_frame (200px width, left side)
    │   ├── title_label ("BLOCK CATEGORIES")
    │   └── canvas_sidebar (scrollable)
    │       └── sidebar_content
    │           ├── MOD button
    │           ├── RULES button
    │           ├── EVENTS button
    │           └── ... (all categories)
    └── canvas_frame (fills remainder, right side)
        └── canvas (workspace)
```

### Category Buttons
- **Size**: Full width (200px) x 40px height
- **Spacing**: 4px horizontal padding, 2px vertical padding
- **Colors**: Match Portal block colors
- **Font**: Arial 9pt bold
- **Cursor**: Hand pointer on hover
- **Scrollable**: Vertical scrollbar when needed

## Portal JSON Compatibility

The editor's block structure already matches Portal's JSON format:

### Portal JSON Structure (from custom_conquest_template_7.2.json)
```json
{
  "blocks": {
    "block_1": {
      "type": "MOD",
      "label": "Custom Conquest",
      "x": 10,
      "y": 10,
      "nested_in": null,
      "next": "block_2"
    },
    "block_2": {
      "type": "RULES",
      "label": "OnGameStart",
      "nested_in": "block_1",
      "condition_blocks": ["block_3"],
      "action_blocks": ["block_4", "block_5"]
    }
  }
}
```

### Our Implementation Supports
✅ **Nesting relationships**: `nested_in`, `nested_in_action_area`, `nested_in_condition_area`  
✅ **Sequential chains**: `next`, `previous` relationships  
✅ **C-shaped containers**: MOD, RULES, SUBROUTINE, C_SHAPED blocks  
✅ **Parameter slots**: VALUE blocks can nest in parameter inputs  
✅ **Dynamic resizing**: C-blocks grow/shrink based on contents  
✅ **Position preservation**: Exact x,y coordinates maintained  

## Block Intersection Detection

The codebase already has robust intersection logic:

### Snap Detection (`Block_Mover.py`)
- **Proximity check**: 50px snap range (configurable)
- **Type validation**: `BlockHierarchy.can_nest_inside(child, parent)`
- **Boundary detection**: `BlockHierarchy.is_inside_c_block()`
- **Receptor positioning**: C-blocks create drop zones for children

### Nesting Rules (`block_hierarchy.py`)
```python
CONNECTION_RULES = {
    'MOD': ['RULES'],
    'RULES': ['ACTIONS', 'SUBROUTINE', 'EVENTS'],
    'SUBROUTINE': ['ACTIONS', 'CONDITIONS'],
    'C_SHAPED': ['ACTIONS', 'LOGIC'],
}
```

### Visual Feedback
- **During drag**: Potential targets highlight when in range
- **On drop**: Blocks snap to proper position
- **Parameter slots**: VALUE blocks highlight when near inputs
- **C-block opening**: Right side is open for nesting

## Future Enhancements

### Collapsible Sections (Planned)
```
▼ CORE
  ├─ MOD
  ├─ RULES
  ├─ EVENTS
  └─ CONDITIONS

▼ LOGIC & VALUES
  ├─ VALUES
  ├─ LOGIC
  ├─ MATH
  └─ ARRAYS

▶ GAMEPLAY (collapsed)

▼ ADVANCED
  └─ SUBROUTINE
```

### Category Icons (Optional)
- Add small icons next to category names
- Visual differentiation for quick scanning
- Color-coded badges for block types

### Search/Filter (Future)
- Quick search bar at top of sidebar
- Filter categories by name
- Jump to specific block type

## Testing the New Layout

1. **Launch editor**: `python source/Block_Editor.py`
2. **Verify sidebar**: All 13 categories visible on left
3. **Test scrolling**: Scroll sidebar if many categories
4. **Test canvas**: More horizontal space available
5. **Test block spawning**: Click sidebar categories to spawn blocks
6. **Test nesting**: Drag blocks into C-shaped containers
7. **Import Portal JSON**: Use Import button to load Portal workspace

## Portal JSON Import Guide

To test with the provided Portal JSON:

1. Click **Import JSON** button (top right)
2. Select `custom_conquest_template_7.2.json`
3. Editor will:
   - Parse block definitions
   - Restore nesting relationships
   - Position blocks at saved coordinates
   - Rebuild parent-child chains
   - Create all widgets and connections

The existing `workspace_loader.py` already handles:
- StringVar restoration for editable fields
- Dynamic block definition registration
- Nested relationship rebuilding
- Chain reconstruction (next/previous)
- Position and dimension restoration

## Summary

✅ **Menu overflow fixed**: Left sidebar provides unlimited vertical space  
✅ **Portal-style layout**: Matches actual Battlefield Portal interface  
✅ **More workspace**: Canvas gets maximum horizontal width  
✅ **Professional design**: Industry-standard sidebar navigation  
✅ **Extensible**: Easy to add more categories  
✅ **Portal JSON compatible**: Existing import/export works with Portal format  
✅ **Robust nesting**: Comprehensive block intersection and hierarchy system  

The editor now has a clean, professional layout that scales to any number of categories while providing ample workspace for complex block structures.
