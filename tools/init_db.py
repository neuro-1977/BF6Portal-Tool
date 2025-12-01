import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'bf6portal.db')

def init_db():
    print(f"Initializing BF6Portal Database at: {DB_PATH}")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # System Logs (Isolated)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS SystemLogs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        level TEXT,
        source TEXT,
        message TEXT
    )
    ''')

    # Block Definitions (For saving custom blocks)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS BlockDefinitions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        block_type TEXT UNIQUE,
        json_def TEXT,
        generator_stub TEXT
    )
    ''')

    conn.commit()
    conn.close()
    print("✓ Database initialized successfully.")

if __name__ == "__main__":
    init_db()
