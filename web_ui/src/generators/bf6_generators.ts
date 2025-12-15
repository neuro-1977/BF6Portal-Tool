/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import {Order} from 'blockly/javascript';

export const bf6Generators: any = {};


bf6Generators['MOD_BLOCK'] = function(block: any, generator: any) {
  const rules = generator.statementToCode(block, 'RULES');
  const code = `import * as mod from 'mod';

${rules}`;
  return code;
};

bf6Generators['RULE_HEADER'] = function(block: any, generator: any) {
  const rule_name = block.getFieldValue('RULE_NAME').replace(/ /g, '_'); // Sanitize name
  const event_type = block.getFieldValue('EVENT_TYPE'); // ONGOING, ON_AI_MOVE_TO_FAILED, etc.
  const scope_type = block.getFieldValue('SCOPE_TYPE'); // GLOBAL, AREA_TRIGGER, etc.

  const conditions_code = generator.valueToCode(block, 'CONDITIONS', Order.ATOMIC) || 'true';
  const actions_code = generator.statementToCode(block, 'ACTIONS');

  // Generate the Action function
  const action_function_name = `Ongoing${scope_type}_${rule_name}_Action`;
  const action_code = `function ${action_function_name}() {
${generator.prefixLines(actions_code, '  ')}
}`;

  // Generate the main Rule function
  const rule_function_name = `Ongoing${scope_type}_${rule_name}`;
  let condition_check = '';
  condition_check = `if (!(${conditions_code})) {
  return;
}`;
  

  const rule_code = `function ${rule_function_name}(conditionState: any) { // conditionState for internal tracking
${generator.prefixLines(condition_check, '  ')}
${generator.prefixLines(`${action_function_name}();`, '  ')}
}`;
  
  // This part will be handled by the MOD_BLOCK or a new main execution block
  // const main_call = `OngoingGlobal_New_Rule(modlib.getGlobalCondition(eventNum++));`;

  const code = `${action_code}\n${rule_code}\n`;
  return code;
};

bf6Generators['ABORT'] = function(block: any, generator: any) {
  const code = `mod.Abort();\n`;
  return code;
};

bf6Generators['AbortIf'] = function(block: any, generator: any) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'false';
  const code = `mod.AbortIf(${condition});\n`;
  return code;
};

bf6Generators['CONDITION_BLOCK'] = function(block: any, generator: any) {
  const input_condition = generator.valueToCode(block, 'INPUT_CONDITION', Order.NONE) || 'false';
  const code = input_condition;
  return [code, Order.NONE]; // Return as a value block
};

bf6Generators['ACTION_BLOCK'] = function(block: any, generator: any) {
  const code = `ACTION_BLOCK(...);\n`;
  return code;
};

bf6Generators['SUBROUTINE_BLOCK'] = function(block: any, generator: any) {
  const subroutine_name = block.getFieldValue('SUBROUTINE_NAME').replace(/ /g, '_'); // Sanitize name
  
  // Get parameters
  const params = (block as any).params || [];
  const paramNames = params.map((p: any) => p.name).join(', ');

  const conditions = generator.valueToCode(block, 'CONDITIONS', Order.NONE) || 'true';
  const actions = generator.statementToCode(block, 'ACTIONS');
  
  const code = `function ${subroutine_name}(${paramNames}) {
  if (${conditions}) {
${generator.prefixLines(actions, '    ')}
  }
}`;
  return code;
};

bf6Generators['SUBROUTINE_REFERENCE_BLOCK'] = function(block: any, generator: any) {
  const code = `SUBROUTINE_REFERENCE_BLOCK(...);\n`;
  return code;
};

bf6Generators['CALLSUBROUTINE'] = function(block: any, generator: any) {
  const name = block.getFieldValue('SUBROUTINE_NAME');
  const sanitizedName = name ? name.replace(/ /g, '_') : 'undefined_subroutine';
  const code = `${sanitizedName}();\n`;
  return code;
};

bf6Generators['BREAK_BLOCK'] = function(block: any, generator: any) {
  return 'break;\n';
};

bf6Generators['CONTINUE_BLOCK'] = function(block: any, generator: any) {
  return 'continue;\n';
};

bf6Generators['IF_BLOCK'] = function(block: any, generator: any) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'false';
  const branch = generator.statementToCode(block, 'DO');
  return `if (${condition}) {\n${branch}}\n`;
};

bf6Generators['WHILE_BLOCK'] = function(block: any, generator: any) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'false';
  const branch = generator.statementToCode(block, 'DO');
  return `while (${condition}) {\n${branch}}\n`;
};

bf6Generators['FOR_VARIABLE_BLOCK'] = function(block: any, generator: any) {
  const variable = block.getFieldValue('VAR_NAME');
  const from = generator.valueToCode(block, 'FROM', Order.NONE) || '0';
  const to = generator.valueToCode(block, 'TO', Order.NONE) || '0';
  const step = generator.valueToCode(block, 'STEP', Order.NONE) || '1';
  const branch = generator.statementToCode(block, 'DO');
  return `for (let ${variable} = ${from}; ${variable} <= ${to}; ${variable} += ${step}) {\n${branch}}\n`;
};

bf6Generators['AIBATTLEFIELDBEHAVIOUR'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const code = `mod.AIBattlefieldBehaviour(${player});\n`;
  return code;
};

bf6Generators['AIDEFENDPOSITIONBEHAVIOUR'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const code = `mod.AIDefendPositionBehaviour(${player});\n`;
  return code;
};

bf6Generators['AIIDLEBEHAVIOUR'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const code = `mod.AIIdleBehaviour(${player});\n`;
  return code;
};

bf6Generators['AILOSMOVETOBEHAVIOUR'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const code = `mod.AILOSMoveTOBehaviour(${player});\n`;
  return code;
};

bf6Generators['AIMOVETOBEHAVIOUR'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const code = `mod.AIMoveToBehaviour(${player});\n`;
  return code;
};

bf6Generators['AIPARACHUTEBEHAVIOUR'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const code = `mod.AIParachuteBehaviour(${player});\n`;
  return code;
};

bf6Generators['AIVALIDATEMOVETOBEHAVIOUR'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const position = generator.valueToCode(block, 'POSITION', Order.NONE) || 'null';
  const code = `mod.AIValidateMoveToBehaviour(${player}, ${position});\n`;
  return code;
};

bf6Generators['AIWAYPOINTIDLEBEHAVIOUR'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const waypoint_path = generator.valueToCode(block, 'WAYPOINT_PATH', Order.NONE) || 'null';
  const code = `mod.AIWaypointIdleBehaviour(${player}, ${waypoint_path});\n`;
  return code;
};

bf6Generators['SETPLAYERHEALTH'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const health = block.getFieldValue('HEALTH');
  const code = `SETPLAYERHEALTH(...);\n`;
  return code;
};

bf6Generators['SETPLAYERLOADOUT'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const loadout = generator.valueToCode(block, 'LOADOUT', Order.NONE) || 'null';
  const code = `mod.SetPlayerLoadout(${player}, ${loadout});\n`;
  return code;
};

bf6Generators['TELEPORT'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const location = generator.valueToCode(block, 'LOCATION', Order.NONE) || 'null';
  const code = `mod.Teleport(${player}, ${location});\n`;
  return code;
};

