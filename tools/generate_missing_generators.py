import re
import os
import json
from pathlib import Path

def find_block_definitions(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the JSON array part
    # This is a bit hacky, assuming the file structure
    match = re.search(r'Blockly\.common\.createBlockDefinitionsFromJsonArray\(\s*(\[.*\])\s*\);', content, re.DOTALL)
    if match:
        json_str = match.group(1)
        # Remove trailing commas
        json_str = re.sub(r',\s*\]', ']', json_str)
        json_str = re.sub(r',\s*\}', '}', json_str)
        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON in {file_path}: {e}")
            return []
    return []

def find_implemented_generators(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    return set(re.findall(r"bf6Generators\['([^']+)'\]", content))

def generate_code_for_block(block_def):
    block_type = block_def['type']
    message0 = block_def.get('message0', '')
    
    # Extract function name from message0 (first word)
    # e.g. "GetAllCapturePoints" or "GetAllPlayersInVehicle %1"
    func_name = message0.split(' ')[0]
    
    # Check if it's an output block or statement block
    is_output = 'output' in block_def
    
    # Count arguments
    args0 = block_def.get('args0', [])
    input_values = [arg for arg in args0 if arg['type'] == 'input_value']
    
    lines = []
    lines.append(f"bf6Generators['{block_type}'] = function(block: any, generator: any) {{")
    
    arg_vars = []
    for i, arg in enumerate(input_values):
        arg_name = arg['name']
        var_name = f"value{i}"
        lines.append(f"  const {var_name} = generator.valueToCode(block, '{arg_name}', Order.NONE) || 'null';")
        arg_vars.append(f"${{{var_name}}}")
    
    args_str = ", ".join(arg_vars)
    
    if is_output:
        lines.append(f"  const code = `mod.{func_name}({args_str})`;")
        lines.append(f"  return [code, Order.NONE];")
    else:
        lines.append(f"  const code = `mod.{func_name}({args_str});\\n`;")
        lines.append(f"  return code;")
        
    lines.append("};")
    lines.append("")
    
    return "\n".join(lines)

def main():
    repo_root = Path(__file__).resolve().parents[1]
    base_dir = repo_root / 'web_ui' / 'src'
    blocks_file = base_dir / 'blocks' / 'bf6portal.ts'
    generators_file = base_dir / 'generators' / 'bf6_generators.ts'
    
    print(f"Reading definitions from {blocks_file}...")
    block_defs = find_block_definitions(str(blocks_file))
    print(f"Found {len(block_defs)} block definitions.")
    
    print(f"Reading implemented generators from {generators_file}...")
    implemented = find_implemented_generators(str(generators_file))
    print(f"Found {len(implemented)} implemented generators.")
    
    missing_defs = [b for b in block_defs if b['type'] not in implemented]
    print(f"Found {len(missing_defs)} missing generators.")
    
    output_code = []
    for block_def in missing_defs:
        output_code.append(generate_code_for_block(block_def))
        
    if output_code:
        output_path = base_dir / 'generators' / 'generated_bf6_generators.ts'
        print(f"Writing generated code to {output_path}...")
        with output_path.open('w', encoding='utf-8') as f:
            f.write("\n".join(output_code))
        print("Done.")
    else:
        print("No missing generators to generate.")

if __name__ == "__main__":
    main()
