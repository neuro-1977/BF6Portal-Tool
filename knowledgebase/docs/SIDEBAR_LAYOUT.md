# Sidebar Layout (v1.0.6-beta)

The left sidebar is currently a placeholder in the BF6Portal Tool web UI (v1.0.5-beta). Block categories (MOD, RULES, ACTIONS, etc.) will be restored in a future update as part of the Blockly toolbox integration.
## Planned Categories

- MOD
- RULES
- ACTIONS
- LOGIC
- MATH
- CONDITIONS
- EVENTS
- PLAYER
- OBJECTIVE
- UI
- AUDIO
- CAMERA
- EFFECTS
- EMPLACEMENTS
- GAMEPLAY
- TRANSFORM
- VALUES
- VEHICLES
- ARRAYS
- AI

See [ui_mockup.svg](ui_mockup.svg) for the current placeholder layout.
## Version 1.0.5-beta Note

In this version, the left menu is a placeholder. Full block categories and toolbox integration will be restored in a future update.
# Portal-Style Left Sidebar Layout

## Overview

The editor now uses a **left sidebar layout** matching Battlefield Portal's actual interface design. This resolves the horizontal menu overflow issue and provides unlimited vertical space for all block categories.

## Layout Structure

### Before (Top Bar Menu)
```
┌─────────────────────────────────────────────────────────────┐
│ [MOD] [RULES] [EVENTS] [CONDITIONS] [ACTIONS] ... [OVERFLOW]│ ← 13+ categories cramped
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                   Canvas Area                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### After (Left Sidebar)
```
┌──────┬──────────────────────────────────────────────────────┐
│ CATEG│ [Active Tab] [Import] [Export] [Zoom]               │ ← Minimal top bar
├──────┼──────────────────────────────────────────────────────┤
│ MOD  │                                                      │
│ RULES│                                                      │
│ EVENT│                Canvas Area                           │
│ COND │                (More Space!)                         │
│ ACTIO│                                                      │
│ VALUE│                                                      │
```
