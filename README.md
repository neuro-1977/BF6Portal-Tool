# BF6Portal Tool

![Version](https://img.shields.io/badge/version-1.2.7-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

Release notes: see `docs/RELEASE_NOTES_1.2.7.md`.

**BF6Portal Tool** is a standalone visual logic editor for **Battlefield 6 Portal**, built with **Electron** + **Google Blockly**. It aims to replicate the Portal Rules Editor workflow in a desktop app, with offline editing and quality-of-life tooling.

## Features

- **Rules toolbox essentials:** a single **RULES** menu containing `MOD_BLOCK`, `RULE_HEADER`, and `CONDITION_BLOCK`.
- **Import compatibility:** loads Blockly JSON exports, including common community/template wrappers like `{ "mod": { ... } }`.
- **Resilient template loading:** missing block `type`s are auto-registered as **placeholder blocks** so templates can still render.
- **Presets:** 3 locked built-ins (Andy6170 templates) + user save/delete via `localStorage`.
- **Help modal + right-click help:** offline docs from `bf6portal_blocks.json` and per-block “Help: <type>”.
- **Code Preview drawer:** resizable bottom drawer showing a TypeScript export of the current workspace state.

## Installation & setup

### Prerequisites

- Node.js (v18+ recommended)
- Python 3.8+ (only needed for some helper scripts)

### Getting started

1) Clone:

```bash
git clone https://github.com/neuro-1977/BF6Portal-Tool.git
cd BF6Portal-Tool
```

2) Install dependencies:

```bash
npm install
cd web_ui
npm install
cd ..
```

3) Run the app:

```bash
npm start
```

## Development

The project has two main parts:

1) Electron main process: `electron-main.js`
2) Renderer (Blockly editor): `web_ui/` (TypeScript + webpack)

### Rebuild the renderer

```bash
cd web_ui
npm run build
```

### Build a Windows installer

```bash
npm run dist
```

The installer output is written to `dist/`.

## Helper scripts

Utilities live in `tools/` (used to generate/inspect blocks/toolboxes from Portal data).

## License

ISC
