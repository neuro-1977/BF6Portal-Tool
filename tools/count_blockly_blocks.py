import json
import re
import sys

def extract_toolbox_json(ts_content):
    """
    Extracts the JSON-like string for the 'toolbox' constant from TypeScript content.
    """
    # Regex to find 'export const toolbox = {...};'
    match = re.search(r"export\s+const\s+toolbox\s*=\s*(\{[\s\S]*?\});", ts_content)
    if not match:
        raise ValueError("Could not find 'export const toolbox' in the provided content.")
    
    json_string = match.group(1)
    
    # Clean up JavaScript/TypeScript specific syntax that JSON.parse won't like
    # Remove trailing commas (if any)
    json_string = re.sub(r',\s*([\}\]])', r'\1', json_string)
    
    return json_string

def count_unique_block_types(toolbox_data):
    """
    Recursively counts unique block types in a Blockly toolbox JSON structure.
    """
    unique_block_types = set()
    
    def _traverse(node):
        if isinstance(node, dict):
            if node.get('kind') == 'block' and 'type' in node:
                unique_block_types.add(node['type'])
            for key, value in node.items():
                _traverse(value)
        elif isinstance(node, list):
            for item in node:
                _traverse(item)
    
    _traverse(toolbox_data)
    return len(unique_block_types), list(unique_block_types)

if __name__ == "__main__":
    toolbox_file_path = "web_ui/src/toolbox.ts"
    
    try:
        with open(toolbox_file_path, 'r', encoding='utf-8') as f:
            ts_content = f.read()
        
        json_string = extract_toolbox_json(ts_content)
        toolbox_data = json.loads(json_string)
        
        count, block_types = count_unique_block_types(toolbox_data)
        
        print(f"Total unique Blockly block types found: {count}")
        # print("Block types:", block_types) # Uncomment for detailed list
        
    except FileNotFoundError:
        print(f"Error: Toolbox file not found at {toolbox_file_path}", file=sys.stderr)
        sys.exit(1)
    except ValueError as e:
        print(f"Error parsing toolbox content: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"An unexpected error occurred: {e}", file=sys.stderr)
        sys.exit(1)