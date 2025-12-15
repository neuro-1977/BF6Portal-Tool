# BF6 Portal Tool

![Version](https://img.shields.io/badge/version-1.2.4-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

**BF6 Portal Tool** is a powerful, standalone visual logic editor for **Battlefield 6 Portal**, built using **Electron** and **Google Blockly**. It replicates the official Rules Editor experience in a desktop application, allowing fo
r offline development, easier management of complex logic, and custom extensions.
## ?? Features

*   **Authentic Interface:** Fully recreated Toolbox menu structure matching the official Battlefield Portal editor (Rules, AI, Vectors, Gameplay, etc.).
*   **Visual Scripting:** Intuitive drag-and-drop block interface powered by Blockly.
*   **Comprehensive Block Library:** Includes hundreds of blocks for Game Modes, AI logic, Math, Event Payloads, and more.
*   **Validation:** Visual cues for Statement (Yellow) vs. Value (Green) block connections.
*   **Desktop Power:** Runs as a native application on Windows (Electron-based).
*   **Maintenance Tools:** Includes a suite of Python scripts to auto-generate and update block definitions from data sources.

## ??? Installation & Setup

### Prerequisites

*   **Node.js** (v18 or higher)
*   **Python 3.8+** (required only for running maintenance scripts in 	ools/)

### Getting Started

1.  **Clone the repository:**
    `ash
    git clone https://github.com/neuro-1977/BF6Portal-Tool.git
    cd BF6Portal-Tool
    `

2.  **Install dependencies:**
    `ash
    # Install Electron dependencies
    npm install

    # Install Web UI dependencies
    cd web_ui
    npm install
    cd ..
    `

3.  **Run the Application:**
    `ash
    npm start
    `

## ??? Development

The project consists of two main parts:
1.  **Electron Main Process:** Handles the app window and file system operations (electron-main.js).
2.  **Web UI:** The Blockly editor, built with TypeScript and Webpack (web_ui/).

### Rebuilding the Editor
If you make changes to web_ui/src, you must rebuild the renderer bundles:

`ash
cd web_ui
npm run build
`

### Building for Production
To create a standalone executable (.exe):

`ash
npm run dist
`
The output will be located in the dist/ directory.

## ?? Helper Scripts

This repository includes a robust set of Python tools in the 	ools/ directory to help manage the thousands of block definitions.

*   generate_toolbox_v2.py: Regenerates the Toolbox layout.
*   ill_toolbox_gaps.py: Finds and adds missing blocks to the menu.
*   update_blocks_db.py: Syncs TypeScript definitions with the local database.

?? **See [docs/SCRIPTS.md](docs/SCRIPTS.md) for full usage instructions.**

## ?? Contributing

We welcome contributions! Please follow our development workflow:

*   **main**: Stable, production-ready code.
*   **develop**: Integration branch for new features.

?? **See [docs/WORKFLOW.md](docs/WORKFLOW.md) for branching strategy and release process.**

## ?? License

This project is licensed under the **ISC License**.
