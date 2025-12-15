
import sqlite3
import re
import json
import os

TOOLBOX_PATH = 'web_ui/src/toolbox.ts'
DB_PATH = 'serenity.db'

# Regex to find block types in toolbox.ts
BLOCK_TYPE_REGEX = re.compile(r"'type':\s*'([^']+)'")

# Regex to identify categories in toolbox.ts
# Matches: { 'kind': 'category', 'name': 'NAME', 'colour': 'COLOR', 'contents': [ ... ] }
# We need to capture the name, colour, and the start/end indices of the contents array to insert blocks.
# Since parsing TS/JS with regex is hard, we will load the file, parse the JSON-like structure (after some cleanup),
# modify it, and write it back. Or, simpler: read the file, identify the "contents" list of each category, and append.

def get_db_blocks():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute('SELECT block_id, connections FROM BlockReference')
    blocks = {}
    for row in cursor.fetchall():
        # Map block_id to {connections: ...}
        # connections is "Statement", "Value", or "None"
        blocks[row['block_id']] = row['connections']
    conn.close()
    return blocks

def categorize_block(block_id):
    bid = block_id.upper()
    
    if bid in ['MOD_BLOCK', 'RULE_HEADER', 'CONDITION_BLOCK', 'ACTION_BLOCK', 'COMMENT']:
        return 'RULES'
    
    if bid.startswith('AI') : return 'AI'
    if 'ARRAY' in bid: return 'ARRAYS'
    if any(x in bid for x in ['AUDIO', 'SOUND', 'VO', 'MUSIC']): return 'AUDIO'
    if 'CAMERA' in bid: return 'CAMERA'
    if any(x in bid for x in ['EFFECT', 'SCREENFLASH', 'SCREENFADE']): return 'EFFECTS'
    if 'EMPLACEMENT' in bid: return 'EMPLACEMENTS'
    if bid.startswith('EVENT') or bid.startswith('ON_'): 
        # Events usually go to Event Payloads (Value) or Rules (Statement)
        # But here we have specific categories.
        # "EVENT PAYLOADS" is green. "EVENTS" (if any) might be yellow.
        return 'EVENT PAYLOADS' # Defaulting to the Green category name
    if any(x in bid for x in ['GAMEMODE', 'SCORE', 'TIME', 'FRIENDLYFIRE']): return 'GAMEPLAY' # Mapped to Green GAMEPLAY or Yellow GAME MODE
    if any(x in bid for x in ['IF', 'WHILE', 'FOR', 'BREAK', 'CONTINUE', 'WAIT', 'ABORT', 'SKIP', 'RETURN']): return 'LOGIC'
    if any(x in bid for x in ['AND', 'OR', 'NOT', 'TRUE', 'FALSE', 'EQUAL', 'GREATER', 'LESS']): return 'LOGIC'
    if any(x in bid for x in ['ADD', 'SUBTRACT', 'MULTIPLY', 'DIVIDE', 'SIN', 'COS', 'TAN', 'MOD', 'ABS', 'SQRT', 'POWER', 'ROUND', 'CEILING', 'FLOOR']): return 'MATH'
    if any(x in bid for x in ['PLAYER', 'SOLDIER', 'SQUAD', 'TEAM', 'REVIVE', 'MAN', 'KIT', 'INVENTORY']): return 'PLAYER'
    if 'SUBROUTINE' in bid: return 'SUBROUTINES'
    if 'TELEPORT' in bid: return 'PLAYER' # Often in Player
    if any(x in bid for x in ['MESSAGE', 'HUD', 'SCOREBOARD', 'ICON']): return 'USER INTERFACE'
    if 'VEHICLE' in bid: return 'VEHICLES'
    if any(x in bid for x in ['VECTOR', 'CROSSPRODUCT', 'DOTPRODUCT']): return 'VECTORS' # Mapped to Green VECTORS (if exists) or Math? Original had Vectors.
    if any(x in bid for x in ['NUMBER', 'STRING', 'BOOL', 'VAR']): return 'LITERALS'
    
    if 'OBJECTIVE' in bid or 'CAPTURE' in bid or 'MCOM' in bid: return 'OBJECTIVES' # Yellow OBJECTIVES (STATEMENT) or Green OBJECTIVE

    return 'OTHER'

def normalize_category_name(name):
    # Map variation names to canonical ones for comparison
    n = name.upper()
    if n == 'GAME MODE': return 'GAMEPLAY'
    if n == 'OBJECTIVES (STATEMENT)': return 'OBJECTIVES'
    if n == 'OBJECTIVE': return 'OBJECTIVES'
    return n

