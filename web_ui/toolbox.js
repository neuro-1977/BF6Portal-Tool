var TOOLBOX_CONFIG = {
  'kind': 'categoryToolbox',
  'contents': [
    {
      'kind': 'category',
      'name': 'RULES',
      'colour': '#7B1FA2',
      'contents': [
        {
          'kind': 'category',
          'name': 'Rule Definition',
          'colour': '#7B1FA2',
          'contents': [
            { 'kind': 'block', 'type': 'RULE_HEADER' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'ACTIONS',
      'colour': '#FBC02D',
      'contents': [
        {
          'kind': 'category',
          'name': 'AI',
          'colour': '#FBC02D',
          'contents': [
            { 'kind': 'block', 'type': 'AIBattlefieldBehaviour' },
            { 'kind': 'block', 'type': 'AIDefendPositionBehaviour' },
            { 'kind': 'block', 'type': 'AIIdleBehaviour' },
            { 'kind': 'block', 'type': 'AILOSMoveTOBehaviour' },
            { 'kind': 'block', 'type': 'AIMoveToBehaviour' },
            { 'kind': 'block', 'type': 'AIParachuteBehaviour' },
            { 'kind': 'block', 'type': 'AIValidateMoveToBehaviour' },
            { 'kind': 'block', 'type': 'AIWaypointIdleBehaviour' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Player',
          'colour': '#FBC02D',
          'contents': [
            { 'kind': 'block', 'type': 'SetPlayerHealth' },
            { 'kind': 'block', 'type': 'SetPlayerLoadout' },
            { 'kind': 'block', 'type': 'Teleport' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Game',
          'colour': '#FBC02D',
          'contents': [
            { 'kind': 'block', 'type': 'EndRound' },
            { 'kind': 'block', 'type': 'PauseRound' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'CONDITIONS',
      'colour': '#43A047',
      'contents': [
        {
          'kind': 'category',
          'name': 'Comparisons',
          'colour': '#43A047',
          'contents': [
            { 'kind': 'block', 'type': 'Equal' },
            { 'kind': 'block', 'type': 'NotEqual' },
            { 'kind': 'block', 'type': 'LessThan' },
            { 'kind': 'block', 'type': 'LessThanOrEqual' },
            { 'kind': 'block', 'type': 'GreaterThan' },
            { 'kind': 'block', 'type': 'GreaterThanOrEqual' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'SUBROUTINE',
      'colour': '#795548',
      'contents': [
        {
          'kind': 'category',
          'name': 'Subroutine Definition',
          'colour': '#795548',
          'contents': [
            { 'kind': 'block', 'type': 'SUBROUTINE_BLOCK' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Call Subroutine',
          'colour': '#795548',
          'contents': [
            { 'kind': 'block', 'type': 'CallSubroutine' },
            { 'kind': 'block', 'type': 'Return' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'LOGIC',
      'colour': '#673AB7',
      'contents': [
        {
          'kind': 'category',
          'name': 'Control Flow',
          'colour': '#673AB7',
          'contents': [
            { 'kind': 'block', 'type': 'Wait' },
            { 'kind': 'block', 'type': 'WaitUntil' },
            { 'kind': 'block', 'type': 'Break' },
            { 'kind': 'block', 'type': 'Continue' },
            { 'kind': 'block', 'type': 'If' },
            { 'kind': 'block', 'type': 'While' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Boolean Logic',
          'colour': '#673AB7',
          'contents': [
            { 'kind': 'block', 'type': 'And' },
            { 'kind': 'block', 'type': 'Or' },
            { 'kind': 'block', 'type': 'Not' },
            { 'kind': 'block', 'type': 'True' },
            { 'kind': 'block', 'type': 'False' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Comparison',
          'colour': '#673AB7',
          'contents': [
            { 'kind': 'block', 'type': 'Equal' },
            { 'kind': 'block', 'type': 'NotEqual' },
            { 'kind': 'block', 'type': 'GreaterThan' },
            { 'kind': 'block', 'type': 'LessThan' },
            { 'kind': 'block', 'type': 'GreaterThanEqual' },
            { 'kind': 'block', 'type': 'LessThanEqual' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Loops',
          'colour': '#673AB7',
          'contents': [
            { 'kind': 'block', 'type': 'ForVariable' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'MATH',
      'colour': '#1976D2',
      'contents': [
        {
          'kind': 'category',
          'name': 'Operations',
          'colour': '#1976D2',
          'contents': [
            { 'kind': 'block', 'type': 'Add' },
            { 'kind': 'block', 'type': 'Subtract' },
            { 'kind': 'block', 'type': 'Multiply' },
            { 'kind': 'block', 'type': 'Divide' },
            { 'kind': 'block', 'type': 'Modulo' },
            { 'kind': 'block', 'type': 'RaiseToPower' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Trigonometry',
          'colour': '#1976D2',
          'contents': [
            { 'kind': 'block', 'type': 'Sine' },
            { 'kind': 'block', 'type': 'Cosine' },
            { 'kind': 'block', 'type': 'Tangent' },
            { 'kind': 'block', 'type': 'ArcSine' },
            { 'kind': 'block', 'type': 'ArcCosine' },
            { 'kind': 'block', 'type': 'ArcTangent' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Rounding',
          'colour': '#1976D2',
          'contents': [
            { 'kind': 'block', 'type': 'Round' },
            { 'kind': 'block', 'type': 'Ceil' },
            { 'kind': 'block', 'type': 'Floor' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Random',
          'colour': '#1976D2',
          'contents': [
            { 'kind': 'block', 'type': 'RandomInteger' },
            { 'kind': 'block', 'type': 'RandomReal' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Functions',
          'colour': '#1976D2',
          'contents': [
            { 'kind': 'block', 'type': 'AbsoluteValue' },
            { 'kind': 'block', 'type': 'SquareRoot' },
            { 'kind': 'block', 'type': 'Min' },
            { 'kind': 'block', 'type': 'Max' },
            { 'kind': 'block', 'type': 'RoundToInteger' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'VALUES',
      'colour': '#0288D1',
      'contents': [
        {
          'kind': 'category',
          'name': 'Literals',
          'colour': '#0288D1',
          'contents': [
            { 'kind': 'block', 'type': 'Number' },
            { 'kind': 'block', 'type': 'String' },
            { 'kind': 'block', 'type': 'Boolean' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Variables',
          'colour': '#0288D1',
          'contents': [
            { 'kind': 'block', 'type': 'SetVariable' },
            { 'kind': 'block', 'type': 'GetVariable' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'ARRAYS',
      'colour': '#0097A7',
      'contents': [
        {
          'kind': 'category',
          'name': 'Modification',
          'colour': '#0097A7',
          'contents': [
            { 'kind': 'block', 'type': 'SetVariableAtIndex' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Creation',
          'colour': '#0097A7',
          'contents': [
            { 'kind': 'block', 'type': 'EmptyArray' },
            { 'kind': 'block', 'type': 'ArrayLiteral' },
            { 'kind': 'block', 'type': 'ArrayOfSize' },
            { 'kind': 'block', 'type': 'ArrayFromPlayers' },
            { 'kind': 'block', 'type': 'ArrayFromDeadPlayers' },
            { 'kind': 'block', 'type': 'ArrayFromLivingPlayers' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Manipulation',
          'colour': '#0097A7',
          'contents': [
            { 'kind': 'block', 'type': 'ClearArray' },
            { 'kind': 'block', 'type': 'ConcatArrays' },
            { 'kind': 'block', 'type': 'ReverseArray' },
            { 'kind': 'block', 'type': 'AppendToArray' },
            { 'kind': 'block', 'type': 'RemoveFromArray' },
            { 'kind': 'block', 'type': 'RemoveFromArrayByIndex' },
            { 'kind': 'block', 'type': 'ArraySlice' },
            { 'kind': 'block', 'type': 'RandomValueInArray' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Access',
          'colour': '#0097A7',
          'contents': [
            { 'kind': 'block', 'type': 'ValueInArray' },
            { 'kind': 'block', 'type': 'FirstOf' },
            { 'kind': 'block', 'type': 'LastOf' },
            { 'kind': 'block', 'type': 'IndexOfArrayValue' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Query',
          'colour': '#0097A7',
          'contents': [
            { 'kind': 'block', 'type': 'CountOf' },
            { 'kind': 'block', 'type': 'ArrayContains' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Filtering',
          'colour': '#0097A7',
          'contents': [
            { 'kind': 'block', 'type': 'ForEachInArray' },
            { 'kind': 'block', 'type': 'MapArray' },
            { 'kind': 'block', 'type': 'FilteredArray' },
            { 'kind': 'block', 'type': 'SortedArray' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'PLAYER',
      'colour': '#C2185B',
      'contents': [
        {
          'kind': 'category',
          'name': 'Player State',
          'colour': '#C2185B',
          'contents': [
            { 'kind': 'block', 'type': 'EventPlayer' },
            { 'kind': 'block', 'type': 'GetPlayerHealth' },
            { 'kind': 'block', 'type': 'GetPlayerMaxHealth' },
            { 'kind': 'block', 'type': 'IsPlayerAlive' },
            { 'kind': 'block', 'type': 'IsPlayerDead' },
            { 'kind': 'block', 'type': 'GetPlayerTeam' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Player Actions',
          'colour': '#C2185B',
          'contents': [
            { 'kind': 'block', 'type': 'SetPlayerHealth' },
            { 'kind': 'block', 'type': 'KillPlayer' },
            { 'kind': 'block', 'type': 'RespawnPlayer' },
            { 'kind': 'block', 'type': 'TeleportPlayer' },
            { 'kind': 'block', 'type': 'SetPlayerMaxHealth' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Player Info',
          'colour': '#C2185B',
          'contents': [
            { 'kind': 'block', 'type': 'GetPlayerPosition' },
            { 'kind': 'block', 'type': 'GetPlayerVelocity' },
            { 'kind': 'block', 'type': 'GetPlayerSpeed' },
            { 'kind': 'block', 'type': 'GetPlayerFacingDirection' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Player Variables',
          'colour': '#C2185B',
          'contents': [
            { 'kind': 'block', 'type': 'GetPlayerVariable' },
            { 'kind': 'block', 'type': 'SetPlayerVariable' },
            { 'kind': 'block', 'type': 'ModifyPlayerVariable' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Input',
          'colour': '#C2185B',
          'contents': [
            { 'kind': 'block', 'type': 'EnablePlayerInput' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Transform',
          'colour': '#C2185B',
          'contents': [
            { 'kind': 'block', 'type': 'GetPlayerPosition' },
            { 'kind': 'block', 'type': 'Teleport' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'VEHICLES',
      'colour': '#E64A19',
      'contents': [
        {
          'kind': 'category',
          'name': 'Vehicle Spawning',
          'colour': '#E64A19',
          'contents': [
            { 'kind': 'block', 'type': 'SpawnVehicle' },
            { 'kind': 'block', 'type': 'DespawnVehicle' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Vehicle Types',
          'colour': '#E64A19',
          'contents': [
            { 'kind': 'block', 'type': 'VehicleTypeTank' },
            { 'kind': 'block', 'type': 'VehicleTypeAPC' },
            { 'kind': 'block', 'type': 'VehicleTypeHelicopter' },
            { 'kind': 'block', 'type': 'VehicleTypeJet' },
            { 'kind': 'block', 'type': 'VehicleTypeTransport' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Vehicle Properties',
          'colour': '#E64A19',
          'contents': [
            { 'kind': 'block', 'type': 'GetVehicleHealth' },
            { 'kind': 'block', 'type': 'SetVehicleHealth' },
            { 'kind': 'block', 'type': 'GetVehicleDriver' },
            { 'kind': 'block', 'type': 'EjectFromVehicle' },
            { 'kind': 'block', 'type': 'LockVehicle' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Vehicle Control',
          'colour': '#E64A19',
          'contents': [
            { 'kind': 'block', 'type': 'SetVehicleSpeed' },
            { 'kind': 'block', 'type': 'DisableVehicle' },
            { 'kind': 'block', 'type': 'EnableVehicle' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'GAMEPLAY',
      'colour': '#5D4037',
      'contents': [
        {
          'kind': 'category',
          'name': 'Match',
          'colour': '#5D4037',
          'contents': [
            { 'kind': 'block', 'type': 'EndMatch' },
            { 'kind': 'block', 'type': 'SetMatchTime' },
            { 'kind': 'block', 'type': 'GetMatchTime' },
            { 'kind': 'block', 'type': 'PauseMatchTime' },
            { 'kind': 'block', 'type': 'ResumeMatchTime' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Teams',
          'colour': '#5D4037',
          'contents': [
            { 'kind': 'block', 'type': 'SetTeamScore' },
            { 'kind': 'block', 'type': 'GetTeamScore' },
            { 'kind': 'block', 'type': 'ModifyTeamScore' },
            { 'kind': 'block', 'type': 'DeclarePlayerTeamWinner' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Spawn',
          'colour': '#5D4037',
          'contents': [
            { 'kind': 'block', 'type': 'SetRespawnTime' },
            { 'kind': 'block', 'type': 'DisableRespawn' },
            { 'kind': 'block', 'type': 'EnableRespawn' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Global Variables',
          'colour': '#5D4037',
          'contents': [
            { 'kind': 'block', 'type': 'GetGlobalVariable' },
            { 'kind': 'block', 'type': 'SetGlobalVariable' },
            { 'kind': 'block', 'type': 'ModifyGlobalVariable' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'UI',
      'colour': '#607D8B',
      'contents': [
        {
          'kind': 'category',
          'name': 'Messages',
          'colour': '#607D8B',
          'contents': [
            { 'kind': 'block', 'type': 'ShowMessage' },
            { 'kind': 'block', 'type': 'ShowBigMessage' },
            { 'kind': 'block', 'type': 'ShowNotification' },
          ]
        },
        {
          'kind': 'category',
          'name': 'HUD Elements',
          'colour': '#607D8B',
          'contents': [
            { 'kind': 'block', 'type': 'SetHUDVisible' },
            { 'kind': 'block', 'type': 'UpdateHUDText' },
            { 'kind': 'block', 'type': 'CreateCustomHUD' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Indicators',
          'colour': '#607D8B',
          'contents': [
            { 'kind': 'block', 'type': 'CreateWorldMarker' },
            { 'kind': 'block', 'type': 'RemoveWorldMarker' },
            { 'kind': 'block', 'type': 'SetObjectiveMarker' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Scoreboard',
          'colour': '#607D8B',
          'contents': [
            { 'kind': 'block', 'type': 'UpdateScoreboard' },
            { 'kind': 'block', 'type': 'ShowScoreboard' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'AUDIO',
      'colour': '#455A64',
      'contents': [
        {
          'kind': 'category',
          'name': 'GENERAL',
          'colour': '#455A64',
          'contents': [
            { 'kind': 'block', 'type': 'LoadMusic' },
            { 'kind': 'block', 'type': 'PlayMusic' },
            { 'kind': 'block', 'type': 'SetMusicParam' },
            { 'kind': 'block', 'type': 'UnloadMusic' },
            { 'kind': 'block', 'type': 'PlaySound' },
            { 'kind': 'block', 'type': 'PlayVO' },
            { 'kind': 'block', 'type': 'StopSound' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'CAMERA',
      'colour': '#37474F',
      'contents': [
        {
          'kind': 'category',
          'name': 'Camera Control',
          'colour': '#37474F',
          'contents': [
            { 'kind': 'block', 'type': 'SetPlayerCamera' },
            { 'kind': 'block', 'type': 'LockCameraToTarget' },
            { 'kind': 'block', 'type': 'CameraShake' },
            { 'kind': 'block', 'type': 'SetCameraFOV' },
            { 'kind': 'block', 'type': 'ResetCamera' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Camera Modes',
          'colour': '#37474F',
          'contents': [
            { 'kind': 'block', 'type': 'FirstPersonCamera' },
            { 'kind': 'block', 'type': 'ThirdPersonCamera' },
            { 'kind': 'block', 'type': 'FreeCamera' },
            { 'kind': 'block', 'type': 'SpectatorCamera' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'EFFECTS',
      'colour': '#263238',
      'contents': [
        {
          'kind': 'category',
          'name': 'Visual Effects',
          'colour': '#263238',
          'contents': [
            { 'kind': 'block', 'type': 'PlayEffect' },
            { 'kind': 'block', 'type': 'StopEffect' },
            { 'kind': 'block', 'type': 'ParticleEffect' },
            { 'kind': 'block', 'type': 'ExplosionEffect' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Screen Effects',
          'colour': '#263238',
          'contents': [
            { 'kind': 'block', 'type': 'ScreenFlash' },
            { 'kind': 'block', 'type': 'ScreenFade' },
            { 'kind': 'block', 'type': 'ApplyScreenFilter' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'TRANSFORM',
      'colour': '#212121',
      'contents': [
        {
          'kind': 'category',
          'name': 'Position',
          'colour': '#212121',
          'contents': [
            { 'kind': 'block', 'type': 'Vector' },
            { 'kind': 'block', 'type': 'VectorTowards' },
            { 'kind': 'block', 'type': 'DistanceBetween' },
            { 'kind': 'block', 'type': 'XComponentOf' },
            { 'kind': 'block', 'type': 'YComponentOf' },
            { 'kind': 'block', 'type': 'ZComponentOf' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Vector Operations',
          'colour': '#212121',
          'contents': [
            { 'kind': 'block', 'type': 'Normalize' },
            { 'kind': 'block', 'type': 'DotProduct' },
            { 'kind': 'block', 'type': 'CrossProduct' },
            { 'kind': 'block', 'type': 'VectorMagnitude' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Directions',
          'colour': '#212121',
          'contents': [
            { 'kind': 'block', 'type': 'Up' },
            { 'kind': 'block', 'type': 'Down' },
            { 'kind': 'block', 'type': 'Left' },
            { 'kind': 'block', 'type': 'Right' },
            { 'kind': 'block', 'type': 'Forward' },
            { 'kind': 'block', 'type': 'Backward' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'AI',
      'colour': '#333333',
      'contents': [
        {
          'kind': 'category',
          'name': 'BEHAVIOR',
          'colour': '#333333',
          'contents': [
            { 'kind': 'block', 'type': 'AIBattlefieldBehavior' },
            { 'kind': 'block', 'type': 'AIDefendPositionBehavior' },
            { 'kind': 'block', 'type': 'AIIdleBehavior' },
            { 'kind': 'block', 'type': 'AIMoveToBehavior' },
            { 'kind': 'block', 'type': 'AIParachuteBehavior' },
            { 'kind': 'block', 'type': 'AIWaypointIdleBehavior' },
            { 'kind': 'block', 'type': 'AIFollowPlayer' },
            { 'kind': 'block', 'type': 'AIHoldPosition' },
            { 'kind': 'block', 'type': 'AIAttackTarget' },
            { 'kind': 'block', 'type': 'SetAIBehavior' },
          ]
        },
        {
          'kind': 'category',
          'name': 'SPAWNING',
          'colour': '#333333',
          'contents': [
            { 'kind': 'block', 'type': 'DeployAI' },
            { 'kind': 'block', 'type': 'DespawnAI' },
            { 'kind': 'block', 'type': 'SetAISpawnLocation' },
          ]
        },
        {
          'kind': 'category',
          'name': 'STATE',
          'colour': '#333333',
          'contents': [
            { 'kind': 'block', 'type': 'SetAIHealth' },
            { 'kind': 'block', 'type': 'SetAITeam' },
            { 'kind': 'block', 'type': 'GetAIHealth' },
            { 'kind': 'block', 'type': 'GetAITeam' },
            { 'kind': 'block', 'type': 'AIIsAlive' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'EMPLACEMENTS',
      'colour': '#333333',
      'contents': [
        {
          'kind': 'category',
          'name': 'GENERAL',
          'colour': '#333333',
          'contents': [
            { 'kind': 'block', 'type': 'DeployEmplacement' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'EVENTS',
      'colour': '#333333',
      'contents': [
        {
          'kind': 'category',
          'name': 'Game Events',
          'colour': '#333333',
          'contents': [
            { 'kind': 'block', 'type': 'ON_START' },
            { 'kind': 'block', 'type': 'ON_PLAYER_JOIN' },
          ]
        },
        {
          'kind': 'category',
          'name': 'Event Payloads',
          'colour': '#333333',
          'contents': [
            { 'kind': 'block', 'type': 'EventAttacker' },
            { 'kind': 'block', 'type': 'EventDamage' },
            { 'kind': 'block', 'type': 'EventLocation' },
            { 'kind': 'block', 'type': 'EventPlayer' },
            { 'kind': 'block', 'type': 'EventTeam' },
            { 'kind': 'block', 'type': 'EventVictim' },
            { 'kind': 'block', 'type': 'EventWeapon' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'MOD',
      'colour': '#333333',
      'contents': [
        {
          'kind': 'category',
          'name': 'Game Mode',
          'colour': '#333333',
          'contents': [
            { 'kind': 'block', 'type': 'MOD_BLOCK' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'OBJECTIVE',
      'colour': '#333333',
      'contents': [
        {
          'kind': 'category',
          'name': 'GENERAL',
          'colour': '#333333',
          'contents': [
            { 'kind': 'block', 'type': 'SetObjectiveState' },
            { 'kind': 'block', 'type': 'GetObjectiveState' },
          ]
        },
      ]
    },
    {
      'kind': 'category',
      'name': 'OTHER',
      'colour': '#9E9E9E',
      'contents': [
        {
          'kind': 'category',
          'name': 'GENERAL',
          'colour': '#9E9E9E',
          'contents': [
            { 'kind': 'block', 'type': 'Comment' },
          ]
        },
      ]
    },
  ]
};
