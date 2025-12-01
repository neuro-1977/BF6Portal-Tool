# Blockly Block Database

This document lists all identified Blockly blocks, their properties, and current implementation status.

## AIBattlefieldBehaviour (`AIBATTLEFIELDBEHAVIOUR`)
- **Type:** ACTIONS
- **Color:** #B5A045
- **Description:** 
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## AIDefendPositionBehaviour (`AIDEFENDPOSITIONBEHAVIOUR`)
- **Type:** ACTIONS
- **Color:** #B5A045
- **Description:** 
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## AIIdleBehaviour (`AIIDLEBEHAVIOUR`)
- **Type:** ACTIONS
- **Color:** #B5A045
- **Description:** 
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## AILOSMoveTOBehaviour (`AILOSMOVETOBEHAVIOUR`)
- **Type:** ACTIONS
- **Color:** #B5A045
- **Description:** 
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## AIMoveToBehaviour (`AIMOVETOBEHAVIOUR`)
- **Type:** ACTIONS
- **Color:** #B5A045
- **Description:** 
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## AIParachuteBehaviour (`AIPARACHUTEBEHAVIOUR`)
- **Type:** ACTIONS
- **Color:** #B5A045
- **Description:** 
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## AIValidateMoveToBehaviour (`AIVALIDATEMOVETOBEHAVIOUR`)
- **Type:** ACTIONS
- **Color:** #B5A045
- **Description:** 
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## AIWaypointIdleBehaviour (`AIWAYPOINTIDLEBEHAVIOUR`)
- **Type:** ACTIONS
- **Color:** #B5A045
- **Description:** 
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## Set Player Health (`SETPLAYERHEALTH`)
- **Type:** ACTION
- **Color:** #C2185B
- **Description:** Sets the health of a player.
- **Arguments:** player, health
- **Widgets:** None
- **Status:** Implemented

---

## SetPlayerLoadout (`SETPLAYERLOADOUT`)
- **Type:** ACTIONS
- **Color:** #B5A045
- **Description:** 
- **Arguments:** player, loadout
- **Widgets:** None
- **Status:** Implemented

---

## Teleport (`TELEPORT`)
- **Type:** ACTIONS
- **Color:** #B5A045
- **Description:** 
- **Arguments:** player, location
- **Widgets:** None
- **Status:** Implemented

---

## End Round (`ENDROUND`)
- **Type:** ACTION
- **Color:** #5D4037
- **Description:** Ends the round, declaring a winning team.
- **Arguments:** winning_team
- **Widgets:** None
- **Status:** Implemented

---

## PauseRound (`PAUSEROUND`)
- **Type:** ACTIONS
- **Color:** #B5A045
- **Description:** 
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## AI Battlefield Behavior (`AIBATTLEFIELDBEHAVIOR`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Sets the AI to standard battlefield combat behavior
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## AI Defend Position Behavior (`AIDEFENDPOSITIONBEHAVIOR`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Orders AI to defend a specific area
- **Arguments:** player, position, radius, time
- **Widgets:** None
- **Status:** Implemented

---

## AI Idle Behavior (`AIIDLEBEHAVIOR`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Sets the AI to idle state
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## AI Move To Behavior (`AIMOVETOBEHAVIOR`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Orders AI to move to a location
- **Arguments:** player, position, sprint
- **Widgets:** None
- **Status:** Implemented

---

## AI Parachute Behavior (`AIPARACHUTEBEHAVIOR`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Orders AI to deploy parachute
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## AI Waypoint Idle Behavior (`AIWAYPOINTIDLEBEHAVIOR`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** AI waits at a waypoint for a duration
- **Arguments:** player, time
- **Widgets:** None
- **Status:** Implemented

---

## AI Follow Player (`AIFOLLOWPLAYER`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Orders AI to follow a specific player
- **Arguments:** ai_player, target_player, distance
- **Widgets:** None
- **Status:** Implemented

---

## AI Hold Position (`AIHOLDPOSITION`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Orders AI to hold their current position
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## AI Attack Target (`AIATTACKTARGET`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Orders AI to attack a specific target
- **Arguments:** ai_player, target_player
- **Widgets:** None
- **Status:** Implemented

---

## Set AI Behavior (`SETAIBEHAVIOR`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Sets the general behavior mode for the AI
- **Arguments:** player, behavior_mode
- **Widgets:** None
- **Status:** Implemented

---

## Deploy AI (`DEPLOYAI`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Spawns a new AI soldier
- **Arguments:** team, soldier_type, position, kit
- **Widgets:** None
- **Status:** Implemented

---

