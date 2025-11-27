import json
import tkinter as tk  # Imported for type hints on the UI instance
from pathlib import Path
from resource_helper import get_asset_path


class BlockDataManager:
    """
    Manages all data, state, and core logic for the Block Editor (The Model).
    This class is independent of Tkinter widgets and only interacts with the UI
    to fetch required values or push state updates.
    """

    def __init__(self, ui_instance):
        """
        Initializes the manager.

        Args:
            ui_instance: The BlockEditor (Tkinter) instance. Used for accessing
                         and updating necessary UI elements.
        """
        # Store a reference to the main UI class
        self.ui = ui_instance
        self.BLOCK_DATA_PATH = get_asset_path("assets")

        # --- Load Theme Data ---
        self.IMAGE_DATA = {}
        self.ICON_PATHS = {}
        self._load_theme_data()

        # MAPPING: Menu name to placeholder color (Fallback if load fails)
        if not self.IMAGE_DATA:
            self.IMAGE_DATA = {
                # Standard Portal Order
                "RULES": "#7E3F96",          # Purple
                "MOD": "#4A4A4A",            # Dark Grey (Wrapper)
                "LOGIC": "#4CAF50",          # Green
                "MATH": "#795548",           # Brown
                "ARRAYS": "#EF6C00",         # Orange (Updated from #9C27B0)
                "SUBROUTINE": "#FBC02D",     # Yellow
                "PLAYER": "#00695C",         # Teal
                "VEHICLES": "#558B2F",       # Light Green
                "GAMEPLAY": "#8D6E63",       # Brown
                "USER INTERFACE": "#039BE5", # Light Blue
                "AUDIO": "#AB47BC",          # Purple/Pink
                "EFFECTS": "#FBC02D",        # Yellow
                "CAMERA": "#00ACC1",         # Cyan
                "OBJECTIVE": "#F9A825",      # Gold
                "AI": "#D32F2F",             # Red
                "TRANSFORM": "#1565C0",      # Dark Blue
                "OTHER": "#757575",          # Grey
                
                # Legacy/Internal categories
                "EVENTS": "#2E7D32",
                "CONDITIONS": "#0277BD",
                "ACTIONS": "#FBC02D",        # Yellow (Fixed from #FFC107 to match Effects/Subroutine style)
                "VALUES": "#0277BD",
            }

        # Map for quick color lookup (only color needed for the palette background)
        # Here IMAGE_DATA already maps to color values
        self.palette_color_map = {name: color for name, color in self.IMAGE_DATA.items()}
        self.current_tab_name = "RULES"  # Initial state

        # --- Dynamic Application State ---

    def _load_theme_data(self):
        """Loads theme colors and icon paths from assets/ui_theme.json."""
        theme_path = self.BLOCK_DATA_PATH / "ui_theme.json"
        try:
            if theme_path.exists():
                with open(theme_path, "r") as f:
                    data = json.load(f)
                    if "colors" in data:
                        self.IMAGE_DATA.update(data["colors"])
                    if "icons" in data:
                        self.ICON_PATHS = data["icons"]
        except Exception as e:
            print(f"Error loading theme data: {e}")

        # This dictionary would eventually hold all the blocks and their connections
        self.block_state = {}
        self.block_data = self._load_block_data()

    def _load_block_data(self):
        """Loads only official Portal block definitions from JSON files in the assets directory."""
        block_data = {}
        # Only include categories with valid data files (official Portal blocks)
        categories = [
            ("MOD", self.BLOCK_DATA_PATH / "mod_data.json"),
            ("RULES", self.BLOCK_DATA_PATH / "rules_data.json"),
            ("EVENTS", self.BLOCK_DATA_PATH / "events" / "event_data.json"),
            ("CONDITIONS", self.BLOCK_DATA_PATH / "conditions" / "condition_data.json"),
            ("ACTIONS", self.BLOCK_DATA_PATH / "actions" / "action_data.json"),
            ("AI", self.BLOCK_DATA_PATH / "ai" / "ai_data.json"),
            ("ARRAYS", self.BLOCK_DATA_PATH / "arrays" / "arrays_data.json"),
            ("AUDIO", self.BLOCK_DATA_PATH / "audio" / "audio_data.json"),
            ("CAMERA", self.BLOCK_DATA_PATH / "camera" / "camera_data.json"),
            ("EFFECTS", self.BLOCK_DATA_PATH / "effects" / "effects_data.json"),
            ("EMPLACEMENTS", self.BLOCK_DATA_PATH / "emplacements" / "emplacements_data.json"),
            ("GAMEPLAY", self.BLOCK_DATA_PATH / "gameplay" / "gameplay_data.json"),
            ("LOGIC", self.BLOCK_DATA_PATH / "logic" / "logic_data.json"),
            ("OBJECTIVE", self.BLOCK_DATA_PATH / "objective" / "objective_data.json"),
            ("OTHER", self.BLOCK_DATA_PATH / "other" / "other_data.json"),
            ("PLAYER", self.BLOCK_DATA_PATH / "player" / "player_data.json"),
            ("TRANSFORM", self.BLOCK_DATA_PATH / "transform" / "transform_data.json"),
            ("USER INTERFACE", self.BLOCK_DATA_PATH / "ui" / "ui_data.json"),
            ("VEHICLES", self.BLOCK_DATA_PATH / "vehicles" / "vehicles_data.json"),
            ("VALUES", self.BLOCK_DATA_PATH / "values" / "values_data.json"),
            ("MATH", self.BLOCK_DATA_PATH / "math" / "math_data.json"),
        ]
        for category_name, file_path in categories:
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    block_data[category_name] = json.load(f)
            except FileNotFoundError:
                continue  # Skip missing files (not official)
            except json.JSONDecodeError:
                print(f"Error: Invalid JSON in {file_path}")
        return block_data

    def get_image_data(self):
        """Return the color mapping used by the UI for menu blocks.

        Kept the function name for backwards compatibility but it now returns
        a mapping name -> color (no filenames).
        """
        return self.IMAGE_DATA

    def switch_tab_logic(self, tab_name):
        """
        Core logic for switching tabs: updates internal state and triggers necessary
        visual changes in the UI.

        Args:
            tab_name (str): The name of the tab being switched to.
        """
        if tab_name == self.current_tab_name:
            # Prevent unnecessary processing
            return

        self.current_tab_name = tab_name
        new_color = self.palette_color_map.get(tab_name, "#2d2d2d")

        # --- Triggering UI Updates via the stored reference ---

        # 1. Update the palette's background color
        self.ui.palette_content_frame.config(bg=new_color)

        # 2. Update the label inside the palette content
        self.ui.active_tab_label.config(text=f"Active Tab: {tab_name}", bg=new_color)

        # FUTURE: Logic here to load new block definitions into the palette display

        print(f"Logic: State updated to tab: {tab_name}.")

    def add_dynamic_block_definition(self, block_type, action_key, label):
        # Dynamic/legacy block addition is disabled for compatibility with official Portal blocks.
        print(f"[INFO] Dynamic block addition is disabled. Block '{action_key}' of type '{block_type}' not added.")

    def export_logic(self):
        """
        Gathers all current block state, converts it into a structured format (JSON),
        and returns the output string.
        """
        # Export the actual block state from the UI
        # We need to access the UI's all_blocks dictionary
        # Since BlockDataManager is initialized with ui_instance, we can access it
        
        blocks_export = {}
        rule_state_export = {}
        
        if hasattr(self.ui, 'all_blocks'):
            # Deep copy blocks to avoid serializing non-serializable objects (like tkinter widgets)
            for bid, block in self.ui.all_blocks.items():
                block_copy = block.copy()
                # Remove non-serializable keys
                for key in ['canvas_obj', 'widgets', 'value', 'args']:
                    if key in block_copy:
                        del block_copy[key]
                
                # Handle args separately (convert StringVars to values)
                args_export = {}
                if 'args' in block:
                    for k, v in block['args'].items():
                        if isinstance(v, tk.StringVar):
                            args_export[k] = v.get()
                        else:
                            args_export[k] = str(v)
                block_copy['args'] = args_export
                
                # Handle value separately
                if 'value' in block and isinstance(block['value'], tk.StringVar):
                    block_copy['value'] = block['value'].get()

                blocks_export[bid] = block_copy

        if hasattr(self.ui, 'rule_state'):
            for k, v in self.ui.rule_state.items():
                if isinstance(v, tk.StringVar):
                    rule_state_export[k] = v.get()
                else:
                    rule_state_export[k] = v

        export_data = {
            "version": "1.0.0",
            "blocks": blocks_export,
            "rule_state": rule_state_export
        }

        # Convert the Python dictionary to a formatted JSON string
        json_output = json.dumps(export_data, indent=4)

        # Return the raw JSON string
        return json_output
