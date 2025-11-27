# Expected Battlefield Portal Blocks Reference
# Based on common Battlefield Portal blocks that should be in screenshots

## MATH BLOCKS (Expected)

### Basic Operations
- Add (A + B) - VALUE block, 2 number params
- Subtract (A - B) - VALUE block, 2 number params  
- Multiply (A × B) - VALUE block, 2 number params
- Divide (A ÷ B) - VALUE block, 2 number params
- Modulo (A % B) - VALUE block, 2 number params

### Advanced Math
- Power (A ^ B) - VALUE block, 2 number params
- Square Root - VALUE block, 1 number param
- Absolute Value - VALUE block, 1 number param
- Round - VALUE block, 1 number param (options: floor, ceil, round)
- Random Number - VALUE block, params: min, max

### Trigonometry (if present)
- Sin - VALUE block, 1 angle param
- Cos - VALUE block, 1 angle param
- Tan - VALUE block, 1 angle param

### Comparisons
- Less Than (A < B) - CONDITION block
- Greater Than (A > B) - CONDITION block
- Equal (A == B) - CONDITION block
- Less or Equal (A <= B) - CONDITION block
- Greater or Equal (A >= B) - CONDITION block
- Not Equal (A != B) - CONDITION block

### Special
- Min (minimum of A, B) - VALUE block
- Max (maximum of A, B) - VALUE block
- Clamp (clamp value between min and max) - VALUE block, 3 params
- Number constant - VALUE block, number input

---

## ARRAY BLOCKS (Expected)

### Array Creation
- Create Empty Array - VALUE block, no params
- Array Literal - VALUE block, list of values
- Array of Size - VALUE block, size param

### Array Access
- Get Array Element - VALUE block, params: array, index
- Set Array Element - ACTION block, params: array, index, value
- Array Length - VALUE block, param: array

### Array Operations
- Add to Array - ACTION block, params: array, value
- Remove from Array - ACTION block, params: array, index/value
- Clear Array - ACTION block, param: array
- Contains - CONDITION block, params: array, value
- Index Of - VALUE block, params: array, value

### Array Iteration
- For Each in Array - C_SHAPED block, params: array, iterator_variable
- Filter Array - VALUE block, params: array, condition
- Map Array - VALUE block, params: array, transform

### Array Utilities
- Reverse Array - VALUE block, param: array
- Sort Array - VALUE block, params: array, order
- Slice Array - VALUE block, params: array, start, end
- Concat Arrays - VALUE block, params: array1, array2

---

## AI BLOCKS (Expected)

### AI Behavior
- Set AI Behavior - ACTION block, params: AI, behavior_type
- AI Idle Behavior - VALUE block (behavior option)
- AI Move To Behavior - VALUE block, param: target
- AI Defend Position Behavior - VALUE block, param: position
- AI Battlefield Behavior - VALUE block
- AI Parachute Behavior - VALUE block
- AI Waypoint Idle Behavior - VALUE block

### AI Deployment
- Deploy AI - ACTION block, params: team, count, spawn_location
- Despawn AI - ACTION block, param: AI_entity
- Set AI Spawn Location - ACTION block, params: location, team

### AI Properties
- Get AI Team - VALUE block, param: AI
- Set AI Team - ACTION block, params: AI, team
- Get AI Health - VALUE block, param: AI
- Set AI Health - ACTION block, params: AI, health
- AI Is Alive - CONDITION block, param: AI

### AI Orders
- AI Move To Position - ACTION block, params: AI, position
- AI Attack Target - ACTION block, params: AI, target
- AI Follow Player - ACTION block, params: AI, player
- AI Hold Position - ACTION block, param: AI

---

## AUDIO BLOCKS (Expected)

### Sound Playback
- Play Sound - ACTION block, params: sound_id, location, volume
- Play Sound at Player - ACTION block, params: player, sound_id, volume
- Stop Sound - ACTION block, param: sound_id

### Audio Properties
- Set Audio Volume - ACTION block, params: sound_id, volume
- Get Audio Volume - VALUE block, param: sound_id

---

## CAMERA BLOCKS (Expected)

### Camera Control
- Set Player Camera - ACTION block, params: player, camera_mode
- Lock Camera to Target - ACTION block, params: player, target
- Camera Shake - ACTION block, params: player, intensity, duration
- Set Camera FOV - ACTION block, params: player, fov
- Reset Camera - ACTION block, param: player

