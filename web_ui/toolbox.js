var TOOLBOX_CONFIG = {
  "kind": "categoryToolbox",
  "contents": [
    {
      "kind": "category",
      "name": "Home",
      "contents": [
        {
          "kind": "category",
          "name": "Logic",
          "categorystyle": "logic_category",
          "contents": [
            { "kind": "block", "type": "controls_if" },
            { "kind": "block", "type": "logic_compare" },
            { "kind": "block", "type": "logic_operation" },
            { "kind": "block", "type": "logic_negate" },
            { "kind": "block", "type": "logic_boolean" },
            { "kind": "block", "type": "logic_null", "disabled": "true" },
            { "kind": "block", "type": "logic_ternary" }
          ]
        },
        {
          "kind": "category",
          "name": "Loops",
          "categorystyle": "loop_category",
          "contents": [
            { "kind": "block", "type": "controls_repeat_ext", "inputs": { "TIMES": { "shadow": { "type": "math_number", "fields": { "NUM": 10 } } } } },
            { "kind": "block", "type": "controls_repeat", "disabled": "true" },
            { "kind": "block", "type": "controls_whileUntil" },
            { "kind": "block", "type": "controls_for", "inputs": { "FROM": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } }, "TO": { "shadow": { "type": "math_number", "fields": { "NUM": 10 } } }, "BY": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } } } },
            { "kind": "block", "type": "controls_forEach" },
            { "kind": "block", "type": "controls_flow_statements" }
          ]
        },
        {
          "kind": "category",
          "name": "Math",
          "categorystyle": "math_category",
          "contents": [
            { "kind": "block", "type": "math_number", "fields": { "NUM": 123 } },
            { "kind": "block", "type": "math_arithmetic", "inputs": { "A": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } }, "B": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } } } },
            { "kind": "block", "type": "math_single", "inputs": { "NUM": { "shadow": { "type": "math_number", "fields": { "NUM": 9 } } } } },
            { "kind": "block", "type": "math_trig", "inputs": { "NUM": { "shadow": { "type": "math_number", "fields": { "NUM": 45 } } } } },
            { "kind": "block", "type": "math_constant" },
            { "kind": "block", "type": "math_number_property", "inputs": { "NUMBER_TO_CHECK": { "shadow": { "type": "math_number", "fields": { "NUM": 0 } } } } },
            { "kind": "block", "type": "math_round", "inputs": { "NUM": { "shadow": { "type": "math_number", "fields": { "NUM": 3.1 } } } } },
            { "kind": "block", "type": "math_on_list" },
            { "kind": "block", "type": "math_modulo", "inputs": { "DIVIDEND": { "shadow": { "type": "math_number", "fields": { "NUM": 64 } } }, "DIVISOR": { "shadow": { "type": "math_number", "fields": { "NUM": 10 } } } } },
            { "kind": "block", "type": "math_constrain", "inputs": { "VALUE": { "shadow": { "type": "math_number", "fields": { "NUM": 50 } } }, "LOW": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } }, "HIGH": { "shadow": { "type": "math_number", "fields": { "NUM": 100 } } } } },
            { "kind": "block", "type": "math_random_int", "inputs": { "FROM": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } }, "TO": { "shadow": { "type": "math_number", "fields": { "NUM": 100 } } } } },
            { "kind": "block", "type": "math_random_float" },
            { "kind": "block", "type": "math_atan2", "inputs": { "X": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } }, "Y": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } } } }
          ]
        },
        {
          "kind": "category",
          "name": "Text",
          "categorystyle": "text_category",
          "contents": [
            { "kind": "block", "type": "text" },
            { "kind": "block", "type": "text_join" },
            { "kind": "block", "type": "text_append", "inputs": { "TEXT": { "shadow": { "type": "text" } } } },
            { "kind": "block", "type": "text_length", "inputs": { "VALUE": { "shadow": { "type": "text", "fields": { "TEXT": "abc" } } } } },
            { "kind": "block", "type": "text_isEmpty", "inputs": { "VALUE": { "shadow": { "type": "text", "fields": { "TEXT": "" } } } } },
            { "kind": "block", "type": "text_indexOf", "inputs": { "VALUE": { "block": { "type": "text", "fields": { "TEXT": "abc" } } }, "FIND": { "shadow": { "type": "text", "fields": { "TEXT": "b" } } } } },
            { "kind": "block", "type": "text_charAt", "inputs": { "VALUE": { "block": { "type": "text", "fields": { "TEXT": "abc" } } } } },
            { "kind": "block", "type": "text_getSubstring", "inputs": { "STRING": { "block": { "type": "text", "fields": { "TEXT": "abc" } } } } },
            { "kind": "block", "type": "text_changeCase", "inputs": { "TEXT": { "shadow": { "type": "text", "fields": { "TEXT": "abc" } } } } },
            { "kind": "block", "type": "text_trim", "inputs": { "TEXT": { "shadow": { "type": "text", "fields": { "TEXT": "abc" } } } } },
            { "kind": "block", "type": "text_print", "inputs": { "TEXT": { "shadow": { "type": "text", "fields": { "TEXT": "abc" } } } } },
            { "kind": "block", "type": "text_prompt_ext", "inputs": { "TEXT": { "shadow": { "type": "text", "fields": { "TEXT": "abc" } } } } }
          ]
        },
        {
          "kind": "category",
          "name": "Lists",
          "categorystyle": "list_category",
          "contents": [
            { "kind": "block", "type": "lists_create_with", "mutation": { "items": "0" } },
            { "kind": "block", "type": "lists_create_with" },
            { "kind": "block", "type": "lists_repeat", "inputs": { "NUM": { "shadow": { "type": "math_number", "fields": { "NUM": 5 } } } } },
            { "kind": "block", "type": "lists_length" },
            { "kind": "block", "type": "lists_isEmpty" },
            { "kind": "block", "type": "lists_indexOf" },
            { "kind": "block", "type": "lists_getIndex" },
            { "kind": "block", "type": "lists_setIndex" },
            { "kind": "block", "type": "lists_getSublist" },
            { "kind": "block", "type": "lists_split", "inputs": { "DELIM": { "shadow": { "type": "text", "fields": { "TEXT": "," } } } } },
            { "kind": "block", "type": "lists_sort" }
          ]
        },
        {
          "kind": "category",
          "name": "Colour",
          "categorystyle": "colour_category",
          "contents": [
            { "kind": "block", "type": "colour_picker" },
            { "kind": "block", "type": "colour_random" },
            { "kind": "block", "type": "colour_rgb", "inputs": { "RED": { "shadow": { "type": "math_number", "fields": { "NUM": 100 } } }, "GREEN": { "shadow": { "type": "math_number", "fields": { "NUM": 50 } } }, "BLUE": { "shadow": { "type": "math_number", "fields": { "NUM": 0 } } } } },
            { "kind": "block", "type": "colour_blend", "inputs": { "COLOUR1": { "shadow": { "type": "colour_picker", "fields": { "COLOUR": "#ff0000" } } }, "COLOUR2": { "shadow": { "type": "colour_picker", "fields": { "COLOUR": "#3333ff" } } }, "RATIO": { "shadow": { "type": "math_number", "fields": { "NUM": 0.5 } } } } }
          ]
        },
        {
          "kind": "sep"
        },
        {
          "kind": "category",
          "name": "Variables",
          "categorystyle": "variable_category",
          "custom": "VARIABLE",
          "contents": [
            { "kind": "button", "text": "Manage Variables", "callbackkey": "manageVariables" }
          ]
        },
        {
          "kind": "category",
          "name": "Functions",
          "categorystyle": "procedure_category",
          "custom": "PROCEDURE"
        }
      ]
    },
    {
      "kind": "category",
      "name": "BF6 Portal",
      "contents": [
        { "kind": "block", "type": "MOD_BLOCK" },
        { "kind": "category", "name": "RULES", "categorystyle": "rules_category", "contents": [{ "kind": "block", "type": "RULE_HEADER" }, { "kind": "block", "type": "CONDITION_BLOCK" }] },
        { "kind": "category", "name": "SUBROUTINES", "categorystyle": "subroutines_category", "contents": [{ "kind": "block", "type": "SUBROUTINE_BLOCK" }, { "kind": "block", "type": "SUBROUTINE_REFERENCE_BLOCK" }] },
        { "kind": "category", "name": "CONDITIONS", "categorystyle": "conditions_category", "contents": [{ "kind": "block", "type": "CONDITION_BLOCK" }] },
        { "kind": "category", "name": "ACTIONS", "categorystyle": "actions_category", "contents": [{ "kind": "block", "type": "ACTION_BLOCK" }, { "kind": "block", "type": "CONTROL_ACTION_BLOCK" }] },
        { "kind": "category", "name": "EVENTS", "categorystyle": "events_category", "contents": [
            { "kind": "block", "type": "ON_GAME_START" },
            { "kind": "block", "type": "ON_PLAYER_JOIN" }
        ] },
        { "kind": "category", "name": "EVENT PAYLOADS", "categorystyle": "event_payloads_category", "contents": [
            { "kind": "block", "type": "EVENT_ATTACKER" },
            { "kind": "block", "type": "EVENT_DAMAGE" },
            { "kind": "block", "type": "EVENT_LOCATION" },
            { "kind": "block", "type": "EVENT_PLAYER" },
            { "kind": "block", "type": "EVENT_TEAM" },
            { "kind": "block", "type": "EVENT_VICTIM" },
            { "kind": "block", "type": "EVENT_WEAPON" }
        ] },
        { "kind": "category", "name": "AI", "categorystyle": "ai_category", "contents": [
            { "kind": "block", "type": "AIBATTLEFIELD_BEHAVIOR" },
            { "kind": "block", "type": "AIDEFEND_POSITION_BEHAVIOR" },
            { "kind": "block", "type": "AI_IDLE_BEHAVIOR" },
            { "kind": "block", "type": "AI_MOVE_TO_BEHAVIOR" },
            { "kind": "block", "type": "AI_PARACHUTE_BEHAVIOR" },
            { "kind": "block", "type": "AI_WAYPOINT_IDLE_BEHAVIOR" },
            { "kind": "block", "type": "AI_FOLLOW_PLAYER" },
            { "kind": "block", "type": "AI_HOLD_POSITION" },
            { "kind": "block", "type": "AI_ATTACK_TARGET" },
            { "kind": "block", "type": "SET_AI_BEHAVIOR" },
            { "kind": "block", "type": "DEPLOY_AI" },
            { "kind": "block", "type": "DESPAWN_AI" },
            { "kind": "block", "type": "SET_AI_SPAWN_LOCATION" },
            { "kind": "block", "type": "SET_AI_HEALTH" },
            { "kind": "block", "type": "SET_AI_TEAM" },
            { "kind": "block", "type": "GET_AI_HEALTH" },
            { "kind": "block", "type": "GET_AI_TEAM" },
            { "kind": "block", "type": "AI_IS_ALIVE" }
        ] },
        { "kind": "category", "name": "ARRAYS", "categorystyle": "arrays_category", "contents": [
            { "kind": "block", "type": "CREATE_ARRAY" },
            { "kind": "block", "type": "ARRAY_LENGTH" },
            { "kind": "block", "type": "GET_ELEMENT" },
            { "kind": "block", "type": "SET_ELEMENT" },
            { "kind": "block", "type": "APPEND_TO_ARRAY" },
            { "kind": "block", "type": "REMOVE_FROM_ARRAY" },
            { "kind": "block", "type": "FIND_FIRST" },
            { "kind": "block", "type": "SORT_ARRAY" }
        ] },
        { "kind": "category", "name": "AUDIO", "categorystyle": "audio_category", "contents": [
            { "kind": "block", "type": "AUDIOLOADMUSIC" },
            { "kind": "block", "type": "AUDIOPLAYMUSIC" },
            { "kind": "block", "type": "AUDIOSETMUSICPARAM" },
            { "kind": "block", "type": "AUDIOUNLOADMUSIC" },
            { "kind": "block", "type": "AUDIOPLAYSOUND" },
            { "kind": "block", "type": "AUDIOPLAYVO" },
            { "kind": "block", "type": "AUDIOSTOPSOUND" }
        ] },
        { "kind": "category", "name": "CAMERA", "categorystyle": "camera_category", "contents": [
            { "kind": "block", "type": "CAMERASETPLAYERCAMERA" },
            { "kind": "block", "type": "CAMERALOCKCAMERATOTARGET" },
            { "kind": "block", "type": "CAMERACAMERASHAKE" },
            { "kind": "block", "type": "CAMERASETCAMERAFOV" },
            { "kind": "block", "type": "CAMERARESETCAMERA" },
            { "kind": "block", "type": "CAMERAFIRSTPERSONCAMERA" },
            { "kind": "block", "type": "CAMERATHIRDPERSONCAMERA" },
            { "kind": "block", "type": "CAMERAFREECAMERA" },
            { "kind": "block", "type": "CAMERASPECTATORCAMERA" }
        ] },
        { "kind": "category", "name": "EFFECTS", "categorystyle": "effects_category", "contents": [
            { "kind": "block", "type": "PLAY_EFFECT" },
            { "kind": "block", "type": "STOP_EFFECT" },
            { "kind": "block", "type": "PARTICLE_EFFECT" },
            { "kind": "block", "type": "EXPLOSION_EFFECT" },
            { "kind": "block", "type": "SCREEN_FLASH" },
            { "kind": "block", "type": "SCREEN_FADE" },
            { "kind": "block", "type": "APPLY_SCREEN_FILTER" }
        ] },
        { "kind": "category", "name": "EMPLACEMENTS", "categorystyle": "emplacements_category", "contents": [
            { "kind": "block", "type": "DEPLOY_EMPLACEMENT" }
        ] },
        { "kind": "category", "name": "GAMEPLAY", "categorystyle": "gameplay_category", "contents": [
            { "kind": "block", "type": "GET_GAMEMODE" },
            { "kind": "block", "type": "SET_GAMEMODE" },
            { "kind": "block", "type": "ENABLE_FRIENDLY_FIRE" },
            { "kind": "block", "type": "SET_SCORE" },
            { "kind": "block", "type": "GET_SCORE" },
            { "kind": "block", "type": "SET_TIME_LIMIT" },
            { "kind": "block", "type": "GET_TIME_LIMIT" }
        ] },
        { "kind": "category", "name": "LOGIC", "categorystyle": "logic_category", "contents": [
            { "kind": "block", "type": "EQUAL" },
            { "kind": "block", "type": "NOT_EQUAL" },
            { "kind": "block", "type": "LESS_THAN" },
            { "kind": "block", "type": "LESS_THAN_OR_EQUAL" },
            { "kind": "block", "type": "GREATER_THAN" },
            { "kind": "block", "type": "GREATER_THAN_OR_EQUAL" },
            { "kind": "block", "type": "AND" },
            { "kind": "block", "type": "OR" },
            { "kind": "block", "type": "NOT" },
            { "kind": "block", "type": "TRUE" },
            { "kind": "block", "type": "FALSE" },
            { "kind": "block", "type": "IF" },
            { "kind": "block", "type": "WHILE" },
            { "kind": "block", "type": "FOR_VARIABLE" },
            { "kind": "block", "type": "BREAK" },
            { "kind": "block", "type": "CONTINUE" },
            { "kind": "block", "type": "WAIT" },
            { "kind": "block", "type": "WAIT_UNTIL" }
        ] },
        { "kind": "category", "name": "MATH", "categorystyle": "math_category", "contents": [
            { "kind": "block", "type": "ADD" },
            { "kind": "block", "type": "SUBTRACT" },
            { "kind": "block", "type": "MULTIPLY" },
            { "kind": "block", "type": "DIVIDE" },
            { "kind": "block", "type": "POWER" },
            { "kind": "block", "type": "SQUARE_ROOT" },
            { "kind": "block", "type": "ABSOLUTE" },
            { "kind": "block", "type": "MODULO" }
        ] },
        { "kind": "category", "name": "OBJECTIVE", "categorystyle": "objective_category", "contents": [
            { "kind": "block", "type": "SET_OBJECTIVE_STATE" },
            { "kind": "block", "type": "GET_OBJECTIVE_STATE" }
        ] },
        { "kind": "category", "name": "OTHER", "categorystyle": "other_category", "contents": [
            { "kind": "block", "type": "COMMENT" }
        ] },
        { "kind": "category", "name": "PLAYER", "categorystyle": "player_category", "contents": [
            { "kind": "block", "type": "GET_PLAYER_BY_ID" },
            { "kind": "block", "type": "GET_PLAYER_NAME" },
            { "kind": "block", "type": "GET_PLAYER_HEALTH" },
            { "kind": "block", "type": "TELEPORT_PLAYER" },
            { "kind": "block", "type": "KILL_PLAYER" },
            { "kind": "block", "type": "GET_PLAYER_TEAM" },
            { "kind": "block", "type": "SET_PLAYER_TEAM" }
        ] },
        { "kind": "category", "name": "TRANSFORM", "categorystyle": "transform_category", "contents": [
            { "kind": "block", "type": "VECTOR" },
            { "kind": "block", "type": "VECTOR_TOWARDS" },
            { "kind": "block", "type": "DISTANCE_BETWEEN" },
            { "kind": "block", "type": "X_COMPONENT_OF" },
            { "kind": "block", "type": "Y_COMPONENT_OF" },
            { "kind": "block", "type": "Z_COMPONENT_OF" },
            { "kind": "block", "type": "NORMALIZE" },
            { "kind": "block", "type": "DOT_PRODUCT" },
            { "kind": "block", "type": "CROSS_PRODUCT" },
            { "kind": "block", "type": "VECTOR_MAGNITUDE" },
            { "kind": "block", "type": "UP" },
            { "kind": "block", "type": "DOWN" },
            { "kind": "block", "type": "LEFT" },
            { "kind": "block", "type": "RIGHT" },
            { "kind": "block", "type": "FORWARD" },
            { "kind": "block", "type": "BACKWARD" }
        ] },
        { "kind": "category", "name": "USER INTERFACE", "categorystyle": "ui_category", "contents": [
            { "kind": "block", "type": "SHOW_MESSAGE" },
            { "kind": "block", "type": "SHOW_BIG_MESSAGE" },
            { "kind": "block", "type": "SHOW_NOTIFICATION" },
            { "kind": "block", "type": "SET_HUD_VISIBLE" },
            { "kind": "block", "type": "UPDATE_HUD_TEXT" },
            { "kind": "block", "type": "CREATE_CUSTOM_HUD" },
            { "kind": "block", "type": "CREATE_WORLD_MARKER" },
            { "kind": "block", "type": "REMOVE_WORLD_MARKER" },
            { "kind": "block", "type": "SET_OBJECTIVE_MARKER" },
            { "kind": "block", "type": "UPDATE_SCOREBOARD" },
            { "kind": "block", "type": "SHOW_SCOREBOARD" }
        ] },
        { "kind": "category", "name": "VEHICLES", "categorystyle": "vehicles_category", "contents": [
            { "kind": "block", "type": "SPAWN_VEHICLE" },
            { "kind": "block", "type": "DESPAWN_VEHICLE" },
            { "kind": "block", "type": "VEHICLE_TYPE_TANK" },
            { "kind": "block", "type": "VEHICLE_TYPE_APC" },
            { "kind": "block", "type": "VEHICLE_TYPE_HELICOPTER" },
            { "kind": "block", "type": "VEHICLE_TYPE_JET" },
            { "kind": "block", "type": "VEHICLE_TYPE_TRANSPORT" },
            { "kind": "block", "type": "GET_VEHICLE_HEALTH" },
            { "kind": "block", "type": "SET_VEHICLE_HEALTH" },
            { "kind": "block", "type": "GET_VEHICLE_DRIVER" },
            { "kind": "block", "type": "EJECT_FROM_VEHICLE" },
            { "kind": "block", "type": "LOCK_VEHICLE" },
            { "kind": "block", "type": "SET_VEHICLE_SPEED" },
            { "kind": "block", "type": "DISABLE_VEHICLE" },
            { "kind": "block", "type": "ENABLE_VEHICLE" }
        ] },
        { "kind": "category", "name": "LITERALS", "categorystyle": "values_category", "contents": [
            { "kind": "block", "type": "NUMBER" },
            { "kind": "block", "type": "STRING" },
            { "kind": "block", "type": "BOOLEAN" }
        ] },
        { "kind": "category", "name": "VARIABLES (BF6)", "categorystyle": "variables_category", "contents": [
            { "kind": "block", "type": "SET_VARIABLE" },
            { "kind": "block", "type": "GET_VARIABLE" }
        ] }
      ]
    }
  ]
};