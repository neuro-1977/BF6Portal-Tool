import zipfile
import os
from pathlib import Path

def create_release_zip():
    release_name = "BF6Portal_Tool_v1.2.4.zip"
    files_to_include = [
        ("web_ui/src/index.html", "index.html"),
        ("web_ui/src/index.ts", "index.ts"),
        ("web_ui/src/serialization.ts", "serialization.ts"),
        ("web_ui/src/server.ts", "server.ts"),
        ("package.json", "package.json"),
        ("README.md", "README.md"),
        ("dist/BF6Portal Tool Setup 1.2.4.exe", "BF6Portal Tool Setup 1.2.4.exe")
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
