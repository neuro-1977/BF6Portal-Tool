"""
Quick Block Entry Script
Run this interactively to quickly add blocks to catalog
"""

import json
from pathlib import Path

def quick_entry():
    """Interactive script to quickly add blocks"""
    
    print("=" * 60)
    print("QUICK BLOCK ENTRY TOOL")
    print("=" * 60)
    print("\nEnter blocks as you see them in screenshots.")
    print("Type 'done' when finished with a category.\n")
    
    category = input("Category (MATH/ARRAYS/AI/etc.): ").strip().upper()
    subcategory = input("Subcategory (e.g., 'Basic Operations'): ").strip()
    
    blocks = {}
    
    while True:
        print("\n" + "-" * 60)
        block_name = input("\nBlock Name (or 'done' to finish): ").strip()
        
        if block_name.lower() == 'done':
            break
        
        print(f"\nEntering: {block_name}")
        
        # Block type
        print("\nBlock Type:")
        print("  1. SEQUENCE (rectangular action block)")
        print("  2. VALUE (rounded value block)")
        print("  3. C_SHAPED (C-shaped wrapper block)")
        print("  4. CONDITION (condition/boolean block)")
        
        type_choice = input("Type (1-4): ").strip()
        block_type = {
            "1": "SEQUENCE",
            "2": "VALUE",
            "3": "C_SHAPED",
            "4": "CONDITION"
        }.get(type_choice, "SEQUENCE")
        
        # Parameters
        print("\nParameters (comma-separated, or press Enter for none):")
        print("Example: player, health")
        args_input = input("Args: ").strip()
        args = [a.strip() for a in args_input.split(",")] if args_input else []
        
        # Parameter labels
        param_labels = {}
        param_icons = {}
        
        if args:
            print("\nParameter Details (press Enter to skip):")
            for arg in args:
                label = input(f"  Label for '{arg}': ").strip()
                if label:
                    param_labels[arg] = label
                
                icon = input(f"  Icon for '{arg}' (👤/123/ABC/⚙/etc.): ").strip()
                if icon:
                    param_icons[arg] = icon
        
        # Description
        description = input("\nDescription (optional): ").strip()
        
        # Build block data
        block_data = {
            "label": block_name,
            "type": block_type,
            "args": args
        }
        
        if param_labels:
            block_data["param_labels"] = param_labels
        if param_icons:
            block_data["param_icons"] = param_icons
        if description:
            block_data["description"] = description
        
        blocks[block_name] = block_data
        
        print(f"\n✓ Added {block_name}")
        print(f"  Type: {block_type}")
        print(f"  Args: {args}")
    
    # Save
    output_dir = Path("../assets") / category.lower()
    output_dir.mkdir(parents=True, exist_ok=True)
    output_file = output_dir / f"{category.lower()}_data.json"
    
    # Load existing or create new
    if output_file.exists():
        with open(output_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    else:
        data = {
            "color": "#ff9800",  # Default color
            "sub_categories": {}
        }
    
    # Add subcategory
    if subcategory not in data["sub_categories"]:
        data["sub_categories"][subcategory] = {}
    
    data["sub_categories"][subcategory].update(blocks)
    
    # Save
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)
    
    print(f"\n{'=' * 60}")
    print(f"✓ Saved {len(blocks)} blocks to {output_file}")
    print(f"{'=' * 60}")
    
    # Ask to continue
    if input("\nAdd another subcategory? (y/n): ").strip().lower() == 'y':
        quick_entry()


def batch_entry():
    """
    Batch entry mode - paste multiple blocks at once
    
    Format:
    BlockName1 | TYPE | arg1,arg2 | Label1,Label2 | Icon1,Icon2 | Description
    BlockName2 | TYPE | arg1 | Label1 | Icon1 | Description
    """
    
    print("=" * 60)
    print("BATCH BLOCK ENTRY TOOL")
    print("=" * 60)
    print("\nPaste block data (format: Name | Type | Args | Labels | Icons | Desc)")
    print("One block per line. Type 'END' on empty line when done.\n")
    
    category = input("Category: ").strip().upper()
    subcategory = input("Subcategory: ").strip()
    
    lines = []
    while True:
        line = input()
        if line.strip().upper() == 'END':
            break
        if line.strip():
            lines.append(line)
    
    blocks = {}
    
    for line in lines:
        parts = [p.strip() for p in line.split("|")]
        
        if len(parts) < 2:
            print(f"Skipping invalid line: {line}")
            continue
        
        block_name = parts[0]
        block_type = parts[1] if len(parts) > 1 else "SEQUENCE"
        
        args = []
        param_labels = {}
        param_icons = {}
        description = ""
        
        if len(parts) > 2 and parts[2]:
            args = [a.strip() for a in parts[2].split(",")]
        
        if len(parts) > 3 and parts[3]:
            labels = [l.strip() for l in parts[3].split(",")]
            param_labels = {arg: label for arg, label in zip(args, labels)}
        
        if len(parts) > 4 and parts[4]:
            icons = [i.strip() for i in parts[4].split(",")]
            param_icons = {arg: icon for arg, icon in zip(args, icons)}
        
        if len(parts) > 5:
            description = parts[5]
        
        block_data = {
            "label": block_name,
            "type": block_type,
            "args": args
        }
        
        if param_labels:
            block_data["param_labels"] = param_labels
        if param_icons:
            block_data["param_icons"] = param_icons
        if description:
            block_data["description"] = description
        
        blocks[block_name] = block_data
    
    # Save (same as quick_entry)
    output_dir = Path("../assets") / category.lower()
    output_dir.mkdir(parents=True, exist_ok=True)
    output_file = output_dir / f"{category.lower()}_data.json"
    
    if output_file.exists():
        with open(output_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
    else:
        data = {
            "color": "#ff9800",
            "sub_categories": {}
        }
    
    if subcategory not in data["sub_categories"]:
        data["sub_categories"][subcategory] = {}
    
    data["sub_categories"][subcategory].update(blocks)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4)
    
    print(f"\n✓ Saved {len(blocks)} blocks to {output_file}")


def show_menu():
    """Main menu"""
    while True:
        print("\n" + "=" * 60)
        print("BLOCK CATALOG ENTRY TOOL")
        print("=" * 60)
        print("\n1. Quick Entry (interactive, one block at a time)")
        print("2. Batch Entry (paste multiple blocks)")
        print("3. Exit")
        
        choice = input("\nChoice (1-3): ").strip()
        
        if choice == "1":
            quick_entry()
        elif choice == "2":
            batch_entry()
        elif choice == "3":
            print("Goodbye!")
            break
        else:
            print("Invalid choice")


if __name__ == "__main__":
    show_menu()
