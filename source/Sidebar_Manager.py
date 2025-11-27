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
        scrollbar = ttk.Scrollbar(
            self.sidebar_frame,
            orient="vertical",
            command=canvas_sidebar.yview
        )
        
        self.sidebar_content = tk.Frame(canvas_sidebar, bg="#0a0a0a")
        self.sidebar_content.bind(
            "<Configure>",
            lambda e: canvas_sidebar.configure(scrollregion=canvas_sidebar.bbox("all"))
        )
        # Ensure the inner window matches the sidebar width so children aren't squashed
        canvas_sidebar.create_window((0, 0), window=self.sidebar_content, anchor="nw", width=self.SIDEBAR_WIDTH)
        canvas_sidebar.configure(yscrollcommand=scrollbar.set, width=self.SIDEBAR_WIDTH)
        
        canvas_sidebar.pack(side="left", fill="y", expand=True)
        scrollbar.pack(side="right", fill="y")
        
        # Build category buttons
        self.create_category_buttons()

        # Create expandable dropdown panel for block items (appears to the right of sidebar)
        self.dropdown_panel = tk.Frame(
            parent,
            bg="#1a1a1a",
            width=250,
            bd=2,
            relief="raised"
        )
        self.dropdown_panel.pack_propagate(False)
        
        # Scrollable container for the dropdown items
        dropdown_canvas = tk.Canvas(
            self.dropdown_panel,
            bg="#1a1a1a",
            highlightthickness=0
        )
        dropdown_scrollbar = ttk.Scrollbar(
            self.dropdown_panel,
            orient="vertical",
            command=dropdown_canvas.yview
        )
        
        self.sidebar_list_container = tk.Frame(dropdown_canvas, bg="#1a1a1a")
        self.sidebar_list_container.bind(
            "<Configure>",
            lambda e: dropdown_canvas.configure(scrollregion=dropdown_canvas.bbox("all"))
        )
        
        dropdown_canvas.create_window((0, 0), window=self.sidebar_list_container, anchor="nw", width=246)
        dropdown_canvas.configure(yscrollcommand=dropdown_scrollbar.set)
        
        dropdown_canvas.pack(side="left", fill="both", expand=True)
        dropdown_scrollbar.pack(side="right", fill="y")
        
        # Expose sidebar_list_container to editor if needed (legacy support)
        self.editor.sidebar_list_container = self.sidebar_list_container
        self.editor.dropdown_panel = self.dropdown_panel

    def create_category_buttons(self):
        """Creates the category buttons in the sidebar."""
        self.tab_buttons = {}
        image_data = self.editor.data_manager.get_image_data()
        
        def create_category_btn(cat_name, cat_color, label_text=None, is_sub=False):
            if label_text is None:
                label_text = cat_name
                
            # Indent sub-items
            pad_left = 20 if is_sub else 6
            
            btn_frame = tk.Frame(
                self.sidebar_content,
                bg=cat_color,
                height=30,
                cursor="hand2",
                relief="raised",
                bd=1
            )
            btn_frame.pack(fill="x", padx=(pad_left, 6), pady=1)
            btn_frame.pack_propagate(False)
            
            text_fg = "#000000" if cat_name == "ACTIONS" else "white"
            
            lbl = tk.Label(
                btn_frame,
                text=label_text,
                bg=cat_color,
                fg=text_fg,
                font=("Arial", 8, "bold"),
                anchor="w" if is_sub else "center",
                padx=6 if is_sub else 0
            )
            lbl.pack(fill="both", expand=True)
            
            # Bind click events
            btn_frame.bind("<Button-1>", lambda e, n=cat_name: self.on_tab_click(n))
            lbl.bind("<Button-1>", lambda e, n=cat_name: self.on_tab_click(n))
            
            self.tab_buttons[cat_name] = btn_frame
        
        for name, color in image_data.items():
            create_category_btn(name, color)

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
        self.dropdown_visible = True
        
        # Get category color for border
        color = self.editor.data_manager.palette_color_map.get(tab_name, "#2d2d2d")
        self.dropdown_panel.configure(highlightbackground=color, highlightthickness=2)
        
        # Use place to overlay the dropdown panel next to the sidebar
        self.dropdown_panel.place(
            x=self.SIDEBAR_WIDTH, 
            y=0, 
            relheight=1.0, 
            width=250
        )
        self.dropdown_panel.lift() # Ensure it's above the canvas
        
        # Render items
        try:
            self.render_sidebar_list(tab_name)
        except Exception as e:
            print(f"DEBUG: Error rendering list: {e}")
            import traceback
            traceback.print_exc()

    def hide_dropdown(self):
        """Hide the dropdown panel."""
        self.dropdown_visible = False
        self.current_dropdown_tab = None
        if self.dropdown_panel:
            self.dropdown_panel.place_forget()

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
        
        # Fetch category data
        cat_data = self.editor.data_manager.block_data.get(tab_name, {})
        sub_cats = cat_data.get("sub_categories", {})
        
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