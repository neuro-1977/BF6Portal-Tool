
import json
import os
import re
import sys # Import sys for stderr

def get_existing_block_types(blocks_dir):
    """Extracts block types from existing TypeScript block definition files."""
    existing_block_types = set()
    for filename in os.listdir(blocks_dir):
        if filename.endswith('.ts'):
            filepath = os.path.join(blocks_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                # Regex to find 'type: "BLOCK_TYPE"' or 'type: 'BLOCK_TYPE''
                types_single_quote = re.findall(r"type:\s*'([^']*)'", content)
                types_double_quote = re.findall(r"type:\s*\"([^\"]*)\"", content)
                existing_block_types.update(types_single_quote)
                existing_block_types.update(types_double_quote)
    return existing_block_types

def generate_typescript_block_file(parsed_blocks, output_filepath):
    """Generates a TypeScript file with new block definitions."""
    ts_content = "import * as Blockly from 'blockly';\n\n"
    ts_content += "export const bf6PortalExpandedBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([\n"
    
    for block_data in parsed_blocks:
        # Convert the Python dictionary to a JSON string, then embed it
        json_string = json.dumps(block_data, indent=2)
        ts_content += json_string.replace("\n", "\n  ") + ",\n"
    
    ts_content += "]);\n"
    
    with open(output_filepath, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    print(f"Generated new block definition file: {output_filepath}")


if __name__ == "__main__":
    # Changed path to be relative to the tools directory
    parsed_json_path = "tools/parsed_block_definitions.json" 
    serenity_blocks_dir = "web_ui/src/blocks/"
    output_ts_path = os.path.join(serenity_blocks_dir, "bf6portal_expanded.ts")

    try:
        if not os.path.exists(parsed_json_path):
            print(f"Error: Input JSON file not found at {parsed_json_path}. "
                  "This file should contain block definitions in JSON format.", file=sys.stderr)
            sys.exit(1)

        with open(parsed_json_path, 'r', encoding='utf-8') as f:
            all_parsed_blocks = json.load(f)
        
        existing_types = get_existing_block_types(serenity_blocks_dir)
        print(f"Found {len(existing_types)} existing block types.")

        new_blocks = [block for block in all_parsed_blocks if block['type'] not in existing_types]
        print(f"Identified {len(new_blocks)} new block types for integration.")

        if new_blocks:
            generate_typescript_block_file(new_blocks, output_ts_path)
        else:
            print("No new blocks to add.")

    except Exception as e:
        print(f"An error occurred: {e}", file=sys.stderr)
        sys.exit(1)
