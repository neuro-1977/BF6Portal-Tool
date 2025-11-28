import unittest
import sys
from pathlib import Path
import tkinter as tk

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "source"))

# We need to import all the components to build a minimal editor
from Block_Editor import BlockEditor
from Block_Mover import BlockMover
from Block_Data_Manager import BlockDataManager
from Block_Renderer import BlockRenderer

class TestValueBlockSnapping(unittest.TestCase):
    """Tests for value block snapping logic in Block_Mover."""

    def setUp(self):
        """Set up a minimal, headless editor environment for testing."""
        self.root = tk.Tk()
        # Hide the main window
        self.root.withdraw()

        # We create a lightweight "mock" editor that has the real components we need.
        # This is more of an integration test than a pure unit test.
        class MockEditor:
            def __init__(self, master):
                self.master = master
                self.all_blocks = {}
                self.current_id = 0
                self.zoom_scale = 1.0
                
                # Add constants needed by other modules
                self.CHILD_BLOCK_WIDTH = 280
                self.CHILD_BLOCK_HEIGHT = 42
                self.BASE_GRID = 20

                # Mock necessary UI components that managers might access
                self.canvas = tk.Canvas(master)
                self.logger = lambda: None # Mock logger
                self.logger.log_info = print
                self.logger.log_error = print
                
                # Real components that we are testing the interaction of
                self.data_manager = BlockDataManager(self)
                self.block_renderer = BlockRenderer(self)
                self.block_mover = BlockMover(self)

            def get_new_block_id(self):
                self.current_id += 1
                return f"block_{self.current_id}"

            def draw_block(self, block_id, highlight=False):
                # Mock draw function
                pass

            def update_block_position(self, block_id):
                # Mock update function
                pass
            
            def update_code_preview(self):
                # Mock preview update
                pass

            def update_scrollbars(self):
                # Mock scrollbar update
                pass

        self.editor = MockEditor(self.root)
        self.block_mover = self.editor.block_mover

    def tearDown(self):
        """Destroy the Tkinter window."""
        self.root.destroy()

    def test_snap_valid_value_block(self):
        """Test snapping a valid value block ('Number') into a 'Number' slot."""
        # 1. Create a parent block with a 'Number' parameter slot
        # We'll use 'SetPlayerHealth' which we modified in action_data.json
        parent_id = "block_1"
        self.editor.all_blocks[parent_id] = {
            "id": parent_id,
            "label": "SetPlayerHealth", "type": "ACTIONS", "category": "ACTIONS",
            "x": 100, "y": 100, "width": 250, "height": 38,
            "inputs": {
                "player": {'block': None, 'type': 'Player'},
                "amount": {'block': None, 'type': 'Number'}
            },
            "canvas_obj": "poly_1", "widgets": []
        }

        # 2. Create a 'Number' value block
        # The label is used for the type check, so it must be "Number"
        # The 'amount' slot is the 2nd param (index 1), at x=100 + 100 + (1*60) = 260.
        # Let's place the value block's connection point very close to that.
        value_block_x = 255
        value_block_y = 110
        value_block_id = "block_2"
        self.editor.all_blocks[value_block_id] = {
            "id": value_block_id,
            "label": "Number", "type": "VALUE", "category": "VALUES",
            "x": value_block_x, "y": value_block_y,
            "width": 100, "height": 30,
            "connection_output": {"x": value_block_x, "y": value_block_y + 10, "type": "value"},
            "canvas_obj": "poly_2", "widgets": []
        }

        # 3. Call _attempt_snap
        snapped = self.block_mover._attempt_snap(value_block_id)

        # 4. Assertions
        self.assertTrue(snapped, "The block should have snapped.")
        
        parent_block = self.editor.all_blocks[parent_id]
        self.assertEqual(parent_block['inputs']['amount']['block'], value_block_id, "Parent 'amount' slot should contain the value block's ID.")
        
        value_block = self.editor.all_blocks[value_block_id]
        self.assertEqual(value_block['nested_in_param'], (parent_id, 'amount'), "Value block should be marked as nested in the parent's 'amount' parameter.")

    def test_snap_invalid_value_block_type(self):
        """Test that a 'String' block does not snap into a 'Number' slot."""
        # 1. Create a parent block with a 'Number' parameter slot
        parent_id = "block_1"
        self.editor.all_blocks[parent_id] = {
            "id": parent_id,
            "label": "SetPlayerHealth", "type": "ACTIONS", "category": "ACTIONS",
            "x": 100, "y": 100, "width": 250, "height": 38,
            "inputs": {
                "player": {'block': None, 'type': 'Player'},
                "amount": {'block': None, 'type': 'Number'}
            },
            "canvas_obj": "poly_1", "widgets": []
        }

        # 2. Create a 'String' value block (incorrect type) at a valid snap distance
        value_block_x = 255
        value_block_y = 110
        value_block_id = "block_2"
        self.editor.all_blocks[value_block_id] = {
            "id": value_block_id,
            "label": "String", "type": "VALUE", "category": "VALUES",
            "x": value_block_x, "y": value_block_y,
            "width": 100, "height": 30,
            "connection_output": {"x": value_block_x, "y": value_block_y + 10, "type": "value"},
            "canvas_obj": "poly_2", "widgets": []
        }

        # 3. Call _attempt_snap
        snapped = self.block_mover._attempt_snap(value_block_id)

        # 4. Assertions
        self.assertFalse(snapped, "An invalid block type should not have snapped.")
        
        parent_block = self.editor.all_blocks[parent_id]
        self.assertIsNone(parent_block['inputs']['amount']['block'], "Parent 'amount' slot should remain empty.")