## Despawn AI (`DESPAWNAI`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Removes an AI soldier from the game
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## Set AI Spawn Location (`SETAISPAWNLOCATION`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Sets where AI soldiers will spawn
- **Arguments:** team, position
- **Widgets:** None
- **Status:** Implemented

---

## Set AI Health (`SETAIHEALTH`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Sets the health of an AI soldier
- **Arguments:** player, amount
- **Widgets:** None
- **Status:** Implemented

---

## Set AI Team (`SETAITEAM`)
- **Type:** ACTIONS
- **Color:** #D32F2F
- **Description:** Changes the team of an AI soldier
- **Arguments:** player, team_id
- **Widgets:** None
- **Status:** Implemented

---

## Get AI Health (`GETAIHEALTH`)
- **Type:** VALUE
- **Color:** #D32F2F
- **Description:** Returns the current health of an AI soldier
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## Get AI Team (`GETAITEAM`)
- **Type:** VALUE
- **Color:** #D32F2F
- **Description:** Returns the team ID of an AI soldier
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## AI Is Alive (`AIISALIVE`)
- **Type:** CONDITION
- **Color:** #D32F2F
- **Description:** Checks if an AI soldier is currently alive
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## Create Array (`CREATEARRAY`)
- **Type:** VALUE
- **Color:** #0097A7
- **Description:** Creates an empty array.
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Array Length (`ARRAYLENGTH`)
- **Type:** VALUE
- **Color:** #0097A7
- **Description:** Returns the number of elements in an array.
- **Arguments:** array
- **Widgets:** None
- **Status:** Implemented

---

## Get Element (`GETELEMENT`)
- **Type:** VALUE
- **Color:** #0097A7
- **Description:** Returns the element at a specific index in an array.
- **Arguments:** array, index
- **Widgets:** None
- **Status:** Implemented

---

## Set Element (`SETELEMENT`)
- **Type:** ACTION
- **Color:** #0097A7
- **Description:** Sets the element at a specific index in an array.
- **Arguments:** array, index, value
- **Widgets:** None
- **Status:** Implemented

---

## Append To Array (`APPENDTOARRAY`)
- **Type:** ACTION
- **Color:** #0097A7
- **Description:** Adds a value to the end of an array.
- **Arguments:** array, value
- **Widgets:** None
- **Status:** Implemented

---

## Remove From Array (`REMOVEFROMARRAY`)
- **Type:** ACTION
- **Color:** #0097A7
- **Description:** Removes an element from an array at a specific index.
- **Arguments:** array, index
- **Widgets:** None
- **Status:** Implemented

---

## Find First (`FINDFIRST`)
- **Type:** VALUE
- **Color:** #0097A7
- **Description:** Finds the first index of a value in an array. Returns -1 if not found.
- **Arguments:** array, value
- **Widgets:** None
- **Status:** Implemented

---

## Sort Array (`SORTARRAY`)
- **Type:** ACTION
- **Color:** #0097A7
- **Description:** Sorts an array in ascending or descending order.
- **Arguments:** array, order
- **Widgets:** None
- **Status:** Implemented

---

## LoadMusic (`LOADMUSIC`)
- **Type:** ACTIONS
- **Color:** #455A64
- **Description:** 
- **Arguments:** music_id
- **Widgets:** None
- **Status:** Implemented

---

## PlayMusic (`PLAYMUSIC`)
- **Type:** ACTIONS
- **Color:** #455A64
- **Description:** 
- **Arguments:** music_id, players
- **Widgets:** None
- **Status:** Implemented

---

## SetMusicParam (`SETMUSICPARAM`)
- **Type:** ACTIONS
- **Color:** #455A64
- **Description:** 
- **Arguments:** music_id, param, players
- **Widgets:** None
- **Status:** Implemented

---

## UnloadMusic (`UNLOADMUSIC`)
- **Type:** ACTIONS
- **Color:** #455A64
- **Description:** 
- **Arguments:** music_id
- **Widgets:** None
- **Status:** Implemented

---

## PlaySound (`PLAYSOUND`)
- **Type:** ACTIONS
- **Color:** #455A64
- **Description:** 
- **Arguments:** sound_id, position, players, volume, pitch
- **Widgets:** None
- **Status:** Implemented

---

## PlayVO (`PLAYVO`)
- **Type:** ACTIONS
- **Color:** #455A64
- **Description:** 
- **Arguments:** vo_id, speaker, listener, players
- **Widgets:** None
- **Status:** Implemented

---

## StopSound (`STOPSOUND`)
- **Type:** ACTIONS
- **Color:** #455A64
- **Description:** 
- **Arguments:** sound_id, players
- **Widgets:** None
- **Status:** Implemented