### Camera Modes
- First Person Camera - VALUE block (camera mode)
- Third Person Camera - VALUE block (camera mode)
- Free Camera - VALUE block (camera mode)
- Spectator Camera - VALUE block (camera mode)

---

## EFFECTS BLOCKS (Expected)

### Visual Effects
- Play Effect - ACTION block, params: effect_type, location, scale
- Stop Effect - ACTION block, param: effect_id
- Particle Effect - VALUE block, param: particle_type
- Explosion Effect - VALUE block, param: explosion_type

### Screen Effects
- Screen Flash - ACTION block, params: player, color, duration
- Screen Fade - ACTION block, params: player, fade_type, duration
- Apply Screen Filter - ACTION block, params: player, filter_type

---

## EMPLACEMENTS BLOCKS (Expected)

### Emplacement Spawning
- Spawn Emplacement - ACTION block, params: type, location, team
- Despawn Emplacement - ACTION block, param: emplacement

### Emplacement Types
- Turret - VALUE block (emplacement type)
- Stationary Weapon - VALUE block (emplacement type)

### Emplacement Properties
- Set Emplacement Team - ACTION block, params: emplacement, team
- Get Emplacement Location - VALUE block, param: emplacement

---

## GAMEPLAY BLOCKS (Expected)

### Game State
- End Round - ACTION block, param: winning_team
- Pause Game - ACTION block
- Resume Game - ACTION block
- Set Game Timer - ACTION block, param: time_seconds
- Get Game Time - VALUE block

### Team Management
- Set Team Score - ACTION block, params: team, score
- Get Team Score - VALUE block, param: team
- Add to Team Score - ACTION block, params: team, amount
- Set Ticket Count - ACTION block, params: team, tickets
- Get Ticket Count - VALUE block, param: team

### Game Mode
- Set Game Mode - ACTION block, param: mode
- Get Current Game Mode - VALUE block
- Set Round Time - ACTION block, param: seconds

### Spawning
- Set Spawn Location - ACTION block, params: team, location
- Enable Spawn Point - ACTION block, params: spawn_point, enabled
- Force Respawn - ACTION block, param: player

---

## LOGIC BLOCKS (Expected - likely already implemented)

### Control Flow
- If - C_SHAPED block, param: condition
- While - C_SHAPED block, param: condition
- Break - ACTION block
- Continue - ACTION block

### Loops
- For Variable - C_SHAPED block, params: from, to, by
- For Each - C_SHAPED block, params: array, iterator

### Boolean Logic
- And - CONDITION block, 2 condition params
- Or - CONDITION block, 2 condition params
- Not - CONDITION block, 1 condition param

### Values
- True - VALUE block (boolean constant)
- False - VALUE block (boolean constant)
- Null - VALUE block

---

## OBJECTIVE BLOCKS (Expected)

### Objective Management
- Create Objective - ACTION block, params: name, location, team
- Complete Objective - ACTION block, param: objective
- Fail Objective - ACTION block, param: objective
- Update Objective - ACTION block, params: objective, status

### Objective Properties
- Set Objective Visible - ACTION block, params: objective, visible
- Get Objective Status - VALUE block, param: objective
- Objective Is Complete - CONDITION block, param: objective

---

## PLAYER BLOCKS (Expected)

### Player State
- Get Player Health - VALUE block, param: player
- Set Player Health - ACTION block, params: player, health
- Get Player Team - VALUE block, param: player
- Set Player Team - ACTION block, params: player, team
- Player Is Alive - CONDITION block, param: player
- Kill Player - ACTION block, param: player
- Respawn Player - ACTION block, param: player

### Player Movement
- Teleport Player - ACTION block, params: player, location
- Get Player Position - VALUE block, param: player
- Get Player Velocity - VALUE block, param: player
- Set Player Velocity - ACTION block, params: player, velocity

### Player Loadout
- Give Weapon - ACTION block, params: player, weapon_type
- Remove Weapon - ACTION block, params: player, weapon_type
- Set Player Loadout - ACTION block, params: player, loadout
- Get Player Weapon - VALUE block, param: player

### Player Properties
- Get Player Name - VALUE block, param: player
- Get Player Score - VALUE block, param: player
- Set Player Score - ACTION block, params: player, score
- Get Player Count - VALUE block, param: team (optional)

### Player Input
- Get Player Input - VALUE block, params: player, input_type
- Enable Player Input - ACTION block, params: player, input_type, enabled

---

## TRANSFORM BLOCKS (Expected)