def fill_gaps():
    with open(TOOLBOX_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract existing blocks
    existing_blocks = set(BLOCK_TYPE_REGEX.findall(content))
    print(f"Found {len(existing_blocks)} blocks already in toolbox.")

    # Get all DB blocks
    db_blocks = get_db_blocks()
    print(f"Found {len(db_blocks)} blocks in DB.")

    # Identify missing blocks
    missing_blocks = [b for b in db_blocks.keys() if b not in existing_blocks and b != 'input_value'] # Filter internal types
    print(f"Found {len(missing_blocks)} missing blocks.")

    # We need to insert them.
    # Parsing the file:
    # It's a JS object. We can try to split by 'kind': 'category'
    
    # Strategy:
    # 1. Iterate over the file content looking for category definitions.
    # 2. When a category is found, parse its name and colour.
    # 3. Determine if it's a Statement (Yellow) or Value (Green) category.
    #    - Yellow: colour '#FFEB3B'
    #    - Green: colour '#4CAF50'
    #    - Others: Rules (#A285E6), etc.
    # 4. Filter missing blocks that belong to this category AND match the connection type.
    # 5. Insert them into the 'contents' array of that category.

    # Regex to find category start: { 'kind': 'category', 'name': 'NAME', 'colour': 'COLOR',
    # Note: Quotes can be single or double. Spaces variable.
    cat_regex = re.compile(r"\{\s*['\"]kind['\"]\s*:\s*['\"]category['\"]\s*,\s*['\"]name['\"]\s*:\s*['\"]([^'\"]+)['\"]\s*,\s*['\"]colour['\"]\s*:\s*['\"]([^'\"]+)['\"]", re.IGNORECASE)
    
    # We will rebuild the file content
    new_content = ""
    last_pos = 0
    
    for match in cat_regex.finditer(content):
        # Append everything up to this match
        new_content += content[last_pos:match.end()]
        last_pos = match.end()
        
        cat_name = match.group(1)
        cat_colour = match.group(2).upper()
        
        # Determine target connection type based on color
        target_conn = None
        if cat_colour == '#FFEB3B': # Yellow
            target_conn = "Statement"
        elif cat_colour == '#4CAF50': # Green
            target_conn = "Value"
        
        # Special cases (Rules is purple but acts like Statement for high level blocks)
        if cat_name.upper() == 'RULES':
            target_conn = "Statement" # Or special "None" for Rule Headers

        if not target_conn:
            continue

        # Find blocks for this category
        blocks_to_add = []
        canonical_cat = normalize_category_name(cat_name)
        
        for block_id in missing_blocks:
            # Check category match
            b_cat = categorize_block(block_id)
            if normalize_category_name(b_cat) != canonical_cat:
                continue
                
            # Check connection match
            b_conn = db_blocks[block_id]
            
            # DB "None" often means Statement (e.g. commands without prev/next like headers, or just unannotated)
            # But usually Statement blocks have "Statement". Value have "Value".
            
            # Logic:
            # If Yellow menu: accept Statement and None (if not strictly value)
            # If Green menu: accept Value
            
            if target_conn == "Statement":
                if b_conn == "Statement" or b_conn == "None":
                    blocks_to_add.append(block_id)
            elif target_conn == "Value":
                if b_conn == "Value":
                    blocks_to_add.append(block_id)

        if blocks_to_add:
            print(f"Adding {len(blocks_to_add)} blocks to {cat_name} ({cat_colour})")
            # We need to find the 'contents': [ part and insert after it
            # The regex stopped at 'colour': '...'
            # We assume 'contents': [ follows closely.
            
            chunk_after = content[last_pos:last_pos+200]
            contents_match = re.search(r"['\"]contents['\"]\s*:\s*\[", chunk_after)
            
            if contents_match:
                # Append up to the opening bracket
                insert_pos = last_pos + contents_match.end()
                new_content += content[last_pos:insert_pos]
                last_pos = insert_pos
                
                # Insert blocks
                for b in blocks_to_add:
                    new_content += f"\n        {{ 'kind': 'block', 'type': '{b}' }},"
                    # Remove from missing_blocks so we don't add it twice (e.g. if names overlap)
                    # Actually better to keep it in missing_blocks list but remove from local iteration
                    pass 
                
                # Remove added from global missing list to prevent dups in Other?
                # For now, let's just let the loop handle it.
                # Ideally we modify missing_blocks, but modifying list while iterating is bad.
                # We can use a set to track added.
                pass

    # Append the rest of the file
    new_content += content[last_pos:]
    
    with open(TOOLBOX_PATH, 'w', encoding='utf-8') as f:
        f.write(new_content)

if __name__ == '__main__':
    fill_gaps()
