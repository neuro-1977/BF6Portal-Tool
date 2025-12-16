import re
import os

def extract_selection_lists(input_path, output_path):
    if not os.path.exists(input_path):
        print(f"Input file not found: {input_path}")
        return

    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to capture Enum Name and the Body inside {}
    enum_pattern = re.compile(r'export enum (\w+)\s*\{([^}]+)\}', re.MULTILINE | re.DOTALL)
    
    enums = enum_pattern.findall(content)
    
    if not enums:
        print("No enums found.")
        return

    print(f"Found {len(enums)} enums.")

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write("SELECTION LISTS:\n")
        
        for name, body in enums:
            # Remove comments
            body = re.sub(r'//.*', '', body)
            
            # Replace newlines with commas and split by comma
            raw_items = body.replace('\n', ',').split(',')
            items = [item.strip() for item in raw_items if item.strip()]
            
            clean_items = []
            for item in items:
                # Extract the key part (before =)
                if '=' in item:
                    key = item.split('=')[0].strip()
                else:
                    key = item.strip()
                
                if key:
                    clean_items.append(key)
            
            block_name = name
            if not block_name.endswith("Item"):
                block_name_suffix = block_name + "Item"
            else:
                block_name_suffix = block_name

            f.write(f"{block_name_suffix}\n")
            f.write(f"widget 1:\n")
            f.write(f"{block_name}\n") 
            f.write(f"widget 2:\n")
            for item in clean_items:
                f.write(f"{item}\n")
            
            f.write("\n\n")

    print(f"Successfully wrote to {output_path}")

if __name__ == "__main__":
    input_file = os.path.join(os.getcwd(), '=Resources=', 'portal-docs-json', 'index.d.ts')
    output_file = os.path.join(os.getcwd(), 'selection-lists.md')
    extract_selection_lists(input_file, output_file)