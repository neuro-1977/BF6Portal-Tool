---
name: createNewBlock
description: Generate the JSON definition and Python logic for a new block
argument-hint: The name of the block, its category, and its inputs/functionality
---
Create a new block definition for the Battlefield Portal Editor.

Context:
- The user wants to add a new block to the editor.
- Blocks are defined in JSON files in `assets/` (e.g., `assets/actions/action_data.json`).
- Blocks may require rendering logic in `source/Block_Renderer.py` or shape definitions in `source/block_shapes.py`.

**Block Type Guidelines:**
- **ACTIONS / CONDITIONS**: Must be defined as horizontal blocks. Use `type: "ACTIONS"` or `type: "CONDITIONS"`.
- **RULES**: Container block.
- **Inputs**: Use "Portal Style" inputs where parameters are slots inside the block body.

Task:
1.  **JSON Definition**: Generate the JSON entry for the new block.
    -   Include `label`, `type`, `args` (inputs), `widgets` (dropdowns/text fields), and `color`.
    -   Specify which file this JSON should go into based on the category (e.g., ACTIONS, LOGIC).
2.  **Python Logic (if needed)**:
    -   If the block requires special handling (e.g., dynamic inputs, custom shape), provide the Python code for `Block_Renderer.py` or `Block_Editor.py`.
3.  **Verification**: Explain how to verify the block appears in the menu.

Input Variables:
- **Block Name**: [Name of the block, e.g., "Teleport Player"]
- **Category**: [Category, e.g., "ACTIONS", "MATH"]
- **Inputs**: [List of inputs, e.g., "Player", "Position", "Rotation"]
- **Type**: [Block type, e.g., "STATEMENT", "VALUE", "CONTAINER"]

Output:
- Provide the JSON snippet.
- Provide any necessary Python code changes.
