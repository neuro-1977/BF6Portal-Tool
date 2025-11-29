# Portal Block Visual Analysis & Recreation Guide

Based on Portal screenshots in `assets/img/`, here's how each block type should look:

## Block Type Categories from Screenshots

### 1. **Example Blocks** (`example blocks.jpg`)
- Shows actual Portal workspace with placed blocks
- Blocks have smooth rounded corners
- Muted color palette
- Clean, flat design with subtle shadows
- Parameter slots integrated seamlessly

### 2. **Control Flow Blocks** (`control actions.jpg`)
- If/While/For blocks (C-shaped containers)
- Dark purple/blue tones
- Inner nesting area visible
- Condition slots at top

### 3. **Logic Blocks** (`logic1.jpg` - `logic4.jpg`)
- AND, OR, NOT operators
- Comparison operators (==, !=, <, >, <=, >=)
- Boolean values (True, False)
- Rounded pill-shaped VALUE blocks
- Teal/cyan color scheme

### 4. **Math Blocks** (`math1.jpg` - `math5.jpg`)
- Arithmetic operators (+, -, *, /, %)
- Math functions (Min, Max, Abs, Round, etc.)
- Number value blocks
- Orange/amber color scheme
- VALUE type (rounded)

### 5. **Array Blocks** (`arrays1.jpg` - `arrays3.jpg`)
- Array operations (Get, Set, Add, Remove, etc.)
- Array value blocks
- INDEX: notation visible
- Deep purple color scheme

### 6. **Player Blocks** (`player 1.jpg` - `player 3.jpg`)
- Player-related actions and values
- GetPlayer, SetPlayerVariable, etc.
- Blue/teal color scheme
- Mix of SEQUENCE and VALUE types

### 7. **Gameplay Blocks** (`gameplay1.jpg` - `gameplay8.jpg`)
- Game state actions
- Spawn, Kill, Teleport, etc.
- Green color scheme
- SEQUENCE type (rectangular)

### 8. **Transform Blocks** (`transform.jpg`)
- Position, Rotation, Scale operations
- 3D vector manipulation
- Orange/brown color scheme
- VALUE type

### 9. **Rules Blocks** (`rules1.jpg` - `rules6.jpg`, `rules menu.jpg`)
- OnPlayerDied, OnPlayerKilled, OnGameStart, etc.
- Large C-shaped containers
- Purple color scheme
- Condition and Action areas visible

### 10. **AI Blocks** (`AI.jpg`, `AI menu1.jpg` - `AI menu4.jpg`)
- AI behavior and decision-making
- PathTo, LookAt, etc.
- Dark teal color scheme

### 11. **Audio Blocks** (`audio.jpg`, `audio1.jpg`)
- PlaySound, StopSound, SetVolume
- Pink/magenta color scheme

### 12. **Camera Blocks** (`camera.jpg`)
- Camera positioning and control
- Blue color scheme

### 13. **Effects Blocks** (`effects.jpg`, `effects2.jpg`)
- Visual effects (particles, explosions)
- Purple/magenta scheme

### 14. **Emplacements** (`emplacements1.jpg`, `emplacements2.jpg`)
- Turret and emplacement control
- Brown/tan color scheme

### 15. **Objectives** (`objective1.jpg`, `objective2.jpg`)
- Objective creation and tracking
- Orange color scheme

### 16. **User Interface** (`user interface1.jpg` - `user interface 10.jpg`)
- UI display and interaction
- Yellow/gold color scheme
- ShowMessage, HideUI, etc.

### 17. **Vehicles** (`vehicle 1.jpg` - `vehicle 3.jpg`)
- Vehicle spawning and control
- Dark green scheme

### 18. **Variables** (`variables.jpg`)
- Variable creation and manipulation
- GetVariable, SetVariable
- Red/pink color scheme

### 19. **Literals** (`literals.jpg`)
- Number, String, Boolean value blocks
- Various colors by type

## Key Visual Characteristics (from screenshots)

### Block Shapes

#### SEQUENCE Blocks (Actions)
```
┌─────────────────────────┐
│  Block Label            │
│  [param] [param] [param]│
└─────────────────────────┘
```
- Rounded corners (8px radius)
- Height: ~42px
- Width: 280px base
- Top and bottom edges smooth
- Parameter slots inline

#### VALUE Blocks (Data)
```
┌───────────────┐
│  Value Label  │
└───────────────┘
```
- Fully rounded (pill-shaped)
- Height: ~38px
- Width: Variable based on content
- Can nest in parameter slots
- Smoother corners than SEQUENCE

