class UndoManager:
    def __init__(self, editor):
        self.editor = editor
        self.undo_stack = []
        self.redo_stack = []
        self.is_reverting = False

    def record_action(self, action):
        if self.is_reverting:
            return
        self.undo_stack.append(action)
        self.redo_stack.clear()

    def _restore_block(self, block_data):
        if not block_data:
            return
        
        block_id = block_data['id']
        
        # 1. Put the block back into the main dictionary
        self.editor.all_blocks[block_id] = block_data
        
        # 2. Restore vertical chain connections
        prev_id = block_data.get('previous_block')
        if prev_id and prev_id in self.editor.all_blocks:
            self.editor.all_blocks[prev_id]['next_block'] = block_id
            
        next_id = block_data.get('next_block')
        if next_id and next_id in self.editor.all_blocks:
            self.editor.all_blocks[next_id]['previous_block'] = block_id
            
        # 3. Restore container nesting
        parent_id = block_data.get('nested_in')
        if parent_id and parent_id in self.editor.all_blocks:
            if 'nested_blocks' not in self.editor.all_blocks[parent_id]:
                self.editor.all_blocks[parent_id]['nested_blocks'] = []
            if block_id not in self.editor.all_blocks[parent_id]['nested_blocks']:
                self.editor.all_blocks[parent_id]['nested_blocks'].append(block_id)
                
        # 4. Restore horizontal docking
        dock_parent_id = block_data.get('docked_to')
        if dock_parent_id and dock_parent_id in self.editor.all_blocks:
            if 'docked_blocks' not in self.editor.all_blocks[dock_parent_id]:
                self.editor.all_blocks[dock_parent_id]['docked_blocks'] = []
            if block_id not in self.editor.all_blocks[dock_parent_id]['docked_blocks']:
                self.editor.all_blocks[dock_parent_id]['docked_blocks'].append(block_id)

        # 5. Restore value nesting
        nested_in_param = block_data.get('nested_in_param')
        if nested_in_param:
            param_parent_id, param_name = nested_in_param
            if param_parent_id in self.editor.all_blocks:
                self.editor.all_blocks[param_parent_id]['inputs'][param_name]['block'] = block_id
                
        # 6. Redraw the block and its parent(s) to reflect the restored state
        self.editor.draw_block(block_id)
        if parent_id:
             self.editor.draw_block(parent_id)
        if dock_parent_id:
            self.editor.draw_block(dock_parent_id)
        if nested_in_param:
            self.editor.draw_block(nested_in_param[0])

    def undo(self):
        if not self.undo_stack:
            return
        
        self.is_reverting = True
        try:
            action = self.undo_stack.pop()
            self.redo_stack.append(action)
            
            action_type = action.get("type")
            if action_type == "create":
                # Inverse of create is delete
                self.editor.delete_block(action["block_id"])
            elif action_type == "delete":
                # Inverse of delete is restore
                self._restore_block(action["block_data"])
            elif action_type == "move":
                # Inverse of move is moving to the original position
                block_id = action.get("block_id")
                original_pos = action.get("original_pos")
                if block_id and original_pos and block_id in self.editor.all_blocks:
                    self.editor.all_blocks[block_id]['x'] = original_pos[0]
                    self.editor.all_blocks[block_id]['y'] = original_pos[1]
                    self.editor.update_block_position(block_id)
        finally:
            self.is_reverting = False
            self.editor.update_code_preview()

    def redo(self):
        if not self.redo_stack:
            return

        self.is_reverting = True
        try:
            action = self.redo_stack.pop()
            self.undo_stack.append(action)

            # Perform the original action again
            action_type = action.get("type")
            if action_type == "create":
                # Re-create means restoring the block data
                self._restore_block(action["block_data"])
            elif action_type == "delete":
                # Re-delete
                self.editor.delete_block(action["block_id"])
            elif action_type == "move":
                # Re-move to the new position
                block_id = action.get("block_id")
                new_pos = action.get("new_pos")
                if block_id and new_pos and block_id in self.editor.all_blocks:
                    self.editor.all_blocks[block_id]['x'] = new_pos[0]
                    self.editor.all_blocks[block_id]['y'] = new_pos[1]
                    self.editor.update_block_position(block_id)
        finally:
            self.is_reverting = False
            self.editor.update_code_preview()
