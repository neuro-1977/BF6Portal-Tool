import re
import os
import json

# Paths
resources_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), '=Resources=', 'portal-docs-json')
index_d_ts_path = os.path.join(resources_dir, 'index.d.ts')
output_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'web_ui', 'src', 'blocks', 'generated_blocks.ts')

def parse_index_d_ts(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    blocks = []
    
    # Regex to find function definitions
    # export function Name(arg1: Type, arg2: Type): ReturnType;
    func_pattern = re.compile(r'export function (\w+)\(([^)]*)\): (\w+);')
    
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
                    arg_name, arg_type = arg.split(':')
                    args.append({'name': arg_name.strip(), 'type': arg_type.strip()})
        
        blocks.append({
            'name': name,
            'args': args,
            'return_type': return_type
        })
        
    return blocks

def generate_blockly_definitions(blocks):
    ts_code = """
import * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';

export const generatedBlocks = [
"""
    
    for block in blocks:
        block_name = block['name']
        args = block['args']
        return_type = block['return_type']
        
        # Construct message0 string
        message0 = f"{block_name}"
        args0 = []
        
        for i, arg in enumerate(args):
            message0 += f" %{i+1}"
            args0.append({
                "type": "input_value",
                "name": arg['name'],
                "check": arg['type'] # Simplified type check
            })
            
        # JSON definition
        json_def = {
            "type": f"mod_{block_name}",
            "message0": message0,
            "args0": args0,
            "inputsInline": True,
            "output": return_type if return_type != 'void' else None,
            "previousStatement": None if return_type == 'void' else None,
            "nextStatement": None if return_type == 'void' else None,
            "colour": 230, # Default color
            "tooltip": f"Auto-generated block for {block_name}",
            "helpUrl": ""
        }
        
        # Add to TS code
        ts_code += f"""
  {{
    id: "mod_{block_name}",
    init: function() {{
      this.jsonInit({json.dumps(json_def)});
    }}
  }},
"""

    ts_code += "];\n"
    return ts_code

if __name__ == "__main__":
    if os.path.exists(index_d_ts_path):
        print(f"Parsing {index_d_ts_path}...")
        blocks = parse_index_d_ts(index_d_ts_path)
        print(f"Found {len(blocks)} blocks.")
        
        # Generate code (limit to first 20 for testing)
        ts_output = generate_blockly_definitions(blocks[:20])
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(ts_output)
            
        print(f"Generated blocks written to {output_path}")
    else:
        print("index.d.ts not found.")
