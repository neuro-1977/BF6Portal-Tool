"""
LEGACY RENDERER (Tkinter)
-------------------------
Part of the legacy Python/Tkinter editor.
"""

import tkinter as tk
from block_shapes import BlockShapes
from tkinter import ttk
import math

class BlockRenderer:
    """
    Handles the visual rendering of blocks on the canvas.
    """
    def __init__(self, editor):
        self.editor = editor
        self.canvas = editor.canvas
        self.CHILD_BLOCK_WIDTH = editor.CHILD_BLOCK_WIDTH
        self.CHILD_BLOCK_HEIGHT = editor.CHILD_BLOCK_HEIGHT

    def draw_grid(self):
        """Draw a background grid on the canvas based on current zoom.

        Grid lines are tagged with 'grid' so they can be cleared/redrawn.
        """
        try:
            canvas = self.canvas
            # remove old grid lines
            try:
                canvas.delete("grid")
            except Exception:
                pass

            # Compute visible area - use full scrollregion to cover entire canvas
            scrollregion = canvas.cget("scrollregion")
            if scrollregion:
                coords = [float(x) for x in scrollregion.split()]
                left, top, right, bottom = coords[0], coords[1], coords[2], coords[3]
            else:
                # Fallback to visible area
                left = canvas.canvasx(0)
                top = canvas.canvasy(0)
                right = canvas.canvasx(canvas.winfo_width())
                bottom = canvas.canvasy(canvas.winfo_height())

            # Base spacing (logical) and effective spacing considering zoom
            base = getattr(self.editor, "BASE_GRID", 20)
            spacing = max(8, base * self.editor.zoom_scale)
            minor_spacing = spacing / 2

            # Start positions aligned to spacing grid
            start_x = (math.floor(left / spacing) * spacing) if spacing else left
            x = start_x
            # Draw minor vertical lines first (lighter)
            minor_color = "#2a2a2a"
            major_color = "#333333"
            while x <= right:
                # minor lines between major ones
                mx = x + minor_spacing
                if mx < right:
                    canvas.create_line(mx, top, mx, bottom, fill=minor_color, width=1, tag="grid")
                # major line
                canvas.create_line(x, top, x, bottom, fill=major_color, width=1, tag="grid")
                x += spacing

            start_y = (math.floor(top / spacing) * spacing) if spacing else top
            y = start_y
            while y <= bottom:
                my = y + minor_spacing
                if my < bottom:
                    canvas.create_line(left, my, right, my, fill=minor_color, width=1, tag="grid")
                canvas.create_line(left, y, right, y, fill=major_color, width=1, tag="grid")
                y += spacing

            # Ensure grid is at the very back
            try:
                canvas.tag_lower("grid")
            except Exception:
                pass
        except Exception:
            pass

    def draw_block(self, block_id):
        """Draws or updates the visual representation of a block."""
        if block_id not in self.editor.all_blocks:
            return

        block = self.editor.all_blocks[block_id]
        x, y = block["x"], block["y"]
        width = block.get("width", self.CHILD_BLOCK_WIDTH)
        height = block.get("height", self.CHILD_BLOCK_HEIGHT)
        block_type = block.get("type", "SEQUENCE")
        color = block.get("color", "#555555")

        # 1. Calculate Polygon Coordinates
        coords = []
        if block_type in ["MOD", "RULES", "SUBROUTINE", "C_SHAPED"]:
            inner_height = block.get("inner_height", 100)
            coords = BlockShapes.get_blockly_container_shape(
                x, y, width, height, inner_height
            )
        elif block_type in ["CONDITIONS", "ACTIONS", "EVENTS"] or block.get("category") == "ACTIONS":
            # Horizontal snapping blocks
            # Check if it's the first block (no left tab) or last block (no right tab)?
            # For now, draw tabs on both sides to indicate connectivity
            coords = BlockShapes.get_horizontal_snap_shape(x, y, width, height)
        elif block_type in ["VALUE", "LOGIC", "MATH", "ARRAYS", "PLAYER", "GAMEPLAY", "TRANSFORM"]:
            coords = BlockShapes.get_blockly_value_shape(x, y, width, height)
        else:
            # Statement blocks (SEQUENCE)
            coords = BlockShapes.get_blockly_statement_shape(
                x, y, width, height
            )

        # 2. Create or Update Canvas Polygon
        if block["canvas_obj"]:
            self.canvas.coords(block["canvas_obj"], *coords)
            self.canvas.itemconfig(block["canvas_obj"], fill=color)
        else:
            block["canvas_obj"] = self.canvas.create_polygon(
                coords,
                fill=color,
                outline="#333333",
                width=1,
                tags=(block_id, "block")
            )

        # 2.5 Draw Header (Portal Style)
        self._draw_block_header(block_id)

        # 3. Draw Snap Indicators (White Borders)
        self._draw_snap_indicators(block_id)
        
        # 3.5 Draw Grip Dots
        self._draw_grip_dots(block_id)

        # 4. Create Widgets (Label, Inputs) if missing
        # OPTIMIZATION: Only create widgets if they don't exist.
        # find_withtag is relatively fast, but creating widgets is slow.
        if not self.canvas.find_withtag(f"{block_id} && widget_window"):
            self._create_block_widgets(block_id)
        else:
            # If widgets exist, we might need to update their position?
            # update_block_position handles moving the window item.
            # But we might need to update the text if label changed?
            pass

        # 5. Raise to top
        # OPTIMIZATION: Don't raise on every single draw call if we are batch loading.
        # But we don't know if we are batch loading here.
        # Maybe only raise if it's the selected block?
        # For now, keep it but be aware it's an O(N) operation in some canvas implementations.
        self.canvas.tag_raise(block["canvas_obj"])
        # Raise ghosts just above block background
        for tag in self.canvas.find_withtag(f"ghost_{block_id}"):
            self.canvas.tag_raise(tag)
        self.canvas.tag_raise(f"{block_id} && widget_window")

    def clear_snap_feedback(self):
        """Clears any active snap feedback indicators."""
        self.canvas.delete("snap_feedback")

    def show_snap_feedback(self, target_id, snap_type, is_valid=True):
        """Draws a visual indicator for a potential snap target.
        
        Args:
            target_id: The ID of the block being snapped to.
            snap_type: The type of connection ('previous', 'next', 'input', 'horizontal').
            is_valid: Whether the snap is allowed (affects color).
        """
        self.clear_snap_feedback()
        
        if target_id not in self.editor.all_blocks:
            return
            
        target = self.editor.all_blocks[target_id]
        x, y = target["x"], target["y"]
        width = target.get("width", self.CHILD_BLOCK_WIDTH)
        height = target.get("height", self.CHILD_BLOCK_HEIGHT)
        
        color = "#4CAF50" if is_valid else "#F44336" # Green vs Red
        width_px = 2 if is_valid else 3
        
        if snap_type == "next":
            # Line at bottom
            self.canvas.create_line(
                x, y + height, x + width, y + height,
                fill=color, width=width_px, tags="snap_feedback"
            )
        elif snap_type == "previous" or snap_type == "statement_input":
            # Line at top (or inside container)
            # For statement input, we might need more specific coords
            # But usually it snaps to the "bottom" of the header or previous block
            # If it's a container input, it's inside.
            # We'll just highlight the bottom of the header for now if we can infer it
            header_height = 22 if target.get("type") == "MOD" else 35
            self.canvas.create_line(
                x + 20, y + header_height, x + width - 20, y + header_height,
                fill=color, width=width_px, tags="snap_feedback"
            )
        elif snap_type == "horizontal":
            # Line at right edge
            self.canvas.create_line(
                x + width, y, x + width, y + height,
                fill=color, width=width_px, tags="snap_feedback"
            )
        elif snap_type == "value_input":
            # Highlight the parameter slot?
            # We'll just highlight the whole block border for now
            self.canvas.create_rectangle(
                x - 2, y - 2, x + width + 2, y + height + 2,
                outline=color, width=width_px, tags="snap_feedback"
            )

    def _draw_block_header(self, block_id):
        """Draws a visual header separator for container blocks."""
        block = self.editor.all_blocks[block_id]
        block_type = block.get("type", "SEQUENCE")
        
        if block_type not in ["MOD", "RULES", "SUBROUTINE", "EVENTS", "CONDITIONS", "ACTIONS"]:
            return

        self.canvas.delete(f"header_{block_id}")
        
        x, y = block["x"], block["y"]
        width = block.get("width", self.CHILD_BLOCK_WIDTH)
        
        header_height = 45 # Default
        if block_type == "RULES":
            header_height = 35
        elif block_type == "MOD":
            header_height = 25 # Thinner header for "wrapper" look
        elif block_type in ["CONDITIONS", "ACTIONS"]:
            header_height = 30

        # Draw a subtle separator line to define the header area
        self.canvas.create_line(
            x + 4, y + header_height, 
            x + width - 4, y + header_height,
            fill="#333333", 
            width=1,
            tags=(f"header_{block_id}", block_id)
        )
        
        # Add a "gloss" highlight at the top
        self.canvas.create_line(
            x + 5, y + 2, 
            x + width - 5, y + 2,
            fill="white", 
            width=1, 
            stipple="gray25",
            tags=(f"header_{block_id}", block_id)
        )

    def _draw_snap_indicators(self, block_id):
        """Draws white borders on snap edges as requested."""
        block = self.editor.all_blocks[block_id]
        block_type = block.get("type", "SEQUENCE")
        x, y = block["x"], block["y"]
        width = block.get("width", self.CHILD_BLOCK_WIDTH)
        height = block.get("height", self.CHILD_BLOCK_HEIGHT)
        
        self.canvas.delete(f"snap_{block_id}")
        
        # Horizontal Snapping Blocks (Actions/Conditions/Values)
        if block_type in ["CONDITIONS", "ACTIONS", "EVENTS", "VALUE", "LOGIC", "MATH", "ARRAYS", "PLAYER", "GAMEPLAY", "TRANSFORM"] or block.get("category") == "ACTIONS":
            # Draw white bracket on LEFT edge (Input)
            # A simple vertical line with small horizontal ticks
            self.canvas.create_line(
                x + 2, y + 4,
                x + 2, y + height - 4,
                fill="white",
                width=2,
                tags=(f"snap_{block_id}", block_id)
            )
            
        # Vertical Snapping Blocks (Sequence)
        elif block_type == "SEQUENCE":
            # Draw white line on TOP edge (Previous)
            self.canvas.create_line(
                x + 4, y + 2,
                x + width - 4, y + 2,
                fill="white",
                width=2,
                tags=(f"snap_{block_id}", block_id)
            )

    def _draw_grip_dots(self, block_id):
        """Draws 3 vertical dots on the left side as a grip handle."""
        block = self.editor.all_blocks[block_id]
        x, y = block["x"], block["y"]
        height = block.get("height", self.CHILD_BLOCK_HEIGHT)
        
        self.canvas.delete(f"grip_{block_id}")
        
        # Center vertically
        cy = y + height / 2
        dot_spacing = 5
        dot_x = x + 8 # Indent slightly
        
        for i in range(-1, 2): # -1, 0, 1
            dy = i * dot_spacing
            self.canvas.create_oval(
                dot_x - 1, cy + dy - 1,
                dot_x + 1, cy + dy + 1,
                fill="#AAAAAA",
                outline="",
                tags=(f"grip_{block_id}", block_id)
            )

    def _draw_ghost_placeholders(self, block_id):
        """
        Deprecated: Ghost placeholders removed as requested.
        Kept empty to prevent errors if called.
        """
        pass

    def _create_block_widgets(self, block_id):
        """Creates the Tkinter widgets (Label, Entry, Dropdowns) for a block."""
        block = self.editor.all_blocks[block_id]
        
        # Container frame for widgets
        frame = tk.Frame(self.canvas, bg=block.get("color", "#555555"))
        
        # Check for custom widget definitions (from JSON)
        widgets_def = block.get("widgets", {})
        
        # Determine argument keys (Portal style 'inputs' or legacy 'args')
        arg_keys = []
        if "inputs" in block and block["inputs"]:
            arg_keys = list(block["inputs"].keys())
        elif "args" in block:
            if isinstance(block["args"], list):
                arg_keys = block["args"]
            elif isinstance(block["args"], dict):
                arg_keys = list(block["args"].keys())
        
        # If no custom widgets, use default label and render args
        if not widgets_def:
            # Main Label
            label_text = block.get("label", block.get("type", "Block"))
            lbl = tk.Label(
                frame, 
                text=label_text, 
                bg=block.get("color", "#555555"), 
                fg="white",
                font=("Arial", 9, "bold")
            )
            lbl.pack(side="left", padx=5)
            self._bind_drag_events(lbl, block_id)
            
            # Render Arguments (Inputs)
            if arg_keys:
                # Container for args to keep them neat
                args_frame = tk.Frame(frame, bg=block.get("color", "#555555"))
                args_frame.pack(side="left", padx=5)
                self._bind_drag_events(args_frame, block_id)
                
                for arg in arg_keys:
                    # Get label and icon
                    label_text = block.get("param_labels", {}).get(arg, arg)
        else:
            # Render custom widgets
            # First, render the main label if it exists (usually "RULE" or similar)
            main_label = block.get("label", "BLOCK")
            lbl = tk.Label(
                frame, 
                text=main_label, 
                bg=block.get("color", "#555555"), 
                fg="white",
                font=("Arial", 10, "bold")
            )
            lbl.pack(side="left", padx=(5, 10))
            self._bind_drag_events(lbl, block_id)

            # Iterate through defined widgets
            for key, widget_info in widgets_def.items():
                w_type = widget_info.get("type")
                
                if w_type == "text_input":
                    # Editable text field (Entry) styled to look like a label
                    default_val = widget_info.get("default", "")
                    var = tk.StringVar(value=default_val)
                    
                    # Store var in block for access
                    if "widget_vars" not in block:
                        block["widget_vars"] = {}
                    block["widget_vars"][key] = var
                    
                    entry = tk.Entry(
                        frame,
                        textvariable=var,
                        bg="#222222", # Dark input background
                        fg="white",
                        insertbackground="white", # White cursor
                        font=("Arial", 9),
                        relief="flat",
                        width=15
                    )
                    entry.pack(side="left", padx=2, ipady=2) # ipady for height
                    # Don't bind drag events to entry so user can select text
                    
                elif w_type == "dropdown":
                    # Combobox
                    options = widget_info.get("options", [])
                    default_val = widget_info.get("default", options[0] if options else "")
                    var = tk.StringVar(value=default_val)
                    
                    if "widget_vars" not in block:
                        block["widget_vars"] = {}
                    block["widget_vars"][key] = var
                    
                    combo = ttk.Combobox(
                        frame,
                        textvariable=var,
                        values=options,
                        state="readonly",
                        width=10,
                        font=("Arial", 8)
                    )
                    combo.pack(side="left", padx=5)
                    # Bind combo selection to prevent drag start?
                    
        self._bind_drag_events(frame, block_id)

        # Add to canvas
        window_id = self.canvas.create_window(
            block["x"] + 5, 
            block["y"] + 5, 
            window=frame, 
            anchor="nw", 
            tags=(block_id, "widget_window", f"widget_window_{block_id}")
        )
        
        # Store reference to widgets
        block["widgets_window"] = window_id
        block["widget_frame"] = frame

    def _bind_drag_events(self, widget, block_id):
        """Helper to bind drag events to a widget."""
        if hasattr(self.editor, 'input_handler') and self.editor.input_handler:
            widget.bind("<ButtonPress-1>", lambda e, bid=block_id: self.editor.input_handler.on_block_press(e, bid))
            widget.bind("<ButtonRelease-1>", lambda e, bid=block_id: self.editor.input_handler.on_block_release(e, bid))
            widget.bind("<B1-Motion>", lambda e, bid=block_id: self.editor.input_handler.on_block_drag(e, bid))
            widget.bind("<Button-3>", lambda e, bid=block_id: self.editor.input_handler.show_block_context_menu(e, bid))

    def update_block_position(self, block_id):
        """Updates the position of a block and its associated canvas objects/widgets."""
        if block_id not in self.editor.all_blocks:
            return
            
        block = self.editor.all_blocks[block_id]
        x, y = block["x"], block["y"]
        
        # Update polygon shape/position
        self.draw_block(block_id)
        
        # Update widget window position
        # Note: find_withtag with logical operators like && is not supported in standard Tkinter
        # We should search by the specific tag we assigned
        widget_window_ids = self.canvas.find_withtag(f"widget_window_{block_id}")
        if widget_window_ids:
            # Scale offset by zoom
            offset = 5 * self.editor.zoom_scale
            self.canvas.coords(widget_window_ids[0], x + offset, y + offset)
            self.canvas.tag_raise(widget_window_ids[0])

    def update_widget_position(self, block_id):
        """Updates only the widget window position for a block."""
        if block_id not in self.editor.all_blocks:
            return
            
        block = self.editor.all_blocks[block_id]
        x, y = block["x"], block["y"]
        
        widget_window_ids = self.canvas.find_withtag(f"widget_window_{block_id}")
        if widget_window_ids:
            # Scale offset by zoom
            offset = 5 * self.editor.zoom_scale
            self.canvas.coords(widget_window_ids[0], x + offset, y + offset)
            self.canvas.tag_raise(widget_window_ids[0])

