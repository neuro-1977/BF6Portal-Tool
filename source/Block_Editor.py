"""
LEGACY EDITOR (Tkinter)
-----------------------
This file contains the original Python/Tkinter implementation of the editor.
As of November 2025, the project is migrating to a Web/Blockly-based interface
(see `web_ui/` and `tools/launch_blockly.py`).

This file is kept for reference and data migration purposes.
"""

import tkinter as tk
from tkinter import ttk, messagebox, filedialog
import tkinter.font as tkfont
import tkinter.messagebox
import json
import os
import traceback

from resource_helper import get_asset_path
from Block_Data_Manager import BlockDataManager
from Sidebar_Manager import SidebarManager
from TopBar_Manager import TopBarManager
from editor_helpers import get_dropdown_items, update_code_output
from io_handlers import show_exported_json, show_import_dialog
from workspace_loader import load_blocks_from_json as workspace_load
from Block_Mover import BlockMover
from Zoom_Manager import ZoomManager
from Workspace_Analyzer import WorkspaceAnalyzer
from Code_Generator import CodeGenerator
from Block_Renderer import BlockRenderer
from Input_Handler import InputHandler
# from Snap_Handler import SnapHandler  # Not used - Portal-style blocks connect via proximity
from Help_System import HelpSystem
from Error_Logger import get_logger, setup_exception_handler, log_tkinter_errors


