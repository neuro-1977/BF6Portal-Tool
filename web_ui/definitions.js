Blockly.defineBlocksWithJsonArray(
[
  {
    "type": "AIBattlefieldBehaviour",
    "message0": "AIBattlefieldBehaviour %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#FBC02D",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "AIDefendPositionBehaviour",
    "message0": "AIDefendPositionBehaviour %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#FBC02D",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "AIIdleBehaviour",
    "message0": "AIIdleBehaviour %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#FBC02D",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "AILOSMoveTOBehaviour",
    "message0": "AILOSMoveTOBehaviour %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#FBC02D",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "AIMoveToBehaviour",
    "message0": "AIMoveToBehaviour %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#FBC02D",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "AIParachuteBehaviour",
    "message0": "AIParachuteBehaviour %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#FBC02D",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "AIValidateMoveToBehaviour",
    "message0": "AIValidateMoveToBehaviour %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#FBC02D",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "AIWaypointIdleBehaviour",
    "message0": "AIWaypointIdleBehaviour %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#FBC02D",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "SetPlayerHealth",
    "message0": "SetPlayerHealth %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "amount"
      }
    ],
    "colour": "#FBC02D",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "SetPlayerLoadout",
    "message0": "SetPlayerLoadout %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "loadout"
      }
    ],
    "colour": "#FBC02D",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "Teleport",
    "message0": "Teleport %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "location"
      }
    ],
    "colour": "#FBC02D",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "EndRound",
    "message0": "EndRound %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "winner"
      }
    ],
    "colour": "#FBC02D",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "PauseRound",
    "message0": "PauseRound",
    "args0": [],
    "colour": "#FBC02D",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "AIBattlefieldBehavior",
    "message0": "AI Battlefield Behavior %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#D32F2F",
    "tooltip": "Sets the AI to standard battlefield combat behavior",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "AIDefendPositionBehavior",
    "message0": "AI Defend Position Behavior %1 %2 %3 %4 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "position"
      },
      {
        "type": "input_value",
        "name": "radius"
      },
      {
        "type": "input_value",
        "name": "time"
      }
    ],
    "colour": "#D32F2F",
    "tooltip": "Orders AI to defend a specific area",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "AIIdleBehavior",
    "message0": "AI Idle Behavior %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#D32F2F",
    "tooltip": "Sets the AI to idle state",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "AIMoveToBehavior",
    "message0": "AI Move To Behavior %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "position"
      },
      {
        "type": "input_value",
        "name": "sprint"
      }
    ],
    "colour": "#D32F2F",
    "tooltip": "Orders AI to move to a location",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "AIParachuteBehavior",
    "message0": "AI Parachute Behavior %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#D32F2F",
    "tooltip": "Orders AI to deploy parachute",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "AIWaypointIdleBehavior",
    "message0": "AI Waypoint Idle Behavior %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "time"
      }
    ],
    "colour": "#D32F2F",
    "tooltip": "AI waits at a waypoint for a duration",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "AIFollowPlayer",
    "message0": "AI Follow Player %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "ai_player"
      },
      {
        "type": "input_value",
        "name": "target_player"
      },
      {
        "type": "input_value",
        "name": "distance"
      }
    ],
    "colour": "#D32F2F",
    "tooltip": "Orders AI to follow a specific player",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "AIHoldPosition",
    "message0": "AI Hold Position %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#D32F2F",
    "tooltip": "Orders AI to hold their current position",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "AIAttackTarget",
    "message0": "AI Attack Target %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "ai_player"
      },
      {
        "type": "input_value",
        "name": "target_player"
      }
    ],
    "colour": "#D32F2F",
    "tooltip": "Orders AI to attack a specific target",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "SetAIBehavior",
    "message0": "Set AI Behavior %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "behavior_mode"
      }
    ],
    "colour": "#D32F2F",
    "tooltip": "Sets the general behavior mode for the AI",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "DeployAI",
    "message0": "Deploy AI %1 %2 %3 %4 ",
    "args0": [
      {
        "type": "input_value",
        "name": "team"
      },
      {
        "type": "input_value",
        "name": "soldier_type"
      },
      {
        "type": "input_value",
        "name": "position"
      },
      {
        "type": "input_value",
        "name": "kit"
      }
    ],
    "colour": "#D32F2F",
    "tooltip": "Spawns a new AI soldier",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "DespawnAI",
    "message0": "Despawn AI %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#D32F2F",
    "tooltip": "Removes an AI soldier from the game",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "SetAISpawnLocation",
    "message0": "Set AI Spawn Location %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "team"
      },
      {
        "type": "input_value",
        "name": "position"
      }
    ],
    "colour": "#D32F2F",
    "tooltip": "Sets where AI soldiers will spawn",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "SetAIHealth",
    "message0": "Set AI Health %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "amount"
      }
    ],
    "colour": "#D32F2F",
    "tooltip": "Sets the health of an AI soldier",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "SetAITeam",
    "message0": "Set AI Team %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "team_id"
      }
    ],
    "colour": "#D32F2F",
    "tooltip": "Changes the team of an AI soldier",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "GetAIHealth",
    "message0": "Get AI Health %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#D32F2F",
    "tooltip": "Returns the current health of an AI soldier",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "GetAITeam",
    "message0": "Get AI Team %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#D32F2F",
    "tooltip": "Returns the team ID of an AI soldier",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "AIIsAlive",
    "message0": "AI Is Alive %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#D32F2F",
    "tooltip": "Checks if an AI soldier is currently alive",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "SetVariableAtIndex",
    "message0": "Set Array Element %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "variable"
      },
      {
        "type": "input_value",
        "name": "index"
      },
      {
        "type": "input_value",
        "name": "value"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Sets a value at a specific index in an array variable",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "EmptyArray",
    "message0": "Create Empty Array",
    "args0": [],
    "colour": "#0097A7",
    "tooltip": "Creates an empty array",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ArrayLiteral",
    "message0": "Array Literal %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value1"
      },
      {
        "type": "input_value",
        "name": "value2"
      },
      {
        "type": "input_value",
        "name": "value3"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Creates an array from a list of values",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ArrayOfSize",
    "message0": "Array of Size %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "size"
      },
      {
        "type": "input_value",
        "name": "initial_value"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Creates an array of a specific size filled with a value",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ArrayFromPlayers",
    "message0": "All Players %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "team"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Creates an array of all players, optionally filtered by team",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ArrayFromDeadPlayers",
    "message0": "All Dead Players %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "team"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Creates an array of all dead players",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ArrayFromLivingPlayers",
    "message0": "All Living Players %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "team"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Creates an array of all living players",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ClearArray",
    "message0": "Clear Array %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "array"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Removes all elements from an array",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "ConcatArrays",
    "message0": "Concat Arrays %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "array1"
      },
      {
        "type": "input_value",
        "name": "array2"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Combines two arrays into one",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ReverseArray",
    "message0": "Reverse Array %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "array"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Reverses the order of elements in an array",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "AppendToArray",
    "message0": "Add to Array %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "array"
      },
      {
        "type": "input_value",
        "name": "value"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Adds a value to the end of an array",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "RemoveFromArray",
    "message0": "Remove from Array %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "array"
      },
      {
        "type": "input_value",
        "name": "value"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Removes a value from an array",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "RemoveFromArrayByIndex",
    "message0": "Remove from Array by Index %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "array"
      },
      {
        "type": "input_value",
        "name": "index"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Removes an element at a specific index",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ArraySlice",
    "message0": "Slice Array %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "array"
      },
      {
        "type": "input_value",
        "name": "start_index"
      },
      {
        "type": "input_value",
        "name": "count"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Returns a portion of an array",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "RandomValueInArray",
    "message0": "Random Value In Array %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "array"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Returns a random element from the array",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ValueInArray",
    "message0": "Get Array Element %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "array"
      },
      {
        "type": "input_value",
        "name": "index"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Returns the value at the specified index",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "FirstOf",
    "message0": "First Of %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "array"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Returns the first element in the array",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "LastOf",
    "message0": "Last Of %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "array"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Returns the last element in the array",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "IndexOfArrayValue",
    "message0": "Index Of %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "array"
      },
      {
        "type": "input_value",
        "name": "value"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Returns the index of a value in the array",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "CountOf",
    "message0": "Array Length %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "array"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Returns the number of elements in the array",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ArrayContains",
    "message0": "Contains %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "array"
      },
      {
        "type": "input_value",
        "name": "value"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Returns true if array contains the value",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "ForEachInArray",
    "message0": "For Each in Array %1 %2  %3",
    "args0": [
      {
        "type": "input_value",
        "name": "array"
      },
      {
        "type": "input_value",
        "name": "variable"
      },
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Executes nested blocks for each item in the array",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "MapArray",
    "message0": "Map Array %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "array"
      },
      {
        "type": "input_value",
        "name": "mapping_expression"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Creates a new array by applying a transformation to each element",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "FilteredArray",
    "message0": "Filter Array %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "array"
      },
      {
        "type": "input_value",
        "name": "condition"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Returns array with elements matching condition",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "SortedArray",
    "message0": "Sort Array %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "array"
      },
      {
        "type": "input_value",
        "name": "value_rank"
      }
    ],
    "colour": "#0097A7",
    "tooltip": "Returns a sorted copy of the array",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "LoadMusic",
    "message0": "LoadMusic %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "music_id"
      }
    ],
    "colour": "#455A64",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "PlayMusic",
    "message0": "PlayMusic %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "music_id"
      },
      {
        "type": "input_value",
        "name": "players"
      }
    ],
    "colour": "#455A64",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "SetMusicParam",
    "message0": "SetMusicParam %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "music_id"
      },
      {
        "type": "input_value",
        "name": "param"
      },
      {
        "type": "input_value",
        "name": "players"
      }
    ],
    "colour": "#455A64",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "UnloadMusic",
    "message0": "UnloadMusic %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "music_id"
      }
    ],
    "colour": "#455A64",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "PlaySound",
    "message0": "PlaySound %1 %2 %3 %4 %5 ",
    "args0": [
      {
        "type": "input_value",
        "name": "sound_id"
      },
      {
        "type": "input_value",
        "name": "position"
      },
      {
        "type": "input_value",
        "name": "players"
      },
      {
        "type": "input_value",
        "name": "volume"
      },
      {
        "type": "input_value",
        "name": "pitch"
      }
    ],
    "colour": "#455A64",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "PlayVO",
    "message0": "PlayVO %1 %2 %3 %4 ",
    "args0": [
      {
        "type": "input_value",
        "name": "vo_id"
      },
      {
        "type": "input_value",
        "name": "speaker"
      },
      {
        "type": "input_value",
        "name": "listener"
      },
      {
        "type": "input_value",
        "name": "players"
      }
    ],
    "colour": "#455A64",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "StopSound",
    "message0": "StopSound %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "sound_id"
      },
      {
        "type": "input_value",
        "name": "players"
      }
    ],
    "colour": "#455A64",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "SetPlayerCamera",
    "message0": "Set Player Camera %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "camera_mode"
      }
    ],
    "colour": "#37474F",
    "tooltip": "Sets the camera mode for a specific player",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "LockCameraToTarget",
    "message0": "Lock Camera to Target %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "target"
      }
    ],
    "colour": "#37474F",
    "tooltip": "Locks the player's camera to look at a target",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "CameraShake",
    "message0": "Camera Shake %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "intensity"
      },
      {
        "type": "input_value",
        "name": "duration"
      }
    ],
    "colour": "#37474F",
    "tooltip": "Applies a shake effect to the player's camera",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "SetCameraFOV",
    "message0": "Set Camera FOV %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "fov"
      }
    ],
    "colour": "#37474F",
    "tooltip": "Sets the Field of View for the player's camera",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "ResetCamera",
    "message0": "Reset Camera %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#37474F",
    "tooltip": "Resets the player's camera to default",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "FirstPersonCamera",
    "message0": "First Person Camera",
    "args0": [],
    "colour": "#37474F",
    "tooltip": "First person camera mode",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ThirdPersonCamera",
    "message0": "Third Person Camera",
    "args0": [],
    "colour": "#37474F",
    "tooltip": "Third person camera mode",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "FreeCamera",
    "message0": "Free Camera",
    "args0": [],
    "colour": "#37474F",
    "tooltip": "Free camera mode",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "SpectatorCamera",
    "message0": "Spectator Camera",
    "args0": [],
    "colour": "#37474F",
    "tooltip": "Spectator camera mode",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Equal",
    "message0": "Equal %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value_a"
      },
      {
        "type": "input_value",
        "name": "value_b"
      }
    ],
    "colour": "#43A047",
    "tooltip": "Returns true if A equals B",
    "helpUrl": "",
    "output": "Boolean"
  },
  {
    "type": "NotEqual",
    "message0": "Not Equal %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value_a"
      },
      {
        "type": "input_value",
        "name": "value_b"
      }
    ],
    "colour": "#43A047",
    "tooltip": "Returns true if A does not equal B",
    "helpUrl": "",
    "output": "Boolean"
  },
  {
    "type": "LessThan",
    "message0": "Less Than %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value_a"
      },
      {
        "type": "input_value",
        "name": "value_b"
      }
    ],
    "colour": "#43A047",
    "tooltip": "Returns true if A is less than B",
    "helpUrl": "",
    "output": "Boolean"
  },
  {
    "type": "LessThanOrEqual",
    "message0": "Less Than Or Equal %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value_a"
      },
      {
        "type": "input_value",
        "name": "value_b"
      }
    ],
    "colour": "#43A047",
    "tooltip": "Returns true if A is less than or equal to B",
    "helpUrl": "",
    "output": "Boolean"
  },
  {
    "type": "GreaterThan",
    "message0": "Greater Than %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value_a"
      },
      {
        "type": "input_value",
        "name": "value_b"
      }
    ],
    "colour": "#43A047",
    "tooltip": "Returns true if A is greater than B",
    "helpUrl": "",
    "output": "Boolean"
  },
  {
    "type": "GreaterThanOrEqual",
    "message0": "Greater Than Or Equal %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value_a"
      },
      {
        "type": "input_value",
        "name": "value_b"
      }
    ],
    "colour": "#43A047",
    "tooltip": "Returns true if A is greater than or equal to B",
    "helpUrl": "",
    "output": "Boolean"
  },
  {
    "type": "PlayEffect",
    "message0": "Play Effect %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "effect_type"
      },
      {
        "type": "input_value",
        "name": "location"
      },
      {
        "type": "input_value",
        "name": "scale"
      }
    ],
    "colour": "#263238",
    "tooltip": "Plays a visual effect at a location",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "StopEffect",
    "message0": "Stop Effect %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "effect_id"
      }
    ],
    "colour": "#263238",
    "tooltip": "Stops a playing effect",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "ParticleEffect",
    "message0": "Particle Effect %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "particle_type"
      }
    ],
    "colour": "#263238",
    "tooltip": "Returns a particle effect type",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ExplosionEffect",
    "message0": "Explosion Effect %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "explosion_type"
      }
    ],
    "colour": "#263238",
    "tooltip": "Returns an explosion effect type",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ScreenFlash",
    "message0": "Screen Flash %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "color"
      },
      {
        "type": "input_value",
        "name": "duration"
      }
    ],
    "colour": "#263238",
    "tooltip": "Flashes the player's screen with a color",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "ScreenFade",
    "message0": "Screen Fade %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "fade_type"
      },
      {
        "type": "input_value",
        "name": "duration"
      }
    ],
    "colour": "#263238",
    "tooltip": "Fades the player's screen",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "ApplyScreenFilter",
    "message0": "Apply Screen Filter %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "filter_type"
      }
    ],
    "colour": "#263238",
    "tooltip": "Applies a visual filter to the player's screen",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "DeployEmplacement",
    "message0": "DeployEmplacement %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "emplacement_id"
      },
      {
        "type": "input_value",
        "name": "position"
      },
      {
        "type": "input_value",
        "name": "rotation"
      }
    ],
    "colour": "#2E7D32",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "ON_START",
    "message0": "On Game Start",
    "args0": [],
    "colour": "#2E7D32",
    "tooltip": "",
    "helpUrl": "",
    "nextStatement": null
  },
  {
    "type": "ON_PLAYER_JOIN",
    "message0": "On Player Join %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#2E7D32",
    "tooltip": "",
    "helpUrl": "",
    "nextStatement": null
  },
  {
    "type": "EventAttacker",
    "message0": "Event Attacker",
    "args0": [],
    "colour": "#2E7D32",
    "tooltip": "The player who caused the event (e.g. the killer)",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "EventDamage",
    "message0": "Event Damage",
    "args0": [],
    "colour": "#2E7D32",
    "tooltip": "The amount of damage dealt in the event",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "EventLocation",
    "message0": "Event Location",
    "args0": [],
    "colour": "#2E7D32",
    "tooltip": "The location where the event occurred",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "EventPlayer",
    "message0": "Event Player",
    "args0": [],
    "colour": "#2E7D32",
    "tooltip": "The primary player involved in the event",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "EventTeam",
    "message0": "Event Team",
    "args0": [],
    "colour": "#2E7D32",
    "tooltip": "The team involved in the event",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "EventVictim",
    "message0": "Event Victim",
    "args0": [],
    "colour": "#2E7D32",
    "tooltip": "The player who was the victim of the event",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "EventWeapon",
    "message0": "Event Weapon",
    "args0": [],
    "colour": "#2E7D32",
    "tooltip": "The weapon used in the event",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "EndMatch",
    "message0": "End Match",
    "args0": [],
    "colour": "#5D4037",
    "tooltip": "Ends the current match",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "SetMatchTime",
    "message0": "Set Match Time %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "time"
      }
    ],
    "colour": "#5D4037",
    "tooltip": "Sets the match time remaining",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "GetMatchTime",
    "message0": "Match Time",
    "args0": [],
    "colour": "#5D4037",
    "tooltip": "Returns the current match time",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "PauseMatchTime",
    "message0": "Pause Match Time",
    "args0": [],
    "colour": "#5D4037",
    "tooltip": "Pauses the match timer",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "ResumeMatchTime",
    "message0": "Resume Match Time",
    "args0": [],
    "colour": "#5D4037",
    "tooltip": "Resumes the match timer",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "SetTeamScore",
    "message0": "Set Team Score %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "team"
      },
      {
        "type": "input_value",
        "name": "score"
      }
    ],
    "colour": "#5D4037",
    "tooltip": "Sets a team's score",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "GetTeamScore",
    "message0": "Team Score %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "team"
      }
    ],
    "colour": "#5D4037",
    "tooltip": "Returns a team's score",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ModifyTeamScore",
    "message0": "Modify Team Score %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "team"
      },
      {
        "type": "input_value",
        "name": "amount"
      }
    ],
    "colour": "#5D4037",
    "tooltip": "Adds to a team's score",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "DeclarePlayerTeamWinner",
    "message0": "Declare Team Winner %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "team"
      }
    ],
    "colour": "#5D4037",
    "tooltip": "Declares a team as the winner",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "SetRespawnTime",
    "message0": "Set Respawn Time %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "time"
      }
    ],
    "colour": "#5D4037",
    "tooltip": "Sets the player's respawn time",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "DisableRespawn",
    "message0": "Disable Respawn %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#5D4037",
    "tooltip": "Prevents player from respawning",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "EnableRespawn",
    "message0": "Enable Respawn %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#5D4037",
    "tooltip": "Allows player to respawn",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "GetGlobalVariable",
    "message0": "Global Variable %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "variable"
      }
    ],
    "colour": "#5D4037",
    "tooltip": "Gets a global variable value",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "SetGlobalVariable",
    "message0": "Set Global Variable %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "variable"
      },
      {
        "type": "input_value",
        "name": "value"
      }
    ],
    "colour": "#5D4037",
    "tooltip": "Sets a global variable",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "ModifyGlobalVariable",
    "message0": "Modify Global Variable %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "variable"
      },
      {
        "type": "input_value",
        "name": "operation"
      },
      {
        "type": "input_value",
        "name": "value"
      }
    ],
    "colour": "#5D4037",
    "tooltip": "Modifies a global variable",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "Wait",
    "message0": "Wait %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "seconds"
      }
    ],
    "colour": "#673AB7",
    "tooltip": "Pauses execution for a specified time",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "WaitUntil",
    "message0": "Wait Until %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "condition"
      },
      {
        "type": "input_value",
        "name": "timeout"
      }
    ],
    "colour": "#673AB7",
    "tooltip": "Pauses execution until condition is true",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "Break",
    "message0": "Break",
    "args0": [],
    "colour": "#673AB7",
    "tooltip": "Exits the current loop immediately",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "Continue",
    "message0": "Continue",
    "args0": [],
    "colour": "#673AB7",
    "tooltip": "Skips to the next iteration of the current loop",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "If",
    "message0": "If %1  %2",
    "args0": [
      {
        "type": "input_value",
        "name": "condition"
      },
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "colour": "#673AB7",
    "tooltip": "Executes nested blocks if condition is true",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "While",
    "message0": "While %1  %2",
    "args0": [
      {
        "type": "input_value",
        "name": "condition"
      },
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "colour": "#673AB7",
    "tooltip": "Repeats nested blocks while condition is true",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "And",
    "message0": "And %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "a"
      },
      {
        "type": "input_value",
        "name": "b"
      }
    ],
    "colour": "#673AB7",
    "tooltip": "Returns True if both inputs are True",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Or",
    "message0": "Or %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "a"
      },
      {
        "type": "input_value",
        "name": "b"
      }
    ],
    "colour": "#673AB7",
    "tooltip": "Returns True if either input is True",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Not",
    "message0": "Not %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "a"
      }
    ],
    "colour": "#673AB7",
    "tooltip": "Returns the opposite boolean value",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "True",
    "message0": "True",
    "args0": [],
    "colour": "#673AB7",
    "tooltip": "Boolean True value",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "False",
    "message0": "False",
    "args0": [],
    "colour": "#673AB7",
    "tooltip": "Boolean False value",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Equal",
    "message0": "Equal %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "a"
      },
      {
        "type": "input_value",
        "name": "b"
      }
    ],
    "colour": "#673AB7",
    "tooltip": "Returns True if inputs are equal",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "NotEqual",
    "message0": "Not Equal %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "a"
      },
      {
        "type": "input_value",
        "name": "b"
      }
    ],
    "colour": "#673AB7",
    "tooltip": "Returns True if inputs are not equal",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "GreaterThan",
    "message0": "Greater Than %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "a"
      },
      {
        "type": "input_value",
        "name": "b"
      }
    ],
    "colour": "#673AB7",
    "tooltip": "Returns True if A > B",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "LessThan",
    "message0": "Less Than %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "a"
      },
      {
        "type": "input_value",
        "name": "b"
      }
    ],
    "colour": "#673AB7",
    "tooltip": "Returns True if A < B",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "GreaterThanEqual",
    "message0": "Greater Than Or Equal %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "a"
      },
      {
        "type": "input_value",
        "name": "b"
      }
    ],
    "colour": "#673AB7",
    "tooltip": "Returns True if A >= B",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "LessThanEqual",
    "message0": "Less Than Or Equal %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "a"
      },
      {
        "type": "input_value",
        "name": "b"
      }
    ],
    "colour": "#673AB7",
    "tooltip": "Returns True if A <= B",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ForVariable",
    "message0": "ForVariable %1 %2 %3  %4",
    "args0": [
      {
        "type": "input_value",
        "name": "from_value"
      },
      {
        "type": "input_value",
        "name": "to_value"
      },
      {
        "type": "input_value",
        "name": "by_value"
      },
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "colour": "#673AB7",
    "tooltip": "Loops from starting value to ending value by increment",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "Add",
    "message0": "Add %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value_a"
      },
      {
        "type": "input_value",
        "name": "value_b"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "Returns the sum of two numbers",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Subtract",
    "message0": "Subtract %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value_a"
      },
      {
        "type": "input_value",
        "name": "value_b"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "Returns the difference of two numbers",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Multiply",
    "message0": "Multiply %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value_a"
      },
      {
        "type": "input_value",
        "name": "value_b"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "Returns the product of two numbers",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Divide",
    "message0": "Divide %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value_a"
      },
      {
        "type": "input_value",
        "name": "value_b"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "Returns the quotient of two numbers",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Modulo",
    "message0": "Modulo %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value_a"
      },
      {
        "type": "input_value",
        "name": "value_b"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "Returns the remainder after division",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "RaiseToPower",
    "message0": "Raise To Power %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "base"
      },
      {
        "type": "input_value",
        "name": "exponent"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "Returns base raised to the power of exponent",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Sine",
    "message0": "Sine %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "angle"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "Returns the sine of an angle in degrees",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Cosine",
    "message0": "Cosine %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "angle"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "Returns the cosine of an angle in degrees",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Tangent",
    "message0": "Tangent %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "angle"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "Returns the tangent of an angle in degrees",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ArcSine",
    "message0": "Arc Sine %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "Returns the arc sine in degrees",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ArcCosine",
    "message0": "Arc Cosine %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "Returns the arc cosine in degrees",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ArcTangent",
    "message0": "Arc Tangent %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "Returns the arc tangent in degrees",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Round",
    "message0": "Round %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Ceil",
    "message0": "Ceiling %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Floor",
    "message0": "Floor %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "RandomInteger",
    "message0": "Random Integer %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "min"
      },
      {
        "type": "input_value",
        "name": "max"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "Returns a random integer between min and max (inclusive)",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "RandomReal",
    "message0": "Random Real %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "min"
      },
      {
        "type": "input_value",
        "name": "max"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "Returns a random real number between min and max",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "AbsoluteValue",
    "message0": "Absolute Value %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "Returns the absolute value of a number",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "SquareRoot",
    "message0": "Square Root %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "Returns the square root of a number",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Min",
    "message0": "Min %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value_a"
      },
      {
        "type": "input_value",
        "name": "value_b"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "Returns the smaller of two values",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Max",
    "message0": "Max %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value_a"
      },
      {
        "type": "input_value",
        "name": "value_b"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "Returns the larger of two values",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "RoundToInteger",
    "message0": "Round To Integer %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "value"
      },
      {
        "type": "input_value",
        "name": "rounding_type"
      }
    ],
    "colour": "#1976D2",
    "tooltip": "Rounds a number to nearest integer",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "MOD_BLOCK",
    "message0": "MOD %1 %2 %3 ",
    "args0": [
      {
        "type": "field_input",
        "name": "FIELD_VALUE",
        "text": "MyGameMode"
      },
      {
        "type": "input_value",
        "name": "mod_name"
      },
      {
        "type": "input_value",
        "name": "description"
      }
    ],
    "colour": "#4A4A4A",
    "tooltip": "",
    "helpUrl": "",
    "nextStatement": null
  },
  {
    "type": "SetObjectiveState",
    "message0": "SetObjectiveState %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "objective"
      },
      {
        "type": "input_value",
        "name": "state"
      }
    ],
    "colour": "#F9A825",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "GetObjectiveState",
    "message0": "GetObjectiveState %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "objective"
      }
    ],
    "colour": "#F9A825",
    "tooltip": "",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Comment",
    "message0": "Comment %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "text"
      }
    ],
    "colour": "#9E9E9E",
    "tooltip": "",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "EventPlayer",
    "message0": "Event Player",
    "args0": [],
    "colour": "#C2185B",
    "tooltip": "Returns the player that triggered the event",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "GetPlayerHealth",
    "message0": "Health %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Returns the player's current health",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "GetPlayerMaxHealth",
    "message0": "Max Health %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Returns the player's maximum health",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "IsPlayerAlive",
    "message0": "Is Alive %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Returns true if player is alive",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "IsPlayerDead",
    "message0": "Is Dead %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Returns true if player is dead",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "GetPlayerTeam",
    "message0": "Team Of %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Returns the player's team",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "SetPlayerHealth",
    "message0": "Set Player Health %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "health"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Sets the player's health to a specific value",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "KillPlayer",
    "message0": "Kill %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Kills the specified player",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "RespawnPlayer",
    "message0": "Respawn %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Respawns the specified player",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "TeleportPlayer",
    "message0": "Teleport %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "position"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Teleports player to a position",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "SetPlayerMaxHealth",
    "message0": "Set Max Health %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "max_health"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Sets the player's maximum health",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "GetPlayerPosition",
    "message0": "Position Of %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Returns the player's position",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "GetPlayerVelocity",
    "message0": "Velocity Of %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Returns the player's velocity vector",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "GetPlayerSpeed",
    "message0": "Speed Of %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Returns the player's speed",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "GetPlayerFacingDirection",
    "message0": "Facing Direction Of %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Returns the direction the player is facing",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "GetPlayerVariable",
    "message0": "Player Variable %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "variable"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Gets a player variable value",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "SetPlayerVariable",
    "message0": "Set Player Variable %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "variable"
      },
      {
        "type": "input_value",
        "name": "value"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Sets a player variable to a value",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "ModifyPlayerVariable",
    "message0": "Modify Player Variable %1 %2 %3 %4 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "variable"
      },
      {
        "type": "input_value",
        "name": "operation"
      },
      {
        "type": "input_value",
        "name": "value"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Modifies a player variable",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "EnablePlayerInput",
    "message0": "Enable Input %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "enable"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Enables or disables player input",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "GetPlayerPosition",
    "message0": "Get Player Position %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Returns the position vector of the player",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Teleport",
    "message0": "Teleport %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "position"
      },
      {
        "type": "input_value",
        "name": "rotation"
      }
    ],
    "colour": "#C2185B",
    "tooltip": "Teleports the player to a location",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "RULE_HEADER",
    "message0": "RULE %1 %2 %3 %4 %5 ",
    "args0": [
      {
        "type": "field_input",
        "name": "FIELD_VALUE",
        "text": "New Rule"
      },
      {
        "type": "input_value",
        "name": "rule_name"
      },
      {
        "type": "input_value",
        "name": "event_type"
      },
      {
        "type": "input_value",
        "name": "scope"
      },
      {
        "type": "input_value",
        "name": "is_global"
      }
    ],
    "colour": "#7B1FA2",
    "tooltip": "",
    "helpUrl": "",
    "nextStatement": null
  },
  {
    "type": "SUBROUTINE_BLOCK",
    "message0": "SUBROUTINE %1 %2 ",
    "args0": [
      {
        "type": "field_input",
        "name": "FIELD_VALUE",
        "text": "NewSubroutine"
      },
      {
        "type": "input_value",
        "name": "subroutine_name"
      }
    ],
    "colour": "#795548",
    "tooltip": "",
    "helpUrl": "",
    "nextStatement": null
  },
  {
    "type": "CallSubroutine",
    "message0": "Call Subroutine %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "subroutine_name"
      }
    ],
    "colour": "#795548",
    "tooltip": "Executes a subroutine",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "Return",
    "message0": "Return",
    "args0": [],
    "colour": "#795548",
    "tooltip": "Returns from the current subroutine",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "Vector",
    "message0": "Vector %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "x"
      },
      {
        "type": "input_value",
        "name": "y"
      },
      {
        "type": "input_value",
        "name": "z"
      }
    ],
    "colour": "#212121",
    "tooltip": "Creates a vector from X, Y, Z components",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "VectorTowards",
    "message0": "Vector Towards %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "start_pos"
      },
      {
        "type": "input_value",
        "name": "end_pos"
      }
    ],
    "colour": "#212121",
    "tooltip": "Creates a direction vector from start to end",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "DistanceBetween",
    "message0": "Distance Between %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "position_a"
      },
      {
        "type": "input_value",
        "name": "position_b"
      }
    ],
    "colour": "#212121",
    "tooltip": "Returns distance between two positions",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "XComponentOf",
    "message0": "X Component Of %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "vector"
      }
    ],
    "colour": "#212121",
    "tooltip": "Returns the X component of a vector",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "YComponentOf",
    "message0": "Y Component Of %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "vector"
      }
    ],
    "colour": "#212121",
    "tooltip": "Returns the Y component of a vector",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ZComponentOf",
    "message0": "Z Component Of %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "vector"
      }
    ],
    "colour": "#212121",
    "tooltip": "Returns the Z component of a vector",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Normalize",
    "message0": "Normalize %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "vector"
      }
    ],
    "colour": "#212121",
    "tooltip": "Returns a normalized vector (length 1)",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "DotProduct",
    "message0": "Dot Product %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "vector_a"
      },
      {
        "type": "input_value",
        "name": "vector_b"
      }
    ],
    "colour": "#212121",
    "tooltip": "Returns the dot product of two vectors",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "CrossProduct",
    "message0": "Cross Product %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "vector_a"
      },
      {
        "type": "input_value",
        "name": "vector_b"
      }
    ],
    "colour": "#212121",
    "tooltip": "Returns the cross product of two vectors",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "VectorMagnitude",
    "message0": "Magnitude Of %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "vector"
      }
    ],
    "colour": "#212121",
    "tooltip": "Returns the length of a vector",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Up",
    "message0": "Up",
    "args0": [],
    "colour": "#212121",
    "tooltip": "Returns the up direction vector (0, 1, 0)",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Down",
    "message0": "Down",
    "args0": [],
    "colour": "#212121",
    "tooltip": "Returns the down direction vector (0, -1, 0)",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Left",
    "message0": "Left",
    "args0": [],
    "colour": "#212121",
    "tooltip": "Returns the left direction vector (-1, 0, 0)",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Right",
    "message0": "Right",
    "args0": [],
    "colour": "#212121",
    "tooltip": "Returns the right direction vector (1, 0, 0)",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Forward",
    "message0": "Forward",
    "args0": [],
    "colour": "#212121",
    "tooltip": "Returns the forward direction vector (0, 0, 1)",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Backward",
    "message0": "Backward",
    "args0": [],
    "colour": "#212121",
    "tooltip": "Returns the backward direction vector (0, 0, -1)",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "ShowMessage",
    "message0": "Show Message %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "message"
      },
      {
        "type": "input_value",
        "name": "duration"
      }
    ],
    "colour": "#607D8B",
    "tooltip": "Shows a message to the player",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "ShowBigMessage",
    "message0": "Show Big Message %1 %2 %3 %4 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "title"
      },
      {
        "type": "input_value",
        "name": "subtitle"
      },
      {
        "type": "input_value",
        "name": "duration"
      }
    ],
    "colour": "#607D8B",
    "tooltip": "Shows a large message on screen",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "ShowNotification",
    "message0": "Show Notification %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "text"
      },
      {
        "type": "input_value",
        "name": "icon"
      }
    ],
    "colour": "#607D8B",
    "tooltip": "Shows a notification toast",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "SetHUDVisible",
    "message0": "Set HUD Visible %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "hud_element"
      },
      {
        "type": "input_value",
        "name": "visible"
      }
    ],
    "colour": "#607D8B",
    "tooltip": "Shows or hides specific HUD elements",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "UpdateHUDText",
    "message0": "Update HUD Text %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "hud_id"
      },
      {
        "type": "input_value",
        "name": "text"
      }
    ],
    "colour": "#607D8B",
    "tooltip": "Updates text on a custom HUD element",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "CreateCustomHUD",
    "message0": "Create Custom HUD %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "hud_config"
      }
    ],
    "colour": "#607D8B",
    "tooltip": "Creates a custom HUD layout",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "CreateWorldMarker",
    "message0": "Create World Marker %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "location"
      },
      {
        "type": "input_value",
        "name": "icon"
      },
      {
        "type": "input_value",
        "name": "text"
      }
    ],
    "colour": "#607D8B",
    "tooltip": "Creates a 3D marker in the world",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "RemoveWorldMarker",
    "message0": "Remove World Marker %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "marker_id"
      }
    ],
    "colour": "#607D8B",
    "tooltip": "Removes a world marker",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "SetObjectiveMarker",
    "message0": "Set Objective Marker %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "location"
      },
      {
        "type": "input_value",
        "name": "text"
      }
    ],
    "colour": "#607D8B",
    "tooltip": "Sets the objective marker for a player",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "UpdateScoreboard",
    "message0": "Update Scoreboard %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "entries"
      }
    ],
    "colour": "#607D8B",
    "tooltip": "Updates the scoreboard data",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "ShowScoreboard",
    "message0": "Show Scoreboard %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "visible"
      }
    ],
    "colour": "#607D8B",
    "tooltip": "Forces the scoreboard to show or hide",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "Number",
    "message0": "Number %1",
    "args0": [
      {
        "type": "field_number",
        "name": "FIELD_VALUE",
        "text": "0"
      }
    ],
    "colour": "#0288D1",
    "tooltip": "A numeric value",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "String",
    "message0": "String %1",
    "args0": [
      {
        "type": "field_input",
        "name": "FIELD_VALUE",
        "text": ""
      }
    ],
    "colour": "#0288D1",
    "tooltip": "A text value",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "Boolean",
    "message0": "Boolean %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "FIELD_DROPDOWN",
        "options": [
          [
            "True",
            "True"
          ],
          [
            "False",
            "False"
          ]
        ]
      }
    ],
    "colour": "#0288D1",
    "tooltip": "A true/false value",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "SetVariable",
    "message0": "Set Variable %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "variable"
      },
      {
        "type": "input_value",
        "name": "value"
      }
    ],
    "colour": "#0288D1",
    "tooltip": "Sets the value of a variable",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "GetVariable",
    "message0": "Get Variable %1 %2 ",
    "args0": [
      {
        "type": "field_input",
        "name": "FIELD_VALUE",
        "text": ""
      },
      {
        "type": "input_value",
        "name": "variable_name"
      }
    ],
    "colour": "#0288D1",
    "tooltip": "Gets the value of a variable",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "SpawnVehicle",
    "message0": "Spawn Vehicle %1 %2 %3 ",
    "args0": [
      {
        "type": "input_value",
        "name": "vehicle_type"
      },
      {
        "type": "input_value",
        "name": "location"
      },
      {
        "type": "input_value",
        "name": "team"
      }
    ],
    "colour": "#E64A19",
    "tooltip": "Spawns a vehicle at a location",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "DespawnVehicle",
    "message0": "Despawn Vehicle %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "vehicle"
      }
    ],
    "colour": "#E64A19",
    "tooltip": "Removes a vehicle from the game",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "VehicleTypeTank",
    "message0": "Tank",
    "args0": [],
    "colour": "#E64A19",
    "tooltip": "Tank vehicle type",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "VehicleTypeAPC",
    "message0": "APC",
    "args0": [],
    "colour": "#E64A19",
    "tooltip": "APC vehicle type",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "VehicleTypeHelicopter",
    "message0": "Helicopter",
    "args0": [],
    "colour": "#E64A19",
    "tooltip": "Helicopter vehicle type",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "VehicleTypeJet",
    "message0": "Jet",
    "args0": [],
    "colour": "#E64A19",
    "tooltip": "Jet vehicle type",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "VehicleTypeTransport",
    "message0": "Transport",
    "args0": [],
    "colour": "#E64A19",
    "tooltip": "Transport vehicle type",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "GetVehicleHealth",
    "message0": "Get Vehicle Health %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "vehicle"
      }
    ],
    "colour": "#E64A19",
    "tooltip": "Returns the current health of a vehicle",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "SetVehicleHealth",
    "message0": "Set Vehicle Health %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "vehicle"
      },
      {
        "type": "input_value",
        "name": "health"
      }
    ],
    "colour": "#E64A19",
    "tooltip": "Sets the health of a vehicle",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "GetVehicleDriver",
    "message0": "Get Vehicle Driver %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "vehicle"
      }
    ],
    "colour": "#E64A19",
    "tooltip": "Returns the player driving the vehicle",
    "helpUrl": "",
    "output": null
  },
  {
    "type": "EjectFromVehicle",
    "message0": "Eject from Vehicle %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "player"
      },
      {
        "type": "input_value",
        "name": "vehicle"
      }
    ],
    "colour": "#E64A19",
    "tooltip": "Forces a player out of a vehicle",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "LockVehicle",
    "message0": "Lock Vehicle %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "vehicle"
      },
      {
        "type": "input_value",
        "name": "team"
      }
    ],
    "colour": "#E64A19",
    "tooltip": "Locks a vehicle for a specific team",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "SetVehicleSpeed",
    "message0": "Set Vehicle Speed %1 %2 ",
    "args0": [
      {
        "type": "input_value",
        "name": "vehicle"
      },
      {
        "type": "input_value",
        "name": "speed"
      }
    ],
    "colour": "#E64A19",
    "tooltip": "Sets the speed of a vehicle",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "DisableVehicle",
    "message0": "Disable Vehicle %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "vehicle"
      }
    ],
    "colour": "#E64A19",
    "tooltip": "Disables vehicle movement and weapons",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  },
  {
    "type": "EnableVehicle",
    "message0": "Enable Vehicle %1 ",
    "args0": [
      {
        "type": "input_value",
        "name": "vehicle"
      }
    ],
    "colour": "#E64A19",
    "tooltip": "Enables vehicle movement and weapons",
    "helpUrl": "",
    "previousStatement": null,
    "nextStatement": null
  }
]
);

