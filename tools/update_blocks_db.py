import sqlite3
import json
import re
import os
from pathlib import Path

# Configuration
DB_PATH = 'serenity.db'
BLOCKS_FILES = [
    'web_ui/src/blocks/bf6portal.ts',
    'web_ui/src/blocks/bf6portal_expanded.ts'
]
TOOLBOX_FILE = 'web_ui/src/toolbox.ts'

def get_db_connection():
    return sqlite3.connect(DB_PATH)

def extract_json_from_ts(file_path):
    """
    Extracts the JSON array from a TypeScript file.
    Assumes the format: export const ... = Blockly.common.createBlockDefinitionsFromJsonArray([...]);
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find the start of the JSON array
        match = re.search(r'createBlockDefinitionsFromJsonArray\(\s*(\[.*\])\s*\);', content, re.DOTALL)
        if match:
            json_str = match.group(1)
            
            # REMOVED NAIVE COMMENT STRIPPING TO PROTECT URLS (https://...)
            # If actual comments exist, json.loads will fail and we'll fall back.
            
            # Trailing commas are valid in JS/TS but not JSON
            # We try to fix them. This might still be risky if inside strings, but less common for comma+bracket
            json_str = re.sub(r',\s*\]', ']', json_str)
            json_str = re.sub(r',\s*\}', '}', json_str)

            try:
                return json.loads(json_str)
            except json.JSONDecodeError as e:
                print(f"Error parsing JSON from {file_path}: {e}")
                # Fallback: try manual extraction if it's a list of objects
                blocks = []
                # Simple regex to grab objects. This is brittle but might work for simple formatted files
                # Finds { ... } blocks. Logic: Match { then non-{} or nested {} then }
                # This simple regex handles one level of nesting which is usually enough for args0
                object_pattern = re.compile(r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}', re.DOTALL)
                matches = object_pattern.findall(json_str)
                for m in matches:
                    try:
                        # Attempt to clean individual block strings if needed
                        blocks.append(json.loads(m))
                    except:
                        pass # skip malformed
                if blocks:
                    return blocks
                return []
        else:
            print(f"Could not find createBlockDefinitionsFromJsonArray in {file_path}")
            return []
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return []

def extract_categories_from_toolbox(file_path):
    """
    Extracts block categories from the toolbox definition.
    Returns a dict: { block_type: category_name }
    """
    block_categories = {}
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Extract the toolbox object
        match = re.search(r'export const toolbox = ({.*});', content, re.DOTALL)
        if match:
            toolbox_str = match.group(1)
            
            # Find all categories
            category_pattern = re.compile(r"\{[^{}]*'kind':\s*'category',[^{}]*'name':\s*'([^']+)',[^{}]*'contents':\s*\[(.*?)\]", re.DOTALL)
            categories = category_pattern.findall(toolbox_str)
            
            for cat_name, contents in categories:
                # Find all block types in this category
                type_pattern = re.compile(r"'type':\s*'([^']+)'")
                types = type_pattern.findall(contents)
                for t in types:
                    block_categories[t] = cat_name
                    
    except Exception as e:
        print(f"Error reading toolbox {file_path}: {e}")
        
    return block_categories

def update_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Ensure table exists
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS BlockReference (
            block_id TEXT PRIMARY KEY,
            name TEXT,
            category TEXT,
            colour INTEGER,
            tooltip TEXT,
            message TEXT,
            args_json TEXT,
            output_type TEXT,
            connections TEXT
        )
    ''')
    
    # Get categories mapping
    categories = extract_categories_from_toolbox(TOOLBOX_FILE)
    print(f"Found {len(categories)} block categorizations.")

    # Process block files
    total_blocks = 0
    for file_path in BLOCKS_FILES:
        blocks = extract_json_from_ts(file_path)
        print(f"Processing {len(blocks)} blocks from {file_path}")
        
        for block in blocks:
            block_type = block.get('type')
            if not block_type:
                continue

            # Determine category
            category = categories.get(block_type, 'Uncategorized')
            if category == 'Uncategorized':
                # Try case-insensitive lookup
                for t, c in categories.items():
                    if t.lower() == block_type.lower():
                        category = c
                        break

            # Determine Output / Connections
            output_type = block.get('output')
            connections = "None"
            if 'previousStatement' in block:
                connections = "Statement"
            if output_type:
                connections = "Value"

            # Prepare data
            block_data = (
                block_type,
                block.get('message0', ''), # Using message0 as name/label proxy
                category,
                block.get('colour', 0),
                block.get('tooltip', ''),
                block.get('message0', ''),
                json.dumps(block.get('args0', [])),
                str(output_type) if output_type else None,
                connections
            )

            # Upsert
            cursor.execute('''
                INSERT INTO BlockReference (block_id, name, category, colour, tooltip, message, args_json, output_type, connections)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(block_id) DO UPDATE SET
                    name=excluded.name,
                    category=excluded.category,
                    colour=excluded.colour,
                    tooltip=excluded.tooltip,
                    message=excluded.message,
                    args_json=excluded.args_json,
                    output_type=excluded.output_type,
                    connections=excluded.connections
            ''', block_data)
            
            total_blocks += 1

    conn.commit()
    conn.close()
    print(f"Successfully updated DB with {total_blocks} blocks.")

if __name__ == "__main__":
    update_db()