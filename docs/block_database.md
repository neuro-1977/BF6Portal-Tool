# Blockly Block Database

This document lists all identified Blockly blocks, their properties, and current implementation status.

## MOD (`MOD_BLOCK`)
- **Type:** MOD
- **Color:** #4A4A4A
- **Description:** The root container for all game logic. Add rules, conditions, and subroutines to set game map parameters.
- **Arguments:** mod_name, description
- **Widgets:** {"mod_name": {"type": "text_input", "default": "MyGameMode"}, "description": {"type": "text_input", "default": "Description"}}
- **Status:** Implemented

---

## RULE (`RULE_HEADER`)
- **Type:** RULES
- **Color:** #A285E6
- **Description:** Defines a game rule with CONDITIONS and ACTIONS.
- **Arguments:** rule_name, event_type, scope
- **Widgets:** {"rule_name": {"type": "text_input", "default": "New Rule"}, "event_type": {"type": "dropdown", "options": ["Ongoing", "OnPlayerJoin", "OnPlayerDeath", "OnPlayerSpawn"], "default": "Ongoing"}, "scope": {"type": "dropdown", "options": ["Global", "Team", "Squad", "Player"], "default": "Global"}}
- **Status:** Implemented

---

## Condition (`CONDITION_BLOCK`)
- **Type:** CONDITION
- **Color:** #45B5B5
- **Description:** A placeholder condition block.
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Action (`ACTION_BLOCK`)
- **Type:** ACTION
- **Color:** #B5A045
- **Description:** A placeholder action block.
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## SUBROUTINE: (`SUBROUTINE_BLOCK`)
- **Type:** SUBROUTINE
- **Color:** #E6A85C
- **Description:** Reusable logic blocks that can be called from multiple places.
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Call Subroutine: (`SUBROUTINE_REFERENCE_BLOCK`)
- **Type:** ACTION
- **Color:** #E6A85C
- **Description:** Calls a defined subroutine.
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Control Action: (`CONTROL_ACTION_BLOCK`)
- **Type:** ACTION
- **Color:** #A285E6
- **Description:** A placeholder control action block.
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## AI Battlefield Behavior (`AIBATTLEFIELD_BEHAVIOR`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Sets the AI to standard battlefield combat behavior
- **Arguments:** player
- **Widgets:** {}
- **Status:** Implemented

---

## AI Defend Position Behavior (`AIDEFEND_POSITION_BEHAVIOR`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Orders AI to defend a specific area
- **Arguments:** player, position, radius, time
- **Widgets:** {}
- **Status:** Implemented

---

## AI Idle Behavior (`AI_IDLE_BEHAVIOR`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Sets the AI to idle state
- **Arguments:** player
- **Widgets:** {}
- **Status:** Implemented

---

## AI Move To Behavior (`AI_MOVE_TO_BEHAVIOR`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Orders AI to move to a location
- **Arguments:** player, position, sprint
- **Widgets:** {}
- **Status:** Implemented

---

## AI Parachute Behavior (`AI_PARACHUTE_BEHAVIOR`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Orders AI to deploy parachute
- **Arguments:** player
- **Widgets:** {}
- **Status:** Implemented

---

## AI Waypoint Idle Behavior (`AI_WAYPOINT_IDLE_BEHAVIOR`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** AI waits at a waypoint for a duration
- **Arguments:** player, time
- **Widgets:** {}
- **Status:** Implemented

---

## AI Follow Player (`AI_FOLLOW_PLAYER`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Orders AI to follow a specific player
- **Arguments:** ai_player, target_player, distance
- **Widgets:** {}
- **Status:** Implemented

---

## AI Hold Position (`AI_HOLD_POSITION`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Orders AI to hold their current position
- **Arguments:** player
- **Widgets:** {}
- **Status:** Implemented

---

## AI Attack Target (`AI_ATTACK_TARGET`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Orders AI to attack a specific target
- **Arguments:** ai_player, target_player
- **Widgets:** {}
- **Status:** Implemented

---

## Set AI Behavior (`SET_AI_BEHAVIOR`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Sets the general behavior mode for the AI
- **Arguments:** player, behavior_mode
- **Widgets": {}
- **Status:** Implemented

---

## Deploy AI (`DEPLOY_AI`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Spawns a new AI soldier
- **Arguments:** team, soldier_type, position, kit
- **Widgets": {}
- **Status:** Implemented

---

