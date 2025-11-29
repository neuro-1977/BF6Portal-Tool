import json
import os
import tkinter as tk
from pathlib import Path

def generate_icons():
    # Initialize Tkinter (required for PhotoImage)
    root = tk.Tk()
    root.withdraw()

    base_path = Path(__file__).parent.parent
    theme_path = base_path / "assets" / "ui_theme.json"
    
    if not theme_path.exists():
        print("Theme file not found!")
        return

    with open(theme_path, "r") as f:
        data = json.load(f)
    
    colors = data.get("colors", {})
    icons = data.get("icons", {})
    
    for category, icon_rel_path in icons.items():
        color = colors.get(category, "#FFFFFF")
        
        # Construct full path
        full_path = base_path / icon_rel_path
        
        # Ensure directory exists
        full_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Create a simple colored square icon
        # 24x24 pixels
        img = tk.PhotoImage(width=24, height=24)
        
        # Fill with color
        # PhotoImage.put takes a color and a list of coordinates or a rectangle
        # "to" option specifies the rectangle (x1, y1, x2, y2)
        try:
            img.put(color, to=(0, 0, 23, 23))
            
            # Add a simple letter overlay (optional, hard with just put)
            # We'll just stick to colored squares for now.
            
            img.write(str(full_path), format="png")
            print(f"Generated icon for {category} at {icon_rel_path}")
        except Exception as e:
            print(f"Failed to generate {category}: {e}")

    print("Icon generation complete.")
    root.destroy()

if __name__ == "__main__":
    generate_icons()