var BLOCK_HELP = {
  "MOD": {
    "title": "MOD Block",
    "description": "The root container for all game logic. Every script must start with a MOD block. Think of it as the main container for your game mode modifications.",
    "usage": [
      "All RULES blocks must be placed inside a MOD block",
      "Can contain multiple RULES and SUBROUTINE blocks",
      "Defines the scope of your game mode modifications",
      "Each MOD should have a unique identifier"
    ],
    "snap_info": "Purple snap point on left bar - RULES blocks snap here. The purple color indicates that only purple RULES blocks can connect.",
    "tips": [
      "Start every project with a MOD block - it's your foundation",
      "Organize related RULES into the same MOD for better structure",
      "Use descriptive names for your mod ID (e.g., 'CustomGameMode' not 'Mod1')",
      "Keep MODs focused - separate different game modes into different MOD blocks"
    ]
  },
  "RULES": {
    "title": "RULES Block",
    "description": "Defines a game rule with CONDITIONS and ACTIONS. Rules execute when their conditions are met. This is where the 'if-then' logic of your game mode lives.",
    "usage": [
      "Must be placed inside a MOD block (snap to purple point on MOD's left bar)",
      "Can contain CONDITIONS blocks (snap to blue point on RULES left bar)",
      "Can contain ACTIONS blocks (snap to yellow point on RULES left bar)",
      "Can contain SUBROUTINE blocks (snap to brown point on RULES left bar)",
      "Executes when all CONDITIONS are true"
    ],
    "snap_info": "Snaps to MOD's purple point. Has three snap points on left bar: blue (CONDITIONS), yellow (ACTIONS), and brown (SUBROUTINE)",
    "tips": [
      "Name rules descriptively to show their purpose (e.g., 'OnPlayerSpawn', 'WhenTeamWins', 'IfHealthLow')",
      "Keep rules focused on a single behavior or event",
      "Test rules individually before combining them",
      "Use CONDITIONS to control when ACTIONS execute",
      "Multiple ACTIONS in a rule execute sequentially"
    ]
  },
  "CONDITIONS": {
    "title": "CONDITIONS Block",
    "description": "Defines when a RULE should execute. All conditions must be true for the rule to activate. Think of this as the 'if' part of an if-statement.",
    "usage": [
      "Must be placed inside a RULES block (snap to blue point on RULES left bar)",
      "Can contain EVENTS blocks (snap to green point at bottom)",
      "Multiple conditions are evaluated with AND logic (all must be true)",
      "If conditions are false, the ACTIONS won't execute"
    ],
    "snap_info": "Snaps to RULES blue point on left bar. Has green snap point at bottom for EVENTS blocks",
    "tips": [
      "Use specific conditions to avoid unnecessary rule firing",
      "Combine multiple EVENTS in CONDITIONS for complex logic",
      "Test edge cases where conditions might overlap",
      "Consider what happens when conditions become false after being true",
      "Keep condition logic simple and readable"
    ]
  },
  "ACTIONS": {
    "title": "ACTIONS Block",
    "description": "Defines what happens when a RULE executes. Actions are performed in sequence. This is the 'then' part of an if-then statement.",
    "usage": [
      "Must be placed inside a RULES block (snap to yellow point on RULES left bar)",
      "Can contain up to 3 EVENTS blocks (snap to green points inside the block)",
      "Actions execute in order from left to right",
      "Each EVENTS block in ACTIONS represents a specific action to perform"
    ],
    "snap_info": "Snaps to RULES yellow point on left bar. Has 3 green snap points inside the block (horizontally spaced) for EVENTS blocks",
    "tips": [
      "Order matters - actions execute sequentially from left to right",
      "Use wait/delay actions for timing-dependent sequences",
      "Chain multiple ACTIONS blocks for complex sequences",
      "Block will expand to fit more EVENTS (feature coming soon)",
      "Test each action individually before combining them",
      "Consider side effects when actions modify game state"
    ]
  },
  "EVENTS": {
    "title": "EVENTS Block",
    "description": "Specific game events or actions that trigger or execute within CONDITIONS/ACTIONS. These are the building blocks of your game logic.",
    "usage": [
      "Can snap to ACTIONS blocks (green points inside ACTIONS)",
      "Can snap to CONDITIONS blocks (green point at bottom)",
      "Defines specific game events (spawn, damage, score, team change, etc.)",
      "Can have parameters to configure behavior",
      "Acts differently depending on whether it's in CONDITIONS or ACTIONS"
    ],
    "snap_info": "Snaps to green points on ACTIONS or CONDITIONS blocks. Green color indicates EVENTS can connect here.",
    "tips": [
      "Choose events that match your rule's purpose",
      "Many events have parameters you can configure in the properties",
      "Events can be chained together for complex logic",
      "In CONDITIONS: events check if something is true",
      "In ACTIONS: events make something happen",
      "Read event descriptions carefully to understand their behavior"
    ]
  },
  "SUBROUTINE": {
    "title": "SUBROUTINE Block",
    "description": "Reusable logic blocks that can be called from multiple places. Like functions in traditional programming, they help avoid repeating code.",
    "usage": [
      "Can snap to RULES block (brown snap point on RULES left bar)",
      "Can also snap to MOD block as standalone subroutines",
      "Acts as a container for reusable rule logic",
      "Can be called from multiple different RULES",
      "Helps keep code DRY (Don't Repeat Yourself)"
    ],
    "snap_info": "Snaps to RULES brown point (next to yellow) or directly to MOD block",
    "tips": [
      "Use for logic that repeats across multiple rules",
      "Name subroutines clearly to show their purpose (e.g., 'ResetPlayer', 'CheckVictory')",
      "Keep subroutines focused and modular",
      "Test subroutines in isolation before using them in multiple places",
      "Document what parameters your subroutine expects",
      "Think of subroutines as mini-mods within your main mod"
    ]
  }
};

