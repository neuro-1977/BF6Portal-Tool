"""
TypeScript Code Generator for Battlefield Portal Blocks

Generates TypeScript code matching the official Battlefield Portal format.
Based on Portal's script-conversion.ts structure.
"""


class TypeScriptGenerator:
    """Generates TypeScript code from block structures."""
    
    def __init__(self):
        self.rules = []
        self.global_vars = []
        self.player_vars = []
        self.team_vars = []
        
    def generate(self, all_blocks):
        """Generate complete TypeScript code from blocks."""
        # Find MOD block
        mod_blocks = [b for b in all_blocks.values() if b.get('type') == 'MOD']
        if not mod_blocks:
            return "// No MOD block found\n"
        
        # Find all RULES blocks
        rules_blocks = [b for b in all_blocks.values() if b.get('type') == 'RULES']
        
        # Generate code for each rule
        code_parts = []
        code_parts.append("import * as modlib from 'modlib';\n")
        
        for rule in rules_blocks:
            code_parts.append(self._generate_rule(rule, all_blocks))
        
        # Add variable declarations
        code_parts.append("\n// global vars\n")
        for var in self.global_vars:
            code_parts.append(f"let {var};\n")
        
        code_parts.append("\n// player vars\n")
        code_parts.append("\n// team vars\n")
        code_parts.append("\n// capture point vars\n")
        code_parts.append("\n// mcom vars\n")
        code_parts.append("\n// vehicle vars\n")
        
        # Generate main event handlers
        code_parts.append(self._generate_event_handlers(rules_blocks))
        
        return "".join(code_parts)
    
    def _generate_rule(self, rule_block, all_blocks):
        """Generate code for a single RULE block."""
        rule_name = rule_block.get('label', 'Rule')
        rule_name = rule_name.replace(' ', '_')
        
        # Get event type and scope from dropdowns
        event_type = rule_block.get('args', {}).get('dropdown1')
        if event_type and hasattr(event_type, 'get'):
            event_type = event_type.get()
        event_type = event_type or "Ongoing"
        
        scope = rule_block.get('args', {}).get('dropdown2')
        if scope and hasattr(scope, 'get'):
            scope = scope.get()
        scope = scope or "Global"
        
        function_prefix = f"{event_type}{scope}_{rule_name}"
        
        code = []
        
        # Generate condition function
        condition_code = self._generate_condition_function(rule_block, all_blocks, function_prefix)
        if condition_code:
            code.append(condition_code)
        
        # Generate action function
        action_code = self._generate_action_function(rule_block, all_blocks, function_prefix)
        if action_code:
            code.append(action_code)
        
        # Generate main rule function
        code.append(f"function {function_prefix}(conditionState: any) {{\n")
        if condition_code:
            code.append(f"let newState = {function_prefix}_Condition();\n")
            code.append(f"if (!conditionState.update(newState)) {{\n")
            code.append(f" return;\n")
            code.append(f"}}\n")
        code.append(f"{function_prefix}_Action();\n")
        code.append(f"}}\n\n")
        
        return "".join(code)
    
    def _generate_condition_function(self, rule_block, all_blocks, function_prefix):
        """Generate condition function for a rule."""
        # Find CONDITIONS blocks nested in this RULE
        # Look for blocks that are directly nested in the RULES block
        conditions = [b for b in all_blocks.values() 
                     if b.get('type') == 'CONDITIONS' 
                     and b.get('nested_in') == rule_block['id']]
        
        if not conditions:
            return ""
        
        code = []
        code.append(f"function {function_prefix}_Condition(): boolean {{\n")
        code.append("  const newState = ")
        
        # Generate condition logic
        # If multiple conditions, assume AND for now (or follow chain)
        condition_exprs = []
        for cond in conditions:
            # Follow chain if any
            current = cond
            while current:
                expr = self._generate_block_expression(current, all_blocks)
                condition_exprs.append(expr)
                
                next_id = current.get('next') or current.get('next_block')
                current = all_blocks.get(next_id) if next_id else None
                
        if condition_exprs:
            code.append(" && ".join(condition_exprs))
        else:
            code.append("true")
            
        code.append(";\n")
        code.append(" return newState;\n")
        code.append("}\n\n")
        
        return "".join(code)
    
    def _generate_action_function(self, rule_block, all_blocks, function_prefix):
        """Generate action function for a rule."""
        # Find ACTIONS blocks nested in this RULE
        # Look for blocks that are directly nested in the RULES block
        actions = [b for b in all_blocks.values() 
                  if b.get('type') in ['ACTIONS', 'LOGIC', 'SEQUENCE']
                  and b.get('nested_in') == rule_block['id']]
        
        code = []
        code.append(f"function {function_prefix}_Action() {{\n")
        
        # Generate action chain - follow 'next' property
        for action in actions:
            current_block = action
            while current_block:
                code.append(self._generate_block_code(current_block, all_blocks, indent=2))
                
                # Follow next chain
                next_id = current_block.get('next') or current_block.get('next_block')
                current_block = all_blocks.get(next_id) if next_id else None
        
        code.append("}\n")
        
        return "".join(code)
    
    def _generate_block_code(self, block, all_blocks, indent=0):
        """Generate code for a single block with its inputs."""
        block_type = block.get('type')
        label = block.get('label', '')
        spaces = " " * indent
        
        code_lines = []
        
        # Handle logic blocks with C-shaped nesting
        if block_type == 'LOGIC':
            if label == 'If':
                condition = self._generate_input_value(block, 'CONDITION', all_blocks)
                code_lines.append(f"{spaces}if ({condition}) {{\n{spaces}}}\n")
            elif label == 'While':
                condition = self._generate_input_value(block, 'CONDITION', all_blocks)
                code_lines.append(f"{spaces}while ({condition}) {{\n{spaces}}}\n")
            elif label == 'ForVariable':
                var_name = self._generate_input_value(block, 'VARIABLE', all_blocks)
                start = self._generate_input_value(block, 'START', all_blocks)
                end = self._generate_input_value(block, 'END', all_blocks)
                step = self._generate_input_value(block, 'STEP', all_blocks)
                code_lines.append(f"{spaces}for (let {var_name} = {start}; {var_name} < {end}; {var_name} += {step}) {{\n{spaces}}}\n")
            elif label in ['Break', 'Continue']:
                code_lines.append(f"{spaces}{label.lower()};\n")
        
        # Handle action blocks
        elif block_type in ['ACTIONS', 'SEQUENCE', 'ACTION']:
            # Generate function call with parameters from inputs
            params = []
            for param_name, param_data in block.get('inputs', {}).items():
                nested_block = param_data.get('block')
                if nested_block:
                    param_value = self._generate_block_expression(nested_block, all_blocks)
                    params.append(param_value)
                else:
                    # Check for literal value in input slot
                    val = param_data.get('value')
                    if val:
                        if hasattr(val, 'get'):
                            params.append(f'"{val.get()}"') # Assume string for now
                        else:
                            params.append(f'"{str(val)}"')
                    else:
                        params.append('undefined')
            
            param_str = ', '.join(params)
            code_lines.append(f"{spaces}modlib.{label}({param_str});\n")
        
        else:
            code_lines.append(f"{spaces}// {label}\n")
            
        # Handle docked blocks (Horizontal Events)
        docked_ids = block.get('docked_blocks', [])
        for docked_id in docked_ids:
            docked_block = all_blocks.get(docked_id)
            if docked_block:
                # Generate code for docked block (e.g. .OnSuccess(...))
                # This assumes docked blocks are method chains or similar
                docked_label = docked_block.get('label', '')
                code_lines.append(f"{spaces}// Docked: {docked_label}\n")
                
        return "".join(code_lines)
    
    def _generate_input_value(self, block, input_name, all_blocks):
        """Get the value for a specific input slot."""
        inputs = block.get('inputs', {})
        input_data = inputs.get(input_name, {})
        nested_block = input_data.get('block')
        
        if nested_block:
            return self._generate_block_expression(nested_block, all_blocks)
            
        # Check for literal value
        val = input_data.get('value')
        if val:
            if hasattr(val, 'get'):
                return f'"{val.get()}"'
            return f'"{str(val)}"'
            
        return 'undefined'
    
    def _generate_block_expression(self, block, all_blocks):
        """Generate an expression for a VALUE block."""
        label = block.get('label', '')
        block_type = block.get('type')
        
        # Handle different value types
        if block_type == 'VALUE':
            # Math operations
            if label in ['Add', 'Subtract', 'Multiply', 'Divide']:
                op = {
                    'Add': '+',
                    'Subtract': '-',
                    'Multiply': '*',
                    'Divide': '/'
                }[label]
                a = self._generate_input_value(block, 'A', all_blocks)
                b = self._generate_input_value(block, 'B', all_blocks)
                return f"({a} {op} {b})"
            
            # Function calls
            elif label == 'SquareRoot':
                value = self._generate_input_value(block, 'VALUE', all_blocks)
                return f"Math.sqrt({value})"
            
            # Default: call as modlib function
            else:
                params = []
                for param_name, param_data in block.get('inputs', {}).items():
                    nested = param_data.get('block')
                    if nested:
                        params.append(self._generate_block_expression(nested, all_blocks))
                    else:
                        params.append('undefined')
                
                param_str = ', '.join(params) if params else ''
                return f"modlib.{label}({param_str})"
        
        # Literal values
        elif block_type == 'NUMBER':
            return str(block.get('value', '0'))
        elif block_type == 'BOOLEAN':
            return str(block.get('value', 'false')).lower()
        elif block_type == 'STRING':
            return f'"{block.get("value", "")}"'
        
        return 'undefined'
    
    def _generate_event_handlers(self, rules_blocks):
        """Generate main event handler functions."""
        code = []
        
        # For now, generate OngoingGlobal as default
        code.append("export function OngoingGlobal() {\n")
        code.append("const eventInfo = {};\n")
        code.append("let eventNum = 0;\n")
        
        for rule in rules_blocks:
            rule_name = rule.get('label', 'Rule').replace(' ', '_')
            event_type = "Ongoing"
            scope = "Global"
            # Get from dropdowns if available
            function_name = f"{event_type}{scope}_{rule_name}"
            code.append(f"  {function_name}(modlib.getGlobalCondition(eventNum++));\n")
        
        code.append("}\n\n")
        code.append("// \n")
        
        return "".join(code)