class BlockEditor:
    # A block-based visual programming editor using Tkinter.
    # This version implements drag-and-drop chaining for Action and Control blocks.
    Blocks move as a connected chain, automatically decouple on drag, and snap
        def spawn_default_scene():
            print("[DEBUG] Spawning default scene (horizontal chain)...")
            # MOD block
            mod_def = {
                "label": "MOD",
                "type": "MOD",
                "color": self.data_manager.palette_color_map.get("MOD", "#4A4A4A"),
                "args": {}
            }
            mod_id = self.get_new_block_id()
            self.all_blocks[mod_id] = {
                **mod_def,
                "id": mod_id,
                "x": 30,
                "y": 100,
                "width": 120,
                "height": 50,
                "canvas_obj": None,
                "widgets": [],
                "next_block": None,
            }
            print(f"[DEBUG] Created MOD block: {mod_id}")
            # RULE block, snapped to right of MOD
            rule_def = {
                "label": "set gamemode",
                "type": "RULES",
                "color": self.data_manager.palette_color_map.get("RULES", "#7E3F96"),
                "args": {"rule_name": "set gamemode", "event_type": "OnPlayerInteract", "scope": "Global"}
            }
            rule_id = self.get_new_block_id()
            self.all_blocks[rule_id] = {
                **rule_def,
                "id": rule_id,
                "x": 170,
                "y": 100,
                "width": 180,
                "height": 50,
                "canvas_obj": None,
                "widgets": [],
                "next_block": None,
            }
            self.all_blocks[mod_id]["next_block"] = rule_id
            print(f"[DEBUG] Created RULE block: {rule_id}, snapped to right of MOD {mod_id}")
            # CONDITION block, snapped to right of RULE
            cond_def = {
                "label": "Equal",
                "type": "CONDITIONS",
                "color": self.data_manager.palette_color_map.get("CONDITIONS", "#0277BD"),
                "args": {"function": "Equal"}
            }
            cond_id = self.get_new_block_id()
            self.all_blocks[cond_id] = {
                **cond_def,
                "id": cond_id,
                "x": 370,
                "y": 100,
                "width": 120,
                "height": 50,
                "canvas_obj": None,
                "widgets": [],
                "next_block": None,
            }
            self.all_blocks[rule_id]["next_block"] = cond_id
            print(f"[DEBUG] Created CONDITION block: {cond_id}, snapped to right of RULE {rule_id}")
            # Draw all blocks in chain
            for bid in [mod_id, rule_id, cond_id]:
                print(f"[DEBUG] Drawing block: {bid}, type: {self.all_blocks[bid]['type']}, next: {self.all_blocks[bid].get('next_block')}")
                self.draw_block(bid)
                self.update_block_position(bid)
            print(f"[DEBUG] All blocks after spawn: {list(self.all_blocks.keys())}")
        try:
            self.sidebar_manager = SidebarManager(self)
        except Exception as e:
            self.logger.log_error("Initialization", "Failed to load SidebarManager", e)
            raise

        # Initialize TopBarManager
        try:
            self.top_bar_manager = TopBarManager(self)
        except Exception as e:
            self.logger.log_error("Initialization", "Failed to load TopBarManager", e)
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
        
        self.zoom_slider = None
        self.zoom_label = None

        # --- UI Setup ---
        # Setup top bar FIRST so it packs at the top (minimal controls only)
        self.workspace_name = workspace_name
        self.top_bar_manager.setup_top_bar(self.master, workspace_name=self.workspace_name)
        
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

        # Bind events - Delegate directly to InputHandler
        if self.input_handler:
            self.canvas.bind("<ButtonPress-1>", self.input_handler.on_block_press)
            self.canvas.bind("<ButtonRelease-1>", self.input_handler.on_block_release)
            self.canvas.bind("<B1-Motion>", self.input_handler.on_block_drag)
        
        # Bind right-click for canvas context menu
        self.canvas.bind("<Button-3>", self.show_canvas_context_menu)
        
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
            self.top_bar_manager.setup_zoom_controls()
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
        # Light wrapper delegating load to workspace_loader for separation of concerns.
        try:
            workspace_load(self, imported_data)
        except Exception:
            pass

    def get_new_block_id(self):
        # Generates a new unique ID.
        self.current_id += 1
        return f"block_{self.current_id}"

    def on_canvas_scroll(self, event):
        # Handle mousewheel scrolling on canvas.
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
        # Zoom in/out when Ctrl + MouseWheel is used.
        try:
            if event.delta > 0:
                self.zoom_in()
            else:
                self.zoom_out()
        except Exception:
            pass

    def draw_grid(self):
        # Draw a background grid on the canvas based on current zoom.
        # Grid lines are tagged with 'grid' so they can be cleared/redrawn.
        if self.block_renderer:
            self.block_renderer.draw_grid()

    def center_canvas_view(self):
        # Scroll the canvas so the center of the workspace is visible.
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
        # Set zoom to new_scale (relative to current) and scale canvas contents.
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
            # We need to be careful here. The canvas.scale() call above already moved the canvas objects (polygons, text).
            # But it DOES NOT move window objects (widgets).
            # And update_block_position() redraws the polygon based on block["x"], which we just updated.
            # So we might be double-moving or conflicting.
            
            # Better approach for Zoom:
            # 1. Update logical coordinates (block["x"], etc)
            # 2. Redraw everything from scratch at new scale
            # This is safer than trying to scale existing objects + move widgets separately
            
            for bid in list(self.all_blocks.keys()):
                try:
                    # Force a full redraw of the block at the new position/scale
                    self.block_renderer.draw_block(bid)
                    
                    # Update widget positions explicitly
                    # Widgets are not scaled by canvas.scale(), so we must move them
                    self.block_renderer.update_widget_position(bid)
                except Exception as e:
                    print(f"Error updating block {bid} during zoom: {e}")

            # Refresh scrollregion
            try:
                self.canvas.configure(scrollregion=self.canvas.bbox("all"))
                self.update_scrollbars()
            except Exception:
                pass
            # keep slider/label in sync
            try:
                if self.zoom_slider:
                    self.zoom_slider.set(self.zoom_scale)
                if self.zoom_label:
                    self.zoom_label.config(text=f"{int(self.zoom_scale * 100)}%")
            except Exception:
                pass
            
            # Redraw grid to match new zoom
            self.draw_grid()
        except Exception:
            pass

    def zoom_in(self):
        # Zoom in - delegates to ZoomManager.
        if self.zoom_manager:
            self.zoom_manager.zoom_in()
        else:
            self.set_zoom(min(3.0, self.zoom_scale * 1.15))

    def zoom_out(self):
        # Zoom out - delegates to ZoomManager.
        if self.zoom_manager:
            self.zoom_manager.zoom_out()
        else:
            self.set_zoom(max(0.25, self.zoom_scale / 1.15))

    def reset_zoom(self):
        # Reset zoom to 100% - delegates to ZoomManager.
        if self.zoom_manager:
            self.zoom_manager.reset_zoom()
        else:
            try:
                self.set_zoom(1.0)
            except Exception:
                pass

    def update_scrollbars(self):
        # Show/hide scrollbars based on canvas content.
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
        # Sets up the left sidebar with collapsible category menus (Portal-style).
        self.sidebar_manager.setup_sidebar(parent)


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
                text="Regenerate Code",
                command=self.update_code_preview,
                bg="#4CAF50",
                fg="white",
                font=("Arial", 9, "bold"),
                activebackground="#388E3C",
                activeforeground="white",
                bd=0,
            )
            apply_code_btn.pack(side="left", padx=2)
            
            reset_ui_btn = tk.Button(
                code_button_frame,
                text="Reset UI",
                command=self.reset_workspace,
                bg="#F44336",
                fg="white",
                font=("Arial", 9, "bold"),
                activebackground="#D32F2F",
                activeforeground="white",
                bd=0,
            )
            reset_ui_btn.pack(side="left", padx=2)

            refresh_btn = tk.Button(
                code_button_frame,
                text="Refresh",
                command=self.redraw_all_blocks,
                bg="#2196F3",
                fg="white",
                font=("Arial", 9, "bold"),
                activebackground="#1976D2",
                activeforeground="white",
                bd=0,
            )
            refresh_btn.pack(side="left", padx=2)

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
            self.is_code_pane_visible = True

    def on_splitter_press(self, event):
        # Handle splitter press event.
        self.splitter_drag_data["x"] = event.x_root

    def on_splitter_drag(self, event):
        # Handle splitter drag to resize right pane.
        dx = event.x_root - self.splitter_drag_data["x"]
        new_width = max(200, self.right_pane_width - dx)  # Min width 200px
        self.right_code_frame.config(width=new_width)
        self.right_pane_width = new_width
        self.splitter_drag_data["x"] = event.x_root

    def toggle_code_pane(self):
        # Toggles the visibility of the right-hand code output pane.
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



    # Sidebar logic moved to Sidebar_Manager.py
    # on_tab_click, show_dropdown, hide_dropdown, render_sidebar_list removed.

    def draw_block(self, block_id):
        # Draws or updates the visual representation of a block.
        if self.block_renderer:
            self.block_renderer.draw_block(block_id)

    def _create_block_widgets(self, block_id):
        # Creates the Tkinter widgets (Label, Entry) for a block.
        if self.block_renderer:
            self.block_renderer._create_block_widgets(block_id)

    def spawn_block_from_sidebar(self, tab_name, action_key):
        # Spawn a block based on the selected sidebar item.
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
        # Show dialog to create a new SUBROUTINE container block.
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
                if self.sidebar_manager.current_dropdown_tab == "SUBROUTINE":
                    self.sidebar_manager.render_sidebar_list("SUBROUTINE")

    def spawn_subroutine_pill(self, subroutine_id):
        # Spawn a pill-shaped connector version of an existing SUBROUTINE.
        # The pill can be dragged into RULES blocks to reference the subroutine.
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

    # Legacy dropdown and panel placement methods removed.
    # SidebarManager now handles block spawning directly.

    def update_code_output(self):
        # Deprecated: moved to `editor_helpers.update_code_output`
        try:
            update_code_output(self)
        except Exception:
            pass

    def get_snapped_children(self, block_id):
        # Returns a list of all block IDs connected to the given block_id,
        # including the block itself, any blocks connected to 'next',
        # any nested blocks, and any docked blocks (horizontal) (recursively).
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
        # Returns a list of block IDs in the chain starting from start_block_id.
        chain = []
        current_id = start_block_id
        while current_id and current_id in self.all_blocks:
            chain.append(current_id)
            current_id = self.all_blocks[current_id].get("next_block")
        return chain

    def update_code_preview(self):
        # Updates the code preview window.
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
        # Updates the position of a block and its associated canvas objects/widgets.
        if self.block_renderer:
            self.block_renderer.update_block_position(block_id)

    def show_block_help(self, block_id):
        # Show help popup for a block.
        # block_id: The ID of the block to show help for
        if self.help_system:
            try:
                self.help_system.show_help(block_id)
            except Exception as e:
                print(f"Error showing help: {e}")

    def add_subroutine_to_block(self, parent_id):
        # Add a new subroutine block nested within a parent block.
        # parent_id: The ID of the parent RULES block
        if parent_id not in self.all_blocks:
            return
        
        parent = self.all_blocks[parent_id]
        
        # Position the subroutine inside the parent
        sub_x = parent['x'] + 50
        sub_y = parent['y'] + 60
        
        # Create subroutine block
        sub_id = self.get_new_block_id()
        # Use color from data manager if available, else fallback to Yellow
        sub_color = self.data_manager.IMAGE_DATA.get("SUBROUTINE", "#FBC02D")
        
        self.all_blocks[sub_id] = {
            'id': sub_id,
            'label': 'Subroutine',
            'type': 'SUBROUTINE',
            'color': sub_color,
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
        # Delete a single block and reconnect its neighbors if possible.
        if block_id not in self.all_blocks:
            return
            
        block = self.all_blocks[block_id]
        
        # Remove from parent's nested/docked lists
        self._remove_from_parent(block)
        
        # Remove widgets/canvas items
        # Delete all canvas items associated with this block ID (including ghosts, headers, etc.)
        self.canvas.delete(block_id)
        
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
        # Delete a block and everything connected to it.
        children = self.get_snapped_children(block_id)
        for child_id in children:
            if child_id in self.all_blocks:
                self.delete_block(child_id)

    def _remove_from_parent(self, block):
        # Helper to remove block from its parent's lists.
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
        # Show a dialog with block properties.
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
        # Import JSON code into the editor.
        show_import_dialog(self)

    def export_code(self):
        # Export the current workspace to JSON.
        show_exported_json(self)

    def apply_code_changes(self):
        # Apply changes from the code editor to the workspace.
        try:
            json_text = self.code_output_text.get("1.0", tk.END)
            data = json.loads(json_text)
            workspace_load(self, data)
            self.logger.log_info("Code", "Applied code changes from editor")
        except json.JSONDecodeError as e:
            self.logger.log_error("Code", f"Invalid JSON: {e}")
            messagebox.showerror("Error", f"Invalid JSON: {e}")
        except Exception as e:
            self.logger.log_error("Code", f"Failed to apply changes: {e}")
            messagebox.showerror("Error", f"Failed to apply changes: {e}")



    def reset_workspace(self):
        # Resets the workspace to the default state.
        if messagebox.askyesno("Reset UI", "Are you sure you want to reset the workspace? Unsaved changes will be lost."):
            self.canvas.delete("all")
            self.draw_grid()
            self.all_blocks.clear()
            self.current_id = 0
            self.place_initial_blocks()
            self.update_code_preview()
            self.logger.log_info("Workspace", "Workspace reset to default")

    def redraw_all_blocks(self):
        # Forces a complete redraw of all blocks to fix visual glitches.
        self.canvas.delete("all")
        # Re-draw grid
        self.draw_grid()
        
        # Re-draw all blocks
        # Sort by ID to maintain some order, or just iterate
        # We need to be careful about z-order.
        # Ideally we should traverse the tree, but iterating all_blocks is safer for orphans.
        for block_id in self.all_blocks:
            self.block_renderer.draw_block(block_id)
            
        self.logger.log_info("Workspace", "Forced redraw of all blocks")

    def refresh_ui(self):
        # Refresh the UI and code preview.
        self.update_code_preview()

    def place_initial_blocks(self):
        # Place the initial MOD, RULE, and CONDITION blocks as default scene, matching the provided screenshot.
        def spawn_default_scene():
            print("[DEBUG] Spawning default scene...")
            # MOD block
            mod_def = {
                "label": "MOD",
                "type": "MOD",
                "color": self.data_manager.palette_color_map.get("MOD", "#4A4A4A"),
                "args": {}
            }
            mod_id = self.get_new_block_id()
            self.all_blocks[mod_id] = {
                **mod_def,
                "id": mod_id,
                "x": 30,
                "y": 30,
                "width": 220,
                "height": 180,
                "canvas_obj": None,
                "widgets": [],
                "nested_blocks": [],
            }
            print(f"[DEBUG] Created MOD block: {mod_id}")
            # RULE block (named 'ammo', event 'OnPlayerInteract')
            rule_def = {
                "label": "ammo",
                "type": "RULES",
                "color": self.data_manager.palette_color_map.get("RULES", "#7E3F96"),
                "args": {"rule_name": "ammo", "event_type": "OnPlayerInteract", "scope": "Global"}
            }
            rule_id = self.get_new_block_id()
            self.all_blocks[rule_id] = {
                **rule_def,
                "id": rule_id,
                "x": 80,
                "y": 60,
                "width": 600,
                "height": 120,
                "canvas_obj": None,
                "widgets": [],
                "parent_id": mod_id,
                "nested_blocks": [],
            }
            self.all_blocks[mod_id]["nested_blocks"].append(rule_id)
            print(f"[DEBUG] Created RULE block: {rule_id}, parent: {mod_id}")
            # (CONDITIONS block is now optional and not created by default)
            # Draw all blocks
            for bid in [mod_id, rule_id]:
                print(f"[DEBUG] Drawing block: {bid}, type: {self.all_blocks[bid]['type']}, parent: {self.all_blocks[bid].get('parent_id')}, children: {self.all_blocks[bid].get('nested_blocks')}")
                self.draw_block(bid)
                self.update_block_position(bid)
            print(f"[DEBUG] All blocks after spawn: {list(self.all_blocks.keys())}")
        self.master.after(100, spawn_default_scene)

    def _resize_c_block_for_contents(self, block_id):
        # Recalculates the height AND WIDTH of a container block (MOD, RULES, SUBROUTINE)
        # based on the blocks nested inside it.
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

    # on_search_change moved to Sidebar_Manager.py

    def show_canvas_context_menu(self, event):
        # Show context menu for the canvas background.
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
        # Analyze the workspace for errors and suggestions.
        analyzer = WorkspaceAnalyzer(self)
        issues = analyzer.analyze()
        
        if not issues:
            messagebox.showinfo("Analyze Workspace", "Analysis complete.\n\nNo issues found! Great job.")
            return

        # Create a results window
        result_window = tk.Toplevel(self.master)
        result_window.title("Analysis Results")
        result_window.geometry("600x400")
        result_window.configure(bg="#1e1e1e")
        
        # Header
        header = tk.Label(
            result_window, 
            text=f"Found {len(issues)} Issue(s)", 
            font=("Arial", 14, "bold"),
            bg="#1e1e1e", 
            fg="white"
        )
        header.pack(pady=10)
        
        # List area
        list_frame = tk.Frame(result_window, bg="#1e1e1e")
        list_frame.pack(fill="both", expand=True, padx=10, pady=5)
        
        scrollbar = tk.Scrollbar(list_frame)
        scrollbar.pack(side="right", fill="y")
        
        # Treeview for issues
        columns = ("type", "message")
        tree = ttk.Treeview(
            list_frame, 
            columns=columns, 
            show="headings", 
            yscrollcommand=scrollbar.set,
            selectmode="browse"
        )
        
        tree.heading("type", text="Type")
        tree.heading("message", text="Message")
        
        tree.column("type", width=80, anchor="center")
        tree.column("message", width=450, anchor="w")
        
        tree.pack(side="left", fill="both", expand=True)
        scrollbar.config(command=tree.yview)
        
        # Style for treeview
        style = ttk.Style()
        style.configure("Treeview", rowheight=25)
        
        # Populate list
        for issue in issues:
            icon = "❌" if issue["type"] == "error" else "⚠️"
            tree.insert("", "end", values=(f"{icon} {issue['type'].upper()}", issue["message"]), tags=(issue["type"],))
            
        tree.tag_configure("error", foreground="#ff5252")
        tree.tag_configure("warning", foreground="#ffb74d")
        
        # Close button
        close_btn = tk.Button(
            result_window,
            text="Close",
            command=result_window.destroy,
            bg="#444",
            fg="white",
            width=15
        )
        close_btn.pack(pady=10)
        
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


