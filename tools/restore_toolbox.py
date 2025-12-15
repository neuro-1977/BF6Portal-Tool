
import os
import json
import re
import sys # Import sys for stderr

ASSETS_DIR = 'web_ui/assets' # Clarified: assuming JSON definitions are here now
BLOCK_DATA_FILE = 'bf6portal_blocks.json' # New source for block data
OUTPUT_FILE = 'web_ui/src/toolbox.ts'

# Map category folders to display names and colors
CATEGORY_MAP = {
    "rules": {"name": "Rules", "colour": "#A285E6"},
    "mod": {"name": "Mod", "colour": "#995CA6"},
    "events": {"name": "Events", "colour": "#5CA65C"},
    "conditions": {"name": "Conditions", "colour": "#5C81A6"},
    "actions": {"name": "Actions", "colour": "#F9A825"},
    "control": {"name": "Control", "colour": "#A285E6"}, # Merged?
    "arrays": {"name": "Arrays", "colour": "#B5A045"},
    "audio": {"name": "Audio", "colour": "#B5A045"},
    "camera": {"name": "Camera", "colour": "#B5A045"},
    "effects": {"name": "Effects", "colour": "#B5A045"},
    "emplacements": {"name": "Emplacements", "colour": "#B5A045"},
    "gameplay": {"name": "Gameplay", "colour": "#B5A045"},
    "logic": {"name": "Logic", "colour": "#B5A045"},
    "math": {"name": "Math", "colour": "#5C68A6"},
    "objective": {"name": "Objective", "colour": "#B5A045"},
    "other": {"name": "Other", "colour": "#B5A045"},
    "player": {"name": "Player", "colour": "#B5A045"},
    "subroutine": {"name": "Subroutine", "colour": "#E6A85C"},
    "transform": {"name": "Transform", "colour": "#B5A045"},
    "ui": {"name": "UI", "colour": "#B5A045"},
    "values": {"name": "Values", "colour": "#45B5B5"},
    "vehicles": {"name": "Vehicles", "colour": "#B5A045"},
    # Add any missing ones
}

def get_json_block_ids():
    """
    Reads block data from the bf6portal_blocks.json file.
    Returns a dict: { lower_case_block_id: original_case_block_id }
    """
    if not os.path.exists(BLOCK_DATA_FILE):
        print(f"Error: Block data file not found at {BLOCK_DATA_FILE}. Please run update_blocks_db.py first.", file=sys.stderr)
        return {}
    
    with open(BLOCK_DATA_FILE, 'r', encoding='utf-8') as f:
        all_blocks = json.load(f)
    
    blocks_dict = {}
    for block in all_blocks:
        blocks_dict[block['block_id'].lower()] = block['block_id']
    return blocks_dict

def snake_case(name):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

def restore_toolbox():
    json_block_ids = get_json_block_ids() # Get block IDs from JSON file
    toolbox_contents = []

    # Iterate through known categories in specific order if possible, or alphabetical
    # Check if ASSETS_DIR exists and contains subdirectories
    if not os.path.isdir(ASSETS_DIR):
        print(f"Warning: Assets directory not found at {ASSETS_DIR}. Skipping toolbox restoration.", file=sys.stderr)
        # Proceed with an empty toolbox or default if necessary, or just exit.
        # For now, will exit, as there are no JSON definitions to parse.
        return

    sorted_dirs = sorted([d for d in os.listdir(ASSETS_DIR) if os.path.isdir(os.path.join(ASSETS_DIR, d))])
    
    # Prioritize Rules and Mod
    priority = ['rules', 'mod', 'events', 'conditions', 'actions']
    sorted_dirs = sorted(sorted_dirs, key=lambda x: priority.index(x) if x in priority and x in sorted_dirs else len(priority))

    for dir_name in sorted_dirs:
        if dir_name not in CATEGORY_MAP:
            continue
            
        json_path = os.path.join(ASSETS_DIR, dir_name, f"{dir_name}_data.json")
        if not os.path.exists(json_path):
            continue

        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except Exception as e:
            print(f"Skipping {dir_name}: {e}")
            continue

        cat_info = CATEGORY_MAP[dir_name]
        
        category_blocks = []
        
        if "sub_categories" in data:
            for sub_name, blocks in data["sub_categories"].items():
                for block_key, block_def in blocks.items():
                    found_type = None
                    # Look up in our json_block_ids (case-insensitive)
                    if block_key.lower() in json_block_ids:
                        found_type = json_block_ids[block_key.lower()]
                    elif snake_case(block_key).lower() in json_block_ids:
                        found_type = json_block_ids[snake_case(block_key).lower()]
                    
                    if found_type:
                        category_blocks.append(found_type)
        
        if category_blocks:
            toolbox_contents.append({
                'kind': 'category',
                'name': cat_info['name'],
                'colour': cat_info['colour'],
                'contents': [{'kind': 'block', 'type': t} for t in category_blocks]
            })

    # Add custom dynamic categories
    toolbox_contents.append({
      'kind': 'category',
      'name': 'Variables',
      'colour': '#A65C5C',
      'custom': 'VARIABLES_CATEGORY'
    })
    toolbox_contents.append({
      'kind': 'category',
      'name': 'Subroutines',
      'colour': '#E6A85C',
      'custom': 'SUBROUTINES_CATEGORY'
    })

    # Construct final object
    final_toolbox = {
        'kind': 'categoryToolbox',
        'contents': toolbox_contents
    }

    # Write to TS file
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("/**\n * @license\n * Copyright 2023 Google LLC\n * SPDX-License-Identifier: Apache-2.0\n */\n\n")
        f.write("export const toolbox = ")
        json.dump(final_toolbox, f, indent=2)
        f.write(";\n")

    print(f"Restored toolbox with {len(toolbox_contents)} categories.")

if __name__ == '__main__':
    restore_toolbox()
