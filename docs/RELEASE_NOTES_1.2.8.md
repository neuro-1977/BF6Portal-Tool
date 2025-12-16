# Release Notes - v1.2.8

## Features & Improvements
- **Refined Toolbox Structure:** The Blockly toolbox has been reorganized to better match the official Battlefield Portal Rules Editor layout.
    - Added distinct "Yellow" (Actions/Statements) and "Green" (Values/Expressions) categories for clearer distinction.
    - Categories now include: AI, ARRAYS, AUDIO, CAMERA, EFFECTS, EMPLACEMENTS, GAMEPLAY, LOGIC, OBJECTIVE, OTHER, PLAYER, TRANSFORM, USER INTERFACE, VEHICLES.
    - Dedicated sections for SELECTION LISTS, LITERALS, VARIABLES, SUBROUTINES, and CONTROL ACTIONS.
    - Restored standard Blockly categories (Logic, Loops, Math, Text, Lists, Colour) under a "Home" menu for extended functionality.
- **Project Migration:** Repository migrated to GitLab.
    - Updated CI/CD pipeline (`.gitlab-ci.yml`) to support automated Windows builds using `electronuserland/builder:wine`.
    - Automated release generation on tag push.

## Fixes
- **Toolbox Loading:** Fixed a critical issue where the toolbox would fail to load ("missing toolbox error") by ensuring the application bundle is correctly injected into the HTML.
- **Scrollbar Styling:** Applied CSS fixes to suppress unwanted scrollbars on the toolbox container (work in progress).

## Known Issues
- A persistent vertical scrollbar may still appear next to the toolbox flyout in certain states. This is tracked for a future fix.
