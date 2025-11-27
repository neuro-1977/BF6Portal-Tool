"""
BLOCKLY MIGRATION TOOL
----------------------
This script bridges the gap between the legacy Python/Tkinter data format and the new Google Blockly web interface.

It performs the following:
1. Scans the `assets/` directory for existing JSON block definitions.
2. Maps internal types (ACTIONS, RULES, etc.) to Blockly shapes (Statement, Hat, Value).
3. Generates `web_ui/definitions.js` (Blockly block definitions).
4. Generates `web_ui/toolbox.js` (Sidebar menu structure).

Run this script whenever you update the JSON assets to refresh the Web UI.
"""

import json
import os
from pathlib import Path

# Map our internal types to Blockly shapes
TYPE_MAPPING = {
    "ACTIONS": {"type": "statement"},
    "SEQUENCE": {"type": "statement"},
    "VALUE": {"type": "value"},
    "MATH": {"type": "value"},
    "LOGIC": {"type": "value"},
    "ARRAYS": {"type": "value"},
    "PLAYER": {"type": "value"},
    "GAMEPLAY": {"type": "value"},
    "TRANSFORM": {"type": "value"},
    "VEHICLE": {"type": "value"},
    "CONDITIONS": {"type": "value", "check": "Boolean"},
    "EVENTS": {"type": "hat"}, 
    "MOD": {"type": "hat"},
    "RULES": {"type": "hat"},
    "SUBROUTINE": {"type": "hat"},
    "C_SHAPED": {"type": "statement", "nested": True}
}

# Define Category Order and Colors
CATEGORY_CONFIG = {
    "RULES": {"order": 1, "color": "#7B1FA2"}, # Purple
    "ACTIONS": {"order": 2, "color": "#FBC02D"}, # Yellow
    "CONDITIONS": {"order": 3, "color": "#43A047"}, # Green
    "SUBROUTINE": {"order": 4, "color": "#795548"}, # Brown
    "LOGIC": {"order": 5, "color": "#673AB7"}, # Violet (Control Flow)
    "MATH": {"order": 6, "color": "#1976D2"},
    "VALUES": {"order": 7, "color": "#0288D1"},
    "ARRAYS": {"order": 8, "color": "#0097A7"},
    "PLAYER": {"order": 9, "color": "#C2185B"},
    "VEHICLES": {"order": 10, "color": "#E64A19"},
    "GAMEPLAY": {"order": 11, "color": "#5D4037"},
    "UI": {"order": 12, "color": "#607D8B"},
    "AUDIO": {"order": 13, "color": "#455A64"},
    "CAMERA": {"order": 14, "color": "#37474F"},
    "EFFECTS": {"order": 15, "color": "#263238"},
    "TRANSFORM": {"order": 16, "color": "#212121"},
    "OTHER": {"order": 99, "color": "#9E9E9E"}
}

def create_rule_block_definition(color):
    """Creates the special definition for the Rule block."""
    return {
        "type": "Rule",
        "message0": "RULE %1 Event %2 %3",
        "args0": [
            {"type": "field_input", "name": "NAME", "text": "New Rule"},
            {"type": "field_dropdown", "name": "ONGOING", "options": [["Ongoing", "ONGOING"], ["One-off", "ONEOFF"]]},
            {"type": "field_dropdown", "name": "SCOPE", "options": [["Global", "GLOBAL"], ["Team", "TEAM"], ["Player", "PLAYER"]]}
        ],
        "message1": "Conditions %1",
        "args1": [{"type": "input_statement", "name": "CONDITIONS"}],
        "message2": "Actions %1",
        "args2": [{"type": "input_statement", "name": "ACTIONS"}],
        "colour": color,
        "tooltip": "Defines a game rule",
        "helpUrl": ""
    }

