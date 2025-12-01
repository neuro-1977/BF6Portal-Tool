import os
import re
import json
import shutil
import datetime

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOG_FILE = os.path.join(BASE_DIR, 'CaptainsLog', 'README.md')
EXPORT_DIR = os.path.join(BASE_DIR, 'export')
WEB_UI_DIR = os.path.join(BASE_DIR, 'web_ui')

def parse_log_entries(log_path):
    if not os.path.exists(log_path):
        print(f"Log file not found: {log_path}")
        return []

    with open(log_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find entries
    # Matches: ### [Date] Title \n content... until next ### or end
    entry_pattern = re.compile(r'### \[(.*?)\] (.*?)\n(.*?)(?=\n### |$)', re.DOTALL)
    
    entries = []
    for match in entry_pattern.finditer(content):
        date_str = match.group(1)
        title = match.group(2)
        body = match.group(3).strip()
        
        # Parse body for specific fields
        objective_match = re.search(r'- \*\*Objective\*\*: (.*?)\n', body)
        status_match = re.search(r'- \*\*Status\*\*: (.*?)\n', body)
        
        objective = objective_match.group(1).strip() if objective_match else ""
        status = status_match.group(1).strip() if status_match else ""
        
        # Everything else is notes/changes
        # Simple cleanup
        notes = body
        
        entries.append({
            'date': date_str,
            'title': title,
            'objective': objective,
            'status': status,
            'notes': notes,
            'exported_at': datetime.datetime.now().isoformat()
        })
    
    return entries

def main():
    # 1. Create Export Directory
    if not os.path.exists(EXPORT_DIR):
        os.makedirs(EXPORT_DIR)
        print(f"Created export directory: {EXPORT_DIR}")

    # 2. Export Log to JSON
    entries = parse_log_entries(LOG_FILE)
    json_path = os.path.join(EXPORT_DIR, 'captains_log.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(entries, f, indent=2)
    print(f"Exported {len(entries)} log entries to {json_path}")

    # 3. Export Blocks to JSON
    ASSETS_DIR = os.path.join(BASE_DIR, '_archive', 'assets')
    if os.path.exists(ASSETS_DIR):
        blocks = []
        files = os.listdir(ASSETS_DIR)
        print(f"Processing {len(files)} block files from {ASSETS_DIR}...")
        
        for filename in files:
            if filename.endswith(".json"):
                file_path = os.path.join(ASSETS_DIR, filename)
                try:
                    with open(file_path, 'r') as f:
                        block_data = json.load(f)
                    
                    block_name = os.path.splitext(filename)[0]
                    # Normalize data for DB
                    blocks.append({
                        "type": block_name.upper().replace(" ", "_"),
                        "label": block_data.get("label", block_name),
                        "category": block_data.get("category", "Uncategorized"), # Assuming category might exist or default
                        "json_content": json.dumps(block_data)
                    })
                except Exception as e:
                    print(f"Error processing block {filename}: {e}")
        
        blocks_json_path = os.path.join(EXPORT_DIR, 'bf6_blocks.json')
        with open(blocks_json_path, 'w', encoding='utf-8') as f:
            json.dump(blocks, f, indent=2)
        print(f"Exported {len(blocks)} blocks to {blocks_json_path}")
    else:
        print(f"Warning: Assets directory not found: {ASSETS_DIR}")

    # 4. Copy BF6 Assets (Blocks & Toolbox)
    assets_to_copy = [
        ('block_definitions_gen.js', 'bf6_blocks.js'),
        ('toolbox_gen.js', 'bf6_toolbox.js'),
        ('startup.js', 'bf6_startup.js') # Also export the startup logic
    ]

    for src_name, dest_name in assets_to_copy:
        src_path = os.path.join(WEB_UI_DIR, src_name)
        dest_path = os.path.join(EXPORT_DIR, dest_name)
        if os.path.exists(src_path):
            shutil.copy2(src_path, dest_path)
            print(f"Copied {src_name} -> {dest_name}")
        else:
            print(f"Warning: Source file not found: {src_path}")

    print("\nNifty Export Complete! Check the 'export' folder.")

if __name__ == "__main__":
    main()
