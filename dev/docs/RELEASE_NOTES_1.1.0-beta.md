# Release Notes - Version 1.1.0-beta (November 28, 2025)

This is a stability and maintenance release that hardens the features implemented in `1.0.5-beta` and expands the project's test coverage.

## ✨ Improvements

### 1. **Increased Test Coverage**
- A new test suite for the **Undo/Redo Manager** (`tests/test_undo_manager.py`) has been added to verify the robustness of the undo/redo logic for creating, deleting, and moving blocks.
- A new test suite for **Workspace Serialization** (`tests/test_workspace_serialization.py`) has been added to ensure that saving and loading complex workspaces functions correctly without data loss.
- Existing tests for copy/paste and value snapping were fixed and verified.

### 2. **Bug Fixes & Refactoring**
- Fixed several latent bugs in the `UndoManager` and `workspace_loader` that were discovered during testing.
- Refactored `Block_Editor.py` by moving workspace utility functions into `editor_helpers.py` for better code organization.
- General cleanup of legacy code paths in the loader and IO handlers.

### 3. **Documentation**
- `IMPROVEMENTS.md` and `IMPLEMENTATION_STATUS.md` have been thoroughly updated to accurately reflect the current state of the project and all newly implemented features.
