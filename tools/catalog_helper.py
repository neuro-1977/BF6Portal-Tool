"""
Block Catalog Helper Tool (Serenity)
Assists in cataloging blocks from blockly-workspace/assets JSON files.
"""

import json
from pathlib import Path
from typing import Dict

class BlockCatalogHelper:
    def __init__(self, assets_path: str = "blockly-workspace/assets"):
        self.assets_path = Path(assets_path)
        self.catalog = {}

    def add_block(self, category: str, subcategory: str, block_data: Dict):
        if category not in self.catalog:
            self.catalog[category] = {"sub_categories": {}}
        if subcategory not in self.catalog[category]["sub_categories"]:
            self.catalog[category]["sub_categories"][subcategory] = []
        self.catalog[category]["sub_categories"][subcategory].append(block_data)

    def save_catalog(self, out_path: str = "blockly-workspace/assets/block_catalog.json"):
        with open(out_path, "w") as f:
            json.dump(self.catalog, f, indent=2)

if __name__ == "__main__":
    helper = BlockCatalogHelper()
    # Example usage: helper.add_block("LOGIC", "Comparison", {"id": "eq", "label": "Equals"})
    helper.save_catalog()
