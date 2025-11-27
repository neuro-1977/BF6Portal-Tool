import tkinter as tk
from block_shapes import BlockShapes
from tkinter import ttk

class BlockRenderer:
    """
    Handles the visual rendering of blocks on the canvas.
    """
    def __init__(self, editor):
        self.editor = editor
        self.canvas = editor.canvas
        self.CHILD_BLOCK_WIDTH = editor.CHILD_BLOCK_WIDTH
        self.CHILD_BLOCK_HEIGHT = editor.CHILD_BLOCK_HEIGHT

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

        # 3. Draw Ghost Placeholders (if empty container)
        self._draw_ghost_placeholders(block_id)

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

    def _draw_block_header(self, block_id):
        """Draws a visual header separator for container blocks."""
        block = self.editor.all_blocks[block_id]
        block_type = block.get("type", "SEQUENCE")
        
        if block_type not in ["MOD", "RULES", "SUBROUTINE", "EVENTS", "CONDITIONS", "ACTIONS"]:
            return

        self.canvas.delete(f"header_{block_id}")
        
        x, y = block["x"], block["y"]
        width = block.get("width", self.CHILD_BLOCK_WIDTH)
        header_height = 35 if block_type == "RULES" else 45
        if block_type in ["CONDITIONS", "ACTIONS"]:
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

    def _draw_ghost_placeholders(self, block_id):
        """Draws semi-transparent placeholder shapes for empty containers."""
        block = self.editor.all_blocks[block_id]
        
        # Clear existing ghosts
        self.canvas.delete(f"ghost_{block_id}")
        
        # Only for containers
        if block.get("type") not in ["RULES", "CONDITIONS", "ACTIONS"]:
            return

        # Check if empty (no nested blocks)
        has_children = False
        if "nested_blocks" in block and block["nested_blocks"]:
            has_children = True
            
        if has_children:
            return

        x, y = block["x"], block["y"]
        header_height = 35 if block.get("type") == "RULES" else 45
        
        ghosts = []
        
        if block.get("type") == "RULES":
            # Ghost 1: Conditions (Puzzle Slot)
            # Draw "Conditions" label
            self.canvas.create_text(
                x + 10, y + header_height + 20,
                text="Conditions",
                fill="#CCCCCC",
                font=("Arial", 9, "bold"),
                anchor="w",
                tags=(f"ghost_{block_id}", block_id)
            )
            # Draw Ghost Slot
            ghost_width = 80
            ghost_height = 30
            g_x = x + 90
            g_y = y + header_height + 5
            coords = BlockShapes.get_horizontal_snap_shape(g_x, g_y, ghost_width, ghost_height)
            
            self.canvas.create_polygon(
                coords,
                fill="#1a1a1a",
                outline="#0277BD",
                width=1,
                tags=(f"ghost_{block_id}", block_id)
            )
            self.canvas.create_text(
                g_x + ghost_width/2, g_y + ghost_height/2,
                text="Condition...",
                fill="#0277BD",
                font=("Arial", 8, "italic"),
                tags=(f"ghost_{block_id}", block_id)
            )

            # Ghost 2: Actions (Puzzle Slot)
            # Draw "Actions" label
            self.canvas.create_text(
                x + 10, y + header_height + 60,
                text="Actions",
                fill="#CCCCCC",
                font=("Arial", 9, "bold"),
                anchor="w",
                tags=(f"ghost_{block_id}", block_id)
            )
            # Draw Ghost Slot
            g_y2 = y + header_height + 45
            coords2 = BlockShapes.get_horizontal_snap_shape(g_x, g_y2, ghost_width, ghost_height)
            
            self.canvas.create_polygon(
                coords2,
                fill="#1a1a1a",
                outline="#F9A825",
                width=1,
                tags=(f"ghost_{block_id}", block_id)
            )
            self.canvas.create_text(
                g_x + ghost_width/2, g_y2 + ghost_height/2,
                text="Action...",
                fill="#F9A825",
                font=("Arial", 8, "italic"),
                tags=(f"ghost_{block_id}", block_id)
            )
            
        elif block.get("type") == "CONDITIONS":
            ghost_width = 60
            ghost_height = 30
            coords = BlockShapes.get_horizontal_snap_shape(x + 25, y + 35, ghost_width, ghost_height)
            
            self.canvas.create_polygon(
                coords,
                fill="#1a1a1a",
                outline="#2E7D32",
                width=1,
                tags=(f"ghost_{block_id}", block_id)
            )
            self.canvas.create_text(
                x + 25 + ghost_width/2, y + 35 + ghost_height/2,
                text="+",
                fill="#2E7D32",
                font=("Arial", 12, "bold"),
                tags=(f"ghost_{block_id}", block_id)
            )
            
        elif block.get("type") == "ACTIONS":
            ghost_width = 60
            ghost_height = 30
            coords = BlockShapes.get_horizontal_snap_shape(x + 25, y + 35, ghost_width, ghost_height)
            
            self.canvas.create_polygon(
                coords,
                fill="#1a1a1a",
                outline="#F9A825",
                width=1,
                tags=(f"ghost_{block_id}", block_id)
            )
            self.canvas.create_text(
                x + 25 + ghost_width/2, y + 35 + ghost_height/2,
                text="+",
                fill="#F9A825",
                font=("Arial", 12, "bold"),
                tags=(f"ghost_{block_id}", block_id)
            )

    def _create_block_widgets(self, block_id):
        """Creates the Tkinter widgets (Label, Entry, Dropdowns) for a block."""
        block = self.editor.all_blocks[block_id]
        
        # Container frame for widgets
        frame = tk.Frame(self.canvas, bg=block.get("color", "#555555"))
        
        # Check for custom widget definitions (from JSON)
        widgets_def = block.get("widgets", {})
        args_def = block.get("args", [])
        
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
            if args_def:
                # Container for args to keep them neat
                args_frame = tk.Frame(frame, bg=block.get("color", "#555555"))
                args_frame.pack(side="left", padx=5)
                self._bind_drag_events(args_frame, block_id)
                
                for arg in args_def:
                    # Create a visual "socket" or label for the argument
                    # For now, a small label with a distinct background
                    arg_lbl = tk.Label(
                        args_frame,
                        text=arg,
                        bg="#333333", # Darker background for input slot
                        fg="#aaaaaa",
                        font=("Arial", 8),
                        padx=4,
                        pady=1,
                        relief="sunken",
                        bd=1
                    )
                    arg_lbl.pack(side="left", padx=2)
                    self._bind_drag_events(arg_lbl, block_id)

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
            tags=(block_id, "widget_window")
        )
        
        # Store reference to widgets
        block["widgets_window"] = window_id
        block["widget_frame"] = frame

    def _bind_drag_events(self, widget, block_id):
        """Helper to bind drag events to a widget."""
        widget.bind("<ButtonPress-1>", lambda e, bid=block_id: self.editor.on_block_press(e, bid))
        widget.bind("<ButtonRelease-1>", lambda e, bid=block_id: self.editor.on_block_release(e, bid))
        widget.bind("<B1-Motion>", lambda e, bid=block_id: self.editor.on_block_drag(e, bid))
        widget.bind("<Button-3>", lambda e, bid=block_id: self.editor.show_block_context_menu(e, bid))

    def update_block_position(self, block_id):
        """Updates the position of a block and its associated canvas objects/widgets."""
        if block_id not in self.editor.all_blocks:
            return
            
        block = self.editor.all_blocks[block_id]
        x, y = block["x"], block["y"]
        
        # Update polygon shape/position
        self.draw_block(block_id)
        
        # Update widget window position
        widget_window_ids = self.canvas.find_withtag(f"{block_id} && widget_window")
        if widget_window_ids:
            self.canvas.coords(widget_window_ids[0], x + 5, y + 5)
            self.canvas.tag_raise(widget_window_ids[0])

