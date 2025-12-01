import sqlite3
import os
import json

# Configuration
CONFIG_FILE = os.path.join(os.path.dirname(__file__), 'serenity.config')
if os.path.exists(CONFIG_FILE):
    with open(CONFIG_FILE, 'r', encoding='utf-8') as f:
        DB_PATH = f.read().strip()
else:
    print("Error: serenity.config not found. Run setup_database.ps1 first.")
    exit(1)

def get_db_connection():
    return sqlite3.connect(DB_PATH)

def sync_workspace(workspace_name, workspace_path):
    print(f"\n--- Syncing Workspace: {workspace_name} ({workspace_path}) ---")
    
    if not os.path.exists(workspace_path):
        print(f"Warning: Path not found: {workspace_path}")
        return

    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Sync Logs (Captain's Log)
    # This logic is similar to sync_from_serenity.py but generalized
    log_file = os.path.join(workspace_path, 'CaptainsLog', 'README.md')
    # If workspace doesn't have CaptainsLog folder, maybe skip or create?
    # For now, let's assume standard structure or just skip.
    if os.path.exists(os.path.dirname(log_file)):
        print("Syncing Captain's Log...")
        cursor.execute("SELECT date, objective, status, notes FROM LogEntries ORDER BY created_at DESC")
        rows = cursor.fetchall()
        
        current_content = ""
        if os.path.exists(log_file):
            with open(log_file, 'r', encoding='utf-8') as f:
                current_content = f.read()
        
        new_entries = ""
        for row in rows:
            date, title, status, notes = row
            if f"### [{date}] {title}" not in current_content:
                new_entries += f"\n### [{date}] {title}\n- **Objective**: {title}\n- **Status**: {status}\n- **Notes**:\n    {notes}\n"
        
        if new_entries:
            with open(log_file, 'a', encoding='utf-8') as f:
                f.write(new_entries)
            print(f"  -> Added new entries to {log_file}")
        else:
            print("  -> Log up to date.")

    # 2. Sync Instructions (AI_INSTRUCTIONS.md)
    # We can push updated instructions if they change in the DB (future feature)
    # For now, let's just ensure the file exists if we have a template.
    
    conn.close()

def main():
    print(f"Connecting to Serenity Brain at: {DB_PATH}")
    
    # In the future, we can store this list IN the database itself!
    # For now, we define them here.
    workspaces = [
        ("BF6Portal Tool", os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        # ("Discord Bot", "D:\\=Code=\\DiscordBot"), # Example
        # ("Another Project", "D:\\=Code=\\Another"), # Example
    ]

    for name, path in workspaces:
        sync_workspace(name, path)

    print("\nAll workspaces synced with the Brain.")

if __name__ == "__main__":
    main()