## Despawn AI (`DESPAWN_AI`)
- **Type": ACTIONS
- **Color": #D32F2F
- **Description": Removes an AI soldier from the game
- **Arguments": player
- **Widgets": {}
- **Status": Implemented

---

## Set AI Spawn Location (`SET_AI_SPAWN_LOCATION`)
- **Type": ACTIONS
- **Color": #D32F2F
- **Description": Sets where AI soldiers will spawn
- **Arguments": team, position
- **Widgets": {}
- **Status": Implemented

---

## Set AI Health (`SET_AI_HEALTH`)
- **Type": ACTIONS
- **Color": #D32F2F
- **Description": Sets the health of an AI soldier
- **Arguments": player, amount
- **Widgets": {}
- **Status": Implemented

---

## Set AI Team (`SET_AI_TEAM`)
- **Type": ACTIONS
- **Color": #D32F2F
- **Description": Changes the team of an AI soldier
- **Arguments": player, team_id
- **Widgets": {}
- **Status": Implemented

---

## Get AI Health (`GET_AI_HEALTH`)
- **Type": VALUE
- **Color": #D32F2F
- **Description": Returns the current health of an AI soldier
- **Arguments": player
- **Widgets": {}
- **Status": Implemented

---

## Get AI Team (`GET_AI_TEAM`)
- **Type": VALUE
- **Color": #D32F2F
- **Description": Returns the team ID of an AI soldier
- **Arguments": player
- **Widgets": {}
- **Status": Implemented

---

## AI Is Alive (`AI_IS_ALIVE`)
- **Type": CONDITION
- **Color": #D32F2F
- **Description": Checks if an AI soldier is currently alive
- **Arguments": player
- **Widgets": {}
- **Status": Implemented

---

## Create Array (`CREATE_ARRAY`)
- **Type": VALUE
- **Color": #0097A7
- **Description": Creates an empty array.
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Array Length (`ARRAY_LENGTH`)
- **Type": VALUE
- **Color": #0097A7
- **Description": Returns the number of elements in an array.
- **Arguments": array
- **Widgets": {}
- **Status": Implemented

---

## Get Element (`GET_ELEMENT`)
- **Type": VALUE
- **Color": #0097A7
- **Description": Returns the element at a specific index in an array.
- **Arguments": array, index
- **Widgets": {}
- **Status": Implemented

---

## Set Element (`SET_ELEMENT`)
- **Type": ACTION
- **Color": #0097A7
- **Description": Sets the element at a specific index in an array.
- **Arguments": array, index, value
- **Widgets": {}
- **Status": Implemented

---

## Append To Array (`APPEND_TO_ARRAY`)
- **Type": ACTION
- **Color": #0097A7
- **Description": Adds a value to the end of an array.
- **Arguments": array, value
- **Widgets": {}
- **Status": Implemented

---

## Remove From Array (`REMOVE_FROM_ARRAY`)
- **Type": ACTION
- **Color": #0097A7
- **Description": Removes an element from an array at a specific index.
- **Arguments": array, index
- **Widgets": {}
- **Status": Implemented

---

## Find First (`FIND_FIRST`)
- **Type": VALUE
- **Color": #0097A7
- **Description": Finds the first index of a value in an array. Returns -1 if not found.
- **Arguments": array, value
- **Widgets": {}
- **Status": Implemented

---

## Sort Array (`SORT_ARRAY`)
- **Type": ACTION
- **Color": #0097A7
- **Description": Sorts an array in ascending or descending order.
- **Arguments": array, order
- **Widgets": {}
- **Status": Implemented

---

## Load Music (`LOAD_MUSIC`)
- **Type": ACTIONS
- **Color": #455A64
- **Description": Loads music given an ID.
- **Arguments": music_id
- **Widgets": {}
- **Status": Implemented

---

## Play Music (`PLAY_MUSIC`)
- **Type": ACTIONS
- **Color": #455A64
- **Description": Plays music given an ID for specific players.
- **Arguments": music_id, players
- **Widgets": {}
- **Status": Implemented

---

## Set Music Param (`SET_MUSIC_PARAM`)
- **Type": ACTIONS
- **Color": #455A64
- **Description": Sets a parameter for music for specific players.
- **Arguments": music_id, param, players
- **Widgets": {}
- **Status": Implemented

---

## Unload Music (`UNLOAD_MUSIC`)
- **Type": ACTIONS
- **Color": #455A64
- **Description": Unloads music given an ID.
- **Arguments": music_id
- **Widgets": {}
- **Status": Implemented

---