---

## Set Player Camera (`SETPLAYERCAMERA`)
- **Type:** ACTIONS
- **Color:** #37474F
- **Description:** Sets the camera mode for a specific player
- **Arguments:** player, camera_mode
- **Widgets:** None
- **Status:** Implemented

---

## Lock Camera to Target (`LOCKCAMERATOTARGET`)
- **Type:** ACTIONS
- **Color:** #37474F
- **Description:** Locks the player's camera to look at a target
- **Arguments:** player, target
- **Widgets:** None
- **Status:** Implemented

---

## Camera Shake (`CAMERASHAKE`)
- **Type:** ACTIONS
- **Color:** #37474F
- **Description:** Applies a shake effect to the player's camera
- **Arguments:** player, intensity, duration
- **Widgets:** None
- **Status:** Implemented

---

## Set Camera FOV (`SETCAMERAFOV`)
- **Type:** ACTIONS
- **Color:** #37474F
- **Description:** Sets the Field of View for the player's camera
- **Arguments:** player, fov
- **Widgets:** None
- **Status:** Implemented

---

## Reset Camera (`RESETCAMERA`)
- **Type:** ACTIONS
- **Color:** #37474F
- **Description:** Resets the player's camera to default
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## First Person Camera (`FIRSTPERSONCAMERA`)
- **Type:** VALUE
- **Color:** #37474F
- **Description:** First person camera mode
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Third Person Camera (`THIRDPERSONCAMERA`)
- **Type:** VALUE
- **Color:** #37474F
- **Description:** Third person camera mode
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Free Camera (`FREECAMERA`)
- **Type:** VALUE
- **Color:** #37474F
- **Description:** Free camera mode
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Spectator Camera (`SPECTATORCAMERA`)
- **Type:** VALUE
- **Color:** #37474F
- **Description:** Spectator camera mode
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Equal (`EQUAL`)
- **Type:** VALUE
- **Color:** #1976D2
- **Description:** Returns True if inputs are equal
- **Arguments:** a, b
- **Widgets:** None
- **Status:** Implemented

---

## Not Equal (`NOTEQUAL`)
- **Type:** VALUE
- **Color:** #1976D2
- **Description:** Returns True if inputs are not equal
- **Arguments:** a, b
- **Widgets:** None
- **Status:** Implemented

---

## Less Than (`LESSTHAN`)
- **Type:** VALUE
- **Color:** #1976D2
- **Description:** Returns True if A < B
- **Arguments:** a, b
- **Widgets:** None
- **Status:** Implemented

---

## Less Than Or Equal (`LESSTHANOREQUAL`)
- **Type:** CONDITIONS
- **Color:** #45B5B5
- **Description:** Returns true if A is less than or equal to B
- **Arguments:** value_a, value_b
- **Widgets:** None
- **Status:** Implemented

---

## Greater Than (`GREATERTHAN`)
- **Type:** VALUE
- **Color:** #1976D2
- **Description:** Returns True if A > B
- **Arguments:** a, b
- **Widgets:** None
- **Status:** Implemented

---

## Greater Than Or Equal (`GREATERTHANOREQUAL`)
- **Type:** CONDITIONS
- **Color:** #45B5B5
- **Description:** Returns true if A is greater than or equal to B
- **Arguments:** value_a, value_b
- **Widgets:** None
- **Status:** Implemented

---

## Play Effect (`PLAYEFFECT`)
- **Type:** ACTIONS
- **Color:** #263238
- **Description:** Plays a visual effect at a location
- **Arguments:** effect_type, location, scale
- **Widgets:** None
- **Status:** Implemented

---

## Stop Effect (`STOPEFFECT`)
- **Type:** ACTIONS
- **Color:** #263238
- **Description:** Stops a playing effect
- **Arguments:** effect_id
- **Widgets:** None
- **Status:** Implemented

---

## Particle Effect (`PARTICLEEFFECT`)
- **Type:** VALUE
- **Color:** #263238
- **Description:** Returns a particle effect type
- **Arguments:** particle_type
- **Widgets:** None
- **Status:** Implemented

---

## Explosion Effect (`EXPLOSIONEFFECT`)
- **Type:** VALUE
- **Color:** #263238
- **Description:** Returns an explosion effect type
- **Arguments:** explosion_type
- **Widgets:** None
- **Status:** Implemented

---

## Screen Flash (`SCREENFLASH`)
- **Type:** ACTIONS
- **Color:** #263238
- **Description:** Flashes the player's screen with a color
- **Arguments:** player, color, duration
- **Widgets:** None
- **Status:** Implemented

