import json
import re
import os
from pathlib import Path
from typing import Dict, List, Set, Tuple

class CatalogCoverageChecker:
    def __init__(self, workspace_root: str):
        self.root = Path(workspace_root)
        self.assets_dir = self.root / "assets"
        self.docs_dir = self.root / "docs"
        self.expected_file = self.docs_dir / "EXPECTED_BLOCKS_REFERENCE.md"
        self.report_file = self.docs_dir / "CATALOG_COVERAGE_REPORT.md"
        
        self.implemented_blocks: Dict[str, List[str]] = {} # Category -> [Block Names]
        self.expected_blocks: Dict[str, List[str]] = {}    # Category -> [Block Names]

    def load_implemented_blocks(self):
        """Load blocks from assets/*/*_data.json"""
        print("Loading implemented blocks...")
        for category_dir in self.assets_dir.iterdir():
            if not category_dir.is_dir():
                continue
                
            # Look for *_data.json files
            for data_file in category_dir.glob("*_data.json"):
                try:
                    with open(data_file, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        
                    category_name = category_dir.name.upper()
                    # Normalize category names (singular/plural)
                    if category_name == "ARRAYS": category_name = "ARRAY"
                    if category_name == "CONDITIONS": category_name = "CONDITION"
                    if category_name == "ACTIONS": category_name = "ACTION"
                    if category_name == "EVENTS": category_name = "EVENT"
                    if category_name == "VEHICLES": category_name = "VEHICLE"
                    if category_name == "EMPLACEMENTS": category_name = "EMPLACEMENT"
                    
                    if category_name not in self.implemented_blocks:
                        self.implemented_blocks[category_name] = []
                        
                    # Handle different JSON structures
                    # Structure 1: "sub_categories": { "Sub": { "BLOCK_ID": {...} } }
                    if "sub_categories" in data:
                        for sub in data["sub_categories"].values():
                            for block_id, block_def in sub.items():
                                # Use label if available, else ID
                                name = block_def.get("label", block_id)
                                self.implemented_blocks[category_name].append(name)
                    
                    # Structure 2: Direct dictionary (if any)
                    # (Add logic here if other formats exist)
                    
                except Exception as e:
                    print(f"Error reading {data_file}: {e}")

    def parse_expected_blocks(self):
        """Parse EXPECTED_BLOCKS_REFERENCE.md"""
        print("Parsing expected blocks...")
        if not self.expected_file.exists():
            print(f"Error: {self.expected_file} not found.")
            return

        current_category = "UNKNOWN"
        
        with open(self.expected_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                
                # Detect Category Header (## MATH BLOCKS)
                cat_match = re.match(r"^##\s+(\w+)", line)
                if cat_match:
                    current_category = cat_match.group(1).upper()
                    if current_category not in self.expected_blocks:
                        self.expected_blocks[current_category] = []
                    continue
                
                # Detect Block Item (- Block Name ...)
                # Regex to capture the name before any parenthesis or dash
                block_match = re.match(r"^-\s+([^(]+?)(?:\s*\(|\s*-|$)", line)
                if block_match:
                    block_name = block_match.group(1).strip()
                    if current_category != "UNKNOWN":
                        self.expected_blocks[current_category].append(block_name)

    def generate_report(self):
        """Generate Markdown report"""
        print("Generating report...")
        
        # Normalize categories for comparison
        # Map EXPECTED categories to IMPLEMENTED categories if names differ
        # (e.g. MATH BLOCKS -> MATH)
        
        all_categories = set(self.expected_blocks.keys()) | set(self.implemented_blocks.keys())
        
        with open(self.report_file, 'w', encoding='utf-8') as f:
            f.write("# Block Catalog Coverage Report\n\n")
            f.write(f"Generated on: {os.popen('date /t').read().strip()}\n\n")
            
            total_expected = sum(len(v) for v in self.expected_blocks.values())
            total_implemented = sum(len(v) for v in self.implemented_blocks.values())
            
            f.write(f"**Summary:**\n")
            f.write(f"- Total Expected Blocks: {total_expected}\n")
            f.write(f"- Total Implemented Blocks: {total_implemented}\n")
            f.write(f"- Coverage: {int(total_implemented / total_expected * 100) if total_expected > 0 else 0}%\n\n")
            
            f.write("---\n\n")
            
            for category in sorted(all_categories):
                expected = set(self.expected_blocks.get(category, []))
                implemented = set(self.implemented_blocks.get(category, []))
                
                # Fuzzy matching
                def normalize(s):
                    return re.sub(r'[^a-zA-Z0-9]', '', s).lower()
                
                expected_norm = {normalize(x): x for x in expected}
                implemented_norm = {normalize(x): x for x in implemented}
                
                matched_keys = set(expected_norm.keys()) & set(implemented_norm.keys())
                
                matched = {expected_norm[k] for k in matched_keys}
                missing = {expected_norm[k] for k in set(expected_norm.keys()) - matched_keys}
                extra = {implemented_norm[k] for k in set(implemented_norm.keys()) - matched_keys}
                
                f.write(f"## {category}\n")
                f.write(f"Progress: {len(matched)}/{len(expected)} ({(len(matched)/len(expected)*100) if len(expected) > 0 else 0:.1f}%)\n\n")
                
                if missing:
                    f.write("### ❌ Missing\n")
                    for b in sorted(missing):
                        f.write(f"- {b}\n")
                    f.write("\n")
                
                if matched:
                    f.write("### ✅ Implemented\n")
                    for b in sorted(matched):
                        f.write(f"- {b}\n")
                    f.write("\n")
                    
                if extra:
                    f.write("### ⚠️ Extra / Unmatched Names\n")
                    for b in sorted(extra):
                        f.write(f"- {b}\n")
                    f.write("\n")
                
                f.write("---\n")

        print(f"Report generated at {self.report_file}")

if __name__ == "__main__":
    checker = CatalogCoverageChecker(".")
    checker.load_implemented_blocks()
    checker.parse_expected_blocks()
    checker.generate_report()
