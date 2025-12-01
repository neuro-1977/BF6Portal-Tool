# Gemini CLI Settings

This file contains settings and notes for the Gemini CLI.

## Instructions for Gemini

- The user wants me to run long-running tasks, like a web server, in a separate terminal or in the background so that the main terminal is not blocked. For Windows, I should use 'Start-Process' in PowerShell.
- Before any refactoring, I must do an extensive analysis of all necessary documentation rewrites and update the documentation first.
- Whenever making changes, especially refactoring, I must never break Blockly. If a fix is found, I should ensure it's stable and verified before implementing. I should prioritize not breaking the existing functionality.

## Auto-accept Shell Requests (Note)

For security reasons, the Gemini CLI does not support automatically accepting all shell commands. Each command that can modify your system requires explicit confirmation. This is a safety feature to prevent unintended changes to your files and system.

## Project Vision and Current Focus (from PROMPT.md)

**MAIN TASK: Maintain a clean and functional Blockly development environment. The `web_ui` folder contains the primary application, and the goal is to ensure a stable and default Blockly experience for further development.**

This file is the single source of truth for all workflow, instructions, and project vision. Always check this file and the main memory file first.

### Master Prompt: UI/UX and Refactor Plan 

**STATUS UPDATE (2025-11-30):**
The primary focus is now on establishing a clean, default Blockly environment. Custom UI elements have been removed to facilitate a fresh start. The next steps involve methodically re-implementing features on top of a stable Blockly foundation.

### Next Steps
- Gradually re-introduce custom features and UI elements.
- Ensure all new features are built on top of the stable Blockly foundation.
- Update documentation in real-time as changes are made.