---

## Screen Fade (`SCREENFADE`)
- **Type:** ACTIONS
- **Color:** #263238
- **Description:** Fades the player's screen
- **Arguments:** player, fade_type, duration
- **Widgets:** None
- **Status:** Implemented

---

## Apply Screen Filter (`APPLYSCREENFILTER`)
- **Type:** ACTIONS
- **Color:** #263238
- **Description:** Applies a visual filter to the player's screen
- **Arguments:** player, filter_type
- **Widgets:** None
- **Status:** Implemented

---

## DeployEmplacement (`DEPLOYEMPLACEMENT`)
- **Type:** ACTIONS
- **Color:** #8D6E63
- **Description:** 
- **Arguments:** emplacement_id, position, rotation
- **Widgets:** None
- **Status:** Implemented

---

## On Game Start (`ON_START`)
- **Type:** EVENTS
- **Color:** #5D4037
- **Description:** 
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## On Player Join (`ON_PLAYER_JOIN`)
- **Type:** EVENTS
- **Color:** #5D4037
- **Description:** 
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## Event Attacker (`EVENTATTACKER`)
- **Type:** VALUE
- **Color:** #5D4037
- **Description:** The player who caused the event (e.g. the killer)
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Event Damage (`EVENTDAMAGE`)
- **Type:** VALUE
- **Color:** #5D4037
- **Description:** The amount of damage dealt in the event
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Event Location (`EVENTLOCATION`)
- **Type:** VALUE
- **Color:** #5D4037
- **Description:** The location where the event occurred
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Event Player (`EVENTPLAYER`)
- **Type:** VALUE
- **Color:** #5D4037
- **Description:** The primary player involved in the event
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Event Team (`EVENTTEAM`)
- **Type:** VALUE
- **Color:** #5D4037
- **Description:** The team involved in the event
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Event Victim (`EVENTVICTIM`)
- **Type:** VALUE
- **Color:** #5D4037
- **Description:** The player who was the victim of the event
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Event Weapon (`EVENTWEAPON`)
- **Type:** VALUE
- **Color:** #5D4037
- **Description:** The weapon used in the event
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Get Gamemode (`GETGAMEMODE`)
- **Type:** VALUE
- **Color:** #5D4037
- **Description:** Gets the current gamemode.
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Set Gamemode (`SETGAMEMODE`)
- **Type:** ACTION
- **Color:** #5D4037
- **Description:** Sets the current gamemode.
- **Arguments:** gamemode
- **Widgets:** None
- **Status:** Implemented

---

## Enable Friendly Fire (`ENABLEFRIENDLYFIRE`)
- **Type:** ACTION
- **Color:** #5D4037
- **Description:** Enables or disables friendly fire.
- **Arguments:** enabled
- **Widgets:** None
- **Status:** Implemented

---

## Set Score (`SETSCORE`)
- **Type:** ACTION
- **Color:** #5D4037
- **Description:** Sets the score for a team.
- **Arguments:** team, score
- **Widgets:** None
- **Status:** Implemented

---

## Get Score (`GETSCORE`)
- **Type:** VALUE
- **Color:** #5D4037
- **Description:** Gets the score for a team.
- **Arguments:** team
- **Widgets:** None
- **Status:** Implemented

---

## Set Time Limit (`SETTIMELIMIT`)
- **Type:** ACTION
- **Color:** #5D4037
- **Description:** Sets the time limit for the round.
- **Arguments:** time_limit
- **Widgets:** None
- **Status:** Implemented

---

## Get Time Limit (`GETTIMELIMIT`)
- **Type:** VALUE
- **Color:** #5D4037
- **Description:** Gets the time limit for the round.
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Wait (`WAIT`)
- **Type:** ACTIONS
- **Color:** #1976D2
- **Description:** Pauses execution for a specified time
- **Arguments:** seconds
- **Widgets:** None
- **Status:** Implemented

---

## Wait Until (`WAITUNTIL`)
- **Type:** ACTIONS
- **Color:** #1976D2
- **Description:** Pauses execution until condition is true
- **Arguments:** condition, timeout
- **Widgets:** None
- **Status:** Implemented

---

## Break (`BREAK`)
- **Type:** SEQUENCE
- **Color:** #1976D2
- **Description:** Exits the current loop immediately
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Continue (`CONTINUE`)
- **Type:** SEQUENCE
- **Color:** #1976D2
- **Description:** Skips to the next iteration of the current loop
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## If (`IF`)
- **Type:** C_SHAPED
- **Color:** #1976D2
- **Description:** Executes nested blocks if condition is true
- **Arguments:** condition
- **Widgets:** None
- **Status:** Implemented

