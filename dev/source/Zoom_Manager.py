"""Zoom Manager for Block Editor.

Handles all zoom-related functionality including zoom controls, scaling, and grid updates.
"""


class ZoomManager:
    """Manages zoom state and operations for the block editor."""
    
    def __init__(self, editor):
        """Initialize zoom manager with reference to block editor.
        
        Args:
            editor: BlockEditor instance
        """
        self.editor = editor
        self.zoom_scale = 1.0
        self.zoom_slider = None
        self.zoom_label = None
    
    def set_zoom(self, new_scale):
        """Set zoom to new_scale and scale canvas contents.
        
        Args:
            new_scale: New zoom scale (0.25 to 3.0)
        """
        try:
            old = self.zoom_scale
            new_scale = max(0.25, min(3.0, new_scale))
            
            if abs(old - new_scale) < 0.01:
                return
            
            factor = new_scale / old
            
            # Scale all block positions and sizes
            for block in self.editor.all_blocks.values():
                block["x"] = int(block["x"] * factor)
                block["y"] = int(block["y"] * factor)
                block["width"] = int(block["width"] * factor)
                block["height"] = int(block["height"] * factor)
                if "inner_height" in block:
                    block["inner_height"] = int(block["inner_height"] * factor)
            
            # Scale child defaults so newly created blocks match current zoom
            self.editor.CHILD_BLOCK_WIDTH = self.editor.CHILD_BLOCK_WIDTH * factor
            self.editor.CHILD_BLOCK_HEIGHT = self.editor.CHILD_BLOCK_HEIGHT * factor
            
            self.zoom_scale = new_scale
            
            # Redraw everything
            for block_id in list(self.editor.all_blocks.keys()):
                try:
                    self.editor.draw_block(block_id)
                    self.editor.update_block_position(block_id)
                except Exception:
                    pass
            
            # Redraw grid
            try:
                self.editor.draw_grid()
            except Exception:
                pass
            
            # Update slider and label
            if self.zoom_slider:
                try:
                    self.zoom_slider.set(self.zoom_scale)
                except Exception:
                    pass
            
            if self.zoom_label:
                try:
                    self.zoom_label.config(text=f"{int(self.zoom_scale * 100)}%")
                except Exception:
                    pass
        except Exception as e:
            print(f"Error setting zoom: {e}")
    
    def zoom_in(self):
        """Zoom in by 10%."""
        self.set_zoom(self.zoom_scale + 0.1)
    
    def zoom_out(self):
        """Zoom out by 10%."""
        self.set_zoom(self.zoom_scale - 0.1)
    
    def reset_zoom(self):
        """Reset zoom to 100%."""
        self.set_zoom(1.0)
    
    def get_grid_spacing(self):
        """Get current grid spacing based on zoom.
        
        Returns:
            int: Grid spacing in pixels
        """
        base = getattr(self.editor, "BASE_GRID", 20)
        return max(8, int(base * self.zoom_scale))
