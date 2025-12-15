import re
import os
import json

def find_block_types(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Look for JSON-like definitions: {"type": "block_name", ...}
    # This regex is a bit loose but should catch most
    json_types = re.findall(r'\{\s*"type":\s*"([^"]+)"', content)
    
    # Look for Blockly.Blocks['block_name'] = ...
    blockly_types = re.findall(r"Blockly\.Blocks\['([^']+)'\]", content)
    
    return set(json_types + blockly_types)

def find_generators(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Look for bf6Generators['block_name'] = ...
    generators = re.findall(r"bf6Generators\['([^']+)'\]", content)
    
    return set(generators)

def main():
    base_dir = r"d:\=Code=\BF6Portal Tool\web_ui\src"
    blocks_dir = os.path.join(base_dir, "blocks")
    generators_file = os.path.join(base_dir, "generators", "bf6_generators.ts")
    
    all_blocks = set()
    
    # Scan block definition files
    for filename in os.listdir(blocks_dir):
        if filename.endswith(".ts") and filename.startswith("bf6portal"):
            file_path = os.path.join(blocks_dir, filename)
            print(f"Scanning {filename}...")
            blocks = find_block_types(file_path)
            all_blocks.update(blocks)
            
    print(f"Found {len(all_blocks)} block definitions.")
    
    # Scan generator file
    print(f"Scanning {generators_file}...")
    implemented_generators = find_generators(generators_file)
    print(f"Found {len(implemented_generators)} implemented generators.")
    
    # Find missing
    missing = all_blocks - implemented_generators
    
    # Filter out some likely false positives or special blocks if needed
    # For now, just print them
    
    print(f"\nMissing Generators ({len(missing)}):")
    for block in sorted(missing):
        print(block)

if __name__ == "__main__":
    main()
