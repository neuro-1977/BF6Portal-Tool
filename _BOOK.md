# ARTIFACT: KNOWLEDGE_BASE (_BOOK.md)

**Status**: ACTIVE
**Version**: 1.3.0
**Purpose**: Consolidated Documentation

> "I don't care what you believe in, just believe in it." — Shepherd Book

## 📖 Table of Contents

1. [The Word (Overview)](#the-word-overview)
2. [The Vision (Roadmap)](#the-vision-roadmap)
3. [The Inner Workings (Internals)](#the-inner-workings-internals)
4. [The Rules (Core Protocols)](#the-rules-core-protocols)

---

## The Word (Overview)

**Serenity** is a visual programming environment for creating Discord bots using Blockly. It features a Neural Link to `serenity.db`, real-time deployment, and comprehensive Discord logging.

### 🚀 Quick Start

1. **Run Everything**: Right-click `_WORKSPACE-START.ps1` -> **Run with PowerShell**.
2. **Access Web UI**: `http://localhost:3000`.
3. **Program**: Drag blocks to create logic.
4. **Deploy**: Click "Deploy to IslaMao".

### 📂 Project Structure

- `web_ui/`: React/Blockly frontend.
- `Bots/`: Discord bot client (IslaMao).
- `tools/`: Nervous System and Brain utilities.
- `SavedWorkspaces/`: Preset configurations.
- `serenity.db`: The Brain (Scripts, Docs, Logs).

---

## The Vision (Roadmap)

**Master Vision**: Serenity is the master workspace and data catalog for all block-based logic, analytics, and creative workflows.

### Core Principles

1. **Serenity is Master**: `serenity.db` is the single source of truth.
2. **Brain Logic**: Documentation is centralized and always up to date.
3. **Captain First**: Respect the Captain's Log and user instructions.
4. **No Legacy**: Deprecated workflows are removed.

### 🎯 Goals

- Modern UI/UX ("Awesome" window UI).
- Seamless Integration (Block -> DB -> Bot).
- Robust Backend (Self-healing).

---

## The Inner Workings (Internals)

### 🏗️ Core Components

- **Web UI**: `blockly-workspace/src/server.ts` (NeDB/SQLite backend).
- **Bots**: `Bots/discord-bot.js` (Discord.js v14).
- **Brain**: `serenity.db` (SQLite).

### 🧩 Integration Points

- **API**: `/api/serenity/help`, `/api/presets`, `/api/deploy`.
- **Startup**: `_WORKSPACE-START.ps1` orchestrates all services.

---

## The Rules (Core Protocols)

*See `CORE_RULES.md` for the full list of AI Agent protocols.*

1. **Brain is Truth**: Refer to `_BOOK.md` and `_BATTLE_PLAN.md`.
2. **Sync Workspaces**: Keep `Serenity` and `BF6Portal Tool` aligned.
3. **Captain First**: Always consult the Captain before major changes.

_Last updated: 2025-12-01_
