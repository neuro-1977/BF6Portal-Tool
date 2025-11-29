"""
Block shape definitions for different block types.

Handles rendering of Container blocks (MOD, RULES, SUBROUTINES) and regular blocks.
"""


class BlockShapes:
    """Provides coordinate calculations for different block shapes."""

    @staticmethod
    def get_container_shape_coords(x, y, width, height, inner_height, notch_offset=22, notch_height=14, notch_depth=26):
        """Generate coordinates for SUBROUTINE/MOD-style container blocks.

        Simple clean Container shape - outer frame then inner cavity cutout.

        Args:
            x, y: Top-left position
            width: Total width of the outer shape
            height: Thickness of the top/bottom bars (overridden)
            inner_height: Vertical inner opening height between bars

        Returns:
            List of (x, y) coordinates forming the polygon path.
        """
        import math

        # Portal-accurate dimensions
        bar_thickness = 22
        left_bar_width = 22
        radius = 4
        segments = 16

        # Calculate bounds
        outer_top = y
        outer_bottom = y + bar_thickness + inner_height + bar_thickness
        outer_left = x
        outer_right = x + width
        
        inner_top = y + bar_thickness
        inner_bottom = y + bar_thickness + inner_height
        inner_left = x + left_bar_width
        inner_right = outer_right  # Opening goes all the way to right edge

        coords = []

        # OUTER PERIMETER - Clockwise from top-left
        # Top-left corner
        coords.extend([outer_left, outer_top + radius])
        for i in range(segments + 1):
            angle = 180 + (i * 90 / segments)
            px = outer_left + radius + radius * math.cos(math.radians(angle))
            py = outer_top + radius + radius * math.sin(math.radians(angle))
            coords.extend([px, py])

        # Top edge
        coords.extend([outer_right - radius, outer_top])
        
        # Top-right corner
        for i in range(segments + 1):
            angle = 270 + (i * 90 / segments)
            px = outer_right - radius + radius * math.cos(math.radians(angle))
            py = outer_top + radius + radius * math.sin(math.radians(angle))
            coords.extend([px, py])

        # Right edge
        coords.extend([outer_right, outer_bottom - radius])
        
        # Bottom-right corner
        for i in range(segments + 1):
            angle = 0 + (i * 90 / segments)
            px = outer_right - radius + radius * math.cos(math.radians(angle))
            py = outer_bottom - radius + radius * math.sin(math.radians(angle))
            coords.extend([px, py])

        # Bottom edge
        coords.extend([outer_left + radius, outer_bottom])
        
        # Bottom-left corner
        for i in range(segments + 1):
            angle = 90 + (i * 90 / segments)
            px = outer_left + radius + radius * math.cos(math.radians(angle))
            py = outer_bottom - radius + radius * math.sin(math.radians(angle))
            coords.extend([px, py])

        # INNER CAVITY - Counter-clockwise from bottom-left
        # Start at inner left spine, bottom
        coords.extend([inner_left, inner_bottom])
        
        # Up left spine
        coords.extend([inner_left, inner_top])
        
        # Across top inner edge to right opening
        coords.extend([inner_right, inner_top])
        
        # Down right opening edge
        coords.extend([inner_right, inner_bottom])
        
        # Back across bottom inner edge to left spine
        coords.extend([inner_left, inner_bottom])

        return coords

    @staticmethod
    def get_rules_shape_coords(x, y, width, height, inner_height):
        """Generate coordinates for RULES container blocks.
        
        TODO: Define unique RULES block shape different from SUBROUTINE.
        For now, reuse container shape as placeholder.
        """
        return BlockShapes.get_container_shape_coords(x, y, width, height, inner_height)

        # Right side of top bar
        coords.extend([x + width, y + bar_thickness])
        
        # Inner top-right corner (slight rounding)
        coords.extend([x + left_bar_width, y + bar_thickness])
        
        # Down the inner left side
        coords.extend([x + left_bar_width, y + bar_thickness + inner_height])
        
        # Inner bottom-right corner
        coords.extend([x + width, y + bar_thickness + inner_height])
        
        # Right side of bottom bar
        coords.extend([x + width, y + bar_thickness + inner_height + bar_thickness - radius])
        
        # Bottom-right outer corner (rounded)
        for i in range(segments + 1):
            angle = 0 + (i * 90 / segments)
            px = x + width - radius + radius * math.cos(math.radians(angle))
            py = y + bar_thickness + inner_height + bar_thickness - radius + radius * math.sin(math.radians(angle))
            coords.extend([px, py])
        
        # Bottom edge
        coords.extend([x + radius, y + bar_thickness + inner_height + bar_thickness])
        
        # Bottom-left outer corner (rounded)
        for i in range(segments + 1):
            angle = 90 + (i * 90 / segments)
            px = x + radius + radius * math.cos(math.radians(angle))
            py = y + bar_thickness + inner_height + bar_thickness - radius + radius * math.sin(math.radians(angle))
            coords.extend([px, py])
        
        # Left edge back to start
        coords.extend([x, y + radius])
        
        return coords

    @staticmethod
    def get_action_block_coords(x, y, width, height):
        """Generate Portal-style action block shape.
        
        Creates a pill shape with three components stacked vertically:
        - Top: horizontal pill (connection notch)
        - Middle: vertical pill (main body)
        - Bottom: horizontal pill (connection notch)
        
        Args:
            x, y: Top-left position
            width, height: Block dimensions
            
        Returns:
            List of (x, y) coordinates forming the Portal action block shape
        """
        import math
        
        coords = []
        segments = 6  # Segments per quarter circle
        
        # Dimensions
        notch_width = 20   # Width of connection notches
        notch_height = 8   # Height of top/bottom pills
        body_height = height - (2 * notch_height)  # Main body height
        
        # Radii
        notch_radius = notch_height / 2  # Half-height for perfect pill
        body_radius = notch_radius  # Same radius for consistency
        
        # Calculate positions
        center_x = x + width / 2
        
        # Top notch (horizontal pill) - centered
        notch_left = center_x - notch_width / 2
        notch_right = center_x + notch_width / 2
        top_y = y
        
        # Start at top-left of top notch
        coords.extend([notch_left, top_y + notch_radius])
        
        # Top notch left semicircle
        for i in range(segments + 1):
            angle = 180 + (i * 180 / segments)  # 180 to 360 degrees
            px = notch_left + notch_radius + notch_radius * math.cos(math.radians(angle))
            py = top_y + notch_radius + notch_radius * math.sin(math.radians(angle))
            coords.extend([px, py])
        
        # Top notch top edge
        coords.extend([notch_right - notch_radius, top_y])
        
        # Top notch right semicircle
        for i in range(segments + 1):
            angle = 0 + (i * 180 / segments)  # 0 to 180 degrees
            px = notch_right - notch_radius + notch_radius * math.cos(math.radians(angle))
            py = top_y + notch_radius + notch_radius * math.sin(math.radians(angle))
            coords.extend([px, py])
        
        # Connect to main body top-right
        body_top = y + notch_height
        coords.extend([x + width, body_top + body_radius])
        
        # Main body right semicircle (vertical pill)
        for i in range(segments + 1):
            angle = -90 + (i * 180 / segments)  # -90 to 90 degrees
            px = x + width - body_radius + body_radius * math.cos(math.radians(angle))
            py = body_top + body_radius + (body_height - 2 * body_radius) / 2 + (body_height - 2 * body_radius) / 2 * math.sin(math.radians(angle))
            coords.extend([px, py])
        
        # Connect to bottom notch
        body_bottom = y + notch_height + body_height
        coords.extend([notch_right, body_bottom - notch_radius])
        
        # Bottom notch right semicircle
        for i in range(segments + 1):
            angle = 0 - (i * 180 / segments)  # 0 to -180 degrees
            px = notch_right - notch_radius + notch_radius * math.cos(math.radians(angle))
            py = body_bottom - notch_radius + notch_radius * math.sin(math.radians(angle))
            coords.extend([px, py])
        
        # Bottom notch bottom edge
        coords.extend([notch_left + notch_radius, body_bottom])
        
        # Bottom notch left semicircle
        for i in range(segments + 1):
            angle = 180 - (i * 180 / segments)  # 180 to 0 degrees
            px = notch_left + notch_radius + notch_radius * math.cos(math.radians(angle))
            py = body_bottom - notch_radius + notch_radius * math.sin(math.radians(angle))
            coords.extend([px, py])
        
        # Connect back to main body left side
        coords.extend([x, body_top + body_radius])
        
        # Main body left semicircle (vertical pill)
        for i in range(segments + 1):
            angle = 90 - (i * 180 / segments)  # 90 to -90 degrees
            px = x + body_radius + body_radius * math.cos(math.radians(angle))
            py = body_top + body_radius + (body_height - 2 * body_radius) / 2 + (body_height - 2 * body_radius) / 2 * math.sin(math.radians(angle))
            coords.extend([px, py])
        
        return coords

    @staticmethod
    def get_sequence_block_coords(x, y, width, height, notch_offset=15, notch_height=10, notch_depth=10):
        """Generate coordinates for a standard sequence block (rounded rectangle).
        
        Args:
            x, y: Top-left position
            width, height: Block dimensions
            notch_offset: Ignored (kept for compatibility)
            notch_height: Ignored (kept for compatibility)
            notch_depth: Ignored (kept for compatibility)
            
        Returns:
            List of (x, y) coordinates forming rounded rectangle
        """
        # Use rounded rectangle for Portal style
        return BlockShapes.get_rounded_rect_coords(x, y, width, height, radius=8)

    @staticmethod
    def get_simple_block_coords(x, y, width, height):
        """Generate coordinates for a rounded rectangular block.
        
        Used for CONDITION blocks and other non-sequence blocks.
        
        Returns:
            List of (x, y) coordinates forming rounded rectangle
        """
        return BlockShapes.get_rounded_rect_coords(x, y, width, height, radius=8)
    
    @staticmethod
    def get_rounded_rect_coords(x, y, width, height, radius=8):
        """Generate coordinates for a rounded rectangle (for CONDITIONS/EVENTS blocks).
        
        Args:
            x, y: Top-left position
            width, height: Block dimensions
            radius: Corner radius
            
        Returns:
            List of (x, y) coordinates approximating rounded corners
        """
        import math
        coords = []
        segments = 8  # More segments for smoother corners
        
        # Top-left corner starting point
        coords.extend([x + radius, y])
        # Top edge
        coords.extend([x + width - radius, y])
        # Top-right corner arc
        for i in range(segments + 1):
            angle = -90 + (i * 90 / segments)
            px = x + width - radius + radius * math.cos(math.radians(angle))
            py = y + radius + radius * math.sin(math.radians(angle))
            coords.extend([px, py])
        # Right edge
        coords.extend([x + width, y + height - radius])
        # Bottom-right corner arc
        for i in range(segments + 1):
            angle = 0 + (i * 90 / segments)
            px = x + width - radius + radius * math.cos(math.radians(angle))
            py = y + height - radius + radius * math.sin(math.radians(angle))
            coords.extend([px, py])
        # Bottom edge
        coords.extend([x + radius, y + height])
        # Bottom-left corner arc
        for i in range(segments + 1):
            angle = 90 + (i * 90 / segments)
            px = x + radius + radius * math.cos(math.radians(angle))
            py = y + height - radius + radius * math.sin(math.radians(angle))
            coords.extend([px, py])
        # Left edge
        coords.extend([x, y + radius])
        # Top-left corner arc (closing)
        for i in range(segments + 1):
            angle = 180 + (i * 90 / segments)
            px = x + radius + radius * math.cos(math.radians(angle))
            py = y + radius + radius * math.sin(math.radians(angle))
            coords.extend([px, py])
        
        return coords
    
    @staticmethod
    def get_c_shape_with_condition_notch(x, y, width, height, inner_height, condition_width=0, notch_offset=15, notch_height=10, notch_depth=10):
        """Generate C-shaped RULES block with notch for condition in top bar.
        
        Args:
            x, y: Top-left position
            width: Total width
            height: Height of top/bottom bars (45px)
            inner_height: Height of vertical section
            condition_width: Width of condition (creates notch)
            
        Returns:
            List of coordinates forming C-shape with condition notch
        """
        bar_thickness = height
        left_bar_width = 40
        text_area_width = 60  # Space for \"RULES\" text
        
        coords = [x, y]  # Start top-left
        
        if condition_width > 0:
            # Top edge to condition notch
            coords.extend([
                x + text_area_width, y,
                x + text_area_width, y + bar_thickness - 8,  # Notch down
                x + text_area_width + condition_width, y + bar_thickness - 8,  # Across
                x + text_area_width + condition_width, y,  # Back up
            ])
        
        # Continue to connection notch
        coords.extend([
            x + width - notch_offset - notch_height, y,
            x + width - notch_offset - notch_height, y + notch_depth,
            x + width - notch_offset, y + notch_depth,
            x + width - notch_offset, y,
            x + width, y,
            x + width, y + bar_thickness,
            x + left_bar_width, y + bar_thickness,
            x + left_bar_width, y + bar_thickness + inner_height,
            x + width, y + bar_thickness + inner_height,
            x + width, y + bar_thickness + inner_height + bar_thickness,
            x + notch_offset + notch_height, y + bar_thickness + inner_height + bar_thickness,
            x + notch_offset + notch_height, y + bar_thickness + inner_height + bar_thickness - notch_depth,
            x + notch_offset, y + bar_thickness + inner_height + bar_thickness - notch_depth,
            x + notch_offset, y + bar_thickness + inner_height + bar_thickness,
            x, y + bar_thickness + inner_height + bar_thickness,
            x, y,
        ])
        
        return coords
    
    @staticmethod
    def get_rules_w_shape(x, y, width, height, inner_height, condition_height=40, action_height=40, notch_offset=15, notch_height=10, notch_depth=10):
        """Generate W-shaped RULES block with three cutouts (CONDITIONS top-left, ACTIONS bottom-left, main area right).
        
        Creates a sideways W shape with:
        - Top bar with RULES text
        - Cutout under RULES text for CONDITIONS block
        - Middle vertical bar separator
        - Cutout at bottom for ACTIONS block
        - Main cutout on the right for content
        - Bottom bar
        
        Args:
            x, y: Top-left position
            width: Total width
            height: Top/bottom bar height (45px)
            inner_height: Height of main action area
            condition_height: Height of condition cutout area
            action_height: Height of action cutout area at bottom
            
        Returns:
            List of coordinates forming W-shape with three cutouts
        """
        bar_thickness = height  # 45px
        left_bar_width = 40
        condition_area_width = 110  # Width for CONDITIONS cutout
        
        coords = [
            # Start top-left corner
            x, y,
            # Across top bar
            x + width, y,
            # Down right edge to end of top bar
            x + width, y + bar_thickness,
            # Indent for main content cutout
            x + left_bar_width + condition_area_width, y + bar_thickness,
            # Down the main content area
            x + left_bar_width + condition_area_width, y + bar_thickness + inner_height,
            # Back out to right edge
            x + width, y + bar_thickness + inner_height,
            # Down to bottom
            x + width, y + bar_thickness + inner_height + bar_thickness,
            # Across bottom bar to left
            x, y + bar_thickness + inner_height + bar_thickness,
            # Up left edge (solid bar, no gaps)
            x, y,
        ]
        
        return coords

    @staticmethod
    def calculate_c_shape_dimensions(block, editor):
        """Calculate the dimensions of a Container block based on its nested contents.
        
        Args:
            block: The block dictionary
            editor: The BlockEditor instance
            
        Returns:
            tuple: (width, height, inner_height) - total dimensions and inner space height
        """
        base_width = 320
        bar_height = 45
        min_inner_height = 100
        
        # Calculate required inner height based on nested blocks
        inner_height = min_inner_height
        
        # Find all blocks nested inside this Container block
        nested_blocks = BlockShapes._get_nested_blocks(block, editor)
        
        if nested_blocks:
            # Calculate the total height needed for all nested blocks
            max_y = 0
            min_y = float('inf')
            
            for nested_bid in nested_blocks:
                if nested_bid in editor.all_blocks:
                    nb = editor.all_blocks[nested_bid]
                    nb_bottom = nb['y'] + nb['height']
                    nb_top = nb['y']
                    max_y = max(max_y, nb_bottom)
                    min_y = min(min_y, nb_top)
            
            if max_y > min_y:
                # Add padding
                inner_height = max(min_inner_height, (max_y - min_y) + 40)
        
        total_height = bar_height * 2 + inner_height
        
        return base_width, total_height, inner_height

    @staticmethod
    def _get_nested_blocks(parent_block, editor):
        """Get all block IDs that are nested inside a parent block.
        
        Returns:
            list: Block IDs nested in this parent
        """
        nested = []
        parent_id = parent_block['id']
        
        # Look for blocks that claim this as their parent
        for bid, block in editor.all_blocks.items():
            if block.get('nested_in') == parent_id:
                nested.append(bid)
        
        return nested
    
    @staticmethod
    def get_puzzle_tab_coords(x, y, width, facing='down', tab_x_offset=15, tab_width=15, tab_height=5):
        """
        Helper to generate coordinates for a side with a puzzle tab.
        facing: 'down' (outdent), 'up' (indent), 'left' (outdent), 'right' (indent)
        Note: This returns the points for that SIDE.
        """
        coords = []
        
        if facing == 'down':
            # Line from left to tab start
            coords.extend([x, y])
            coords.extend([x + tab_x_offset, y])
            # Tab shape (trapezoid for now)
            coords.extend([x + tab_x_offset + 2, y + tab_height])
            coords.extend([x + tab_x_offset + tab_width - 2, y + tab_height])
            coords.extend([x + tab_x_offset + tab_width, y])
            # Line to right
            coords.extend([x + width, y])
            
        elif facing == 'up':
            # Line from right to tab start (drawing counter-clockwise? No, usually clockwise)
            # Let's assume we are drawing the top edge from left to right
            # Indent means we go DOWN into the block
            coords.extend([x, y])
            coords.extend([x + tab_x_offset, y])
            coords.extend([x + tab_x_offset + 2, y + tab_height])
            coords.extend([x + tab_x_offset + tab_width - 2, y + tab_height])
            coords.extend([x + tab_x_offset + tab_width, y])
            coords.extend([x + width, y])
            
        return coords

    @staticmethod
    def get_blockly_statement_shape(x, y, width, height, top_notch=True, bottom_notch=True):
        """
        Generates a block shape with a notch on top and a tab on bottom.
        Includes rounded corners.
        """
        coords = []
        notch_width = 15
        notch_height = 5
        notch_x = x + 15 # Offset from left
        radius = 4 # Corner radius

        # Top Edge (Left to Right)
        coords.extend([x, y + radius]) # Start after top-left corner
        
        # Top-Left Corner
        coords.extend([x + radius, y])
        
        if top_notch:
            # Line to notch
            coords.extend([notch_x, y])
            # Notch (Indent)
            coords.extend([notch_x + 3, y + notch_height])
            coords.extend([notch_x + notch_width - 3, y + notch_height])
            coords.extend([notch_x + notch_width, y])
            
        # Line to Top-Right
        coords.extend([x + width - radius, y])
        
        # Top-Right Corner
        coords.extend([x + width, y + radius])
        
        # Right Edge (Top to Bottom)
        coords.extend([x + width, y + height - radius])

        # Bottom-Right Corner
        coords.extend([x + width - radius, y + height])

        # Bottom Edge (Right to Left)
        if bottom_notch:
            # Line to notch
            coords.extend([notch_x + notch_width, y + height])
            # Tab (Outdent)
            coords.extend([notch_x + notch_width - 3, y + height + notch_height])
            coords.extend([notch_x + 3, y + height + notch_height])
            coords.extend([notch_x, y + height])
            
        # Line to Bottom-Left
        coords.extend([x + radius, y + height])
        
        # Bottom-Left Corner
        coords.extend([x, y + height - radius])

        # Left Edge (Bottom to Top)
        coords.extend([x, y + radius])
        
        return coords

    @staticmethod
    def get_blockly_container_shape(x, y, width, height, inner_height, top_notch=True, bottom_notch=True):
        """
        Generates a Container block with notches and rounded corners.
        """
        coords = []
        notch_width = 15
        notch_height = 5
        notch_x = x + 15
        radius = 4
        
        bar_height = 40 # Thickness of top/bottom bars
        left_spine = 20 # Thickness of left spine
        
        # A. Top Left Corner
        coords.extend([x, y + radius])
        coords.extend([x + radius, y])
        
        # B. Top Edge (with notch)
        if top_notch:
            coords.extend([notch_x, y])
            coords.extend([notch_x + 3, y + notch_height])
            coords.extend([notch_x + notch_width - 3, y + notch_height])
            coords.extend([notch_x + notch_width, y])
        coords.extend([x + width - radius, y])
        
        # C. Top Right Corner
        coords.extend([x + width, y + radius])
        coords.extend([x + width, y + bar_height - radius])
        coords.extend([x + width - radius, y + bar_height])
        
        # D. Top Bar Bottom Edge (Inner Top) - Has TAB (outdent)
        inner_tab_x = x + left_spine + 15
        coords.extend([inner_tab_x + notch_width, y + bar_height])
        coords.extend([inner_tab_x + notch_width - 3, y + bar_height + notch_height])
        coords.extend([inner_tab_x + 3, y + bar_height + notch_height])
        coords.extend([inner_tab_x, y + bar_height])
        coords.extend([x + left_spine + radius, y + bar_height])
        
        # Inner Corner (Top-Left of cavity)
        coords.extend([x + left_spine, y + bar_height + radius])
        
        # E. Inner Spine (Down)
        coords.extend([x + left_spine, y + bar_height + inner_height - radius])
        
        # Inner Corner (Bottom-Left of cavity)
        coords.extend([x + left_spine + radius, y + bar_height + inner_height])
        
        # F. Bottom Bar Top Edge (Inner Bottom) - Has NOTCH (indent)
        coords.extend([inner_tab_x, y + bar_height + inner_height])
        coords.extend([inner_tab_x + 3, y + bar_height + inner_height + notch_height])
        coords.extend([inner_tab_x + notch_width - 3, y + bar_height + inner_height + notch_height])
        coords.extend([inner_tab_x + notch_width, y + bar_height + inner_height])
        coords.extend([x + width - radius, y + bar_height + inner_height])
        
        # G. Bottom Bar Right Edge
        coords.extend([x + width, y + bar_height + inner_height + radius])
        coords.extend([x + width, y + bar_height + inner_height + bar_height - radius])
        coords.extend([x + width - radius, y + bar_height + inner_height + bar_height])
        
        # H. Bottom Edge (with tab)
        if bottom_notch:
            coords.extend([notch_x + notch_width, y + bar_height + inner_height + bar_height])
            coords.extend([notch_x + notch_width - 3, y + bar_height + inner_height + bar_height + notch_height])
            coords.extend([notch_x + 3, y + bar_height + inner_height + bar_height + notch_height])
            coords.extend([notch_x, y + bar_height + inner_height + bar_height])
        coords.extend([x + radius, y + bar_height + inner_height + bar_height])
        
        # I. Bottom Left Corner
        coords.extend([x, y + bar_height + inner_height + bar_height - radius])
        
        # J. Left Edge (Up)
        coords.extend([x, y + radius])
        
        return coords

    @staticmethod
    def get_blockly_value_shape(x, y, width, height):
        """
        Generates a value block shape with a puzzle tab on the left.
        """
        coords = []
        radius = 4
        tab_width = 15
        tab_height = 5
        tab_y = y + 10 # Top aligned tab
        
        # Top Left
        coords.extend([x, y + radius])
        coords.extend([x + radius, y])
        
        # Top Edge
        coords.extend([x + width - radius, y])
        
        # Top Right
        coords.extend([x + width, y + radius])
        
        # Right Edge
        coords.extend([x + width, y + height - radius])
        
        # Bottom Right
        coords.extend([x + width - radius, y + height])
        
        # Bottom Edge
        coords.extend([x + radius, y + height])
        
        # Bottom Left
        coords.extend([x, y + height - radius])
        
        # Left Edge (with Tab)
        # We need an OUTDENT tab on the left.
        # Go up to tab bottom
        coords.extend([x, tab_y + tab_width])
        # Tab shape (trapezoid pointing left)
        coords.extend([x - tab_height, tab_y + tab_width - 3])
        coords.extend([x - tab_height, tab_y + 3])
        coords.extend([x, tab_y])
        
        # Finish Left Edge
        coords.extend([x, y + radius])
        
        return coords

    @staticmethod
    def get_horizontal_snap_shape(x, y, width, height, left_tab=True, right_tab=True):
        """
        Generates a block shape for horizontal snapping (Actions/Conditions).
        Has a puzzle tab on the left (outdent) and a socket on the right (indent).
        """
        coords = []
        radius = 4
        tab_width = 6
        tab_height = 14
        tab_y_offset = (height - tab_height) / 2
        
        # Top Left
        coords.extend([x, y + radius])
        coords.extend([x + radius, y])
        
        # Top Edge
        coords.extend([x + width - radius, y])
        
        # Top Right
        coords.extend([x + width, y + radius])
        
        # Right Edge (with Socket/Indent)
        if right_tab:
            coords.extend([x + width, y + tab_y_offset])
            coords.extend([x + width - tab_width, y + tab_y_offset + 2])
            coords.extend([x + width - tab_width, y + tab_y_offset + tab_height - 2])
            coords.extend([x + width, y + tab_y_offset + tab_height])
            
        coords.extend([x + width, y + height - radius])
        
        # Bottom Right
        coords.extend([x + width - radius, y + height])
        
        # Bottom Edge
        coords.extend([x + radius, y + height])
        
        # Bottom Left
        coords.extend([x, y + height - radius])
        
        # Left Edge (with Tab/Outdent)
        if left_tab:
            coords.extend([x, y + tab_y_offset + tab_height])
            coords.extend([x - tab_width, y + tab_y_offset + tab_height - 2])
            coords.extend([x - tab_width, y + tab_y_offset + 2])
            coords.extend([x, y + tab_y_offset])
            
        coords.extend([x, y + radius])
        
        return coords
