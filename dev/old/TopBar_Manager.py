import tkinter as tk
from tkinter import ttk
import tkinter.font as tkfont

class TopBarManager:
    def __init__(self, editor):
        self.editor = editor
        self.top_bar_frame = None
        self.palette_content_frame = None
        self.active_tab_label = None
        self.TOP_BAR_HEIGHT = 50

    def setup_top_bar(self, parent, workspace_name="BF6 Workspace"):
        """Sets up the minimal top bar for import/export and zoom controls, with workspace name and red reset button."""
        self.top_bar_frame = tk.Frame(
            parent, bg="#0a0a0a", height=self.TOP_BAR_HEIGHT
        )
        self.top_bar_frame.pack(fill="x", side="top")
        
        # Store reference in editor for compatibility
        self.editor.top_bar_frame = self.top_bar_frame

        initial_color = self.editor.data_manager.palette_color_map.get(
            self.editor.data_manager.current_tab_name
        )
        
        # Compute heading font height
        try:
            heading_font = tkfont.Font(family="Arial", size=11, weight="bold")
            heading_height = heading_font.metrics("linespace")
            self.editor.ICON_HEIGHT = max(heading_height, 20)
        except Exception:
            pass

        # Create references for compatibility with BlockDataManager
        self.palette_content_frame = tk.Frame(self.top_bar_frame, bg=initial_color)
        self.editor.palette_content_frame = self.palette_content_frame
        
        self.active_tab_label = tk.Label(
            self.palette_content_frame,
            text=f"Active Tab: {self.editor.data_manager.current_tab_name}",
            bg=initial_color,
            fg="white",
            font=("Arial", 9, "bold"),
        )
        self.editor.active_tab_label = self.active_tab_label
        self.active_tab_label.pack(side="left", padx=10)
        self.palette_content_frame.pack(side="left", fill="y")

        # Workspace name/title label
        title_label = tk.Label(
            self.top_bar_frame,
            text=workspace_name,
            font=("Arial", 16, "bold"),
            bg="#232323",
            fg="#FFD700",
            padx=16,
        )
        title_label.pack(side="left", padx=8)

        # right-side controls: Import, Export, Reset
        btn_pixel_width = max(80, int(self.editor.ICON_WIDTH * 0.6))

        import_frame = tk.Frame(
            self.top_bar_frame, width=btn_pixel_width, height=self.editor.ICON_HEIGHT, bg="#0a0a0a"
        )
        import_frame.pack_propagate(False)
        import_btn = tk.Button(
            import_frame,
            text="Import JSON",
            command=self.editor.import_code,
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
            self.top_bar_frame, width=btn_pixel_width, height=self.editor.ICON_HEIGHT, bg="#0a0a0a"
        )
        export_frame.pack_propagate(False)
        export_btn = tk.Button(
            export_frame,
            text="Export JSON",
            command=self.editor.export_code,
            bg="#2196F3",
            fg="white",
            font=("Arial", 10, "bold"),
            activebackground="#1976D2",
            activeforeground="white",
            bd=0,
        )
        export_btn.pack(expand=True, fill="both")
        export_frame.pack(side="right", padx=4, pady=6)

        # Analyze Button
        analyze_frame = tk.Frame(
            self.top_bar_frame, width=btn_pixel_width, height=self.editor.ICON_HEIGHT, bg="#0a0a0a"
        )
        analyze_frame.pack_propagate(False)
        analyze_btn = tk.Button(
            analyze_frame,
            text="Analyze",
            command=self.editor.analyze_workspace,
            bg="#2196F3",
            fg="white",
            font=("Arial", 10, "bold"),
            activebackground="#1976D2",
            activeforeground="white",
            bd=0,
        )
        analyze_btn.pack(expand=True, fill="both")
        analyze_frame.pack(side="right", padx=(4, 6), pady=6)

        # Redo Button
        redo_frame = tk.Frame(
            self.top_bar_frame, width=btn_pixel_width, height=self.editor.ICON_HEIGHT, bg="#0a0a0a"
        )
        redo_frame.pack_propagate(False)
        redo_btn = tk.Button(
            redo_frame,
            text="Redo",
            command=self.editor.undo_manager.redo,
            bg="#03A9F4",
            fg="white",
            font=("Arial", 10, "bold"),
            activebackground="#0288D1",
            activeforeground="white",
            bd=0,
        )
        redo_btn.pack(expand=True, fill="both")
        redo_frame.pack(side="right", padx=4, pady=6)

        # Undo Button
        undo_frame = tk.Frame(
            self.top_bar_frame, width=btn_pixel_width, height=self.editor.ICON_HEIGHT, bg="#0a0a0a"
        )
        undo_frame.pack_propagate(False)
        undo_btn = tk.Button(
            undo_frame,
            text="Undo",
            command=self.editor.undo_manager.undo,
            bg="#03A9F4",
            fg="white",
            font=("Arial", 10, "bold"),
            activebackground="#0288D1",
            activeforeground="white",
            bd=0,
        )
        undo_btn.pack(expand=True, fill="both")
        undo_frame.pack(side="right", padx=4, pady=6)

        # Reset Button (red, rightmost)
        reset_frame = tk.Frame(
            self.top_bar_frame, width=btn_pixel_width, height=self.editor.ICON_HEIGHT, bg="#0a0a0a"
        )
        reset_frame.pack_propagate(False)
        reset_btn = tk.Button(
            reset_frame,
            text="Reset",
            command=self.editor.reset_workspace,
            bg="#D32F2F",
            fg="white",
            font=("Arial", 10, "bold"),
            activebackground="#B71C1C",
            activeforeground="white",
            bd=0,
        )
        reset_btn.pack(expand=True, fill="both")
        reset_frame.pack(side="right", padx=8, pady=6)

    def setup_zoom_controls(self):
        """Creates a floating zoom control panel in the bottom-right of the canvas."""
        zoom_frame = tk.Frame(self.editor.canvas_frame, bg="#1a1a1a", relief="raised", bd=1)
        # Place in bottom-right corner with some padding
        zoom_frame.place(relx=1.0, rely=1.0, anchor="se", x=-20, y=-20)

        try:
            minus_btn = tk.Button(
                zoom_frame,
                text="-",
                command=self.editor.zoom_out,
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
                    self.editor.set_zoom(float(v))
                except Exception:
                    pass

            self.editor.zoom_slider = ttk.Scale(
                zoom_frame,
                orient="horizontal",
                from_=0.25,
                to=3.0,
                value=self.editor.zoom_scale,
                command=on_zoom_change,
                length=100,
            )
            self.editor.zoom_slider.pack(side="left", padx=2, pady=4)
            
            # Store reference in ZoomManager
            if self.editor.zoom_manager:
                self.editor.zoom_manager.zoom_slider = self.editor.zoom_slider

            # percentage label
            self.editor.zoom_label = tk.Label(
                zoom_frame,
                text=f"{int(self.editor.zoom_scale * 100)}%",
                bg="#1a1a1a",
                fg="white",
                font=("Arial", 9),
                width=4
            )
            self.editor.zoom_label.pack(side="left", padx=(2, 4), pady=4)
            
            # Store reference in ZoomManager
            if self.editor.zoom_manager:
                self.editor.zoom_manager.zoom_label = self.editor.zoom_label

            plus_btn = tk.Button(
                zoom_frame,
                text="+",
                command=self.editor.zoom_in,
                bg="#2d2d2d",
                fg="white",
                bd=0,
                width=2,
                cursor="hand2"
            )
            plus_btn.pack(side="left", padx=(2, 4), pady=4)

        except Exception:
            pass