bf6Generators['ENDROUND'] = function(block: any, generator: any) {
  const winning_team = block.getFieldValue('WINNING_TEAM');
  const code = `ENDROUND(...);\n`;
  return code;
};

bf6Generators['PAUSEROUND'] = function(block: any, generator: any) {
  const code = `mod.PauseRound();\n`;
  return code;
};

bf6Generators['AIBATTLEFIELDBEHAVIOR'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const code = `mod.AIBattlefieldBehavior(${player});\n`;
  return code;
};

bf6Generators['AIDEFENDPOSITIONBEHAVIOR'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const defend_position = generator.valueToCode(block, 'DEFEND_POSITION', Order.NONE) || 'null';
  const min_distance = generator.valueToCode(block, 'MIN_DISTANCE', Order.NONE) || '0';
  const max_distance = generator.valueToCode(block, 'MAX_DISTANCE', Order.NONE) || '0';
  const code = `mod.AIDefendPositionBehavior(${player}, ${defend_position}, ${min_distance}, ${max_distance});\n`;
  return code;
};

bf6Generators['AIIDLEBEHAVIOR'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const code = `mod.AIIdleBehavior(${player});\n`;
  return code;
};

bf6Generators['AIMOVETOBEHAVIOR'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const position = generator.valueToCode(block, 'POSITION', Order.NONE) || 'null';
  const sprint = generator.valueToCode(block, 'SPRINT', Order.NONE) || 'false';
  const code = `mod.AIMoveToBehavior(${player}, ${position}, ${sprint});\n`;
  return code;
};

bf6Generators['AIPARACHUTEBEHAVIOR'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const code = `mod.AIParachuteBehavior(${player});\n`;
  return code;
};

bf6Generators['AIWAYPOINTIDLEBEHAVIOR'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const waypoint_path = generator.valueToCode(block, 'WAYPOINT_PATH', Order.NONE) || 'null';
  const code = `mod.AIWaypointIdleBehavior(${player}, ${waypoint_path});\n`;
  return code;
};

bf6Generators['AIFOLLOWPLAYER'] = function(block: any, generator: any) {
  const ai_player = generator.valueToCode(block, 'AI_PLAYER', Order.NONE) || 'null';
  const target_player = generator.valueToCode(block, 'TARGET_PLAYER', Order.NONE) || 'null';
  const distance = generator.valueToCode(block, 'DISTANCE', Order.NONE) || '0';
  const code = `mod.AIFollowPlayer(${ai_player}, ${target_player}, ${distance});\n`;
  return code;
};

bf6Generators['AIHOLDPOSITION'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const code = `mod.AIHoldPosition(${player});\n`;
  return code;
};

bf6Generators['AIATTACKTARGET'] = function(block: any, generator: any) {
  const ai_player = generator.valueToCode(block, 'AI_PLAYER', Order.NONE) || 'null';
  const target_player = generator.valueToCode(block, 'TARGET_PLAYER', Order.NONE) || 'null';
  const code = `mod.AIAttackTarget(${ai_player}, ${target_player});\n`;
  return code;
};

bf6Generators['SETAIBEHAVIOR'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const behavior_mode = generator.valueToCode(block, 'BEHAVIOR_MODE', Order.NONE) || 'null';
  const code = `mod.SetAIBehavior(${player}, ${behavior_mode});\n`;
  return code;
};

bf6Generators['DEPLOYAI'] = function(block: any, generator: any) {
  const team = generator.valueToCode(block, 'TEAM', Order.NONE) || 'null';
  const soldier_type = generator.valueToCode(block, 'SOLDIER_TYPE', Order.NONE) || 'null';
  const position = generator.valueToCode(block, 'POSITION', Order.NONE) || 'null';
  const kit = generator.valueToCode(block, 'KIT', Order.NONE) || 'null';
  const code = `mod.DeployAI(${team}, ${soldier_type}, ${position}, ${kit});\n`;
  return code;
};

bf6Generators['DESPAWNAI'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const code = `mod.DespawnAI(${player});\n`;
  return code;
};

bf6Generators['SETAISPAWNLOCATION'] = function(block: any, generator: any) {
  const team = generator.valueToCode(block, 'TEAM', Order.NONE) || 'null';
  const position = generator.valueToCode(block, 'POSITION', Order.NONE) || 'null';
  const code = `mod.SetAISpawnLocation(${team}, ${position});\n`;
  return code;
};

bf6Generators['SETAIHEALTH'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const amount = generator.valueToCode(block, 'AMOUNT', Order.NONE) || '0';
  const code = `mod.SetAIHealth(${player}, ${amount});\n`;
  return code;
};

bf6Generators['SETAITEAM'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const team_id = generator.valueToCode(block, 'TEAM_ID', Order.NONE) || 'null';
  const code = `mod.SetAITeam(${player}, ${team_id});\n`;
  return code;
};

bf6Generators['GETAIHEALTH'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const code = `mod.GetAIHealth(${player})`;
  return [code, Order.NONE];
};

bf6Generators['GETAITEAM'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const code = `mod.GetAITeam(${player})`;
  return [code, Order.NONE];
};

bf6Generators['AIISALIVE'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const code = `mod.AIIsAlive(${player})`;
  return [code, Order.NONE];
};

bf6Generators['CREATEARRAY'] = function(block: any, generator: any) {
  const code = `[]`;
  return [code, Order.ATOMIC];
};

bf6Generators['ARRAYLENGTH'] = function(block: any, generator: any) {
  const array = generator.valueToCode(block, 'ARRAY', Order.ATOMIC) || '[]';
  const code = `${array}.length`;
  return [code, Order.ATOMIC];
};

bf6Generators['GETELEMENT'] = function(block: any, generator: any) {
  const array = generator.valueToCode(block, 'ARRAY', Order.ATOMIC) || '[]';
  const index = generator.valueToCode(block, 'INDEX', Order.ATOMIC) || '0';
  const code = `${array}[${index}]`;
  return [code, Order.ATOMIC];
};

bf6Generators['SETELEMENT'] = function(block: any, generator: any) {
  const array = generator.valueToCode(block, 'ARRAY', Order.NONE) || 'null';
  const index = generator.valueToCode(block, 'INDEX', Order.NONE) || '0';
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || 'null';
  const code = `mod.SetElement(${array}, ${index}, ${value});\n`;
  return code;
};

bf6Generators['APPENDTOARRAY'] = function(block: any, generator: any) {
  const array = generator.valueToCode(block, 'ARRAY', Order.NONE) || '[]';
  const value = generator.valueToCode(block, 'VALUE', Order.NONE) || 'null';
  const code = `mod.AppendToArray(${array}, ${value})`;
  return [code, Order.ATOMIC]; // It returns an array, so it's a value block.
};

bf6Generators['REMOVEFROMARRAY'] = function(block: any, generator: any) {
    const array = generator.valueToCode(block, 'ARRAY', Order.NONE) || '[]';
    const index = generator.valueToCode(block, 'INDEX', Order.NONE) || '0';
    const code = `${array}.splice(${index}, 1);\n`;
    return code;
};

