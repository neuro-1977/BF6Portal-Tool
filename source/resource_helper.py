import sys
import os
from pathlib import Path

def get_base_path():
    """
    Get the base path for resources, handling both development and PyInstaller 'frozen' modes.
    
    Returns:
        Path: The absolute path to the project root (where assets/ is located).
    """
    if getattr(sys, 'frozen', False):
        # Running in a PyInstaller bundle
        # sys._MEIPASS is the temporary folder where PyInstaller extracts files
        base_path = Path(sys._MEIPASS)
    else:
        # Running in a normal Python environment
        # This file is in source/, so parent is project root
        base_path = Path(__file__).parent.parent
        
    return base_path.resolve()

def get_asset_path(relative_path):
    """
    Get the absolute path to an asset.
    
    Args:
        relative_path (str): Path relative to the project root (e.g., "assets/icon.ico")
        
    Returns:
        Path: Absolute path to the asset.
    """
    return get_base_path() / relative_path
