
import re
import json
import os
import sys # Import sys for stderr

def parse_blockly_init_function(init_function_code):
    """
    Parses the content of a Blockly block's init function to extract properties.
    """
    block_data = {}
    message_parts = []
    args_list = []

    # Iterate through each line of the init function code
    for line in init_function_code.split(';'): # Split by semicolons for individual statements
        line = line.strip()
        if not line:
            continue

        # Extract message parts and args from appendField, appendStatementInput, appendValueInput
        # This is a simplified approach and may not capture all complexities of Blockly init
        
        # appendField for message parts
        field_text_match = re.search(r"\.appendField\s*\(\s*\"([^\"]*)\"\s*\)", line)
        if field_text_match:
            message_parts.append(field_text_match.group(1))

        # appendField with a Field (e.g., FieldTextInput, FieldDropdown)
        field_match = re.search(r"\.appendField\s*\(\s*(?:new Blockly\.Field(?:TextInput|Dropdown|Checkbox)\s*\((?:[^,]*,\s*)?\"([^\"]*)\"\s*\)|new Blockly\.FieldVariable\s*\(\s*\"([^\"]*)\"\s*\)),\s*\"([^\"]*)\"\s*\)", line)
        if field_match:
            # Group 1 is for TextInput/Dropdown default text, Group 2 for FieldVariable default text, Group 3 is field name
            field_default_text = field_match.group(1) or field_match.group(2)
            field_name = field_match.group(3)
            
            message_parts.append(f"%{len(args_list) + 1}")
            arg_obj = {"type": "field_input", "name": field_name} # Simplified type, could be more specific
            if field_default_text:
                arg_obj["text"] = field_default_text
            args_list.append(arg_obj)

        # appendStatementInput
        statement_input_match = re.search(r"\.appendStatementInput\s*\(\s*\"([^\"]*)\"\s*\)(?:\.setCheck\s*\((?:\"([^\"]*)\"|\[\"([^\"]*)\"(?:,\s*\"([^\"]*)\")*\])\)\s*)?", line)
        if statement_input_match:
            input_name = statement_input_match.group(1)
            check_value = statement_input_match.group(2) or statement_input_match.group(3)
            
            message_parts.append(f"%{len(args_list) + 1}")
            arg_obj = {"type": "input_statement", "name": input_name}
            if check_value:
                # Handle single string check or array of strings
                if statement_input_match.group(2): # Single string
                    arg_obj["check"] = check_value
                elif statement_input_match.group(3): # Array, need to re-extract all
                    checks = re.findall(r"\"([^\"]*)\"", re.search(r"\[(\"([^\"]*)\"(?:,\s*\"([^\"]*)\")*)]", line).group(1))
                    arg_obj["check"] = checks
            args_list.append(arg_obj)

        # appendValueInput
        value_input_match = re.search(r"\.appendValueInput\s*\(\s*\"([^\"]*)\"\s*\)(?:\.setCheck\s*\((?:\"([^\"]*)\"|\[\"([^\"]*)\"(?:,\s*\"([^\"]*)\")*\])\)\s*)?", line)
        if value_input_match:
            input_name = value_input_match.group(1)
            check_value = value_input_match.group(2) or value_input_match.group(3)
            
            message_parts.append(f"%{len(args_list) + 1}")
            arg_obj = {"type": "input_value", "name": input_name}
            if check_value:
                if value_input_match.group(2): # Single string
                    arg_obj["check"] = check_value
                elif value_input_match.group(3): # Array, need to re-extract all
                    checks = re.findall(r"\"([^\"]*)\"", re.search(r"\[(\"([^\"]*)\"(?:,\s*\"([^\"]*)\")*)]", line).group(1))
                    arg_obj["check"] = checks
            args_list.append(arg_obj)


    if message_parts:
        block_data['message0'] = " ".join(message_parts)
    if args_list:
        block_data['args0'] = args_list

    # Previous/Next statement
    previous_statement_match = re.search(r"setPreviousStatement\((true|false|'[^']*'|null),\s*(null|'[^']*'|\[[^\]]*\])\)", init_function_code)
    if previous_statement_match:
        prev_type = previous_statement_match.group(2).strip()
        if prev_type == "null":
            block_data['previousStatement'] = None
        elif prev_type.startswith('['):
            block_data['previousStatement'] = [s.strip("'\"") for s in prev_type[1:-1].split(',')]
        else:
            block_data['previousStatement'] = prev_type.strip("'\"")
    else:
        block_data['previousStatement'] = None

    next_statement_match = re.search(r"setNextStatement\((true|false|'[^']*'|null),\s*(null|'[^']*'|\[[^\]]*\])\)", init_function_code)
    if next_statement_match:
        next_type = next_statement_match.group(2).strip()
        if next_type == "null":
            block_data['nextStatement'] = None
        elif next_type.startswith('['):
            block_data['nextStatement'] = [s.strip("'\"") for s in next_type[1:-1].split(',')]
        else:
            block_data['nextStatement'] = next_type.strip("'\"")
    else:
        block_data['nextStatement'] = None

    # Output
    output_match = re.search(r"setOutput\((true|false|'[^']*'|null),\s*(null|'[^']*'|\[[^\]]*\])\)", init_function_code)
    if output_match:
        output_type = output_match.group(2).strip()
        if output_type == "null":
            block_data['output'] = None
        elif output_type.startswith('['):
            block_data['output'] = [s.strip("'\"") for s in output_type[1:-1].split(',')]
        else:
            block_data['output'] = output_type.strip("'\"")
    else:
        block_data['output'] = None

    # Colour
    colour_match = re.search(r"setColour\('([^']*)'\)", init_function_code)
    if colour_match:
        block_data['colour'] = colour_match.group(1)

    # Tooltip
    tooltip_match = re.search(r"setTooltip\('([^']*)'\)", init_function_code)
    if tooltip_match:
        block_data['tooltip'] = tooltip_match.group(1)

    # HelpUrl
    help_url_match = re.search(r"setHelpUrl\('([^']*)'\)", init_function_code)
    if help_url_match:
        block_data['helpUrl'] = help_url_match.group(1)

    # setDeletable and setMovable
    deletable_match = re.search(r"setDeletable\((true|false)\)", init_function_code)
    if deletable_match:
        block_data['deletable'] = deletable_match.group(1) == 'true'

    movable_match = re.search(r"setMovable\((true|false)\)", init_function_code)
    if movable_match:
        block_data['movable'] = movable_match.group(1) == 'true'

    return block_data


