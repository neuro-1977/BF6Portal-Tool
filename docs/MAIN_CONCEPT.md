# Main Concept & Design Philosophy

**Last Updated:** November 27, 2025

## Core Philosophy
The BF6 Portal Tool aims to replicate the **Battlefield Portal Web Editor** experience as a standalone desktop application. It should feel familiar to users of the web tool while offering the benefits of a local application (offline use, file management, faster workflow).

## UI/UX Design
- **Sidebar**: Mimic the online portal system.
  - High-level categories (Rules, Logic, Math, etc.) on the left.
  - Clicking a category opens a "flyout" or sub-menu containing the spawnable blocks.
  - Only the sub-menus/blocks should carry the specific category colors.
  - Minimalist icon usage to avoid clutter.
- **Canvas**: Infinite scrolling grid.
- **Blocks**:
  - "Flush" design (rounded rectangles, no puzzle tabs).
  - Snap indicators (lines) instead of receptors.
  - Color-coded by category.

## Functional Requirements
1.  **File Management**:
    - **Save**: Saves the project state (JSON) AND exports the script code (TXT/JS) simultaneously.
    - **Extensions**: `.json` for project files, `.txt` (or custom) for compiled code.
2.  **Block Logic**:
    - **Rules**:
        - Can exist as top-level blocks (multiple rules allowed).
        - Can be "disconnected" (valid top-level entry points).
        - Can be referenced inside other blocks (Rule Reference).
    - **Subroutines**: Similar to rules, can be defined and called.
3.  **Analysis**:
    - Disconnected Rule blocks are VALID (they are entry points).
    - Warnings should focus on actual logic errors, not valid structural patterns.

## Current Priorities
1.  Fix Double Spawning bug in Sidebar.
2.  Fix Right-Click Delete functionality.
3.  Ensure Rule blocks render correctly (with name inputs).
4.  Fix Export/Save errors and implement dual-file saving.
5.  Update Workspace Analyzer to accept disconnected Rules.