bf6Generators['FINDFIRST'] = function(block: any, generator: any) {
    const array = generator.valueToCode(block, 'ARRAY', Order.ATOMIC) || '[]';
    const value = generator.valueToCode(block, 'VALUE', Order.ATOMIC) || 'null';
    const code = `${array}.indexOf(${value})`;
    return [code, Order.ATOMIC];
};

bf6Generators['SORTARRAY'] = function(block: any, generator: any) {
    const array = generator.valueToCode(block, 'ARRAY', Order.NONE) || '[]';
    const order = block.getFieldValue('ORDER');
    const code = `mod.SortArray(${array}, '${order}');\n`;
    return code;
};

bf6Generators['LOADMUSIC'] = function(block: any, generator: any) {
  const music_id = generator.valueToCode(block, 'MUSIC_ID', Order.NONE) || 'null';
  const code = `mod.LoadMusic(${music_id});\n`;
  return code;
};

bf6Generators['PLAYMUSIC'] = function(block: any, generator: any) {
  const music_id = generator.valueToCode(block, 'MUSIC_ID', Order.NONE) || 'null';
  const players = generator.valueToCode(block, 'PLAYERS', Order.NONE) || 'null';
  const code = `mod.PlayMusic(${music_id}, ${players});\n`;
  return code;
};

bf6Generators['SETMUSICPARAM'] = function(block: any, generator: any) {
  const music_id = generator.valueToCode(block, 'MUSIC_ID', Order.NONE) || 'null';
  const param = generator.valueToCode(block, 'PARAM', Order.NONE) || 'null';
  const players = generator.valueToCode(block, 'PLAYERS', Order.NONE) || 'null';
  const code = `mod.SetMusicParam(${music_id}, ${param}, ${players});\n`;
  return code;
};

bf6Generators['UNLOADMUSIC'] = function(block: any, generator: any) {
  const music_id = generator.valueToCode(block, 'MUSIC_ID', Order.NONE) || 'null';
  const code = `mod.UnloadMusic(${music_id});\n`;
  return code;
};

bf6Generators['PLAYSOUND'] = function(block: any, generator: any) {
  const sound_id = generator.valueToCode(block, 'SOUND_ID', Order.NONE) || 'null';
  const position = generator.valueToCode(block, 'POSITION', Order.NONE) || 'null';
  const players = generator.valueToCode(block, 'PLAYERS', Order.NONE) || 'null';
  const volume = generator.valueToCode(block, 'VOLUME', Order.NONE) || '1.0';
  const pitch = generator.valueToCode(block, 'PITCH', Order.NONE) || '1.0';
  const code = `mod.PlaySound(${sound_id}, ${position}, ${players}, ${volume}, ${pitch});\n`;
  return code;
};

bf6Generators['PLAYVO'] = function(block: any, generator: any) {
  const vo_id = generator.valueToCode(block, 'VO_ID', Order.NONE) || 'null';
  const speaker = generator.valueToCode(block, 'SPEAKER', Order.NONE) || 'null';
  const listener = generator.valueToCode(block, 'LISTENER', Order.NONE) || 'null';
  const players = generator.valueToCode(block, 'PLAYERS', Order.NONE) || 'null';
  const code = `mod.PlayVO(${vo_id}, ${speaker}, ${listener}, ${players});\n`;
  return code;
};

bf6Generators['STOPSOUND'] = function(block: any, generator: any) {
  const sound_id = generator.valueToCode(block, 'SOUND_ID', Order.NONE) || 'null';
  const players = generator.valueToCode(block, 'PLAYERS', Order.NONE) || 'null';
  const code = `mod.StopSound(${sound_id}, ${players});\n`;
  return code;
};

bf6Generators['SETPLAYERCAMERA'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const camera_mode = block.getFieldValue('CAMERA_MODE');
  const code = `SETPLAYERCAMERA(...);\n`;
  return code;
};

bf6Generators['LOCKCAMERATOTARGET'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const target = block.getFieldValue('TARGET');
  const code = `LOCKCAMERATOTARGET(...);\n`;
  return code;
};

bf6Generators['CAMERASHAKE'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const intensity = block.getFieldValue('INTENSITY');
  const duration = block.getFieldValue('DURATION');
  const code = `CAMERASHAKE(...);\n`;
  return code;
};

bf6Generators['SETCAMERAFOV'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const fov = block.getFieldValue('FOV');
  const code = `SETCAMERAFOV(...);\n`;
  return code;
};

bf6Generators['RESETCAMERA'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const code = `RESETCAMERA(...);\n`;
  return code;
};

bf6Generators['FIRSTPERSONCAMERA'] = function(block: any, generator: any) {
  const code = `FIRSTPERSONCAMERA(...)`;
  return [code, Order.NONE];
};

bf6Generators['THIRDPERSONCAMERA'] = function(block: any, generator: any) {
  const code = `THIRDPERSONCAMERA(...)`;
  return [code, Order.NONE];
};

bf6Generators['FREECAMERA'] = function(block: any, generator: any) {
  const code = `FREECAMERA(...)`;
  return [code, Order.NONE];
};

bf6Generators['SPECTATORCAMERA'] = function(block: any, generator: any) {
  const code = `SPECTATORCAMERA(...)`;
  return [code, Order.NONE];
};

bf6Generators['EQUAL'] = function(block: any, generator: any) {
  const a = generator.valueToCode(block, 'A', Order.ATOMIC) || 'null';
  const b = generator.valueToCode(block, 'B', Order.ATOMIC) || 'null';
  const code = `(${a} === ${b})`; // Use strict equality for comparison
  return [code, Order.ATOMIC];
};

bf6Generators['NOTEQUAL'] = function(block: any, generator: any) {
  const a = generator.valueToCode(block, 'A', Order.ATOMIC) || 'null';
  const b = generator.valueToCode(block, 'B', Order.ATOMIC) || 'null';
  const code = `(${a} !== ${b})`; // Use strict inequality for comparison
  return [code, Order.ATOMIC];
};

bf6Generators['LESSTHAN'] = function(block: any, generator: any) {
  const a = generator.valueToCode(block, 'A', Order.ATOMIC) || '0';
  const b = generator.valueToCode(block, 'B', Order.ATOMIC) || '0';
  const code = `(${a} < ${b})`;
  return [code, Order.ATOMIC];
};

bf6Generators['LESSTHANOREQUAL'] = function(block: any, generator: any) {
  const value_a = generator.valueToCode(block, 'VALUE_A', Order.ATOMIC) || '0';
  const value_b = generator.valueToCode(block, 'VALUE_B', Order.ATOMIC) || '0';
  const code = `(${value_a} <= ${value_b})`;
  return [code, Order.ATOMIC];
};

bf6Generators['GREATERTHAN'] = function(block: any, generator: any) {
  const a = generator.valueToCode(block, 'A', Order.ATOMIC) || '0';
  const b = generator.valueToCode(block, 'B', Order.ATOMIC) || '0';
  const code = `(${a} > ${b})`;
  return [code, Order.ATOMIC];
};

bf6Generators['GREATERTHANOREQUAL'] = function(block: any, generator: any) {
  const value_a = generator.valueToCode(block, 'VALUE_A', Order.ATOMIC) || '0';
  const value_b = generator.valueToCode(block, 'VALUE_B', Order.ATOMIC) || '0';
  const code = `(${value_a} >= ${value_b})`;
  return [code, Order.ATOMIC];
};

