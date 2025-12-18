import * as Blockly from 'blockly';

export const bf6PortalExpandedBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([
{
    "message0": "MOD %1",
    "args0": [
      {
        "type": "input_statement",
        "name": "RULES"
      }
    ],
    "colour": "#4A4A4A",
    "deletable": false,
    "movable": false,
    "type": "MOD_BLOCK"
  },
{
    "message0": "RULE Name: %1 Event %2 %3\nConditions: %4\nActions: %5",
    "args0": [
      {
        "type": "field_input",
        "name": "RULE_NAME",
        "text": "New Rule"
      },
      {
        "type": "field_dropdown",
        "name": "EVENT_TYPE",
        "options": [
          ["Ongoing", "ONGOING"],
          ["OnAIMoveToFailed", "ON_AI_MOVE_TO_FAILED"],
          ["OnAIMoveToRunning", "ON_AI_AI_MOVE_TO_RUNNING"]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "SCOPE_TYPE",
        "options": [
          ["Global", "GLOBAL"],
          ["AreaTrigger", "AREA_TRIGGER"],
          ["CapturePoint", "CAPTURE_POINT"],
          ["EmplacementSpawner", "EMPLACEMENT_SPAWNER"]
        ]
      },
      {
        "type": "input_value",
        "name": "CONDITIONS",
        "check": "Boolean"
      },
      {
        "type": "input_statement",
        "name": "ACTIONS",
        "check": [
          "Action",
          "SubroutineReference",
          "ControlAction"
        ]
      }
    ],
    "previousStatement": "Rule",
    "nextStatement": "Rule",
    "colour": "#6E47A0",
    "type": "RULE_HEADER"
  },
{
    "message0": "Condition: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "INPUT_CONDITION",
        "check": ["Boolean", "Number", "String", "GETGAMEMODE", "GETSCORE", "GETTIMELIMIT", "AND", "OR", "NOT", "TRUE", "FALSE", "GREATERTHANEQUAL", "LESSTHANEQUAL", "ADD", "SUBTRACT", "MULTIPLY", "DIVIDE", "POWER", "SQUAREROOT", "ABSOLUTE", "MODULO", "GETOBJECTIVESTATE", "GETPLAYERBYID", "GETPLAYERNAME", "GETPLAYERHEALTH", "GETPLAYERTEAM", "VECTOR", "VECTORTOWARDS", "DISTANCEBETWEEN", "XCOMPONENTOF", "YCOMPONENTOF", "ZCOMPONENTOF", "NORMALIZE", "DOTPRODUCT", "CROSSPRODUCT", "VECTORMAGNITUDE", "UP", "DOWN", "LEFT", "RIGHT", "FORWARD", "BACKWARD", "EQUAL", "NOTEQUAL", "LESSTHAN"]
      }
    ],
    "output": "Boolean",
    "colour": "#45B5B5",
    "type": "CONDITION_BLOCK"
  },
{
    "message0": "SUBROUTINE: %1\nConditions: %2\nActions: %3",
    "args0": [
      {
        "type": "field_input",
        "name": "SUBROUTINE_NAME",
        "text": "New Subroutine"
      },
      {
        "type": "input_value",
        "name": "CONDITIONS",
        "check": "Boolean",
        "align": "RIGHT"
      },
      {
        "type": "input_statement",
        "name": "ACTIONS",
        "check": "Action"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#a66b2d",
    "type": "SUBROUTINE_BLOCK",
    "mutator": "subroutine_def_mutator"
  },
{
    "message0": "Call Subroutine: %1",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "SUBROUTINE_NAME",
        "text": "..."
      }
    ],
    "previousStatement": "Action",
    "nextStatement": "Action",
    "colour": "#E6A85C",
    "type": "CALLSUBROUTINE",
    "mutator": "subroutine_call_mutator"
  },
  {
    "type": "BREAK_BLOCK",
    "message0": "Break",
    "previousStatement": "Action",
    "nextStatement": "Action",
    "colour": "#3F51B5",
    "tooltip": "Break out of a loop"
  },
  {
    "type": "CONTINUE_BLOCK",
    "message0": "Continue",
    "previousStatement": "Action",
    "nextStatement": "Action",
    "colour": "#3F51B5",
    "tooltip": "Continue to the next iteration of a loop"
  },
  {
    "type": "IF_BLOCK",
    "message0": "If %1 Then %2",
    "args0": [
      { "type": "input_value", "name": "CONDITION", "check": "Boolean" },
      { "type": "input_statement", "name": "DO", "check": "Action" }
    ],
    "previousStatement": "Action",
    "nextStatement": "Action",
    "colour": "#3F51B5",
    "tooltip": "Execute actions if condition is true"
  },
  {
    "type": "WHILE_BLOCK",
    "message0": "While %1 Do %2",
    "args0": [
      { "type": "input_value", "name": "CONDITION", "check": "Boolean" },
      { "type": "input_statement", "name": "DO", "check": "Action" }
    ],
    "previousStatement": "Action",
    "nextStatement": "Action",
    "colour": "#3F51B5",
    "tooltip": "Repeat actions while condition is true"
  },
  {
    "type": "FOR_VARIABLE_BLOCK",
    "message0": "For Variable %1 From %2 To %3 Step %4 Do %5",
    "args0": [
      { "type": "field_input", "name": "VAR_NAME", "text": "i" },
      { "type": "input_value", "name": "FROM", "check": "Number", "align": "RIGHT" },
      { "type": "input_value", "name": "TO", "check": "Number", "align": "RIGHT" },
      { "type": "input_value", "name": "STEP", "check": "Number", "align": "RIGHT" },
      { "type": "input_statement", "name": "DO", "check": "Action" }
    ],
    "previousStatement": "Action",
    "nextStatement": "Action",
    "colour": "#3F51B5",
    "tooltip": "Loop with a variable"
  },
{
    "message0": "AIBattlefieldBehaviour Player: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": ["Boolean", "Number", "String", "GETGAMEMODE", "GETSCORE", "GETTIMELIMIT", "AND", "OR", "NOT", "TRUE", "FALSE", "GREATERTHANEQUAL", "LESSTHANEQUAL", "ADD", "SUBTRACT", "MULTIPLY", "DIVIDE", "POWER", "SQUAREROOT", "ABSOLUTE", "MODULO", "GETOBJECTIVESTATE", "GETPLAYERBYID", "GETPLAYERNAME", "GETPLAYERHEALTH", "GETPLAYERTEAM", "VECTOR", "VECTORTOWARDS", "DISTANCEBETWEEN", "XCOMPONENTOF", "YCOMPONENTOF", "ZCOMPONENTOF", "NORMALIZE", "DOTPRODUCT", "CROSSPRODUCT", "VECTORMAGNITUDE", "UP", "DOWN", "LEFT", "RIGHT", "FORWARD", "BACKWARD", "EQUAL", "NOTEQUAL", "LESSTHAN"]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "AIBATTLEFIELDBEHAVIOUR"
  },
{
    "message0": "AIDefendPositionBehaviour Player: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": ["Boolean", "Number", "String", "GETGAMEMODE", "GETSCORE", "GETTIMELIMIT", "AND", "OR", "NOT", "TRUE", "FALSE", "GREATERTHANEQUAL", "LESSTHANEQUAL", "ADD", "SUBTRACT", "MULTIPLY", "DIVIDE", "POWER", "SQUAREROOT", "ABSOLUTE", "MODULO", "GETOBJECTIVESTATE", "GETPLAYERBYID", "GETPLAYERNAME", "GETPLAYERHEALTH", "GETPLAYERTEAM", "VECTOR", "VECTORTOWARDS", "DISTANCEBETWEEN", "XCOMPONENTOF", "YCOMPONENTOF", "ZCOMPONENTOF", "NORMALIZE", "DOTPRODUCT", "CROSSPRODUCT", "VECTORMAGNITUDE", "UP", "DOWN", "LEFT", "RIGHT", "FORWARD", "BACKWARD", "EQUAL", "NOTEQUAL", "LESSTHAN"]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "AIDEFENDPOSITIONBEHAVIOUR"
  },
{
    "message0": "AIIdleBehaviour Player: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": ["Boolean", "Number", "String", "GETGAMEMODE", "GETSCORE", "GETTIMELIMIT", "AND", "OR", "NOT", "TRUE", "FALSE", "GREATERTHANEQUAL", "LESSTHANEQUAL", "ADD", "SUBTRACT", "MULTIPLY", "DIVIDE", "POWER", "SQUAREROOT", "ABSOLUTE", "MODULO", "GETOBJECTIVESTATE", "GETPLAYERBYID", "GETPLAYERNAME", "GETPLAYERHEALTH", "GETPLAYERTEAM", "VECTOR", "VECTORTOWARDS", "DISTANCEBETWEEN", "XCOMPONENTOF", "YCOMPONENTOF", "ZCOMPONENTOF", "NORMALIZE", "DOTPRODUCT", "CROSSPRODUCT", "VECTORMAGNITUDE", "UP", "DOWN", "LEFT", "RIGHT", "FORWARD", "BACKWARD", "EQUAL", "NOTEQUAL", "LESSTHAN"]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "AIIDLEBEHAVIOUR"
  },
{
    "message0": "AILOSMoveTOBehaviour Player: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": ["Boolean", "Number", "String", "GETGAMEMODE", "GETSCORE", "GETTIMELIMIT", "AND", "OR", "NOT", "TRUE", "FALSE", "GREATERTHANEQUAL", "LESSTHANEQUAL", "ADD", "SUBTRACT", "MULTIPLY", "DIVIDE", "POWER", "SQUAREROOT", "ABSOLUTE", "MODULO", "GETOBJECTIVESTATE", "GETPLAYERBYID", "GETPLAYERNAME", "GETPLAYERHEALTH", "GETPLAYERTEAM", "VECTOR", "VECTORTOWARDS", "DISTANCEBETWEEN", "XCOMPONENTOF", "YCOMPONENTOF", "ZCOMPONENTOF", "NORMALIZE", "DOTPRODUCT", "CROSSPRODUCT", "VECTORMAGNITUDE", "UP", "DOWN", "LEFT", "RIGHT", "FORWARD", "BACKWARD", "EQUAL", "NOTEQUAL", "LESSTHAN"]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "AILOSMOVETOBEHAVIOUR"
  },
{
    "message0": "AIMoveToBehaviour Player: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": ["Boolean", "Number", "String", "GETGAMEMODE", "GETSCORE", "GETTIMELIMIT", "AND", "OR", "NOT", "TRUE", "FALSE", "GREATERTHANEQUAL", "LESSTHANEQUAL", "ADD", "SUBTRACT", "MULTIPLY", "DIVIDE", "POWER", "SQUAREROOT", "ABSOLUTE", "MODULO", "GETOBJECTIVESTATE", "GETPLAYERBYID", "GETPLAYERNAME", "GETPLAYERHEALTH", "GETPLAYERTEAM", "VECTOR", "VECTORTOWARDS", "DISTANCEBETWEEN", "XCOMPONENTOF", "YCOMPONENTOF", "ZCOMPONENTOF", "NORMALIZE", "DOTPRODUCT", "CROSSPRODUCT", "VECTORMAGNITUDE", "UP", "DOWN", "LEFT", "RIGHT", "FORWARD", "BACKWARD", "EQUAL", "NOTEQUAL", "LESSTHAN"]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "AIMOVETOBEHAVIOUR"
  },
{
    "message0": "AIParachuteBehaviour Player: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "AIPARACHUTEBEHAVIOUR"
  },
{
    "message0": "AIValidateMoveToBehaviour Player: %1 Position: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      },
      {
        "type": "input_value",
        "name": "POSITION",
        "check": "Vector"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "AIVALIDATEMOVETOBEHAVIOUR"
  },
{
    "message0": "AIWaypointIdleBehaviour Player: %1 Waypoint Path: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      },
      {
        "type": "input_value",
        "name": "WAYPOINT_PATH",
        "check": "WaypointPath"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "AIWAYPOINTIDLEBEHAVIOUR"
  },
{
    "message0": "Set Player Health Player: %1 Health: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      },
      {
        "type": "field_input",
        "name": "HEALTH"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#C2185B",
    "type": "SETPLAYERHEALTH"
  },
{
    "message0": "SetPlayerLoadout Player: %1 Loadout: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      },
      {
        "type": "input_value",
        "name": "LOADOUT",
        "check": "Loadout"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "SETPLAYERLOADOUT"
  },
{
    "message0": "Teleport Player: %1 Location: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      },
      {
        "type": "input_value",
        "name": "LOCATION",
        "check": "Vector"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "TELEPORT"
  },
{
    "message0": "End Round Winning Team: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "WINNING_TEAM"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#5D4037",
    "type": "ENDROUND"
  },
{
    "message0": "PauseRound",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "PAUSEROUND"
  },
{
    "message0": "AI Battlefield Behavior Player: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "AIBATTLEFIELDBEHAVIOR"
  },
{
    "message0": "AI Defend Position Behavior Player: %1 Defend Position: %2 Min Distance: %3 Max Distance: %4",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      },
      {
        "type": "input_value",
        "name": "DEFEND_POSITION",
        "check": "Vector"
      },
      {
        "type": "input_value",
        "name": "MIN_DISTANCE",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "MAX_DISTANCE",
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "AIDEFENDPOSITIONBEHAVIOR"
  },
{
    "message0": "AI Idle Behavior Player: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "AIIDLEBEHAVIOR"
  },
{
    "message0": "AIMoveToBehavior Player: %1 Position: %2 Sprint: %3",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      },
      {
        "type": "input_value",
        "name": "POSITION",
        "check": "Vector"
      },
      {
        "type": "input_value",
        "name": "SPRINT",
        "check": ["Boolean", "Number"]
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "AIMOVETOBEHAVIOR"
  },
{
    "message0": "AI Parachute Behavior Player: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "AIPARACHUTEBEHAVIOR"
  },
{
    "message0": "AI Waypoint Idle Behavior Player: %1 Waypoint Path: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      },
      {
        "type": "input_value",
        "name": "WAYPOINT_PATH",
        "check": "WaypointPath"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "AIWAYPOINTIDLEBEHAVIOR"
  },
{
    "message0": "AI Follow Player Ai Player: %1 Target Player: %2 Distance: %3",
    "args0": [
      {
        "type": "input_value",
        "name": "AI_PLAYER",
        "check": "Player"
      },
      {
        "type": "input_value",
        "name": "TARGET_PLAYER",
        "check": "Player"
      },
      {
        "type": "input_value",
        "name": "DISTANCE",
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "AIFOLLOWPLAYER"
  },
{
    "message0": "AI Hold Position Player: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "AIHOLDPOSITION"
  },
{
    "message0": "AI Attack Target Ai Player: %1 Target Player: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "AI_PLAYER",
        "check": "Player"
      },
      {
        "type": "input_value",
        "name": "TARGET_PLAYER",
        "check": "Player"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "AIATTACKTARGET"
  },
{
    "message0": "Set AI Behavior Player: %1 Behavior Mode: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      },
      {
        "type": "input_value",
        "name": "BEHAVIOR_MODE",
        "check": "BehaviorMode"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "SETAIBEHAVIOR"
  },
{
    "message0": "Deploy AI Team: %1 Soldier Type: %2 Position: %3 Kit: %4",
    "args0": [
      {
        "type": "input_value",
        "name": "TEAM",
        "check": "Team"
      },
      {
        "type": "input_value",
        "name": "SOLDIER_TYPE",
        "check": "SoldierType"
      },
      {
        "type": "input_value",
        "name": "POSITION",
        "check": "Vector"
      },
      {
        "type": "input_value",
        "name": "KIT",
        "check": "Kit"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "DEPLOYAI"
  },
{
    "message0": "Despawn AI Player: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "DESPAWNAI"
  },
{
    "message0": "Set AI Spawn Location Team: %1 Position: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "TEAM",
        "check": "Team"
      },
      {
        "type": "input_value",
        "name": "POSITION",
        "check": "Vector"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "SETAISPAWNLOCATION"
  },
{
    "message0": "Set AI Health Player: %1 Amount: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      },
      {
        "type": "input_value",
        "name": "AMOUNT",
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "SETAIHEALTH"
  },
{
    "message0": "Set AI Team Player: %1 Team Id: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      },
      {
        "type": "input_value",
        "name": "TEAM_ID",
        "check": "Team"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "SETAITEAM"
  },
{
    "message0": "Get AI Health Player: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      }
    ],
    "output": "Number",
    "colour": "#FFD700",
    "type": "GETAIHEALTH"
  },
{
    "message0": "Get AI Team Player: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      }
    ],
    "output": "Team",
    "colour": "#FFD700",
    "type": "GETAITEAM"
  },
{
    "message0": "AI Is Alive Player: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      }
    ],
    "output": "Boolean",
    "colour": "#FFD700",
    "type": "AIISALIVE"
  },
{
    "message0": "Create Array",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#0097A7",
    "type": "CREATEARRAY"
  },
{
    "message0": "Array Length Array: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "ARRAY"
      }
    ],
    "output": "ARRAYLENGTH",
    "colour": "#0097A7",
    "type": "ARRAYLENGTH"
  },
{
    "message0": "Get Element Array: %1 Index: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "ARRAY"
      },
      {
        "type": "field_input",
        "name": "INDEX"
      }
    ],
    "output": "GETELEMENT",
    "colour": "#0097A7",
    "type": "GETELEMENT"
  },
{
    "message0": "Set Element Array: %1 Index: %2 Value: %3",
    "args0": [
      {
        "type": "input_value",
        "name": "ARRAY",
        "check": "Array"
      },
      {
        "type": "input_value",
        "name": "INDEX",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "VALUE",
        "check": null
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "SETELEMENT"
  },
{
    "message0": "Append To Array Array: %1 Value: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "ARRAY"
      },
      {
        "type": "field_input",
        "name": "VALUE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#0097A7",
    "type": "APPENDTOARRAY"
  },
{
    "message0": "Remove From Array Array: %1 Index: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "ARRAY"
      },
      {
        "type": "field_input",
        "name": "INDEX"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#0097A7",
    "type": "REMOVEFROMARRAY"
  },
{
    "message0": "Find First Array: %1 Value: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "ARRAY"
      },
      {
        "type": "field_input",
        "name": "VALUE"
      }
    ],
    "output": "FINDFIRST",
    "colour": "#0097A7",
    "type": "FINDFIRST"
  },
{
    "message0": "Sort Array Array: %1 Order: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "ARRAY"
      },
      {
        "type": "field_input",
        "name": "ORDER"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#0097A7",
    "type": "SORTARRAY"
  },
  {
    "type": "ARRAYCONTAINS",
    "message0": "Array %1 Contains %2",
    "args0": [
      {
        "type": "input_value",
        "name": "ARRAY",
        "check": "Array"
      },
      {
        "type": "input_value",
        "name": "ITEM"
      }
    ],
    "output": "Boolean",
    "colour": "#4CAF50",
    "tooltip": "Returns a Boolean value indicating whether the provided Array contains the provided item."
  },
{
    "message0": "LoadMusic Music Id: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "MUSIC_ID",
        "check": "MusicId"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "LOADMUSIC"
  },
{
    "message0": "PlayMusic Music Id: %1 Players: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "MUSIC_ID",
        "check": "MusicId"
      },
      {
        "type": "input_value",
        "name": "PLAYERS",
        "check": "Player"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "PLAYMUSIC"
  },
{
    "message0": "SetMusicParam Music Id: %1 Param: %2 Players: %3",
    "args0": [
      {
        "type": "input_value",
        "name": "MUSIC_ID",
        "check": "MusicId"
      },
      {
        "type": "input_value",
        "name": "PARAM",
        "check": "MusicParam"
      },
      {
        "type": "input_value",
        "name": "PLAYERS",
        "check": "Player"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "SETMUSICPARAM"
  },
{
    "message0": "UnloadMusic Music Id: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "MUSIC_ID",
        "check": "MusicId"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "UNLOADMUSIC"
  },
{
    "message0": "PlaySound Sound Id: %1 Position: %2 Players: %3 Volume: %4 Pitch: %5",
    "args0": [
      {
        "type": "input_value",
        "name": "SOUND_ID",
        "check": "SFX"
      },
      {
        "type": "input_value",
        "name": "POSITION",
        "check": "Vector"
      },
      {
        "type": "input_value",
        "name": "PLAYERS",
        "check": "Player"
      },
      {
        "type": "input_value",
        "name": "VOLUME",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "PITCH",
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "PLAYSOUND"
  },
{
    "message0": "PlayVO Vo Id: %1 Speaker: %2 Listener: %3 Players: %4",
    "args0": [
      {
        "type": "input_value",
        "name": "VO_ID",
        "check": "VOId"
      },
      {
        "type": "input_value",
        "name": "SPEAKER",
        "check": "Player"
      },
      {
        "type": "input_value",
        "name": "LISTENER",
        "check": "Player"
      },
      {
        "type": "input_value",
        "name": "PLAYERS",
        "check": "Player"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "PLAYVO"
  },
{
    "message0": "StopSound Sound Id: %1 Players: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "SOUND_ID",
        "check": "SFX"
      },
      {
        "type": "input_value",
        "name": "PLAYERS",
        "check": "Player"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "STOPSOUND"
  },
{
    "message0": "Set Player Camera Player: %1 Camera Mode: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      },
      {
        "type": "field_input",
        "name": "CAMERA_MODE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#37474F",
    "type": "SETPLAYERCAMERA"
  },
{
    "message0": "Lock Camera to Target Player: %1 Target: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      },
      {
        "type": "field_input",
        "name": "TARGET"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#37474F",
    "type": "LOCKCAMERATOTARGET"
  },
{
    "message0": "Camera Shake Player: %1 Intensity: %2 Duration: %3",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      },
      {
        "type": "field_input",
        "name": "INTENSITY"
      },
      {
        "type": "field_input",
        "name": "DURATION"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#37474F",
    "type": "CAMERASHAKE"
  },
{
    "message0": "Set Camera FOV Player: %1 Fov: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      },
      {
        "type": "field_input",
        "name": "FOV"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#37474F",
    "type": "SETCAMERAFOV"
  },
{
    "message0": "Reset Camera Player: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#37474F",
    "type": "RESETCAMERA"
  },
{
    "message0": "First Person Camera",
    "output": "FIRSTPERSONCAMERA",
    "colour": "#37474F",
    "type": "FIRSTPERSONCAMERA"
  },
{
    "message0": "Third Person Camera",
    "output": "THIRDPERSONCAMERA",
    "colour": "#37474F",
    "type": "THIRDPERSONCAMERA"
  },
{
    "message0": "Free Camera",
    "output": "FREECAMERA",
    "colour": "#37474F",
    "type": "FREECAMERA"
  },
{
    "message0": "Spectator Camera",
    "output": "SPECTATORCAMERA",
    "colour": "#37474F",
    "type": "SPECTATORCAMERA"
  },
{
    "message0": "Equal A: %1 B: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "A",
        "check": null
      },
      {
        "type": "input_value",
        "name": "B",
        "check": null
      }
    ],
    "output": "Boolean",
    "colour": "#32CD32",
    "type": "EQUAL"
  },
{
    "message0": "Not Equal A: %1 B: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "A",
        "check": null
      },
      {
        "type": "input_value",
        "name": "B",
        "check": null
      }
    ],
    "output": "Boolean",
    "colour": "#32CD32",
    "type": "NOTEQUAL"
  },
{
    "message0": "Less Than A: %1 B: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "A",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "B",
        "check": "Number"
      }
    ],
    "output": "Boolean",
    "colour": "#32CD32",
    "type": "LESSTHAN"
  },
{
    "message0": "Less Than Or Equal Value A: %1 Value B: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "VALUE_A",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "VALUE_B",
        "check": "Number"
      }
    ],
    "output": "Boolean",
    "colour": "#32CD32",
    "type": "LESSTHANOREQUAL"
  },
{
    "message0": "Greater Than A: %1 B: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "A",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "B",
        "check": "Number"
      }
    ],
    "output": "Boolean",
    "colour": "#32CD32",
    "type": "GREATERTHAN"
  },
{
    "message0": "Greater Than Or Equal Value A: %1 Value B: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "VALUE_A",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "VALUE_B",
        "check": "Number"
      }
    ],
    "output": "Boolean",
    "colour": "#32CD32",
    "type": "GREATERTHANOREQUAL"
  },
{
    "message0": "Play Effect Effect Type: %1 Location: %2 Scale: %3",
    "args0": [
      {
        "type": "field_input",
        "name": "EFFECT_TYPE"
      },
      {
        "type": "field_input",
        "name": "LOCATION"
      },
      {
        "type": "field_input",
        "name": "SCALE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#263238",
    "type": "PLAYEFFECT"
  },
{
    "message0": "Stop Effect Effect Id: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "EFFECT_ID"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#263238",
    "type": "STOPEFFECT"
  },
{
    "message0": "Particle Effect Particle Type: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "PARTICLE_TYPE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#263238",
    "type": "PARTICLEEFFECT"
  },
{
    "message0": "Explosion Effect Explosion Type: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "EXPLOSION_TYPE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#263238",
    "type": "EXPLOSIONEFFECT"
  },
{
    "message0": "Screen Flash Player: %1 Color: %2 Duration: %3",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      },
      {
        "type": "field_input",
        "name": "COLOR"
      },
      {
        "type": "field_input",
        "name": "DURATION"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#263238",
    "type": "SCREENFLASH"
  },
{
    "message0": "Screen Fade Player: %1 Fade Type: %2 Duration: %3",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      },
      {
        "type": "field_input",
        "name": "FADE_TYPE"
      },
      {
        "type": "field_input",
        "name": "DURATION"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#263238",
    "type": "SCREENFADE"
  },
{
    "message0": "Apply Screen Filter Player: %1 Filter Type: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      },
      {
        "type": "field_input",
        "name": "FILTER_TYPE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#263238",
    "type": "APPLYSCREENFILTER"
  },
{
    "message0": "DeployEmplacement Emplacement Id: %1 Position: %2 Rotation: %3",
    "args0": [
      {
        "type": "field_input",
        "name": "EMPLACEMENT_ID"
      },
      {
        "type": "field_input",
        "name": "POSITION"
      },
      {
        "type": "field_input",
        "name": "ROTATION"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#8D6E63",
    "type": "DEPLOYEMPLACEMENT"
  },
{
    "message0": "On Game Start",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#5D4037",
    "type": "ON_START"
  },
{
    "message0": "On Player Join Player: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#5D4037",
    "type": "ON_PLAYER_JOIN"
  },
{
    "message0": "Event Attacker",
    "output": "EVENTATTACKER",
    "colour": "#5D4037",
    "type": "EVENTATTACKER"
  },
{
    "message0": "Event Damage",
    "output": "EVENTDAMAGE",
    "colour": "#5D4037",
    "type": "EVENTDAMAGE"
  },
{
    "message0": "Event Location",
    "output": "EVENTLOCATION",
    "colour": "#5D4037",
    "type": "EVENTLOCATION"
  },
{
    "message0": "Event Player",
    "output": "EVENTPLAYER",
    "colour": "#5D4037",
    "type": "EVENTPLAYER"
  },
{
    "message0": "Event Team",
    "output": "EVENTTEAM",
    "colour": "#5D4037",
    "type": "EVENTTEAM"
  },
{
    "message0": "Event Victim",
    "output": "EVENTVICTIM",
    "colour": "#5D4037",
    "type": "EVENTVICTIM"
  },
{
    "message0": "Event Weapon",
    "output": "EVENTWEAPON",
    "colour": "#5D4037",
    "type": "EVENTWEAPON"
  },
{
    "message0": "Get Gamemode",
    "output": "GETGAMEMODE",
    "colour": "#5D4037",
    "type": "GETGAMEMODE"
  },
{
    "message0": "Set Gamemode Gamemode: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "GAMEMODE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#5D4037",
    "type": "SETGAMEMODE"
  },
{
    "message0": "Enable Friendly Fire Enabled: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "ENABLED"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#5D4037",
    "type": "ENABLEFRIENDLYFIRE"
  },
{
    "message0": "Set Score Team: %1 Score: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "TEAM"
      },
      {
        "type": "field_input",
        "name": "SCORE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#5D4037",
    "type": "SETSCORE"
  },
{
    "message0": "Get Score Team: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "TEAM"
      }
    ],
    "output": "GETSCORE",
    "colour": "#5D4037",
    "type": "GETSCORE"
  },
{
    "message0": "Set Time Limit Time Limit: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "TIME_LIMIT"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#5D4037",
    "type": "SETTIMELIMIT"
  },
{
    "message0": "Get Time Limit",
    "output": "GETTIMELIMIT",
    "colour": "#5D4037",
    "type": "GETTIMELIMIT"
  },
{
    "message0": "Wait Seconds: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "SECONDS",
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#32CD32",
    "type": "WAIT"
  },
{
    "message0": "Wait Until Condition: %1 Timeout: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "CONDITION",
        "check": "Boolean"
      },
      {
        "type": "input_value",
        "name": "TIMEOUT",
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#32CD32",
    "type": "WAITUNTIL"
  },
{
    "message0": "Abort",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "ABORT"
  },
{
    "message0": "AbortIf Condition: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "CONDITION",
        "check": "Boolean"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFD700",
    "type": "AbortIf"
  },
{
    "message0": "Continue",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#32CD32",
    "type": "CONTINUE"
  },
{
    "message0": "If Condition: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "CONDITION",
        "check": "Boolean"
      }
    ],
    "message1": "do %1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#32CD32",
    "type": "IF"
  },
{
    "message0": "While Condition: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "CONDITION",
        "check": "Boolean"
      }
    ],
    "message1": "do %1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#32CD32",
    "type": "WHILE"
  },
{
    "message0": "And A: %1 B: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "A",
        "check": "Boolean"
      },
      {
        "type": "input_value",
        "name": "B",
        "check": "Boolean"
      }
    ],
    "output": "Boolean",
    "colour": "#32CD32",
    "type": "AND"
  },
  {
    "type": "ANGLEBETWEENVECTORS",
    "message0": "Angle Between Vectors Vector1: %1 Vector2: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "VECTOR1",
        "check": "Vector"
      },
      {
        "type": "input_value",
        "name": "VECTOR2",
        "check": "Vector"
      }
    ],
    "output": "Number",
    "colour": "#32CD32",
    "tooltip": "Returns the angle (in degrees) between two provided Vector values."
  },
  {
    "type": "ANGLEDIFFERENCE",
    "message0": "Angle Difference Angle1: %1 Angle2: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "ANGLE1",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "ANGLE2",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": "#32CD32",
    "tooltip": "Returns the difference between two angles (in degrees)."
  },
  {
    "type": "APPLYMEDGADGET",
    "message0": "Apply Med Gadget to Player: %1 Gadget: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      },
      {
        "type": "input_value",
        "name": "MEDGADGET",
        "check": "MedGadgetTypesItem"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFEB3B",
    "tooltip": "Applies the effect of a medical gadget to a target Player."
  },
  {
    "type": "ARCCOSINEINDEGREES",
    "message0": "Arccosine In Degrees: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "NUMBER",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": "#32CD32",
    "tooltip": "Returns the inverse cosine of a provided Number value in degrees."
  },
  {
    "type": "ARCCOSINEINRADIANS",
    "message0": "Arccosine In Radians: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "NUMBER",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": "#32CD32",
    "tooltip": "Returns the inverse cosine of a provided Number value in radians."
  },
  {
    "type": "ARCSINEINDEGREES",
    "message0": "Arcsine In Degrees: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "NUMBER",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": "#32CD32",
    "tooltip": "Returns the inverse sine of a provided Number value in degrees."
  },
  {
    "type": "ARCSINEINRADIANS",
    "message0": "Arcsine In Radians: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "NUMBER",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": "#32CD32",
    "tooltip": "Returns the inverse sine of a provided Number value in radians."
  },
  {
    "type": "ARCTANGENTINDEGREES",
    "message0": "Arctangent In Degrees: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "NUMBER",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": "#32CD32",
    "tooltip": "Returns the inverse tangent of a provided Number value in degrees."
  },
  {
    "type": "ARCTANGENTINRADIANS",
    "message0": "Arctangent In Radians: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "NUMBER",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": "#32CD32",
    "tooltip": "Returns the inverse tangent of a provided Number value in radians."
  },
  {
    "type": "ARRAYSLICE",
    "message0": "Array Slice: Array %1 Start Index %2 Count %3",
    "args0": [
      {
        "type": "input_value",
        "name": "ARRAY",
        "check": "Array"
      },
      {
        "type": "input_value",
        "name": "START_INDEX",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "COUNT",
        "check": "Number"
      }
    ],
    "output": "Array",
    "colour": "#4CAF50",
    "tooltip": "Returns a copy of the specified Array containing only values from a specified index range."
  },
  {
    "type": "BACKWARDVECTOR",
    "message0": "Backward Vector",
    "output": "Vector",
    "colour": "#32CD32",
    "tooltip": "Returns the backward directional Vector of (0, 0, 1)."
  },
  {
    "type": "BOOL",
    "message0": "Boolean %1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "VALUE",
        "options": [
          ["true", "true"],
          ["false", "false"]
        ]
      }
    ],
    "output": "Boolean",
    "colour": "#32CD32",
    "tooltip": "A boolean value (true or false)."
  },
  {
    "type": "BREAK",
    "message0": "Break",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#32CD32",
    "tooltip": "Breaks out of a loop."
  },
  {
    "type": "CAPTUREPOINTS",
    "message0": "Capture Points",
    "output": "Array",
    "colour": "#4CAF50",
    "tooltip": "Returns an Array of all CapturePoint instances in the current map."
  },
  {
    "type": "CEILING",
    "message0": "Ceiling: %1",
    "args0": [
        {
            "type": "input_value",
            "name": "NUMBER",
            "check": "Number"
        }
    ],
        "output": "Number",
        "colour": "#32CD32",
        "tooltip": "Returns the smallest integer greater than or equal to a given number."
      },
      {
        "type": "CLEARALLCUSTOMMESSAGES",
        "message0": "Clear All Custom Messages for %1",
        "args0": [
          {
            "type": "input_value",
            "name": "RECIPIENT",
            "check": ["Player", "TeamId"]
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#FFEB3B",
            "tooltip": "Clears all custom messages for the specified player or team."
          },
          {
            "type": "CLEARCUSTOMMESSAGE",
            "message0": "Clear Custom Message for %1 Slot %2",
            "args0": [
              {
                "type": "input_value",
                "name": "RECIPIENT",
                "check": ["Player", "TeamId"]
              },
              {
                "type": "input_value",
                "name": "MESSAGE_SLOT",
                "check": "MessageSlot"
              }
            ],
            "previousStatement": null,
            "nextStatement": null,
            "colour": "#FFEB3B",
            "tooltip": "Clears a custom message from a specific slot for the specified player or team."
          },
          {
            "type": "CLOSESTPLAYERTO",
            "message0": "Closest Player To %1",
            "args0": [
              {
                "type": "input_value",
                "name": "POSITION",
                "check": "Vector"
              }
            ],
            "output": "Player",
            "colour": "#4CAF50",
            "tooltip": "Returns the player closest to the specified position."
          },
          {
            "type": "COMPARECAPTUREPOINT",
            "message0": "Compare Capture Point %1 With %2",
            "args0": [
              {
                "type": "input_value",
                "name": "CAPTURE_POINT_A",
                "check": "CapturePoint"
              },
              {
                "type": "input_value",
                "name": "CAPTURE_POINT_B",
                "check": "CapturePoint"
              }
            ],
            "output": "Boolean",
            "colour": "#4CAF50",
            "tooltip": "Returns whether two CapturePoints are the same."
          },
          {
            "type": "COMPAREVEHICLENAME",
            "message0": "Compare Vehicle Name %1 With %2",
            "args0": [
              {
                "type": "input_value",
                "name": "VEHICLE",
                "check": "Vehicle"
              },
              {
                "type": "input_value",
                "name": "NAME",
                "check": "String"
              }
            ],
            "output": "Boolean",
            "colour": "#4CAF50",
            "tooltip": "Returns whether the name of the provided vehicle matches the provided string."
          },
          {
            "type": "COUNTOF",
            "message0": "Count Of %1",
            "args0": [
              {
                "type": "input_value",
                "name": "ARRAY",
                "check": "Array"
              }
            ],
            "output": "Number",
            "colour": "#4CAF50",
            "tooltip": "Returns the number of elements in the provided Array."
          },
          {
            "type": "COSINEFROMDEGREES",
            "message0": "Cosine From Degrees: %1",
            "args0": [
              {
                "type": "input_value",
                "name": "ANGLE",
                "check": "Number"
              }
            ],
            "output": "Number",
            "colour": "#32CD32",
            "tooltip": "Returns the cosine of a provided angle in degrees."
          },
          {
            "type": "COSINEFROMRADIANS",
            "message0": "Cosine From Radians: %1",
            "args0": [
              {
                "type": "input_value",
                "name": "ANGLE",
                "check": "Number"
              }
            ],
            "output": "Number",
            "colour": "#32CD32",
            "tooltip": "Returns the cosine of a provided angle in radians."
          },
          {    "type": "CAPTUREPOINTCAPTURINGTIME",
    "message0": "Capture Point %1 Capturing Time %2",
    "args0": [
      {
        "type": "input_value",
        "name": "CAPTURE_POINT",
        "check": "CapturePoint"
      },
      {
        "type": "input_value",
        "name": "TIME",
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFEB3B",
    "tooltip": "Sets the capturing time for target CapturePoint to the provided Number."
  },
  {
    "type": "CAPTUREPOINTNEUTRALIZATIONTIME",
    "message0": "Capture Point %1 Neutralization Time %2",
    "args0": [
      {
        "type": "input_value",
        "name": "CAPTURE_POINT",
        "check": "CapturePoint"
      },
      {
        "type": "input_value",
        "name": "TIME",
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFEB3B",
    "tooltip": "Sets the neutralization time for target CapturePoint to the provided Number."
  },
{
    "message0": "%1 OR %2",
    "args0": [
      {
        "type": "input_value",
        "name": "A",
        "check": "Boolean"
      },
      {
        "type": "input_value",
        "name": "B",
        "check": "Boolean"
      }
    ],
    "output": "Boolean",
    "colour": "#32CD32",
    "type": "OR"
  },
{
    "message0": "Not A: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "A",
        "check": "Boolean"
      }
    ],
    "output": "Boolean",
    "colour": "#32CD32",
    "type": "NOT"
  },
{
    "message0": "True",
    "output": "Boolean",
    "colour": "#32CD32",
    "type": "TRUE"
  },
{
    "message0": "False",
    "output": "Boolean",
    "colour": "#32CD32",
    "type": "FALSE"
  },
{
    "message0": "Greater Than Or Equal A: %1 B: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "A",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "B",
        "check": "Number"
      }
    ],
    "output": "Boolean",
    "colour": "#32CD32",
    "type": "GREATERTHANEQUAL"
  },
{
    "message0": "Less Than Or Equal A: %1 B: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "A",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "B",
        "check": "Number"
      }
    ],
    "output": "Boolean",
    "colour": "#32CD32",
    "type": "LESSTHANEQUAL"
  },
{
    "message0": "ForVariable %1 From %2 To %3 By %4",
    "args0": [
      {
        "type": "field_variable",
        "name": "VAR",
        "variable": "i"
      },
      {
        "type": "input_value",
        "name": "FROM_VALUE",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "TO_VALUE",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "BY_VALUE",
        "check": "Number"
      }
    ],
    "message1": "do %1",
    "args1": [
      {
        "type": "input_statement",
        "name": "DO"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFEB3B",
    "type": "FORVARIABLE"
  },
{
    "message0": "Add Value A: %1 Value B: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "VALUE_A",
        "check": ["Number", "Vector"]
      },
      {
        "type": "input_value",
        "name": "VALUE_B",
        "check": ["Number", "Vector"]
      }
    ],
    "output": ["Number", "Vector"],
    "colour": "#32CD32",
    "type": "ADD"
  },
{
    "message0": "Subtract Value A: %1 Value B: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "VALUE_A",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "VALUE_B",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": "#32CD32",
    "type": "SUBTRACT"
  },
{
    "message0": "Multiply Value A: %1 Value B: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "VALUE_A",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "VALUE_B",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": "#32CD32",
    "type": "MULTIPLY"
  },
{
    "message0": "Divide Value A: %1 Value B: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "VALUE_A",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "VALUE_B",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": "#32CD32",
    "type": "DIVIDE"
  },
{
    "message0": "Power Base: %1 Exponent: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "BASE",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "EXPONENT",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": "#32CD32",
    "type": "POWER"
  },
{
    "message0": "Square Root Value: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "VALUE",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": "#32CD32",
    "type": "SQUAREROOT"
  },
{
    "message0": "Absolute Value: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "VALUE",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": "#32CD32",
    "type": "ABSOLUTE"
  },
{
    "message0": "Modulo Dividend: %1 Divisor: %2",
    "args0": [
      {
        "type": "input_value",
        "name": "DIVIDEND",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "DIVISOR",
        "check": "Number"
      }
    ],
    "output": "Number",
    "colour": "#32CD32",
    "type": "MODULO"
  },
{
    "message0": "SetObjectiveState Objective: %1 State: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "OBJECTIVE"
      },
      {
        "type": "field_input",
        "name": "STATE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#F9A825",
    "type": "SETOBJECTIVESTATE"
  },
{
    "message0": "GetObjectiveState Objective: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "OBJECTIVE"
      }
    ],
    "output": "GETOBJECTIVESTATE",
    "colour": "#F9A825",
    "type": "GETOBJECTIVESTATE"
  },
{
    "message0": "Comment Text: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "TEXT"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#9E9E9E",
    "type": "COMMENT"
  },
{
    "message0": "Get Player By Id Player Id: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER_ID"
      }
    ],
    "output": "GETPLAYERBYID",
    "colour": "#C2185B",
    "type": "GETPLAYERBYID"
  },
{
    "message0": "Get Player Name Player: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      }
    ],
    "output": "GETPLAYERNAME",
    "colour": "#C2185B",
    "type": "GETPLAYERNAME"
  },
{
    "message0": "Get Player Health Player: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      }
    ],
    "output": "GETPLAYERHEALTH",
    "colour": "#C2185B",
    "type": "GETPLAYERHEALTH"
  },
{
    "message0": "Teleport Player Player: %1 Position: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      },
      {
        "type": "field_input",
        "name": "POSITION"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#C2185B",
    "type": "TELEPORTPLAYER"
  },
{
    "message0": "Kill Player Player: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#C2185B",
    "type": "KILLPLAYER"
  },
{
    "message0": "Get Player Team Player: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "PLAYER",
        "check": "Player"
      }
    ],
    "output": "Team",
    "colour": "#C2185B",
    "type": "GETPLAYERTEAM"
  },
{
    "message0": "Set Player Team Player: %1 Team: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      },
      {
        "type": "field_input",
        "name": "TEAM"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#C2185B",
    "type": "SETPLAYERTEAM"
  },
{
    "message0": "Return",
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#E6A85C",
    "type": "RETURN"
  },
{
    "message0": "Vector X: %1 Y: %2 Z: %3",
    "args0": [
      {
        "type": "field_input",
        "name": "X"
      },
      {
        "type": "field_input",
        "name": "Y"
      },
      {
        "type": "field_input",
        "name": "Z"
      }
    ],
    "output": "VECTOR",
    "colour": "#212121",
    "type": "VECTOR"
  },
{
    "message0": "Vector Towards Start Pos: %1 End Pos: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "START_POS"
      },
      {
        "type": "field_input",
        "name": "END_POS"
      }
    ],
    "output": "VECTORTOWARDS",
    "colour": "#212121",
    "type": "VECTORTOWARDS"
  },
{
    "message0": "Distance Between Position A: %1 Position B: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "POSITION_A"
      },
      {
        "type": "field_input",
        "name": "POSITION_B"
      }
    ],
    "output": "DISTANCEBETWEEN",
    "colour": "#212121",
    "type": "DISTANCEBETWEEN"
  },
{
    "message0": "X Component Of Vector: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "VECTOR"
      }
    ],
    "output": "XCOMPONENTOF",
    "colour": "#212121",
    "type": "XCOMPONENTOF"
  },
{
    "message0": "Y Component Of Vector: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "VECTOR"
      }
    ],
    "output": "YCOMPONENTOF",
    "colour": "#212121",
    "type": "YCOMPONENTOF"
  },
{
    "message0": "Z Component Of Vector: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "VECTOR"
      }
    ],
    "output": "ZCOMPONENTOF",
    "colour": "#212121",
    "type": "ZCOMPONENTOF"
  },
{
    "message0": "Normalize Vector: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "VECTOR"
      }
    ],
    "output": "NORMALIZE",
    "colour": "#212121",
    "type": "NORMALIZE"
  },
{
    "message0": "Dot Product Vector A: %1 Vector B: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "VECTOR_A"
      },
      {
        "type": "field_input",
        "name": "VECTOR_B"
      }
    ],
    "output": "DOTPRODUCT",
    "colour": "#212121",
    "type": "DOTPRODUCT"
  },
{
    "message0": "Cross Product Vector A: %1 Vector B: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "VECTOR_A"
      },
      {
        "type": "field_input",
        "name": "VECTOR_B"
      }
    ],
    "output": "CROSSPRODUCT",
    "colour": "#212121",
    "type": "CROSSPRODUCT"
  },
{
    "message0": "Magnitude Of Vector: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "VECTOR"
      }
    ],
    "output": "VECTORMAGNITUDE",
    "colour": "#212121",
    "type": "VECTORMAGNITUDE"
  },
{
    "message0": "Up",
    "output": "UP",
    "colour": "#212121",
    "type": "UP"
  },
{
    "message0": "Down",
    "output": "DOWN",
    "colour": "#212121",
    "type": "DOWN"
  },
{
    "message0": "Left",
    "output": "LEFT",
    "colour": "#212121",
    "type": "LEFT"
  },
{
    "message0": "Right",
    "output": "RIGHT",
    "colour": "#212121",
    "type": "RIGHT"
  },
{
    "message0": "Forward",
    "output": "FORWARD",
    "colour": "#212121",
    "type": "FORWARD"
  },
{
    "message0": "Backward",
    "output": "BACKWARD",
    "colour": "#212121",
    "type": "BACKWARD"
  },
{
    "message0": "Show Message Player: %1 Message: %2 Duration: %3",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      },
      {
        "type": "field_input",
        "name": "MESSAGE"
      },
      {
        "type": "field_input",
        "name": "DURATION"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#607D8B",
    "type": "SHOWMESSAGE"
  },
{
    "message0": "Show Big Message Player: %1 Title: %2 Subtitle: %3 Duration: %4",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      },
      {
        "type": "field_input",
        "name": "TITLE"
      },
      {
        "type": "field_input",
        "name": "SUBTITLE"
      },
      {
        "type": "field_input",
        "name": "DURATION"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#607D8B",
    "type": "SHOWBIGMESSAGE"
  },
{
    "message0": "Show Notification Player: %1 Text: %2 Icon: %3",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      },
      {
        "type": "field_input",
        "name": "TEXT"
      },
      {
        "type": "field_input",
        "name": "ICON"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#607D8B",
    "type": "SHOWNOTIFICATION"
  },
{
    "message0": "Set HUD Visible Player: %1 Hud Element: %2 Visible: %3",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      },
      {
        "type": "field_input",
        "name": "HUD_ELEMENT"
      },
      {
        "type": "field_input",
        "name": "VISIBLE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#607D8B",
    "type": "SETHUDVISIBLE"
  },
{
    "message0": "Update HUD Text Player: %1 Hud Id: %2 Text: %3",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      },
      {
        "type": "field_input",
        "name": "HUD_ID"
      },
      {
        "type": "field_input",
        "name": "TEXT"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#607D8B",
    "type": "UPDATEHUDTEXT"
  },
{
    "message0": "Create Custom HUD Player: %1 Hud Config: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      },
      {
        "type": "field_input",
        "name": "HUD_CONFIG"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#607D8B",
    "type": "CREATECUSTOMHUD"
  },
{
    "message0": "Create World Marker Location: %1 Icon: %2 Text: %3",
    "args0": [
      {
        "type": "field_input",
        "name": "LOCATION"
      },
      {
        "type": "field_input",
        "name": "ICON"
      },
      {
        "type": "field_input",
        "name": "TEXT"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#607D8B",
    "type": "CREATEWORLDMARKER"
  },
{
    "message0": "Remove World Marker Marker Id: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "MARKER_ID"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#607D8B",
    "type": "REMOVEWORLDMARKER"
  },
{
    "message0": "Set Objective Marker Player: %1 Location: %2 Text: %3",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      },
      {
        "type": "field_input",
        "name": "LOCATION"
      },
      {
        "type": "field_input",
        "name": "TEXT"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#607D8B",
    "type": "SETOBJECTIVEMARKER"
  },
{
    "message0": "Update Scoreboard Entries: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "ENTRIES"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#607D8B",
    "type": "UPDATESCOREBOARD"
  },
{
    "message0": "Show Scoreboard Player: %1 Visible: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      },
      {
        "type": "field_input",
        "name": "VISIBLE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#607D8B",
    "type": "SHOWSCOREBOARD"
  },
{
    "message0": "%1",
    "args0": [
      {
        "type": "field_number",
        "name": "NUM",
        "value": 0
      }
    ],
    "output": "Number",
    "colour": "#32CD32",
    "type": "NUMBER"
  },
{
    "message0": "%1",
    "args0": [
      {
        "type": "field_input",
        "name": "TEXT",
        "text": ""
      }
    ],
    "output": "String",
    "colour": "#32CD32",
    "type": "STRING"
  },
{
    "message0": "%1",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "BOOL",
        "options": [
          ["true", "TRUE"],
          ["false", "FALSE"]
        ]
      }
    ],
    "output": "Boolean",
    "colour": "#32CD32",
    "type": "BOOLEAN"
  },
{
    "message0": "Set %1 to %2",
    "args0": [
      {
        "type": "field_variable",
        "name": "VARIABLE",
        "variable": "item"
      },
      {
        "type": "input_value",
        "name": "VALUE",
        "check": null
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#FFEB3B",
    "type": "SETVARIABLE"
  },
{
    "message0": "%1",
    "args0": [
      {
        "type": "field_variable",
        "name": "VARIABLE_NAME",
        "variable": "item"
      }
    ],
    "output": "Any",
    "colour": "#32CD32",
    "type": "GETVARIABLE"
  },
{
    "message0": "Spawn Vehicle Vehicle Type: %1 Location: %2 Team: %3",
    "args0": [
      {
        "type": "field_input",
        "name": "VEHICLE_TYPE"
      },
      {
        "type": "field_input",
        "name": "LOCATION"
      },
      {
        "type": "field_input",
        "name": "TEAM"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#E64A19",
    "type": "SPAWNVEHICLE"
  },
{
    "message0": "Despawn Vehicle Vehicle: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "VEHICLE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#E64A19",
    "type": "DESPAWNVEHICLE"
  },
{
    "message0": "Get Vehicle Health Vehicle: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "VEHICLE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#E64A19",
    "type": "GETVEHICLEHEALTH"
  },
{
    "message0": "Set Vehicle Health Vehicle: %1 Health: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "VEHICLE"
      },
      {
        "type": "field_input",
        "name": "HEALTH"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#E64A19",
    "type": "SETVEHICLEHEALTH"
  },
{
    "message0": "Get Vehicle Driver Vehicle: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "VEHICLE"
      }
    ],
    "output": "GETVEHICLEDRIVER",
    "colour": "#E64A19",
    "type": "GETVEHICLEDRIVER"
  },
{
    "message0": "Eject from Vehicle Player: %1 Vehicle: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "PLAYER"
      },
      {
        "type": "field_input",
        "name": "VEHICLE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#E64A19",
    "type": "EJECTFROMVEHICLE"
  },
{
    "message0": "Lock Vehicle Vehicle: %1 Team: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "VEHICLE"
      },
      {
        "type": "field_input",
        "name": "TEAM"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#E64A19",
    "type": "LOCKVEHICLE"
  },
{
    "message0": "Set Vehicle Speed Vehicle: %1 Speed: %2",
    "args0": [
      {
        "type": "field_input",
        "name": "VEHICLE"
      },
      {
        "type": "field_input",
        "name": "SPEED"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#E64A19",
    "type": "SETVEHICLESPEED"
  },
{
    "message0": "Disable Vehicle Vehicle: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "VEHICLE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#E64A19",
    "type": "DISABLEVEHICLE"
  },
{
    "message0": "Enable Vehicle Vehicle: %1",
    "args0": [
      {
        "type": "field_input",
        "name": "VEHICLE"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#E64A19",
    "type": "ENABLEVEHICLE"
  },
{
    "type": "SET_SCOREBOARD_COLUMN_WIDTHS",
    "message0": "Set Scoreboard Column Widths: %1",
    "args0": [
      {
        "type": "input_value",
        "name": "WIDTHS",
        "check": "Array"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "Sets the widths for scoreboard columns.",
    "helpUrl": "",
    "colour": "#607D8B"
  },
{
    "type": "VEHICLE_LIST_ITEM",
    "message0": "Vehicle %1 %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "VEHICLE_LIST_SELECTOR",
        "options": [
          ["VehicleList", "VEHICLE_LIST"]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "VEHICLE_TYPE",
        "options": [
          ["Abrams", "Abrams"],
          ["AH64", "AH64"],
          ["Cheetah", "Cheetah"],
          ["CV90", "CV90"],
          ["Eurocopter", "Eurocopter"],
          ["F16", "F16"],
          ["F22", "F22"],
          ["Flyer60", "Flyer60"],
          ["Gepard", "Gepard"],
          ["GolfCart", "GolfCart"],
          ["JAS39", "JAS39"],
          ["Leopard", "Leopard"],
          ["M2Bradley", "M2Bradley"],
          ["Marauder", "Marauder"],
          ["Marauder_Pax", "Marauder_Pax"],
          ["Quadbike", "Quadbike"],
          ["RHIB", "RHIB"],
          ["SU57", "SU57"],
          ["UH60", "UH60"],
          ["UH60_Pax", "UH60_Pax"],
          ["Vector", "Vector"]
        ]
      }
    ],
    "output": "VEHICLE_LIST_ITEM",
    "colour": "#FF0000"
  },
  {
    "type": "GETWAYPOINTPATH",
    "message0": "Get Waypoint Path %1",
    "args0": [
      { "type": "field_input", "name": "PATH_NAME", "text": "Path1" }
    ],
    "output": "Array",
    "colour": "#4CAF50",
    "tooltip": "Returns a waypoint path."
  },
  {
    "type": "CHASEVARIABLEATRATE",
    "message0": "Chase Variable %1 At Rate %2 Destination %3",
    "args0": [
      { "type": "field_variable", "name": "VAR", "variable": "item" },
      { "type": "input_value", "name": "RATE", "check": "Number" },
      { "type": "input_value", "name": "DEST", "check": "Number" }
    ],
    "previousStatement": "Action",
    "nextStatement": "Action",
    "colour": "#FFEB3B",
    "tooltip": "Chases a variable at a specific rate."
  },
  {
    "type": "CHASEVARIABLEOVERTIME",
    "message0": "Chase Variable %1 Over Time %2 Destination %3",
    "args0": [
      { "type": "field_variable", "name": "VAR", "variable": "item" },
      { "type": "input_value", "name": "TIME", "check": "Number" },
      { "type": "input_value", "name": "DEST", "check": "Number" }
    ],
    "previousStatement": "Action",
    "nextStatement": "Action",
    "colour": "#FFEB3B",
    "tooltip": "Chases a variable over a specific time."
  },
  {
    "type": "SKIP",
    "message0": "Skip",
    "previousStatement": "Action",
    "nextStatement": "Action",
    "colour": "#FFEB3B",
    "tooltip": "Skips the current action."
  },
  {
    "type": "SKIPIF",
    "message0": "Skip If %1",
    "args0": [
      { "type": "input_value", "name": "CONDITION", "check": "Boolean" }
    ],
    "previousStatement": "Action",
    "nextStatement": "Action",
    "colour": "#FFEB3B",
    "tooltip": "Skips the current action if condition is true."
  },
  {
    "type": "STOPCHASINGVARIABLE",
    "message0": "Stop Chasing Variable %1",
    "args0": [
      { "type": "field_variable", "name": "VAR", "variable": "item" }
    ],
    "previousStatement": "Action",
    "nextStatement": "Action",
    "colour": "#FFEB3B",
    "tooltip": "Stops chasing a variable."
  },
  {
    "type": "ACTION_BLOCK",
    "message0": "Action",
    "previousStatement": "Action",
    "nextStatement": "Action",
    "colour": "#B5A045",
    "tooltip": "A placeholder action block."
  },
  {
    "type": "CONTROL_ACTION_BLOCK",
    "message0": "Control Action:",
    "previousStatement": "Action",
    "nextStatement": "Action",
    "colour": "#A285E6",
    "tooltip": "A placeholder control action block."
  }
]);