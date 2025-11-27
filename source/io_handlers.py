import tkinter as tk
from tkinter import filedialog
import json


def show_exported_json(editor):
    """Show export dialog with options."""
    dialog = tk.Toplevel(editor.master)
    dialog.title("Export Options")
    dialog.geometry("300x250")
    dialog.configure(bg="#2d2d2d")
    
    tk.Label(dialog, text="Select Export Formats", bg="#2d2d2d", fg="white", font=("Arial", 12, "bold")).pack(pady=10)
    
    var_json = tk.BooleanVar(value=True)
    var_script = tk.BooleanVar(value=False)
    
    c1 = tk.Checkbutton(dialog, text="Workspace JSON (.json)", variable=var_json, bg="#2d2d2d", fg="white", selectcolor="#444", activebackground="#2d2d2d", activeforeground="white")
    c1.pack(anchor="w", padx=20, pady=5)
    
    c2 = tk.Checkbutton(dialog, text="Portal Script (.txt)", variable=var_script, bg="#2d2d2d", fg="white", selectcolor="#444", activebackground="#2d2d2d", activeforeground="white")
    c2.pack(anchor="w", padx=20, pady=5)
    
    def do_export():
        if not var_json.get() and not var_script.get():
            tk.messagebox.showwarning("Export", "Please select at least one format.")
            return
            
        base_path = filedialog.asksaveasfilename(
            title="Export Workspace",
            defaultextension="", # No default extension, we append based on selection
            filetypes=[("All Files", "*")],
            parent=dialog
        )
        
        if not base_path:
            return
            
        # Remove extension if user typed one, to append correct ones
        if base_path.lower().endswith(".json"):
            base_path = base_path[:-5]
        elif base_path.lower().endswith(".txt"):
            base_path = base_path[:-4]
            
        success_msg = "Exported:\n"
        
        try:
            if var_json.get():
                json_output = editor.data_manager.export_logic()
                json_path = base_path + ".json"
                with open(json_path, "w", encoding="utf-8") as f:
                    f.write(json_output)
                success_msg += f"- {json_path}\n"
                
            if var_script.get():
                if editor.code_generator:
                    script_output = editor.code_generator.generate_code()
                    script_path = base_path + ".txt"
                    with open(script_path, "w", encoding="utf-8") as f:
                        f.write(script_output)
                    success_msg += f"- {script_path}\n"
            
            tk.messagebox.showinfo("Export Success", success_msg)
            dialog.destroy()
            
        except Exception as e:
            print(f"Export Error: {e}")
            import traceback
            traceback.print_exc()
            tk.messagebox.showerror("Export Error", f"Failed to export:\n{e}")

    tk.Button(dialog, text="Export", command=do_export, bg="#4CAF50", fg="white", font=("Arial", 10, "bold")).pack(pady=20)


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
