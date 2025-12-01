import sqlite3
import os
import json

# Configuration
# We need to know where the DB is. Since we don't store state, we'll ask or look for a config.
# For now, let's assume the user passes the path or we look in a standard place.
# Better yet, let's look for a 'serenity.path' file that setup_database.ps1 could have created?
# Or just ask the user to provide the path in the script arguments.

# Read DB Path from Config
CONFIG_FILE = os.path.join(os.path.dirname(__file__), 'serenity.config')
if os.path.exists(CONFIG_FILE):
    with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
        DEFAULT_DB_PATH = f.read().strip()
else:
    DEFAULT_DB_PATH = r"D:\=Code=\Serenity\serenity.db" 

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOG_FILE = os.path.join(BASE_DIR, 'CaptainsLog', 'README.md')

def sync_logs(cursor):
    print("Checking for new log entries in Serenity...")
    cursor.execute("SELECT date, objective, status, notes FROM LogEntries ORDER BY created_at DESC")
    rows = cursor.fetchall()
    
    # Read local log to compare
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, 'r', encoding='utf-8') as f:
            local_content = f.read()
    else:
        local_content = ""

    new_entries_count = 0
    entries_text = ""
    
    for row in rows:
        date, title, status, notes = row
        # Simple check if title is in file
        if f"### [{date}] {title}" not in local_content:
            entries_text += f"\n### [{date}] {title}\n"
            entries_text += f"- **Objective**: {title}\n" # Using title as objective if missing
            entries_text += f"- **Status**: {status}\n"
            entries_text += f"- **Notes**:\n    {notes}\n"
            new_entries_count += 1

    if new_entries_count > 0:
        print(f"Found {new_entries_count} new entries. Appending to Captain's Log...")
        # Append to the top of entries? Or just append? 
        # Markdown structure makes appending to top hard without parsing.
        # Let's just append for now, or user can manually sort.
        # Ideally we'd insert after "## Entries".
        
        if "## Entries" in local_content:
            parts = local_content.split("## Entries")
            new_content = parts[0] + "## Entries\n" + entries_text + parts[1]
            with open(LOG_FILE, 'w', encoding='utf-8') as f:
                f.write(new_content)
        else:
            with open(LOG_FILE, 'a', encoding='utf-8') as f:
                f.write(entries_text)
    else:
        print("No new log entries found.")

def main():
    db_path = DEFAULT_DB_PATH
    if not os.path.exists(db_path):
        # Try to find it relative or ask user
        print(f"Error: Serenity DB not found at {db_path}")
        print("Please edit this script to set the correct DEFAULT_DB_PATH.")
        return

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        sync_logs(cursor)
        
        # Future: Sync blocks back if Serenity modified them?
        # sync_blocks(cursor)
        
        conn.close()
        print("Sync complete.")
    except Exception as e:
        print(f"Sync failed: {e}")

if __name__ == "__main__":
    main()
