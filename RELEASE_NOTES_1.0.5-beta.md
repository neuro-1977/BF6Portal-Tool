# Release Notes - Version 1.0.5-beta (November 28, 2025)

This is a major feature release that significantly improves the core editing experience by introducing a full Undo/Redo system and implementing the critical Value Block Snapping feature.

## ✨ New Features

### 1. **Full Undo/Redo System**
A robust undo/redo service is now fully integrated into the editor, providing a critical safety net and improving workflow efficiency.
- **UI Controls**: "Undo" and "Redo" buttons are now available on the top toolbar.
- **Keyboard Shortcuts**: Standard `Ctrl+Z` (Undo) and `Ctrl+Y` (Redo) shortcuts are supported.
- **Reliable State**: The system correctly handles block creation, deletion, and movement, ensuring that all connections and block properties are properly restored.

### 2. **Typed Value Block Snapping**
The editor now supports one of the most critical features for building logic: snapping value blocks into the inputs of other blocks.
- **Drag-and-Drop Values**: Users can now drag blocks from the "VALUES", "LOGIC", or "MATH" categories and snap them directly into the parameter slots of other blocks.
- **Type-Safe Connections**: Parameter slots are now typed. A slot requiring a `Number` will only accept a `Number` block, preventing logical errors.
- **Visual Feedback**: The UI provides clear feedback during dragging. A **green highlight** appears over a compatible slot, while a **red highlight** appears over an incompatible one.
- **Live Input Validation**: "Number" blocks now validate input as you type. The field will turn red if a non-numeric value is entered.

## 🐛 Bug Fixes & Improvements
- **Refactoring**: Continued to modularize the codebase by improving the separation of concerns between the `Block_Renderer`, `Input_Handler`, and `Block_Mover`.
- **Unit Tests**: Added a new test suite for the block snapping logic to ensure its correctness and prevent regressions.

## Known Issues
- While the Undo/Redo system is robust, the "move" action currently only records the state of the head block in a chain. Undoing a move on a long chain may not restore all child positions perfectly in complex cases.