#### C_SHAPED Blocks (Containers)
```
┌─────────────────────────┐
│  Container Label        │
├─┐                     ┌─┤
│ │                     │ │
│ │  Nested blocks here │ │
│ │                     │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```
- Outer corners rounded (8px)
- Inner corners sharp for nesting
- Right side open for easy insertion
- Bars: 45px height
- Inner: Variable based on contents

### Color Palette (from screenshots)

**Actions (Green)**: `#8b7a3d` (muted olive-green)
**Rules (Purple)**: `#6b3580` (dark purple)
**Events (Orange)**: `#8b5a3c` (rust/brown)
**Conditions (Teal)**: `#0d7377` (dark teal)
**Values (Red)**: `#8b3a3a` (dark red)
**Logic (Cyan)**: `#3a7a8b` (steel blue)
**Math (Orange)**: `#8b6a3a` (amber)
**Arrays (Purple)**: `#5a3a8b` (deep purple)
**Player (Blue)**: `#3a5a8b` (cobalt)
**Gameplay (Green)**: `#3a8b5a` (forest green)
**Transform (Brown)**: `#8b5a3a` (brown)

### Typography

- **Font**: Arial, bold
- **Size**: 9-10pt for block labels
- **Color**: White text on dark blocks, Black on light blocks (ACTIONS)
- **Alignment**: Left-aligned in blocks

### Spacing & Padding

- **Block padding**: 8-12px horizontal, 4-6px vertical
- **Parameter spacing**: 4-6px between parameters
- **Nesting indent**: 40px left margin inside C-blocks
- **Vertical gap**: 5px between stacked blocks

### Shadows & Depth

- **Outline**: 1px solid `#0a0a0a` (subtle dark border)
- **No harsh shadows**: Flat design with minimal depth
- **Parameter slots**: Slightly darker than parent (`bg - 10%`)
- **Relief**: Flat, no raised/sunken effects

### Parameter Slots

```
┌─────────────────────────────┐
│ BlockLabel [▢ param1] [▢ 2]│
└─────────────────────────────┘
         Darker    Darker
         recessed  recessed
```
- **Background**: Parent color - 15-20% darker
- **Border**: 1px solid, slightly lighter than bg
- **Size**: 60-120px width, 28px height
- **Relief**: Sunken or flat
- **Nested blocks**: VALUE blocks drop into slots

## Current Implementation Status

### ✅ Already Correct
- Rounded corners on all blocks (8px radius)
- Smooth polygon rendering (`smooth=True`)
- Dark color palette matching Portal
- Flat design with minimal borders
- C-shaped block rendering
- Parameter slot integration

### ⚠️ Needs Refinement
1. **Color accuracy**: Some colors may need fine-tuning to match screenshots exactly
2. **Parameter slot styling**: Ensure slots are properly darkened
3. **Text sizing**: Verify font sizes match Portal (9-10pt)
4. **Block dimensions**: Confirm width/height match Portal exactly
5. **Nesting visuals**: C-block inner area should be clearly defined

### ❌ Missing from Screenshots
- Some categories from screenshots not yet implemented:
  - AI blocks (4 submenus)
  - AUDIO blocks
  - CAMERA blocks
  - EFFECTS blocks
  - EMPLACEMENTS (2 submenus)
  - OBJECTIVE (2 submenus)
  - USER INTERFACE (10 submenus)
  - VEHICLES (3 submenus)

## Recreation Checklist

For each block type, verify:
- [ ] Correct shape (SEQUENCE, VALUE, C_SHAPED)
- [ ] Exact color from Portal palette
- [ ] Rounded corners (8px for rectangles, pill for values)
- [ ] Proper dimensions (width, height)
- [ ] Text style (font, size, color, alignment)
- [ ] Parameter slots (count, position, styling)
- [ ] Border/outline (1px `#0a0a0a`)
- [ ] Spacing/padding matches Portal
- [ ] Can nest properly if container
- [ ] Can be nested if VALUE type

## Next Steps

1. **Compare current blocks to Portal screenshots**
   - Place screenshots side-by-side with editor
   - Check each category individually
   - Note exact differences

2. **Adjust colors if needed**
   - Use color picker on screenshots
   - Update `Block_Data_Manager.py` palette

3. **Refine dimensions**
   - Measure blocks in screenshots (if possible)
   - Adjust `CHILD_BLOCK_WIDTH`, `CHILD_BLOCK_HEIGHT`

4. **Test nesting behavior**
   - Verify C-blocks accept children properly
   - Check VALUE blocks nest in parameter slots
   - Ensure visual feedback is clear

5. **Add missing categories**
   - Create data files for AI, AUDIO, CAMERA, etc.
   - Follow same structure as existing categories
   - Use colors from screenshots