---

## While (`WHILE`)
- **Type:** C_SHAPED
- **Color:** #1976D2
- **Description:** Repeats nested blocks while condition is true
- **Arguments:** condition
- **Widgets:** None
- **Status:** Implemented

---

## And (`AND`)
- **Type:** VALUE
- **Color:** #1976D2
- **Description:** Returns True if both inputs are True
- **Arguments:** a, b
- **Widgets:** None
- **Status:** Implemented

---

## Or (`OR`)
- **Type:** VALUE
- **Color:** #1976D2
- **Description:** Returns True if either input is True
- **Arguments:** a, b
- **Widgets:** None
- **Status:** Implemented

---

## Not (`NOT`)
- **Type:** VALUE
- **Color:** #1976D2
- **Description:** Returns the opposite boolean value
- **Arguments:** a
- **Widgets:** None
- **Status:** Implemented

---

## True (`TRUE`)
- **Type:** VALUE
- **Color:** #1976D2
- **Description:** Boolean True value
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## False (`FALSE`)
- **Type:** VALUE
- **Color:** #1976D2
- **Description:** Boolean False value
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Greater Than Or Equal (`GREATERTHANEQUAL`)
- **Type:** VALUE
- **Color:** #1976D2
- **Description:** Returns True if A >= B
- **Arguments:** a, b
- **Widgets:** None
- **Status:** Implemented

---

## Less Than Or Equal (`LESSTHANEQUAL`)
- **Type:** VALUE
- **Color:** #1976D2
- **Description:** Returns True if A <= B
- **Arguments:** a, b
- **Widgets:** None
- **Status:** Implemented

---

## ForVariable (`FORVARIABLE`)
- **Type:** C_SHAPED
- **Color:** #1976D2
- **Description:** Loops from starting value to ending value by increment
- **Arguments:** from_value, to_value, by_value
- **Widgets:** None
- **Status:** Implemented

---

## Add (`ADD`)
- **Type:** VALUE
- **Color:** #1976D2
- **Description:** Returns the sum of A and B
- **Arguments:** value_a, value_b
- **Widgets:** None
- **Status:** Implemented

---

## Subtract (`SUBTRACT`)
- **Type:** VALUE
- **Color:** #1976D2
- **Description:** Returns the difference of A and B
- **Arguments:** value_a, value_b
- **Widgets:** None
- **Status:** Implemented

---

## Multiply (`MULTIPLY`)
- **Type:** VALUE
- **Color:** #1976D2
- **Description:** Returns the product of A and B
- **Arguments:** value_a, value_b
- **Widgets:** None
- **Status:** Implemented

---

## Divide (`DIVIDE`)
- **Type:** VALUE
- **Color:** #1976D2
- **Description:** Returns the quotient of A and B
- **Arguments:** value_a, value_b
- **Widgets:** None
- **Status:** Implemented

---

## Power (`POWER`)
- **Type:** VALUE
- **Color:** #1976D2
- **Description:** Returns the base to the exponent power.
- **Arguments:** base, exponent
- **Widgets:** None
- **Status:** Implemented

---

## Square Root (`SQUAREROOT`)
- **Type:** VALUE
- **Color:** #1976D2
- **Description:** Returns the square root of a number.
- **Arguments:** value
- **Widgets:** None
- **Status:** Implemented

---

## Absolute (`ABSOLUTE`)
- **Type:** VALUE
- **Color:** #1976D2
- **Description:** Returns the absolute value of a number.
- **Arguments:** value
- **Widgets:** None
- **Status:** Implemented

---

## Modulo (`MODULO`)
- **Type:** VALUE
- **Color:** #1976D2
- **Description:** Returns the remainder of a division.
- **Arguments:** dividend, divisor
- **Widgets:** None
- **Status:** Implemented

---

## MOD (`MOD_BLOCK`)
- **Type:** MOD
- **Color:** #4A4A4A
- **Description:** 
- **Arguments:** mod_name, description
- **Widgets:** {"mod_name": {"type": "text_input", "default": "MyGameMode"}, "description": {"type": "text_input", "default": "Description"}}
- **Status:** Implemented

---

## SetObjectiveState (`SETOBJECTIVESTATE`)
- **Type:** ACTIONS
- **Color:** #F9A825
- **Description:** 
- **Arguments:** objective, state
- **Widgets:** None
- **Status:** Implemented

---

