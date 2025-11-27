---
name: fixBug
description: Analyze and fix a bug in the codebase
argument-hint: The error message, behavior description, or steps to reproduce
---
Analyze and fix a bug in the Battlefield Portal Editor.

Context:
- The user is reporting an issue (crash, visual glitch, logic error).
- The project uses Python with Tkinter for the UI.
- Core logic is split between `Block_Editor.py` (Controller), `Block_Renderer.py` (View), `Block_Mover.py` (Interaction), and `Block_Data_Manager.py` (Model).

Task:
1.  **Analyze**: Read the relevant files to understand the current implementation.
2.  **Diagnose**: Identify the root cause of the issue.
3.  **Fix**: Apply the necessary code changes.
4.  **Verify**: Explain how to verify the fix (e.g., "Run the editor and try to spawn a block").

Input Variables:
- **Issue Description**: [Describe the bug]
- **Error Logs**: [Paste traceback if available]
- **Expected Behavior**: [What should happen?]

Output:
- Explanation of the bug.
- `replace_string_in_file` or `insert_edit_into_file` calls to fix it.
