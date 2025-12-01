"""
Block Catalog Helper Tool
Assists in cataloging blocks from Battlefield Portal editor screenshots
"""

import json
from pathlib import Path
from typing import Dict, List, Optional

class BlockCatalogHelper:
    """Helper class to organize block catalog data"""
    
    def __init__(self, assets_path: str = "../assets"):
        self.assets_path = Path(assets_path)
        self.catalog = {
            "MATH": {"color": "#ff9800", "sub_categories": {}},
            "ARRAYS": {"color": "#795548", "sub_categories": {}},
            "AI": {"color": "#9c27b0", "sub_categories": {}},
            "AUDIO": {"color": "#00bcd4", "sub_categories": {}},
            "CAMERA": {"color": "#607d8b", "sub_categories": {}},
            "EFFECTS": {"color": "#e91e63", "sub_categories": {}},
            "EMPLACEMENTS": {"color": "#8bc34a", "sub_categories": {}},
            "GAMEPLAY": {"color": "#ff5722", "sub_categories": {}},
            "LOGIC": {"color": "#5b4a87", "sub_categories": {}},
            "OBJECTIVE": {"color": "#ffc107", "sub_categories": {}},
            "PLAYER": {"color": "#2196f3", "sub_categories": {}},
            "TRANSFORM": {"color": "#009688", "sub_categories": {}},
            "USER_INTERFACE": {"color": "#cddc39", "sub_categories": {}},
            "VEHICLES": {"color": "#ff6f00", "sub_categories": {}},
        }
    
    def add_block(self, category: str, subcategory: str, block_data: Dict):
        """Add a block to the catalog"""
        if category not in self.catalog:
            print(f"Warning: Unknown category {category}")
            return
        
        if subcategory not in self.catalog[category]["sub_categories"]:
            self.catalog[category]["sub_categories"][subcategory] = {}
        
        block_name = block_data.get("name")
        if not block_name:
            print("Error: Block must have a name")
            return
        
        # Format block data
        formatted_block = {
            "label": block_data.get("label", block_name),
            "type": block_data.get("type", "SEQUENCE"),
            "args": block_data.get("args", []),
        }
        
        # Optional fields
        if "param_labels" in block_data:
            formatted_block["param_labels"] = block_data["param_labels"]
        if "param_icons" in block_data:
            formatted_block["param_icons"] = block_data["param_icons"]
        if "description" in block_data:
            formatted_block["description"] = block_data["description"]
        
        self.catalog[category]["sub_categories"][subcategory][block_name] = formatted_block
        print(f"Added {block_name} to {category}/{subcategory}")
    
    def import_from_text(self, text_data: str):
        """
        Import blocks from structured text format
        
        Expected format:
        CATEGORY: Math
        SUBCATEGORY: Basic Operations
        - Add
          Type: VALUE
          Args: value1, value2
          Labels: A, B
          Icons: 123, 123
        - Subtract
          ...
        """
        current_category = None
        current_subcategory = None
        current_block = None
        
        lines = text_data.strip().split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            if line.startswith("CATEGORY:"):
                current_category = line.split(":", 1)[1].strip()
            elif line.startswith("SUBCATEGORY:"):
                current_subcategory = line.split(":", 1)[1].strip()
            elif line.startswith("-"):
                # New block
                if current_block:
                    self.add_block(current_category, current_subcategory, current_block)
                current_block = {"name": line[1:].strip()}
            elif current_block:
                if line.startswith("Type:"):
                    current_block["type"] = line.split(":", 1)[1].strip()
                elif line.startswith("Args:"):
                    args = line.split(":", 1)[1].strip()
                    current_block["args"] = [a.strip() for a in args.split(",")]
                elif line.startswith("Labels:"):
                    labels = line.split(":", 1)[1].strip().split(",")
                    if "args" in current_block:
                        current_block["param_labels"] = {
                            arg: label.strip() 
                            for arg, label in zip(current_block["args"], labels)
                        }
                elif line.startswith("Icons:"):
                    icons = line.split(":", 1)[1].strip().split(",")
                    if "args" in current_block:
                        current_block["param_icons"] = {
                            arg: icon.strip() 
                            for arg, icon in zip(current_block["args"], icons)
                        }
                elif line.startswith("Description:"):
                    current_block["description"] = line.split(":", 1)[1].strip()
        
        # Add last block
        if current_block:
            self.add_block(current_category, current_subcategory, current_block)
    
    def save_category(self, category: str, output_path: Optional[str] = None):
        """Save a category to JSON file"""
        if category not in self.catalog:
            print(f"Error: Category {category} not found")
            return
        
        if not output_path:
            category_lower = category.lower()
            output_path = self.assets_path / category_lower / f"{category_lower}_data.json"
        
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(self.catalog[category], f, indent=4)
        
        print(f"Saved {category} to {output_path}")
    
    def save_all(self):
        """Save all categories"""
        for category in self.catalog.keys():
            if self.catalog[category]["sub_categories"]:
                self.save_category(category)
    
    def generate_summary(self) -> str:
        """Generate a summary of the catalog"""
        lines = ["Block Catalog Summary", "=" * 50, ""]
        
        for category, data in self.catalog.items():
            subcats = data["sub_categories"]
            if not subcats:
                continue
            
            total_blocks = sum(len(blocks) for blocks in subcats.values())
            lines.append(f"{category}: {total_blocks} blocks")
            
            for subcat, blocks in subcats.items():
                lines.append(f"  - {subcat}: {len(blocks)} blocks")
                for block_name in blocks.keys():
                    lines.append(f"    • {block_name}")
            lines.append("")
        
        return "\n".join(lines)


def example_usage():
    """Example of how to use the catalog helper"""
    helper = BlockCatalogHelper()
    
    # Example 1: Add blocks manually
    helper.add_block("MATH", "Basic Operations", {
        "name": "Add",
        "label": "Add",
        "type": "VALUE",
        "args": ["value_a", "value_b"],
        "param_labels": {"value_a": "A", "value_b": "B"},
        "param_icons": {"value_a": "123", "value_b": "123"},
        "description": "Returns the sum of A and B"
    })
    
    # Example 2: Import from text
    text_input = """
CATEGORY: MATH
SUBCATEGORY: Basic Operations
- Subtract
  Type: VALUE
  Args: value_a, value_b
  Labels: A, B
  Icons: 123, 123
  Description: Returns A minus B
- Multiply
  Type: VALUE
  Args: value_a, value_b
  Labels: A, B
  Icons: 123, 123
  Description: Returns A times B
"""
    helper.import_from_text(text_input)
    
    # Save to file
    helper.save_category("MATH")
    
    # Print summary
    print(helper.generate_summary())


if __name__ == "__main__":
    # Interactive mode
    print("Block Catalog Helper")
    print("=" * 50)
    print("\nUsage modes:")
    print("1. Run example_usage()")
    print("2. Create helper = BlockCatalogHelper()")
    print("3. Use helper.import_from_text(your_text)")
    print("4. Use helper.save_all()")
    print("\nExample text format:")
    print("""
CATEGORY: MATH
SUBCATEGORY: Basic Operations
- BlockName
  Type: VALUE
  Args: arg1, arg2
  Labels: Label1, Label2
  Icons: 123, 123
  Description: What the block does
""")
