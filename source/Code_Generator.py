"""Code Generator for Block Editor.

Generates code representation from block hierarchy and allows bidirectional sync
between visual blocks and code text. Also generates TypeScript matching Portal format.
"""

from TypeScript_Generator import TypeScriptGenerator


class CodeGenerator:
    """Generates code from block structures and syncs edits back to blocks."""
    
    def __init__(self, editor):
        """Initialize code generator with reference to block editor.
        
        Args:
            editor: BlockEditor instance
        """
        self.editor = editor
        self.ts_generator = TypeScriptGenerator()
    
    def generate_code(self, format='visual'):
        """Generate code from current block hierarchy.
        
        Args:
            format: 'visual' for visual representation or 'typescript' for Portal TS
        
        Returns:
            str: Generated code representation
        """
        if format == 'typescript':
            return self.ts_generator.generate(self.editor.all_blocks)
        
        lines = []
        
        # Find all MOD blocks (root level)
        mod_blocks = [b for b in self.editor.all_blocks.values() if b['type'] == 'MOD']
        
        for mod in mod_blocks:
            lines.extend(self._generate_mod_block(mod))
        
        return '\n'.join(lines)
    
    def _generate_mod_block(self, mod):
        """Generate code for MOD block and its contents.
        
        Args:
            mod: MOD block dictionary
            
        Returns:
            list: Lines of code
        """
        lines = []
        lines.append(f"MOD {mod['id']} {{")
        
        # Find RULES blocks nested in this MOD
        rules_blocks = [b for b in self.editor.all_blocks.values() 
                       if b.get('nested_in') == mod['id'] and b['type'] == 'RULES']
        
        for rules in rules_blocks:
            lines.extend(self._generate_rules_block(rules, indent=1))
        
        # Find SUBROUTINES nested in this MOD
        subroutine_blocks = [b for b in self.editor.all_blocks.values()
                            if b.get('nested_in') == mod['id'] and b['type'] == 'SUBROUTINE']
        
        for sub in subroutine_blocks:
            lines.extend(self._generate_subroutine_block(sub, indent=1))
        
        lines.append("}")
        return lines
    
    def _generate_rules_block(self, rules, indent=0):
        """Generate code for RULES block and its contents.
        
        Args:
            rules: RULES block dictionary
            indent: Indentation level
            
        Returns:
            list: Lines of code
        """
        lines = []
        ind = "  " * indent
        
        # Get rule name from args
        rule_name = ""
        if 'rule_name' in rules.get('args', {}):
            try:
                rule_name = rules['args']['rule_name'].get()
            except:
                pass
        
        if rule_name:
            lines.append(f"{ind}RULE '{rule_name}' {{")
        else:
            lines.append(f"{ind}RULE {rules['id']} {{")
        
        # Find CONDITIONS in this RULES block
        conditions = [b for b in self.editor.all_blocks.values()
                     if b.get('nested_in_condition_area') == rules['id']]
        
        if conditions:
            for cond in conditions:
                lines.extend(self._generate_condition_block(cond, indent + 1))
        
        # Find ACTIONS in this RULES block
        actions = [b for b in self.editor.all_blocks.values()
                  if b.get('nested_in_action_area') == rules['id']]
        
        if actions:
            for action in actions:
                lines.extend(self._generate_action_block(action, indent + 1))
        
        # Find SUBROUTINES in this RULES block
        subroutines = [b for b in self.editor.all_blocks.values()
                      if b.get('nested_in') == rules['id'] and b['type'] == 'SUBROUTINE']
        
        for sub in subroutines:
            lines.extend(self._generate_subroutine_block(sub, indent + 1))
        
        lines.append(f"{ind}}}")
        return lines
    
    def _generate_condition_block(self, condition, indent=0):
        """Generate code for CONDITIONS block.
        
        Args:
            condition: CONDITIONS block dictionary
            indent: Indentation level
            
        Returns:
            list: Lines of code
        """
        lines = []
        ind = "  " * indent
        
        # Find EVENT nested in this condition
        events = [b for b in self.editor.all_blocks.values()
                 if b.get('nested_in') == condition['id'] and b['type'] == 'EVENTS']
        
        if events:
            event = events[0]
            lines.append(f"{ind}IF EVENT {event['label']} THEN")
        else:
            lines.append(f"{ind}IF CONDITION {condition['id']} THEN")
        
        return lines
    
    def _generate_action_block(self, action, indent=0):
        """Generate code for ACTIONS block.
        
        Args:
            action: ACTIONS block dictionary
            indent: Indentation level
            
        Returns:
            list: Lines of code
        """
        lines = []
        ind = "  " * indent
        
        # Get action args
        args_str = ""
        if action.get('args'):
            arg_values = []
            for key, var in action['args'].items():
                try:
                    val = var.get()
                    if val:
                        arg_values.append(f"{key}={val}")
                except:
                    pass
            if arg_values:
                args_str = f"({', '.join(arg_values)})"
        
        lines.append(f"{ind}DO {action['label']}{args_str}")
        return lines
    
    def _generate_subroutine_block(self, subroutine, indent=0):
        """Generate code for SUBROUTINE block.
        
        Args:
            subroutine: SUBROUTINE block dictionary
            indent: Indentation level
            
        Returns:
            list: Lines of code
        """
        lines = []
        ind = "  " * indent
        lines.append(f"{ind}SUBROUTINE {subroutine['id']} {{")
        
        # Find nested content
        nested = [b for b in self.editor.all_blocks.values()
                 if b.get('nested_in') == subroutine['id']]
        
        for block in nested:
            if block['type'] == 'RULES':
                lines.extend(self._generate_rules_block(block, indent + 1))
            elif block['type'] == 'ACTIONS':
                lines.extend(self._generate_action_block(block, indent + 1))
        
        lines.append(f"{ind}}}")
        return lines
    
    def update_code_display(self):
        """Update the code pane with generated code."""
        code = self.generate_code()
        
        # Update the text widget in the editor
        try:
            self.editor.code_output_text.delete("1.0", "end")
            self.editor.code_output_text.insert("1.0", code)
        except Exception as e:
            print(f"Error updating code display: {e}")
    
    def parse_and_update_blocks(self, code_text):
        """Parse edited code and update/create blocks.
        
        Parses code structure and creates or updates blocks to match.
        Supports full bidirectional sync: code ↔ blocks.
        
        Args:
            code_text: Edited code text from the code pane
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Parse the code into a structure
            parsed_blocks = self._parse_code_structure(code_text)
            
            if not parsed_blocks:
                print("No valid blocks found in code")
                return False
            
            # Clear existing blocks and recreate from parsed code
            # This ensures consistency between code and visual representation
            self.editor.all_blocks.clear()
            self.editor.canvas.delete("all")
            
            # Recreate blocks from parsed structure
            for block_data in parsed_blocks:
                self._create_block_from_parsed(block_data)
            
            # Redraw all blocks
            for block_id in list(self.editor.all_blocks.keys()):
                self.editor.draw_block(block_id)
            
            print(f"Successfully parsed and created {len(parsed_blocks)} blocks from code")
            return True
            
        except Exception as e:
            print(f"Error parsing code: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def _parse_code_structure(self, code_text):
        """Parse code text into block structure.
        
        Args:
            code_text: Code to parse
            
        Returns:
            list: List of block data dictionaries
        """
        blocks = []
        lines = code_text.split('\n')
        i = 0
        
        while i < len(lines):
            line = lines[i].strip()
            
            # Parse MOD blocks
            if line.startswith('MOD ') and '{' in line:
                mod_block = self._parse_mod_block(lines, i)
                if mod_block:
                    blocks.append(mod_block)
                    # Skip to end of MOD block
                    i = mod_block.get('end_line', i + 1)
            
            i += 1
        
        return blocks
    
    def _parse_mod_block(self, lines, start_idx):
        """Parse a MOD block and its nested content.
        
        Args:
            lines: All code lines
            start_idx: Starting line index
            
        Returns:
            dict: Block data with nested blocks
        """
        line = lines[start_idx].strip()
        
        # Extract MOD ID
        mod_id = None
        if 'MOD ' in line:
            parts = line.split('MOD ')[1].split('{')[0].strip()
            mod_id = parts
        
        mod_block = {
            'type': 'MOD',
            'id': mod_id or f'mod_{start_idx}',
            'x': 100,
            'y': 100 + (start_idx * 150),  # Stack vertically
            'nested_blocks': []
        }
        
        # Find nested RULES blocks
        i = start_idx + 1
        indent_level = 1
        
        while i < len(lines) and indent_level > 0:
            line = lines[i].strip()
            
            if '{' in line:
                indent_level += 1
            if '}' in line:
                indent_level -= 1
                if indent_level == 0:
                    mod_block['end_line'] = i
                    break
            
            # Parse RULES block
            if line.startswith("RULE '") and "' {" in line:
                rules_block = self._parse_rules_block(lines, i, mod_block['id'])
                if rules_block:
                    mod_block['nested_blocks'].append(rules_block)
                    i = rules_block.get('end_line', i + 1)
            
            i += 1
        
        return mod_block
    
    def _parse_rules_block(self, lines, start_idx, parent_id):
        """Parse a RULES block with CONDITIONS and ACTIONS.
        
        Args:
            lines: All code lines
            start_idx: Starting line index
            parent_id: Parent MOD block ID
            
        Returns:
            dict: Rules block data
        """
        line = lines[start_idx].strip()
        
        # Extract rule name from RULE 'name' {
        rule_name = "Unnamed Rule"
        if "RULE '" in line:
            start = line.find("'") + 1
            end = line.find("'", start)
            if start > 0 and end > start:
                rule_name = line[start:end]
        
        rules_block = {
            'type': 'RULES',
            'id': f'rules_{start_idx}',
            'rule_name': rule_name,
            'parent_id': parent_id,
            'x': 150,
            'y': 150 + (start_idx * 100),
            'nested_blocks': []
        }
        
        # Parse CONDITIONS and ACTIONS
        i = start_idx + 1
        indent_level = 1
        
        while i < len(lines) and indent_level > 0:
            line = lines[i].strip()
            
            if '{' in line:
                indent_level += 1
            if '}' in line:
                indent_level -= 1
                if indent_level == 0:
                    rules_block['end_line'] = i
                    break
            
            # Parse CONDITIONS
            if line.startswith('CONDITIONS:'):
                cond_block = {
                    'type': 'CONDITIONS',
                    'id': f'cond_{i}',
                    'parent_id': rules_block['id'],
                    'x': 200,
                    'y': 200 + (i * 80)
                }
                rules_block['nested_blocks'].append(cond_block)
            
            # Parse ACTIONS
            if line.startswith('ACTIONS:'):
                action_block = {
                    'type': 'ACTIONS',
                    'id': f'action_{i}',
                    'parent_id': rules_block['id'],
                    'x': 250,
                    'y': 250 + (i * 80),
                    'nested_blocks': []
                }
                rules_block['nested_blocks'].append(action_block)
            
            i += 1
        
        return rules_block
    
    def _create_block_from_parsed(self, block_data, parent_id=None):
        """Create a block from parsed data.
        
        Args:
            block_data: Parsed block data dictionary
            parent_id: Optional parent block ID
        """
        block_type = block_data['type']
        block_id = block_data['id']
        x = block_data.get('x', 100)
        y = block_data.get('y', 100)
        
        # Create the block using editor's create_block method
        if block_type == 'MOD':
            new_id = self.editor.create_block('MOD', x, y)
            
        elif block_type == 'RULES':
            new_id = self.editor.create_block('RULES', x, y)
            # Set rule name if available
            if 'rule_name' in block_data:
                block = self.editor.all_blocks.get(new_id)
                if block and 'args' in block and 'rule_name' in block['args']:
                    block['args']['rule_name'].set(block_data['rule_name'])
            
            # Nest in parent MOD
            if parent_id:
                block = self.editor.all_blocks.get(new_id)
                if block:
                    block['nested_in'] = parent_id
                    
        elif block_type == 'CONDITIONS':
            new_id = self.editor.create_block('CONDITIONS', x, y)
            if parent_id:
                block = self.editor.all_blocks.get(new_id)
                if block:
                    block['nested_in'] = parent_id
                    
        elif block_type == 'ACTIONS':
            new_id = self.editor.create_block('ACTIONS', x, y)
            if parent_id:
                block = self.editor.all_blocks.get(new_id)
                if block:
                    block['nested_in'] = parent_id
        
        else:
            new_id = self.editor.create_block(block_type, x, y)
        
        # Process nested blocks recursively
        if 'nested_blocks' in block_data:
            for nested in block_data['nested_blocks']:
                self._create_block_from_parsed(nested, new_id)
