# ARTIFACT: TASK_LIST (_BATTLE_PLAN.md)

**Status**: ACTIVE
**Version**: 1.3.0
**Purpose**: Master Task List & Roadmap

## Current Version: v1.3.0 (Unified Workspace)

### 🚀 Active Objectives

- [ ] **Restore BF6 Portal Integration** (Workflow: `restore_bf6`)
  - [ ] Analyze Legacy Assets (`block_definitions.js`, `toolbox.js`).
  - [ ] Sync Blocks to `bf6portal.ts`.
  - [ ] Sync Toolbox to `toolbox.ts`.
  - [ ] Verify UI ("Sliding Neural Link").
- [ ] **Refactor Documentation**
  - [x] Consolidate root docs to `_` prefix (Brain Logic).
  - [ ] Update `CaptainsLog`.

### ✅ Completed Features (Serenity)

- [x] **Core Visual Programming**
  - [x] Blockly-based bot programming interface.
  - [x] Discord.js custom blocks (reply, persona say, message content).
  - [x] Real-time deployment to IslaMao bot.
  - [x] Verify end-to-end flow (Block -> DB -> Bot).
  - [x] Document system in `serenity.db`.
- [x] **Bi-Directional Control Foundation**
  - [x] Implement Presets System (Load/Save/Default).
  - [x] Integrate Branding (Logo, Header, About Screen).
  - [x] Migrate Core Logic to Visual Blocks (`Default.xml`).
  - [x] **Fix Broken Button Logic**: Server-side saving & Proxy config.
- [x] **Emergency & Tools**
  - [x] **CRITICAL FIX**: Stopped infinite spam loop (Listener Caching).
  - [x] Added `!purge <N>` command.
  - [x] Added Channel Management blocks.
- [x] **Discord Logging Integration (v1.1.0)**
  - [x] Centralized logging to `serenity.db`.
  - [x] Auto-create `#brain-activity` channel.
- [x] **Unified Boot System**
  - [x] Create `tools/boot_serenity.py`.
  - [x] Aggregate logs.
- [x] **Installer & OTA System**
  - [x] Create `install.bat` and `setup_desktop.py`.
- [x] **Electron App Conversion (v1.3.0)**
  - [x] Create `electron-main.js`.
  - [x] Build `Serenity Setup 1.0.0.exe`.

### ✅ Completed Features (BF6Portal Tool Legacy)

- [x] **Electron Integration**: `electron-main.js`.
- [x] **Sliding Neural Link**: `terminal-drawer.js` (Porting to TS now).
- [x] **Implement Blocks**: Audio, Camera, etc. (Syncing to Serenity now).

### 🔮 Future Roadmap (v1.4.0+)

- [ ] **Advanced Interactions**
  - [ ] External control via Discord dialogs.
  - [ ] "Memory" blocks (reading/writing to DB).
  - [ ] Conditional logic for persona switching.
  - [ ] Timed tasks and scheduled events.
- [ ] **Knowledgebase & Data**
  - [ ] Process Dump uploads into knowledgebase.
  - [ ] Deduplicate screenshots/assets.

### 🛠️ System Health

- ✅ Web UI: `http://localhost:3000`
- ✅ IslaMao Bot: Online
- ✅ Nervous System: Monitoring
- ✅ Discord Logging: Active