## GetObjectiveState (`GETOBJECTIVESTATE`)
- **Type:** VALUE
- **Color:** #F9A825
- **Description:** 
- **Arguments:** objective
- **Widgets:** None
- **Status:** Implemented

---

## Comment (`COMMENT`)
- **Type:** ACTIONS
- **Color:** #9E9E9E
- **Description:** 
- **Arguments:** text
- **Widgets:** None
- **Status:** Implemented

---

## Get Player By Id (`GETPLAYERBYID`)
- **Type:** VALUE
- **Color:** #C2185B
- **Description:** Gets a player by their ID.
- **Arguments:** player_id
- **Widgets:** None
- **Status:** Implemented

---

## Get Player Name (`GETPLAYERNAME`)
- **Type:** VALUE
- **Color:** #C2185B
- **Description:** Gets the name of a player.
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## Get Player Health (`GETPLAYERHEALTH`)
- **Type:** VALUE
- **Color:** #C2185B
- **Description:** Gets the health of a player.
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## Teleport Player (`TELEPORTPLAYER`)
- **Type:** ACTION
- **Color:** #C2185B
- **Description:** Teleports a player to a specific location.
- **Arguments:** player, position
- **Widgets:** None
- **Status:** Implemented

---

## Kill Player (`KILLPLAYER`)
- **Type:** ACTION
- **Color:** #C2185B
- **Description:** Kills a player.
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## Get Player Team (`GETPLAYERTEAM`)
- **Type:** VALUE
- **Color:** #C2185B
- **Description:** Gets the team of a player.
- **Arguments:** player
- **Widgets:** None
- **Status:** Implemented

---

## Set Player Team (`SETPLAYERTEAM`)
- **Type:** ACTION
- **Color:** #C2185B
- **Description:** Sets the team of a player.
- **Arguments:** player, team
- **Widgets:** None
- **Status:** Implemented

---

## RULE (`RULE_HEADER`)
- **Type:** RULES
- **Color:** #A285E6
- **Description:** 
- **Arguments:** rule_name, event_type, scope, is_global
- **Widgets:** {"rule_name": {"type": "text_input", "default": "New Rule"}, "event_type": {"type": "dropdown", "options": ["Ongoing", "OnPlayerJoin", "OnPlayerDeath", "OnPlayerSpawn"], "default": "Ongoing"}, "scope": {"type": "dropdown", "options": ["Global", "Team", "Squad", "Player"], "default": "Global"}}
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

## Call Subroutine (`CALLSUBROUTINE`)
- **Type:** SEQUENCE
- **Color:** #E6A85C
- **Description:** Executes a subroutine
- **Arguments:** subroutine_name
- **Widgets:** {"subroutine_name": {"type": "dropdown", "options": ["NewSubroutine"], "default": "NewSubroutine"}}
- **Status:** Implemented

---

## Return (`RETURN`)
- **Type:** SEQUENCE
- **Color:** #E6A85C
- **Description:** Returns from the current subroutine
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Vector (`VECTOR`)
- **Type:** VALUE
- **Color:** #212121
- **Description:** Creates a vector from X, Y, Z components
- **Arguments:** x, y, z
- **Widgets:** None
- **Status:** Implemented

---

## Vector Towards (`VECTORTOWARDS`)
- **Type:** VALUE
- **Color:** #212121
- **Description:** Creates a direction vector from start to end
- **Arguments:** start_pos, end_pos
- **Widgets:** None
- **Status:** Implemented

---

## Distance Between (`DISTANCEBETWEEN`)
- **Type:** VALUE
- **Color:** #212121
- **Description:** Returns distance between two positions
- **Arguments:** position_a, position_b
- **Widgets:** None
- **Status:** Implemented

---

## X Component Of (`XCOMPONENTOF`)
- **Type:** VALUE
- **Color:** #212121
- **Description:** Returns the X component of a vector
- **Arguments:** vector
- **Widgets:** None
- **Status:** Implemented

---

## Y Component Of (`YCOMPONENTOF`)
- **Type:** VALUE
- **Color:** #212121
- **Description:** Returns the Y component of a vector
- **Arguments:** vector
- **Widgets:** None
- **Status:** Implemented

---

## Z Component Of (`ZCOMPONENTOF`)
- **Type:** VALUE
- **Color:** #212121
- **Description:** Returns the Z component of a vector
- **Arguments:** vector
- **Widgets:** None
- **Status:** Implemented

---

## Normalize (`NORMALIZE`)
- **Type:** VALUE
- **Color:** #212121
- **Description:** Returns a normalized vector (length 1)
- **Arguments:** vector
- **Widgets:** None
- **Status:** Implemented

---