bf6Generators['PLAYEFFECT'] = function(block: any, generator: any) {
  const effect_type = block.getFieldValue('EFFECT_TYPE');
  const location = block.getFieldValue('LOCATION');
  const scale = block.getFieldValue('SCALE');
  const code = `PLAYEFFECT(...);\n`;
  return code;
};

bf6Generators['STOPEFFECT'] = function(block: any, generator: any) {
  const effect_id = block.getFieldValue('EFFECT_ID');
  const code = `STOPEFFECT(...);\n`;
  return code;
};

bf6Generators['PARTICLEEFFECT'] = function(block: any, generator: any) {
  const particle_type = block.getFieldValue('PARTICLE_TYPE');
  const code = `PARTICLEEFFECT(...);\n`;
  return code;
};

bf6Generators['EXPLOSIONEFFECT'] = function(block: any, generator: any) {
  const explosion_type = block.getFieldValue('EXPLOSION_TYPE');
  const code = `EXPLOSIONEFFECT(...);\n`;
  return code;
};

bf6Generators['SCREENFLASH'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const color = block.getFieldValue('COLOR');
  const duration = block.getFieldValue('DURATION');
  const code = `SCREENFLASH(...);\n`;
  return code;
};

bf6Generators['SCREENFADE'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const fade_type = block.getFieldValue('FADE_TYPE');
  const duration = block.getFieldValue('DURATION');
  const code = `SCREENFADE(...);\n`;
  return code;
};

bf6Generators['APPLYSCREENFILTER'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const filter_type = block.getFieldValue('FILTER_TYPE');
  const code = `APPLYSCREENFILTER(...);\n`;
  return code;
};

bf6Generators['DEPLOYEMPLACEMENT'] = function(block: any, generator: any) {
  const emplacement_id = block.getFieldValue('EMPLACEMENT_ID');
  const position = block.getFieldValue('POSITION');
  const rotation = block.getFieldValue('ROTATION');
  const code = `DEPLOYEMPLACEMENT(...);\n`;
  return code;
};

bf6Generators['ON_START'] = function(block: any, generator: any) {
  const code = `ON_START(...);\n`;
  return code;
};

bf6Generators['ON_PLAYER_JOIN'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const code = `ON_PLAYER_JOIN(...);\n`;
  return code;
};

bf6Generators['EVENTATTACKER'] = function(block: any, generator: any) {
  const code = `EVENTATTACKER(...)`;
  return [code, Order.NONE];
};

bf6Generators['EVENTDAMAGE'] = function(block: any, generator: any) {
  const code = `EVENTDAMAGE(...)`;
  return [code, Order.NONE];
};

bf6Generators['EVENTLOCATION'] = function(block: any, generator: any) {
  const code = `EVENTLOCATION(...)`;
  return [code, Order.NONE];
};

bf6Generators['EVENTPLAYER'] = function(block: any, generator: any) {
  const code = `EVENTPLAYER(...)`;
  return [code, Order.NONE];
};

bf6Generators['EVENTTEAM'] = function(block: any, generator: any) {
  const code = `EVENTTEAM(...)`;
  return [code, Order.NONE];
};

bf6Generators['EVENTVICTIM'] = function(block: any, generator: any) {
  const code = `EVENTVICTIM(...)`;
  return [code, Order.NONE];
};

bf6Generators['EVENTWEAPON'] = function(block: any, generator: any) {
  const code = `EVENTWEAPON(...)`;
  return [code, Order.NONE];
};

bf6Generators['GETGAMEMODE'] = function(block: any, generator: any) {
  const code = `GETGAMEMODE(...)`;
  return [code, Order.NONE];
};

bf6Generators['SETGAMEMODE'] = function(block: any, generator: any) {
  const gamemode = block.getFieldValue('GAMEMODE');
  const code = `SETGAMEMODE(...);\n`;
  return code;
};

bf6Generators['ENABLEFRIENDLYFIRE'] = function(block: any, generator: any) {
  const enabled = block.getFieldValue('ENABLED');
  const code = `ENABLEFRIENDLYFIRE(...);\n`;
  return code;
};

bf6Generators['SETSCORE'] = function(block: any, generator: any) {
  const team = block.getFieldValue('TEAM');
  const score = block.getFieldValue('SCORE');
  const code = `SETSCORE(...);\n`;
  return code;
};

bf6Generators['GETSCORE'] = function(block: any, generator: any) {
  const team = block.getFieldValue('TEAM');
  const code = `GETSCORE(...)`;
  return [code, Order.NONE];
};

bf6Generators['SETTIMELIMIT'] = function(block: any, generator: any) {
  const time_limit = block.getFieldValue('TIME_LIMIT');
  const code = `SETTIMELIMIT(...);\n`;
  return code;
};

bf6Generators['GETTIMELIMIT'] = function(block: any, generator: any) {
  const code = `GETTIMELIMIT(...)`;
  return [code, Order.NONE];
};

bf6Generators['WAIT'] = function(block: any, generator: any) {
  const seconds = generator.valueToCode(block, 'SECONDS', Order.NONE) || '0';
  const code = `mod.Wait(${seconds});\n`;
  return code;
};

bf6Generators['WAITUNTIL'] = function(block: any, generator: any) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'false';
  const timeout = generator.valueToCode(block, 'TIMEOUT', Order.NONE) || '0';
  const code = `mod.WaitUntil(${condition}, ${timeout});\n`;
  return code;
};

bf6Generators['BREAK'] = function(block: any, generator: any) {
  const code = `break;\n`;
  return code;
};

bf6Generators['CONTINUE'] = function(block: any, generator: any) {
  const code = `continue;\n`;
  return code;
};

bf6Generators['IF'] = function(block: any, generator: any) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'false';
  const statements = generator.statementToCode(block, 'DO'); // Now 'DO' exists
  const code = `if (${condition}) {\n${generator.prefixLines(statements, '  ')}}
`;
  return code;
};

bf6Generators['WHILE'] = function(block: any, generator: any) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'false';
  const statements = generator.statementToCode(block, 'DO'); // Now 'DO' exists
  const code = `while (${condition}) {\n${generator.prefixLines(statements, '  ')}}
`;
  return code;
};

bf6Generators['AND'] = function(block: any, generator: any) {
  const a = generator.valueToCode(block, 'A', Order.NONE) || 'false';
  const b = generator.valueToCode(block, 'B', Order.NONE) || 'false';
  const code = `mod.And(${a}, ${b})`;
  return [code, Order.ATOMIC];
};

bf6Generators['ANGLEBETWEENVECTORS'] = function(block: any, generator: any) {
  const vector1 = generator.valueToCode(block, 'VECTOR1', Order.NONE) || 'mod.CreateVector(0,0,0)';
  const vector2 = generator.valueToCode(block, 'VECTOR2', Order.NONE) || 'mod.CreateVector(0,0,0)';
  const code = `mod.AngleBetweenVectors(${vector1}, ${vector2})`;
  return [code, Order.ATOMIC];
};

bf6Generators['ANGLEDIFFERENCE'] = function(block: any, generator: any) {
  const angle1 = generator.valueToCode(block, 'ANGLE1', Order.NONE) || '0';
  const angle2 = generator.valueToCode(block, 'ANGLE2', Order.NONE) || '0';
  const code = `mod.AngleDifference(${angle1}, ${angle2})`;
  return [code, Order.ATOMIC];
};