class TestCopyPaste(unittest.TestCase):
    """Tests for copy and paste functionality in Block_Editor."""

    def setUp(self):
        """Set up a full editor instance for integration testing."""
        self.root = tk.Tk()
        self.root.withdraw()
        
        # The methods to test live on the real BlockEditor, so we instantiate it.
        # This makes it more of an integration test.
        self.editor = BlockEditor(self.root)

        # Mock the UI methods that would throw errors in a headless environment
        def mock_winfo(self, *args, **kwargs):
            return 0
        self.editor.master.winfo_pointerx = lambda: 300
        self.editor.master.winfo_pointery = lambda: 300
        self.editor.master.winfo_rootx = lambda: 0
        self.editor.master.winfo_rooty = lambda: 0
    
    def tearDown(self):
        self.root.destroy()

    def test_copy_paste_single_block(self):
        """Test copying and pasting a single block."""
        # 1. Create a block to copy, using the editor's ID generator
        # The editor may have initial blocks, so we don't assume a clean slate.
        self.editor.all_blocks.clear() # Start clean for this test
        block_id = self.editor.get_new_block_id()
        self.editor.all_blocks[block_id] = {
            "id": block_id, "label": "TestBlock", "type": "SEQUENCE",
            "x": 50, "y": 50, "width": 100, "height": 30,
            "nested_blocks": []
        }
        num_blocks_before = len(self.editor.all_blocks)
        last_id_before = self.editor.current_id

        # 2. Select and copy the block
        self.editor.selected_block = block_id
        self.editor.copy_block()

        # 3. Assert clipboard content
        self.assertIsNotNone(self.editor.clipboard)
        self.assertEqual(self.editor.clipboard['head_id'], block_id)
        self.assertEqual(len(self.editor.clipboard['blocks']), 1)

        # 4. Paste the block
        self.editor.paste_block()

        # 5. Assertions
        self.assertEqual(len(self.editor.all_blocks), num_blocks_before + 1, "A new block should have been created.")
        
        # Find the new block (it will have the highest ID)
        pasted_block_id = f"block_{last_id_before + 1}"
        self.assertIn(pasted_block_id, self.editor.all_blocks)
        self.assertNotEqual(pasted_block_id, block_id)

        original_block = self.editor.all_blocks[block_id]
        pasted_block = self.editor.all_blocks[pasted_block_id]

        self.assertEqual(pasted_block['label'], original_block['label'], "Pasted block should have the same label.")
        # Position should be based on mouse pointer (mocked to 300, 300)
        # and the original block's position (50, 50). dx = 250, dy = 250.
        # So new x = 50 + 250 = 300.
        self.assertEqual(pasted_block['x'], 300)
        self.assertEqual(pasted_block['y'], 300)

    def test_copy_paste_chained_blocks(self):
        """Test copying and pasting a chain of connected blocks."""
        # 1. Create two connected blocks
        block_a_id = self.editor.get_new_block_id()
        block_b_id = self.editor.get_new_block_id()
        self.editor.all_blocks[block_a_id] = {
            "id": block_a_id, "label": "BlockA", "type": "SEQUENCE",
            "x": 50, "y": 50, "width": 100, "height": 30,
            "next_block": block_b_id, "previous_block": None,
            "nested_blocks": []
        }
        self.editor.all_blocks[block_b_id] = {
            "id": block_b_id, "label": "BlockB", "type": "SEQUENCE",
            "x": 50, "y": 80, "width": 100, "height": 30,
            "next_block": None, "previous_block": block_a_id,
            "nested_blocks": []
        }
        num_blocks_before = len(self.editor.all_blocks)
        last_id_before = self.editor.current_id

        # 2. Select and copy the head of the chain
        self.editor.selected_block = block_a_id
        self.editor.copy_block()

        # 3. Assert clipboard content
        self.assertEqual(len(self.editor.clipboard['blocks']), 2)

        # 4. Paste the blocks
        self.editor.paste_block()

        # 5. Assertions
        self.assertEqual(len(self.editor.all_blocks), num_blocks_before + 2, "Two new blocks should have been created.")

        # 6. Find the new blocks and check their connections
        new_a_id = f"block_{last_id_before + 1}"
        new_b_id = f"block_{last_id_before + 2}"
        self.assertIn(new_a_id, self.editor.all_blocks)
        self.assertIn(new_b_id, self.editor.all_blocks)

        new_block_a = self.editor.all_blocks[new_a_id]
        new_block_b = self.editor.all_blocks[new_b_id]

        # Check labels to be sure we have the right blocks
        self.assertEqual(new_block_a['label'], "BlockA")
        self.assertEqual(new_block_b['label'], "BlockB")

        # Check re-mapped connections
        self.assertEqual(new_block_a['next_block'], new_b_id, "New A should point to New B.")
        self.assertEqual(new_block_b['previous_block'], new_a_id, "New B should point back to New A.")

        # Check relative positioning
        original_dy = self.editor.all_blocks[block_b_id]['y'] - self.editor.all_blocks[block_a_id]['y']
        new_dy = new_block_b['y'] - new_block_a['y']
        self.assertEqual(new_dy, original_dy, "Relative Y position of chained blocks should be maintained.")



if __name__ == "__main__":
    unittest.main()
