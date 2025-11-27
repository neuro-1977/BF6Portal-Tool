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
    "EVENTS": {"type": "hat"}, # Event payloads are values, but Event Listeners are Hats?
    "MOD": {"type": "hat"},
    "RULES": {"type": "hat"},
    "SUBROUTINE": {"type": "hat"},
    "C_SHAPED": {"type": "statement", "nested": True}
}

def generate_blockly_definitions(workspace_root):
    root = Path(workspace_root)
    assets_dir = root / "assets"
    
    block_definitions = []
    toolbox_categories = {} # Category -> List of block types

    print(f"Scanning {assets_dir}...")

    for category_dir in assets_dir.iterdir():
        if not category_dir.is_dir() or category_dir.name in ["img", "downloaded"]:
            continue
            
        cat_name = category_dir.name.upper()
        toolbox_categories[cat_name] = []
        
        # Find json files
        for data_file in category_dir.glob("*_data.json"):
            try:
                with open(data_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    
                color = data.get("color", "#333333")
                
                # Handle subcategories
                if "sub_categories" in data:
                    for sub_name, blocks in data["sub_categories"].items():
                        for block_id, block_def in blocks.items():
                            
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
                            toolbox_categories[cat_name].append(block_id)
                            
            except Exception as e:
                print(f"Error processing {data_file}: {e}")

    return block_definitions, toolbox_categories

def write_output(definitions, toolbox, output_dir):
    # Write definitions.js
    with open(os.path.join(output_dir, "definitions.js"), "w", encoding='utf-8') as f:
        f.write("Blockly.defineBlocksWithJsonArray(\n")
        json.dump(definitions, f, indent=2)
        f.write("\n);")
        
    # Write toolbox.xml (or json structure for toolbox)
    # We'll write a JS object that can be used to init the toolbox
    with open(os.path.join(output_dir, "toolbox.js"), "w", encoding='utf-8') as f:
        f.write("var TOOLBOX_CONFIG = {\n")
        f.write("  'kind': 'categoryToolbox',\n")
        f.write("  'contents': [\n")
        
        for cat, blocks in toolbox.items():
            f.write(f"    {{\n")
            f.write(f"      'kind': 'category',\n")
            f.write(f"      'name': '{cat}',\n")
            f.write(f"      'contents': [\n")
            for b in blocks:
                f.write(f"        {{ 'kind': 'block', 'type': '{b}' }},\n")
            f.write(f"      ]\n")
            f.write(f"    }},\n")
            
        f.write("  ]\n")
        f.write("};\n")

if __name__ == "__main__":
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    web_dir = os.path.join(root_dir, "web_ui")
    
    defs, tools = generate_blockly_definitions(root_dir)
    write_output(defs, tools, web_dir)
    print(f"Generated {len(defs)} block definitions in {web_dir}")
