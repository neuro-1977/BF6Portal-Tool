# Block Snapping Logic

This document describes how blocks snap together in the BF6 Portal Block Editor.

## Overview

Blocks snap together using colored snap points that indicate what types of blocks can connect. The color of a snap point matches the color of the block type that can snap to it.

## Snap Point Locations

### MOD Block (Grey C-shape)
- **Purple snap point** on left bar, below "MOD:" label
- **Purpose**: RULES blocks snap here

### RULES Block (Purple W-shape)
On the left bar, from top to bottom:
1. **Blue snap point** - CONDITIONS blocks snap here
2. **Yellow snap point** - ACTIONS blocks snap here  
3. **Brown snap point** (next to yellow) - SUBROUTINE blocks snap here

### CONDITIONS Block (Blue rounded)
- **Green snap point** in center bottom
- **Purpose**: EVENTS blocks snap here

### ACTIONS Block (Yellow/Orange notched)
- **3 Green snap points** horizontally inside the block, after the label text
- **Purpose**: EVENTS blocks snap here (up to 3 events per action)
- **Note**: Block will resize dynamically to accommodate more events

### EVENTS Block (Green rounded)
- **No snap points** - EVENTS are endpoints that only snap TO other blocks

## Snap Rules

### RULES → MOD
- RULES blocks can **only** snap to MOD blocks
- Snap to the **purple** snap point on MOD's left bar
- Can be unsnapped while keeping grouped children

### CONDITIONS → RULES
- CONDITIONS blocks can **only** snap to RULES blocks
- Snap to the **blue** snap point on RULES' left bar

### ACTIONS → RULES  
- ACTIONS blocks can **only** snap to RULES blocks
- Snap to the **yellow** snap point on RULES' left bar

### SUBROUTINE → RULES
- SUBROUTINE blocks can snap to RULES blocks
- Snap to the **brown** snap point on RULES' left bar (next to yellow)
- Can also snap to MOD blocks as a fallback

### EVENTS → CONDITIONS or ACTIONS
- EVENTS blocks can snap to CONDITIONS or ACTIONS blocks
- Snap to **green** snap points
- CONDITIONS: 1 green snap point in center
- ACTIONS: 3 green snap points horizontally spaced

## Visual Feedback

### Hover Effects
- When you hover over a snap point, it lights up with a lighter shade of its color
- Purple → Light purple
- Blue → Light blue
- Yellow → Light yellow
- Brown → Light brown  
- Green → Light green

### Snap Range Highlighting
- While dragging a block, potential snap targets will highlight when you're within range
- The dragged block also highlights when near a valid target
- White outline glow indicates snap range (30px threshold)

## Dynamic Resizing (TODO)

ACTIONS blocks should automatically resize when:
- **Adding events**: Expand to show more green snap points
- **Removing events**: Shrink back to original size

This feature is planned for future implementation.

## Implementation Files

- `Snap_Handler.py` - Creates snap points, handles hover effects
- `Block_Mover.py` - Validates snap connections, positions blocks
- `Block_Editor.py` - Integrates snap logic, handles drag/drop
- `block_hierarchy.py` - Defines valid parent-child relationships

## Color Reference

| Block Type | Color | Hex Code |
|-----------|-------|----------|
| MOD | Grey | #808080 |
| RULES | Purple | #9C27B0 |
| CONDITIONS | Blue | #2196F3 |
| ACTIONS | Yellow | #FFEB3B |
| SUBROUTINE | Brown | #8B4513 |
| EVENTS | Green | #4CAF50 |

## Snap Threshold

- **Distance**: 30 pixels (from drag handle to snap point)
- **Purpose**: Tight control for precise positioning
- **Previous**: Was 80px, reduced for better UX
