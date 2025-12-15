import re
import os
import json
from collections import defaultdict

# Paths
resources_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), '=Resources=', 'portal-docs-json')
index_d_ts_path = os.path.join(resources_dir, 'index.d.ts')
output_blocks_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'web_ui', 'src', 'blocks', 'generated_blocks.ts')
output_toolbox_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'web_ui', 'src', 'generated_toolbox.ts')

def parse_index_d_ts(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    functions = defaultdict(list)
    
    # Regex to find function definitions
    # export function Name(arg1: Type, arg2: Type): ReturnType;
    func_pattern = re.compile(r'export function (\w+)\(([^)]*)\): ([\w\.<>\[\]]+);')
    
    matches = func_pattern.findall(content)
    
    for name, args_str, return_type in matches:
        # Skip if it's an event (handled differently usually)
        if name.startswith('On'):
            continue
            
        args = []
        if args_str.strip():
            arg_parts = args_str.split(',')
            for arg in arg_parts:
                if ':' in arg:
                    # Handle cases like "arg: Type"
                    # Also handle "arg: Type | Type2"
                    parts = arg.split(':')
                    arg_name = parts[0].strip()
                    arg_type = ':'.join(parts[1:]).strip() # Rejoin in case type has :
                    args.append({'name': arg_name, 'type': arg_type})
        
        functions[name].append({
            'name': name,
            'args': args,
            'return_type': return_type
        })
        
    return functions

def merge_signatures(name, signatures):
    # Group by argument count
    by_arity = defaultdict(list)
    for sig in signatures:
        by_arity[len(sig['args'])].append(sig)
        
    merged_blocks = []
    
    for arity, sigs in by_arity.items():
        # If only one signature for this arity, use it
        if len(sigs) == 1:
            merged_blocks.append(sigs[0])
            continue
            
        # If multiple, try to merge types
        base_sig = sigs[0]
        merged_args = []
        
        for i in range(arity):
            arg_name = base_sig['args'][i]['name']
            types = set()
            for sig in sigs:
                # Clean up types (remove 'mod.', handle unions)
                t = sig['args'][i]['type'].replace('mod.', '')
                types.add(t)
            
            # Create union type check
            check = list(types)
            if len(check) == 1:
                check = check[0]
            
            merged_args.append({'name': arg_name, 'type': check})
            
        merged_blocks.append({
            'name': name,
            'args': merged_args,
            'return_type': base_sig['return_type']
        })
        
    return merged_blocks

def generate_blockly_definitions(functions):
    blocks_code = """
import * as Blockly from 'blockly';

export const generatedBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([
"""
    toolbox_categories = defaultdict(list)
    
    for name, signatures in functions.items():
        merged = merge_signatures(name, signatures)
        
        for i, block in enumerate(merged):
            # Create unique ID
            block_id = f"mod_{block['name']}"
            if len(merged) > 1:
                # Append suffix based on last arg name to differentiate
                if block['args']:
                    suffix = block['args'][-1]['name'].capitalize()
                    block_id += f"_{suffix}"
                else:
                    block_id += f"_{i+1}"
            
            # Construct message0
            message0 = f"{block['name']}"
            args0 = []
            
            for j, arg in enumerate(block['args']):
                message0 += f" %{j+1}"
                check_type = arg['type']
                
                # Normalize check type for Blockly
                if isinstance(check_type, list):
                    # It's a list of types, keep it as list
                    pass
                elif '|' in check_type:
                    # Split "Type1 | Type2" string into list
                    check_type = [t.strip() for t in check_type.split('|')]
                
                args0.append({
                    "type": "input_value",
                    "name": arg['name'],
                    "check": check_type
                })
            
            # Determine category
            return_type = block['return_type']
            category = "Actions"
            if return_type == 'void':
                category = "Actions"
            elif return_type == 'boolean':
                category = "Logic"
            elif return_type == 'number':
                category = "Math"
            elif return_type == 'Vector':
                category = "Vector"
            elif return_type == 'string' or return_type == 'Message':
                category = "Text"
            elif 'Array' in return_type:
                category = "Arrays"
            else:
                category = "Data"
                
            toolbox_categories[category].append(block_id)

            # JSON definition
            json_def = {
                "type": block_id,
                "message0": message0,
                "args0": args0,
                "inputsInline": True,
                "output": return_type if return_type != 'void' else None,
                "previousStatement": None if return_type == 'void' else None,
                "nextStatement": None if return_type == 'void' else None,
                "colour": get_colour(category),
                "tooltip": f"Auto-generated block for {block['name']}",
                "helpUrl": ""
            }
            
            # Add to TS code
            blocks_code += f"""
  {{
    id: "{block_id}",
    init: function() {{
      this.jsonInit({json.dumps(json_def)});
    }}
  }},
"""

    blocks_code += "];\n"
    return blocks_code, toolbox_categories

def get_colour(category):
    colors = {
        "Actions": 230,
        "Logic": 210,
        "Math": 230,
        "Vector": 260,
        "Text": 160,
        "Arrays": 260,
        "Data": 330
    }
    return colors.get(category, 0)

def generate_toolbox_ts(categories):
    ts_code = """
export const generatedToolbox = {
  "kind": "categoryToolbox",
  "contents": [
"""
    for cat, blocks in categories.items():
        ts_code += f"""    {{
      "kind": "category",
      "name": "{cat} (Gen)",
      "contents": [
"""
        for block_id in blocks:
            ts_code += f"""        {{
          "kind": "block",
          "type": "{block_id}"
        }},
"""
        ts_code += """      ]
    },
"""
    ts_code += """  ]
};
"""
    return ts_code

if __name__ == "__main__":
    if os.path.exists(index_d_ts_path):
        print(f"Parsing {index_d_ts_path}...")
        functions = parse_index_d_ts(index_d_ts_path)
        print(f"Found {len(functions)} unique function names.")
        
        blocks_code, categories = generate_blockly_definitions(functions)
        
        with open(output_blocks_path, 'w', encoding='utf-8') as f:
            f.write(blocks_code)
        print(f"Generated blocks written to {output_blocks_path}")
        
        toolbox_code = generate_toolbox_ts(categories)
        with open(output_toolbox_path, 'w', encoding='utf-8') as f:
            f.write(toolbox_code)
        print(f"Generated toolbox written to {output_toolbox_path}")
        
    else:
        print("index.d.ts not found.")
