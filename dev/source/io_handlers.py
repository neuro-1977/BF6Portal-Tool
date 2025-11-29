import tkinter as tk
from tkinter import filedialog
import json


def show_exported_json(editor):
    """Show export dialog with options."""
    # Simplified: Just ask for filename and save both
    base_path = filedialog.asksaveasfilename(
        title="Save Project",
        defaultextension=".json",
        filetypes=[("Portal Project", "*.json"), ("All Files", "*")],
        parent=editor.master
    )
    
    if not base_path:
        return
        
    # Remove extension if user typed one, to append correct ones
    if base_path.lower().endswith(".json"):
        base_path = base_path[:-5]
    elif base_path.lower().endswith(".txt"):
        base_path = base_path[:-4]
        
    success_msg = "Saved:\n"
    
    try:
        # Always save JSON (Project State)
        json_output = editor.data_manager.export_logic()
        json_path = base_path + ".json"
        with open(json_path, "w", encoding="utf-8") as f:
            f.write(json_output)
        success_msg += f"- {json_path}\n"
        
        # Always save Script (Compiled Code)
        if editor.code_generator:
            script_output = editor.code_generator.generate_code()
            script_path = base_path + ".txt"
            with open(script_path, "w", encoding="utf-8") as f:
                f.write(script_output)
            success_msg += f"- {script_path}\n"
        
        tk.messagebox.showinfo("Save Success", success_msg)
        
    except Exception as e:
        print(f"Export Error: {e}")
        import traceback
        traceback.print_exc()
        tk.messagebox.showerror("Export Error", f"Failed to export:\n{e}")


def show_import_dialog(editor):
    """Open a file dialog and import JSON into the editor.

    We keep the heavy parsing and workspace recreation inside the editor
    (load_blocks_from_json) but centralise the file dialog and JSON parsing
    here so the editor UI doesn't need to take responsibility for the OS
    file UI.
    """
    try:
        path = filedialog.askopenfilename(
            title="Import JSON",
            filetypes=[("JSON Files", "*.json"), ("All Files", "*")],
        )
        if not path:
            return

        with open(path, "r", encoding="utf-8") as fh:
            data = json.load(fh)

        # Call editor method to load blocks (UI code keeps workspace logic)
        if hasattr(editor, "load_blocks_from_json"):
            try:
                editor.load_blocks_from_json(data)
            except Exception as e:
                print(f"Load Error: {e}")
                import traceback
                traceback.print_exc()
                tk.messagebox.showerror("Load Error", f"Failed to load blocks:\n{e}")

    except Exception as e:
        # don't raise from file dialogs in the UI, keep it simple for now
        print(f"Import Error: {e}")
        import traceback
        traceback.print_exc()
        tk.messagebox.showerror("Import Error", f"Failed to import JSON:\n{e}")
