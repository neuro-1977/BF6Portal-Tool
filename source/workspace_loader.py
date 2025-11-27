import tkinter as tk
from editor_helpers import update_code_output


def load_blocks_from_json(editor, imported_data):
    """Move BlockEditor.load_blocks_from_json implementation here.

    This function operates against the provided `editor` instance so the
    heavy logic lives outside the UI class and can be unit‑tested more
    easily.
    """
    try:
        # -----------------------------------------------------------------
        # 1️⃣  Reset the canvas and internal structures
        # -----------------------------------------------------------------
        editor.canvas.delete("all")
        editor.all_blocks.clear()
        editor.placed_panels.clear()

        # -----------------------------------------------------------------
        # 2️⃣  Restore rule‑state variables (StringVars and plain values)
        # -----------------------------------------------------------------
        rule_state = imported_data.get("rule_state", {})
        if rule_state:
            # StringVar based fields
            for key, tk_var_type in [
                ("rule_name", tk.StringVar),
                ("event_type", tk.StringVar),
            ]:
                if key in rule_state and key in editor.rule_state:
                    if isinstance(editor.rule_state[key], tk_var_type):
                        editor.rule_state[key].set(rule_state[key])
                    else:
                        editor.rule_state[key] = rule_state[key]

            # Plain‑value fields
            for key in [
                "mod_id",
                "rule_id",
                "first_condition_id",
                "first_action_id",
            ]:
                if key in rule_state:
                    editor.rule_state[key] = rule_state[key]

        # -----------------------------------------------------------------
        # 3️⃣  Load raw block definitions
        # -----------------------------------------------------------------
        imported_blocks_raw = imported_data.get("blocks", {})
        
        # Handle Portal-style JSON (list of blocks) vs Editor-style JSON (dict of blocks)
        is_portal_json = False
        if "mod" in imported_data and "blocks" in imported_data["mod"]:
            # Official Portal JSON structure
            print("Detected Official Portal JSON format")
            imported_blocks_raw = imported_data["mod"]["blocks"]["blocks"]
            is_portal_json = True
        elif isinstance(imported_blocks_raw, list):
             # List format (could be Portal blocks list directly)
             is_portal_json = True
        
        if not imported_blocks_raw and not is_portal_json:
             # Try to find blocks in root if "blocks" key is missing
             # This supports the "Export Workspace" format if it dumps the dict directly
             if "block_0" in imported_data or any(k.startswith("block_") for k in imported_data.keys()):
                 imported_blocks_raw = imported_data

        if not imported_blocks_raw:
            print("Warning: No blocks found in imported JSON.")
            return

        if is_portal_json:
            _import_portal_blocks(editor, imported_blocks_raw)
            # Skip the standard loading loop below
        else:
            # Determine the highest numeric block id so we can continue generating new ones
            max_id_num = 0
            for block_id_str in imported_blocks_raw.keys():
                try:
                    # Expected format: "block_42" → extract the numeric part
                    id_num = int(block_id_str.split("_")[1])
                    if id_num > max_id_num:
                        max_id_num = id_num
                except (ValueError, IndexError):
                    # Silently ignore malformed ids – they simply won’t affect the counter
                    pass
            editor.current_id = max_id_num

            # -----------------------------------------------------------------
            # 4️⃣  First pass – build the internal block dictionaries and restore
            #      any dynamic block definitions
            # -----------------------------------------------------------------
            for block_id, block_data in imported_blocks_raw.items():
                block_type = block_data.get("type")
                label = block_data.get("label")
                action_key = block_data.get("action_key")

                # Re‑register dynamic blocks that were created at runtime in the original
                # workspace (needed for proper rendering of custom actions)
                if action_key and block_type:
                    editor.data_manager.add_dynamic_block_definition(
                        block_type, action_key, label
                    )

                # Convert plain argument values into tk.StringVar instances so the UI
                # can bind to them directly.
                args_with_tkvars = {
                    k: tk.StringVar(value=v) for k, v in block_data.get("args", {}).items()
                }

                # Populate the master block dictionary used by the editor
                editor.all_blocks[block_id] = {
                    "id": block_id,
                    "label": label,
                    "type": block_type,
                    "color": block_data.get(
                        "color",
                        editor.data_manager.palette_color_map.get(block_type, "#CCCCCC"),
                    ),
                    "x": block_data.get("x", 10),
                    "y": block_data.get("y", 10),
                    "width": block_data.get("width", editor.CHILD_BLOCK_WIDTH),
                    "height": block_data.get("height", editor.CHILD_BLOCK_HEIGHT),
                    "canvas_obj": None,
                    "widgets": [],
                    "parent_id": block_data.get("parent_id"),
                    "next_sibling_id": block_data.get("next_sibling_id"),
                    "args": args_with_tkvars,
                }

        # -----------------------------------------------------------------
        # 5️⃣  Second pass – draw every block on the canvas and update its

        # -----------------------------------------------------------------
        # 5️⃣  Second pass – draw every block on the canvas and update its
        #      visual position
        # -----------------------------------------------------------------
        # OPTIMIZATION: Defer updates to prevent UI freeze during massive drawing
        # Tkinter doesn't have a 'suspend layout' but we can avoid update_idletasks
        
        # Batch drawing: Process in chunks to keep UI responsive-ish
        # For now, just do it all but maybe print progress
        total_blocks = len(editor.all_blocks)
        print(f"Drawing {total_blocks} blocks...")
        
        count = 0
        for block_id in editor.all_blocks:
            editor.draw_block(block_id)
            editor.update_block_position(block_id)
            count += 1
            if count % 50 == 0:
                # Yield to UI loop every 50 blocks to prevent "Not Responding"
                editor.master.update()

        # -----------------------------------------------------------------
        # 6️⃣  Re‑assemble the hierarchy (roots → chains) and redraw each chain
        # -----------------------------------------------------------------
        child_blocks_ids = {
            block.get("next_sibling_id")
            for block in editor.all_blocks.values()
            if block.get("next_sibling_id")
        }
        root_blocks_ids = [
            bid
            for bid, block in editor.all_blocks.items()
            if block.get("parent_id") is None and bid not in child_blocks_ids
        ]

        for root_id in root_blocks_ids:
            editor.redraw_chain(root_id)

        # -----------------------------------------------------------------
        # 7️⃣  Adjust scroll region & scrollbars
        # -----------------------------------------------------------------
        # Get bbox of all blocks, but ensure minimum scrollregion for grid visibility
        bbox = editor.canvas.bbox("all")
        if bbox:
            # Expand scrollregion to be at least 5000x5000 or encompass all blocks
            min_width = 5000
            min_height = 5000
            actual_width = max(bbox[2], min_width)
            actual_height = max(bbox[3], min_height)
            editor.canvas.configure(scrollregion=(0, 0, actual_width, actual_height))
        else:
            editor.canvas.configure(scrollregion=(0, 0, 5000, 5000))
        editor.update_scrollbars()

        # -----------------------------------------------------------------
        # 8️⃣  Refresh the generated code view
        # -----------------------------------------------------------------
        update_code_output(editor)

        # Center view and redraw grid now that scrollregion is properly set
        try:
            editor.center_canvas_view()
        except Exception:
            pass
        try:
            editor.draw_grid()
        except Exception:
            pass

    except (KeyError, AttributeError, tk.TclError) as e:
        # Log the problem but keep the UI responsive; malformed files shouldn't
        # crash the whole editor.
        print(f"Error loading workspace: {e}")
        # The canvas remains cleared – the user can retry with a corrected file.

