This file is being deleted.
---
name: updateUI
description: Update the visual rendering or UI elements
argument-hint: The visual element to change and the desired look
---
Update the UI/Visuals of the Battlefield Portal Editor.

Context:
- The editor uses Tkinter `Canvas` for drawing blocks.
- `Block_Renderer.py` handles the drawing logic.
- `block_shapes.py` handles the geometry/coordinates.
- We aim to replicate the look of the Battlefield 2042 Portal Logic Editor.

**Visual Guidelines (Strict):**
- **Horizontal Snapping**: ACTIONS and CONDITIONS blocks must connect horizontally (side-by-side).
- **Puzzle Shapes**: Horizontal connections use a "Puzzle Piece" style (Tab on left, Socket on right).
- **Vertical Stacking**: Only MOD, RULES, and SEQUENCE blocks stack vertically.
- **Ghost Placeholders**: When dragging a block over a container, show a subtle, semi-transparent "Ghost" of the block in the drop slot.
- **Colors**: Use the specific hex codes defined in `Block_Data_Manager.py` (e.g., Purple for Rules, Yellow for Actions).

Task:
1.  **Design**: Determine the necessary changes to shapes, colors, or widgets.
2.  **Implement**: Update `Block_Renderer.py` (drawing commands) or `block_shapes.py` (coordinates).
3.  **Verify**: Ensure the visual change scales correctly and doesn't break interaction (drag/drop).

Input Variables:
- **Element**: [e.g., "Block Header", "Input Field", "Connector"]
- **Desired Look**: [Description or reference to Portal UI]

Output:
- Code edits to achieve the visual result.
