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
