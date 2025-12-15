import json
import re

# File paths
TOOLBOX_PATH = 'web_ui/src/toolbox.ts'
BLOCK_DEFS_PATH = 'web_ui/src/blocks/bf6portal_expanded.ts'

def extract_types_from_toolbox(file_path):
    """Extracts 'type' fields from the toolbox.ts file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        pattern_single_quote = r"'type'\s*:\s*'([^']+)'"
        pattern_double_quote = r'"type"\s*:\s*"([^"]*)"'
        
        matches_single = re.findall(pattern_single_quote, content)
        matches_double = re.findall(pattern_double_quote, content)
        
        all_matches = matches_single + matches_double
        print(f"DEBUG: toolbox.ts found {len(all_matches)} type matches.")
        return set(all_matches)

    except Exception as e:
        print(f"Error reading toolbox data: {e}")
        return set()

def extract_types_from_ts(file_path):
    """Extracts block types by finding and parsing individual JSON-like block definitions."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        print(f"DEBUG: bf6portal_expanded.ts content length: {len(content)}")
        
        types = set()
        
        start_wrapper = "export const bf6PortalExpandedBlocks = Blockly.common.createBlockDefinitionsFromJsonArray("
        end_wrapper = "]);"
        
        start_index = content.find(start_wrapper)
        end_index = content.rfind(end_wrapper)
        
        if start_index == -1 or end_index == -1:
            print("Error: Could not find TypeScript wrapper in bf6portal_expanded.ts")
            return set()
            
        json_array_str_raw = content[start_index + len(start_wrapper) : end_index].strip()
        
        type_matches = re.findall(r'"type"\s*:\s*"([^"]*)"', json_array_str_raw)
        
        types = set(type_matches)
        
        print(f"DEBUG: bf6portal_expanded.ts found {len(types)} type matches.")
        return types

    except Exception as e:
        print(f"Error extracting types from bf6portal_expanded.ts: {e}")
        return set()

def main():
    print("Analyzing Block Definitions...")
    
    expected_blocks = extract_types_from_toolbox(TOOLBOX_PATH)
    defined_blocks = extract_types_from_ts(BLOCK_DEFS_PATH)
    
    print(f"Expected Blocks (from toolbox): {len(expected_blocks)}")
    print(f"Defined Blocks (from bf6portal_expanded.ts): {len(defined_blocks)}")
    
    missing_blocks = expected_blocks - defined_blocks
    unused_definitions = defined_blocks - expected_blocks
    
    if missing_blocks:
        print(f"\n[MISSING] The following {len(missing_blocks)} blocks are in the toolbox but NOT defined:")
        for block in sorted(missing_blocks):
            print(f" - {block}")
            
    else:
        print("\n[SUCCESS] All blocks in the toolbox appear to have definitions!")

    if unused_definitions:
        print(f"\n[UNUSED DEFINITIONS] The following {len(unused_definitions)} blocks are defined but NOT in the toolbox:")
        for block in sorted(unused_definitions):
            print(f" - {block}")

if __name__ == "__main__":
    main()