## Play Sound (`PLAY_SOUND`)
- **Type": ACTIONS
- **Color": #455A64
- **Description": Plays a sound at a position for specific players.
- **Arguments": sound_id, position, players, volume, pitch
- **Widgets": {}
- **Status": Implemented

---

## Play VO (`PLAY_VO`)
- **Type": ACTIONS
- **Color": #455A64
- **Description": Plays a voice over for specific players.
- **Arguments": vo_id, speaker, listener, players
- **Widgets": {}
- **Status": Implemented

---

## Stop Sound (`STOP_SOUND`)
- **Type": ACTIONS
- **Color": #455A64
- **Description": Stops a sound for specific players.
- **Arguments": sound_id, players
- **Widgets": {}
- **Status": Implemented

---

## Set Player Camera (`SET_PLAYER_CAMERA`)
- **Type": ACTIONS
- **Color": #37474F
- **Description": Sets the camera mode for a specific player
- **Arguments": player, camera_mode
- **Widgets": {}
- **Status": Implemented

---

## Lock Camera to Target (`LOCK_CAMERA_TO_TARGET`)
- **Type": ACTIONS
- **Color": #37474F
- **Description": Locks the player's camera to look at a target
- **Arguments": player, target
- **Widgets": {}
- **Status": Implemented

---

## Camera Shake (`CAMERA_SHAKE`)
- **Type": ACTIONS
- **Color": #37474F
- **Description": Applies a shake effect to the player's camera
- **Arguments": player, intensity, duration
- **Widgets": {}
- **Status": Implemented

---

## Set Camera FOV (`SET_CAMERA_FOV`)
- **Type": ACTIONS
- **Color": #37474F
- **Description": Sets the Field of View for the player's camera
- **Arguments": player, fov
- **Widgets": {}
- **Status": Implemented

---

## Reset Camera (`RESET_CAMERA`)
- **Type": ACTIONS
- **Color": #37474F
- **Description": Resets the player's camera to default
- **Arguments": player
- **Widgets": {}
- **Status": Implemented

---

## First Person Camera (`FIRST_PERSON_CAMERA`)
- **Type": VALUE
- **Color": #37474F
- **Description": First person camera mode
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Third Person Camera (`THIRD_PERSON_CAMERA`)
- **Type": VALUE
- **Color": #37474F
- **Description": Third person camera mode
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Free Camera (`FREE_CAMERA`)
- **Type": VALUE
- **Color": #37474F
- **Description": Free camera mode
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Spectator Camera (`SPECTATOR_CAMERA`)
- **Type": VALUE
- **Color": #37474F
- **Description": Spectator camera mode
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Equal (`EQUAL`)
- **Type": VALUE
- **Color": #1976D2
- **Description": Returns True if inputs are equal
- **Arguments": a, b
- **Widgets": {}
- **Status": Implemented

---

## Not Equal (`NOT_EQUAL`)
- **Type": VALUE
- **Color": #1976D2
- **Description": Returns True if inputs are not equal
- **Arguments": a, b
- **Widgets": {}
- **Status": Implemented

---

## Less Than (`LESS_THAN`)
- **Type": VALUE
- **Color": #1976D2
- **Description": Returns True if A < B
- **Arguments": a, b
- **Widgets": {}
- **Status": Implemented

---

## Less Than Or Equal (`LESS_THAN_OR_EQUAL`)
- **Type": CONDITIONS
- **Color": #45B5B5
- **Description": Returns true if A is less than or equal to B
- **Arguments": value_a, value_b
- **Widgets": {}
- **Status": Implemented

---

## Greater Than (`GREATER_THAN`)
- **Type": VALUE
- **Color": #1976D2
- **Description": Returns True if A > B
- **Arguments": a, b
- **Widgets": {}
- **Status": Implemented

---

## Greater Than Or Equal (`GREATER_THAN_OR_EQUAL`)
- **Type": CONDITIONS
- **Color": #45B5B5
- **Description": Returns true if A is greater than or equal to B
- **Arguments": value_a, value_b
- **Widgets": {}
- **Status": Implemented

---

## Play Effect (`PLAY_EFFECT`)
- **Type": ACTIONS
- **Color": #263238
- **Description": Plays a visual effect at a location
- **Arguments": effect_type, location, scale
- **Widgets": {}
- **Status": Implemented

---

## Stop Effect (`STOP_EFFECT`)
- **Type": ACTIONS
- **Color": #263238
- **Description": Stops a playing effect
- **Arguments": effect_id
- **Widgets": {}
- **Status": Implemented

