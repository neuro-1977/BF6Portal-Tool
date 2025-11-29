# Battlefield Portal Editor Reference

> **Note**: The project is transitioning to a Blockly-based web interface. See [CONCEPT_ART.md](CONCEPT_ART.md) for the new visual style guide.

Based on provided screenshots.

## UI Layout
- **Sidebar**:
    - Search Bar at top ("Search...").
    - Categories list (Vertical tabs).
    - Categories: RULES, AI, ARRAYS, AUDIO, CAMERA, EFFECTS, EMPLACEMENTS, GAMEPLAY, LOGIC, OBJECTIVE, OTHER, PLAYER, TRANSFORM, USER INTERFACE, VEHICLES.
- **Block Palette**:
    - Appears to the right of the sidebar when a category is selected.
    - Blocks are grouped by Sub-Category (e.g., "GENERAL", "DEPLOY", "GAME MODE").
    - Blocks show Icon, Label, and Parameter Icons.

## Categories & Blocks

### AI
**Sub-Category: BEHAVIOR**
- `AIBattlefieldBehavior` (Inputs: Player)
- `AIDefendPositionBehavior` (Inputs: Player, Vector, Number, Number)
- `AIIdleBehavior` (Inputs: Player)
- `AILOSMoveToBehavior` (Inputs: Player, Vector)
- `AIMoveToBehavior` (Inputs: Player, Vector)
- `AIParachuteBehavior` (Inputs: Player)

### ARRAYS
**Sub-Category: GENERAL**
- `SetVariableAtIndex` (Inputs: Variable, Number, Value)

### AUDIO
**Sub-Category: GENERAL**
- `LoadMusic` (Inputs: String/ID?)
- `PlayMusic` (Inputs: String/ID?, PlayerList?)
- `SetMusicParam` (Inputs: String/ID?, Number, PlayerList?)
- `UnloadMusic` (Inputs: String/ID?)
- `PlaySound` (Inputs: Value, Number, PlayerList?, Number, PlayerList?)
- `PlayVO` (Inputs: Value, String?, String?, PlayerList?)
- `StopSound` (Inputs: Number/ID?, PlayerList?)

### CAMERA
**Sub-Category: GENERAL**
- `SetCameraTypeForAll` (Inputs: String?, Number?)
- `SetCameraTypeForPlayer` (Inputs: Player, String?, Number?)

### EFFECTS
**Sub-Category: SCREENEFFECTS**
- `EnableScreenEffect` (Inputs: Player, Enum?, Bool)
**Sub-Category: VFX**
- `EnableVFX` (Inputs: VFX, Bool)
- `MoveVFX` (Inputs: VFX, Vector, Vector)
- `SetVFXColor` (Inputs: VFX, Vector)
- `SetVFXScale` (Inputs: VFX, Number)
- `SetVFXSpeed` (Inputs: VFX, Number)

### EMPLACEMENTS
**Sub-Category: GENERAL**
- `ForceEmplacementSpawnerSpawn` (Inputs: Emplacement)
- `SetEmplacementSpawnerAbandonVehicleOutOfCombatArea` (Inputs: Emplacement, Bool)
- `SetEmplacementSpawnerApplyDamageToAbandonVehicle` (Inputs: Emplacement, Bool)
- `SetEmplacementSpawnerAutoSpawn` (Inputs: Emplacement, Bool)
- `SetEmplacementSpawnerKeepAliveAbandonRadius` (Inputs: Emplacement, Number)
- `SetEmplacementSpawnerRespawnTime` (Inputs: Emplacement, Number)

### LOGIC
**Sub-Category: GENERAL**
- `Abort`
- `AbortIf` (Inputs: Bool)
- `ChaseVariableAtRate` (Inputs: Variable, Number, Number)
- `ChaseVariableOverTime` (Inputs: Variable, Number, Number)
- `Skip` (Inputs: Number)
- `SkipIf` (Inputs: Number, Bool)

### OBJECTIVE
**Sub-Category: CAPTURE POINT**
- `EnableCapturePointDeploying` (Inputs: CapturePoint, Bool)
- `SetCapturePointCapturingTime` (Inputs: CapturePoint, Number)
- `SetCapturePointNeutralizationTime` (Inputs: CapturePoint, Number)
- `SetCapturePointOwner` (Inputs: CapturePoint, Team)
- `SetMaxCaptureMultiplier` (Inputs: CapturePoint, Number)
**Sub-Category: DEPLOY**
- `EnableHQ` (Inputs: HQ, Bool)

### PLAYER
**Sub-Category: DEPLOY**
- `DeployPlayer` (Inputs: Player)
- `SetSpawnMode` (Inputs: Mode)
- `SpawnPlayerFromSpawnPoint` (Inputs: Player, SpawnPoint)
**Sub-Category: GENERAL**
- `SetPlayerIncomingDamageFactor` (Inputs: Player, Number)
- `Teleport` (Inputs: Player, Vector, Number)

### TRANSFORM
**Sub-Category: GENERAL**
- `MoveObject` (Inputs: Object, Vector, Vector)
- `MoveObjectOverTime` (Inputs: Object, Vector, Vector, Number, Bool, Bool)
- `OrbitObjectOverTime` (Inputs: Object, Angle?, Number, Number, Bool, Bool, Bool, Vector)
- `RotateObject` (Inputs: Object, Vector)
- `SetObjectTransform` (Inputs: Object, Transform)
- `SetObjectTransformOverTime` (Inputs: Object, Transform, Number, Bool, Bool)

## Visual Details
- **Zoom Slider**: Needs to be restored.
- **Search Bar**: Needs to be added to sidebar.
- **Block Colors**:
    - AI/ARRAYS/AUDIO/CAMERA/EFFECTS/EMPLACEMENTS/GAMEPLAY/LOGIC/OBJECTIVE/OTHER/PLAYER/TRANSFORM/UI/VEHICLES: **Yellow/Gold** (`#b5a045` approx)
    - RULES: **Purple**
    - CONDITIONS: **Teal/Blue**
    - SUBROUTINES: **Orange/Brown**
