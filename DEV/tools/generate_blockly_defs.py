import json
import os
from pathlib import Path

# Define the root of your project
PROJECT_ROOT = Path(__file__).parent.parent.parent
ASSETS_DIR = PROJECT_ROOT / "assets"
WEB_UI_DIR = PROJECT_ROOT / "web_ui"
DOCS_DIR = PROJECT_ROOT / "docs"
TOOLS_DIR = PROJECT_ROOT / "tools"

# Output files
BLOCK_DEFINITIONS_JS = WEB_UI_DIR / "block_definitions.js"
TOOLBOX_JS = WEB_UI_DIR / "toolbox.js"
BLOCK_DATABASE_MD = DOCS_DIR / "block_database.md"

# Template for block definitions in JavaScript
BLOCK_JS_TEMPLATE = """
Blockly.Blocks['{block_type_id}'] = {{
  init: function() {{
    this.appendDummyInput()
        .appendField("{label}");
    {args_fields}
    {connections}
    this.setColour('{color}');
    this.setTooltip("{description}");
    this.setHelpUrl("");
  }}
}};
"""

def clean_name(name):
    """Converts a string to a valid Blockly block type ID."""
    return name.replace(" ", "_").replace("-", "_").replace(":", "").replace("(", "").replace(")", "").replace("/", "").replace(".", "").upper()

def get_block_connections(block_type_json):
    """Determine Blockly connection types based on JSON 'type' property."""
    connections = ""
    block_type = block_type_json.upper() # Ensure case-insensitivity

    if block_type == "MOD":
        connections += "    this.setPreviousStatement(false, null);\n"
        connections += "    this.setNextStatement(false, null);\n"
        connections += "    this.appendStatementInput(\"RULES_CONDITIONS_SUBROUTINES\").setCheck([\"Rule\", \"Condition\", \"Subroutine\"]).appendField(\"Game Parameters:\");\n"
        connections += "    this.setDeletable(false);\n"
        connections += "    this.setMovable(false);\n"
    elif block_type == "RULES": # RULE_HEADER
        connections += "    this.setPreviousStatement(true, \"Rule\");\n"
        connections += "    this.setNextStatement(true, \"Rule\");\n"
        connections += "    this.appendStatementInput(\"CONDITIONS\").setCheck(\"Condition\").appendField(\"Conditions:\");\n"
        connections += "    this.appendStatementInput(\"ACTIONS\").setCheck([\"Action\", \"SubroutineReference\", \"ControlAction\"]).appendField(\"Actions:\");\n"
    elif block_type == "CONDITION":
        connections += "    this.setPreviousStatement(true, \"Condition\");\n"
        connections += "    this.setNextStatement(true, \"Condition\");\n"
    elif block_type == "ACTIONS" or block_type == "ACTION":
        connections += "    this.setPreviousStatement(true, \"Action\");\n"
        connections += "    this.setNextStatement(true, \"Action\");\n"
    elif block_type == "SUBROUTINE": # Main subroutine definition block
        connections += "    this.setPreviousStatement(false, null);\n" # Subroutines are top-level definitions
        connections += "    this.setNextStatement(false, null);\n" # Not chainable directly to other top-level blocks
        connections += "    this.appendStatementInput(\"ACTIONS_CONDITIONS\").setCheck([\"Action\", \"Condition\"]).appendField(\"Logic:\");\n"
    elif block_type == "VALUE":
        connections += "    this.setOutput(true, null);\n" # Generic output type
    else: # Default for unknown types
        connections += "    this.setPreviousStatement(true, null);\n"
        connections += "    this.setNextStatement(true, null);\n"

    return connections

def generate_js_fields(args, widgets):
    """Generates JavaScript field code for Blockly blocks."""
    args_fields = ""
    for arg_name in args:
        widget_data = widgets.get(arg_name)
        if widget_data:
            if widget_data["type"] == "text_input":
                args_fields += f"    this.appendDummyInput().appendField(\"{arg_name.replace('_', ' ').title()}:\").appendField(new Blockly.FieldTextInput(\"{widget_data.get('default', '')}\"), \"{arg_name.upper()}\");\n"
            elif widget_data["type"] == "dropdown":
                options = ", ".join([f"[\"{opt}\", \"{opt.upper().replace(' ', '_')}\"]" for opt in widget_data["options"]])
                args_fields += f"    this.appendDummyInput().appendField(\"{arg_name.replace('_', ' ').title()}:\").appendField(new Blockly.FieldDropdown([{options}]), \"{arg_name.upper()}\");\n"
        else:
            # Default to text input if no specific widget data
            args_fields += f"    this.appendDummyInput().appendField(\"{arg_name.replace('_', ' ').title()}:\").appendField(new Blockly.FieldTextInput(\"\"), \"{arg_name.upper()}\");\n"
    return args_fields