### Position
- Create Position - VALUE block, params: x, y, z
- Get Position X - VALUE block, param: position
- Get Position Y - VALUE block, param: position
- Get Position Z - VALUE block, param: position

### Rotation
- Create Rotation - VALUE block, params: pitch, yaw, roll
- Get Rotation Pitch - VALUE block, param: rotation
- Get Rotation Yaw - VALUE block, param: rotation
- Get Rotation Roll - VALUE block, param: rotation

### Vector Operations
- Add Vectors - VALUE block, params: vector_a, vector_b
- Subtract Vectors - VALUE block, params: vector_a, vector_b
- Scale Vector - VALUE block, params: vector, scale
- Normalize Vector - VALUE block, param: vector
- Vector Length - VALUE block, param: vector
- Distance Between - VALUE block, params: pos_a, pos_b

### Direction
- Forward Vector - VALUE block, param: rotation
- Right Vector - VALUE block, param: rotation
- Up Vector - VALUE block, param: rotation

---

## USER INTERFACE BLOCKS (Expected)

### Messages
- Show Message - ACTION block, params: player, message, duration
- Show Big Message - ACTION block, params: player, title, subtitle, duration
- Show Notification - ACTION block, params: player, text, icon

### HUD Elements
- Set HUD Visible - ACTION block, params: player, hud_element, visible
- Update HUD Text - ACTION block, params: player, hud_id, text
- Create Custom HUD - ACTION block, params: player, hud_config

### Indicators
- Create World Marker - ACTION block, params: location, icon, text
- Remove World Marker - ACTION block, param: marker_id
- Set Objective Marker - ACTION block, params: player, location, text

### Scoreboard
- Update Scoreboard - ACTION block, params: entries
- Show Scoreboard - ACTION block, params: player, visible

---

## VEHICLES BLOCKS (Expected)

### Vehicle Spawning
- Spawn Vehicle - ACTION block, params: vehicle_type, location, team
- Despawn Vehicle - ACTION block, param: vehicle

### Vehicle Types
- Tank - VALUE block (vehicle type)
- APC - VALUE block (vehicle type)
- Helicopter - VALUE block (vehicle type)
- Jet - VALUE block (vehicle type)
- Transport - VALUE block (vehicle type)

### Vehicle Properties
- Get Vehicle Health - VALUE block, param: vehicle
- Set Vehicle Health - ACTION block, params: vehicle, health
- Get Vehicle Driver - VALUE block, param: vehicle
- Eject from Vehicle - ACTION block, params: player, vehicle
- Lock Vehicle - ACTION block, params: vehicle, team

### Vehicle Control
- Set Vehicle Speed - ACTION block, params: vehicle, speed
- Disable Vehicle - ACTION block, param: vehicle
- Enable Vehicle - ACTION block, param: vehicle

---

## ADDITIONAL CATEGORIES

### EVENT PAYLOADS (Context-dependent values)
- Event Player - VALUE block (returns player from event)
- Event Team - VALUE block (returns team from event)
- Event Attacker - VALUE block (returns attacker in damage event)
- Event Victim - VALUE block (returns victim in damage event)
- Event Damage - VALUE block (returns damage amount)
- Event Location - VALUE block (returns location from event)
- Event Weapon - VALUE block (returns weapon from event)

### CONTROL (Flow control)
- Wait - ACTION block, param: duration_seconds
- Wait Until - ACTION block, param: condition
- Call Subroutine - ACTION block, param: subroutine_name
- Return - ACTION block

---

## NOTES FOR CATALOGING

When reviewing screenshots, pay special attention to:

1. **Parameter labels**: Look for text like "From", "To", "By", "A", "B", "Player", "Team"
2. **Parameter icons**: Small icons like 👤 (player), 123 (number), ABC (text), ⚙ (settings)
3. **Block colors**: Each category has distinct colors (purple for AI, yellow for actions, etc.)
4. **Block shapes**: 
   - Rectangle = ACTION (does something)
   - Rounded = VALUE (returns something)
   - C-shaped = CONTROL FLOW (contains other blocks)
   - Hexagon = CONDITION (returns true/false)
5. **Submenu structure**: Categories often have expandable submenus
6. **Dropdown options**: Some blocks show available options in dropdowns

## CROSS-REFERENCE WITH SCREENSHOTS

As you go through each screenshot:
- Check off blocks from this list that you find
- Add NEW blocks not on this list
- Note exact parameter names and icons
- Document any dropdown options visible
- Note if blocks have optional parameters
- Record default values if shown