---

## Particle Effect (`PARTICLE_EFFECT`)
- **Type": VALUE
- **Color": #263238
- **Description": Returns a particle effect type
- **Arguments": particle_type
- **Widgets": {}
- **Status": Implemented

---

## Explosion Effect (`EXPLOSION_EFFECT`)
- **Type": VALUE
- **Color": #263238
- **Description": Returns an explosion effect type
- **Arguments": explosion_type
- **Widgets": {}
- **Status": Implemented

---

## Screen Flash (`SCREEN_FLASH`)
- **Type": ACTIONS
- **Color": #263238
- **Description": Flashes the player's screen with a color
- **Arguments": player, color, duration
- **Widgets": {}
- **Status": Implemented

---

## Screen Fade (`SCREEN_FADE`)
- **Type": ACTIONS
- **Color": #263238
- **Description": Fades the player's screen
- **Arguments": player, fade_type, duration
- **Widgets": {}
- **Status": Implemented

---

## Apply Screen Filter (`APPLY_SCREEN_FILTER`)
- **Type": ACTIONS
- **Color": #263238
- **Description": Applies a visual filter to the player's screen
- **Arguments": player, filter_type
- **Widgets": {}
- **Status": Implemented

---

## Deploy Emplacement (`DEPLOY_EMPLACEMENT`)
- **Type": ACTIONS
- **Color": #8D6E63
- **Description": Deploys an emplacement at a specified position and rotation.
- **Arguments": emplacement_id, position, rotation
- **Widgets": {}
- **Status": Implemented

---

## On Game Start (`ON_GAME_START`)
- **Type": EVENTS
- **Color": #5D4037
- **Description": Triggers when the game starts.
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## On Player Join (`ON_PLAYER_JOIN`)
- **Type": EVENTS
- **Color": #5D4037
- **Description": Triggers when a player joins the game.
- **Arguments": player
- **Widgets": {}
- **Status": Implemented

---

## Event Attacker (`EVENT_ATTACKER`)
- **Type": VALUE
- **Color": #5D4037
- **Description": The player who caused the event (e.g. the killer)
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Event Damage (`EVENT_DAMAGE`)
- **Type": VALUE
- **Color": #5D4037
- **Description": The amount of damage dealt in the event
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Event Location (`EVENT_LOCATION`)
- **Type": VALUE
- **Color": #5D4037
- **Description": The location where the event occurred
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Event Player (`EVENT_PLAYER`)
- **Type": VALUE
- **Color": #5D4037
- **Description": The primary player involved in the event
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Event Team (`EVENT_TEAM`)
- **Type": VALUE
- **Color": #5D4037
- **Description": The team involved in the event
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Event Victim (`EVENT_VICTIM`)
- **Type": VALUE
- **Color": #5D4037
- **Description": The player who was the victim of the event
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Event Weapon (`EVENT_WEAPON`)
- **Type": VALUE
- **Color": #5D4037
- **Description": The weapon used in the event
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Get Gamemode (`GET_GAMEMODE`)
- **Type": VALUE
- **Color": #5D4037
- **Description": Gets the current gamemode.
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Set Gamemode (`SET_GAMEMODE`)
- **Type": ACTION
- **Color": #5D4037
- **Description": Sets the current gamemode.
- **Arguments": gamemode
- **Widgets": {}
- **Status": Implemented

---

## Enable Friendly Fire (`ENABLE_FRIENDLY_FIRE`)
- **Type": ACTION
- **Color": #5D4037
- **Description": Enables or disables friendly fire.
- **Arguments": enabled
- **Widgets": {}
- **Status": Implemented

---

## Set Score (`SET_SCORE`)
- **Type": ACTION
- **Color": #5D4037
- **Description": Sets the score for a team.
- **Arguments": team, score
- **Widgets": {}
- **Status": Implemented

---

## Get Score (`GET_SCORE`)
- **Type": VALUE
- **Color": #5D4037
- **Description": Gets the score for a team.
- **Arguments": team
- **Widgets": {}
- **Status": Implemented

---

## Set Time Limit (`SET_TIME_LIMIT`)
- **Type": ACTION
- **Color": #5D4037
- **Description": Sets the time limit for the round.
- **Arguments": time_limit
- **Widgets": {}
- **Status": Implemented

---

## Get Time Limit (`GET_TIME_LIMIT`)
- **Type": VALUE
- **Color": #5D4037
- **Description": Gets the time limit for the round.
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Wait (`WAIT`)
- **Type": ACTIONS
- **Color": #1976D2
- **Description": Pauses execution for a specified time
- **Arguments": seconds
- **Widgets": {}
- **Status": Implemented