bf6Generators['APPLYMEDGADGET'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const medGadget = generator.valueToCode(block, 'MEDGADGET', Order.NONE) || 'null';
  const code = `mod.ApplyMedGadget(${player}, ${medGadget});\n`;
  return code;
};

bf6Generators['ARCCOSINEINDEGREES'] = function(block: any, generator: any) {
  const number = generator.valueToCode(block, 'NUMBER', Order.NONE) || '0';
  const code = `mod.ArccosineInDegrees(${number})`;
  return [code, Order.ATOMIC];
};

bf6Generators['ARCCOSINEINRADIANS'] = function(block: any, generator: any) {
  const number = generator.valueToCode(block, 'NUMBER', Order.NONE) || '0';
  const code = `mod.ArccosineInRadians(${number})`;
  return [code, Order.ATOMIC];
};

bf6Generators['ARCSINEINDEGREES'] = function(block: any, generator: any) {
  const number = generator.valueToCode(block, 'NUMBER', Order.NONE) || '0';
  const code = `mod.ArcsineInDegrees(${number})`;
  return [code, Order.ATOMIC];
};

bf6Generators['ARCSINEINRADIANS'] = function(block: any, generator: any) {
  const number = generator.valueToCode(block, 'NUMBER', Order.NONE) || '0';
  const code = `mod.ArcsineInRadians(${number})`;
  return [code, Order.ATOMIC];
};

bf6Generators['ARCTANGENTINDEGREES'] = function(block: any, generator: any) {
  const number = generator.valueToCode(block, 'NUMBER', Order.NONE) || '0';
  const code = `mod.ArctangentInDegrees(${number})`;
  return [code, Order.ATOMIC];
};

bf6Generators['ARCTANGENTINRADIANS'] = function(block: any, generator: any) {
  const number = generator.valueToCode(block, 'NUMBER', Order.NONE) || '0';
  const code = `mod.ArctangentInRadians(${number})`;
  return [code, Order.ATOMIC];
};

bf6Generators['ARRAYCONTAINS'] = function(block: any, generator: any) {
  const array = generator.valueToCode(block, 'ARRAY', Order.NONE) || '[]';
  const item = generator.valueToCode(block, 'ITEM', Order.NONE) || 'null';
  const code = `mod.ArrayContains(${array}, ${item})`;
  return [code, Order.ATOMIC];
};

bf6Generators['ARRAYSLICE'] = function(block: any, generator: any) {
  const array = generator.valueToCode(block, 'ARRAY', Order.NONE) || '[]';
  const startIndex = generator.valueToCode(block, 'START_INDEX', Order.NONE) || '0';
  const count = generator.valueToCode(block, 'COUNT', Order.NONE) || '0';
  const code = `mod.ArraySlice(${array}, ${startIndex}, ${count})`;
  return [code, Order.ATOMIC];
};

bf6Generators['BACKWARDVECTOR'] = function(block: any, generator: any) {
  const code = `mod.BackwardVector()`;
  return [code, Order.ATOMIC];
};

bf6Generators['CAPTUREPOINTCAPTURINGTIME'] = function(block: any, generator: any) {
  const capturePoint = generator.valueToCode(block, 'CAPTURE_POINT', Order.NONE) || 'null';
  const time = generator.valueToCode(block, 'TIME', Order.NONE) || '0';
  const code = `mod.CapturePointCapturingTime(${capturePoint}, ${time});\n`;
  return code;
};

bf6Generators['CAPTUREPOINTNEUTRALIZATIONTIME'] = function(block: any, generator: any) {
  const capturePoint = generator.valueToCode(block, 'CAPTURE_POINT', Order.NONE) || 'null';
  const time = generator.valueToCode(block, 'TIME', Order.NONE) || '0';
  const code = `mod.CapturePointNeutralizationTime(${capturePoint}, ${time});\n`;
  return code;
};

bf6Generators['OR'] = function(block: any, generator: any) {
  const a = generator.valueToCode(block, 'A', Order.ATOMIC) || 'false';
  const b = generator.valueToCode(block, 'B', Order.ATOMIC) || 'false';
  const code = `(${a} || ${b})`;
  return [code, Order.ATOMIC];
};

bf6Generators['NOT'] = function(block: any, generator: any) {
  const a = generator.valueToCode(block, 'A', Order.ATOMIC) || 'false';
  const code = `!(${a})`;
  return [code, Order.ATOMIC];
};

bf6Generators['TRUE'] = function(block: any, generator: any) {
  const code = `true`;
  return [code, Order.ATOMIC];
};

bf6Generators['FALSE'] = function(block: any, generator: any) {
  const code = `false`;
  return [code, Order.ATOMIC];
};

bf6Generators['GREATERTHANEQUAL'] = function(block: any, generator: any) {
  const value_a = generator.valueToCode(block, 'VALUE_A', Order.ATOMIC) || '0';
  const value_b = generator.valueToCode(block, 'VALUE_B', Order.ATOMIC) || '0';
  const code = `(${value_a} >= ${value_b})`;
  return [code, Order.ATOMIC];
};

bf6Generators['LESSTHANEQUAL'] = function(block: any, generator: any) {
  const a = block.getFieldValue('A');
  const b = block.getFieldValue('B');
  const code = `LESSTHANEQUAL(...);\n`;
  return code;
};

bf6Generators['FORVARIABLE'] = function(block: any, generator: any) {
  const loopVar = generator.nameDB_.getName(block.getFieldValue('VAR'), Blockly.VARIABLE_CATEGORY_NAME); // Use Blockly's nameDB for variable names
  const from_value = generator.valueToCode(block, 'FROM_VALUE', Order.NONE) || '0';
  const to_value = generator.valueToCode(block, 'TO_VALUE', Order.NONE) || '0';
  const by_value = generator.valueToCode(block, 'BY_VALUE', Order.NONE) || '1';
  const statements = generator.statementToCode(block, 'DO');

  const code = `for (let ${loopVar} = ${from_value}; ${loopVar} <= ${to_value}; ${loopVar} += ${by_value}) {\n${generator.prefixLines(statements, '  ')}}
`;
  return code;
};

bf6Generators['ADD'] = function(block: any, generator: any) {
  const value_a = generator.valueToCode(block, 'VALUE_A', Order.NONE) || '0'; // Use Order.NONE as it's a function argument
  const value_b = generator.valueToCode(block, 'VALUE_B', Order.NONE) || '0'; // Use Order.NONE
  const code = `mod.Add(${value_a}, ${value_b})`;
  return [code, Order.ATOMIC];
};

bf6Generators['SUBTRACT'] = function(block: any, generator: any) {
  const value_a = generator.valueToCode(block, 'VALUE_A', Order.ATOMIC) || '0';
  const value_b = generator.valueToCode(block, 'VALUE_B', Order.ATOMIC) || '0';
  const code = `(${value_a} - ${value_b})`;
  return [code, Order.ATOMIC];
};