def _import_portal_blocks(editor, portal_blocks):
    """
    Parses official Portal JSON structure and converts it to our internal block format.
    This is a recursive process as Portal blocks are nested.
    """
    print(f"Importing {len(portal_blocks)} root blocks from Portal JSON...")
    
    # 1. Build Lookup Map from loaded definitions
    # This allows us to find the correct Category and Definition for a Portal Type
    portal_type_map = {}
    for cat_name, cat_data in editor.data_manager.block_data.items():
        sub_cats = cat_data.get("sub_categories", {})
        for sub_name, blocks in sub_cats.items():
            for block_name, block_def in blocks.items():
                portal_type_map[block_name] = {
                    "category": cat_name,
                    "def": block_def
                }

    def get_next_id():
        return editor.get_new_block_id()

    def process_block(block_data, parent_id=None, x=0, y=0, is_value=False):
        portal_type = block_data.get("type")

        # Default values
        my_type = "SEQUENCE"
        label = portal_type
        color = editor.data_manager.palette_color_map.get(my_type, "#555555")

        # Lookup definition
        if portal_type in portal_type_map:
            mapping = portal_type_map[portal_type]
            block_def = mapping["def"]
            my_type = mapping["category"]
            label = block_def.get("label", portal_type)
            color = editor.data_manager.palette_color_map.get(my_type, "#555555")
        else:
            # Heuristic for unknown blocks
            if is_value:
                my_type = "VALUE"
            if "Rule" in portal_type:
                my_type = "RULES"
            elif "Event" in portal_type:
                my_type = "EVENTS"
            elif "Condition" in portal_type:
                my_type = "CONDITIONS"
            elif "Action" in portal_type:
                my_type = "ACTIONS"
            # If still not found, mark as unknown visually
            if portal_type not in portal_type_map:
                my_type = "UNKNOWN"
                label = f"Unknown Block: {portal_type}"
                color = "#FF5555"  # Bright red for unmatched blocks

        # Special handling for specific Portal blocks
        if portal_type == "ruleBlock":
            fields = block_data.get("fields", {})
            label = fields.get("NAME", "Rule")
            my_type = "RULES"
            color = editor.data_manager.palette_color_map.get(my_type, "#555555")
        elif portal_type == "modBlock":
            my_type = "MOD"
            color = editor.data_manager.palette_color_map.get(my_type, "#555555")
        elif portal_type == "subroutineBlock":
            fields = block_data.get("fields", {})
            label = fields.get("SUBROUTINE_NAME", "Subroutine")
            my_type = "SUBROUTINE"
            color = editor.data_manager.palette_color_map.get(my_type, "#555555")

        bid = get_next_id()

        # Prepare Args
        args_dict = {}

        # 1. Process Fields (Literals)
        fields = block_data.get("fields", {})
        for f_name, f_val in fields.items():
            args_dict[f_name] = tk.StringVar(value=str(f_val))

        # 2. Process Inputs (Nested Blocks)
        inputs = block_data.get("inputs", {})
        for input_name, input_data in inputs.items():
            if "block" in input_data:
                child_block_data = input_data["block"]
                child_type = child_block_data.get("type")
                if child_type == "variableReferenceBlock":
                    var_name = child_block_data.get("fields", {}).get("NAME", "Var")
                    args_dict[input_name] = tk.StringVar(value=var_name)
                else:
                    child_id = process_block(child_block_data, parent_id=bid, x=x+20, y=y+20, is_value=True)
                    args_dict[input_name] = tk.StringVar(value="...")

        # Create the block entry
        width = editor.CHILD_BLOCK_WIDTH
        height = editor.CHILD_BLOCK_HEIGHT
        if is_value:
            width = 150
            height = 30
        if portal_type in portal_type_map:
            def_width = portal_type_map[portal_type]["def"].get("width")
            if def_width:
                width = def_width

        editor.all_blocks[bid] = {
            "id": bid,
            "label": label,
            "type": my_type,
            "color": color,
            "x": block_data.get("x", x),
            "y": block_data.get("y", y),
            "width": width,
            "height": height,
            "canvas_obj": None,
            "widgets": [],
            "parent_id": parent_id,
            "next_sibling_id": None,
            "args": args_dict,
        }

        # Process Next (Sequence)
        next_block_data = block_data.get("next", {}).get("block")
        if next_block_data:
            next_x = x
            next_y = y + height + 5
            if my_type in ["CONDITIONS", "ACTIONS"]:
                next_x = x + width
                next_y = y
            next_id = process_block(next_block_data, parent_id=None, x=next_x, y=next_y, is_value=False)
            editor.all_blocks[bid]["next_sibling_id"] = next_id
        return bid

    # Process all root blocks
    # Portal JSON usually has a list of root blocks (Mod, Rules, Subroutines)
    current_y = 50
    for block in portal_blocks:
        process_block(block, x=50, y=current_y)
        current_y += 150 # Space out root blocks