---

## Wait Until (`WAIT_UNTIL`)
- **Type": ACTIONS
- **Color": #1976D2
- **Description": Pauses execution until condition is true
- **Arguments": condition, timeout
- **Widgets": {}
- **Status": Implemented

---

## Break (`BREAK`)
- **Type": ACTIONS
- **Color": #1976D2
- **Description": Exits the current loop immediately
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Continue (`CONTINUE`)
- **Type": ACTIONS
- **Color": #1976D2
- **Description": Skips to the next iteration of the current loop
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## If (`IF`)
- **Type": ACTIONS
- **Color": #1976D2
- **Description": Executes nested blocks if condition is true
- **Arguments": condition
- **Widgets": {}
- **Status": Implemented

---

## While (`WHILE`)
- **Type": ACTIONS
- **Color": #1976D2
- **Description": Repeats nested blocks while condition is true
- **Arguments": condition
- **Widgets": {}
- **Status": Implemented

---

## And (`AND`)
- **Type": VALUE
- **Color": #1976D2
- **Description": Returns True if both inputs are True
- **Arguments": a, b
- **Widgets": {}
- **Status": Implemented

---

## Or (`OR`)
- **Type": VALUE
- **Color": #1976D2
- **Description": Returns True if either input is True
- **Arguments": a, b
- **Widgets": {}
- **Status": Implemented

---

## Not (`NOT`)
- **Type": VALUE
- **Color": #1976D2
- **Description": Returns the opposite boolean value
- **Arguments": a
- **Widgets": {}
- **Status": Implemented

---

## True (`TRUE`)
- **Type": VALUE
- **Color": #1976D2
- **Description": Boolean True value
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## False (`FALSE`)
- **Type": VALUE
- **Color": #1976D2
- **Description": Boolean False value
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Greater Than Or Equal (`GREATER_THAN_EQUAL`)
- **Type": VALUE
- **Color": #1976D2
- **Description": Returns True if A >= B
- **Arguments": a, b
- **Widgets": {}
- **Status": Implemented

---

## Less Than Or Equal (`LESS_THAN_EQUAL`)
- **Type": VALUE
- **Color": #1976D2
- **Description": Returns True if A <= B
- **Arguments": a, b
- **Widgets": {}
- **Status": Implemented

---

## For Variable (`FOR_VARIABLE`)
- **Type": ACTIONS
- **Color": #1976D2
- **Description": Loops from starting value to ending value by increment
- **Arguments": from_value, to_value, by_value
- **Widgets": {}
- **Status": Implemented

---

## Add (`ADD`)
- **Type": VALUE
- **Color": #1976D2
- **Description": Returns the sum of A and B
- **Arguments": value_a, value_b
- **Widgets": {}
- **Status": Implemented

---

## Subtract (`SUBTRACT`)
- **Type": VALUE
- **Color": #1976D2
- **Description": Returns the difference of A and B
- **Arguments": value_a, value_b
- **Widgets": {}
- **Status": Implemented

---

## Multiply (`MULTIPLY`)
- **Type": VALUE
- **Color": #1976D2
- **Description": Returns the product of A and B
- **Arguments": value_a, value_b
- **Widgets": {}
- **Status": Implemented

---

## Divide (`DIVIDE`)
- **Type": VALUE
- **Color": #1976D2
- **Description": Returns the quotient of A and B
- **Arguments": value_a, value_b
- **Widgets": {}
- **Status": Implemented

---

## Power (`POWER`)
- **Type": VALUE
- **Color": #1976D2
- **Description": Returns the base to the exponent power.
- **Arguments": base, exponent
- **Widgets": {}
- **Status": Implemented

---

## Square Root (`SQUARE_ROOT`)
- **Type": VALUE
- **Color": #1976D2
- **Description": Returns the square root of a number.
- **Arguments": value
- **Widgets": {}
- **Status": Implemented

---

## Absolute (`ABSOLUTE`)
- **Type": VALUE
- **Color": #1976D2
- **Description": Returns the absolute value of a number.
- **Arguments": value
- **Widgets": {}
- **Status": Implemented

---

## Modulo (`MODULO`)
- **Type": VALUE
- **Color": #1976D2
- **Description": Returns the remainder of a division.
- **Arguments": dividend, divisor
- **Widgets": {}
- **Status": Implemented

---

