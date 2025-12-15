import zipfile
import os
from pathlib import Path

def create_release_zip():
    release_name = "Serenity_Blockly_Editor_v1.0.1Beta.zip"
    files_to_include = [
        ("blockly-workspace/src/index.html", "index.html"),
        ("blockly-workspace/src/index.ts", "index.ts"),
        ("blockly-workspace/src/serialization.ts", "serialization.ts"),
        ("blockly-workspace/src/server.ts", "server.ts"),
        ("blockly-workspace/package.json", "package.json"),
        ("README.md", "README.md"),
        ("PROMPT.txt", "PROMPT.txt")
    ]
    print(f"Creating release package: {release_name}...")
    with zipfile.ZipFile(release_name, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for src, dst in files_to_include:
            if os.path.exists(src):
                print(f"  Adding {src} as {dst}")
                zipf.write(src, dst)
            else:
                print(f"  WARNING: File not found: {src}")
    print("Release package created successfully!")

if __name__ == "__main__":
    create_release_zip()