bf6Generators['MULTIPLY'] = function(block: any, generator: any) {
  const value_a = generator.valueToCode(block, 'VALUE_A', Order.ATOMIC) || '0';
  const value_b = generator.valueToCode(block, 'VALUE_B', Order.ATOMIC) || '0';
  const code = `(${value_a} * ${value_b})`;
  return [code, Order.ATOMIC];
};

bf6Generators['DIVIDE'] = function(block: any, generator: any) {
  const value_a = generator.valueToCode(block, 'VALUE_A', Order.ATOMIC) || '0';
  const value_b = generator.valueToCode(block, 'VALUE_B', Order.ATOMIC) || '1'; // Avoid division by zero
  const code = `(${value_a} / ${value_b})`;
  return [code, Order.ATOMIC];
};

bf6Generators['POWER'] = function(block: any, generator: any) {
  const base = generator.valueToCode(block, 'BASE', Order.ATOMIC) || '0';
  const exponent = generator.valueToCode(block, 'EXPONENT', Order.ATOMIC) || '0';
  const code = `Math.pow(${base}, ${exponent})`;
  return [code, Order.ATOMIC];
};

bf6Generators['SQUAREROOT'] = function(block: any, generator: any) {
  const value = generator.valueToCode(block, 'VALUE', Order.ATOMIC) || '0';
  const code = `Math.sqrt(${value})`;
  return [code, Order.ATOMIC];
};

bf6Generators['ABSOLUTE'] = function(block: any, generator: any) {
  const value = generator.valueToCode(block, 'VALUE', Order.ATOMIC) || '0';
  const code = `Math.abs(${value})`;
  return [code, Order.ATOMIC];
};

bf6Generators['MODULO'] = function(block: any, generator: any) {
  const dividend = generator.valueToCode(block, 'DIVIDEND', Order.ATOMIC) || '0';
  const divisor = generator.valueToCode(block, 'DIVISOR', Order.ATOMIC) || '1'; // Avoid division by zero
  const code = `(${dividend} % ${divisor})`;
  return [code, Order.ATOMIC];
};

bf6Generators['SETOBJECTIVESTATE'] = function(block: any, generator: any) {
  const objective = block.getFieldValue('OBJECTIVE');
  const state = block.getFieldValue('STATE');
  const code = `SETOBJECTIVESTATE(...);\n`;
  return code;
};

bf6Generators['GETOBJECTIVESTATE'] = function(block: any, generator: any) {
  const objective = block.getFieldValue('OBJECTIVE');
  const code = `GETOBJECTIVESTATE(...)`;
  return [code, Order.NONE];
};

bf6Generators['COMMENT'] = function(block: any, generator: any) {
  const text = block.getFieldValue('TEXT');
  const code = `// ${text}\n`;
  return code;
};

bf6Generators['GETPLAYERBYID'] = function(block: any, generator: any) {
  const player_id = block.getFieldValue('PLAYER_ID');
  const code = `GETPLAYERBYID(...)`;
  return [code, Order.NONE];
};

bf6Generators['GETPLAYERNAME'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const code = `GETPLAYERNAME(...)`;
  return [code, Order.NONE];
};

bf6Generators['GETPLAYERHEALTH'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const code = `GETPLAYERHEALTH(...)`;
  return [code, Order.NONE];
};

bf6Generators['TELEPORTPLAYER'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const position = block.getFieldValue('POSITION');
  const code = `TELEPORTPLAYER(...);\n`;
  return code;
};

bf6Generators['KILLPLAYER'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const code = `KILLPLAYER(...);\n`;
  return code;
};

bf6Generators['GETPLAYERTEAM'] = function(block: any, generator: any) {
  const player = generator.valueToCode(block, 'PLAYER', Order.NONE) || 'null';
  const code = `mod.GetPlayerTeam(${player})`;
  return [code, Order.NONE]; // Output is a Team type
};

bf6Generators['SETPLAYERTEAM'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const team = block.getFieldValue('TEAM');
  const code = `SETPLAYERTEAM(...);\n`;
  return code;
};

bf6Generators['CALLSUBROUTINE'] = function(block: any, generator: any) {
  const code = `CALLSUBROUTINE(...);\n`;
  return code;
};

bf6Generators['RETURN'] = function(block: any, generator: any) {
  const code = `RETURN(...);\n`;
  return code;
};

bf6Generators['VECTOR'] = function(block: any, generator: any) {
  const x = generator.valueToCode(block, 'X', Order.NONE) || '0';
  const y = generator.valueToCode(block, 'Y', Order.NONE) || '0';
  const z = generator.valueToCode(block, 'Z', Order.NONE) || '0';
  const code = `mod.CreateVector(${x}, ${y}, ${z})`;
  return [code, Order.ATOMIC];
};

bf6Generators['VECTORTOWARDS'] = function(block: any, generator: any) {
  const start_pos = generator.valueToCode(block, 'START_POS', Order.NONE) || 'null';
  const end_pos = generator.valueToCode(block, 'END_POS', Order.NONE) || 'null';
  const code = `mod.VectorTowards(${start_pos}, ${end_pos})`;
  return [code, Order.ATOMIC];
};

bf6Generators['DISTANCEBETWEEN'] = function(block: any, generator: any) {
  const position_a = generator.valueToCode(block, 'POSITION_A', Order.NONE) || 'null';
  const position_b = generator.valueToCode(block, 'POSITION_B', Order.NONE) || 'null';
  const code = `mod.DistanceBetween(${position_a}, ${position_b})`;
  return [code, Order.ATOMIC];
};

bf6Generators['XCOMPONENTOF'] = function(block: any, generator: any) {
  const vector = generator.valueToCode(block, 'VECTOR', Order.NONE) || 'null';
  const code = `mod.XComponentOf(${vector})`;
  return [code, Order.ATOMIC];
};

bf6Generators['YCOMPONENTOF'] = function(block: any, generator: any) {
  const vector = generator.valueToCode(block, 'VECTOR', Order.NONE) || 'null';
  const code = `mod.YComponentOf(${vector})`;
  return [code, Order.ATOMIC];
};

bf6Generators['ZCOMPONENTOF'] = function(block: any, generator: any) {
  const vector = generator.valueToCode(block, 'VECTOR', Order.NONE) || 'null';
  const code = `mod.ZComponentOf(${vector})`;
  return [code, Order.ATOMIC];
};

bf6Generators['NORMALIZE'] = function(block: any, generator: any) {
  const vector = generator.valueToCode(block, 'VECTOR', Order.NONE) || 'null';
  const code = `mod.Normalize(${vector})`;
  return [code, Order.ATOMIC];
};

bf6Generators['DOTPRODUCT'] = function(block: any, generator: any) {
  const vector_a = generator.valueToCode(block, 'VECTOR_A', Order.NONE) || 'null';
  const vector_b = generator.valueToCode(block, 'VECTOR_B', Order.NONE) || 'null';
  const code = `mod.DotProduct(${vector_a}, ${vector_b})`;
  return [code, Order.ATOMIC];
};

bf6Generators['CROSSPRODUCT'] = function(block: any, generator: any) {
  const vector_a = generator.valueToCode(block, 'VECTOR_A', Order.NONE) || 'null';
  const vector_b = generator.valueToCode(block, 'VECTOR_B', Order.NONE) || 'null';
  const code = `mod.CrossProduct(${vector_a}, ${vector_b})`;
  return [code, Order.ATOMIC];
};

