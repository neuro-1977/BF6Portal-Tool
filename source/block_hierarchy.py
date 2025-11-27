"""
Block hierarchy and relationship management.

Handles the rules for how blocks can connect (MOD → RULES → ACTIONS, etc.)
and manages navigation between related blocks.
"""


class BlockHierarchy:
    """Manages block relationships and connection rules."""
    
    # Define which block types can connect to which
    CONNECTION_RULES = {
        'MOD': ['RULES'],  # MOD can only contain RULES
        'RULES': ['CONDITIONS', 'ACTIONS', 'SUBROUTINE', 'EVENTS'],  # RULES can contain conditions/actions/subroutines inside
        'SUBROUTINE': ['ACTIONS', 'CONDITIONS'],  # Subroutines can contain actions
        'ACTIONS': [],  # Regular action blocks don't contain others (but can chain)
        'CONDITIONS': ['ACTIONS'], # Conditions can be followed by actions
        'EVENTS': [],
        'IF': ['ACTIONS', 'LOGIC'],  # If blocks can contain actions inside
        'WHILE': ['ACTIONS', 'LOGIC'],  # While blocks can contain actions inside
        'FOR': ['ACTIONS', 'LOGIC'],  # For blocks can contain actions inside
    }
    
    # Define which blocks can attach to the top of other blocks
    TOP_ATTACHMENT_RULES = {
        'RULES': ['CONDITIONS'],  # CONDITIONS can attach to top of RULES
    }
    
    # Container blocks (blocks with inner cavity for nesting)
    CONTAINER_BLOCKS = ['MOD', 'C_OUTER', 'SUBROUTINE', 'RULES', 'IF', 'WHILE', 'FOR', 'C_WRAP', 'C_SHAPED']
    
    # Shape type mapping - allows each block type to have unique shape
    BLOCK_SHAPES = {
        'SUBROUTINE': 'subroutine_shape',  # Left-open container with scalloped notches
        'RULES': 'rules_shape',  # Will have its own unique shape
        'IF': 'if_shape',  # Logic block shape
        'WHILE': 'while_shape',  # Logic block shape
        'FOR': 'for_shape',  # Logic block shape
        'ACTION': 'action_shape',  # Regular sequence blocks
        'CONDITION': 'condition_shape',  # Hexagonal/diamond shape
        'EVENT': 'event_shape',  # Hat/rounded top shape
        'VALUE': 'value_shape',  # Rounded rectangle for values
    }
    
    @staticmethod
    def can_nest_inside(child_type, parent_type):
        """Check if a child block type can be nested inside a parent block type.
        
        Args:
            child_type: The type of block to be nested
            parent_type: The type of the container block
            
        Returns:
            bool: True if this nesting is allowed
        """
        allowed = BlockHierarchy.CONNECTION_RULES.get(parent_type, [])
        return child_type in allowed
    
    @staticmethod
    def can_attach_to_top(child_type, parent_type):
        """Check if a child block can attach to the top of a parent block.
        
        Args:
            child_type: The type of block to be attached
            parent_type: The type of the block to attach to
            
        Returns:
            bool: True if this attachment is allowed
        """
        allowed = BlockHierarchy.TOP_ATTACHMENT_RULES.get(parent_type, [])
        return child_type in allowed
    
    @staticmethod
    def can_chain_after(block_type, previous_type):
        """Check if a block can chain after another in a sequence.
        
        Args:
            block_type: The type of block being added
            previous_type: The type of the previous block in the chain
            
        Returns:
            bool: True if this chaining is allowed
        """
        # Within RULES/SUBROUTINES, actions can chain
        if previous_type in ['ACTIONS', 'CONDITIONS', 'EVENTS']:
            return block_type in ['ACTIONS', 'CONDITIONS', 'EVENTS']
        
        return False
    
    @staticmethod
    def find_valid_parent(block, editor):
        """Find a valid parent block for the given block based on proximity.
        
        Args:
            block: The block dictionary looking for a parent
            editor: The BlockEditor instance
            
        Returns:
            str or None: Block ID of valid parent, or None if none found
        """
        block_type = block['type']
        block_x = block['x']
        block_y = block['y']
        
        best_parent = None
        min_distance = float('inf')
        
        # Look for C-shaped blocks that can contain this block type
        for bid, potential_parent in editor.all_blocks.items():
            if bid == block['id']:
                continue
                
            parent_type = potential_parent['type']
            
            # Check if this parent type can contain our block type
            if not BlockHierarchy.can_nest_inside(block_type, parent_type):
                continue
            
            # Check if block is within the parent's bounds
            if BlockHierarchy.is_inside_c_block(block, potential_parent):
                # Calculate distance
                dx = block_x - potential_parent['x']
                dy = block_y - potential_parent['y']
                distance = (dx * dx + dy * dy) ** 0.5
                
                if distance < min_distance:
                    min_distance = distance
                    best_parent = bid
        
        return best_parent
    
    @staticmethod
    def find_top_attachment_target(block, editor, snap_distance=50):
        """Find a valid block to attach to the top of (e.g., CONDITIONS to RULES).
        
        Args:
            block: The block dictionary looking for a top attachment target
            editor: The BlockEditor instance
            snap_distance: Maximum distance to consider for snapping
            
        Returns:
            str or None: Block ID of target, or None if none found
        """
        block_type = block['type']
        block_x = block['x']
        block_y = block['y']
        
        best_target = None
        min_distance = float('inf')
        
        # Look for blocks that can accept top attachment
        for bid, potential_target in editor.all_blocks.items():
            if bid == block['id']:
                continue
                
            target_type = potential_target['type']
            
            # Check if this target can accept our block type on top
            if not BlockHierarchy.can_attach_to_top(block_type, target_type):
                continue
            
            # Check if block is near the top of the target
            target_x = potential_target['x']
            target_y = potential_target['y']
            
            # Calculate distance from block to top of target
            dx = block_x - target_x
            dy = block_y - (target_y - block.get('height', 50))  # Position above target
            distance = (dx * dx + dy * dy) ** 0.5
            
            if distance < snap_distance and distance < min_distance:
                min_distance = distance
                best_target = bid
        
        return best_target
    
    @staticmethod
    def is_inside_c_block(child_block, parent_block):
        """Check if a child block is positioned inside a C-shaped parent block.
        
        Args:
            child_block: The potential child block dictionary
            parent_block: The C-shaped container block dictionary
            
        Returns:
            bool: True if child is inside the C-opening
        """
        if parent_block['type'] not in BlockHierarchy.CONTAINER_BLOCKS:
            return False
        
        # C-blocks have an opening on the right side
        # Check if child is within the inner bounds
        bar_height = 45
        left_bar_width = 40
        
        px, py = parent_block['x'], parent_block['y']
        pw = parent_block.get('width', 320)
        inner_height = parent_block.get('inner_height', 100)
        
        # Inner bounds: left side + bar thickness to right edge, top bar to bottom bar
        inner_left = px + left_bar_width
        inner_right = px + pw
        inner_top = py + bar_height
        inner_bottom = py + bar_height + inner_height
        
        cx = child_block['x']
        cy = child_block['y']
        cw = child_block.get('width', 280)
        ch = child_block.get('height', 35)
        
        # Check if child's center is within inner bounds
        center_x = cx + cw / 2
        center_y = cy + ch / 2
        
        return (inner_left < center_x < inner_right and 
                inner_top < center_y < inner_bottom)
    
    @staticmethod
    def get_subroutines_in_block(block_id, editor):
        """Get all subroutines nested in a given block.
        
        Args:
            block_id: The parent block ID
            editor: The BlockEditor instance
            
        Returns:
            list: List of (subroutine_id, subroutine_block) tuples
        """
        subroutines = []
        
        for bid, block in editor.all_blocks.items():
            if (block.get('nested_in') == block_id and 
                block['type'] == 'SUBROUTINE'):
                subroutines.append((bid, block))
        
        return subroutines
    
    @staticmethod
    def navigate_to_subroutine(subroutine_id, editor):
        """Navigate the canvas view to focus on a subroutine.
        
        Args:
            subroutine_id: The subroutine block ID to navigate to
            editor: The BlockEditor instance
        """
        if subroutine_id not in editor.all_blocks:
            return
        
        subroutine = editor.all_blocks[subroutine_id]
        
        # Center the canvas on this subroutine
        sx = subroutine['x']
        sy = subroutine['y']
        sw = subroutine.get('width', 320)
        sh = subroutine.get('height', 200)
        
        # Calculate center
        center_x = sx + sw / 2
        center_y = sy + sh / 2
        
        # Get canvas viewport size
        canvas = editor.canvas
        try:
            vw = canvas.winfo_width()
            vh = canvas.winfo_height()
            
            # Calculate scroll fractions to center this block
            scrollregion = canvas.cget("scrollregion")
            if scrollregion:
                coords = [float(x) for x in scrollregion.split()]
                total_width = coords[2] - coords[0]
                total_height = coords[3] - coords[1]
                
                # Calculate fractions
                fx = max(0.0, min(1.0, (center_x - vw / 2) / total_width))
                fy = max(0.0, min(1.0, (center_y - vh / 2) / total_height))
                
                canvas.xview_moveto(fx)
                canvas.yview_moveto(fy)
        except Exception as e:
            print(f"Navigation error: {e}")
