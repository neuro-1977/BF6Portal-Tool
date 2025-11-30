# BF6 Portal Tool - Concept Art & Visual Style

## Overview
The BF6 Portal Tool is transitioning to a **Blockly-based Web Interface**. This move aims to replicate the "clean palette" and intuitive "puzzle piece" interaction model of modern visual programming environments.

## Visual Style Guide

### 1. The "Puzzle" Aesthetic
- **Connectors**: All Action and Sequence blocks feature standard "puzzle piece" notches (Top/Bottom) to indicate execution flow.
- **Values**: Value blocks (Math, Logic, Variables) use "jigsaw" side connectors (Left/Output) to plug into parameters.
- **Hats**: Event and Rule blocks use "Hat" tops to indicate they are the starting point of a logic chain.

### 2. Block Sizing
- **Scale**: Blocks are rendered at **0.75x** scale to fit more logic on the screen, matching the density of complex logic editors.
- **Compactness**: Fields (Text, Number) are integrated directly into the block rows to minimize vertical space.

### 3. Color Palette
Blocks are color-coded by category to match the official Battlefield Portal editor where possible:
- **Rules/Events**: Orange (`#FF8F00`)
- **Actions/Logic**: Blue (`#0277BD`)
- **Math**: Dark Blue (`#1565C0`)
- **Values**: Light Blue/Teal
- **Subroutines**: Purple

### 4. UI Layout
- **Dark Theme**: The editor runs in a high-contrast Dark Mode (`#1e1e1e` background) to reduce eye strain.
- **Toolbox**: A categorized sidebar on the left provides access to all block types, organized by functionality (Math, Logic, Gameplay, etc.).

## Reference Implementation
The current implementation uses the **Google Blockly 'Geras' Renderer**, which provides the classic, high-fidelity puzzle piece look requested.
