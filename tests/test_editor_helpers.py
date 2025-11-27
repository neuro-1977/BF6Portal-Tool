"""
Unit tests for editor_helpers module.

Tests the data parsing and code output generation functions.
"""

import unittest
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "source"))

from editor_helpers import get_dropdown_items, update_code_output


class TestGetDropdownItems(unittest.TestCase):
    """Tests for get_dropdown_items function."""

    def test_empty_block_data(self):
        """Test with empty block data."""
        result = get_dropdown_items({}, "ACTIONS")
        self.assertEqual(result, [])

    def test_simple_flat_structure(self):
        """Test with simple flat action data structure."""
        block_data = {
            "ACTIONS": {
                "Basic": {
                    "action1": {"label": "Action 1", "type": "SEQUENCE"},
                    "action2": {"label": "Action 2", "type": "SEQUENCE"},
                }
            }
        }
        result = get_dropdown_items(block_data, "ACTIONS")
        self.assertEqual(len(result), 2)
        self.assertIn(("action1", "Action 1"), result)
        self.assertIn(("action2", "Action 2"), result)

    def test_nested_subcategories(self):
        """Test with nested subcategories (like AI actions)."""
        block_data = {
            "ACTIONS": {
                "AI/Behaviour": {
                    "AIBattle": {"label": "AI Battle", "type": "SEQUENCE"},
                    "AIDefend": {"label": "AI Defend", "type": "SEQUENCE"},
                },
                "Basic": {"Move": {"label": "Move", "type": "SEQUENCE"}},
            }
        }
        result = get_dropdown_items(block_data, "ACTIONS")
        self.assertGreaterEqual(len(result), 2)
        # Check that nested items are flattened
        labels = [label for _, label in result]
        self.assertIn("AI Battle", labels)
        self.assertIn("AI Defend", labels)

    def test_missing_tab(self):
        """Test with missing tab name."""
        block_data = {"EVENTS": {"event1": {"label": "Event 1"}}}
        result = get_dropdown_items(block_data, "ACTIONS")
        self.assertEqual(result, [])

    def test_conditions_tab(self):
        """Test with CONDITIONS tab."""
        block_data = {
            "CONDITIONS": {
                "Basic": {
                    "cond1": {"label": "Condition 1"},
                    "cond2": {"label": "Condition 2"},
                }
            }
        }
        result = get_dropdown_items(block_data, "CONDITIONS")
        self.assertEqual(len(result), 2)
        keys = [k for k, _ in result]
        self.assertIn("cond1", keys)
        self.assertIn("cond2", keys)

    def test_deeply_nested_structure(self):
        """Test with deeply nested category structure."""
        block_data = {
            "ACTIONS": {
                "Advanced": {
                    "AIBehaviour": {
                        "action1": {"label": "Action 1", "type": "SEQUENCE"}
                    }
                }
            }
        }
        result = get_dropdown_items(block_data, "ACTIONS")
        # Should flatten at least one level
        self.assertGreater(len(result), 0)

    def test_return_type_is_list_of_tuples(self):
        """Test that return type is list of (key, label) tuples."""
        block_data = {"ACTIONS": {"act1": {"label": "Act 1"}}}
        result = get_dropdown_items(block_data, "ACTIONS")
        self.assertIsInstance(result, list)
        if len(result) > 0:
            self.assertIsInstance(result[0], tuple)
            self.assertEqual(len(result[0]), 2)


class TestUpdateCodeOutput(unittest.TestCase):
    """Tests for update_code_output function."""

    def test_with_no_placed_panels(self):
        """Test code output with no placed panels."""

        # Mock editor object
        class MockEditor:
            def __init__(self):
                self.placed_panels = []
                self.code_output_text = MockText()

        editor = MockEditor()
        try:
            update_code_output(editor)
            # Should not raise exception
            self.assertTrue(True)
        except Exception as e:
            self.fail(f"update_code_output raised {type(e).__name__} unexpectedly: {e}")

    def test_with_single_placed_panel(self):
        """Test code output with one placed panel."""

        class MockText:
            def __init__(self):
                self.content = ""
                self.enabled = False

            def config(self, state):
                self.enabled = state == 1  # tk.NORMAL

            def delete(self, start, end):
                self.content = ""

            def insert(self, pos, text):
                self.content = text

        class MockEditor:
            def __init__(self):
                self.placed_panels = [
                    {"tab": "ACTIONS", "action_key": "action1", "x": 100, "y": 200}
                ]
                self.code_output_text = MockText()

        editor = MockEditor()
        try:
            update_code_output(editor)
            # Check that output contains expected data
            output = editor.code_output_text.content
            self.assertIn("ACTIONS", output)
            self.assertIn("100", output)
            self.assertIn("200", output)
        except Exception as e:
            self.fail(f"update_code_output raised {type(e).__name__} unexpectedly: {e}")

    def test_with_multiple_placed_panels(self):
        """Test code output with multiple placed panels."""

        class MockText:
            def __init__(self):
                self.content = ""

            def config(self, state):
                pass

            def delete(self, start, end):
                self.content = ""

            def insert(self, pos, text):
                self.content = text

        class MockEditor:
            def __init__(self):
                self.placed_panels = [
                    {"tab": "ACTIONS", "action_key": "act1", "x": 50, "y": 100},
                    {"tab": "EVENTS", "action_key": "evt1", "x": 150, "y": 200},
                    {"tab": "CONDITIONS", "action_key": "cond1", "x": 250, "y": 300},
                ]
                self.code_output_text = MockText()

        editor = MockEditor()
        try:
            update_code_output(editor)
            output = editor.code_output_text.content
            # All tabs should be represented
            self.assertIn("ACTIONS", output)
            self.assertIn("EVENTS", output)
            self.assertIn("CONDITIONS", output)
        except Exception as e:
            self.fail(f"update_code_output raised {type(e).__name__} unexpectedly: {e}")

    def test_code_output_formatting(self):
        """Test that code output is properly formatted."""

        class MockText:
            def __init__(self):
                self.content = ""

            def config(self, state):
                pass

            def delete(self, start, end):
                self.content = ""

            def insert(self, pos, text):
                self.content = text

        class MockEditor:
            def __init__(self):
                self.placed_panels = [
                    {"tab": "ACTIONS", "action_key": "action1", "x": 100, "y": 200}
                ]
                self.code_output_text = MockText()

        editor = MockEditor()
        update_code_output(editor)
        output = editor.code_output_text.content

        # Output should contain line numbers and position info
        self.assertIn("@", output)  # Position indicator


class MockText:
    """Mock Text widget for testing."""

    def __init__(self):
        self.content = ""
        self._state = None

    def config(self, state):
        self._state = state

    def delete(self, start, end):
        self.content = ""

    def insert(self, pos, text):
        self.content = text

    def __getattr__(self, name):
        # Return None for any undefined attributes
        return None


if __name__ == "__main__":
    unittest.main()
