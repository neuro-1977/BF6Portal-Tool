# Snap Logic (v1.0.5-beta)

The BF6Portal Tool web UI is designed to use snap logic for block connections and alignment on the canvas, leveraging Blockly's built-in snapping system with custom enhancements (pending full restoration).

## How Snapping Will Work

- Blocks can be dragged and snapped to compatible connection points (when enabled)
- The canvas grid will help align blocks
- The recenter button recenters the canvas

## UI Reference

See [CONCEPT_UI.svg](CONCEPT_UI.svg) and [ui_mockup.svg](ui_mockup.svg) for updated visual references.

## Version 1.0.5-beta Note

Snap logic and block connections are pending full restoration of Blockly integration. The current UI reflects the new load order and layout, but snapping is not yet enabled.

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
