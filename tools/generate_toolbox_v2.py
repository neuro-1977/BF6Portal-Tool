
import sqlite3
import re
import json

DB_PATH = 'serenity.db'
OUTPUT_FILE = 'web_ui/src/toolbox.ts'

# Categories based on BF6 Portal Menu
CATEGORIES = [
    "Rules", "AI", "Arrays", "Audio", "Camera", "Conditions", "Control", 
    "Effects", "Emplacements", "Events", "Gameplay", "Logic", "Math", 
    "Mod", "Objective", "Player", "Subroutine", "Teleport", "UI", 
    "Values", "Vehicles", "Vectors", "Other"
]

def get_blocks():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('SELECT block_id FROM BlockReference')
    blocks = [row[0] for row in cursor.fetchall()]
    conn.close()
    return blocks

def categorize_block(block_id):
    bid = block_id.upper()
    
    if bid in ['MOD_BLOCK', 'RULE_HEADER', 'CONDITION_BLOCK', 'ACTION_BLOCK', 'COMMENT']:
        return 'Rules'
    
    if bid.startswith('AI'): return 'AI'
    if 'ARRAY' in bid: return 'Arrays'
    if any(x in bid for x in ['AUDIO', 'SOUND', 'VO', 'MUSIC']): return 'Audio'
    if 'CAMERA' in bid: return 'Camera'
    if any(x in bid for x in ['EFFECT', 'SCREENFLASH', 'SCREENFADE']): return 'Effects'
    if 'EMPLACEMENT' in bid: return 'Emplacements'
    if bid.startswith('EVENT') or bid.startswith('ON_'): return 'Events'
    if any(x in bid for x in ['GAMEMODE', 'SCORE', 'TIME', 'FRIENDLYFIRE']): return 'Gameplay'
    if any(x in bid for x in ['IF', 'WHILE', 'FOR', 'BREAK', 'CONTINUE', 'WAIT', 'ABORT', 'SKIP', 'RETURN']): return 'Control'
    if any(x in bid for x in ['AND', 'OR', 'NOT', 'TRUE', 'FALSE', 'EQUAL', 'GREATER', 'LESS']): return 'Logic'
    if any(x in bid for x in ['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'SIN', 'COS', 'TAN', 'MOD', 'ABS', 'SQRT', 'POWER', 'ROUND', 'CEILING', 'FLOOR']): return 'Math'
    if any(x in bid for x in ['PLAYER', 'SOLDIER', 'SQUAD', 'TEAM', 'REVIVE', 'MAN', 'KIT', 'INVENTORY']): return 'Player'
    if 'SUBROUTINE' in bid: return 'Subroutine'
    if 'TELEPORT' in bid: return 'Teleport'
    if any(x in bid for x in ['MESSAGE', 'HUD', 'SCOREBOARD', 'ICON']): return 'UI'
    if 'VEHICLE' in bid: return 'Vehicles'
    if any(x in bid for x in ['VECTOR', 'CROSSPRODUCT', 'DOTPRODUCT']): return 'Vectors'
    if any(x in bid for x in ['NUMBER', 'STRING', 'BOOL', 'VAR']): return 'Values'
    
    return 'Other'

def generate_toolbox():
    blocks = get_blocks()
    
    # Initialize categories
    toolbox_data = {cat: [] for cat in CATEGORIES}
    
    for block in blocks:
        # Filter out internal/duplicate blocks if necessary
        # For now, include everything but maybe prioritize uppercase (expanded) blocks
        # if duplicates exist.
        
        cat = categorize_block(block)
        if cat in toolbox_data:
            toolbox_data[cat].append(block)
        else:
            toolbox_data['Other'].append(block)

    # Sort blocks within categories
    for cat in toolbox_data:
        toolbox_data[cat].sort()

    # Build TS content
    ts_content = """/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

"""
    ts_content += "export const toolbox = {\n"
    ts_content += "  'kind': 'categoryToolbox',\n"
    ts_content += "  'contents': [\n"

    # Add standard categories
    for cat in CATEGORIES:
        if not toolbox_data[cat]:
            continue
            
        color = '#5C68A6' # Default blue-ish
        # Assign colors based on bf6_theme if possible (simplified here)
        if cat == 'Rules': color = '#A285E6'
        elif cat == 'AI': color = '#B5A045'
        elif cat == 'Events': color = '#5CA65C'
        elif cat == 'Control': color = '#E6A85C'
        
        ts_content += "    {\n"
        ts_content += f"      'kind': 'category',\n"
        ts_content += f"      'name': '{cat}',\n"
        ts_content += f"      'colour': '{color}',\n"
        ts_content += "      'contents': [\n"
        
        for block in toolbox_data[cat]:
            ts_content += f"        {{ 'kind': 'block', 'type': '{block}' }},\n"
            
        ts_content = ts_content.rstrip(",\n") + "\n"
        ts_content += "      ]\n"
        ts_content += "    },\n"

    # Add custom dynamic categories
    ts_content += """
    {
      'kind': 'category',
      'name': 'Variables',
      'colour': '#A65C5C',
      'custom': 'VARIABLES_CATEGORY'
    },
    {
      'kind': 'category',
      'name': 'Subroutines',
      'colour': '#E6A85C',
      'custom': 'SUBROUTINES_CATEGORY'
    }
"""
    ts_content += "  ]\n"
    ts_content += "};\n""

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(ts_content)
    
    print(f"Generated toolbox at {OUTPUT_FILE} with {len(blocks)} blocks.")

if __name__ == '__main__':
    generate_toolbox()