def generate_blockly_definitions(workspace_root):
    root = Path(workspace_root)
    assets_dir = root / "assets"
    
    block_definitions = []
    toolbox_categories = {} # Category -> {Subcategory -> [blocks]}

    print(f"Scanning {assets_dir}...")

    for category_dir in assets_dir.iterdir():
        if not category_dir.is_dir() or category_dir.name in ["img", "downloaded"]:
            continue
            
        cat_name = category_dir.name.upper()
        toolbox_categories[cat_name] = {}
        
        # Find json files
        for data_file in category_dir.glob("*_data.json"):
            try:
                with open(data_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                # Use configured color if available, else file color
                color = CATEGORY_CONFIG.get(cat_name, {}).get("color", data.get("color", "#333333"))
                
                # Handle subcategories
                if "sub_categories" in data:
                    for sub_name, blocks in data["sub_categories"].items():
                        if sub_name not in toolbox_categories[cat_name]:
                            toolbox_categories[cat_name][sub_name] = []
                            
                        for block_id, block_def in blocks.items():
                            
                            # SPECIAL HANDLING: RULE BLOCK
                            if block_id == "Rule":
                                b_def = create_rule_block_definition(color)
                                block_definitions.append(b_def)
                                toolbox_categories[cat_name][sub_name].append(block_id)
                                continue

                            # Create Blockly Definition
                            b_def = {
                                "type": block_id,
                                "message0": f"{block_def.get('label', block_id)}",
                                "args0": [],
                                "colour": color,
                                "tooltip": block_def.get("description", ""),
                                "helpUrl": ""
                            }
                            
                            b_type = block_def.get("type", "SEQUENCE")
                            mapping = TYPE_MAPPING.get(b_type, {"type": "statement"})
                            
                            # Inputs/Args
                            args = block_def.get("args", [])
                            msg_counter = 1
                            
                            # Handle Fields (Internal content like text boxes, dropdowns)
                            if block_def.get("has_input_field"):
                                b_def["message0"] += " %" + str(msg_counter)
                                input_type = block_def.get("input_type", "text")
                                field_type = "field_number" if input_type == "number" else "field_input"
                                
                                field_def = {
                                    "type": field_type,
                                    "name": "FIELD_VALUE",
                                    "text": str(block_def.get("default_value", ""))
                                }
                                b_def["args0"].append(field_def)
                                msg_counter += 1
                                
                            elif block_def.get("has_dropdown"):
                                b_def["message0"] += " %" + str(msg_counter)
                                options = []
                                for val in block_def.get("dropdown_values", []):
                                    options.append([str(val), str(val)])
                                    
                                field_def = {
                                    "type": "field_dropdown",
                                    "name": "FIELD_DROPDOWN",
                                    "options": options
                                }
                                b_def["args0"].append(field_def)
                                msg_counter += 1

                            if args:
                                b_def["message0"] += " "
                                for arg in args:
                                    b_def["message0"] += f"%{msg_counter} "
                                    
                                    # Determine arg type (simple for now)
                                    arg_def = {
                                        "type": "input_value",
                                        "name": arg
                                    }
                                    b_def["args0"].append(arg_def)
                                    msg_counter += 1

                            # Shape Logic
                            if mapping["type"] == "statement":
                                b_def["previousStatement"] = None
                                b_def["nextStatement"] = None
                                
                                if mapping.get("nested"):
                                    # Add the nested statement input
                                    b_def["message0"] += " %" + str(msg_counter)
                                    b_def["args0"].append({
                                        "type": "input_statement",
                                        "name": "DO"
                                    })
                                    
                            elif mapping["type"] == "value":
                                b_def["output"] = mapping.get("check", None)
                                
                            elif mapping["type"] == "hat":
                                b_def["nextStatement"] = None
                                # Hats usually don't have previous statement
                            
                            block_definitions.append(b_def)
                            toolbox_categories[cat_name][sub_name].append(block_id)
                            
            except Exception as e:
                print(f"Error processing {data_file}: {e}")

    # Load Help Data
    help_data = {}
    help_file = assets_dir / "block_help.json"
    if help_file.exists():
        try:
            with open(help_file, 'r', encoding='utf-8') as f:
                help_data = json.load(f)
        except Exception as e:
            print(f"Error loading help data: {e}")

    # Image Mapping (Simple heuristic for now)
    # Map generic types to specific images if available
    image_map = {
        "MOD": "assets/img/BF6Portal/mod help.jpg",
        "RULES": "assets/img/BF6Portal/ruleshelp.jpg",
        "CONDITIONS": "assets/img/BF6Portal/condition help.jpg",
        "ACTIONS": "assets/img/BF6Portal/control actions.jpg", # Fallback
        "EVENTS": "assets/img/BF6Portal/event payloads1.jpg",
        "MATH": "assets/img/BF6Portal/math1.jpg",
        "LOGIC": "assets/img/BF6Portal/logic1.jpg",
        "ARRAYS": "assets/img/BF6Portal/arrays.jpg",
        "AUDIO": "assets/img/BF6Portal/audio.jpg",
        "CAMERA": "assets/img/BF6Portal/camera.jpg",
        "EFFECTS": "assets/img/BF6Portal/effects.jpg",
        "GAMEPLAY": "assets/img/BF6Portal/gameplay1.jpg",
        "OBJECTIVE": "assets/img/BF6Portal/objective1.jpg",
        "PLAYER": "assets/img/BF6Portal/player 1.jpg",
        "TRANSFORM": "assets/img/BF6Portal/transform.jpg",
        "VEHICLE": "assets/img/BF6Portal/vehicle 1.jpg",
        "UI": "assets/img/BF6Portal/user interface1.jpg"
    }

    return block_definitions, toolbox_categories, help_data, image_map

def write_output(definitions, toolbox, help_data, image_map, output_dir):
    # Write definitions.js
    with open(os.path.join(output_dir, "definitions.js"), "w", encoding='utf-8') as f:
        f.write("Blockly.defineBlocksWithJsonArray(\n")
        json.dump(definitions, f, indent=2)
        f.write("\n);\n\n")
        
        # Write Help Data
        f.write("var BLOCK_HELP = ")
        json.dump(help_data, f, indent=2)
        f.write(";\n\n")
        
        # Write Image Map
        f.write("var BLOCK_IMAGES = ")
        json.dump(image_map, f, indent=2)
        f.write(";\n")
        
    # Write toolbox.js
    with open(os.path.join(output_dir, "toolbox.js"), "w", encoding='utf-8') as f:
        f.write("var TOOLBOX_CONFIG = {\n")
        f.write("  'kind': 'categoryToolbox',\n")
        f.write("  'contents': [\n")
        
        # Sort categories based on configuration
        sorted_cats = sorted(toolbox.items(), key=lambda item: CATEGORY_CONFIG.get(item[0], {}).get("order", 99))

        for cat, subcats in sorted_cats:
            color = CATEGORY_CONFIG.get(cat, {}).get("color", "#333333")
            f.write(f"    {{\n")
            f.write(f"      'kind': 'category',\n")
            f.write(f"      'name': '{cat}',\n")
            f.write(f"      'colour': '{color}',\n")
            f.write(f"      'contents': [\n")
            
            # Iterate through subcategories
            for sub_name, blocks in subcats.items():
                # If there's only one subcategory or it's generic, maybe flatten? 
                # But user asked for expansion. Let's make subcategories.
                # However, Blockly categories don't nest visually like a tree in the simple toolbox.
                # They usually just list blocks.
                # BUT, we can use labels or nested categories if we want a tree.
                # User said "yellow, which expands into all yellow actions".
                # This implies the top level is ACTIONS, and clicking it shows subcategories?
                # Or clicking it shows all blocks grouped?
                # Let's try nested categories for now.
                
                f.write(f"        {{\n")
                f.write(f"          'kind': 'category',\n")
                f.write(f"          'name': '{sub_name}',\n")
                f.write(f"          'colour': '{color}',\n")
                f.write(f"          'contents': [\n")
                for b in blocks:
                    f.write(f"            {{ 'kind': 'block', 'type': '{b}' }},\n")
                f.write(f"          ]\n")
                f.write(f"        }},\n")
                
            f.write(f"      ]\n")
            f.write(f"    }},\n")
            
        f.write("  ]\n")
        f.write("};\n")

if __name__ == "__main__":
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    web_dir = os.path.join(root_dir, "web_ui")
    
    defs, tools, help_d, imgs = generate_blockly_definitions(root_dir)
    write_output(defs, tools, help_d, imgs, web_dir)
    print(f"Generated {len(defs)} block definitions in {web_dir}")
