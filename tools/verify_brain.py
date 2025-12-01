import sqlite3
import os
import time

# This script is intended to be run by the Serenity AI on startup.
# It verifies the connection to the Brain (serenity.db) and prints the status.

DB_NAME = 'serenity.db'
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, DB_NAME)

def loading_bar(task, duration=1.0):
    print(f"[{task}]", end="", flush=True)
    steps = 10
    for i in range(steps):
        time.sleep(duration / steps)
        print(".", end="", flush=True)
    print(" [OK]")

def main():
    print("\n--- INITIATING SERENITY BRAIN CONNECTION ---\n")
    
    loading_bar("Locating Database")
    if not os.path.exists(DB_PATH):
        print(f"\n[CRITICAL ERROR] Database not found at: {DB_PATH}")
        print("Please run the setup script from the BF6Portal Tool workspace.")
        return

    loading_bar("Establishing Neural Link")
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        loading_bar("Verifying Memory Integrity")
        cursor.execute("SELECT count(*) FROM LogEntries")
        log_count = cursor.fetchone()[0]
        
        cursor.execute("SELECT count(*) FROM Blocks")
        block_count = cursor.fetchone()[0]
        
        conn.close()
        
        print("\n--- SYSTEM READY ---")
        print(f"Memory Status: ONLINE")
        print(f"Log Entries:   {log_count}")
        print(f"Block Defs:    {block_count}")
        print("--------------------\n")
        print("Protocol: READ 'LogEntries' table for latest objectives.")
        print("Protocol: CHECK 'DISCORD_BOT_INSTRUCTIONS.md' for comms status.")
        
    except Exception as e:
        print(f"\n[SYSTEM FAILURE] Connection refused: {e}")

if __name__ == "__main__":
    main()
