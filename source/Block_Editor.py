import tkinter as tk
from tkinter import ttk, colorchooser, filedialog
import math
import tkinter.font as tkfont
import json
import traceback  # Import traceback
from Block_Data_Manager import BlockDataManager
from editor_helpers import get_dropdown_items, update_code_output
from io_handlers import show_exported_json, show_import_dialog
from workspace_loader import load_blocks_from_json as workspace_load
from Block_Mover import BlockMover
from block_shapes import BlockShapes
from block_hierarchy import BlockHierarchy
from Code_Generator import CodeGenerator
from Zoom_Manager import ZoomManager
from Block_Renderer import BlockRenderer
from Input_Handler import InputHandler
# from Snap_Handler import SnapHandler  # Not used - Portal-style blocks connect via proximity
from Help_System import HelpSystem
from Error_Logger import get_logger, setup_exception_handler, log_tkinter_errors
from pathlib import Path


class BlockEditor:
    """
    A block-based visual programming editor using Tkinter.
    This version implements drag-and-drop chaining for Action and Control blocks.
    Blocks move as a connected chain, automatically decouple on drag, and snap
    to sequence points.

    The block data structure, colors, and order reflect the requested scheme
    (MOD, RULES, EVENTS, CONDITIONS, ACTIONS).
    """

    def __init__(self, master):
        self.master = master
        master.title("Portal Block Editor (Chaining Enabled)")
        
        # Get error logger instance
        self.logger = get_logger()
        self.logger.log_info("Init", "Starting BlockEditor initialization")
        
        # Set a sane default geometry, then try to maximize on Windows
        master.geometry("1200x800")
        try:
            # update idle tasks first so window manager is initialized
            master.update_idletasks()
            # Preferred on Windows
            master.state("zoomed")
        except Exception:
            try:
                # Fallback for other windowing systems
                master.attributes("-zoomed", True)
            except Exception:
                # If both fail, keep the default geometry
                pass
        master.configure(bg="#1e1e1e")

        try:
            self.logger.log_info("Init", "Loading BlockDataManager")
            self.data_manager = BlockDataManager(self)
        except Exception as e:
            self.logger.log_error("Initialization", "Failed to load BlockDataManager", e)
            raise

        # --- Constants ---
        # No image icons for the top toolbar anymore — use plain colored panels.
        self.SNAP_DISTANCE = 25
        self.NOTCH_DEPTH = 18  # Smoothness of scallop arcs
        self.NOTCH_HEIGHT = 7   # Scallop radius (MOD container)
        self.CHILD_BLOCK_WIDTH = 280
        self.CHILD_BLOCK_HEIGHT = 42  # Increased by 20%
        self.HEADER_HEIGHT = 45
        self.NOTCH_OFFSET = 8  # Gap from opening to scallop center
        self.TOP_BAR_HEIGHT = 50  # Reduced for minimal top controls
        self.SIDEBAR_WIDTH = 120  # Slim sidebar for categories (half width as requested)
        self.GAP = 5  # Vertical gap between snapped blocks
        # Make UI panels the same physical size as import/export controls
        # (pixel dimensions used for panel frames). Keeps a compact, consistent look.
        self.ICON_WIDTH = 160
        self.ICON_HEIGHT = 48
        self.BASE_GRID = 20
        self.DRAG_THRESHOLD = 8  # pixels to distinguish click vs drag on menu items
        self.DROPDOWN_GAP = 3  # Gap between dropdown items

        # --- Data Definitions (Color Scheme and Structure) ---
        # The block data is now loaded via BlockDataManager
        self.block_data = self.data_manager.block_data

        # --- Editor State ---
        # "canvas_obj" stores the INTEGER ID of the main polygon shape (crucial for coords update)
        # "widgets" stores references to Tkinter widgets (Frames, Entrys)
        self.all_blocks = {}
        self.current_id = 0

        # Selection state
        self.selected_blocks = set()
        self.selection_box_id = None
        self.selection_start_x = 0
        self.selection_start_y = 0
        self.is_selecting = False
        
        # Initialize drag data
        self.drag_data = {
            "block_id": None,
            "x": 0,
            "y": 0,
            "start_x": 0,
            "start_y": 0,
            "shift_pressed": False,
            "original_parent": None,
            "original_chain": []
        }

        self.rule_state = {
            "mod_id": "DEFAULT_MOD",
            "rule_id": "DEFAULT_RULE",
            "rule_name": tk.StringVar(value="New_Rule"),
            "event_type": tk.StringVar(value="ON_START"),
            "first_condition_id": None,
            "first_action_id": None,
        }

        # --- UI Setup ---
        # Setup top bar FIRST so it packs at the top (minimal controls only)
        self.setup_top_bar()
        
        # Create main container for sidebar + canvas
        main_container = tk.Frame(master, bg="#0a0a0a")
        main_container.pack(fill="both", expand=True)
        
        # Setup left sidebar for category menus (Portal-style)
        self.setup_sidebar(main_container)
        
        # Match the canvas frame background to canvas to avoid visible seams
        # Pack with expand=True and fill="both" so it takes all available space
        self.canvas_frame = tk.Frame(main_container, bg="#0a0a0a")
        self.canvas_frame.pack(side="left", fill="both", expand=True)

        self.canvas = tk.Canvas(
            self.canvas_frame,
            bg="#1a1a1a",
            highlightthickness=0,
        )

        # Add on-demand scrollbars (initially hidden)
        self.v_scrollbar = ttk.Scrollbar(
            self.canvas_frame, orient="vertical", command=self.canvas.yview
        )
        self.h_scrollbar = ttk.Scrollbar(
            self.canvas_frame, orient="horizontal", command=self.canvas.xview
        )

        self.canvas.configure(
            yscrollcommand=self.v_scrollbar.set, xscrollcommand=self.h_scrollbar.set
        )

        # Use grid inside `canvas_frame` so we can manage scrollbars
        self.canvas.grid(row=0, column=0, sticky="nsew")

        # Configure grid weights
        self.canvas_frame.grid_rowconfigure(0, weight=1)
        self.canvas_frame.grid_columnconfigure(0, weight=1)

        # Bind mousewheel events for scrolling
        self.canvas.bind("<MouseWheel>", self.on_canvas_scroll)
        self.canvas.bind("<Button-4>", self.on_canvas_scroll)
        self.canvas.bind("<Button-5>", self.on_canvas_scroll)

        # Redraw grid on resize
        try:
            self.canvas.bind("<Configure>", lambda e: self.draw_grid())
        except Exception:
            pass

        # Zoom state (1.0 == 100%)
        self.zoom_scale = 1.0
        # Bind zoom keys and Ctrl+MouseWheel for zooming
        try:
            self.master.bind("<Control-plus>", lambda e: self.zoom_in())
            self.master.bind("<Control-minus>", lambda e: self.zoom_out())
            self.master.bind("<Control-0>", lambda e: self.reset_zoom())
            self.canvas.bind("<Control-MouseWheel>", self.on_ctrl_mousewheel)
        except Exception:
            pass

        # Bind events
        self.canvas.bind("<ButtonPress-1>", self.on_block_press)
        self.canvas.bind("<ButtonRelease-1>", self.on_block_release)
        self.canvas.bind("<B1-Motion>", self.on_block_drag)
        # Bind right-click for canvas context menu
        self.canvas.bind("<Button-3>", self.show_canvas_context_menu)

        # Initialize BlockMover (handles spawning and simple snapping)
        try:
            self.block_mover = BlockMover(self)
        except Exception:
            self.block_mover = None
        
        # Initialize BlockRenderer (handles visual rendering)
        try:
            self.block_renderer = BlockRenderer(self)
        except Exception:
            self.block_renderer = None

        # Initialize InputHandler (handles user input)
        try:
            self.input_handler = InputHandler(self)
        except Exception:
            self.input_handler = None
        
        # Initialize ZoomManager (handles all zoom operations)
        try:
            self.zoom_manager = ZoomManager(self)
        except Exception:
            self.zoom_manager = None
        
        # Initialize CodeGenerator (handles code preview and sync)
        try:
            self.code_generator = CodeGenerator(self)
        except Exception:
            self.code_generator = None
        
        # Initialize SnapHandler (handles snap point creation and highlighting)
        # Portal-style: No visible snap points/receptors
        # Blocks connect via proximity detection in Block_Mover
        
        # Initialize HelpSystem (handles contextual help popups)
        try:
            self.help_system = HelpSystem(self)
        except Exception:
            self.help_system = None
        
        # Setup floating zoom controls
        try:
            self.setup_zoom_controls()
        except Exception:
            pass
        
        self.place_initial_blocks()
        # Set initial scrollregion to reasonable default
        try:
            self.canvas.configure(scrollregion=(0, 0, 5000, 5000))
        except Exception:
            pass
        # Draw initial grid
        try:
            self.draw_grid()
        except Exception:
            pass
        # Schedule a one-shot grid redraw after layout settles
        try:
            self.master.after(50, self.draw_grid)
        except Exception:
            pass
        
        # Update code display after initial blocks are placed
        try:
            self.master.after(100, self.update_code_preview)
        except Exception:
            pass

    # import UI is delegated to io_handlers.show_import_dialog

    def load_blocks_from_json(self, imported_data):
        """Light wrapper delegating load to workspace_loader for separation of concerns."""
        try:
            workspace_load(self, imported_data)
        except Exception:
            pass

    def get_new_block_id(self):
        """Generates a new unique ID."""
        self.current_id += 1
        return f"block_{self.current_id}"

    def on_canvas_scroll(self, event):
        """Handle mousewheel scrolling on canvas."""
        try:
            if event.num == 5 or event.delta < 0:
                self.canvas.yview_scroll(3, "units")
            elif event.num == 4 or event.delta > 0:
                self.canvas.yview_scroll(-3, "units")
        except Exception:
            pass
        try:
            # redraw grid to reflect new view
            self.draw_grid()
        except Exception:
            pass

    def on_ctrl_mousewheel(self, event):
        """Zoom in/out when Ctrl + MouseWheel is used."""
        try:
            if event.delta > 0:
                self.zoom_in()
            else:
                self.zoom_out()
        except Exception:
            pass

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
            base = getattr(self, "BASE_GRID", 20)
            spacing = max(8, base * self.zoom_scale)
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

    def center_canvas_view(self):
        """Scroll the canvas so the center of the workspace is visible."""
        try:
            bbox = self.canvas.bbox("all")
            if not bbox:
                # use default scrollregion
                bbox = (0, 0, 3000, 3000)

            left, top, right, bottom = bbox
            w = right - left
            h = bottom - top
            # center coordinates
            cx = left + w / 2
            cy = top + h / 2

            # compute fractions for xview/yview
            vw = self.canvas.winfo_width() or 1
            vh = self.canvas.winfo_height() or 1

            fx = max(0.0, min(1.0, (cx - vw / 2 - left) / max(1.0, w)))
            fy = max(0.0, min(1.0, (cy - vh / 2 - top) / max(1.0, h)))

            try:
                self.canvas.xview_moveto(fx)
                self.canvas.yview_moveto(fy)
            except Exception:
                pass
        except Exception:
            pass

    def set_zoom(self, new_scale):
        """Set zoom to new_scale (relative to current) and scale canvas contents."""
        try:
            if new_scale <= 0:
                return
            old = self.zoom_scale
            factor = new_scale / old
            # Scale around the center of the view for better UX
            cx = self.canvas.canvasx(0) + self.canvas.winfo_width() / 2
            cy = self.canvas.canvasy(0) + self.canvas.winfo_height() / 2
            # Apply canvas scale
            self.canvas.scale("all", cx, cy, factor, factor)

            # Apply logical scaling to stored block positions/sizes
            for b in self.all_blocks.values():
                b["x"] = b["x"] * factor
                b["y"] = b["y"] * factor
                b["width"] = b.get("width", self.CHILD_BLOCK_WIDTH) * factor
                b["height"] = b.get("height", self.CHILD_BLOCK_HEIGHT) * factor

            # Scale child defaults so newly created blocks match current zoom
            self.CHILD_BLOCK_WIDTH = self.CHILD_BLOCK_WIDTH * factor
            self.CHILD_BLOCK_HEIGHT = self.CHILD_BLOCK_HEIGHT * factor

            self.zoom_scale = new_scale

            # Update visual positions
            for bid in list(self.all_blocks.keys()):
                try:
                    self.update_block_position(bid)
                except Exception:
                    pass

            # Refresh scrollregion
            try:
                self.canvas.configure(scrollregion=self.canvas.bbox("all"))
                self.update_scrollbars()
            except Exception:
                pass
            # keep slider/label in sync
            try:
                if hasattr(self, "zoom_slider"):
                    self.zoom_slider.set(self.zoom_scale)
                if hasattr(self, "zoom_label"):
                    self.zoom_label.config(text=f"{int(self.zoom_scale * 100)}%")
            except Exception:
                pass
        except Exception:
            pass

    def zoom_in(self):
        """Zoom in - delegates to ZoomManager."""
        if self.zoom_manager:
            self.zoom_manager.zoom_in()
        else:
            self.set_zoom(min(3.0, self.zoom_scale * 1.15))

    def zoom_out(self):
        """Zoom out - delegates to ZoomManager."""
        if self.zoom_manager:
            self.zoom_manager.zoom_out()
        else:
            self.set_zoom(max(0.25, self.zoom_scale / 1.15))

    def reset_zoom(self):
        """Reset zoom to 100% - delegates to ZoomManager."""
        if self.zoom_manager:
            self.zoom_manager.reset_zoom()
        else:
            try:
                self.set_zoom(1.0)
            except Exception:
                pass

    def update_scrollbars(self):
        """Show/hide scrollbars based on canvas content."""
        try:
            bbox = self.canvas.bbox("all")
            if bbox:
                canvas_width = self.canvas.winfo_width()
                canvas_height = self.canvas.winfo_height()
                content_width = bbox[2] - bbox[0]
                content_height = bbox[3] - bbox[1]

                # Show vertical scrollbar if content taller than canvas
                if content_height > canvas_height:
                    if not self.v_scrollbar.winfo_viewable():
                        self.v_scrollbar.grid(row=0, column=1, sticky="ns")
                else:
                    self.v_scrollbar.grid_remove()

                # Show horizontal scrollbar if content wider than canvas
                if content_width > canvas_width:
                    if not self.h_scrollbar.winfo_viewable():
                        self.h_scrollbar.grid(row=1, column=0, sticky="ew")
                else:
                    self.h_scrollbar.grid_remove()
        except Exception:
            pass

    def setup_sidebar(self, parent):
        """Sets up the left sidebar with collapsible category menus (Portal-style)."""
        self.sidebar_frame = tk.Frame(
            parent, bg="#0a0a0a", width=self.SIDEBAR_WIDTH
        )
        self.sidebar_frame.pack(side="left", fill="y")
        self.sidebar_frame.pack_propagate(False)
        
        # Sidebar title
        title_label = tk.Label(
            self.sidebar_frame,
            text="BLOCK CATEGORIES",
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
        # Add placeholder text logic if needed, or just "Search..." label above
        
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
        
        canvas_sidebar.pack(side="left", fill="y")
        scrollbar.pack(side="right", fill="y")
        
        # Build category buttons
        self.tab_buttons = {}
        image_data = self.data_manager.get_image_data()
        
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
                anchor="w" if is_sub else "center", # Left align sub-items for better hierarchy look
                padx=6 if is_sub else 0
            )
            lbl.pack(fill="both", expand=True)
            
            # Bind click events
            btn_frame.bind("<Button-1>", lambda e, n=cat_name: self.on_tab_click(n))
            lbl.bind("<Button-1>", lambda e, n=cat_name: self.on_tab_click(n))
            
            self.tab_buttons[cat_name] = btn_frame
        
        for name, color in image_data.items():
            # Skip legacy/internal categories if they shouldn't be in the main menu
            if name in ["MOD", "CONDITIONS", "ACTIONS", "EVENTS", "VALUES", "MATH"]:
                continue

            # Create category button
            create_category_btn(name, color)


        # Create expandable dropdown panel for block items (appears to the right of sidebar)
        self.dropdown_panel = tk.Frame(
            parent,
            bg="#1a1a1a",
            width=250,
            bd=2,
            relief="raised"
        )
        self.dropdown_panel.pack_propagate(False)
        # Initially don't show it
        
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
        
        # Track if dropdown is visible
        self.dropdown_visible = False
        self.current_dropdown_tab = None

    def setup_top_bar(self):
        """Sets up the minimal top bar for import/export and zoom controls."""
        self.top_bar_frame = tk.Frame(
            self.master, bg="#0a0a0a", height=self.TOP_BAR_HEIGHT
        )
        self.top_bar_frame.pack(fill="x", side="top")

        initial_color = self.data_manager.palette_color_map.get(
            self.data_manager.current_tab_name
        )
        # Compute heading font height and make icon panels match that height
        try:
            heading_font = tkfont.Font(family="Arial", size=11, weight="bold")
            heading_height = heading_font.metrics("linespace")
            # ensure a reasonable minimum height
            self.ICON_HEIGHT = max(heading_height, 20)
        except Exception:
            # fallback to previous default
            pass

        # Initialize dropdown tracking early so global click handler can use it
        self.dropdown_states = {
            "ACTIONS": False, 
            "RULES": False, 
            "EVENTS": False,
            "CONDITIONS": False,
            "VALUES": False,
            "LOGIC": False,
            "MATH": False,
            "ARRAYS": False,
            "PLAYER": False,
            "GAMEPLAY": False,
            "TRANSFORM": False,
        }
        self.active_dropdowns = {}

        # Close open dropdowns when clicking outside them
        try:
            self.master.bind_all("<Button-1>", self.on_global_click, add="+")
        except Exception:
            pass
        # Create references for compatibility with BlockDataManager
        self.palette_content_frame = tk.Frame(self.top_bar_frame, bg=initial_color)
        self.active_tab_label = tk.Label(
            self.palette_content_frame,
            text=f"Active Tab: {self.data_manager.current_tab_name}",
            bg=initial_color,
            fg="white",
            font=("Arial", 9, "bold"),
        )
        self.active_tab_label.pack(side="left", padx=10)
        self.palette_content_frame.pack(side="left", fill="y")

        # right-side controls: Import, Export, and Zoom (consistent size)
        # Place Import / Export controls inside fixed-size frames
        btn_pixel_width = max(80, int(self.ICON_WIDTH * 0.6))

        import_frame = tk.Frame(
            self.top_bar_frame, width=btn_pixel_width, height=self.ICON_HEIGHT, bg="#0a0a0a"
        )
        import_frame.pack_propagate(False)
        import_btn = tk.Button(
            import_frame,
            text="Import JSON",
            command=self.import_code,
            bg="#4CAF50",
            fg="white",
            font=("Arial", 10, "bold"),
            activebackground="#388E3C",
            activeforeground="white",
            bd=0,
        )
        import_btn.pack(expand=True, fill="both")
        import_frame.pack(side="right", padx=(6, 4), pady=6)

        export_frame = tk.Frame(
            self.top_bar_frame, width=btn_pixel_width, height=self.ICON_HEIGHT, bg="#0a0a0a"
        )
        export_frame.pack_propagate(False)
        export_btn = tk.Button(
            export_frame,
            text="Export JSON",
            command=self.export_code,
            bg="#f44336",
            fg="white",
            font=("Arial", 10, "bold"),
            activebackground="#d32f2f",
            activeforeground="white",
            bd=0,
        )
        export_btn.pack(expand=True, fill="both")
        export_frame.pack(side="right", padx=(4, 6), pady=6)

        # Analyze Button
        analyze_frame = tk.Frame(
            self.top_bar_frame, width=btn_pixel_width, height=self.ICON_HEIGHT, bg="#0a0a0a"
        )
        analyze_frame.pack_propagate(False)
        analyze_btn = tk.Button(
            analyze_frame,
            text="Analyze",
            command=self.analyze_workspace,
            bg="#2196F3",
            fg="white",
            font=("Arial", 10, "bold"),
            activebackground="#1976D2",
            activeforeground="white",
            bd=0,
        )
        analyze_btn.pack(expand=True, fill="both")
        analyze_frame.pack(side="right", padx=(4, 6), pady=6)

        # Zoom controls moved to floating panel (setup_zoom_controls)

        # Store dropdown visibility state. Dropdown panels will be created
        # as overlays (using `place`) so they don't reserve layout space.
        self.dropdown_states = {
            "ACTIONS": False, 
            "RULES": False, 
            "EVENTS": False,
            "CONDITIONS": False,
            "VALUES": False,
            "LOGIC": False,
            "MATH": False,
            "ARRAYS": False,
            "PLAYER": False,
            "GAMEPLAY": False,
            "TRANSFORM": False,
        }
        self.active_dropdowns = {}  # Stores currently visible dropdown panels
        # Tracks panels that have been placed on the workspace (for snapping)
        self.placed_panels = []
        # Index used to assign menu definitions to panels per tab
        self.menu_assign_index = {}

        # Create right-side live code output pane with splitter
        if not hasattr(self, "right_code_frame"):
            # Create splitter frame that sits between canvas and code pane
            self.splitter_frame = tk.Frame(self.master, bg="#2d2d2d")
            self.splitter_frame.pack(side="right", fill="both", expand=False)

            # Resizable separator (draggable)
            self.splitter = tk.Frame(
                self.splitter_frame, bg="#2d2d2d", width=8, cursor="sb_h_double_arrow"
            )
            self.splitter.pack(side="left", fill="y", padx=0, pady=0)
            self.splitter.pack_propagate(False)
            self.splitter.bind("<Button-1>", self.on_splitter_press)
            self.splitter.bind("<B1-Motion>", self.on_splitter_drag)

            self.right_code_frame = tk.Frame(
                self.splitter_frame, bg="#121212", width=360
            )
            self.right_code_frame.pack(side="left", fill="both", expand=True)
            self.right_code_frame.pack_propagate(False)

            # Header with title and toggle button
            header_frame = tk.Frame(self.right_code_frame, bg="#121212")
            header_frame.pack(fill="x", padx=6, pady=(6, 0))

            tk.Label(
                header_frame,
                text="Live Code Output",
                bg="#121212",
                fg="white",
                font=("Arial", 11, "bold"),
            ).pack(side="left")

            # Toggle button as right arrow
            self.toggle_pane_button = tk.Button(
                header_frame,
                text="→",
                command=self.toggle_code_pane,
                bg="#607D8B",
                fg="white",
                font=("Arial", 12, "bold"),
                activebackground="#455A64",
                activeforeground="white",
                bd=0,
                width=3,
                height=1,
            )
            self.toggle_pane_button.pack(side="right")
            
            # Add button frame for code actions
            code_button_frame = tk.Frame(self.right_code_frame, bg="#1e1e1e")
            code_button_frame.pack(fill="x", padx=6, pady=(6, 0))
            
            apply_code_btn = tk.Button(
                code_button_frame,
                text="Apply Code Changes",
                command=self.apply_code_changes,
                bg="#4CAF50",
                fg="white",
                font=("Arial", 9, "bold"),
                activebackground="#388E3C",
                activeforeground="white",
                bd=0,
            )
            apply_code_btn.pack(side="left", padx=2)
            
            refresh_code_btn = tk.Button(
                code_button_frame,
                text="Refresh",
                command=self.refresh_ui,
                bg="#2196F3",
                fg="white",
                font=("Arial", 9, "bold"),
                activebackground="#1976D2",
                activeforeground="white",
                bd=0,
            )
            refresh_code_btn.pack(side="left", padx=2)

            self.code_output_text = tk.Text(
                self.right_code_frame,
                bg="#0f0f0f",
                fg="#bfbfbf",
                font=("Consolas", 10),
                width=40,
                height=30,
                bd=0,
            )
            self.code_output_text.pack(expand=True, fill="both", padx=6, pady=6)
            # Make code editable
            self.code_output_text.config(state=tk.NORMAL)

            self.right_pane_width = 360
            self.splitter_drag_data = {"x": 0}

    def on_splitter_press(self, event):
        """Handle splitter press event."""
        self.splitter_drag_data["x"] = event.x_root

    def on_splitter_drag(self, event):
        """Handle splitter drag to resize right pane."""
        dx = event.x_root - self.splitter_drag_data["x"]
        new_width = max(200, self.right_pane_width - dx)  # Min width 200px
        self.right_code_frame.config(width=new_width)
        self.right_pane_width = new_width
        self.splitter_drag_data["x"] = event.x_root

    def toggle_code_pane(self):
        """Toggles the visibility of the right-hand code output pane."""
        if self.is_code_pane_visible:
            # Hide the pane - keep only the toggle button visible
            self.right_code_frame.pack_forget()
            self.splitter.pack_forget()
            
            # Create a small frame on the right edge for the uncollapse button
            if not hasattr(self, 'collapsed_toggle_frame'):
                self.collapsed_toggle_frame = tk.Frame(self.splitter_frame, bg="#2d2d2d", width=30)
                self.collapsed_toggle_frame.pack(side="right", fill="y")
                self.collapsed_toggle_frame.pack_propagate(False)
                
                self.collapsed_toggle_button = tk.Button(
                    self.collapsed_toggle_frame,
                    text="←",
                    command=self.toggle_code_pane,
                    bg="#607D8B",
                    fg="white",
                    font=("Arial", 12, "bold"),
                    activebackground="#455A64",
                    activeforeground="white",
                    bd=0,
                )
                self.collapsed_toggle_button.pack(expand=True, fill="both", padx=2, pady=10)
            else:
                self.collapsed_toggle_frame.pack(side="right", fill="y")
            
            self.is_code_pane_visible = False
            self.master.update_idletasks()
        else:
            # Show the pane
            if hasattr(self, 'collapsed_toggle_frame'):
                self.collapsed_toggle_frame.pack_forget()
            
            # Repack splitter and code frame
            # Important: Pack order matters. Splitter is left of code frame.
            self.splitter.pack(side="left", fill="y", padx=0, pady=0)
            self.right_code_frame.pack(side="left", fill="both", expand=True)
            
            self.toggle_pane_button.config(text="→")
            self.is_code_pane_visible = True
            self.master.update_idletasks()

    def setup_zoom_controls(self):
        """Creates a floating zoom control panel in the bottom-right of the canvas."""
        zoom_frame = tk.Frame(self.canvas_frame, bg="#1a1a1a", relief="raised", bd=1)
        # Place in bottom-right corner with some padding
        zoom_frame.place(relx=1.0, rely=1.0, anchor="se", x=-20, y=-20)

        try:
            minus_btn = tk.Button(
                zoom_frame,
                text="-",
                command=self.zoom_out,
                bg="#2d2d2d",
                fg="white",
                bd=0,
                width=2,
                cursor="hand2"
            )
            minus_btn.pack(side="left", padx=(4, 2), pady=4)

            # Slider uses float range 0.25..3.0
            def on_zoom_change(v):
                try:
                    self.set_zoom(float(v))
                except Exception:
                    pass

            self.zoom_slider = ttk.Scale(
                zoom_frame,
                orient="horizontal",
                from_=0.25,
                to=3.0,
                value=self.zoom_scale,
                command=on_zoom_change,
                length=100,
            )
            self.zoom_slider.pack(side="left", padx=2, pady=4)
            
            # Store reference in ZoomManager
            if self.zoom_manager:
                self.zoom_manager.zoom_slider = self.zoom_slider

            # percentage label
            self.zoom_label = tk.Label(
                zoom_frame,
                text=f"{int(self.zoom_scale * 100)}%",
                bg="#1a1a1a",
                fg="white",
                font=("Arial", 9),
                width=4
            )
            self.zoom_label.pack(side="left", padx=(2, 4), pady=4)
            
            # Store reference in ZoomManager
            if self.zoom_manager:
                self.zoom_manager.zoom_label = self.zoom_label

            plus_btn = tk.Button(
                zoom_frame,
                text="+",
                command=self.zoom_in,
                bg="#2d2d2d",
                fg="white",
                bd=0,
                width=2,
                cursor="hand2"
            )
            plus_btn.pack(side="left", padx=(2, 4), pady=4)

        except Exception:
            pass

    def on_tab_click(self, tab_name):
        """Handle tab click - show/hide dropdown panel with items."""
        try:
            self.data_manager.switch_tab_logic(tab_name)
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
        self.current_dropdown_tab = tab_name
        self.dropdown_visible = True
        
        # Use place to overlay the dropdown panel next to the sidebar
        # This avoids layout shifts and ensures it appears "on top" or adjacent
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
        self.dropdown_panel.place_forget()

    def render_sidebar_list(self, tab_name, filter_text=None):
        """Render the block items for a category inside the sidebar list container."""
        print(f"DEBUG: Rendering sidebar for {tab_name}")
        if not hasattr(self, 'sidebar_list_container') or self.sidebar_list_container is None:
            print("DEBUG: sidebar_list_container missing")
            return
        # Clear previous contents
        for child in self.sidebar_list_container.winfo_children():
            try:
                child.destroy()
            except Exception:
                pass
        
        # Fetch category data
        cat_data = self.data_manager.block_data.get(tab_name, {})
        if not cat_data:
            print(f"DEBUG: No data found for {tab_name}")
            
        sub_cats = cat_data.get("sub_categories", {})
        print(f"DEBUG: Found {len(sub_cats)} sub-categories for {tab_name}")
        
        color = self.data_manager.palette_color_map.get(tab_name, "#2d2d2d")
        text_fg = "#000000" if tab_name == "ACTIONS" else "white"

        # Main Header
        header = tk.Label(
            self.sidebar_list_container,
            text=f"{tab_name}",
            bg="#2d2d2d",
            fg="white",
            font=("Arial", 11, "bold"),
            anchor="w",
            padx=12,
            pady=8
        )
        header.pack(fill="x")

        if not sub_cats:
             # Fallback if no sub-categories (or empty)
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
                text=sub_name.upper(),
                bg="#1a1a1a",
                fg="#888888",
                font=("Arial", 8, "bold"),
                anchor="w",
                padx=12,
                pady=(10, 4)
            )
            sub_header.pack(fill="x")

            # Blocks
            for block_id, label_text in visible_blocks:
                item_panel = tk.Frame(
                    self.sidebar_list_container,
                    bg=color,
                    height=40,
                    bd=0,
                    cursor="hand2"
                )
                item_panel.pack(fill="x", padx=8, pady=2)
                item_panel.pack_propagate(False)
                
                lbl = tk.Label(
                    item_panel,
                    text=label_text,
                    bg=color,
                    fg=text_fg,
                    font=("Arial", 9, "bold"),
                    anchor="w",
                    padx=10
                )
                lbl.pack(side="left", fill="both", expand=True)
                
                # Bind clicks to spawn a block
                for w in (item_panel, lbl):
                    w.bind(
                        "<Button-1>",
                        lambda e, name=tab_name, k=block_id: self.spawn_block_from_sidebar(name, k)
                    )

        if not any_items_shown:
             tk.Label(self.sidebar_list_container, text="No items found", bg="#1a1a1a", fg="#888888").pack(pady=10)

    def draw_block(self, block_id):
        """Draws or updates the visual representation of a block."""
        if self.block_renderer:
            self.block_renderer.draw_block(block_id)

    def _create_block_widgets(self, block_id):
        """Creates the Tkinter widgets (Label, Entry) for a block."""
        if self.block_renderer:
            self.block_renderer._create_block_widgets(block_id)

    def spawn_block_from_sidebar(self, tab_name, action_key):
        """Spawn a block based on the selected sidebar item."""
        try:
            # Delegate spawn to BlockMover using current tab and optional action key
            if hasattr(self, 'block_mover') and self.block_mover:
                self.block_mover.spawn_block_from_menu(tab_name, action_key)
            else:
                # Minimal fallback: create a simple VALUE block
                bid = self.get_new_block_id()
                self.all_blocks[bid] = {
                    'id': bid,
                    'label': action_key or f'{tab_name} Item',
                    'type': 'VALUE' if tab_name in ('VALUES','LOGIC','MATH') else 'SEQUENCE',
                    'color': self.data_manager.palette_color_map.get(tab_name, '#555555'),
                    'x': 420,
                    'y': 120,
                    'width': self.CHILD_BLOCK_WIDTH,
                    'height': self.CHILD_BLOCK_HEIGHT,
                    'canvas_obj': None,
                    'widgets': []
                }
                self.draw_block(bid)
                self.update_block_position(bid)
        except Exception:
            pass

    def create_new_subroutine(self):
        """Show dialog to create a new SUBROUTINE container block."""
        import tkinter.simpledialog as simpledialog
        
        name = simpledialog.askstring(
            "Create Subroutine",
            "Enter subroutine name:",
            parent=self.master
        )
        
        if name and name.strip():
            # Spawn a new SUBROUTINE container block
            if hasattr(self, 'block_mover') and self.block_mover:
                # Create subroutine definition
                sub_def = {
                    "label": name.strip(),
                    "type": "SUBROUTINE",
                    "color": "#CD853F",
                    "args": []
                }
                # Spawn at center of visible area
                self.block_mover._create_block_at(400, 200, sub_def, "SUBROUTINE")
                
                # Refresh the SUBROUTINE menu to show the new item
                if self.current_dropdown_tab == "SUBROUTINE":
                    self.render_sidebar_list("SUBROUTINE")

    def spawn_subroutine_pill(self, subroutine_id):
        """Spawn a pill-shaped connector version of an existing SUBROUTINE.
        
        The pill can be dragged into RULES blocks to reference the subroutine.
        """
        if subroutine_id not in self.all_blocks:
            return
        
        sub_block = self.all_blocks[subroutine_id]
        sub_name = sub_block.get('label', 'Subroutine')
        
        # Spawn a pill-shaped reference block
        if hasattr(self, 'block_mover') and self.block_mover:
            pill_def = {
                "label": sub_name,
                "type": "ACTIONS",  # Pill shape like actions
                "color": "#CD853F",  # Subroutine color
                "args": [],
                "subroutine_ref": subroutine_id  # Reference to actual subroutine
            }
            self.block_mover._create_block_at(400, 300, pill_def, "SUBROUTINE")

    def schedule_close_dropdown(self, tab_name):
        """Schedule closing a dropdown after a short delay (mouse leave)."""
        # Cancel any existing scheduled close
        if hasattr(self, '_close_timer') and self._close_timer:
            try:
                self.master.after_cancel(self._close_timer)
            except:
                pass
        
        # Schedule close after 500ms (allows moving between dropdown items)
        self._close_timer = self.master.after(500, lambda: self.close_dropdown(tab_name))

    def toggle_dropdown(self, tab_name):
        """Toggle the visibility of a dropdown panel."""
        if self.dropdown_states.get(tab_name, False):
            # Close the dropdown
            self.close_dropdown(tab_name)
        else:
            # Open the dropdown
            self.open_dropdown(tab_name)

    def on_global_click(self, event):
        """Close dropdowns when clicking outside the top bar or dropdown panels."""
        try:
            widget = event.widget

            def is_inside(child, container):
                try:
                    w = child
                    while w is not None:
                        if w == container:
                            return True
                        w = getattr(w, "master", None)
                except Exception:
                    return False
                return False

            # If clicking anywhere inside the top bar, keep dropdowns open
            if is_inside(widget, self.top_bar_frame):
                return

            # If clicking inside any active dropdown panel, keep open
            for panels in list(self.active_dropdowns.values()):
                for p in panels:
                    if is_inside(widget, p):
                        return

            # Otherwise close all open dropdowns
            for tab in list(self.active_dropdowns.keys()):
                try:
                    self.close_dropdown(tab)
                except Exception:
                    pass
        except Exception:
            pass

    def open_dropdown(self, tab_name):
        """Open a dropdown panel below the tab button."""
        if self.dropdown_states.get(tab_name, False):
            return  # Already open

        # Get the button position
        btn = self.tab_buttons.get(tab_name)
        if not btn:
            return

        # Create dropdown content frame as an overlay so it doesn't push other widgets
        color = self.data_manager.palette_color_map.get(tab_name, "#2d2d2d")

        btn = self.tab_buttons.get(tab_name)
        if not btn:
            return

        # Compute x/y relative to the master window
        # Position dropdown to the RIGHT of sidebar button (not below)
        try:
            master_root_x = self.master.winfo_rootx()
            master_root_y = self.master.winfo_rooty()
            btn_root_x = btn.winfo_rootx()
            btn_root_y = btn.winfo_rooty()
            x = btn_root_x - master_root_x + btn.winfo_width() + 4  # To the right
            y = btn_root_y - master_root_y  # Aligned with button top
        except Exception:
            # Fallback: place to right of sidebar
            x = self.SIDEBAR_WIDTH + 4
            y = btn.winfo_y() + self.TOP_BAR_HEIGHT

        # Build dropdown items from the block data for the tab (shows real labels)
        items = get_dropdown_items(self.data_manager.block_data, tab_name)
        if not items:
            # Fallback placeholders
            items = [(None, "Item 1"), (None, "Item 2"), (None, "Item 3")]

        panels = []
        
        # Create container frame for dropdown items
        dropdown_container = tk.Frame(
            self.master,
            bg="#0a0a0a",
            bd=2,
            relief="raised"
        )
        dropdown_container.place(x=x, y=y)
        
        max_items = min(len(items), 20)
        for i in range(max_items):
            key, label_text = items[i]
            item_panel = tk.Frame(
                dropdown_container,
                bg=color,
                width=280,
                height=42,
                bd=0,
                relief="raised",
            )
            item_panel.pack(fill="x", padx=2, pady=1)
            item_panel.pack_propagate(False)

            # Label inside the panel showing the action name
            text_fg = "#000000" if tab_name == "ACTIONS" else "white"
            lbl = tk.Label(
                item_panel,
                text=label_text,
                bg=color,
                fg=text_fg,
                font=("Arial", 10, "bold"),
            )
            lbl.pack(expand=True, fill="both")

            # Bind events to BOTH panel and label (label covers panel and captures events)
            # Use press-start / motion / release handlers to allow single-click spawn
            for widget in [item_panel, lbl]:
                widget.bind(
                    "<ButtonPress-1>",
                    lambda e, panel=item_panel, name=tab_name, k=key: self.on_dropdown_panel_press(
                        e, panel, name, k
                    ),
                )
                widget.bind(
                    "<B1-Motion>",
                    lambda e, panel=item_panel: self.on_dropdown_panel_motion(e, panel),
                )
                widget.bind(
                    "<ButtonRelease-1>",
                    lambda e, panel=item_panel: self.on_dropdown_panel_release_wrapper(e, panel),
                )
                # Close menu when mouse leaves the dropdown area
                widget.bind(
                    "<Leave>",
                    lambda e, name=tab_name: self.schedule_close_dropdown(name),
                )

            panels.append(item_panel)

        # Store both the container and individual panels
        self.active_dropdowns[tab_name] = [dropdown_container] + panels
        self.dropdown_states[tab_name] = True

    def close_dropdown(self, tab_name):
        """Close a dropdown panel."""
        if tab_name in self.active_dropdowns:
            panels = self.active_dropdowns[tab_name]
            try:
                for p in panels:
                    p.destroy()
            except Exception:
                pass
            del self.active_dropdowns[tab_name]
        self.dropdown_states[tab_name] = False

    def on_dropdown_panel_press(self, event, panel, tab_name, action_key=None):
        """Handle mouse press on a dropdown panel.

        Create a floating clone that will be moved across the workspace; hide
        the original while dragging.
        """
        try:
            master_root_x = self.master.winfo_rootx()
            master_root_y = self.master.winfo_rooty()
            abs_x = panel.winfo_rootx() - master_root_x
            abs_y = panel.winfo_rooty() - master_root_y
        except Exception:
            abs_x = panel.winfo_x()
            abs_y = panel.winfo_y()

        floating = tk.Frame(
            self.master,
            bg=panel.cget("bg"),
            width=self.ICON_WIDTH,
            height=self.ICON_HEIGHT,
            bd=1,
            relief="raised",
        )
        floating.place(x=abs_x, y=abs_y)

        try:
            panel.place_forget()
        except Exception:
            pass

        self.drag_data["dropdown_panel"] = panel
        self.drag_data["floating_panel"] = floating
        self.drag_data["dropdown_tab"] = tab_name
        self.drag_data["dropdown_action"] = action_key
        self.drag_data["x"] = event.x_root
        self.drag_data["y"] = event.y_root

    def on_dropdown_panel_press_start(self, event, panel, tab_name, action_key=None):
        """Record press position and defer creating a floating clone until movement."""
        try:
            self.drag_data["press_x"] = event.x_root
            self.drag_data["press_y"] = event.y_root
            self.drag_data["press_panel"] = panel
            self.drag_data["press_tab"] = tab_name
            self.drag_data["press_action"] = action_key
            self.drag_data["is_dragging"] = False
        except Exception:
            pass

    def on_dropdown_panel_motion(self, event, panel):
        """Start drag if movement exceeds a small threshold, otherwise move floating."""
        try:
            if not self.drag_data.get("press_panel"):
                return

            px = self.drag_data.get("press_x", 0)
            py = self.drag_data.get("press_y", 0)
            dx = abs(event.x_root - px)
            dy = abs(event.y_root - py)
            if not self.drag_data.get("is_dragging") and (dx > self.DRAG_THRESHOLD or dy > self.DRAG_THRESHOLD):
                # Promote to dragging: create floating clone
                tab = self.drag_data.get("press_tab")
                act = self.drag_data.get("press_action")
                # call existing creation routine which expects event and original panel
                try:
                    self.on_dropdown_panel_press(event, panel, tab, act)
                except Exception:
                    pass
                self.drag_data["is_dragging"] = True

            # If dragging, delegate to existing drag handler to move floating
            if self.drag_data.get("is_dragging"):
                try:
                    self.on_dropdown_panel_drag(event, panel)
                except Exception:
                    pass
        except Exception:
            pass

    def on_dropdown_panel_release_wrapper(self, event, panel):
        """If not dragging, treat as a click -> spawn block. If dragging, finish drag."""
        try:
            is_dragging = self.drag_data.get("is_dragging", False)
            tab = self.drag_data.get("press_tab")
            act = self.drag_data.get("press_action")
            
            if not is_dragging and tab:
                # Single click - spawn block at cursor position
                try:
                    # Get canvas coordinates
                    canvas_x = self.canvas.canvasx(event.x)
                    canvas_y = self.canvas.canvasy(event.y)
                    
                    # Spawn block with the action key
                    self.block_mover.spawn_block(tab, act)
                    
                    # Close dropdown after spawning
                    self.close_dropdown(tab)
                except Exception as e:
                    print(f"Error spawning block: {e}")
                    import traceback
                    traceback.print_exc()
            elif is_dragging:
                # Finish drag operation
                self.on_dropdown_panel_release(event, panel)
            
            # Clear press info
            for k in ("press_x", "press_y", "press_panel", "press_tab", "press_action", "is_dragging"):
                self.drag_data.pop(k, None)

            # ensure dragging state cleared
            self.drag_data["is_dragging"] = False
        except Exception:
            pass

    def on_dropdown_panel_drag(self, event, panel):
        """Handle dragging of a dropdown panel (moves the floating clone)."""
        if (
            "dropdown_panel" not in self.drag_data
            or "floating_panel" not in self.drag_data
        ):
            return

        dx = event.x_root - self.drag_data["x"]
        dy = event.y_root - self.drag_data["y"]

        floating = self.drag_data["floating_panel"]

        # Current absolute position relative to master
        curr_x = floating.winfo_x() + dx
        curr_y = floating.winfo_y() + dy

        # Compute snapping destinations (may modify curr_x/curr_y)
        snap_x, snap_y = self.compute_snap_position(curr_x, curr_y, floating)

        floating.place(x=snap_x, y=snap_y)

        self.drag_data["x"] = event.x_root
        self.drag_data["y"] = event.y_root

    def on_dropdown_panel_release(self, event, panel):
        """Finalize drag: keep the floating panel as a placed widget and
        remove the original placeholder.
        """
        floating = self.drag_data.get("floating_panel")
        original = self.drag_data.get("dropdown_panel")
        if not floating:
            return
        # Capture tab name if available so the live code pane can use it
        tab_name = self.drag_data.get("dropdown_tab", "UNKNOWN")

        placed_info = {
            "widget": floating,
            "tab": tab_name,
            "action_key": self.drag_data.get("dropdown_action"),
            "x": floating.winfo_x(),
            "y": floating.winfo_y(),
            "w": floating.winfo_width(),
            "h": floating.winfo_height(),
        }
        self.placed_panels.append(placed_info)

        try:
            original.destroy()
        except Exception:
            pass

        # Clear drag state
        for key in ("floating_panel", "dropdown_panel", "dropdown_tab", "x", "y"):
            self.drag_data.pop(key, None)

        # Update live code pane to reflect new placed panels
        try:
            update_code_output(self)
        except Exception:
            pass

        # Bind right-click menu for panel assignment
        floating.bind(
            "<Button-3>", lambda e: self.show_panel_context_menu(e, placed_info)
        )
        for child in floating.winfo_children():
            child.bind(
                "<Button-3>", lambda e: self.show_panel_context_menu(e, placed_info)
            )

    def show_panel_context_menu(self, event, panel_info):
        """Show context menu for panel definition assignment."""
        context_menu = tk.Menu(self.master, tearoff=0, bg="#2d2d2d", fg="white")
        context_menu.add_command(
            label="Remove Panel", command=lambda: self.remove_panel(panel_info)
        )
        context_menu.add_separator()
        context_menu.add_command(
            label="Details", command=lambda: self.show_panel_details(panel_info)
        )

        try:
            context_menu.tk_popup(event.x_root, event.y_root)
        except Exception:
            pass

    def remove_panel(self, panel_info):
        """Remove a placed panel."""
        try:
            panel_info["widget"].destroy()
            self.placed_panels.remove(panel_info)
            update_code_output(self)
        except Exception:
            pass

    def show_panel_details(self, panel_info):
        """Show panel details in a popup."""
        details_window = tk.Toplevel(self.master, bg="#1e1e1e")
        details_window.title("Panel Details")
        details_window.geometry("400x250")

        text_widget = tk.Text(
            details_window,
            wrap="word",
            bg="#2d2d2d",
            fg="white",
            font=("Consolas", 10),
            bd=0,
            padx=10,
            pady=10,
        )
        text_widget.pack(expand=True, fill="both")

        details = f"""Tab: {panel_info.get('tab', 'N/A')}
Action Key: {panel_info.get('action_key', 'N/A')}
Position X: {panel_info.get('x', 0)}
Position Y: {panel_info.get('y', 0)}
Width: {panel_info.get('w', 0)}
Height: {panel_info.get('h', 0)}"""

        text_widget.insert(tk.END, details)
        text_widget.config(state=tk.DISABLED)

    def compute_snap_position(self, x, y, widget):
        """Return possibly-snapped (x,y) for `widget` based on grid, canvas edges and other panels."""
        SNAP_THRESHOLD = 12
        GRID_SIZE = 20  # Grid snapping size
        w = widget.winfo_width() or self.ICON_WIDTH
        h = widget.winfo_height() or self.ICON_HEIGHT

        snapped_x = x
        snapped_y = y

        # Snap to grid
        grid_x = round(x / GRID_SIZE) * GRID_SIZE
        grid_y = round(y / GRID_SIZE) * GRID_SIZE

        if abs(x - grid_x) < SNAP_THRESHOLD:
            snapped_x = grid_x
        if abs(y - grid_y) < SNAP_THRESHOLD:
            snapped_y = grid_y

        # Snap to canvas edges
        try:
            master_root_x = self.master.winfo_rootx()
            master_root_y = self.master.winfo_rooty()
            c_root_x = self.canvas.winfo_rootx() - master_root_x
            c_root_y = self.canvas.winfo_rooty() - master_root_y
            c_w = self.canvas.winfo_width()
            c_h = self.canvas.winfo_height()

            if abs(snapped_x - c_root_x) < SNAP_THRESHOLD:
                snapped_x = c_root_x
            if abs((snapped_x + w) - (c_root_x + c_w)) < SNAP_THRESHOLD:
                snapped_x = c_root_x + c_w - w
            if abs(snapped_y - c_root_y) < SNAP_THRESHOLD:
                snapped_y = c_root_y
            if abs((snapped_y + h) - (c_root_y + c_h)) < SNAP_THRESHOLD:
                snapped_y = c_root_y + c_h - h
        except Exception:
            pass

        # Snap to other placed panels
        for p in self.placed_panels:
            ox = p.get("x", 0)
            oy = p.get("y", 0)
            ow = p.get("w", 0)
            oh = p.get("h", 0)

            if abs(snapped_x - (ox + ow)) < SNAP_THRESHOLD:
                snapped_x = ox + ow + 4
            if abs((snapped_x + w) - ox) < SNAP_THRESHOLD:
                snapped_x = ox - w - 4
            if abs(snapped_y - (oy + oh)) < SNAP_THRESHOLD:
                snapped_y = oy + oh + 4
            if abs((snapped_y + h) - oy) < SNAP_THRESHOLD:
                snapped_y = oy - h - 4

        return snapped_x, snapped_y

    def get_dropdown_items(self, tab_name):
        # Deprecated: moved to `editor_helpers.get_dropdown_items`
        return []

    def update_code_output(self):
        # Deprecated: moved to `editor_helpers.update_code_output`
        try:
            update_code_output(self)
        except Exception:
            pass

    def get_snapped_children(self, block_id):
        """
        Returns a list of all block IDs connected to the given block_id,
        including the block itself, any blocks connected to 'next',
        any nested blocks, and any docked blocks (horizontal) (recursively).
        """
        if block_id not in self.all_blocks:
            return []

        children = [block_id]
        block = self.all_blocks[block_id]

        # 1. Recursively get 'next' block (vertical chaining)
        next_id = block.get("next_block")
        if next_id:
            children.extend(self.get_snapped_children(next_id))

        # 2. Recursively get nested blocks (containers)
        if "nested_blocks" in block:
            for child_id in block["nested_blocks"]:
                children.extend(self.get_snapped_children(child_id))
                
        # 3. Recursively get docked blocks (horizontal chaining)
        if "docked_blocks" in block:
            for child_id in block["docked_blocks"]:
                children.extend(self.get_snapped_children(child_id))
        
        # 4. Recursively get parameter inputs (nested values)
        if "inputs" in block:
            for param_name, slot in block["inputs"].items():
                if slot.get("block"):
                    children.extend(self.get_snapped_children(slot["block"]))
        
        # Remove duplicates just in case
        return list(dict.fromkeys(children))

    def get_chain_ids(self, start_block_id):
        """Returns a list of block IDs in the chain starting from start_block_id."""
        chain = []
        current_id = start_block_id
        while current_id and current_id in self.all_blocks:
            chain.append(current_id)
            current_id = self.all_blocks[current_id].get("next_block")
        return chain

    def update_code_preview(self):
        """Updates the code preview window."""
        if not hasattr(self, "code_output_text"):
            return
            
        if self.code_generator:
            try:
                code = self.code_generator.generate_code()
                
                self.code_output_text.config(state=tk.NORMAL)
                self.code_output_text.delete("1.0", tk.END)
                self.code_output_text.insert(tk.END, code)
                self.code_output_text.config(state=tk.DISABLED)
            except Exception as e:
                print(f"Error updating code preview: {e}")

    def update_block_position(self, block_id):
        """Updates the position of a block and its associated canvas objects/widgets."""
        if self.block_renderer:
            self.block_renderer.update_block_position(block_id)

    def on_block_press(self, event, block_id=None):
        """Handles mouse button press on a block."""
        if self.input_handler:
            self.input_handler.on_block_press(event, block_id)

    def on_block_release(self, event, block_id=None):
        """Handles mouse button release (snap logic)."""
        if self.input_handler:
            self.input_handler.on_block_release(event, block_id)

    def _try_nest_in_parameter_slot(self, value_block_id, event):
        """Try to nest a VALUE block into a nearby parameter slot (Portal-style)."""
        if self.input_handler:
            return self.input_handler._try_nest_in_parameter_slot(value_block_id, event)
        return False

    def on_block_drag(self, event, block_id=None):
        """Handles block movement with nested children and attached blocks."""
        if self.input_handler:
            self.input_handler.on_block_drag(event, block_id)

    def move_chain(self, block_id, dx, dy):
        """Move a block and all its connected children by (dx, dy)."""
        children = self.get_snapped_children(block_id)
        for child_id in children:
            if child_id in self.all_blocks:
                block = self.all_blocks[child_id]
                block["x"] += dx
                block["y"] += dy
                self.update_block_position(child_id)

    def show_block_context_menu(self, event, block_id):
        """Show context menu for a block with navigation options."""
        if self.input_handler:
            self.input_handler.show_block_context_menu(event, block_id)

    def show_block_help(self, block_id):
        """Show help popup for a block.
        
        Args:
            block_id: The ID of the block to show help for
        """
        if self.help_system:
            try:
                self.help_system.show_help(block_id)
            except Exception as e:
                print(f"Error showing help: {e}")

    def add_subroutine_to_block(self, parent_id):
        """Add a new subroutine block nested within a parent block.
        
        Args:
            parent_id: The ID of the parent RULES block
        """
        if parent_id not in self.all_blocks:
            return
        
        parent = self.all_blocks[parent_id]
        
        # Position the subroutine inside the parent
        sub_x = parent['x'] + 50
        sub_y = parent['y'] + 60
        
        # Create subroutine block
        sub_id = self.get_new_block_id()
        self.all_blocks[sub_id] = {
            'id': sub_id,
            'label': 'Subroutine',
            'type': 'SUBROUTINE',
            'color': '#CD853F',  # Light orange-brown
            'x': sub_x,
            'y': sub_y,
            'width': 280,
            'height': 180,
            'inner_height': 80,
            'canvas_obj': None,
            'widgets': [],
            'parent_id': None,
            'next_sibling_id': None,
            'nested_in': parent_id,  # This is nested inside the parent
            'args': {},
        }
        
        # Draw the subroutine
        try:
            self.draw_block(sub_id)
            self.update_block_position(sub_id)
        except Exception as e:
            print(f"Error drawing subroutine: {e}")
        
        # Resize parent to accommodate
        self._resize_c_block_for_contents(parent_id)
        
        # Update display
        try:
            self.canvas.configure(scrollregion=self.canvas.bbox("all"))
            self.update_scrollbars()
            self.update_code_output()
        except Exception:
            pass

    def delete_block(self, block_id):
        """Delete a single block and reconnect its neighbors if possible."""
        if block_id not in self.all_blocks:
            return
            
        block = self.all_blocks[block_id]
        
        # Remove from parent's nested/docked lists
        self._remove_from_parent(block)
        
        # Remove widgets/canvas items
        if block["canvas_obj"]:
            self.canvas.delete(block["canvas_obj"])
        for widget in block["widgets"]:
            try:
                if hasattr(widget, 'destroy'):
                    widget.destroy()
                else:
                    self.canvas.delete(widget)
            except:
                pass
                
        # Delete children? Or detach them?
        # For now, let's just delete the block and let children float (or delete them too if nested)
        # If it's a container, delete nested blocks
        if "nested_blocks" in block:
            for child_id in list(block["nested_blocks"]):
                self.delete_block(child_id)
                
        del self.all_blocks[block_id]
        self.update_code_preview()

    def delete_chain(self, block_id):
        """Delete a block and everything connected to it."""
        children = self.get_snapped_children(block_id)
        for child_id in children:
            if child_id in self.all_blocks:
                self.delete_block(child_id)

    def _remove_from_parent(self, block):
        """Helper to remove block from its parent's lists."""
        # Check nested_in
        parent_id = block.get("nested_in")
        if parent_id and parent_id in self.all_blocks:
            parent = self.all_blocks[parent_id]
            if "nested_blocks" in parent and block["id"] in parent["nested_blocks"]:
                parent["nested_blocks"].remove(block["id"])
                
        # Check docked_to
        docked_to = block.get("docked_to")
        if docked_to and docked_to in self.all_blocks:
            parent = self.all_blocks[docked_to]
            if "docked_blocks" in parent and block["id"] in parent["docked_blocks"]:
                parent["docked_blocks"].remove(block["id"])
                
        # Check parameter slots
        nested_in_param = block.get("nested_in_param")
        if nested_in_param:
            parent_id, param_name = nested_in_param
            if parent_id in self.all_blocks:
                parent = self.all_blocks[parent_id]
                if "inputs" in parent and param_name in parent["inputs"]:
                    parent["inputs"][param_name]["block"] = None

    def show_block_properties(self, block_id):
        """Show a dialog with block properties."""
        if block_id not in self.all_blocks:
            return
            
        block = self.all_blocks[block_id]
        
        # Create popup window
        top = tk.Toplevel(self.master)
        top.title(f"Properties: {block.get('label', 'Block')}")
        top.geometry("400x400")
        top.configure(bg="#2d2d2d")
        
        # Create scrollable frame
        canvas = tk.Canvas(top, bg="#2d2d2d", highlightthickness=0)
        scrollbar = ttk.Scrollbar(top, orient="vertical", command=canvas.yview)
        scrollable_frame = tk.Frame(canvas, bg="#2d2d2d")
        
        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )
        
        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)
        
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")
        
        # Grid layout
        row = 0
        for key, value in block.items():
            if key in ['canvas_obj', 'widgets', 'args', 'inputs', 'value', 'param_labels', 'param_icons']:
                continue
                
            tk.Label(scrollable_frame, text=f"{key}:", fg="#aaaaaa", bg="#2d2d2d", font=("Consolas", 9, "bold"), anchor="e").grid(row=row, column=0, sticky="ne", padx=5, pady=2)
            
            val_str = str(value)
            if len(val_str) > 100:
                val_str = val_str[:100] + "..."
                
            tk.Label(scrollable_frame, text=val_str, fg="white", bg="#2d2d2d", font=("Consolas", 9), anchor="w", wraplength=250, justify="left").grid(row=row, column=1, sticky="w", padx=5, pady=2)
            row += 1
            
        # Show args/inputs count
        tk.Label(scrollable_frame, text="Args:", fg="#aaaaaa", bg="#2d2d2d", font=("Consolas", 9, "bold"), anchor="e").grid(row=row, column=0, sticky="ne", padx=5, pady=2)
        tk.Label(scrollable_frame, text=str(len(block.get('args', {}))), fg="white", bg="#2d2d2d", font=("Consolas", 9), anchor="w").grid(row=row, column=1, sticky="w", padx=5, pady=2)
        row += 1
        
        tk.Label(scrollable_frame, text="Inputs:", fg="#aaaaaa", bg="#2d2d2d", font=("Consolas", 9, "bold"), anchor="e").grid(row=row, column=0, sticky="ne", padx=5, pady=2)
        tk.Label(scrollable_frame, text=str(len(block.get('inputs', {}))), fg="white", bg="#2d2d2d", font=("Consolas", 9), anchor="w").grid(row=row, column=1, sticky="w", padx=5, pady=2)
        row += 1

        # Bind close event to cleanup
        def on_close():
            top.destroy()

        top.protocol("WM_DELETE_WINDOW", on_close)

    def import_code(self):
        """Import JSON code into the editor."""
        show_import_dialog(self)

    def export_code(self):
        """Export the current workspace to JSON."""
        show_exported_json(self)

    def apply_code_changes(self):
        """Apply changes from the code editor to the workspace."""
        try:
            json_text = self.code_output_text.get("1.0", tk.END)
            data = json.loads(json_text)
            workspace_load(self, data)
            self.logger.log_info("Code", "Applied code changes from editor")
        except json.JSONDecodeError as e:
            self.logger.log_error("Code", f"Invalid JSON: {e}")
            tk.messagebox.showerror("Error", f"Invalid JSON: {e}")
        except Exception as e:
            self.logger.log_error("Code", f"Failed to apply changes: {e}")
            tk.messagebox.showerror("Error", f"Failed to apply changes: {e}")



    def refresh_ui(self):
        """Refresh the UI and code preview."""
        self.update_code_preview()

    def place_initial_blocks(self):
        """Place the initial MOD block."""
        # Defer to allow canvas to size
        self.master.after(100, self.block_mover._create_mod_at_center)

    def _resize_c_block_for_contents(self, block_id):
        """
        Recalculates the height AND WIDTH of a container block (MOD, RULES, SUBROUTINE)
        based on the blocks nested inside it.
        """
        if block_id not in self.all_blocks:
            return

        block = self.all_blocks[block_id]
        btype = block.get("type")
        
        # Only resize container blocks
        if btype not in ["MOD", "RULES", "SUBROUTINE", "C_OUTER", "C_SHAPED"]:
            return

        # --- HEIGHT CALCULATION (Vertical Stacking) ---
        # Used for MOD and SUBROUTINE which stack RULES/BLOCKS vertically
        total_height = 0
        min_inner_height = 80
        
        # For RULES, we have fixed slots for Conditions and Actions
        # The height is determined by the number of rows, but currently we just have 2 fixed rows
        # So RULES height is mostly fixed, but we might want to expand if we had vertical lists
        # But wait, Actions/Conditions are horizontal chains.
        
        if btype == "RULES":
            # RULES has a fixed height structure: Header + Conditions Row + Actions Row
            # We don't resize height based on children for RULES, unless we support multiple rows
            # For now, fixed height
            block["height"] = 130



            # --- WIDTH CALCULATION (Horizontal Stacking) ---
            # We need to check the width of the Conditions chain and Actions chain
            # and expand the RULES block to fit them.
            
            max_width = 350 # Minimum width
            
            # Check Conditions Chain
            cond_width = 0
            # Find the head of the conditions chain (snapped to the top slot)
            # We need to find which block is snapped to the "Conditions" slot
            # In Block_Mover, we set 'nested_in' or similar.
            # Actually, we can iterate through all blocks and find who is nested in this RULE
            # and is a CONDITION type and is the HEAD of a chain (no left connection)
            
            # Optimization: The block might store references to its slot occupants?
            # If not, we search.
            
            for child_id in block.get("nested_blocks", []):
                child = self.all_blocks.get(child_id)
                if not child: continue
                
                # Check if this is a head of a horizontal chain
                # (No 'docked_to' means it's the start of a chain)
                if "docked_to" not in child:
                    # Calculate chain width
                    chain_width = 0
                    curr = child
                    while curr:
                        chain_width += curr.get("width", 100)
                        # Move to next docked block
                        if "docked_blocks" in curr and curr["docked_blocks"]:
                            # Assuming simple linear chain for now
                            next_id = curr["docked_blocks"][0]
                            curr = self.all_blocks.get(next_id)
                        else:
                            curr = None
                    
                    # Add padding
                    chain_width += 150 # Padding for label + start offset
                    max_width = max(max_width, chain_width)
            
            block["width"] = max_width

        else:
            # Standard Vertical Containers (MOD, SUBROUTINE)
            # Calculate total height of nested blocks
            
            # Find the first block in the nested chain
            first_child_id = None
            if "nested_blocks" in block and block["nested_blocks"]:
                candidates = set(block["nested_blocks"])
                for child_id in list(candidates):
                    child = self.all_blocks.get(child_id)
                    if child and child.get("previous_block") in candidates:
                        candidates.remove(child_id)
                if candidates:
                    first_child_id = list(candidates)[0]

            if first_child_id:
                current_id = first_child_id
                while current_id:
                    if current_id not in self.all_blocks:
                        break
                    child = self.all_blocks[current_id]
                    total_height += child.get("height", 40)
                    current_id = child.get("next_block")
            
            # Update inner height
            new_inner_height = max(min_inner_height, total_height + 20) # Add padding
            block["inner_height"] = new_inner_height
            
            header_height = 45
            bottom_bar = 22
            block["height"] = header_height + new_inner_height + bottom_bar
        
        # Redraw this block
        self.draw_block(block_id)
        self.update_block_position(block_id)
        
        # If this block is itself nested, resize its parent
        if block.get("nested_in"):
            self._resize_c_block_for_contents(block["nested_in"])

    def on_search_change(self, *args):
        """Filter categories and blocks based on search text."""
        search_text = self.search_var.get().lower().strip()
        
        # If search is empty, restore everything
        if not search_text:
            # Repack all categories in original order
            for cat_name in self.data_manager.get_image_data().keys():
                if cat_name in self.tab_buttons:
                    # Skip legacy/internal categories if they shouldn't be in the main menu
                    if cat_name in ["MOD", "CONDITIONS", "ACTIONS", "EVENTS", "VALUES", "MATH"]:
                        continue
                    
                    is_sub = cat_name in ["RULES", "CONDITIONS"] 
                    pad_left = 20 if is_sub else 6
                    self.tab_buttons[cat_name].pack(fill="x", padx=(pad_left, 6), pady=1)
            
            # If a category is currently selected, re-render its list to show all items
            if hasattr(self, 'current_selected_tab') and self.current_selected_tab:
                self.render_sidebar_list(self.current_selected_tab)
            return

        # Filter Categories
        visible_categories = set()
        
        # 1. Check category names
        for cat_name in self.tab_buttons.keys():
            if search_text in cat_name.lower():
                visible_categories.add(cat_name)
        
        # 2. Check block names within categories
        block_data = self.data_manager.block_data
        for cat_name, cat_data in block_data.items():
            if not isinstance(cat_data, dict):
                continue
                
            # Check sub_categories
            sub_cats = cat_data.get("sub_categories", {})
            for sub_name, blocks in sub_cats.items():
                if search_text in sub_name.lower():
                    visible_categories.add(cat_name)
                
                if isinstance(blocks, dict):
                    for block_id, block_def in blocks.items():
                        if not isinstance(block_def, dict): continue
                        label = block_def.get("label", block_id).lower()
                        if search_text in label or search_text in block_id.lower():
                            visible_categories.add(cat_name)
                            
        # Update Sidebar Visibility
        for cat_name, btn_frame in self.tab_buttons.items():
            if cat_name in visible_categories:
                btn_frame.pack(fill="x", padx=(6, 6), pady=1)
            else:
                btn_frame.pack_forget()
                
        # If the currently selected tab is visible, filter its list too
        if hasattr(self, 'current_selected_tab') and self.current_selected_tab in visible_categories:
            self.render_sidebar_list(self.current_selected_tab, filter_text=search_text)

    def show_canvas_context_menu(self, event):
        """Show context menu for the canvas background."""
        # Create context menu
        menu = tk.Menu(self.master, tearoff=0, bg="#2d2d2d", fg="white")
        
        # Calculate canvas coordinates from screen coordinates
        canvas_x = self.canvas.canvasx(event.x)
        canvas_y = self.canvas.canvasy(event.y)
        
        menu.add_command(
            label="Add Rule Here", 
            command=lambda: self.block_mover.spawn_block("RULES", "RULE_HEADER", position=(canvas_x, canvas_y))
        )
        menu.add_command(
            label="Add Subroutine Here", 
            command=lambda: self.block_mover.spawn_block("SUBROUTINE", "SUBROUTINE_BLOCK", position=(canvas_x, canvas_y))
        )
        menu.add_separator()
        menu.add_command(
            label="Add Comment", 
            command=lambda: self.block_mover.spawn_block("OTHER", "Comment", position=(canvas_x, canvas_y))
        )
        
        # Show menu
        try:
            menu.tk_popup(event.x_root, event.y_root)
        finally:
            menu.grab_release()

    def analyze_workspace(self):
        """Analyze the workspace for errors and suggestions."""
        # Placeholder for analysis logic
        # In the future, this will check for missing inputs, disconnected blocks, etc.
        # For now, just show a message
        tk.messagebox.showinfo("Analyze Workspace", "Analysis complete.\n\nNo errors found (Placeholder).")
        
if __name__ == "__main__":
    try:
        # Setup exception handling
        setup_exception_handler()
        
        root = tk.Tk()
        app = BlockEditor(root)
        
        # Log startup
        app.logger.log_info("App", "Application started successfully")
        
        root.mainloop()
    except Exception as e:
        # Fallback logging if app crashes before logger is ready
        print(f"CRITICAL ERROR: {e}")
        traceback.print_exc()
        with open("crash_log.txt", "w") as f:
            f.write(f"CRITICAL ERROR: {e}\n")
            traceback.print_exc(file=f)


