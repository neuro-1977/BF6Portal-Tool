import tkinter as tk
import math
from block_hierarchy import BlockHierarchy

class InputHandler:
    """
    Handles user input events (mouse clicks, drags, releases) for the Block Editor.
    """
    def __init__(self, editor):
        self.editor = editor
        self.canvas = editor.canvas

    def on_block_press(self, event, block_id=None):
        """Handles mouse button press on a block."""

        if block_id is None:
            # Find block by canvas tag if clicked directly on a canvas item
            try:
                item = self.canvas.find_closest(event.x, event.y)[0]
                tags = self.canvas.gettags(item)
                block_id = next((tag for tag in tags if tag.startswith("block_")), None)
            except IndexError:
                pass

        if block_id and block_id in self.editor.all_blocks:
            block = self.editor.all_blocks[block_id]
            # Allow all block types to be dragged
            self.editor.drag_data["block_id"] = block_id
            self.editor.drag_data["x"] = event.x_root
            self.editor.drag_data["y"] = event.y_root
            # Check if Shift key is pressed for group movement
            self.editor.drag_data["shift_pressed"] = (event.state & 0x0001) != 0

            # Store original parent for detachment detection
            self.editor.drag_data["original_parent"] = block.get("nested_in") or block.get("nested_in_action_area") or block.get("nested_in_condition_area")
            self.editor.drag_data["original_dock_parent"] = block.get("docked_to")
            self.editor.drag_data["original_chain"] = self.editor.get_chain_ids(block_id)
            
            # Store start position for detachment calculation
            self.editor.drag_data["start_x"] = block["x"]
            self.editor.drag_data["start_y"] = block["y"]

            # Bring the entire chain to the front
            blocks_to_raise = self.editor.get_snapped_children(block_id)
            for _id in blocks_to_raise:
                if _id in self.editor.all_blocks and self.editor.all_blocks[_id]["canvas_obj"]:
                        self.canvas.tag_raise(self.editor.all_blocks[_id]["canvas_obj"])
                        self.canvas.tag_raise(f"{_id} && widget_window")

    def on_block_drag(self, event, block_id=None):
        """Handles block movement with nested children and attached blocks."""
        if self.editor.drag_data["block_id"] is None:
            return

        dx = (event.x_root - self.editor.drag_data["x"]) / self.editor.zoom_scale
        dy = (event.y_root - self.editor.drag_data["y"]) / self.editor.zoom_scale

        dragged_id = self.editor.drag_data["block_id"]
        dragged_block = self.editor.all_blocks.get(dragged_id)
        
        if not dragged_block:
            return

        # Check if this block should detach from its parent
        # Detach if it has moved significantly from its original position
        original_parent = self.editor.drag_data.get("original_parent")
        if original_parent and original_parent in self.editor.all_blocks:
            # Calculate total distance moved from original snap point
            # Note: start_x/y are set in on_block_press
            start_x = self.editor.drag_data.get("start_x", dragged_block["x"])
            start_y = self.editor.drag_data.get("start_y", dragged_block["y"])
            
            total_dx = dragged_block["x"] - start_x
            total_dy = dragged_block["y"] - start_y
            distance_moved = math.hypot(total_dx, total_dy)
            
            # Detach if moved more than 40 pixels from original position
            if distance_moved > 40:
                # Remove from parent's nested_blocks list
                parent_block = self.editor.all_blocks.get(original_parent)
                if parent_block and "nested_blocks" in parent_block:
                    if dragged_id in parent_block["nested_blocks"]:
                        parent_block["nested_blocks"].remove(dragged_id)
                        # Redraw parent to update visual state (e.g. show bars again)
                        self.editor.draw_block(original_parent)
                        self.editor.update_block_position(original_parent)
                        # Resize parent container
                        self.editor._resize_c_block_for_contents(original_parent)

                dragged_block.pop('nested_in', None)
                dragged_block.pop('nested_in_action_area', None)
                dragged_block.pop('nested_in_condition_area', None)
                dragged_block.pop('nested_in_top_bar', None)
                dragged_block['parent_id'] = None  # Clear parent_id to fully detach
                self.editor.drag_data["original_parent"] = None  # Mark as detached

        # Check if this block should detach from its docked parent (horizontal)
        original_dock_parent = self.editor.drag_data.get("original_dock_parent")
        if original_dock_parent and original_dock_parent in self.editor.all_blocks:
             # Calculate total distance moved from original snap point
            start_x = self.editor.drag_data.get("start_x", dragged_block["x"])
            start_y = self.editor.drag_data.get("start_y", dragged_block["y"])
            
            total_dx = dragged_block["x"] - start_x
            total_dy = dragged_block["y"] - start_y
            distance_moved = math.hypot(total_dx, total_dy)
            
            if distance_moved > 20: # Smaller threshold for horizontal detach
                parent_block = self.editor.all_blocks.get(original_dock_parent)
                if parent_block and "docked_blocks" in parent_block:
                    if dragged_id in parent_block["docked_blocks"]:
                        parent_block["docked_blocks"].remove(dragged_id)
                
                dragged_block.pop('docked_to', None)
                self.editor.drag_data["original_dock_parent"] = None

        # Move the dragged block and all its children
        blocks_to_move = self.editor.get_snapped_children(dragged_id)
        
        for _id in blocks_to_move:
            block = self.editor.all_blocks.get(_id)
            if not block:
                continue
                
            block["x"] += dx
            block["y"] += dy

            # Move ALL canvas items with this block's tag
            self.canvas.move(_id, dx, dy)
        
        # Update drag data for next event
        self.editor.drag_data["x"] = event.x_root
        self.editor.drag_data["y"] = event.y_root

        # Show snap feedback
        if self.editor.block_mover:
            snap_target = self.editor.block_mover.get_snap_target(dragged_id)
            if snap_target:
                target_id, snap_type, is_valid = snap_target
                if self.editor.block_renderer:
                    self.editor.block_renderer.show_snap_feedback(target_id, snap_type, is_valid)
            else:
                if self.editor.block_renderer:
                    self.editor.block_renderer.clear_snap_feedback()

    def on_block_release(self, event, block_id=None):
        """Handles mouse button release (snap logic)."""
        if self.editor.drag_data["block_id"] is None:
            return

        # Clear feedback
        if self.editor.block_renderer:
            self.editor.block_renderer.clear_snap_feedback()

        dragged_id = self.editor.drag_data["block_id"]
        dragged_block = self.editor.all_blocks.get(dragged_id)

        # Reset drag state
        self.editor.drag_data["block_id"] = None
        self.editor.drag_data["x"] = 0
        self.editor.drag_data["y"] = 0

        # Portal-style: Try to nest VALUE blocks into parameter slots
        if dragged_block and dragged_block.get("type") in ["VALUE", "CONDITIONS"]:
            if self._try_nest_in_parameter_slot(dragged_id, event):
                # Successfully nested - update display and return
                self.editor.update_code_preview()
                return

        # Try connector/receptor snapping
        snapped = False
        try:
            if self.editor.block_mover:
                snapped = self.editor.block_mover._attempt_snap(dragged_id)
        except Exception as e:
            print(f"Error during snap attempt: {e}")

        # If not snapped, apply grid snapping
        if not snapped:
            self._snap_to_grid(dragged_id)

        # Update code preview after block movement
        self.editor.update_code_preview()

    def _snap_to_grid(self, block_id):
        """Snap a block to the nearest grid point."""
        if block_id not in self.editor.all_blocks:
            return
            
        block = self.editor.all_blocks[block_id]
        GRID_SIZE = 20
        
        # Calculate nearest grid position
        x = round(block["x"] / GRID_SIZE) * GRID_SIZE
        y = round(block["y"] / GRID_SIZE) * GRID_SIZE
        
        # Calculate delta
        dx = x - block["x"]
        dy = y - block["y"]
        
        if dx == 0 and dy == 0:
            return
            
        # Move the block and its children
        blocks_to_move = self.editor.get_snapped_children(block_id)
        for _id in blocks_to_move:
            if _id in self.editor.all_blocks:
                b = self.editor.all_blocks[_id]
                b["x"] += dx
                b["y"] += dy
                self.editor.update_block_position(_id)

    def _try_nest_in_parameter_slot(self, value_block_id, event):
        """Try to nest a VALUE block into a nearby parameter slot (Portal-style).
        
        Returns True if nesting succeeded, False otherwise.
        """
        value_block = self.editor.all_blocks.get(value_block_id)
        if not value_block:
            return False
        
        # Get mouse position on canvas
        canvas_x = self.canvas.canvasx(event.x)
        canvas_y = self.canvas.canvasy(event.y)
        
        # Find nearest block with parameter slots
        nearest_distance = 100  # Max distance to consider
        nearest_block = None
        nearest_param = None
        
        for block_id, block in self.editor.all_blocks.items():
            if block_id == value_block_id:
                continue
            
            # Check if block has parameter slots
            param_slots = block.get('param_slots', {})
            if not param_slots:
                continue
            
            # Check each parameter slot
            for param_name, slot_widget in param_slots.items():
                if not slot_widget or not slot_widget.winfo_exists():
                    continue
                
                # Get slot position on canvas
                try:
                    slot_x = slot_widget.winfo_rootx()
                    slot_y = slot_widget.winfo_rooty()
                    canvas_slot_x = self.canvas.canvasx(slot_x - self.canvas.winfo_rootx())
                    canvas_slot_y = self.canvas.canvasy(slot_y - self.canvas.winfo_rooty())
                    
                    # Calculate distance
                    distance = math.hypot(canvas_x - canvas_slot_x, canvas_y - canvas_slot_y)
                    
                    if distance < nearest_distance:
                        nearest_distance = distance
                        nearest_block = block
                        nearest_param = param_name
                except Exception:
                    continue
        
        # If found a nearby slot, nest the block
        if nearest_block and nearest_param:
            # Store the VALUE block in the parent's inputs
            if 'inputs' not in nearest_block:
                nearest_block['inputs'] = {}
            if nearest_param not in nearest_block['inputs']:
                nearest_block['inputs'][nearest_param] = {}
            
            nearest_block['inputs'][nearest_param]['block'] = value_block
            
            # Mark the VALUE block as nested
            value_block['nested_in_param'] = nearest_block['id']
            value_block['nested_param_name'] = nearest_param
            
            # Hide the VALUE block's visual representation (it will be shown inline)
            if value_block.get('canvas_obj'):
                self.canvas.itemconfig(value_block['canvas_obj'], state='hidden')
            for widget in value_block.get('widgets', []):
                try:
                    if hasattr(widget, 'destroy'):
                        widget.destroy()
                    else:
                        self.canvas.itemconfig(widget, state='hidden')
                except:
                    pass
            
            # Redraw parent block to show nested block inline
            self.editor.draw_block(nearest_block['id'])
            
            return True
        
        return False

    def show_block_context_menu(self, event, block_id):
        """Show context menu for a block with navigation options.
        
        Args:
            event: The mouse event
            block_id: The ID of the block that was right-clicked
        """
        # If block_id is None, try to find it from the event
        if block_id is None:
            try:
                item = self.canvas.find_closest(event.x, event.y)[0]
                tags = self.canvas.gettags(item)
                block_id = next((tag for tag in tags if tag.startswith("block_")), None)
            except IndexError:
                pass

        if block_id not in self.editor.all_blocks:
            return
        
        block = self.editor.all_blocks[block_id]
        block_type = block['type']
        
        # Create context menu
        menu = tk.Menu(self.editor.master, tearoff=0, bg="#2d2d2d", fg="white")

        
        # Add navigation options if block has subroutines
        if block_type in ['RULES', 'MOD']:
            subroutines = BlockHierarchy.get_subroutines_in_block(block_id, self.editor)
            if subroutines:
                menu.add_command(label="Navigate to Subroutines:", state="disabled")
                menu.add_separator()
                for sub_id, sub_block in subroutines:
                    sub_label = sub_block.get('label', 'Subroutine')
                    menu.add_command(
                        label=f"  → {sub_label}",
                        command=lambda sid=sub_id: BlockHierarchy.navigate_to_subroutine(sid, self.editor)
                    )
                menu.add_separator()

        # Add "Jump to Definition" for Call Subroutine blocks
        if block.get('label') == "Call Subroutine":
             menu.add_command(
                label="Jump to Definition",
                command=lambda: self.jump_to_subroutine_definition(block_id)
            )
             menu.add_separator()
        
        # Add option to create subroutine
        if block_type == 'RULES':
            menu.add_command(
                label="Add Subroutine",
                command=lambda: self.editor.add_subroutine_to_block(block_id)
            )
            menu.add_separator()
        
        # Common options
        menu.add_command(
            label="Block Properties",
            command=lambda: self.editor.show_block_properties(block_id)
        )
        menu.add_separator()
        menu.add_command(
            label="Help & Examples",
            command=lambda: self.editor.show_block_help(block_id)
        )
        menu.add_separator()
        menu.add_command(
            label="Delete Block",
            command=lambda: self.editor.delete_block(block_id)
        )
        
        try:
            menu.tk_popup(event.x_root, event.y_root)
        except Exception:
            pass
        finally:
            menu.grab_release()

    def jump_to_subroutine_definition(self, block_id):
        """Finds the definition of the subroutine called by block_id and jumps to it."""
        block = self.editor.all_blocks.get(block_id)
        if not block: return
        
        # Get subroutine name from widget
        # The widget key is 'subroutine_name' based on subroutine_data.json
        sub_name_var = block.get("widget_vars", {}).get("subroutine_name")
        if not sub_name_var: 
            print("No subroutine name found on block.")
            return
        
        target_name = sub_name_var.get()
        
        # Find definition
        for b_id, b in self.editor.all_blocks.items():
            if b.get("type") == "SUBROUTINE":
                # Check its name widget
                def_name_var = b.get("widget_vars", {}).get("subroutine_name")
                if def_name_var and def_name_var.get() == target_name:
                    # Found it!
                    BlockHierarchy.navigate_to_subroutine(b_id, self.editor)
                    self.editor.select_block(b_id)
                    return
        
        print(f"Subroutine definition '{target_name}' not found.")
