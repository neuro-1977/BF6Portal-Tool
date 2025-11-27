from typing import List, Dict, Any

class WorkspaceAnalyzer:
    def __init__(self, editor):
        self.editor = editor
        self.issues = []

    def analyze(self) -> List[Dict[str, Any]]:
        """
        Analyze the workspace and return a list of issues.
        Each issue is a dict: {"type": "error"|"warning", "message": "...", "block_id": "..."}
        """
        self.issues = []
        blocks = self.editor.all_blocks
        
        # 1. Check for Mod Blocks
        mod_blocks = [b for b in blocks.values() if b.get("type") == "MOD"]
        if not mod_blocks:
            self.issues.append({
                "type": "warning",
                "message": "No MOD block found. A valid script requires at least one MOD block.",
                "block_id": None
            })
        elif len(mod_blocks) > 1:
            self.issues.append({
                "type": "warning",
                "message": f"Multiple MOD blocks found ({len(mod_blocks)}). Typically only one MOD block is used per script.",
                "block_id": mod_blocks[1]["id"] # Point to the second one
            })

        for block_id, block in blocks.items():
            self.check_orphan(block)
            self.check_structure(block)
            # self.check_missing_inputs(block) # TODO: Implement input checking logic

        return self.issues

    def check_orphan(self, block):
        """Check if a block is disconnected from the main logic tree."""
        block_type = block.get("type")
        parent_id = block.get("parent_id")
        
        # MOD blocks, Comments, RULES, and SUBROUTINES are allowed to be roots
        if block_type in ["MOD", "COMMENT", "RULES", "SUBROUTINE"]:
            return
            
        # If no parent, it's an orphan
        if parent_id is None:
            self.issues.append({
                "type": "warning",
                "message": f"Disconnected '{block.get('label')}' block. It will not be executed.",
                "block_id": block["id"]
            })

    def check_structure(self, block):
        """Check if the block is in a valid location (hierarchy)."""
        block_type = block.get("type")
        parent_id = block.get("parent_id")
        
        if parent_id is None:
            return # Handled by check_orphan

        parent = self.editor.all_blocks.get(parent_id)
        if not parent:
            return

        parent_type = parent.get("type")

        # RULES must be in MOD or Root
        if block_type == "RULES":
            # Rules can be top-level now
            pass
        
        # CONDITIONS/ACTIONS/EVENTS should generally be inside RULES or other containers
        # This is a loose check, strict checking might be too annoying during editing
        
        # Example: EVENTS usually go in CONDITIONS or ACTIONS
        if block_type == "EVENTS":
            # Check if ancestor chain eventually hits a RULE
            if not self.has_ancestor_type(block, "RULES"):
                self.issues.append({
                    "type": "warning",
                    "message": "EVENTS block should be part of a RULE.",
                    "block_id": block["id"]
                })

    def has_ancestor_type(self, block, target_type):
        """Check if any ancestor is of the target type."""
        current = block
        while current.get("parent_id"):
            parent_id = current["parent_id"]
            parent = self.editor.all_blocks.get(parent_id)
            if not parent:
                break
            if parent.get("type") == target_type:
                return True
            current = parent
        return False