var BLOCK_IMAGES = {
  "MOD": "assets/img/BF6Portal/mod help.jpg",
  "RULES": "assets/img/BF6Portal/ruleshelp.jpg",
  "CONDITIONS": "assets/img/BF6Portal/condition help.jpg",
  "ACTIONS": "assets/img/BF6Portal/control actions.jpg",
  "EVENTS": "assets/img/BF6Portal/event payloads1.jpg",
  "MATH": "assets/img/BF6Portal/math1.jpg",
  "LOGIC": "assets/img/BF6Portal/logic1.jpg",
  "ARRAYS": "assets/img/BF6Portal/arrays.jpg",
  "AUDIO": "assets/img/BF6Portal/audio.jpg",
  "CAMERA": "assets/img/BF6Portal/camera.jpg",
  "EFFECTS": "assets/img/BF6Portal/effects.jpg",
  "GAMEPLAY": "assets/img/BF6Portal/gameplay1.jpg",
  "OBJECTIVE": "assets/img/BF6Portal/objective1.jpg",
  "PLAYER": "assets/img/BF6Portal/player 1.jpg",
  "TRANSFORM": "assets/img/BF6Portal/transform.jpg",
  "VEHICLE": "assets/img/BF6Portal/vehicle 1.jpg",
  "UI": "assets/img/BF6Portal/user interface1.jpg"
};