## Dot Product (`DOTPRODUCT`)
- **Type:** VALUE
- **Color:** #212121
- **Description:** Returns the dot product of two vectors
- **Arguments:** vector_a, vector_b
- **Widgets:** None
- **Status:** Implemented

---

## Cross Product (`CROSSPRODUCT`)
- **Type:** VALUE
- **Color:** #212121
- **Description:** Returns the cross product of two vectors
- **Arguments:** vector_a, vector_b
- **Widgets:** None
- **Status:** Implemented

---

## Magnitude Of (`VECTORMAGNITUDE`)
- **Type:** VALUE
- **Color:** #212121
- **Description:** Returns the length of a vector
- **Arguments:** vector
- **Widgets:** None
- **Status:** Implemented

---

## Up (`UP`)
- **Type:** VALUE
- **Color:** #212121
- **Description:** Returns the up direction vector (0, 1, 0)
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Down (`DOWN`)
- **Type:** VALUE
- **Color:** #212121
- **Description:** Returns the down direction vector (0, -1, 0)
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Left (`LEFT`)
- **Type:** VALUE
- **Color:** #212121
- **Description:** Returns the left direction vector (-1, 0, 0)
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Right (`RIGHT`)
- **Type:** VALUE
- **Color:** #212121
- **Description:** Returns the right direction vector (1, 0, 0)
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Forward (`FORWARD`)
- **Type:** VALUE
- **Color:** #212121
- **Description:** Returns the forward direction vector (0, 0, 1)
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Backward (`BACKWARD`)
- **Type:** VALUE
- **Color:** #212121
- **Description:** Returns the backward direction vector (0, 0, -1)
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Show Message (`SHOWMESSAGE`)
- **Type:** ACTIONS
- **Color:** #607D8B
- **Description:** Shows a message to the player
- **Arguments:** player, message, duration
- **Widgets:** None
- **Status:** Implemented

---

## Show Big Message (`SHOWBIGMESSAGE`)
- **Type:** ACTIONS
- **Color:** #607D8B
- **Description:** Shows a large message on screen
- **Arguments:** player, title, subtitle, duration
- **Widgets:** None
- **Status:** Implemented

---

## Show Notification (`SHOWNOTIFICATION`)
- **Type:** ACTIONS
- **Color:** #607D8B
- **Description:** Shows a notification toast
- **Arguments:** player, text, icon
- **Widgets:** None
- **Status:** Implemented

---

## Set HUD Visible (`SETHUDVISIBLE`)
- **Type:** ACTIONS
- **Color:** #607D8B
- **Description:** Shows or hides specific HUD elements
- **Arguments:** player, hud_element, visible
- **Widgets:** None
- **Status:** Implemented

---

## Update HUD Text (`UPDATEHUDTEXT`)
- **Type:** ACTIONS
- **Color:** #607D8B
- **Description:** Updates text on a custom HUD element
- **Arguments:** player, hud_id, text
- **Widgets:** None
- **Status:** Implemented

---

## Create Custom HUD (`CREATECUSTOMHUD`)
- **Type:** ACTIONS
- **Color:** #607D8B
- **Description:** Creates a custom HUD layout
- **Arguments:** player, hud_config
- **Widgets:** None
- **Status:** Implemented

---

## Create World Marker (`CREATEWORLDMARKER`)
- **Type:** ACTIONS
- **Color:** #607D8B
- **Description:** Creates a 3D marker in the world
- **Arguments:** location, icon, text
- **Widgets:** None
- **Status:** Implemented

---

## Remove World Marker (`REMOVEWORLDMARKER`)
- **Type:** ACTIONS
- **Color:** #607D8B
- **Description:** Removes a world marker
- **Arguments:** marker_id
- **Widgets:** None
- **Status:** Implemented

---

## Set Objective Marker (`SETOBJECTIVEMARKER`)
- **Type:** ACTIONS
- **Color:** #607D8B
- **Description:** Sets the objective marker for a player
- **Arguments:** player, location, text
- **Widgets:** None
- **Status:** Implemented

---

## Update Scoreboard (`UPDATESCOREBOARD`)
- **Type:** ACTIONS
- **Color:** #607D8B
- **Description:** Updates the scoreboard data
- **Arguments:** entries
- **Widgets:** None
- **Status:** Implemented

---

## Show Scoreboard (`SHOWSCOREBOARD`)
- **Type:** ACTIONS
- **Color:** #607D8B
- **Description:** Forces the scoreboard to show or hide
- **Arguments:** player, visible
- **Widgets:** None
- **Status:** Implemented

---

