"""
Snap_Handler.py

Manages snap point creation with LEGO-style connectors.
Each block has colored connector squares that match receptors on container blocks.

Hierarchy:
- MOD: Blue receptor (CONDITIONS first), then dual-color yellow/brown receptors (ACTIONS/SUBROUTINES)
- RULES: Similar structure to MOD
- ACTIONS: Green receptors for EVENTS
- Dynamic growth: Receptors multiply as blocks are added
"""

class SnapHandler:
    """Handles all snap point creation with LEGO-style visual connectors."""
    
    # Snap point configuration
    SNAP_SIZE = 16  # 16x16 pixel squares (50% smaller)
    SNAP_BORDER_WIDTH = 0.5  # Thinner border
    SNAP_THRESHOLD = 30  # Distance for snapping to engage
    SNAP_PADDING = 10
    
    # Color mapping for connectors and receptors
    SNAP_COLORS = {
        "MOD": "#9C27B0",           # Purple - RULES connector/receptor
        "CONDITION": "#2196F3",     # Blue - CONDITIONS
        "ACTION": "#FFEB3B",        # Yellow - ACTIONS
        "SUBROUTINE": "#CD853F",    # Brown - SUBROUTINES
        "EVENT": "#4CAF50",         # Green - EVENTS
    }
    
    # Highlight colors (lighter versions for hover)
    HIGHLIGHT_COLORS = {
        "#9C27B0": "#CE93D8",  # Purple -> Light purple
        "#2196F3": "#90CAF9",  # Blue -> Light blue
        "#FFEB3B": "#FFF59D",  # Yellow -> Light yellow
        "#CD853F": "#DEB887",  # Brown -> Tan
        "#4CAF50": "#A5D6A7",  # Green -> Light green
    }
    
    def __init__(self, editor):
        """Initialize snap handler.
        
        Args:
            editor: Reference to BlockEditor instance
        """
        self.editor = editor
        self.highlighted_snaps = set()
        self.hover_snap_point = None
        
    def create_snap_points_for_block(self, block_id, block):
        """Create LEGO-style connectors and receptors for a block.
        
        Each block type gets:
        - A colored connector square on its left (or right for EVENTS)
        - Container blocks get receptor squares for children to snap into
        """
        x, y = block["x"], block["y"]
        w, h = block["width"], block["height"]
        block_type = block["type"]
        
        # Create connectors (blocks reaching OUT to snap TO containers)
        if block_type == "RULES":
            self._create_left_connector(block_id, block, x, y, self.SNAP_COLORS["MOD"])
        elif block_type == "CONDITIONS":
            self._create_left_connector(block_id, block, x, y, self.SNAP_COLORS["CONDITION"])
        elif block_type == "ACTIONS":
            self._create_left_connector(block_id, block, x, y, self.SNAP_COLORS["ACTION"])
        elif block_type == "SUBROUTINE":
            self._create_left_connector(block_id, block, x, y, self.SNAP_COLORS["SUBROUTINE"])
        elif block_type == "EVENTS":
            self._create_right_connector(block_id, block, x, y, w, self.SNAP_COLORS["EVENT"])
        
        # Create receptor squares for container blocks
        if block_type == "MOD":
            self._create_mod_receptors(block_id, block, x, y, w, h)
        elif block_type == "RULES":
            self._create_rules_receptors(block_id, block, x, y, w, h)
        elif block_type == "SUBROUTINE":
            self._create_subroutine_receptors(block_id, block, x, y, w, h)
        elif block_type == "ACTIONS":
            self._create_actions_receptors(block_id, block, x, y, w, h)
    
    def _create_left_connector(self, block_id, block, x, y, color):
        """Create colored connector square at top-left of block."""
        snap_x = x - self.SNAP_SIZE  # Protrudes LEFT from block
        snap_y = y + 3  # Align with receptors
        
        connector = self.editor.canvas.create_rectangle(
            snap_x, snap_y,
            snap_x + self.SNAP_SIZE, snap_y + self.SNAP_SIZE,
            fill=color,
            outline="#FFFFFF",
            width=self.SNAP_BORDER_WIDTH,
            tags=(block_id, "connector_left", "snap_point", "always_top")
        )
        
        block["widgets"].append(connector)
        block["connector_left"] = {
            "x": snap_x + self.SNAP_SIZE // 2,
            "y": snap_y + self.SNAP_SIZE // 2,
            "type": "CONNECTOR",
            "widget": connector,
            "color": color
        }
        self._bind_hover_events(connector, color)
        # Ensure snap points are always on top
        self.editor.canvas.tag_raise("always_top")
    
    def _create_right_connector(self, block_id, block, x, y, w, color):
        """Create colored connector square at top-right of block (for EVENTS)."""
        snap_x = x + w  # Protrudes RIGHT from block
        snap_y = y + 3  # Align with receptors
        
        connector = self.editor.canvas.create_rectangle(
            snap_x, snap_y,
            snap_x + self.SNAP_SIZE, snap_y + self.SNAP_SIZE,
            fill=color,
            outline="#FFFFFF",
            width=self.SNAP_BORDER_WIDTH,
            tags=(block_id, "connector_right", "snap_point", "always_top")
        )
        
        block["widgets"].append(connector)
        block["connector_right"] = {
            "x": snap_x + self.SNAP_SIZE // 2,
            "y": snap_y + self.SNAP_SIZE // 2,
            "type": "CONNECTOR",
            "widget": connector,
            "color": color
        }
        self._bind_hover_events(connector, color)
        # Ensure snap points are always on top
        self.editor.canvas.tag_raise("always_top")
    
    def _create_mod_receptors(self, block_id, block, x, y, w, h):
        """Create receptors on MOD for CONDITIONS (blue), then ACTIONS/SUBROUTINES (dual yellow/brown)."""
        if "receptors" not in block:
            block["receptors"] = []
        
        receptor_x = x + 5
        start_y = y + 40
        
        # 1. BLUE receptor for CONDITIONS (first in code structure)
        blue_y = start_y
        self._create_single_color_receptor(
            block_id, block, receptor_x, blue_y,
            self.SNAP_COLORS["CONDITION"],
            "CONDITION_RECEPTOR",
            ["CONDITIONS"],
            "receptor_condition"
        )
        
        # 2. DUAL-COLOR receptor for ACTIONS/SUBROUTINES
        dual_y = blue_y + self.SNAP_SIZE + 8
        self._create_dual_color_receptor(
            block_id, block, receptor_x, dual_y,
            "ACTIONS/SUBROUTINES"
        )
    
    def _create_rules_receptors(self, block_id, block, x, y, w, h):
        """Create receptors on RULES (similar structure to MOD)."""
        if "receptors" not in block:
            block["receptors"] = []
        
        receptor_x = x + 5
        start_y = y + 10
        
        # Blue receptor for CONDITIONS
        blue_y = start_y
        self._create_single_color_receptor(
            block_id, block, receptor_x, blue_y,
            self.SNAP_COLORS["CONDITION"],
            "CONDITION_RECEPTOR",
            ["CONDITIONS"],
            "receptor_condition"
        )
        
        # Dual-color receptor for ACTIONS/SUBROUTINES
        dual_y = blue_y + self.SNAP_SIZE + 8
        self._create_dual_color_receptor(
            block_id, block, receptor_x, dual_y,
            "ACTIONS/SUBROUTINES"
        )
    
    def _create_subroutine_receptors(self, block_id, block, x, y, w, h):
        """Create dual-color receptors inside SUBROUTINE for ACTIONS/SUBROUTINES (nested)."""
        if "receptors" not in block:
            block["receptors"] = []
        
        receptor_x = x + 5
        start_y = y + 50  # Below top bar of C-shape
        
        # Create dual-color receptor for ACTIONS/SUBROUTINES
        self._create_dual_color_receptor(
            block_id, block, receptor_x, start_y,
            "ACTIONS/SUBROUTINES"
        )
    
    def _create_actions_receptors(self, block_id, block, x, y, w, h):
        """Create green receptor inside ACTIONS for EVENTS."""
        if "receptors" not in block:
            block["receptors"] = []
        
        receptor_x = x + 40
        receptor_y = y + (h - self.SNAP_SIZE) // 2
        
        self._create_single_color_receptor(
            block_id, block, receptor_x, receptor_y,
            self.SNAP_COLORS["EVENT"],
            "EVENT_RECEPTOR",
            ["EVENTS"],
            "receptor_event"
        )
    
    def _create_single_color_receptor(self, block_id, block, x, y, color, receptor_type, accepts_list, tag):
        """Helper to create a single-color receptor."""
        receptor = self.editor.canvas.create_rectangle(
            x, y,
            x + self.SNAP_SIZE, y + self.SNAP_SIZE,
            fill=color,
            outline="#FFFFFF",
            width=self.SNAP_BORDER_WIDTH,
            tags=(block_id, tag, "snap_point", "always_top")
        )
    
        block["widgets"].append(receptor)
        for accept_type in accepts_list:
            block["receptors"].append({
                "x": x + self.SNAP_SIZE // 2,
                "y": y + self.SNAP_SIZE // 2,
                "type": receptor_type,
                "widget": receptor,
                "accepts": accept_type,
                "color": color
            })
    
        self._bind_hover_events(receptor, color)
        self.editor.canvas.tag_raise("always_top")

    def _create_dual_color_receptor(self, block_id, block, x, y, label):
        """Create dual-color receptor (yellow left, brown right) for ACTIONS/SUBROUTINES."""
        half_size = self.SNAP_SIZE // 2
    
        # Left half - YELLOW (ACTIONS)
        left_rect = self.editor.canvas.create_rectangle(
            x, y,
            x + half_size, y + self.SNAP_SIZE,
            fill=self.SNAP_COLORS["ACTION"],
            outline="#FFFFFF",
            width=self.SNAP_BORDER_WIDTH,
            tags=(block_id, "receptor_action_sub", "snap_point", "always_top")
        )
    
        # Right half - BROWN (SUBROUTINES)
        right_rect = self.editor.canvas.create_rectangle(
            x + half_size, y,
            x + self.SNAP_SIZE, y + self.SNAP_SIZE,
            fill=self.SNAP_COLORS["SUBROUTINE"],
            outline="#FFFFFF",
            width=self.SNAP_BORDER_WIDTH,
            tags=(block_id, "receptor_action_sub", "snap_point", "always_top")
        )
    
        block["widgets"].extend([left_rect, right_rect])
    
        # This receptor accepts both ACTIONS and SUBROUTINES
        center_x = x + self.SNAP_SIZE // 2
        center_y = y + self.SNAP_SIZE // 2
    
        for accept_type, color in [("ACTIONS", self.SNAP_COLORS["ACTION"]), 
                                     ("SUBROUTINE", self.SNAP_COLORS["SUBROUTINE"])]:
            block["receptors"].append({
                "x": center_x,
                "y": center_y,
                "type": "ACTION_SUBROUTINE_RECEPTOR",
                "widget": left_rect,
                "accepts": accept_type,
                "color": color,
                "dual_color": True
            })
    
        self._bind_hover_events(left_rect, self.SNAP_COLORS["ACTION"])
        self._bind_hover_events(right_rect, self.SNAP_COLORS["SUBROUTINE"])
        self.editor.canvas.tag_raise("always_top")

    def add_dynamic_receptor(self, parent_id, receptor_type):
        """Dynamically add a new receptor when a block is snapped."""
        parent = self.editor.all_blocks.get(parent_id)
        if not parent or "receptors" not in parent:
            return
    
        existing = [r for r in parent["receptors"] if receptor_type in r["type"]]
        if not existing:
            return
    
        last_receptor = existing[-1]
        last_y = last_receptor["y"]
        new_y = last_y + self.SNAP_SIZE + 8
        receptor_x = last_receptor["x"] - self.SNAP_SIZE // 2
    
        # Create the requested receptor below the last one
        if receptor_type == "ACTION_SUBROUTINE_RECEPTOR":
            self._create_dual_color_receptor(parent_id, parent, receptor_x, new_y, "ACTIONS/SUBROUTINES")
        elif receptor_type == "CONDITION_RECEPTOR":
            self._create_single_color_receptor(
                parent_id, parent, receptor_x, new_y,
                self.SNAP_COLORS["CONDITION"],
                "CONDITION_RECEPTOR",
                ["CONDITIONS"],
                "receptor_condition"
            )

        # Auto-resize RULES vertically to accommodate new receptor(s)
        try:
            if parent.get('type') == 'RULES':
                needed_bottom = new_y + self.SNAP_SIZE + 20
                current_bottom = parent.get('y', 0) + parent.get('height', 0)
                if needed_bottom > current_bottom:
                    parent['height'] = needed_bottom - parent.get('y', 0)
                    self.editor.update_block_position(parent_id)
        except Exception:
            pass

    def check_snap_distance(self, dragged_id, target_id):
        """Check if dragged block is within snap range of target."""
        dragged = self.editor.all_blocks.get(dragged_id)
        target = self.editor.all_blocks.get(target_id)
    
        if not dragged or not target:
            return False, float('inf')
    
        connector = dragged.get("connector_left") or dragged.get("connector_right")
        if not connector:
            return False, float('inf')
    
        receptors = target.get("receptors", [])
        min_distance = float('inf')
    
        for receptor in receptors:
            dx = connector["x"] - receptor["x"]
            dy = connector["y"] - receptor["y"]
            distance = (dx*dx + dy*dy) ** 0.5
            min_distance = min(min_distance, distance)
    
        return min_distance < self.SNAP_THRESHOLD, min_distance

    def clear_all_highlights(self):
        """Clear all snap range highlights."""
        for block_id in list(self.highlighted_snaps):
            self.highlight_block_in_snap_range(block_id, in_range=False)
        self.highlighted_snaps.clear()
    
    
    def _bind_hover_events(self, snap_widget, base_color):
        """Bind mouse enter/leave events for hover highlighting."""
        self.editor.canvas.tag_bind(
            snap_widget,
            "<Enter>",
            lambda e, w=snap_widget, c=base_color: self._on_snap_hover(w, c)
        )
        self.editor.canvas.tag_bind(
            snap_widget,
            "<Leave>",
            lambda e, w=snap_widget, c=base_color: self._on_snap_leave(w, c)
        )
    
    def _on_snap_hover(self, snap_widget, base_color):
        """Handle mouse entering a snap point - highlight it."""
        highlight_color = self.HIGHLIGHT_COLORS.get(base_color, base_color)
        self.editor.canvas.itemconfig(snap_widget, fill=highlight_color)
        self.hover_snap_point = snap_widget
    
    def _on_snap_leave(self, snap_widget, base_color):
        """Handle mouse leaving a snap point - restore original color."""
        self.editor.canvas.itemconfig(snap_widget, fill=base_color)
        if self.hover_snap_point == snap_widget:
            self.hover_snap_point = None
    
    def highlight_block_in_snap_range(self, block_id, in_range=True):
        """Highlight a block to show it's in snap range."""
        if block_id not in self.editor.all_blocks:
            return
        
        block = self.editor.all_blocks[block_id]
        canvas_obj = block.get("canvas_obj")
        
        if not canvas_obj:
            return
        
        if in_range:
            self.editor.canvas.itemconfig(canvas_obj, width=3, outline="#FFFFFF")
            self.highlighted_snaps.add(block_id)
        else:
            self.editor.canvas.itemconfig(canvas_obj, width=2, outline="#1e1e1e")
            self.highlighted_snaps.discard(block_id)