## Set Objective State (`SET_OBJECTIVE_STATE`)
- **Type": ACTIONS
- **Color": #F9A825
- **Description": Sets the state of an objective.
- **Arguments": objective, state
- **Widgets": {}
- **Status": Implemented

---

## Get Objective State (`GET_OBJECTIVE_STATE`)
- **Type": VALUE
- **Color": #F9A825
- **Description": Gets the state of an objective.
- **Arguments": objective
- **Widgets": {}
- **Status": Implemented

---

## Comment (`COMMENT`)
- **Type": ACTIONS
- **Color": #9E9E9E
- **Description": Adds a comment to the logic for documentation.
- **Arguments": text
- **Widgets": {}
- **Status": Implemented

---

## Get Player By Id (`GET_PLAYER_BY_ID`)
- **Type": VALUE
- **Color": #C2185B
- **Description": Gets a player by their ID.
- **Arguments": player_id
- **Widgets": {}
- **Status": Implemented

---

## Get Player Name (`GET_PLAYER_NAME`)
- **Type": VALUE
- **Color": #C2185B
- **Description": Gets the name of a player.
- **Arguments": player
- **Widgets": {}
- **Status": Implemented

---

## Get Player Health (`GET_PLAYER_HEALTH`)
- **Type": VALUE
- **Color": #C2185B
- **Description": Gets the health of a player.
- **Arguments": player
- **Widgets": {}
- **Status": Implemented

---

## Teleport Player (`TELEPORT_PLAYER`)
- **Type": ACTION
- **Color": #C2185B
- **Description": Teleports a player to a specific location.
- **Arguments": player, position
- **Widgets": {}
- **Status": Implemented

---

## Kill Player (`KILL_PLAYER`)
- **Type": ACTION
- **Color": #C2185B
- **Description": Kills a player.
- **Arguments": player
- **Widgets": {}
- **Status": Implemented

---

## Get Player Team (`GET_PLAYER_TEAM`)
- **Type": VALUE
- **Color": #C2185B
- **Description": Gets the team of a player.
- **Arguments": player
- **Widgets": {}
- **Status": Implemented

---

## Set Player Team (`SET_PLAYER_TEAM`)
- **Type": ACTION
- **Color": #C2185B
- **Description": Sets the team of a player.
- **Arguments": player, team
- **Widgets": {}
- **Status": Implemented

---

## SUBROUTINE: (`SUBROUTINE_BLOCK`)
- **Type": SUBROUTINE
- **Color": #E6A85C
- **Description": Reusable logic blocks that can be called from multiple places.
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Call Subroutine: (`SUBROUTINE_REFERENCE_BLOCK`)
- **Type": ACTION
- **Color": #E6A85C
- **Description": Calls a defined subroutine.
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Control Action: (`CONTROL_ACTION_BLOCK`)
- **Type": ACTION
- **Color": #A285E6
- **Description": A placeholder control action block.
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Vector (`VECTOR`)
- **Type": VALUE
- **Color": #212121
- **Description": Creates a vector from X, Y, Z components
- **Arguments": x, y, z
- **Widgets": {}
- **Status": Implemented

---

## Vector Towards (`VECTOR_TOWARDS`)
- **Type": VALUE
- **Color": #212121
- **Description": Creates a direction vector from start to end
- **Arguments": start_pos, end_pos
- **Widgets": {}
- **Status": Implemented

---

## Distance Between (`DISTANCE_BETWEEN`)
- **Type": VALUE
- **Color": #212121
- **Description": Returns distance between two positions
- **Arguments": position_a, position_b
- **Widgets": {}
- **Status": Implemented

---

## X Component Of (`X_COMPONENT_OF`)
- **Type": VALUE
- **Color": #212121
- **Description": Returns the X component of a vector
- **Arguments": vector
- **Widgets": {}
- **Status": Implemented

---

## Y Component Of (`Y_COMPONENT_OF`)
- **Type": VALUE
- **Color": #212121
- **Description": Returns the Y component of a vector
- **Arguments": vector
- **Widgets": {}
- **Status": Implemented

---

## Z Component Of (`Z_COMPONENT_OF`)
- **Type": VALUE
- **Color": #212121
- **Description": Returns the Z component of a vector
- **Arguments": vector
- **Widgets": {}
- **Status": Implemented

---

## Normalize (`NORMALIZE`)
- **Type": VALUE
- **Color": #212121
- **Description": Returns a normalized vector (length 1)
- **Arguments": vector
- **Widgets": {}
- **Status": Implemented

