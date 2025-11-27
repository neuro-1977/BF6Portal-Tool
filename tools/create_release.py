import zipfile
import os
from pathlib import Path

def create_release_zip():
    release_name = "BF6Portal_Blockly_Editor_v0.1.zip"
    files_to_include = [
        ("web_ui/index.html", "web_ui/index.html"),
        ("web_ui/definitions.js", "web_ui/definitions.js"),
        ("web_ui/toolbox.js", "web_ui/toolbox.js"),
        ("tools/launch_blockly.py", "launch_editor.py"), # Rename for convenience
        ("README.md", "README.md"),
        ("CONCEPT_ART.md", "CONCEPT_ART.md")
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
