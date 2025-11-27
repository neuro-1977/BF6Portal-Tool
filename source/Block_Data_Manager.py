import json
import tkinter as tk  # Imported for type hints on the UI instance
from pathlib import Path


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
        self.BLOCK_DATA_PATH = Path(__file__).parent.parent / "assets"

        # --- Load Theme Data ---
        self.IMAGE_DATA = {}
        self.ICON_PATHS = {}
        self._load_theme_data()

        # MAPPING: Menu name to placeholder color (Fallback if load fails)
        if not self.IMAGE_DATA:
            self.IMAGE_DATA = {
                "RULES": "#7E3F96",          # Purple
                "MOD": "#4A4A4A",            # Dark Grey (Wrapper)
                "SUBROUTINE": "#FBC02D",     # Yellow (User Request)
                "LOGIC": "#4CAF50",          # Green (User Request)
                "MATH": "#795548",           # Brown (User Request - inferred)
                "ARRAYS": "#9C27B0",         # Purple (User Request - inferred)
                "AI": "#D32F2F",             # Red
                "AUDIO": "#AB47BC",          # Purple/Pink
                "CAMERA": "#00ACC1",         # Cyan
                "EFFECTS": "#FBC02D",        # Yellow
                "EMPLACEMENTS": "#2E7D32",   # Green
                "GAMEPLAY": "#8D6E63",       # Brown
                "OBJECTIVE": "#F9A825",      # Gold
                "OTHER": "#757575",          # Grey
                "PLAYER": "#00695C",         # Teal
                "TRANSFORM": "#1565C0",      # Dark Blue
                "USER INTERFACE": "#039BE5", # Light Blue
                "VEHICLES": "#558B2F",       # Light Green
                # Legacy/Internal categories (kept for compatibility if needed)
                "EVENTS": "#2E7D32",
                "CONDITIONS": "#0277BD",
                "ACTIONS": "#FFC107",
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
        """Loads block definitions from JSON files in the assets directory."""
        block_data = {}
        # Map categories to their likely file paths
        # Note: Many of these files might not exist yet, which is fine (handled by try/except)
        categories = {
            "MOD": self.BLOCK_DATA_PATH / "mod_data.json",
            "RULES": self.BLOCK_DATA_PATH / "rules_data.json",
            "EVENTS": self.BLOCK_DATA_PATH / "events" / "event_data.json",
            "CONDITIONS": self.BLOCK_DATA_PATH / "conditions" / "condition_data.json",
            "ACTIONS": self.BLOCK_DATA_PATH / "actions" / "action_data.json",
            "AI": self.BLOCK_DATA_PATH / "ai" / "ai_data.json",
            "ARRAYS": self.BLOCK_DATA_PATH / "arrays" / "arrays_data.json",
            "AUDIO": self.BLOCK_DATA_PATH / "audio" / "audio_data.json",
            "CAMERA": self.BLOCK_DATA_PATH / "camera" / "camera_data.json",
            "EFFECTS": self.BLOCK_DATA_PATH / "effects" / "effects_data.json",
            "EMPLACEMENTS": self.BLOCK_DATA_PATH / "emplacements" / "emplacements_data.json",
            "GAMEPLAY": self.BLOCK_DATA_PATH / "gameplay" / "gameplay_data.json",
            "LOGIC": self.BLOCK_DATA_PATH / "logic" / "logic_data.json",
            "OBJECTIVE": self.BLOCK_DATA_PATH / "objective" / "objective_data.json",
            "OTHER": self.BLOCK_DATA_PATH / "other" / "other_data.json",
            "PLAYER": self.BLOCK_DATA_PATH / "player" / "player_data.json",
            "TRANSFORM": self.BLOCK_DATA_PATH / "transform" / "transform_data.json",
            "USER INTERFACE": self.BLOCK_DATA_PATH / "ui" / "ui_data.json",
            "VEHICLES": self.BLOCK_DATA_PATH / "vehicles" / "vehicles_data.json",
            "VALUES": self.BLOCK_DATA_PATH / "values" / "values_data.json",
            "MATH": self.BLOCK_DATA_PATH / "math" / "math_data.json",
        }

        for category_name, file_path in categories.items():
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    block_data[category_name] = json.load(f)
            except FileNotFoundError:
                print(f"Error: Block data file not found at {file_path}")
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
        """
        Dynamically adds a new block definition to the block_data structure if it doesn't exist.
        This allows new actions/conditions/events from imported JSON to be recognized.

        Args:
            block_type (str): The category of the block (e.g., "ACTIONS", "CONDITIONS", "EVENTS").
            action_key (str): The unique identifier for the block (e.g., "Action_GiveWeapon").
            label (str): The display label for the block.
        """
        if block_type not in self.block_data:
            # If the main category doesn't exist, initialize it
            self.block_data[block_type] = {"color": "#CCCCCC", "sub_categories": {}}

        # For ACTION, CONDITION, EVENT types, definitions are nested under "sub_categories"
        if block_type in ["ACTIONS", "CONDITIONS", "EVENTS"]:
            sub_categories = self.block_data[block_type].setdefault(
                "sub_categories", {}
            )
            custom_category = sub_categories.setdefault(
                "Custom Blocks", {}
            )  # Use "Custom Blocks" for dynamic additions

            if action_key not in custom_category:
                # Create a simple default definition for the new block
                new_block_definition = {
                    "label": label,
                    "type": block_type,  # This can be "ACTIONS", "CONDITIONS", etc. or a more specific type like "SEQUENCE"
                    "color": self.palette_color_map.get(
                        block_type, "#CCCCCC"
                    ),  # Default grey if type not in map
                    "args": {},  # Placeholder for now, could be expanded later
                }
                # Add the new definition directly to the Custom Blocks sub-category
                custom_category[action_key] = new_block_definition
                print(
                    f"Dynamically added new block definition: {block_type}/Custom Blocks/{action_key}"
                )
        else:
            # For MOD, RULES, etc., assuming a flatter structure
            # If block_data[block_type] is a list, convert to dict for consistent handling
            if isinstance(self.block_data[block_type], list):
                # This case is less expected if "MOD" and "RULES" are flat dicts, but defensive
                current_items = {
                    item.get("action_key"): item for item in self.block_data[block_type]
                }
                self.block_data[block_type] = current_items

            if action_key not in self.block_data[block_type]:
                new_block_definition = {
                    "label": label,
                    "type": block_type,
                    "color": self.palette_color_map.get(block_type, "#CCCCCC"),
                    "args": {},
                }
                self.block_data[block_type][action_key] = new_block_definition
                print(
                    f"Dynamically added new block definition: {block_type}/{action_key}"
                )

        # Note: To update dropdown menus immediately, the BlockEditor UI would need to be notified
        # This will be handled implicitly when the dropdown is next opened.

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
