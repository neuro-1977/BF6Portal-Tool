import json
import re
from pathlib import Path

# Configuration
BLOCK_DEFS_PATH = Path('web_ui/src/blocks/bf6portal_expanded.ts')
GENERATORS_OUT_PATH = Path('web_ui/src/generators/bf6_generators.ts')

def generate_stubs():
    """Reads block definitions and generates TypeScript generator stubs."""
    try:
        with open(BLOCK_DEFS_PATH, 'r', encoding='utf-8') as f:
            content = f.read()

        # Robustly extract the JSON content manually (similar to fix_block_definitions.py)
        start_wrapper = """export const bf6PortalExpandedBlocks = Blockly.common.createBlockDefinitionsFromJsonArray(["""
        end_wrapper = """]);"""
        
        start_index = content.find(start_wrapper)
        end_index = content.rfind(end_wrapper)
        
        if start_index == -1 or end_index == -1:
            print("Error: Could not find TypeScript wrapper in bf6portal_expanded.ts")
            return
            
        json_array_str_raw = content[start_index + len(start_wrapper) : end_index].strip()
        
        # Extract blocks
        block_defs_str = re.findall(r'\{(?:[^\{\}]*|\{[^\{\}]*\})*?\}', json_array_str_raw, re.DOTALL)
        
        stubs = []
        
        header = """/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Order} from 'blockly/javascript';

export const bf6Generators: any = {};

"""
        stubs.append(header)

        for block_str in block_defs_str:
            try:
                block_json = json.loads(block_str)
                block_type = block_json.get('type')
                
                # Heuristic for checking if it's a statement or value block
                # (Based on our previous fixes, output property exists for values)
                is_value = 'output' in block_json and block_json['output'] is not None
                
                args = block_json.get('args0', [])
                arg_code_extraction = ""
                
                for arg in args:
                    name = arg.get('name')
                    arg_type = arg.get('type')
                    
                    if not name: continue
                    
                    if arg_type == 'input_value':
                        arg_code_extraction += f"  const {name.lower()} = generator.valueToCode(block, '{name}', Order.ATOMIC);\n"
                    elif arg_type == 'input_statement':
                        arg_code_extraction += f"  const {name.lower()} = generator.statementToCode(block, '{name}');\n"
                    elif arg_type == 'field_input' or arg_type == 'field_dropdown' or arg_type == 'field_checkbox':
                        arg_code_extraction += f"  const {name.lower()} = block.getFieldValue('{name}');\n"

                stub_code = f"bf6Generators['{block_type}'] = function(block: any, generator: any) {{\n"
                stub_code += arg_code_extraction
                
                if is_value:
                    # Value block return tuple
                    stub_code += f"  const code = `{block_type}(...)`;\n"
                    stub_code += f"  return [code, Order.NONE];\n"
                else:
                    # Statement block return string
                    stub_code += f"  const code = `{block_type}(...);\n`;\n"
                    stub_code += f"  return code;\n"
                
                stub_code += "};\n"
                stubs.append(stub_code)

            except json.JSONDecodeError:
                pass # Skip malformed
            except Exception as e:
                print(f"Error processing block: {e}")

        with open(GENERATORS_OUT_PATH, 'w', encoding='utf-8') as f:
            f.write("\n".join(stubs))
            
        print(f"Successfully generated stubs for {len(stubs)-1} blocks in {GENERATORS_OUT_PATH}")

    except Exception as e:
        print(f"Error in generate_stubs: {e}")

if __name__ == "__main__":
    generate_stubs()
