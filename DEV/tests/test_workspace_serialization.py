import unittest
import sys
from pathlib import Path
import tkinter as tk
import json

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "source"))

from Block_Editor import BlockEditor
from editor_helpers import serialize_workspace
from workspace_loader import load_blocks_from_json

class TestWorkspaceSerialization(unittest.TestCase):
    """Tests for saving and loading the entire workspace state."""

    def setUp(self):
        """Set up a full editor instance for integration testing."""
        self.root = tk.Tk()
        self.root.withdraw()
        self.editor = BlockEditor(self.root)
        # Clear any initial blocks for a clean test slate
        self.editor.all_blocks.clear()
    
    def tearDown(self):
        self.root.destroy()

    def test_save_and_load_complex_workspace(self):
        """Test that a complex workspace can be serialized and deserialized without data loss."""
        # 1. Build a complex workspace programmatically
        # Parent Block
        parent_id = self.editor.get_new_block_id()
        self.editor.all_blocks[parent_id] = {
            "id": parent_id, "label": "Parent", "type": "ACTIONS", "category": "ACTIONS",
            "x": 100, "y": 100, "width": 250, "height": 38,
            "inputs": {"amount": {'block': None, 'type': 'Number'}},
            "next_block": None
        }
        # Value Block to be nested
        value_id = self.editor.get_new_block_id()
        self.editor.all_blocks[value_id] = {
            "id": value_id, "label": "Number", "type": "VALUE", "category": "VALUES",
            "x": 200, "y": 110, "width": 100, "height": 30,
            "value": tk.StringVar(value="123"), "nested_in_param": (parent_id, "amount")
        }
        # Nest the value block
        self.editor.all_blocks[parent_id]["inputs"]["amount"]["block"] = value_id

        # Chained Block
        chained_id = self.editor.get_new_block_id()
        self.editor.all_blocks[chained_id] = {
            "id": chained_id, "label": "Chained", "type": "SEQUENCE",
            "x": 100, "y": 138, "width": 100, "height": 30,
            "previous_block": parent_id
        }
        # Connect the chain
        self.editor.all_blocks[parent_id]["next_block"] = chained_id
        
        num_blocks_before = len(self.editor.all_blocks)
        self.assertEqual(num_blocks_before, 3)

        # 2. Serialize the workspace
        serialized_blocks = serialize_workspace(self.editor.all_blocks)
        
        # Create a full export data structure
        export_data = {
            "version": "1.1.0-test",
            "blocks": serialized_blocks,
            "rule_state": {}
        }

        # 3. Deserialize into the (cleared) editor
        load_blocks_from_json(self.editor, export_data)

        # 4. Assertions
        self.assertEqual(len(self.editor.all_blocks), num_blocks_before, "Should have the same number of blocks after loading.")

        # Get the restored blocks
        restored_parent = self.editor.all_blocks[parent_id]
        restored_value = self.editor.all_blocks[value_id]
        restored_chained = self.editor.all_blocks[chained_id]

        # Check connections
        self.assertEqual(restored_parent["next_block"], chained_id, "Vertical chain connection should be restored.")
        self.assertEqual(restored_chained["previous_block"], parent_id, "Vertical chain connection should be restored (reverse).")
        self.assertEqual(restored_parent["inputs"]["amount"]["block"], value_id, "Value block nesting should be restored.")
        self.assertEqual(restored_value["nested_in_param"], (parent_id, "amount"), "Value block's parent parameter link should be restored.")
        
        # Check that tk.StringVar was restored correctly
        self.assertIsInstance(restored_value["value"], tk.StringVar, "The 'value' field should be a tk.StringVar object after loading.")
        self.assertEqual(restored_value["value"].get(), "123", "The value of the restored tk.StringVar should be correct.")

if __name__ == "__main__":
    unittest.main()