---

## Dot Product (`DOT_PRODUCT`)
- **Type": VALUE
- **Color": #212121
- **Description": Returns the dot product of two vectors
- **Arguments": vector_a, vector_b
- **Widgets": {}
- **Status": Implemented

---

## Cross Product (`CROSS_PRODUCT`)
- **Type": VALUE
- **Color": #212121
- **Description": Returns the cross product of two vectors
- **Arguments": vector_a, vector_b
- **Widgets": {}
- **Status": Implemented

---

## Magnitude Of (`VECTOR_MAGNITUDE`)
- **Type": VALUE
- **Color": #212121
- **Description": Returns the length of a vector
- **Arguments": vector
- **Widgets": {}
- **Status": Implemented

---

## Up (`UP`)
- **Type": VALUE
- **Color": #212121
- **Description": Returns the up direction vector (0, 1, 0)
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Down (`DOWN`)
- **Type": VALUE
- **Color": #212121
- **Description": Returns the down direction vector (0, -1, 0)
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Left (`LEFT`)
- **Type": VALUE
- **Color": #212121
- **Description": Returns the left direction vector (-1, 0, 0)
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Right (`RIGHT`)
- **Type": VALUE
- **Color": #212121
- **Description": Returns the right direction vector (1, 0, 0)
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Forward (`FORWARD`)
- **Type": VALUE
- **Color": #212121
- **Description": Returns the forward direction vector (0, 0, 1)
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Backward (`BACKWARD`)
- **Type": VALUE
- **Color": #212121
- **Description": Returns the backward direction vector (0, 0, -1)
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Show Message (`SHOW_MESSAGE`)
- **Type": ACTIONS
- **Color": #607D8B
- **Description": Shows a message to the player
- **Arguments": player, message, duration
- **Widgets": {}
- **Status": Implemented

---

## Show Big Message (`SHOW_BIG_MESSAGE`)
- **Type": ACTIONS
- **Color": #607D8B
- **Description": Shows a large message on screen
- **Arguments": player, title, subtitle, duration
- **Widgets": {}
- **Status": Implemented

---

## Show Notification (`SHOW_NOTIFICATION`)
- **Type": ACTIONS
- **Color": #607D8B
- **Description": Shows a notification toast
- **Arguments": player, text, icon
- **Widgets": {}
- **Status": Implemented

---

## Set HUD Visible (`SET_HUD_VISIBLE`)
- **Type": ACTIONS
- **Color": #607D8B
- **Description": Shows or hides specific HUD elements
- **Arguments": player, hud_element, visible
- **Widgets": {}
- **Status": Implemented

---

## Update HUD Text (`UPDATE_HUD_TEXT`)
- **Type": ACTIONS
- **Color": #607D8B
- **Description": Updates text on a custom HUD element
- **Arguments": player, hud_id, text
- **Widgets": {}
- **Status": Implemented

---

## Create Custom HUD (`CREATE_CUSTOM_HUD`)
- **Type": ACTIONS
- **Color": #607D8B
- **Description": Creates a custom HUD layout
- **Arguments": player, hud_config
- **Widgets": {}
- **Status": Implemented

---

## Create World Marker (`CREATE_WORLD_MARKER`)
- **Type": ACTIONS
- **Color": #607D8B
- **Description": Creates a 3D marker in the world
- **Arguments": location, icon, text
- **Widgets": {}
- **Status": Implemented

---

## Remove World Marker (`REMOVE_WORLD_MARKER`)
- **Type": ACTIONS
- **Color": #607D8B
- **Description": Removes a world marker
- **Arguments": marker_id
- **Widgets": {}
- **Status": Implemented

---

## Set Objective Marker (`SET_OBJECTIVE_MARKER`)
- **Type": ACTIONS
- **Color": #607D8B
- **Description": Sets the objective marker for a player
- **Arguments": player, location, text
- **Widgets": {}
- **Status": Implemented

---

## Update Scoreboard (`UPDATE_SCOREBOARD`)
- **Type": ACTIONS
- **Color": #607D8B
- **Description": Updates the scoreboard data
- **Arguments": entries
- **Widgets": {}
- **Status": Implemented

---

## Show Scoreboard (`SHOW_SCOREBOARD`)
- **Type": ACTIONS
- **Color": #607D8B
- **Description": Forces the scoreboard to show or hide
- **Arguments": player, visible
- **Widgets": {}
- **Status": Implemented

---