## Number (`NUMBER`)
- **Type:** VALUE
- **Color:** #0288D1
- **Description:** A numeric value
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## String (`STRING`)
- **Type:** VALUE
- **Color:** #0288D1
- **Description:** A text value
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Boolean (`BOOLEAN`)
- **Type:** VALUE
- **Color:** #0288D1
- **Description:** A true/false value
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Set Variable (`SETVARIABLE`)
- **Type:** ACTIONS
- **Color:** #0288D1
- **Description:** Sets the value of a variable
- **Arguments:** variable, value
- **Widgets:** None
- **Status:** Implemented

---

## Get Variable (`GETVARIABLE`)
- **Type:** VALUE
- **Color:** #0288D1
- **Description:** Gets the value of a variable
- **Arguments:** variable_name
- **Widgets:** None
- **Status:** Implemented

---

## Spawn Vehicle (`SPAWNVEHICLE`)
- **Type:** ACTIONS
- **Color:** #E64A19
- **Description:** Spawns a vehicle at a location
- **Arguments:** vehicle_type, location, team
- **Widgets:** None
- **Status:** Implemented

---

## Despawn Vehicle (`DESPAWNVEHICLE`)
- **Type:** ACTIONS
- **Color:** #E64A19
- **Description:** Removes a vehicle from the game
- **Arguments:** vehicle
- **Widgets:** None
- **Status:** Implemented

---

## Tank (`VEHICLETYPETANK`)
- **Type:** VALUE
- **Color:** #E64A19
- **Description:** Tank vehicle type
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## APC (`VEHICLETYPEAPC`)
- **Type:** VALUE
- **Color:** #E64A19
- **Description:** APC vehicle type
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Helicopter (`VEHICLETYPEHELICOPTER`)
- **Type:** VALUE
- **Color:** #E64A19
- **Description:** Helicopter vehicle type
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Jet (`VEHICLETYPEJET`)
- **Type:** VALUE
- **Color:** #E64A19
- **Description:** Jet vehicle type
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Transport (`VEHICLETYPETRANSPORT`)
- **Type:** VALUE
- **Color:** #E64A19
- **Description:** Transport vehicle type
- **Arguments:** None
- **Widgets:** None
- **Status:** Implemented

---

## Get Vehicle Health (`GETVEHICLEHEALTH`)
- **Type:** VALUE
- **Color:** #E64A19
- **Description:** Returns the current health of a vehicle
- **Arguments:** vehicle
- **Widgets:** None
- **Status:** Implemented

---

## Set Vehicle Health (`SETVEHICLEHEALTH`)
- **Type:** ACTIONS
- **Color:** #E64A19
- **Description:** Sets the health of a vehicle
- **Arguments:** vehicle, health
- **Widgets:** None
- **Status:** Implemented

---

## Get Vehicle Driver (`GETVEHICLEDRIVER`)
- **Type:** VALUE
- **Color:** #E64A19
- **Description:** Returns the player driving the vehicle
- **Arguments:** vehicle
- **Widgets:** None
- **Status:** Implemented

---

## Eject from Vehicle (`EJECTFROMVEHICLE`)
- **Type:** ACTIONS
- **Color:** #E64A19
- **Description:** Forces a player out of a vehicle
- **Arguments:** player, vehicle
- **Widgets:** None
- **Status:** Implemented

---

## Lock Vehicle (`LOCKVEHICLE`)
- **Type:** ACTIONS
- **Color:** #E64A19
- **Description:** Locks a vehicle for a specific team
- **Arguments:** vehicle, team
- **Widgets:** None
- **Status:** Implemented

---

## Set Vehicle Speed (`SETVEHICLESPEED`)
- **Type:** ACTIONS
- **Color:** #E64A19
- **Description:** Sets the speed of a vehicle
- **Arguments:** vehicle, speed
- **Widgets:** None
- **Status:** Implemented

---

## Disable Vehicle (`DISABLEVEHICLE`)
- **Type:** ACTIONS
- **Color:** #E64A19
- **Description:** Disables vehicle movement and weapons
- **Arguments:** vehicle
- **Widgets:** None
- **Status:** Implemented

---

## Enable Vehicle (`ENABLEVEHICLE`)
- **Type:** ACTIONS
- **Color:** #E64A19
- **Description:** Enables vehicle movement and weapons
- **Arguments:** vehicle
- **Widgets:** None
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


# Deleted OCR'd HTML Files

The following HTML files from `Dump/blocks/Imported` were deleted as they contained garbled OCR text and were not useful for generating Blockly block definitions.

- All `.html` files in `Dump/blocks/Imported` were identified as unsuitable for block definition generation and have been removed.

