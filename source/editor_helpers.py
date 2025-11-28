import tkinter as tk


def get_dropdown_items(block_data, tab_name):
    """Return a list of (key, label) for the given tab's dropdown items.

    This flattens the structure in the JSON so the UI can show human
    readable labels for each dropdown entry. This function is UI-agnostic
    and works directly with loaded `block_data` from `BlockDataManager`.
    """
    items = []
    data = block_data.get(tab_name, {})
    if not data:
        return items

    for section_key, section_val in data.items():
        if section_key == "color":
            continue

        if isinstance(section_val, dict):
            all_have_label = all(
                isinstance(v, dict) and "label" in v for v in section_val.values()
            )
            if all_have_label:
                for k, v in section_val.items():
                    items.append((k, v.get("label", k)))
            else:
                for cat, entries in section_val.items():
                    if isinstance(entries, dict):
                        for k, v in entries.items():
                            if isinstance(v, dict):
                                items.append((k, v.get("label", k)))
    return items


def serialize_workspace(all_blocks):
    """
    Creates a serializable dictionary from the live `all_blocks` state.
    Converts Tkinter variables to raw values and removes UI-specific objects.
    """
    serializable_blocks = {}
    for block_id, block_data in all_blocks.items():
        clean_data = {}
        for key, value in block_data.items():
            # Skip live UI objects that cannot be serialized
            if key in ['canvas_obj', 'widgets', 'widget_frame', 'widget_vars']:
                continue

            # Convert Tkinter variables to their raw values
            if isinstance(value, tk.Variable):
                clean_data[key] = value.get()
            # The 'args' dict in legacy blocks might contain tk.StringVar
            elif key == 'args' and isinstance(value, dict):
                 clean_data[key] = {k: v.get() if isinstance(v, tk.Variable) else v for k, v in value.items()}
            else:
                # Assume other types are serializable
                clean_data[key] = value
        
        serializable_blocks[block_id] = clean_data
    
    return serializable_blocks


def update_code_output(editor):
    """Populate `editor.code_output_text` with a simple preview of placed panels.

    Keeps logic out of the main UI file so it remains tidy. It expects the
    editor instance to have `placed_panels` and `code_output_text` attributes.
    """
    if not hasattr(editor, "code_output_text"):
        return

    lines = []
    for idx, p in enumerate(editor.placed_panels):
        tab = p.get("tab", "UNKNOWN")
        action = p.get("action_key")
        posx = p.get("x", 0)
        posy = p.get("y", 0)
        if action:
            lines.append(f"{idx+1}. {tab}:{action} @ ({posx},{posy})")
        else:
            lines.append(f"{idx+1}. {tab} @ ({posx},{posy})")

    content = "\n".join(lines) if lines else "(No placed panels yet)"

    editor.code_output_text.config(state=tk.NORMAL)
    editor.code_output_text.delete("1.0", tk.END)
    editor.code_output_text.insert("1.0", content)
    editor.code_output_text.config(state=tk.DISABLED)


def get_snapped_children(all_blocks, block_id):
    """
    Returns a list of all block IDs connected to the given block_id,
    including the block itself and all its descendants (vertical, nested, docked, and value inputs).
    """
    if block_id not in all_blocks:
        return []

    children = [block_id]
    block = all_blocks[block_id]

    # 1. Recursively get 'next' block (vertical chaining)
    next_id = block.get("next_block")
    if next_id:
        children.extend(get_snapped_children(all_blocks, next_id))

    # 2. Recursively get nested blocks (containers)
    if "nested_blocks" in block:
        for child_id in block["nested_blocks"]:
            children.extend(get_snapped_children(all_blocks, child_id))
            
    # 3. Recursively get docked blocks (horizontal chaining)
    if "docked_blocks" in block:
        for child_id in block["docked_blocks"]:
            children.extend(get_snapped_children(all_blocks, child_id))
    
    # 4. Recursively get parameter inputs (nested values)
    if "inputs" in block:
        for param_name, slot in block["inputs"].items():
            if slot.get("block"):
                children.extend(get_snapped_children(all_blocks, slot["block"]))
    
    # Remove duplicates just in case
    return list(dict.fromkeys(children))

def get_chain_ids(all_blocks, start_block_id):
    """
    Returns a list of block IDs in a vertical chain starting from start_block_id.
    """
    chain = []
    current_id = start_block_id
    while current_id and current_id in all_blocks:
        chain.append(current_id)
        current_id = all_blocks[current_id].get("next_block")
    return chain