bf6Generators['VECTORMAGNITUDE'] = function(block: any, generator: any) {
  const vector = generator.valueToCode(block, 'VECTOR', Order.NONE) || 'null';
  const code = `mod.VectorMagnitude(${vector})`;
  return [code, Order.ATOMIC];
};

bf6Generators['UP'] = function(block: any, generator: any) {
  const code = `mod.UpVector()`;
  return [code, Order.ATOMIC];
};

bf6Generators['DOWN'] = function(block: any, generator: any) {
  const code = `mod.DownVector()`;
  return [code, Order.ATOMIC];
};

bf6Generators['LEFT'] = function(block: any, generator: any) {
  const code = `mod.LeftVector()`;
  return [code, Order.ATOMIC];
};

bf6Generators['RIGHT'] = function(block: any, generator: any) {
  const code = `mod.RightVector()`;
  return [code, Order.ATOMIC];
};

bf6Generators['FORWARD'] = function(block: any, generator: any) {
  const code = `mod.ForwardVector()`;
  return [code, Order.ATOMIC];
};

bf6Generators['BACKWARD'] = function(block: any, generator: any) {
  const code = `BACKWARD(...)`;
  return [code, Order.NONE];
};

bf6Generators['SHOWMESSAGE'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const message = block.getFieldValue('MESSAGE');
  const duration = block.getFieldValue('DURATION');
  const code = `SHOWMESSAGE(...);\n`;
  return code;
};

bf6Generators['SHOWBIGMESSAGE'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const title = block.getFieldValue('TITLE');
  const subtitle = block.getFieldValue('SUBTITLE');
  const duration = block.getFieldValue('DURATION');
  const code = `SHOWBIGMESSAGE(...);\n`;
  return code;
};

bf6Generators['SHOWNOTIFICATION'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const text = block.getFieldValue('TEXT');
  const icon = block.getFieldValue('ICON');
  const code = `SHOWNOTIFICATION(...);\n`;
  return code;
};

bf6Generators['SETHUDVISIBLE'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const hud_element = block.getFieldValue('HUD_ELEMENT');
  const visible = block.getFieldValue('VISIBLE');
  const code = `SETHUDVISIBLE(...);\n`;
  return code;
};

bf6Generators['UPDATEHUDTEXT'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const hud_id = block.getFieldValue('HUD_ID');
  const text = block.getFieldValue('TEXT');
  const code = `UPDATEHUDTEXT(...);\n`;
  return code;
};

bf6Generators['CREATECUSTOMHUD'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const hud_config = block.getFieldValue('HUD_CONFIG');
  const code = `CREATECUSTOMHUD(...);\n`;
  return code;
};

bf6Generators['CREATEWORLDMARKER'] = function(block: any, generator: any) {
  const location = block.getFieldValue('LOCATION');
  const icon = block.getFieldValue('ICON');
  const text = block.getFieldValue('TEXT');
  const code = `CREATEWORLDMARKER(...);\n`;
  return code;
};

bf6Generators['REMOVEWORLDMARKER'] = function(block: any, generator: any) {
  const marker_id = block.getFieldValue('MARKER_ID');
  const code = `REMOVEWORLDMARKER(...);\n`;
  return code;
};

bf6Generators['SETOBJECTIVEMARKER'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const location = block.getFieldValue('LOCATION');
  const text = block.getFieldValue('TEXT');
  const code = `SETOBJECTIVEMARKER(...);\n`;
  return code;
};

bf6Generators['UPDATESCOREBOARD'] = function(block: any, generator: any) {
  const entries = block.getFieldValue('ENTRIES');
  const code = `UPDATESCOREBOARD(...);\n`;
  return code;
};

bf6Generators['SHOWSCOREBOARD'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const visible = block.getFieldValue('VISIBLE');
  const code = `SHOWSCOREBOARD(...);\n`;
  return code;
};

bf6Generators['NUMBER'] = function(block: any, generator: any) {
  const num = block.getFieldValue('NUM');
  const code = parseFloat(num);
  return [code, Order.ATOMIC];
};

bf6Generators['STRING'] = function(block: any, generator: any) {
  const text = block.getFieldValue('TEXT');
  const code = generator.quote_(text); // Quote the string for code generation
  return [code, Order.ATOMIC];
};

bf6Generators['BOOLEAN'] = function(block: any, generator: any) {
  const value = block.getFieldValue('BOOL');
  const code = (value === 'TRUE') ? 'true' : 'false';
  return [code, Order.ATOMIC];
};

bf6Generators['SETVARIABLE'] = function(block: any, generator: any) {
  const variable_name = generator.nameDB_.getName(block.getFieldValue('VARIABLE'), Blockly.VARIABLE_CATEGORY_NAME);
  const value = generator.valueToCode(block, 'VALUE', Order.ASSIGNMENT) || 'null';
  const code = `${variable_name} = ${value};\n`;
  return code;
};

bf6Generators['GETVARIABLE'] = function(block: any, generator: any) {
  const variable_name = generator.nameDB_.getName(block.getFieldValue('VARIABLE_NAME'), Blockly.VARIABLE_CATEGORY_NAME);
  const code = variable_name;
  return [code, Order.ATOMIC];
};

bf6Generators['SPAWNVEHICLE'] = function(block: any, generator: any) {
  const vehicle_type = block.getFieldValue('VEHICLE_TYPE');
  const location = block.getFieldValue('LOCATION');
  const team = block.getFieldValue('TEAM');
  const code = `SPAWNVEHICLE(...);\n`;
  return code;
};

bf6Generators['DESPAWNVEHICLE'] = function(block: any, generator: any) {
  const vehicle = block.getFieldValue('VEHICLE');
  const code = `DESPAWNVEHICLE(...);\n`;
  return code;
};

bf6Generators['GETVEHICLEHEALTH'] = function(block: any, generator: any) {
  const vehicle = block.getFieldValue('VEHICLE');
  const code = `GETVEHICLEHEALTH(...);\n`;
  return code;
};

bf6Generators['SETVEHICLEHEALTH'] = function(block: any, generator: any) {
  const vehicle = block.getFieldValue('VEHICLE');
  const health = block.getFieldValue('HEALTH');
  const code = `SETVEHICLEHEALTH(...);\n`;
  return code;
};

bf6Generators['GETVEHICLEDRIVER'] = function(block: any, generator: any) {
  const vehicle = block.getFieldValue('VEHICLE');
  const code = `GETVEHICLEDRIVER(...)`;
  return [code, Order.NONE];
};

bf6Generators['EJECTFROMVEHICLE'] = function(block: any, generator: any) {
  const player = block.getFieldValue('PLAYER');
  const vehicle = block.getFieldValue('VEHICLE');
  const code = `EJECTFROMVEHICLE(...);\n`;
  return code;
};

bf6Generators['LOCKVEHICLE'] = function(block: any, generator: any) {
  const vehicle = block.getFieldValue('VEHICLE');
  const team = block.getFieldValue('TEAM');
  const code = `LOCKVEHICLE(...);\n`;
  return code;
};

bf6Generators['SETVEHICLESPEED'] = function(block: any, generator: any) {
  const vehicle = block.getFieldValue('VEHICLE');
  const speed = block.getFieldValue('SPEED');
  const code = `SETVEHICLESPEED(...);\n`;
  return code;
};