def parse_blockly_js_to_json(js_content):
    """
    Parses JavaScript content containing Blockly.Blocks definitions
    and converts them into a list of JSON-compatible dictionaries.
    """
    json_blocks = []
    
    # Regex to find each Blockly.Blocks['BLOCK_TYPE'] definition
    block_pattern = re.compile(r"Blockly\.Blocks\[\s*'([^']*)'\s*\]\s*=\s*{([^}]*init: function\(\) {[^}]*})[^}]*}", re.DOTALL)
    
    for match in block_pattern.finditer(js_content):
        block_type = match.group(1)
        # Extract the entire content of the block definition to pass to init function parser
        block_definition_content = match.group(2)
        
        # Now, extract the init function content specifically
        init_content_match = re.search(r"init: function\(\) {(.+)}", block_definition_content, re.DOTALL)
        if init_content_match:
            init_code = init_content_match.group(1)
            parsed_data = parse_blockly_init_function(init_code)
            
            # Add type to the parsed data
            parsed_data['type'] = block_type
            json_blocks.append(parsed_data)
        else:
            print(f"Warning: Could not find init function for block type {block_type}")

    return json_blocks


if __name__ == "__main__":
    js_file_path = "web_ui/block_definitions.js" # Changed to relative path
    output_json_path = "tools/parsed_block_definitions.json" # Changed to relative path
    
    try:
        if not os.path.exists(js_file_path):
            print(f"Error: Input JS file not found at {js_file_path}. "
                  "This file should contain original Blockly block definitions.", file=sys.stderr)
            sys.exit(1)

        with open(js_file_path, 'r', encoding='utf-8') as f:
            js_content = f.read()
        
        parsed_blocks = parse_blockly_js_to_json(js_content)
        
        # Output to a JSON file for inspection
        with open(output_json_path, 'w', encoding='utf-8') as f:
            json.dump(parsed_blocks, f, indent=2)
        
        print(f"Successfully parsed {len(parsed_blocks)} blocks and saved to {output_json_path}")
    except Exception as e:
        print(f"An error occurred: {e}", file=sys.stderr)
        sys.exit(1)
