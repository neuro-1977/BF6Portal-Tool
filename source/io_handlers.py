import tkinter as tk
from tkinter import filedialog
import json


def show_exported_json(editor):
    """Save exported JSON content to a file.

    This is extracted out of the main UI class to keep I/O concerns separate
    from the editor's UI logic.
    """
    try:
        json_output = editor.data_manager.export_logic()

        path = filedialog.asksaveasfilename(
            title="Export Workspace",
            defaultextension=".json",
            filetypes=[("JSON Files", "*.json"), ("All Files", "*")],
        )
        
        if not path:
            return

        with open(path, "w", encoding="utf-8") as f:
            f.write(json_output)
            
        tk.messagebox.showinfo("Export Success", f"Workspace saved to:\n{path}")

    except Exception as e:
        # Fail silently in the UI if something goes wrong — the editor has
        # safe guards around I/O operations and tests will cover behaviour.
        print(f"Export Error: {e}")
        import traceback
        traceback.print_exc()
        tk.messagebox.showerror("Export Error", f"Failed to export JSON:\n{e}")


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
            editor.load_blocks_from_json(data)

    except Exception as e:
        # don't raise from file dialogs in the UI, keep it simple for now
        print(f"Import Error: {e}")
        import traceback
        traceback.print_exc()
        tk.messagebox.showerror("Import Error", f"Failed to import JSON:\n{e}")
