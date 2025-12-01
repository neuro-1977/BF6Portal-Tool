# BF6Portal Tool: Custom Battlefield Portal Block Editor

This project is a modern, custom block-based editor for Battlefield Portal logic, featuring a robust, branded web UI with full Blockly integration.

**Main Task:** Maintain a clean and functional Blockly development environment. The `web_ui` folder contains the primary application, and the goal is to ensure a stable and default Blockly experience for further development.

## Features

-   Modern web UI with a clean, dark-themed interface.
-   A default Blockly toolbox with all the standard blocks.
-   A full-screen canvas with grid lines, zoom controls, and a trashcan.
-   A modular and well-organized project structure.

## Getting Started

1.  **Install dependencies:** `pip install -r requirements.txt`
2.  **Generate Blockly definitions and toolbox:** `python DEV/tools/generate_blockly_defs.py`
3.  **Run the web server:** `python -m http.server 8000 --directory web_ui`
4.  **Open your browser** to `http://localhost:8000`.

## Project Structure

-   **`/` (Root):** Contains essential project files like `README.md`, `requirements.txt`, and core configuration files.

-   **`/assets`:** Contains static assets used by the application, such as images and fonts.

-   **`/backups`:** Contains backups of important files and folders.

-   **`/DEV`:** Contains development tools and scripts.

-   **`/docs`:** Contains documentation and other non-code text files.

-   **`/knowledgebase`:** A directory for storing project-related information, notes, and unsorted assets.

-   **`/scripts`:** Contains utility scripts for running the application and other tasks.

-   **`/source`:** Contains the main Python source code for the application.

-   **`/tests`:** Contains tests for the Python source code.

-   **`/web_ui`:** Contains the main web application, including the Blockly editor.



## Current Status and Next Steps



**STATUS UPDATE (2025-11-30):**

The primary focus is now on establishing a clean, default Blockly environment. Custom UI elements have been removed to facilitate a fresh start. The next steps involve methodically re-implementing features on top of a stable Blockly foundation.



### Next Steps

- Gradually re-introduce custom features and UI elements.

- Ensure all new features are built on top of the stable Blockly foundation.

- Update documentation in real-time as changes are made.



## Version History

-   **1.0.4Beta:** Clean start. Re-organized project structure, and restored a default Blockly experience.

## License

This project is licensed under the MIT License.