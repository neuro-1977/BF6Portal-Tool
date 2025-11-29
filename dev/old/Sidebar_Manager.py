import tkinter as tk
from tkinter import ttk
from block_shapes import BlockShapes

class SidebarManager:
    """
    Manages the left sidebar of the editor, including the category list,
    search bar, and the expandable dropdown panel for block selection.
    """
    def __init__(self, editor):
        self.editor = editor
        self.sidebar_frame = None
        self.sidebar_content = None
        self.dropdown_panel = None
        self.sidebar_list_container = None
        self.search_var = None
        self.tab_buttons = {}
        self.dropdown_visible = False
        self.current_dropdown_tab = None
        self.icon_cache = {} # Cache for loaded PhotoImages
        
        # Use editor's constants if available, else defaults
        self.SIDEBAR_WIDTH = getattr(editor, 'SIDEBAR_WIDTH', 120)

    def setup_sidebar(self, parent):
        """Sets up the left sidebar with category buttons and the dropdown panel."""
        self.sidebar_frame = tk.Frame(
            parent, bg="#0a0a0a", width=self.SIDEBAR_WIDTH
        )
        self.sidebar_frame.pack(side="left", fill="y")
        self.sidebar_frame.pack_propagate(False)
        
        # Sidebar title
        title_label = tk.Label(
            self.sidebar_frame,
            text="CATEGORIES",
            bg="#0a0a0a",
            fg="#888888",
            font=("Arial", 9, "bold"),
            pady=8
        )
        title_label.pack(fill="x")
        
        # Search Bar
        search_frame = tk.Frame(self.sidebar_frame, bg="#0a0a0a", pady=5)
        search_frame.pack(fill="x", padx=5)
        
        self.search_var = tk.StringVar()
        self.search_var.trace("w", self.on_search_change)
        
        search_entry = tk.Entry(
            search_frame,
            textvariable=self.search_var,
            bg="#222222",
            fg="white",
            insertbackground="white",
            relief="flat",
            font=("Arial", 9)
        )
        search_entry.pack(fill="x", ipady=3)
        
        # Scrollable container for categories
        canvas_sidebar = tk.Canvas(
            self.sidebar_frame,
            bg="#0a0a0a",
            highlightthickness=0
        )
        """
        """Animates the width of the dropdown panel."""
        current_width = start_width
        step = 20 if end_width > start_width else -20
        delay = 10 # ms

        def step_animation():
            nonlocal current_width
            current_width += step

            if (step > 0 and current_width >= end_width) or \
               (step < 0 and current_width <= end_width):
                current_width = end_width # Snap to final width
                self.dropdown_panel.place(width=current_width)
                if current_width == 0:
                    self.dropdown_panel.place_forget() # Hide completely when collapsed
                return

            self.dropdown_panel.place(width=current_width)
            self.editor.master.after(delay, step_animation)

        step_animation()

    def create_category_buttons(self):
        """Creates the category buttons in the sidebar."""
        self.tab_buttons = {}
        # Grouped categories with representative block type for icon
        # Updated to match web UI toolbox.js structure and colors
        official_categories = [
            ("Core", "#333333", "mod_shape", "white", "Core"),
            ("ACTIONS", "#f7c843", "action_shape", "#222", "Actions"),
            ("CONDITIONS", "#3bb273", "condition_shape", "white", "Logic & Data"),
            ("LOGIC", "#673AB7", "logic_shape", "white", "Logic & Data"),
            ("MATH", "#1976D2", "math_shape", "white", "Logic & Data"),
            ("VALUES", "#0288D1", "value_shape", "white", "Logic & Data"),
            ("ARRAYS", "#0097A7", "array_shape", "white", "Logic & Data"),
            ("PLAYER", "#C2185B", "player_shape", "white", "World"),
            ("VEHICLES", "#E64A19", "vehicle_shape", "white", "World"),
            ("GAMEPLAY", "#5D4037", "gameplay_shape", "white", "World"),
            ("OBJECTIVE", "#F9A825", "objective_shape", "#222", "World"),
            ("EMPLACEMENTS", "#8D6E63", "emplacement_shape", "#222", "World"),
            ("USER INTERFACE", "#607D8B", "ui_shape", "white", "Presentation"),
            ("AUDIO", "#455A64", "audio_shape", "white", "Presentation"),
            ("CAMERA", "#37474F", "camera_shape", "white", "Presentation"),
            ("EFFECTS", "#263238", "effects_shape", "white", "Presentation"),
            ("TRANSFORM", "#212121", "transform_shape", "white", "Presentation"),
            ("AI", "#333333", "ai_shape", "white", "Other"),
            ("OTHER", "#9E9E9E", "other_shape", "white", "Other")
        ]

        last_group = None
        # Group categories by group name
        from collections import OrderedDict
        group_map = OrderedDict()
        for cat_name, cat_color, icon_shape, text_fg, group in official_categories:
            if group not in group_map:
                group_map[group] = []
            group_map[group].append((cat_name, cat_color, icon_shape, text_fg))

        for group, cats in group_map.items():
            # Draw colored separator (not expandable, no arrow)
            sep = tk.Frame(self.sidebar_content, bg="#232323", height=18)
            sep.pack(fill="x", pady=(8, 0))
            sep.pack_propagate(False)
            icon_canvas = tk.Canvas(sep, width=22, height=16, bg="#232323", highlightthickness=0, bd=0)
            icon_canvas.pack(side="left", padx=(6, 2), pady=1)
            # Draw group icon (use MOD, ACTIONS, CONDITIONS, PLAYER, UI, AI shapes)
            if group == "Core":
                shape_coords = BlockShapes.get_blockly_container_shape(2, 2, 18, 12, 4)
                icon_color = "#4A4A4A"
            elif group == "Actions":
                shape_coords = BlockShapes.get_blockly_statement_shape(2, 2, 18, 12, top_notch=True, bottom_notch=True)
                icon_color = "#f7c843"
            elif group == "Logic & Data":
                shape_coords = BlockShapes.get_horizontal_snap_shape(2, 2, 18, 12, left_tab=True, right_tab=False)
                icon_color = "#3bb273"
            elif group == "World":
                shape_coords = BlockShapes.get_blockly_statement_shape(2, 2, 18, 12, top_notch=True, bottom_notch=True)
                icon_color = "#f44336"
            elif group == "Presentation":
                shape_coords = BlockShapes.get_blockly_statement_shape(2, 2, 18, 12, top_notch=True, bottom_notch=True)
                icon_color = "#2196f3"
            elif group == "Other":
                shape_coords = BlockShapes.get_blockly_statement_shape(2, 2, 18, 12, top_notch=True, bottom_notch=True)
                icon_color = "#9e9e9e"
            else:
                shape_coords = BlockShapes.get_blockly_statement_shape(2, 2, 18, 12, top_notch=True, bottom_notch=True)
                icon_color = "#888888"
            icon_canvas.create_polygon(shape_coords, fill=icon_color, outline="#333333", width=1)
            group_label = tk.Label(sep, text=group, bg="#232323", fg="#e0e0e0", font=("Arial", 9, "bold"), anchor="w")
            group_label.pack(side="left", padx=(2, 0))
            # Draw all categories in this group
            for cat_name, cat_color, icon_shape, text_fg in cats:
                btn_frame = tk.Frame(self.sidebar_content, bg=cat_color, height=28, cursor="hand2", relief="flat", bd=0)
                btn_frame.pack(fill="x", padx=(8, 8), pady=1)
                btn_frame.pack_propagate(False)
                icon_canvas = tk.Canvas(btn_frame, width=22, height=22, bg=cat_color, highlightthickness=0, bd=0) # Increased height for icon
                icon_canvas.pack(side="left", padx=(2, 2), pady=2)
                
                # --- ICON LOGIC ---
                icon_path_rel = self.editor.data_manager.ICON_PATHS.get(cat_name)
                icon_loaded = False
                if icon_path_rel:
                    try:
                        # Construct absolute path: root_dir / relative_path
                        # BLOCK_DATA_PATH is .../assets. Parent is root.
                        full_icon_path = self.editor.data_manager.BLOCK_DATA_PATH.parent / icon_path_rel
                        
                        if full_icon_path.exists():
                            if cat_name not in self.icon_cache:
                                img = tk.PhotoImage(file=str(full_icon_path))
                                # Resize if too large (simple subsample)
                                if img.width() > 20 or img.height() > 20: 
                                    # Simple resize, assumes square icons. If not, needs more complex scaling.
                                    # Use integer division for subsample
                                    x_scale = img.width() // 20 or 1
                                    y_scale = img.height() // 20 or 1
                                    img = img.subsample(x_scale, y_scale)
                                self.icon_cache[cat_name] = img
                            
                            icon_img = self.icon_cache[cat_name]
                            icon_canvas.create_image(
                                11, 11, # Center in the 22x22 canvas
                                image=icon_img, 
                                anchor="center",
                                tags=("icon", cat_name)
                            )
                            icon_loaded = True
                    except Exception as e:
                        print(f"Error loading icon for {cat_name}: {e}")
                
                if not icon_loaded:
                    # Original block shape drawing fallback
                    if hasattr(BlockShapes, icon_shape):
                        shape_fn = getattr(BlockShapes, icon_shape)
                        shape_coords = shape_fn(2, 2, 18, 14)
                    else:
                        shape_coords = BlockShapes.get_blockly_statement_shape(2, 2, 18, 14, top_notch=True, bottom_notch=True)
                    icon_canvas.create_polygon(shape_coords, fill=cat_color, outline="#333333", width=1)
                
                lbl = tk.Label(btn_frame, text=cat_name, bg=cat_color, fg=text_fg, font=("Arial", 9, "bold"), anchor="w")
                lbl.pack(side="left", fill="both", expand=True, padx=(2, 0))
                btn_frame.bind("<Button-1>", lambda e, n=cat_name: self.on_tab_click(n))
                lbl.bind("<Button-1>", lambda e, n=cat_name: self.on_tab_click(n))
                self.tab_buttons[cat_name] = btn_frame

    def on_tab_click(self, tab_name):
        """Handle tab click - show/hide dropdown panel with items."""
        try:
            self.editor.data_manager.switch_tab_logic(tab_name)
        except Exception:
            pass
        
        # Toggle dropdown visibility
        if self.dropdown_visible and self.current_dropdown_tab == tab_name:
            # Clicking same tab again - hide dropdown
            self.hide_dropdown()
        else:
            # Show dropdown with items for this tab
            self.show_dropdown(tab_name)

    def show_dropdown(self, tab_name):
        """Show the dropdown panel with items for the given category."""
        if not self.dropdown_panel:
            return

        self.current_dropdown_tab = tab_name
        
        # Get category color for border
        color = self.editor.data_manager.palette_color_map.get(tab_name, "#2d2d2d")
        self.dropdown_panel.configure(highlightbackground=color, highlightthickness=2)
        
        # Render items before animation to ensure content is there
        self.render_sidebar_list(tab_name)

        # Start animation if not already visible or animating
        if not self.dropdown_visible:
            self.dropdown_visible = True
            self.dropdown_panel.place(
                x=self.SIDEBAR_WIDTH, 
                y=0, 
                relheight=1.0, 
                width=0 # Start with 0 width
            )
            self.dropdown_panel.lift()
            self._animate_dropdown_width(0, 250) # Animate from 0 to 250
        else:
            # Already visible, just update content and ensure full width
            self.dropdown_panel.place(
                x=self.SIDEBAR_WIDTH, 
                y=0, 
                relheight=1.0, 
                width=250 # Ensure full width if already open
            )

    def hide_dropdown(self):
        """Hide the dropdown panel."""
        if not self.dropdown_panel or not self.dropdown_visible:
            return

        self.dropdown_visible = False
        self.current_dropdown_tab = None
        self._animate_dropdown_width(250, 0) # Animate from 250 to 0

    def render_sidebar_list(self, tab_name, filter_text=None):
        """Render the block items for a category inside the sidebar list container."""
        if not self.sidebar_list_container:
            return

        # Clear previous contents
        for child in self.sidebar_list_container.winfo_children():
            try:
                child.destroy()
            except Exception:
                pass
        
        # Fetch only official category data (no dynamic/legacy blocks)
        cat_data = self.editor.data_manager.block_data.get(tab_name, {})
        sub_cats = cat_data.get("sub_categories", {})
        # Remove any sub-categories or blocks not present in the loaded data
        # (No dynamic/legacy blocks allowed)
        
        color = self.editor.data_manager.palette_color_map.get(tab_name, "#2d2d2d")
        
        # Determine text color based on background brightness (simple heuristic or manual list)
        light_categories = ["ACTIONS", "SUBROUTINE", "EFFECTS", "OBJECTIVE"]
        text_fg = "#000000" if tab_name in light_categories else "white"

        # Main Header
        header = tk.Label(
            self.sidebar_list_container,
            text=f"{tab_name}",
            bg=color,
            fg=text_fg,
            font=("Arial", 11, "bold"),
            anchor="w",
            padx=12,
            pady=8
        )
        header.pack(fill="x")

        if not sub_cats:
             tk.Label(self.sidebar_list_container, text="No items available", bg="#1a1a1a", fg="#888888").pack(pady=10)
             return

        any_items_shown = False

        # Iterate Sub-Categories
        for sub_name, blocks in sub_cats.items():
            # Filter check for sub-category
            sub_matches = filter_text and filter_text in sub_name.lower()
            
            visible_blocks = []
            if isinstance(blocks, dict):
                for block_id, block_def in blocks.items():
                    if not isinstance(block_def, dict): continue
                    label = block_def.get("label", block_id)
                    
                    # Filter check for block
                    if filter_text:
                        if filter_text in label.lower() or filter_text in block_id.lower() or sub_matches:
                            visible_blocks.append((block_id, label))
                    else:
                        visible_blocks.append((block_id, label))
            
            if not visible_blocks:
                continue

            any_items_shown = True

            # Sub-Category Header
            sub_header = tk.Label(
                self.sidebar_list_container,
                text=sub_name,
                bg="#1a1a1a",
                fg="#888888",
                font=("Arial", 8, "bold"),
                anchor="w",
                padx=12,
                pady=4
            )
            sub_header.pack(fill="x", pady=(6, 0))

            # Blocks
            for block_id, label_text in visible_blocks:
                # Use a Canvas to draw the block shape for a better visual preview
                item_height = 34
                item_width = 220
                
                item_canvas = tk.Canvas(
                    self.sidebar_list_container,
                    bg="#1a1a1a",
                    height=item_height,
                    width=item_width,
                    bd=0,
                    highlightthickness=0,
                    cursor="hand2"
                )
                item_canvas.pack(fill="x", padx=8, pady=2)
                
                # Determine shape based on category
                shape_coords = []
                shape_x_offset = 10  # Shift right to show left tabs
                
                if tab_name in ["CONDITIONS", "ACTIONS", "EVENTS"] or tab_name == "ACTIONS":
                     shape_coords = BlockShapes.get_horizontal_snap_shape(shape_x_offset, 0, item_width, item_height, left_tab=True, right_tab=False)
                elif tab_name in ["RULES", "MOD", "SUBROUTINE"]:
                     # Simplified container shape
                     shape_coords = BlockShapes.get_blockly_container_shape(shape_x_offset, 0, item_width, item_height, 10) 
                else:
                     # Standard statement shape
                     shape_coords = BlockShapes.get_blockly_statement_shape(shape_x_offset, 0, item_width, item_height, top_notch=True, bottom_notch=True)

                # Bind clicks to spawn a block
                callback = lambda e, name=tab_name, k=block_id: self.editor.spawn_block_from_sidebar(name, k)

                # Draw the block shape
                item_canvas.create_polygon(
                    shape_coords,
                    fill=color,
                    outline="#333333",
                    width=1,
                    tags=("block", block_id)
                )
                
                # --- Icon Rendering ---
                text_x_offset = shape_x_offset + 10
                
                # Check for icon in theme data
                icon_path_rel = self.editor.data_manager.ICON_PATHS.get(tab_name)
                if icon_path_rel:
                    try:
                        # Construct absolute path: root_dir / relative_path
                        # BLOCK_DATA_PATH is .../assets. Parent is root.
                        full_icon_path = self.editor.data_manager.BLOCK_DATA_PATH.parent / icon_path_rel
                        
                        if full_icon_path.exists():
                            if tab_name not in self.icon_cache:
                                # Load image
                                img = tk.PhotoImage(file=str(full_icon_path))
                                # Resize if too large (simple subsample)
                                if img.width() > 24:
                                    scale = img.width() // 24
                                    if scale > 1:
                                        img = img.subsample(scale)
                                self.icon_cache[tab_name] = img
                            
                            if tab_name in self.icon_cache:
                                icon_img = self.icon_cache[tab_name]
                                item_canvas.create_image(
                                    shape_x_offset + 12, 
                                    item_height/2, 
                                    image=icon_img, 
                                    anchor="center",
                                    tags=("icon", block_id)
                                )
                                text_x_offset += 24 # Shift text over
                                # item_canvas.tag_bind("icon", "<Button-1>", callback) # Removed to prevent double firing
                    except Exception:
                        pass # Fail silently for icons

                # Draw text
                item_canvas.create_text(
                    text_x_offset, item_height/2,
                    text=label_text,
                    fill=text_fg,
                    font=("Arial", 9, "bold"),
                    anchor="w",
                    tags=("text", block_id)
                )
                
                item_canvas.bind("<Button-1>", callback)
                # Removed tag_binds to prevent double-firing events
                # item_canvas.tag_bind("block", "<Button-1>", callback)
                # item_canvas.tag_bind("text", "<Button-1>", callback)
                # item_canvas.tag_bind("icon", "<Button-1>", callback)

        if not any_items_shown:
             tk.Label(self.sidebar_list_container, text="No items found", bg="#1a1a1a", fg="#888888").pack(pady=10)

    def on_search_change(self, *args):
        """Handle search input changes."""
        if not self.search_var:
            return
            
        search_text = self.search_var.get().lower()
        
        # If we have a current tab, filter it
        if self.current_dropdown_tab:
            self.render_sidebar_list(self.current_dropdown_tab, filter_text=search_text)
        elif hasattr(self.editor, 'current_selected_tab') and self.editor.current_selected_tab:
             # If no dropdown is open but we have a selected tab, maybe open it?
             # Or just update the list if it were open.
             # For now, let's just update if open.
             pass