def generate_blockly_defs_and_toolbox():
    all_block_definitions = {} # Corrected from {{}}
    bf6_portal_categories_data = {} # To store categories for BF6 Portal menu with block contents

    # Hardcode core types and their colors for consistent styling
    core_block_colors = {
        "actions": "#B5A045",      # Yellow
        "ai": "#D32F2F",           # Red (from ai_data.json)
        "arrays": "#0097A7",       # Teal (from previous toolbox.js)
        "audio": "#455A64",        # Blue-Grey (from previous toolbox.js)
        "camera": "#37474F",       # Dark Blue-Grey (from previous toolbox.js)
        "conditions": "#45B5B5",   # Blue/Green
        "effects": "#263238",      # Darkest Blue-Grey (from previous toolbox.js)
        "emplacements": "#8D6E63", # Brown (from previous toolbox.js)
        "events": "#5D4037",       # Brown-Grey (from previous toolbox.js)
        "gameplay": "#5D4037",     # Brown-Grey (from previous toolbox.js)
        "logic": "#1976D2",        # Blue (from previous toolbox.js)
        "math": "#1976D2",         # Blue (from previous toolbox.js)
        "mod": "#4A4A4A",          # Dark Grey (from mod_data.json)
        "objective": "#F9A825",    # Orange-Yellow (from previous toolbox.js)
        "other": "#9E9E9E",        # Grey (from previous toolbox.js)
        "player": "#C2185B",       # Dark Pink (from previous toolbox.js)
        "rules": "#A285E6",        # Purple (from rules_data.json)
        "subroutine": "#E6A85C",   # Orange (from previous toolbox.js)
        "transform": "#212121",    # Near Black (from previous toolbox.js)
        "ui": "#607D8B",           # Desaturated Blue (from previous toolbox.js)
        "values": "#0288D1",       # Light Blue (from previous toolbox.js)
        "vehicles": "#E64A19",     # Dark Orange (from previous toolbox.js)
    }

    # Process each assets JSON file
    for json_path in ASSETS_DIR.glob("**/*_data.json"):
        category_name = json_path.parent.name # e.g., 'actions', 'ai'
        if category_name == "assets": # if it's directly in assets folder
            category_name = json_path.stem.replace("_data", "")
            
        color = core_block_colors.get(category_name.lower(), "#CCCCCC")

        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
            current_category_blocks = [] # Blocks for the current top-level BF6 category

            # Check if the JSON has "sub_categories" or is a flat list of blocks
            if "sub_categories" in data:
                for sub_category_label, blocks in data["sub_categories"].items():
                    sub_category_contents = []
                    for block_type_id, block_data in blocks.items():
                        cleaned_block_type_id = clean_name(block_type_id)
                        all_block_definitions[cleaned_block_type_id] = {
                            "label": block_data.get("label", block_type_id),
                            "color": color, # Use parent category color
                            "type": block_data.get("type", "ACTIONS"), # Default to ACTIONS
                            "args": block_data.get("args", []),
                            "description": block_data.get("description", ""),
                            "widgets": block_data.get("widgets", {})
                        }
                        sub_category_contents.append({"kind": "block", "type": cleaned_block_type_id})
                    
                    if sub_category_contents:
                        current_category_blocks.append({
                            "kind": "category",
                            "name": sub_category_label, # Use actual sub-category name from JSON
                            "categorystyle": f"{category_name.lower()}_category",
                            "contents": sub_category_contents
                        })
            else: # Assume direct block definitions if no sub_categories (e.g., values_data.json)
                for block_type_id, block_data in data.items():
                     if isinstance(block_data, dict) and "label" in block_data: # Ensure it's a block definition
                        cleaned_block_type_id = clean_name(block_type_id)
                        all_block_definitions[cleaned_block_type_id] = {
                            "label": block_data.get("label", block_type_id),
                            "color": color,
                            "type": block_data.get("type", "VALUE"), # Default to VALUE for flat JSONs
                            "args": block_data.get("args", []),
                            "description": block_data.get("description", ""),
                            "widgets": block_data.get("widgets", {})
                        }
                        current_category_blocks.append({"kind": "block", "type": cleaned_block_type_id})
        
        if current_category_blocks:
            bf6_portal_categories_data[category_name.upper()] = {
                "categorystyle": f"{category_name.lower()}_category",
                "contents": current_category_blocks
            }
            
    # Manually add placeholders for the custom toolbox.js if they are not in asset files
    # These were previously defined in web_ui/block_definitions.js manually
    placeholder_blocks = {
        "condition_block": { "label": "Condition", "color": "#45B5B5", "type": "CONDITION", "description": "A placeholder condition block." },
        "action_block": { "label": "Action", "color": "#B5A045", "type": "ACTION", "description": "A placeholder action block." },
        "subroutine_block": { "label": "SUBROUTINE:", "color": "#E6A85C", "type": "SUBROUTINE", "description": "Reusable logic blocks that can be called from multiple places." },
        "subroutine_reference_block": { "label": "Call Subroutine:", "color": "#E6A85C", "type": "ACTION", "description": "Calls a defined subroutine." },
        "control_action_block": { "label": "Control Action:", "color": "#A285E6", "type": "ACTION", "description": "A placeholder control action block." },
    }
    for block_type_id, block_data in placeholder_blocks.items():
        all_block_definitions[clean_name(block_type_id)] = block_data


    # Generate block_definitions.js
    with open(BLOCK_DEFINITIONS_JS, 'w', encoding='utf-8') as f:
        f.write("// Autogenerated Blockly Block Definitions\n\n")
        
        # Write MOD_BLOCK, RULE_HEADER, and placeholders first
        # MOD_BLOCK definition
        mod_block_def = all_block_definitions.get("MOD_BLOCK", {})
        if mod_block_def:
            mod_args_fields = generate_js_fields(mod_block_def.get("args", []), mod_block_def.get("widgets", {{}}))
            mod_connections = get_block_connections(mod_block_def["type"])
            f.write(BLOCK_JS_TEMPLATE.format(
                block_type_id="MOD_BLOCK",
                label=mod_block_def["label"],
                args_fields=mod_args_fields,
                connections=mod_connections,
                color=mod_block_def["color"],
                description=mod_block_def.get("description", "") # Ensure description is read
            ))
            f.write("\n")
        
        # RULE_HEADER definition
        rule_header_def = all_block_definitions.get("RULE_HEADER", {})
        if rule_header_def:
            rule_args_fields = generate_js_fields(rule_header_def.get("args", []), rule_header_def.get("widgets", {{}}))
            rule_connections = get_block_connections(rule_header_def["type"])
            f.write(BLOCK_JS_TEMPLATE.format(
                block_type_id="RULE_HEADER",
                label=rule_header_def["label"],
                args_fields=rule_args_fields,
                connections=rule_connections,
                color=rule_header_def["color"],
                description=rule_header_def.get("description", "") # Ensure description is read
            ))
            f.write("\n")
        
        # Write placeholder blocks
        for block_type_id, block_data in placeholder_blocks.items():
            f.write(f"// Placeholder \"{block_data['label']}\" block\n")
            args_fields = generate_js_fields(block_data.get("args", []), {})
            connections = get_block_connections(block_data["type"])
            f.write(BLOCK_JS_TEMPLATE.format(
                block_type_id=clean_name(block_type_id),
                label=block_data["label"],
                args_fields=args_fields,
                connections=connections,
                color=block_data["color"],
                description=block_data["description"]
            ))
            f.write("\n")

        # Write all other blocks generated from JSONs
        for block_type_id, block_def in all_block_definitions.items():
            # Skip blocks already written or that are primary containers
            if clean_name(block_type_id) in ["MOD_BLOCK", "RULE_HEADER"] or clean_name(block_type_id) in [clean_name(p) for p in placeholder_blocks.keys()]:
                continue
            
            args_fields = generate_js_fields(block_def.get("args", []), block_def.get("widgets", {{}}))
            connections = get_block_connections(block_def["type"])

            f.write(BLOCK_JS_TEMPLATE.format(
                block_type_id=clean_name(block_type_id),
                label=block_def["label"],
                args_fields=args_fields,
                connections=connections,
                color=block_def["color"],
                description=block_def.get("description", "")
            ))
            f.write("\n")

    # Generate toolbox.js
    toolbox_config = {
        "kind": "categoryToolbox",
        "contents": [
            {{
                "kind": "category",
                "name": "Home",
                "contents": [
                    {{
                      "kind": "category",
                      "name": "Logic",
                      "categorystyle": "logic_category",
                      "contents": [
                        {{ "kind": "block", "type": "controls_if" }},
                        {{ "kind": "block", "type": "logic_compare" }},
                        {{ "kind": "block", "type": "logic_operation" }},
                        {{ "kind": "block", "type": "logic_negate" }},
                        {{ "kind": "block", "type": "logic_boolean" }},
                        {{ "kind": "block", "type": "logic_null", "disabled": "true" }},
                        {{ "kind": "block", "type": "logic_ternary" }}
                      ]
                    }},
                    {{
                      "kind": "category",
                      "name": "Loops",
                      "categorystyle": "loop_category",
                      "contents": [
                        {{ "kind": "block", "type": "controls_repeat_ext", "inputs": {{ "TIMES": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 10 }} }} }} }} }},
                        {{ "kind": "block", "type": "controls_repeat", "disabled": "true" }},
                        {{ "kind": "block", "type": "controls_whileUntil" }},
                        {{ "kind": "block", "type": "controls_for", "inputs": {{ "FROM": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 1 }} }} }}, "TO": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 10 }} }} }}, "BY": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 1 }} }} }} }} }},
                        {{ "kind": "block", "type": "controls_forEach" }},
                        {{ "kind": "block", "type": "controls_flow_statements" }}
                      ]
                    }},
                    {{
                      "kind": "category",
                      "name": "Math",
                      "categorystyle": "math_category",
                      "contents": [
                        {{ "kind": "block", "type": "math_number", "fields": {{ "NUM": 123 }} }},
                        {{ "kind": "block", "type": "math_arithmetic", "inputs": {{ "A": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 1 }} }} }}, "B": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 1 }} }} }} }} }},
                        {{ "kind": "block", "type": "math_single", "inputs": {{ "NUM": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 9 }} }} }} }} }},
                        {{ "kind": "block", "type": "math_trig", "inputs": {{ "NUM": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 45 }} }} }} }} }},
                        {{ "kind": "block", "type": "math_constant" }},
                        {{ "kind": "block", "type": "math_number_property", "inputs": {{ "NUMBER_TO_CHECK": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 0 }} }} }} }} }},
                        {{ "kind": "block", "type": "math_round", "inputs": {{ "NUM": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 3.1 }} }} }} }} }},
                        {{ "kind": "block", "type": "math_on_list" }},
                        {{ "kind": "block", "type": "math_modulo", "inputs": {{ "DIVIDEND": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 64 }} }} }}, "DIVISOR": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 10 }} }} }} }} }},
                        {{ "kind": "block", "type": "math_constrain", "inputs": {{ "VALUE": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 50 }} }} }}, "LOW": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 1 }} }} }}, "HIGH": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 100 }} }} }} }} }},
                        {{ "kind": "block", "type": "math_random_int", "inputs": {{ "FROM": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 1 }} }} }}, "TO": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 100 }} }} }} }} }},
                        {{ "kind": "block", "type": "math_random_float" }},
                        {{ "kind": "block", "type": "math_atan2", "inputs": {{ "X": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 1 }} }} }}, "Y": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 1 }} }} }} }} }}
                      ]
                    }},
                    {{
                      "kind": "category",
                      "name": "Text",
                      "categorystyle": "text_category",
                      "contents": [
                        {{ "kind": "block", "type": "text" }},
                        {{ "kind": "block", "type": "text_join" }},
                        {{ "kind": "block", "type": "text_append", "inputs": {{ "TEXT": {{ "shadow": {{ "type": "text" }} }} }} }},
                        {{ "kind": "block", "type": "text_length", "inputs": {{ "VALUE": {{ "shadow": {{ "type": "text", "fields": {{ "TEXT": "abc" }} }} }} }} }},
                        {{ "kind": "block", "type": "text_isEmpty", "inputs": {{ "VALUE": {{ "shadow": {{ "type": "text", "fields": {{ "TEXT": "" }} }} }} }} }},
                        {{ "kind": "block", "type": "text_indexOf", "inputs": {{ "VALUE": {{ "block": {{ "type": "text", "fields": {{ "TEXT": "abc" }} }} }}, "FIND": {{ "shadow": {{ "type": "text", "fields": {{ "TEXT": "b" }} }} }} }} }},
                        {{ "kind": "block", "type": "text_charAt", "inputs": {{ "VALUE": {{ "block": {{ "type": "text", "fields": {{ "TEXT": "abc" }} }} }} }} }},
                        {{ "kind": "block", "type": "text_getSubstring", "inputs": {{ "STRING": {{ "block": {{ "type": "text", "fields": {{ "TEXT": "abc" }} }} }} }} }},
                        {{ "kind": "block", "type": "text_changeCase", "inputs": {{ "TEXT": {{ "shadow": {{ "type": "text", "fields": {{ "TEXT": "abc" }} }} }} }} }},
                        {{ "kind": "block", "type": "text_trim", "inputs": {{ "TEXT": {{ "shadow": {{ "type": "text", "fields": {{ "TEXT": "abc" }} }} }} }} }},
                        {{ "kind": "block", "type": "text_print", "inputs": {{ "TEXT": {{ "shadow": {{ "type": "text", "fields": {{ "TEXT": "abc" }} }} }} }} }},
                        {{ "kind": "block", "type": "text_prompt_ext", "inputs": {{ "TEXT": {{ "shadow": {{ "type": "text", "fields": {{ "TEXT": "abc" }} }} }} }} }}
                      ]
                    }},
                    {{
                      "kind": "category",
                      "name": "Lists",
                      "categorystyle": "list_category",
                      "contents": [
                        {{ "kind": "block", "type": "lists_create_with", "mutation": {{ "items": "0" }} }},
                        {{ "kind": "block", "type": "lists_create_with" }},
                        {{ "kind": "block", "type": "lists_repeat", "inputs": {{ "NUM": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 5 }} }} }} }} }},
                        {{ "kind": "block", "type": "lists_length" }},
                        {{ "kind": "block", "type": "lists_isEmpty" }},
                        {{ "kind": "block", "type": "lists_indexOf" }},
                        {{ "kind": "block", "type": "lists_getIndex" }},
                        {{ "kind": "block", "type": "lists_setIndex" }},
                        {{ "kind": "block", "type": "lists_getSublist" }},
                        {{ "kind": "block", "type": "lists_split", "inputs": {{ "DELIM": {{ "shadow": {{ "type": "text", "fields": {{ "TEXT": "," }} }} }} }} }},
                        {{ "kind": "block", "type": "lists_sort" }}
                      ]
                    }},
                    {{
                      "kind": "category",
                      "name": "Colour",
                      "categorystyle": "colour_category",
                      "contents": [
                        {{ "kind": "block", "type": "colour_picker" }},
                        {{ "kind": "block", "type": "colour_random" }},
                        {{ "kind": "block", "type": "colour_rgb", "inputs": {{ "RED": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 100 }} }} }}, "GREEN": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 50 }} }} }}, "BLUE": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 0 }} }} }} }} }},
                        {{ "kind": "block", "type": "colour_blend", "inputs": {{ "COLOUR1": {{ "shadow": {{ "type": "colour_picker", "fields": {{ "COLOUR": "#ff0000" }} }} }}, "COLOUR2": {{ "shadow": {{ "type": "colour_picker", "fields": {{ "COLOUR": "#3333ff" }} }} }}, "RATIO": {{ "shadow": {{ "type": "math_number", "fields": {{ "NUM": 0.5 }} }} }} }} }}
                      ]
                    }},
                    {{
                      "kind": "sep"
                    }},
                    {{
                      "kind": "category",
                      "name": "Variables",
                      "categorystyle": "variable_category",
                      "custom": "VARIABLE",
                      "contents": [
                        {{ "kind": "button", "text": "Manage Variables", "callbackkey": "manageVariables" }}
                      ]
                    }},
                    {{
                      "kind": "category",
                      "name": "Functions",
                      "categorystyle": "procedure_category",
                      "custom": "PROCEDURE"
                    }}
                ]
            }},
            {{
                "kind": "category",
                "name": "BF6 Portal",
                "contents": []
            }}
        ]
    }}
    
    # Add generated BF6 Portal categories
    for category_name_upper, category_data in bf6_portal_categories_data.items():
        if category_name_upper == "VALUES":
            # Process "Literals" and "Variables" from values_data.json
            for sub_category_dict in category_data["contents"]:
                if sub_category_dict["name"] == "Literals":
                    toolbox_config["contents"][1]["contents"].append({{
                        "kind": "category",
                        "name": "LITERALS",
                        "categorystyle": "values_category",
                        "contents": sub_category_dict["contents"] # These are the actual block references
                    }})
                elif sub_category_dict["name"] == "Variables":
                    toolbox_config["contents"][1]["contents"].append({{
                        "kind": "category",
                        "name": "VARIABLES (BF6)",
                        "categorystyle": "variables_category",
                        "contents": sub_category_dict["contents"] # These are the actual block references
                    }})
            continue # Skip adding the top-level VALUES category directly
            
        toolbox_config["contents"][1]["contents"].append({{ # Append to BF6 Portal
            "kind": "category",
            "name": category_name_upper,
            **category_data
        }})

    # Add Mod, Rules, Subroutine, Condition, Action placeholders if not already present from JSON
    # This ensures these core categories are always present and their specific block types are referenced
    core_bf6_categories_to_add = {{
        "MOD": {{ "kind": "block", "type": "MOD_BLOCK" }},
        "RULES": [
            {{ "kind": "block", "type": "RULE_HEADER" }},
            {{ "kind": "block", "type": "CONDITION_BLOCK" }} # Add condition block to RULES menu
        ],
        "SUBROUTINES": [
            {{ "kind": "block", "type": "SUBROUTINE_BLOCK" }},
            {{ "kind": "block", "type": "SUBROUTINE_REFERENCE_BLOCK" }}
        ],
        "CONDITIONS": {{ "kind": "block", "type": "CONDITION_BLOCK" }},
        "ACTIONS": [
            {{ "kind": "block", "type": "ACTION_BLOCK" }},
            {{ "kind": "block", "type": "CONTROL_ACTION_BLOCK" }}
        ]
    }}

    # Integrate custom core BF6 blocks into the toolbox structure
    for category_name, block_refs in core_bf6_categories_to_add.items():
        # Clean the category name for matching
        cleaned_category_name = clean_name(category_name)

        # Find or create the category under BF6 Portal
        found_category_in_bf6_portal = False
        for bf6_cat in toolbox_config["contents"][1]["contents"]:
            if clean_name(bf6_cat["name"]) == cleaned_category_name:
                # Add blocks to existing category
                if isinstance(block_refs, list):
                    bf6_cat["contents"].extend(block_refs)
                else:
                    bf6_cat["contents"].append(block_refs)
                found_category_in_bf6_portal = True
                break
        
        if not found_category_in_bf6_portal:
            # Create new category if not found
            contents = block_refs if isinstance(block_refs, list) else [block_refs]
            toolbox_config["contents"][1]["contents"].append({{
                "kind": "category",
                "name": category_name, # Use original name for display
                "categorystyle": f"{category_name.lower().replace(' ', '_')}_category", # Default style
                "contents": contents
            }})


    with open(TOOLBOX_JS, 'w', encoding='utf-8') as f:
        f.write(f"var TOOLBOX_CONFIG = {json.dumps(toolbox_config, indent=2)};\n")

    # Generate Block Database Markdown
    with open(BLOCK_DATABASE_MD, 'w', encoding='utf-8') as f_md: # Use f_md instead of f
        f_md.write("# Blockly Block Database\n\n")
        f_md.write("This document lists all identified Blockly blocks, their properties, and current implementation status.\n\n")
        
        for block_type_id, block_def in all_block_definitions.items():
            f_md.write(f"## {block_def['label']} (`{block_type_id}`)\n")
            f_md.write(f"- **Type:** {block_def['type']}\n")
            f_md.write(f"- **Color:** {block_def['color']}\n")
            f_md.write(f"- **Description:** {block_def.get('description', 'No description provided.')}\n")
            f_md.write(f"- **Arguments:** {', '.join(block_def.get('args', [])) if block_def.get('args', []) else 'None'}\n")
            f_md.write(f"- **Widgets:** {json.dumps(block_def.get('widgets', {})) if block_def.get('widgets', {}) else 'None'}\n")
            f_md.write("- **Status:** Implemented\n") # Default status
            f_md.write("\n---\n\n")

        # Add a section for deleted OCR'd files
        f_md.write("\n# Deleted OCR'd HTML Files\n\n")
        f_md.write("The following HTML files from `Dump/blocks/Imported` were deleted as they contained garbled OCR text and were not useful for generating Blockly block definitions.\n\n")
        f_md.write("- All `.html` files in `Dump/blocks/Imported` were identified as unsuitable for block definition generation and have been removed.\n\n")


if __name__ == "__main__":
    # Create tools directory if it doesn't exist
    TOOLS_DIR.mkdir(parents=True, exist_ok=True)
    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    generate_blockly_defs_and_toolbox()
