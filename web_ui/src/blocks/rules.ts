import * as Blockly from 'blockly';

const rulesBlocks = [
  {
    type: 'bf6_rule',
    message0: 'RULE %1 Event %2 Scope %3 Global %4',
    args0: [
      {
        type: 'field_input',
        name: 'RULE_NAME',
        text: 'New Rule'
      },
      {
        type: 'field_dropdown',
        name: 'EVENT_TYPE',
        options: [
          ['Ongoing', 'Ongoing'],
          ['OnAIMoveToFailed', 'OnAIMoveToFailed'],
          ['OnAIMoveToRunning', 'OnAIMoveToRunning'],
          ['OnAIMoveToSucceeded', 'OnAIMoveToSucceeded'],
          ['OnAIParachuteRunning', 'OnAIParachuteRunning'],
          ['OnAIParachuteSucceeded', 'OnAIParachuteSucceeded'],
          ['OnAIWaypointIdleFailed', 'OnAIWaypointIdleFailed'],
          ['OnAIWaypointIdleRunning', 'OnAIWaypointIdleRunning'],
          ['OnAIWaypointIdleSucceeded', 'OnAIWaypointIdleSucceeded'],
          ['OnCapturePointCaptured', 'OnCapturePointCaptured'],
          ['OnCapturePointCapturing', 'OnCapturePointCapturing'],
          ['OnCapturePointLost', 'OnCapturePointLost'],
          ['OnGameModeEnding', 'OnGameModeEnding'],
          ['OnGameModeStarted', 'OnGameModeStarted'],
          ['OnMandown', 'OnMandown'],
          ['OnMCOMArmed', 'OnMCOMArmed'],
          ['OnMCOMDefused', 'OnMCOMDefused'],
          ['OnMCOMDestroyed', 'OnMCOMDestroyed'],
          ['OnPlayerDamaged', 'OnPlayerDamaged'],
          ['OnPlayerDeployed', 'OnPlayerDeployed'],
          ['OnPlayerDied', 'OnPlayerDied'],
          ['OnPlayerEarnedKill', 'OnPlayerEarnedKill'],
          ['OnPlayerEarnedKillAssist', 'OnPlayerEarnedKillAssist'],
          ['OnPlayerEnterAreaTrigger', 'OnPlayerEnterAreaTrigger'],
          ['OnPlayerEnterCapturePoint', 'OnPlayerEnterCapturePoint'],
          ['OnPlayerEnterVehicle', 'OnPlayerEnterVehicle'],
          ['OnPlayerEnterVehicleSeat', 'OnPlayerEnterVehicleSeat'],
          ['OnPlayerExitAreaTrigger', 'OnPlayerExitAreaTrigger'],
          ['OnPlayerExitCapturePoint', 'OnPlayerExitCapturePoint'],
          ['OnPlayerExitVehicle', 'OnPlayerExitVehicle'],
          ['OnPlayerExitVehicleSeat', 'OnPlayerExitVehicleSeat'],
          ['OnPlayerInteract', 'OnPlayerInteract'],
          ['OnPlayerJoinGame', 'OnPlayerJoinGame'],
          ['OnPlayerLeaveGame', 'OnPlayerLeaveGame'],
          ['OnPlayerSwitchTeam', 'OnPlayerSwitchTeam'],
          ['OnPlayerUIButtonEvent', 'OnPlayerUIButtonEvent'],
          ['OnPlayerUndeploy', 'OnPlayerUndeploy'],
          ['OnRayCastHit', 'OnRayCastHit'],
          ['OnRayCastMissed', 'OnRayCastMissed'],
          ['OnRevived', 'OnRevived'],
          ['OnRingOfFireZoneSizeChange', 'OnRingOfFireZoneSizeChange'],
          ['OnSpawnerSpawned', 'OnSpawnerSpawned'],
          ['OnTimeLimitReached', 'OnTimeLimitReached'],
          ['OnVehicleDestroyed', 'OnVehicleDestroyed'],
          ['OnVehicleSpawned', 'OnVehicleSpawned']
        ]
      },
      {
        type: 'field_dropdown',
        name: 'SCOPE',
        options: [
          ['Global', 'Global'],
          ['AreaTrigger', 'AreaTrigger'],
          ['CapturePoint', 'CapturePoint'],
          ['EmplacementSpawner', 'EmplacementSpawner'],
          ['HQ', 'HQ'],
          ['InteractPoint', 'InteractPoint'],
          ['LootSpawner', 'LootSpawner'],
          ['MCOM', 'MCOM'],
          ['Player', 'Player'],
          ['RingOfFire', 'RingOfFire'],
          ['ScreenEffect (deprecated)', 'ScreenEffect'],
          ['Sector', 'Sector'],
          ['SFX', 'SFX'],
          ['SpatialObject', 'SpatialObject'],
          ['Spawner', 'Spawner'],
          ['SpawnPoint', 'SpawnPoint'],
          ['Team', 'Team'],
          ['Vehicle', 'Vehicle'],
          ['VehicleSpawner', 'VehicleSpawner'],
          ['VFX', 'VFX'],
          ['VO', 'VO'],
          ['WaypointPath', 'WaypointPath'],
          ['WorldIcon', 'WorldIcon']
        ]
      },
      {
        type: 'field_checkbox',
        name: 'IS_GLOBAL',
        checked: true
      }
    ],
    message1: '%1',
    args1: [
      {
        type: 'input_statement',
        name: 'DO'
      }
    ],
    colour: '#7E3F96',
    tooltip: 'Define a BF6Portal rule with event and scope',
    helpUrl: ''
  }
];

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(rulesBlocks);
