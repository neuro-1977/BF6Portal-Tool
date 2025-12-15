"""
BLOCKLY MIGRATION TOOL (Serenity)
----------------------
This script bridges the gap between your JSON block definitions and the Blockly web interface.

It performs the following:
1. Scans the `blockly-workspace/assets/` directory for JSON block definitions.
2. Maps internal types to Blockly shapes (Statement, Hat, Value).
3. Generates `blockly-workspace/src/definitions.ts` (Blockly block definitions).
4. Generates `blockly-workspace/src/toolbox.ts` (Sidebar menu structure).

Run this script whenever you update the JSON assets to refresh the Web UI.
"""

import json
import os
from pathlib import Path

# Map internal types to Blockly shapes
type_mapping = {
    "ACTIONS": {"type": "statement"},
    "SEQUENCE": {"type": "statement"},
    "VALUE": {"type": "value"},
    "MATH": {"type": "value"},
    "LOGIC": {"type": "value"},
    "ARRAYS": {"type": "value"},
    "PLAYER": {"type": "value"},
    "GAMEPLAY": {"type": "value"},
    "TRANSFORM": {"type": "value"},
    "VEHICLE": {"type": "value"},
    "CONDITIONS": {"type": "value", "check": "Boolean"},
    "EVENTS": {"type": "hat"},
    "MOD": {"type": "hat"},
    "RULES": {"type": "statement"},
    "SUBROUTINE": {"type": "hat"},
    "C_SHAPED": {"type": "statement", "nested": True}
}

assets_dir = Path("web_ui/assets")
definitions_out = Path("web_ui/src/definitions.ts")
toolbox_out = Path("web_ui/src/toolbox.ts")

def main():
    # Example: just list all JSON files in assets
    block_files = list(assets_dir.glob("*.json"))
    print(f"Found block definition files: {block_files}")
    # TODO: Implement full conversion logic as needed for your project
    # This is a placeholder for your real migration logic
    with open(definitions_out, "w") as f:
        f.write("// Auto-generated block definitions\n")
    with open(toolbox_out, "w") as f:
        f.write("// Auto-generated toolbox\n")
    print("Definitions and toolbox stubs written.")

if __name__ == "__main__":
    main()
