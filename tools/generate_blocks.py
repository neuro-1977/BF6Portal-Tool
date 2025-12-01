import os
import json
import re

ASSETS_DIR = r"d:\=Code=\BF6Portal Tool\_archive\assets"
OUTPUT_BLOCKS_FILE = r"d:\=Code=\BF6Portal Tool\web_ui\block_definitions_gen.js"
OUTPUT_TOOLBOX_FILE = r"d:\=Code=\BF6Portal Tool\web_ui\toolbox_gen.js"

def sanitize_block_type(name):
    return name.upper().replace(" ", "_")

def generate_block_definition(block_name, block_data, category_color):
    block_type = sanitize_block_type(block_name)
    label = block_data.get("label", block_name)
    b_type = block_data.get("type", "ACTIONS")
    args = block_data.get("args", [])
    description = block_data.get("description", "")
    
    js_code = f"Blockly.Blocks['{block_type}'] = {{\n"
    js_code += "  init: function() {\n"
    js_code += f"    this.appendDummyInput().appendField('{label}');\n"
    
    # Handle arguments
    if isinstance(args, list):
        for arg in args:
            js_code += f"    this.appendDummyInput().appendField('{arg}:').appendField(new Blockly.FieldTextInput(''), '{arg.upper()}');\n"
    elif isinstance(args, dict):
        for arg_name, arg_details in args.items():
            default_val = arg_details.get("default", "")
            js_code += f"    this.appendDummyInput().appendField('{arg_name}:').appendField(new Blockly.FieldTextInput('{default_val}'), '{arg_name.upper()}');\n"

    # Handle Block Type (Connections)
    if b_type == "ACTIONS":
        js_code += "    this.setPreviousStatement(true, 'Action');\n"
        js_code += "    this.setNextStatement(true, 'Action');\n"
    elif b_type == "VALUE":
        js_code += "    this.setOutput(true, null);\n"
    elif b_type == "C_SHAPED":
        js_code += "    this.setPreviousStatement(true, 'Action');\n"
        js_code += "    this.setNextStatement(true, 'Action');\n"
        js_code += "    this.appendStatementInput('DO').appendField('Do');\n"
    elif b_type == "SEQUENCE":
        js_code += "    this.setPreviousStatement(true, 'Action');\n"
        js_code += "    this.setNextStatement(true, 'Action');\n"
    else:
        # Unknown type - Fallback to Placeholder
        # print(f"Warning: Unknown block type '{b_type}' for block '{block_name}'. Generating placeholder.")
        js_code += "    this.setPreviousStatement(true, 'Action');\n"
        js_code += "    this.setNextStatement(true, 'Action');\n"
        js_code += f"    this.appendDummyInput().appendField('[!] NEEDS WORK: {b_type}');\n"
        category_color = "#FF0000" # Bright Red for attention
        description = f"UNKNOWN TYPE: {b_type}. {description}"
        return js_code, True # Return True indicating it's a placeholder
    
    js_code += f"    this.setColour('{category_color}');\n"
    js_code += f"    this.setTooltip('{description}');\n"
    js_code += "    this.setHelpUrl('');\n"
    js_code += "  }\n"
    js_code += "};\n\n"
    
    return js_code, False
    
    # Write Toolbox
    toolbox_js = "var TOOLBOX_CONFIG = {\n"
    toolbox_js += '  "kind": "categoryToolbox",\n'
    toolbox_js += '  "contents": ' + json.dumps(toolbox_categories, indent=2) + "\n"
    toolbox_js += "};\n"
    
    if os.path.exists(OUTPUT_TOOLBOX_FILE):
        with open(OUTPUT_TOOLBOX_FILE, 'r') as f:
            existing_toolbox = f.read()
    else:
        existing_toolbox = ""

    if toolbox_js != existing_toolbox:
        with open(OUTPUT_TOOLBOX_FILE, 'w') as f:
            f.write(toolbox_js)
        print(f"Updated toolbox in {OUTPUT_TOOLBOX_FILE}")
    else:
        print(f"No changes for {OUTPUT_TOOLBOX_FILE}")

    if unknown_blocks:
        print("\n" + "="*40)
        print(f"[!] NEEDS WORK: {len(unknown_blocks)} Unknown Blocks Found")
        print("="*40)
        for block in unknown_blocks:
            print(f"- {block}")
        print("="*40 + "\n")

if __name__ == "__main__":
    files = os.listdir(ASSETS_DIR)
    js_content = ""
    toolbox_categories = {}
    unknown_blocks = []
    
    print(f"Processing {len(files)} files in {ASSETS_DIR}...")
    
    for i, filename in enumerate(files):
        if filename.endswith(".json"):
            file_path = os.path.join(ASSETS_DIR, filename)
            try:
                with open(file_path, 'r') as f:
                    block_data = json.load(f)
                
                block_name = os.path.splitext(filename)[0]
                print(f"[{i+1}/{len(files)}] Generating block: {block_name}")
                
                # Determine Category (Folder Name or Default)
                # For now, we don't have subfolders in the flat assets dir, 
                # so we might need a way to categorize. 
                # Let's assume a default for now or parse from filename if needed.
                category = "Custom" 
                
                # ... (Logic to determine category if possible) ...
                
                definition, is_placeholder = generate_block_definition(block_name, block_data, "#5b80a5")
                
                if is_placeholder:
                    unknown_blocks.append(block_name)
                    
                js_content += definition
                
                # Add to Toolbox (Simple implementation)
                if category not in toolbox_categories:
                    toolbox_categories[category] = []
                
                toolbox_categories[category].append({
                    "kind": "block",
                    "type": sanitize_block_type(block_name)
                })
                
            except Exception as e:
                print(f"Error processing {filename}: {e}")

    # Write Blocks Definition
    if os.path.exists(OUTPUT_BLOCKS_FILE):
        with open(OUTPUT_BLOCKS_FILE, 'r') as f:
            existing_content = f.read()
    else:
        existing_content = ""
        
    if js_content != existing_content:
        with open(OUTPUT_BLOCKS_FILE, 'w') as f:
            f.write(js_content)
        print(f"Updated blocks in {OUTPUT_BLOCKS_FILE}")
    else:
        print(f"No changes for {OUTPUT_BLOCKS_FILE}")
