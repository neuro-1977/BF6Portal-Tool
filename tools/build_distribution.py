import PyInstaller.__main__
import os
import shutil
from pathlib import Path

def build_exe():
    print("Starting PyInstaller build...")
    
    # Define paths
    project_root = Path(__file__).parent.parent
    source_dir = project_root / "source"
    assets_dir = project_root / "assets"
    dist_dir = project_root / "dist"
    
    # Clean previous build
    if dist_dir.exists():
        shutil.rmtree(dist_dir)
        
    # PyInstaller arguments
    args = [
        str(source_dir / "Block_Editor.py"),  # Entry point
        "--name=BF6PortalTool",
        "--noconfirm",
        "--windowed",  # No console window
        "--clean",
        # Add assets folder: source;destination
        f"--add-data={assets_dir}{os.pathsep}assets",
        # Add icon if it exists
        f"--icon={assets_dir / 'icon.ico'}" if (assets_dir / 'icon.ico').exists() else "",
        # Hidden imports often needed for Tkinter/PIL
        "--hidden-import=tkinter",
        "--hidden-import=PIL",
        "--hidden-import=PIL._tkinter_finder",
    ]
    
    # Filter out empty args
    args = [arg for arg in args if arg]
    
    # Run PyInstaller
    PyInstaller.__main__.run(args)
    
    print(f"Build complete. Executable is in {dist_dir / 'BF6PortalTool'}")

if __name__ == "__main__":
    build_exe()
