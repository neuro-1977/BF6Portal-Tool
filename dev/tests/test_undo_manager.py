import unittest
import sys
from pathlib import Path
import tkinter as tk

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "source"))

from Block_Editor import BlockEditor

class TestUndoManager(unittest.TestCase):
    """Tests for the UndoManager functionality."""

    def setUp(self):
        """Set up a full editor instance for integration testing."""
        self.root = tk.Tk()
        self.root.withdraw()
        self.editor = BlockEditor(self.root)
        self.undo_manager = self.editor.undo_manager
        # Clear any initial blocks for a clean test slate
        self.editor.all_blocks.clear()
        self.undo_manager.undo_stack.clear()
        self.redo_stack = []
    
    def tearDown(self):
        self.root.destroy()

    def test_undo_redo_create(self):
        """Test the undo and redo of a 'create' action."""
        # 1. Create a block, which should call record_action automatically
        self.editor.block_mover._create_block_at(100, 100, {"label": "New Block"}, "TEST")
        
        block_id = f"block_{self.editor.current_id}"
        
        self.assertIn(block_id, self.editor.all_blocks)
        self.assertEqual(len(self.undo_manager.undo_stack), 1)
        self.assertEqual(len(self.undo_manager.redo_stack), 0)
        self.assertEqual(self.undo_manager.undo_stack[0]['type'], 'create')

        # 2. Undo the creation
        self.undo_manager.undo()

        self.assertNotIn(block_id, self.editor.all_blocks)
        self.assertEqual(len(self.undo_manager.undo_stack), 0)
        self.assertEqual(len(self.undo_manager.redo_stack), 1)
        self.assertEqual(self.undo_manager.redo_stack[0]['type'], 'create')

        # 3. Redo the creation
        self.undo_manager.redo()

        self.assertIn(block_id, self.editor.all_blocks)
        self.assertEqual(len(self.undo_manager.undo_stack), 1)
        self.assertEqual(len(self.undo_manager.redo_stack), 0)
        self.assertEqual(self.editor.all_blocks[block_id]['label'], 'New Block')

    def test_undo_redo_delete(self):
        """Test the undo and redo of a 'delete' action."""
        # 1. Create a block without recording for undo
        self.undo_manager.is_reverting = True
        self.editor.block_mover._create_block_at(100, 100, {"label": "Block To Delete"}, "TEST")
        self.undo_manager.is_reverting = False
        
        block_id = f"block_{self.editor.current_id}"
        self.assertIn(block_id, self.editor.all_blocks)
        
        # 2. Delete the block, which should record the action
        self.editor.delete_block(block_id)

        self.assertNotIn(block_id, self.editor.all_blocks)
        self.assertEqual(len(self.undo_manager.undo_stack), 1)
        self.assertEqual(self.undo_manager.undo_stack[0]['type'], 'delete')

        # 3. Undo the deletion
        self.undo_manager.undo()

        self.assertIn(block_id, self.editor.all_blocks)
        self.assertEqual(len(self.undo_manager.redo_stack), 1)

        # 4. Redo the deletion
        self.undo_manager.redo()

        self.assertNotIn(block_id, self.editor.all_blocks)
        self.assertEqual(len(self.undo_manager.undo_stack), 1)

    def test_undo_redo_move(self):
        """Test the undo and redo of a 'move' action."""
        # 1. Create a block
        self.editor.all_blocks.clear()
        block_id = self.editor.get_new_block_id()
        self.editor.all_blocks[block_id] = {
            "id": block_id, "label": "Movable", "type": "SEQUENCE",
            "x": 100, "y": 100, "width": 100, "height": 30,
            "canvas_obj": None, "widgets": [], "nested_blocks": []
        }

        # 2. Manually record a move action
        move_action = {
            "type": "move",
            "block_id": block_id,
            "original_pos": (100, 100),
            "new_pos": (250, 350)
        }
        self.undo_manager.record_action(move_action)
        
        # Manually move the block to the new position
        self.editor.all_blocks[block_id]['x'] = 250
        self.editor.all_blocks[block_id]['y'] = 350

        # 3. Undo the move
        self.undo_manager.undo()
        
        self.assertEqual(self.editor.all_blocks[block_id]['x'], 100)
        self.assertEqual(self.editor.all_blocks[block_id]['y'], 100)

        # 4. Redo the move
        self.undo_manager.redo()

        self.assertEqual(self.editor.all_blocks[block_id]['x'], 250)
        self.assertEqual(self.editor.all_blocks[block_id]['y'], 350)

if __name__ == "__main__":
    unittest.main()