bf6Generators['DISABLEVEHICLE'] = function(block: any, generator: any) {
  const vehicle = block.getFieldValue('VEHICLE');
  const code = `DISABLEVEHICLE(...);\n`;
  return code;
};

bf6Generators['ENABLEVEHICLE'] = function(block: any, generator: any) {
  const vehicle = block.getFieldValue('VEHICLE');
  const code = `ENABLEVEHICLE(...);\n`;
  return code;
};

bf6Generators['SET_SCOREBOARD_COLUMN_WIDTHS'] = function(block: any, generator: any) {
  const widths = generator.valueToCode(block, 'WIDTHS', Order.ATOMIC);
  const code = `SET_SCOREBOARD_COLUMN_WIDTHS(...);\n`;
  return code;
};

bf6Generators['VEHICLE_LIST_ITEM'] = function(block: any, generator: any) {
  const vehicle_list_selector = block.getFieldValue('VEHICLE_LIST_SELECTOR');
  const vehicle_type = block.getFieldValue('VEHICLE_TYPE');
  const code = `VEHICLE_LIST_ITEM(...)`;
  return [code, Order.NONE];
};

bf6Generators['ARCTANGENTINRADIANS'] = function(block: any, generator: any) {
  const number = generator.valueToCode(block, 'NUMBER', Order.NONE) || '0';
  const code = `mod.ArctangentInRadians(${number})`;
  return [code, Order.ATOMIC];
};

bf6Generators['ARRAYSLICE'] = function(block: any, generator: any) {
  const array = generator.valueToCode(block, 'ARRAY', Order.NONE) || '[]';
  const startIndex = generator.valueToCode(block, 'START_INDEX', Order.NONE) || '0';
  const count = generator.valueToCode(block, 'COUNT', Order.NONE) || '0';
  const code = `mod.ArraySlice(${array}, ${startIndex}, ${count})`;
  return [code, Order.ATOMIC];
};

bf6Generators['BACKWARDVECTOR'] = function(block: any, generator: any) {
  const code = `mod.BackwardVector()`;
  return [code, Order.ATOMIC];
};

bf6Generators['BOOL'] = function(block: any, generator: any) {
    const value = block.getFieldValue('VALUE');
    return [value, Order.ATOMIC];
};

bf6Generators['CAPTUREPOINTS'] = function(block: any, generator: any) {
  const code = 'mod.CapturePoints()';
  return [code, Order.ATOMIC];
};
bf6Generators['CEILING'] = function(block: any, generator: any) {
    const number = generator.valueToCode(block, 'NUMBER', Order.NONE) || '0';
    const code = `Math.ceil(${number})`;
    return [code, Order.ATOMIC];
};

bf6Generators['CLEARALLCUSTOMMESSAGES'] = function(block: any, generator: any) {
  const recipient = generator.valueToCode(block, 'RECIPIENT', Order.NONE) || 'null';
  const code = `mod.ClearAllCustomMessages(${recipient});\n`;
  return code;
};

bf6Generators['CLEARCUSTOMMESSAGE'] = function(block: any, generator: any) {
  const recipient = generator.valueToCode(block, 'RECIPIENT', Order.NONE) || 'null';
  const messageSlot = generator.valueToCode(block, 'MESSAGE_SLOT', Order.NONE) || 'null';
  const code = `mod.ClearCustomMessage(${recipient}, ${messageSlot});\n`;
  return code;
};

bf6Generators['GETWAYPOINTPATH'] = function(block: any, generator: any) {
  const pathName = block.getFieldValue('PATH_NAME');
  const code = `mod.GetWaypointPath("${pathName}")`;
  return [code, Order.ATOMIC];
};

bf6Generators['CHASEVARIABLEATRATE'] = function(block: any, generator: any) {
  const variable = generator.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Names.NameType.VARIABLE);
  const rate = generator.valueToCode(block, 'RATE', Order.NONE) || '0';
  const dest = generator.valueToCode(block, 'DEST', Order.NONE) || '0';
  return `mod.ChaseVariableAtRate(${variable}, ${rate}, ${dest});\n`;
};

bf6Generators['CHASEVARIABLEOVERTIME'] = function(block: any, generator: any) {
  const variable = generator.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Names.NameType.VARIABLE);
  const time = generator.valueToCode(block, 'TIME', Order.NONE) || '0';
  const dest = generator.valueToCode(block, 'DEST', Order.NONE) || '0';
  return `mod.ChaseVariableOverTime(${variable}, ${time}, ${dest});\n`;
};

bf6Generators['SKIP'] = function(block: any, generator: any) {
  return `mod.Skip();\n`;
};

bf6Generators['SKIPIF'] = function(block: any, generator: any) {
  const condition = generator.valueToCode(block, 'CONDITION', Order.NONE) || 'false';
  return `mod.SkipIf(${condition});\n`;
};

bf6Generators['STOPCHASINGVARIABLE'] = function(block: any, generator: any) {
  const variable = generator.nameDB_.getName(block.getFieldValue('VAR'), Blockly.Names.NameType.VARIABLE);
  return `mod.StopChasingVariable(${variable});\n`;
};

bf6Generators['CLOSESTPLAYERTO'] = function(block: any, generator: any) {
  const position = generator.valueToCode(block, 'POSITION', Order.NONE) || 'null';
  const code = `mod.ClosestPlayerTo(${position})`;
  return [code, Order.ATOMIC];
};

bf6Generators['COMPARECAPTUREPOINT'] = function(block: any, generator: any) {
  const capturePointA = generator.valueToCode(block, 'CAPTURE_POINT_A', Order.NONE) || 'null';
  const capturePointB = generator.valueToCode(block, 'CAPTURE_POINT_B', Order.NONE) || 'null';
  const code = `mod.CompareCapturePoint(${capturePointA}, ${capturePointB})`;
  return [code, Order.ATOMIC];
};

bf6Generators['COMPAREVEHICLENAME'] = function(block: any, generator: any) {
  const vehicle = generator.valueToCode(block, 'VEHICLE', Order.NONE) || 'null';
  const name = generator.valueToCode(block, 'NAME', Order.NONE) || '""';
  const code = `mod.CompareVehicleName(${vehicle}, ${name})`;
  return [code, Order.ATOMIC];
};

bf6Generators['COUNTOF'] = function(block: any, generator: any) {
  const array = generator.valueToCode(block, 'ARRAY', Order.NONE) || '[]';
  const code = `mod.CountOf(${array})`;
  return [code, Order.ATOMIC];
};

bf6Generators['COSINEFROMDEGREES'] = function(block: any, generator: any) {
  const angle = generator.valueToCode(block, 'ANGLE', Order.NONE) || '0';
  const code = `mod.CosineFromDegrees(${angle})`;
  return [code, Order.ATOMIC];
};

bf6Generators['COSINEFROMRADIANS'] = function(block: any, generator: any) {
  const angle = generator.valueToCode(block, 'ANGLE', Order.NONE) || '0';
  const code = `mod.CosineFromRadians(${angle})`;
  return [code, Order.ATOMIC];
};

bf6Generators['CONDITION_BLOCK'] = function(block: any, generator: any) {
  // TODO: Implement generator
  return '';
};
