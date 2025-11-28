import math
import tkinter as tk
from block_hierarchy import BlockHierarchy
from block_shapes import BlockShapes

SNAP_DISTANCE = 30  # pixels - reduced for tighter snapping control


class BlockMover:
    """Handles spawning and simple snapping behavior for blocks.

    This class operates against the `editor` (BlockEditor instance) and keeps
    all logic out of the main UI file. It creates new entries in
    `editor.all_blocks` and relies on the editor's existing drawing/drag
    handlers to maintain behaviour.
    """

    def __init__(self, editor):
        self.editor = editor
        self._connection_handlers = {
            "MOD": self._define_mod_connections,
            "RULES": self._define_rules_connections,
            "C_OUTER": self._define_rules_connections, # C_OUTER uses same as RULES
            "SUBROUTINE": self._define_subroutine_connections,
            "C_SHAPED": self._define_c_shaped_connections,
            "CONDITIONS": self._define_conditions_connections,
            "ACTIONS": self._define_actions_connections,
            "SEQUENCE": self._define_sequence_connections,
            "EVENTS": self._define_events_connections,
            "VALUE": self._define_value_connections,
            "LOGIC": self._define_value_connections,
            "MATH": self._define_value_connections,
            "ARRAYS": self._define_value_connections,
            "PLAYER": self._define_value_connections,
            "GAMEPLAY": self._define_value_connections,
            "TRANSFORM": self._define_value_connections,
        }

    def _define_mod_connections(self, block, x, y, width, height):
        header_height = 22
        block["statement_inputs"] = [{
            "x": x + 22,
            "y": y + header_height, 
            "type": "statement", 
            "accepts": ["RULES", "C_OUTER", "SUBROUTINE"] 
        }]

    def _define_rules_connections(self, block, x, y, width, height):
        header_height = 35
        block["statement_inputs"] = [
            { "x": x + 40, "y": y + header_height + 5, "type": "statement", "accepts": ["CONDITIONS"] },
            { "x": x + 40, "y": y + header_height + 45, "type": "statement", "accepts": ["ACTIONS"] }
        ]
        block["connection_previous"] = {"x": x + 20, "y": y, "type": "statement"}
        block["connection_next"] = {"x": x + 20, "y": y + height, "type": "statement", "accepts": ["RULES", "C_OUTER", "SUBROUTINE"]}

    def _define_subroutine_connections(self, block, x, y, width, height):
        header_height = 45
        block["statement_inputs"] = [{
            "x": x + 30, 
            "y": y + header_height, 
            "type": "statement", 
            "accepts": ["ACTIONS", "CONDITIONS", "SEQUENCE", "C_SHAPED"]
        }]
        block["connection_previous"] = {"x": x + 20, "y": y, "type": "statement"}
        block["connection_next"] = {"x": x + 20, "y": y + height, "type": "statement", "accepts": ["RULES", "C_OUTER", "SUBROUTINE"]}

    def _define_c_shaped_connections(self, block, x, y, width, height):
        header_height = 45
        block["statement_inputs"] = [{
            "x": x + 30, 
            "y": y + header_height, 
            "type": "statement", 
            "accepts": ["ACTIONS", "CONDITIONS", "SEQUENCE", "C_SHAPED"]
        }]
        block["connection_previous"] = {"x": x + 20, "y": y, "type": "statement"}
        block["connection_next"] = {"x": x + 20, "y": y + height, "type": "statement", "accepts": ["ACTIONS", "CONDITIONS", "SEQUENCE", "C_SHAPED"]}

    def _define_conditions_connections(self, block, x, y, width, height):
        header_height = 35
        block["statement_inputs"] = [{
            "x": x + 30, 
            "y": y + header_height, 
            "type": "statement", 
            "accepts": ["EVENTS", "LOGIC", "SEQUENCE"]
        }]
        block["connection_previous"] = {"x": x + 20, "y": y, "type": "statement"}
        block["connection_left"] = {"x": x, "y": y + height/2, "type": "horizontal"}
        block["connection_right"] = {"x": x + width, "y": y + height/2, "type": "horizontal", "accepts": ["CONDITIONS"]}
        block["connection_next"] = None

    def _define_actions_connections(self, block, x, y, width, height):
        header_height = 35
        block["statement_inputs"] = [{
            "x": x + 30, 
            "y": y + header_height, 
            "type": "statement", 
            "accepts": ["EVENTS", "SEQUENCE"]
        }]
        block["connection_previous"] = {"x": x + 20, "y": y, "type": "statement"}
        block["connection_left"] = {"x": x, "y": y + height/2, "type": "horizontal"}
        block["connection_right"] = {"x": x + width, "y": y + height/2, "type": "horizontal", "accepts": ["ACTIONS"]}
        block["connection_next"] = None

    def _define_sequence_connections(self, block, x, y, width, height):
        block["connection_previous"] = {"x": x + 20, "y": y, "type": "statement"}
        block["connection_next"] = {"x": x + 20, "y": y + height, "type": "statement", "accepts": ["EVENTS", "SEQUENCE", "ACTIONS", "CONDITIONS"]}
        
        # EVENTS, ACTIONS, and CONDITIONS snap horizontally (Left/Right)
        btype = block.get("type")
        if btype == "EVENTS" or block.get("category") == "ACTIONS" or block.get("category") == "CONDITIONS" or btype == "CONDITIONS":
            block["connection_left"] = {"x": x, "y": y + height/2, "type": "horizontal"}
            block["connection_right"] = {"x": x + width, "y": y + height/2, "type": "horizontal", "accepts": ["EVENTS", "SEQUENCE", "ACTIONS", "CONDITIONS"]}
            block["connection_next"] = None

    def _define_events_connections(self, block, x, y, width, height):
        # EVENTS block behave like SEQUENCE but are often horizontal
        self._define_sequence_connections(block, x, y, width, height)

    def _define_value_connections(self, block, x, y, width, height):
        block["connection_output"] = {"x": x, "y": y + 10, "type": "value"}

    def spawn_block(self, tab_name, action_key=None, position=None):
        """Spawn a new block (by tab/category and optional action_key).
        
        Args:
            tab_name: The category name (e.g. "RULES", "AI")
            action_key: The specific block ID (e.g. "AIBattlefieldBehavior")
            position: Optional (x, y) tuple for spawn location. If None, spawns at center view.
        """
        # Resolve a block definition from BlockDataManager
        defn = None
        try:
            data = self.editor.data_manager.block_data.get(tab_name)
            if data is None:
                # Nothing known for this tab
                defn = {"label": tab_name, "type": tab_name, "color": self.editor.data_manager.palette_color_map.get(tab_name, "#CCCCCC"), "args": {}}
            else:
                if action_key and isinstance(data, dict):
                    # Search through nested structure (sub_categories and direct categories)
                    defn = self._find_block_definition(data, action_key)
                    if not defn:
                        print(f"Warning: Could not find definition for '{action_key}' in {tab_name}")
                        # Fallback
                        defn = {"label": action_key, "type": "SEQUENCE", "color": self.editor.data_manager.palette_color_map.get(tab_name, "#CCCCCC"), "args": {}}
                    else:
                        print(f"Found block definition: {defn.get('label', 'NO_LABEL')} type={defn.get('type', 'NO_TYPE')}")
                else:
                    # If action_key not provided, try to pick a default
                    if isinstance(data, dict) and len(data) > 0:
                        # Skip metadata keys like 'color', 'sub_categories'
                        for key, val in data.items():
                            if key not in ['color', 'sub_categories'] and isinstance(val, dict) and 'label' in val:
                                defn = val
                                break
                        # Also check sub_categories for a default
                        if not defn and 'sub_categories' in data:
                            for sub in data['sub_categories'].values():
                                if isinstance(sub, dict) and len(sub) > 0:
                                    # Pick first block in first sub-category
                                    first_key = list(sub.keys())[0]
                                    defn = sub[first_key]
                                    break
                                    
                        if not defn:
                            defn = {"label": tab_name, "type": "SEQUENCE", "color": self.editor.data_manager.palette_color_map.get(tab_name, "#CCCCCC"), "args": {}}
                    else:
                        defn = data
        except Exception as e:
            print(f"Error resolving block definition: {e}")
            defn = {"label": tab_name, "type": tab_name, "color": self.editor.data_manager.palette_color_map.get(tab_name, "#CCCCCC"), "args": {}}

        # Don't auto-create MOD - let user spawn blocks independently and snap them together manually
        # This matches Portal behavior where blocks are spawned separately then snapped

        # Determine spawn position
        if position:
            cx, cy = position
            # Adjust so (x,y) is top-left or center? 
            # Usually context menu click is the top-left of the new block
            # But let's center it on the cursor for better feel
            cx += self.editor.CHILD_BLOCK_WIDTH / 2
            cy += self.editor.CHILD_BLOCK_HEIGHT / 2
        else:
            # Compute center of current canvas view
            canvas = self.editor.canvas
            try:
                view_left = canvas.canvasx(0)
                view_top = canvas.canvasy(0)
                view_w = canvas.winfo_width()
                view_h = canvas.winfo_height()
                cx = view_left + view_w / 2
                cy = view_top + view_h / 2
            except Exception:
                # Fallback to arbitrary position
                cx, cy = 100, 100

        # Create the block
        self._create_block_at(cx - self.editor.CHILD_BLOCK_WIDTH / 2, cy - self.editor.CHILD_BLOCK_HEIGHT / 2, defn, tab_name)

    def _find_block_definition(self, data, action_key):
        """Recursively search for block definition by action_key in nested structure."""
        if not isinstance(data, dict):
            return None
        
        # Check if action_key is directly in this dict
        if action_key in data and isinstance(data[action_key], dict):
            val = data[action_key]
            # Make sure it's a block definition (has 'label' or 'type')
            if 'label' in val or 'type' in val:
                return val
        
        # Search in sub_categories
        if 'sub_categories' in data and isinstance(data['sub_categories'], dict):
            for category_name, category_data in data['sub_categories'].items():
                if isinstance(category_data, dict) and action_key in category_data:
                    val = category_data[action_key]
                    if isinstance(val, dict) and ('label' in val or 'type' in val):
                        return val
        
        # Search in any nested dicts (for direct categories like AI/Behaviour)
        for key, val in data.items():
            if key not in ['color', 'sub_categories'] and isinstance(val, dict):
                # Check if this nested dict contains our action_key
                if action_key in val and isinstance(val[action_key], dict):
                    block_def = val[action_key]
                    if 'label' in block_def or 'type' in block_def:
                        return block_def
        
        return None

    def spawn_block_from_menu(self, tab_name, action_key=None):
        """Spawn a block invoked from the sidebar list menu."""
        try:
            self.spawn_block(tab_name, action_key)
        except Exception as e:
            print(f"Error spawning block: {e}")
            import traceback
            traceback.print_exc()

    def _create_mod_at_center(self):
        """Create a default MOD block at the center of the view."""
        mod_def = None
        try:
            mods = self.editor.data_manager.block_data.get("MOD")
            if isinstance(mods, dict):
                # Try to find in sub_categories first
                if "sub_categories" in mods:
                    for cat_name, cat_data in mods["sub_categories"].items():
                        for key, val in cat_data.items():
                            if isinstance(val, dict) and ("label" in val or "type" in val):
                                mod_def = val
                                break
                        if mod_def: break
                
                # If not found, try direct children
                if not mod_def:
                    for key, val in mods.items():
                        if key not in ['color', 'sub_categories'] and isinstance(val, dict) and 'label' in val:
                            mod_def = val
                            break
            
            if not mod_def:
                mod_def = {"label": "MOD", "type": "MOD", "color": "#4A4A4A", "args": []}
        except Exception:
            mod_def = {"label": "MOD", "type": "MOD", "color": "#4A4A4A", "args": []}

        # place near center but slightly left so other blocks can snap to it
        canvas = self.editor.canvas
        try:
            view_left = canvas.canvasx(0)
            view_top = canvas.canvasy(0)
            view_w = canvas.winfo_width()
            view_h = canvas.winfo_height()
            cx = view_left + view_w / 2 - 150
            cy = view_top + view_h / 2
        except Exception:
            cx, cy = 100, 100

        self._create_block_at(cx - self.editor.CHILD_BLOCK_WIDTH / 2, cy - self.editor.CHILD_BLOCK_HEIGHT / 2, mod_def, "MOD")

    def _create_block_at(self, x, y, defn, tab_name="UNKNOWN"):
        """Create a new block dictionary in editor.all_blocks and draw it.

        This uses the editor's public API (`get_new_block_id`, `draw_block`,
        `update_block_position`) so the UI remains authoritative for rendering
        and event handling.
        """
        editor = self.editor
        bid = editor.get_new_block_id()

        # Normalize definition - ensure we have a proper dict with label
        if not isinstance(defn, dict):
            defn = {"label": str(defn), "type": "SEQUENCE", "args": {}}
        
        if "label" not in defn or not defn["label"]:
            # If no label, try to use a sensible default
            defn["label"] = defn.get("type", "Block")
        
        label = defn.get("label", "Unknown")
        btype = defn.get("type", "SEQUENCE")
        # Don't normalize - keep original type name from JSON
        
        # Get color from definition, or from category color, or from palette
        color = defn.get("color")
        if not color or color.startswith("#") == False or len(color) != 7:
            # Try to get color from the category data
            category_data = editor.data_manager.block_data.get(tab_name, {})
            if isinstance(category_data, dict) and "color" in category_data:
                color = category_data["color"]
            else:
                color = editor.data_manager.palette_color_map.get(tab_name, "#CCCCCC")
        
        # Extract parameter labels and icons from definition
        param_labels = defn.get("param_labels", {}) if isinstance(defn, dict) else {}
        param_icons = defn.get("param_icons", {}) if isinstance(defn, dict) else {}
        
        # Extract input field properties (for Number, String, Boolean blocks)
        has_input_field = defn.get("has_input_field", False) if isinstance(defn, dict) else False
        input_type = defn.get("input_type", "text") if isinstance(defn, dict) else "text"
        default_value = defn.get("default_value", "") if isinstance(defn, dict) else ""
        
        # Extract dropdown properties (for Boolean and other choice blocks)
        has_dropdown = defn.get("has_dropdown", False) if isinstance(defn, dict) else False
        dropdown_values = defn.get("dropdown_values", []) if isinstance(defn, dict) else []
        
        # Extract args - can be either a dict or a list
        args_from_defn = defn.get("args", {})
        args = {}
        
        # Create inputs slots for parameters (Portal-style)
        inputs = {}
        if isinstance(args_from_defn, list):
            # Legacy format: args is a list of parameter names
            for param_name in args_from_defn:
                inputs[param_name] = {'block': None, 'type': 'any'} # Default to 'any' type
        elif isinstance(args_from_defn, dict):
            # New format: args is a dict with type info
            for param_name, param_info in args_from_defn.items():
                if isinstance(param_info, dict):
                    inputs[param_name] = {
                        'block': None,
                        'type': param_info.get('type', 'any'), # Store the type
                        'default': param_info.get('default') # Store default value
                    }
                else:
                    # Could be a legacy dict format, handle gracefully
                    inputs[param_name] = {'block': None, 'type': 'any'}
        
        print(f"Block '{label}' has {len(inputs)} input slots: {list(inputs.keys())}")

        # Determine dimensions based on block type
        # Check if definition specifies custom width/height
        custom_width = defn.get("width") if isinstance(defn, dict) else None
        custom_height = defn.get("height") if isinstance(defn, dict) else None
        # All blocks now similar size with consistent height (20% taller)
        if btype in BlockHierarchy.CONTAINER_BLOCKS:
            # C-shaped blocks (MOD, SUBROUTINE) - RULES is now simple background
            if btype == 'MOD':
                width = custom_width or 280
                inner_height = 240  # Taller
                height = 45 * 2 + inner_height
            elif btype == 'RULES':
                width = custom_width or 350
                inner_height = 0
                height = 130 # Taller to fit Conditions and Actions rows
            else:  # SUBROUTINE
                width = custom_width or 280
                inner_height = 150  # Taller
                color = '#CD853F'  # Light orange-brown
                height = 45 * 2 + inner_height  # Top bar + inner + bottom bar
        else:
            # Regular blocks - calculate width based on content
            # Calculate width based on label length and number of parameters
            label_width = len(label) * 7 + 20  # Tighter: 7px per char + minimal padding
            param_width = len(inputs) * 40  # 40px per parameter slot (was 50)
            calculated_width = max(label_width + param_width, 120)  # Minimum 120px (was 140)
            
            width = custom_width or calculated_width
            height = custom_height or 38  # Consistent height (was 42)
            inner_height = None
            
            # RULES is now a simple header block
            if btype == 'RULES' or tab_name == 'RULES':
                height = custom_height or 45  # Header height
                inner_height = 0  # No inner height

        # inputs dict was already created above from args

        
        block_data = {
            "id": bid,
            "label": label,
            "type": btype,
            "category": tab_name,  # Store category for reference
            "color": color,
            "x": int(x),
            "y": int(y),
            "width": width,
            "height": height,
            "canvas_obj": None,
            "widgets": [],
            "parent_id": None,
            "next_sibling_id": None,
            "nested_blocks": [],  # Track blocks nested inside containers
            "args": args,
            "param_labels": param_labels,  # Add parameter labels
            "param_icons": param_icons,    # Add parameter icons
            "inputs": inputs,  # Portal-style input slots
            "next": None,  # Portal-style next pointer for sequential blocks
            "has_input_field": has_input_field,  # Editable field for Number/String
            "input_type": input_type,  # Type of input (number, text)
            "default_value": default_value,  # Default value for input
            "has_dropdown": has_dropdown,  # Dropdown for Boolean/choices
            "dropdown_values": dropdown_values,  # Dropdown options
            "value": tk.StringVar(value=str(default_value)) if has_input_field or has_dropdown else None,  # Current value
        }
        
        # Add inner_height for C-shaped blocks
        if inner_height is not None:
            block_data['inner_height'] = inner_height

        editor.all_blocks[bid] = block_data

        # Record action for undo
        self.editor.undo_manager.record_action({
            "type": "create",
            "block_id": bid,
            "block_data": block_data
        })

        # Draw & position
        try:
            editor.draw_block(bid)
            editor.update_block_position(bid)
        except Exception:
            pass

        # Attempt a snap to nearby compatible blocks
        try:
            self._attempt_snap(bid)
        except Exception:
            pass

        # Refresh scroll region and code output
        try:
            editor.canvas.configure(scrollregion=editor.canvas.bbox("all"))
            editor.update_scrollbars()
            # Update live code preview
            if hasattr(editor, "update_code_preview"):
                editor.update_code_preview()
        except Exception:
            pass



    def update_connection_points(self, block_id):
        """Updates the connection points for a block based on its current position."""
        if block_id not in self.editor.all_blocks:
            return
            
        block = self.editor.all_blocks[block_id]
        x, y = block["x"], block["y"]
        width = block.get("width", 100)
        height = block.get("height", 40)
        btype = block.get("type", "SEQUENCE")
        
        # Clear existing connections
        block["connection_previous"] = None
        block["connection_next"] = None
        block["connection_output"] = None
        block["statement_inputs"] = []
        
        # Define connections based on type
        if btype == "MOD":
            # MOD only accepts RULES and SUBROUTINES
            header_height = 22 # Reduced from 45 to match visual bar thickness (22px)
            block["statement_inputs"] = [{
                "x": x + 22, # Aligned with left bar width (22px)
                "y": y + header_height, 
                "type": "statement", 
                "accepts": ["RULES", "C_OUTER", "SUBROUTINE"] 
            }]
            
        elif btype == "RULES" or btype == "C_OUTER":
            # RULES accepts CONDITIONS and ACTIONS in specific slots
            header_height = 35
            block["statement_inputs"] = [
                # Conditions Slot
                {
                    "x": x + 40, # Reduced from 100 to align closer to left edge
                    "y": y + header_height + 5, 
                    "type": "statement", 
                    "accepts": ["CONDITIONS"]
                },
                # Actions Slot
                {
                    "x": x + 40, # Reduced from 100
                    "y": y + header_height + 45, 
                    "type": "statement", 
                    "accepts": ["ACTIONS"]
                }
            ]
            # RULES can snap to MOD (Previous connection)
            block["connection_previous"] = {"x": x + 20, "y": y, "type": "statement"}
            # RULES can have a next block (another RULE or SUBROUTINE)
            block["connection_next"] = {"x": x + 20, "y": y + height, "type": "statement", "accepts": ["RULES", "C_OUTER", "SUBROUTINE"]}

        elif btype == "SUBROUTINE":
             # SUBROUTINE accepts ACTIONS, CONDITIONS, SEQUENCE, C_SHAPED
            header_height = 45
            block["statement_inputs"] = [{
                "x": x + 30, 
                "y": y + header_height, 
                "type": "statement", 
                "accepts": ["CONDITIONS", "ACTIONS", "SEQUENCE", "C_SHAPED"]
            }]
            # SUBROUTINE connects like a RULE (Previous/Next)
            block["connection_previous"] = {"x": x + 20, "y": y, "type": "statement"}
            block["connection_next"] = {"x": x + 20, "y": y + height, "type": "statement", "accepts": ["RULES", "C_OUTER", "SUBROUTINE"]}
            
        elif btype == "C_SHAPED":
             # C-shaped control blocks (If, While, For)
            header_height = 45
            block["statement_inputs"] = [{
                "x": x + 30, 
                "y": y + header_height, 
                "type": "statement", 
                "accepts": ["ACTIONS", "CONDITIONS", "SEQUENCE", "C_SHAPED"]
            }]
            # Can snap to previous (top)
            block["connection_previous"] = {"x": x + 20, "y": y, "type": "statement"}
            # Can have next (bottom)
            block["connection_next"] = {"x": x + 20, "y": y + height, "type": "statement", "accepts": ["ACTIONS", "CONDITIONS", "SEQUENCE", "C_SHAPED"]}

        elif btype == "CONDITIONS":
            # CONDITIONS accepts EVENTS (Logic/Comparison)
            header_height = 35
            block["statement_inputs"] = [{
                "x": x + 30, 
                "y": y + header_height, 
                "type": "statement", 
                "accepts": ["EVENTS", "LOGIC", "SEQUENCE"]
            }]
            # Snaps to RULES
            block["connection_previous"] = {"x": x + 20, "y": y, "type": "statement"}
            # CONDITIONS snap horizontally in Portal
            block["connection_left"] = {"x": x, "y": y + height/2, "type": "horizontal"}
            block["connection_right"] = {"x": x + width, "y": y + height/2, "type": "horizontal", "accepts": ["CONDITIONS"]}
            # Disable vertical next
            block["connection_next"] = None

        elif btype == "ACTIONS":
            # ACTIONS accepts EVENTS (Action Payloads)
            header_height = 35
            block["statement_inputs"] = [{
                "x": x + 30, 
                "y": y + header_height, 
                "type": "statement", 
                "accepts": ["EVENTS", "SEQUENCE"]
            }]
            # Snaps to RULES
            block["connection_previous"] = {"x": x + 20, "y": y, "type": "statement"}
            # ACTIONS snap horizontally in Portal
            block["connection_left"] = {"x": x, "y": y + height/2, "type": "horizontal"}
            block["connection_right"] = {"x": x + width, "y": y + height/2, "type": "horizontal", "accepts": ["ACTIONS"]}
            # Disable vertical next
            block["connection_next"] = None

        elif btype in ["SEQUENCE", "EVENTS", "CONDITIONS", "ACTIONS"]:
            # Statement blocks: Previous (Top) and Next (Bottom)
            block["connection_previous"] = {"x": x + 20, "y": y, "type": "statement"}
            block["connection_next"] = {"x": x + 20, "y": y + height, "type": "statement", "accepts": ["EVENTS", "SEQUENCE", "ACTIONS", "CONDITIONS"]}
            
            # EVENTS, ACTIONS, and CONDITIONS snap horizontally (Left/Right)
            is_horizontal = False
            if btype == "EVENTS" or block.get("category") == "ACTIONS" or block.get("category") == "CONDITIONS" or btype == "CONDITIONS":
                is_horizontal = True
                block["connection_left"] = {"x": x, "y": y + height/2, "type": "horizontal"}
                block["connection_right"] = {"x": x + width, "y": y + height/2, "type": "horizontal", "accepts": ["EVENTS", "SEQUENCE", "ACTIONS", "CONDITIONS"]}
                
                # If it's a horizontal block, disable vertical next to force horizontal chaining
                # But keep previous so it can snap INTO a container (which uses statement input)
                block["connection_next"] = None

        elif btype in ["VALUE", "LOGIC", "MATH", "ARRAYS", "PLAYER", "GAMEPLAY", "TRANSFORM"]:
            # Value blocks: Output (Left)
            block["connection_output"] = {"x": x, "y": y + 10, "type": "value"}

    def _attempt_snap(self, new_bid):
        """Blockly-style snapping algorithm.
        
        Handles two types of connections:
        1. STATEMENT connections (previous/next): Vertical stacking of statement blocks
        2. VALUE connections (output/input): Value blocks into parameter slots
        """
        # Update connections for the dragged block
        self.update_connection_points(new_bid)
        
        new_block = self.editor.all_blocks.get(new_bid)
        if not new_block:
            return

        new_type = new_block.get("type")
        SNAP_THRESHOLD = 50  # Reduced threshold for precision
        
        # Update connections for ALL other blocks to ensure targets are fresh
        # (Optimization: could be done only for visible blocks)
        for bid in self.editor.all_blocks:
            if bid != new_bid:
                self.update_connection_points(bid)
        
        # Try STATEMENT snapping first (previous/next connections for vertical stacking)
        if new_block.get("connection_previous"):
            # This block has a PREVIOUS connection - can snap to NEXT or STATEMENT_INPUT
            prev_conn = new_block["connection_previous"]
            
            # Check for vertical stacking (connect to another block's NEXT connection)
            for bid, target in self.editor.all_blocks.items():
                if bid == new_bid:
                    continue
                
                # Try snapping to target's NEXT connection
                if target.get("connection_next"):
                    next_conn = target["connection_next"]
                    accepted = next_conn.get("accepts", [])
                    
                    # Allow snapping if type matches or generic SEQUENCE
                    if new_type in accepted or "SEQUENCE" in accepted:
                        # Calculate distance
                        px, py = prev_conn.get("x", 0), prev_conn.get("y", 0)
                        nx, ny = next_conn.get("x", 0), next_conn.get("y", 0)
                        distance = math.hypot(px - nx, py - ny)
                        
                        if distance < SNAP_THRESHOLD:
                            # Snap below the target block
                            new_block['x'] = target['x']
                            new_block['y'] = target['y'] + target['height']
                            
                            # Handle insertion (splice into chain)
                            old_next = target.get('next_block')
                            if old_next and old_next in self.editor.all_blocks:
                                new_block['next_block'] = old_next
                                self.editor.all_blocks[old_next]['previous_block'] = new_bid
                                
                            new_block['previous_block'] = bid
                            target['next_block'] = new_bid
                            
                            # Update positions
                            self.editor.draw_block(new_bid)
                            self.editor.update_block_position(new_bid)
                            return True
                
                # Try snapping into container's STATEMENT_INPUT
                for stmt_input in target.get("statement_inputs", []):
                    accepted = stmt_input.get("accepts", [])
                    
                    if new_type in accepted or "SEQUENCE" in accepted:
                        # Calculate distance
                        px, py = prev_conn.get("x", 0), prev_conn.get("y", 0)
                        ix, iy = stmt_input.get("x", 0), stmt_input.get("y", 0)
                        distance = math.hypot(px - ix, py - iy)
                        
                        if distance < SNAP_THRESHOLD:
                            # Snap into container's statement input
                            indent = 20 # Align with container inner tab (x + 20 + 15 = x + 35)
                            new_block['x'] = int(ix) - 10 # ix is x+30, we want x+20
                            new_block['y'] = int(iy) # Remove gap

                            new_block['parent_id'] = bid
                            new_block['nested_in'] = bid  # Critical for grouping
                            
                            # Add to nested blocks
                            if 'nested_blocks' not in target:
                                target['nested_blocks'] = []
                            if new_bid not in target['nested_blocks']:
                                target['nested_blocks'].append(new_bid)
                            
                            # Redraw parent to update bars (hide them when nested)
                            self.editor.draw_block(bid)
                            self.editor.update_block_position(bid)
                            self.editor.draw_block(new_bid)
                            self.editor.update_block_position(new_bid)
                            
                            # Resize parent container
                            self.editor._resize_c_block_for_contents(bid)
                            
                            # Ensure child is on top of parent (Z-order fix)
                            self.editor.canvas.tag_raise(new_bid)
                            self.editor.canvas.tag_raise(f"{new_bid} && widget_window")
                            
                            return True
        
        # Try VALUE snapping (value blocks into parameter slots)
        if new_block.get("connection_output"):
            # This is a value block - try snapping into parameter slots
            output_conn = new_block["connection_output"]
            
            for bid, target in self.editor.all_blocks.items():
                if bid == new_bid:
                    continue
                
                # Check target's value inputs (parameter slots)
                inputs = target.get("inputs", {})
                for i, (param_name, input_slot) in enumerate(inputs.items()):
                    # Skip if slot already filled
                    if input_slot.get('block'):
                        continue
                    
                    # Get accurate slot position from the renderer
                    slot_x, slot_y = self.editor.block_renderer.get_parameter_slot_position(bid, i)

                    ox, oy = output_conn.get("x", 0), output_conn.get("y", 0)
                    distance = math.hypot(ox - slot_x, oy - slot_y)
                    
                    if distance < SNAP_THRESHOLD:
                        # TYPE CHECK
                        dragged_type = new_block.get('label')
                        slot_type = input_slot.get('type')
                        
                        if slot_type == 'any' or dragged_type == slot_type:
                            # Snap into parameter slot
                            input_slot['block'] = new_bid
                            new_block['nested_in_param'] = (bid, param_name)
                            
                            # Redraw parent to hide the widget and show the block
                            self.editor.draw_block(bid)
                            self.editor.update_block_position(bid)
                            
                            # Also move the value block to the correct position
                            new_block['x'] = slot_x - 5 # Small offset to align output notch
                            new_block['y'] = slot_y - (new_block['height'] / 2)
                            self.editor.draw_block(new_bid)
                            self.editor.update_block_position(new_bid)
                            
                            return True

        # Try HORIZONTAL snapping (Events docking into Actions/Conditions)
        if "connection_left" in new_block:
            left_conn = new_block["connection_left"]
            
            for bid, target in self.editor.all_blocks.items():
                if bid == new_bid:
                    continue
                
                if "connection_right" in target:
                    right_conn = target["connection_right"]
                    accepted = right_conn.get("accepts", [])
                    
                    if new_type in accepted:
                        # Calculate distance
                        lx, ly = left_conn.get("x", 0), left_conn.get("y", 0)
                        rx, ry = right_conn.get("x", 0), right_conn.get("y", 0)
                        distance = math.hypot(lx - rx, ly - ry)
                        
                        if distance < SNAP_THRESHOLD:
                            # Snap to the right of the target
                            # Use exact width for flush fit (puzzle tabs handle the overlap)
                            new_block['x'] = target['x'] + target['width']
                            new_block['y'] = target['y']
                            
                            # Docking relationship
                            if 'docked_blocks' not in target:
                                target['docked_blocks'] = []
                            target['docked_blocks'].append(new_bid)
                            new_block['docked_to'] = bid
                            
                            # Update positions
                            self.editor.draw_block(new_bid)
                            self.editor.update_block_position(new_bid)
                            return True
        
        return False

    def get_snap_target(self, new_bid):
        """Returns the potential snap target for visual feedback.
        
        Returns:
            tuple: (target_id, snap_type, is_valid) or None
        """
        self.update_connection_points(new_bid)
        new_block = self.editor.all_blocks.get(new_bid)
        if not new_block:
            return None

        new_type = new_block.get("type")
        SNAP_THRESHOLD = 50
        
        # Check all potential targets
        for bid, target in self.editor.all_blocks.items():
            if bid == new_bid:
                continue
            
            # 1. Statement Snapping (Next)
            if new_block.get("connection_previous") and target.get("connection_next"):
                prev_conn = new_block["connection_previous"]
                next_conn = target["connection_next"]
                px, py = prev_conn.get("x", 0), prev_conn.get("y", 0)
                nx, ny = next_conn.get("x", 0), next_conn.get("y", 0)
                
                if math.hypot(px - nx, py - ny) < SNAP_THRESHOLD:
                    accepted = next_conn.get("accepts", [])
                    is_valid = new_type in accepted or "SEQUENCE" in accepted
                    return (bid, "next", is_valid)

            # 2. Statement Snapping (Container Input)
            if new_block.get("connection_previous"):
                prev_conn = new_block["connection_previous"]
                for stmt_input in target.get("statement_inputs", []):
                    px, py = prev_conn.get("x", 0), prev_conn.get("y", 0)
                    ix, iy = stmt_input.get("x", 0), stmt_input.get("y", 0)
                    
                    if math.hypot(px - ix, py - iy) < SNAP_THRESHOLD:
                        accepted = stmt_input.get("accepts", [])
                        is_valid = new_type in accepted or "SEQUENCE" in accepted
                        return (bid, "statement_input", is_valid)

            # 3. Horizontal Snapping
            if "connection_left" in new_block and "connection_right" in target:
                left_conn = new_block["connection_left"]
                right_conn = target["connection_right"]
                lx, ly = left_conn.get("x", 0), left_conn.get("y", 0)
                rx, ry = right_conn.get("x", 0), right_conn.get("y", 0)
                
                if math.hypot(lx - rx, ly - ry) < SNAP_THRESHOLD:
                    accepted = right_conn.get("accepts", [])
                    is_valid = new_type in accepted
                    return (bid, "horizontal", is_valid)

            # 4. Value Snapping
        if new_block.get("connection_output"):
            output_conn = new_block["connection_output"]
            ox, oy = output_conn.get("x", 0), output_conn.get("y", 0)

            for bid, target in self.editor.all_blocks.items():
                if bid == new_bid:
                    continue

                inputs = target.get("inputs", {})
                if not inputs:
                    continue

                for i, (param_name, slot) in enumerate(inputs.items()):
                    if slot.get('block'):
                        continue

                    slot_x, slot_y = self.editor.block_renderer.get_parameter_slot_position(bid, i)
                    
                    distance = math.hypot(ox - slot_x, oy - slot_y)

                    if distance < SNAP_THRESHOLD:
                        # TYPE CHECK
                        dragged_type = new_block.get('label')
                        slot_type = slot.get('type')
                        is_valid = (slot_type == 'any' or dragged_type == slot_type)
                        return (bid, "value_input", is_valid, param_name)
        
        return None
