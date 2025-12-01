# Check for Winget
Write-Host "Checking for Winget..."
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
    Write-Error "Winget not found. Please ensure App Installer is installed from the Microsoft Store."
    exit 1
}

# Install DB Browser for SQLite
Write-Host "Installing DB Browser for SQLite..."
winget install -e --id DBBrowserForSQLite.DBBrowserForSQLite --accept-source-agreements --accept-package-agreements

# Prompt for Target Directory (Serenity Project)
$defaultPath = "D:\=Code=\Serenity"
$targetDir = Read-Host "Enter the path to your Serenity project (Press Enter for default: $defaultPath)"
if ([string]::IsNullOrWhiteSpace($targetDir)) {
    $targetDir = $defaultPath
}

# Create directory if it doesn't exist
if (-not (Test-Path $targetDir)) {
    Write-Host "Creating directory: $targetDir"
    New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
}

$dbPath = Join-Path $targetDir "serenity.db"
Write-Host "Creating Database at: $dbPath"

# Save DB Path for Sync Script
$configPath = "$PSScriptRoot\tools\serenity.config"
$dbPath | Out-File -FilePath $configPath -Encoding UTF8


# SQL to Create Table
$createTableSql = @"
CREATE TABLE IF NOT EXISTS LogEntries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    objective TEXT NOT NULL,
    status TEXT NOT NULL,
    changes TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
"@

# Create DB and Table using sqlite3 (if available) or PowerShell logic
# Since we might not have sqlite3.exe in path yet, we can use a simple .NET approach or just rely on the user opening it.
# But to be helpful, let's try to create it using a temporary C# script or just assume the user will open the GUI.
# BETTER: We can use the installed DB Browser to create it, but that's manual.
# Let's use a PowerShell function to create the SQLite DB using System.Data.SQLite if available, or just create a zero-byte file and let the user import?
# No, let's try to use the sqlite3 command line tool if we can install it, OR just use Python since we know Python is in the environment!

Write-Host "Running Nifty Export..."
python "$PSScriptRoot\tools\export_package.py"

Write-Host "Initializing Database Schema using Python..."
$pythonScript = @"
import sqlite3
import json
import os

db_path = r'$dbPath'
json_path = r'$PSScriptRoot\export\captains_log.json'

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create Tables
cursor.execute('''
CREATE TABLE IF NOT EXISTS LogEntries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    objective TEXT NOT NULL,
    status TEXT NOT NULL,
    changes TEXT,
    notes TEXT,
    image_path TEXT,
    rich_details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS Blocks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT UNIQUE NOT NULL,
    label TEXT,
    category TEXT,
    json_content TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
''')

# Import Log Data
if os.path.exists(json_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        entries = json.load(f)
        
    print(f"Importing {len(entries)} log entries...")
    for entry in entries:
        cursor.execute("SELECT id FROM LogEntries WHERE date = ? AND objective = ?", (entry['date'], entry['title']))
        if cursor.fetchone() is None:
            cursor.execute("INSERT INTO LogEntries (date, objective, status, notes) VALUES (?, ?, ?, ?)", 
                (entry['date'], entry['title'], entry['status'], entry['notes']))

# Import Block Data
blocks_json_path = r'$PSScriptRoot\export\bf6_blocks.json'
if os.path.exists(blocks_json_path):
    with open(blocks_json_path, 'r', encoding='utf-8') as f:
        blocks = json.load(f)

    print(f"Importing {len(blocks)} blocks...")
    for block in blocks:
        # Upsert logic (replace if exists)
        cursor.execute("INSERT OR REPLACE INTO Blocks (type, label, category, json_content) VALUES (?, ?, ?, ?)", 
            (block['type'], block['label'], block['category'], block['json_content']))
else:
    print("No blocks JSON found, skipping block import.")


conn.commit()
conn.close()
print(f"Database initialized successfully at {db_path}")
"@

$pythonScript | Out-File -FilePath "$PSScriptRoot\init_db.py" -Encoding UTF8
python "$PSScriptRoot\init_db.py"

# Copy Instructions to Serenity
$instructionsSrc = "$PSScriptRoot\export\SERENITY_INSTRUCTIONS.md"
$instructionsDest = Join-Path $targetDir "START.md"
if (Test-Path $instructionsSrc) {
    Copy-Item -Path $instructionsSrc -Destination $instructionsDest -Force
    Write-Host "Copied AI Instructions to: $instructionsDest"
}

# Copy Discord Bot Instructions
$discordSrc = "$PSScriptRoot\export\DISCORD_BOT_INSTRUCTIONS.md"
$discordDest = Join-Path $targetDir "DISCORD_BOT_INSTRUCTIONS.md"
if (Test-Path $discordSrc) {
    Copy-Item -Path $discordSrc -Destination $discordDest -Force
    Write-Host "Copied Discord Bot Instructions to: $discordDest"
}



# Copy Brain Verification Script
$verifySrc = "$PSScriptRoot\tools\verify_brain.py"
$verifyDest = Join-Path $targetDir "verify_brain.py"
if (Test-Path $verifySrc) {
    Copy-Item -Path $verifySrc -Destination $verifyDest -Force
    Write-Host "Copied Brain Verification Script to: $verifyDest"
}

# Clean up temp script
Remove-Item "$PSScriptRoot\init_db.py"

Write-Host "`nSetup Complete!"
Write-Host "1. DB Browser for SQLite has been installed."
Write-Host "2. Database created at: $dbPath"
Write-Host "3. Instructions copied for Serenity & Discord Bots."
Write-Host "4. You can now switch workspaces and the AI will know what to do!"