## Number (`NUMBER`)
- **Type": VALUE
- **Color": #0288D1
- **Description": A numeric value
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## String (`STRING`)
- **Type": VALUE
- **Color": #0288D1
- **Description": A text value
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Boolean (`BOOLEAN`)
- **Type": VALUE
- **Color": #0288D1
- **Description": A true/false value
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Set Variable (`SET_VARIABLE`)
- **Type": ACTIONS
- **Color": #0288D1
- **Description": Sets the value of a variable
- **Arguments": variable, value
- **Widgets": {}
- **Status": Implemented

---

## Get Variable (`GET_VARIABLE`)
- **Type": VALUE
- **Color": #0288D1
- **Description": Gets the value of a variable
- **Arguments": variable_name
- **Widgets": {}
- **Status": Implemented

---

## Spawn Vehicle (`SPAWN_VEHICLE`)
- **Type": ACTIONS
- **Color": #E64A19
- **Description": Spawns a vehicle at a location
- **Arguments": vehicle_type, location, team
- **Widgets": {}
- **Status": Implemented

---

## Despawn Vehicle (`DESPAWN_VEHICLE`)
- **Type": ACTIONS
- **Color": #E64A19
- **Description": Removes a vehicle from the game
- **Arguments": vehicle
- **Widgets": {}
- **Status": Implemented

---

## Tank (`VEHICLE_TYPE_TANK`)
- **Type": VALUE
- **Color": #E64A19
- **Description": Tank vehicle type
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## APC (`VEHICLE_TYPE_APC`)
- **Type": VALUE
- **Color": #E64A19
- **Description": APC vehicle type
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Helicopter (`VEHICLE_TYPE_HELICOPTER`)
- **Type": VALUE
- **Color": #E64A19
- **Description": Helicopter vehicle type
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Jet (`VEHICLE_TYPE_JET`)
- **Type": VALUE
- **Color": #E64A19
- **Description": Jet vehicle type
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Transport (`VEHICLE_TYPE_TRANSPORT`)
- **Type": VALUE
- **Color": #E64A19
- **Description": Transport vehicle type
- **Arguments": None
- **Widgets": {}
- **Status": Implemented

---

## Get Vehicle Health (`GET_VEHICLE_HEALTH`)
- **Type": VALUE
- **Color": #E64A19
- **Description": Returns the current health of a vehicle
- **Arguments": vehicle
- **Widgets": {}
- **Status": Implemented

---

## Set Vehicle Health (`SET_VEHICLE_HEALTH`)
- **Type": ACTIONS
- **Color": #E64A19
- **Description": Sets the health of a vehicle
- **Arguments": vehicle, health
- **Widgets": {}
- **Status": Implemented

---

## Get Vehicle Driver (`GET_VEHICLE_DRIVER`)
- **Type": VALUE
- **Color": #E64A19
- **Description": Returns the player driving the vehicle
- **Arguments": vehicle
- **Widgets": {}
- **Status": Implemented

---

## Eject from Vehicle (`EJECT_FROM_VEHICLE`)
- **Type": ACTIONS
- **Color": #E64A19
- **Description": Forces a player out of a vehicle
- **Arguments": player, vehicle
- **Widgets": {}
- **Status": Implemented

---

## Lock Vehicle (`LOCK_VEHICLE`)
- **Type": ACTIONS
- **Color": #E64A19
- **Description": Locks a vehicle for a specific team
- **Arguments": vehicle, team
- **Widgets": {}
- **Status": Implemented

---

## Set Vehicle Speed (`SET_VEHICLE_SPEED`)
- **Type": ACTIONS
- **Color": #E64A19
- **Description": Sets the speed of a vehicle
- **Arguments": vehicle, speed
- **Widgets": {}
- **Status": Implemented

---

## Disable Vehicle (`DISABLE_VEHICLE`)
- **Type": ACTIONS
- **Color": #E64A19
- **Description": Disables vehicle movement and weapons
- **Arguments": vehicle
- **Widgets": {}
- **Status": Implemented

---

## Enable Vehicle (`ENABLE_VEHICLE`)
- **Type": ACTIONS
- **Color": #E64A19
- **Description": Enables vehicle movement and weapons
- **Arguments": vehicle
- **Widgets": {}
- **Status": Implemented

---

## Boot Screen Implementation
- **Description:** A placeholder boot screen has been implemented in `web_ui/index.html` and `web_ui/main.js`. It displays "Loading BF6 Portal Editor..." for 3 seconds before hiding.
- **Status:** Implemented

---