/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export const toolbox = {
  'kind': 'categoryToolbox',
  'contents': [
    // --- YELLOW MENUS (Action/Statement Blocks) ---
    {
      'kind': 'category',
      'name': 'RULES',
      'colour': '#A285E6', // Purple, as requested
      'contents': [
        { 'kind': 'block', 'type': 'MOD_BLOCK' },
        { 'kind': 'block', 'type': 'RULE_HEADER' },
        { 'kind': 'block', 'type': 'CONDITION_BLOCK' },
        { 'kind': 'block', 'type': 'ACTION_BLOCK' },
        { 'kind': 'block', 'type': 'COMMENT' }
      ]
    },
    {
      'kind': 'category',
      'name': 'AI',
      'colour': '#FFEB3B', // Yellow
      'contents': [
        { 'kind': 'block', 'type': 'AIBATTLEFIELDBEHAVIOUR' },
        { 'kind': 'block', 'type': 'AIDEFENDPOSITIONBEHAVIOUR' },
        { 'kind': 'block', 'type': 'AIIDLEBEHAVIOUR' },
        { 'kind': 'block', 'type': 'AILOSMOVETOBEHAVIOUR' },
        { 'kind': 'block', 'type': 'AIMOVETOBEHAVIOUR' },
        { 'kind': 'block', 'type': 'AIPARACHUTEBEHAVIOUR' },
        { 'kind': 'block', 'type': 'AIVALIDATEMOVETOBEHAVIOUR' },
        { 'kind': 'block', 'type': 'AIWAYPOINTIDLEBEHAVIOUR' },
        // Statement AI Blocks
        { 'kind': 'block', 'type': 'SETAIBEHAVIOR' },
        { 'kind': 'block', 'type': 'DEPLOYAI' },
        { 'kind': 'block', 'type': 'DESPAWNAI' },
        { 'kind': 'block', 'type': 'SETAISPAWNLOCATION' },
        { 'kind': 'block', 'type': 'SETAIHEALTH' },
        { 'kind': 'block', 'type': 'SETAITEAM' },
        { 'kind': 'block', 'type': 'AIBATTLEFIELDBEHAVIOR' },
        { 'kind': 'block', 'type': 'AIDEFENDPOSITIONBEHAVIOR' },
        { 'kind': 'block', 'type': 'AIIDLEBEHAVIOR' },
        { 'kind': 'block', 'type': 'AIMOVETOBEHAVIOR' },
        { 'kind': 'block', 'type': 'AIPARACHUTEBEHAVIOR' },
        { 'kind': 'block', 'type': 'AIWAYPOINTIDLEBEHAVIOR' },
        { 'kind': 'block', 'type': 'AIFOLLOWPLAYER' },
        { 'kind': 'block', 'type': 'AIHOLDPOSITION' },
        { 'kind': 'block', 'type': 'AIATTACKTARGET' }
      ]
    },
    {
      'kind': 'category',
      'name': 'ARRAYS',
      'colour': '#FFEB3B', // Yellow
      'contents': [
        // Statement Array Blocks
        { 'kind': 'block', 'type': 'CREATEARRAY' },
        { 'kind': 'block', 'type': 'SETELEMENT' },
        { 'kind': 'block', 'type': 'APPENDTOARRAY' },
        { 'kind': 'block', 'type': 'REMOVEFROMARRAY' },
        { 'kind': 'block', 'type': 'SORTARRAY' }
      ]
    },
    {
      'kind': 'category',
      'name': 'AUDIO',
      'colour': '#FFEB3B', // Yellow
      'contents': [
        { 'kind': 'block', 'type': 'enable_vo_messaging' },
        { 'kind': 'block', 'type': 'trigger_audio' },
        { 'kind': 'block', 'type': 'trigger_audio_at_location' },
        // Statement Audio Blocks
        { 'kind': 'block', 'type': 'LOADMUSIC' },
        { 'kind': 'block', 'type': 'PLAYMUSIC' },
        { 'kind': 'block', 'type': 'SETMUSICPARAM' },
        { 'kind': 'block', 'type': 'UNLOADMUSIC' },
        { 'kind': 'block', 'type': 'PLAYSOUND' },
        { 'kind': 'block', 'type': 'PLAYVO' },
        { 'kind': 'block', 'type': 'STOPSOUND' }
      ]
    },
    {
      'kind': 'category',
      'name': 'CAMERA',
      'colour': '#FFEB3B', // Yellow
      'contents': [
        // Statement Camera Blocks
        { 'kind': 'block', 'type': 'SETPLAYERCAMERA' },
        { 'kind': 'block', 'type': 'LOCKCAMERATOTARGET' },
        { 'kind': 'block', 'type': 'CAMERASHAKE' },
        { 'kind': 'block', 'type': 'SETCAMERAFOV' },
        { 'kind': 'block', 'type': 'RESETCAMERA' }
      ]
    },
    {
      'kind': 'category',
      'name': 'LOGIC',
      'colour': '#FFEB3B', // Yellow
      'contents': [
        { 'kind': 'block', 'type': 'TELEPORT' },
        { 'kind': 'block', 'type': 'RETURN' },
        { 'kind': 'block', 'type': 'SHOWNOTIFICATION' },
        { 'kind': 'block', 'type': 'CREATEWORLDMARKER' },
        { 'kind': 'block', 'type': 'REMOVEWORLDMARKER' },
        { 'kind': 'block', 'type': 'abort' },
        { 'kind': 'block', 'type': 'abort_if' },
        { 'kind': 'block', 'type': 'break' },
        { 'kind': 'block', 'type': 'continue' },
        { 'kind': 'block', 'type': 'display_highlighted_world_log_message' },
        { 'kind': 'block', 'type': 'display_notification_message' },
        { 'kind': 'block', 'type': 'else_if' },
        { 'kind': 'block', 'type': 'enable_default_game_mode_scoring' },
        { 'kind': 'block', 'type': 'enable_world_icon_image' },
        { 'kind': 'block', 'type': 'enable_world_icon_text' },
        { 'kind': 'block', 'type': 'force_all_exit_vehicle' },
        { 'kind': 'block', 'type': 'force_mandown' },
        { 'kind': 'block', 'type': 'force_player_exit_vehicle' },
        { 'kind': 'block', 'type': 'force_player_to_seat' },
        { 'kind': 'block', 'type': 'force_revive' },
        { 'kind': 'block', 'type': 'force_switch_inventory' },
        { 'kind': 'block', 'type': 'if' },
        { 'kind': 'block', 'type': 'remove_player_inventory' },
        { 'kind': 'block', 'type': 'remove_player_inventory_at_slot' },
        { 'kind': 'block', 'type': 'replace_player_inventory' },
        { 'kind': 'block', 'type': 'send_error_report' },
        { 'kind': 'block', 'type': 'set_inventory_ammo' },
        { 'kind': 'block', 'type': 'set_inventory_magazine_ammo' },
        { 'kind': 'block', 'type': 'set_world_icon_image' },
        { 'kind': 'block', 'type': 'set_world_icon_owner' },
        { 'kind': 'block', 'type': 'set_world_icon_position' },
        { 'kind': 'block', 'type': 'set_world_icon_text' },
        { 'kind': 'block', 'type': 'skip' },
        { 'kind': 'block', 'type': 'skip_if' },
        { 'kind': 'block', 'type': 'skip_mandown' },
        { 'kind': 'block', 'type': 'spot_target_for_player' },
        { 'kind': 'block', 'type': 'teleport' },
        { 'kind': 'block', 'type': 'wait' },
        { 'kind': 'block', 'type': 'wait_until' },
        { 'kind': 'block', 'type': 'while' },
        // Statement Logic Blocks
        { 'kind': 'block', 'type': 'IF' },
        { 'kind': 'block', 'type': 'WHILE' },
        { 'kind': 'block', 'type': 'FORVARIABLE' },
        { 'kind': 'block', 'type': 'WAIT' },
        { 'kind': 'block', 'type': 'WAITUNTIL' },
        { 'kind': 'block', 'type': 'ABORT' },
        { 'kind': 'block', 'type': 'AbortIf' },
        { 'kind': 'block', 'type': 'BREAK' },
        { 'kind': 'block', 'type': 'CONTINUE' },
        { 'kind': 'block', 'type': 'CHASEVARIABLEATRATE' },
        { 'kind': 'block', 'type': 'CHASEVARIABLEOVERTIME' },
        { 'kind': 'block', 'type': 'SKIP' },
        { 'kind': 'block', 'type': 'SKIPIF' },
        { 'kind': 'block', 'type': 'STOPCHASINGVARIABLE' }
      ]
    },
    {
      'kind': 'category',
      'name': 'MATH',
      'colour': '#FFEB3B', // Yellow
      'contents': [
        { 'kind': 'block', 'type': 'display_game_mode_message' },
        { 'kind': 'block', 'type': 'enable_default_game_mode_win_condition' },
        { 'kind': 'block', 'type': 'enable_game_mode_objective' },
        { 'kind': 'block', 'type': 'end_game_mode' },
        { 'kind': 'block', 'type': 'is_player_using_soldier' },
        { 'kind': 'block', 'type': 'mod' },
        { 'kind': 'block', 'type': 'subroutine_instance_block' },
        // Placeholder, as most Math blocks are Value blocks
      ]
    },
    {
      'kind': 'category',
      'name': 'PLAYER',
      'colour': '#FFEB3B', // Yellow
      'contents': [
        { 'kind': 'block', 'type': 'deploy_all_players' },
        { 'kind': 'block', 'type': 'deploy_player' },
        { 'kind': 'block', 'type': 'enable_all_player_deploy' },
        { 'kind': 'block', 'type': 'enable_player_deploy' },
        { 'kind': 'block', 'type': 'set_player_max_health' },
        { 'kind': 'block', 'type': 'set_player_soldier' },
        { 'kind': 'block', 'type': 'set_team_id' },
        { 'kind': 'block', 'type': 'undeploy_all_players' },
        { 'kind': 'block', 'type': 'undeploy_player' },
        // Statement Player Blocks
        { 'kind': 'block', 'type': 'APPLYMEDGADGET' },
        { 'kind': 'block', 'type': 'TELEPORTPLAYER' },
        { 'kind': 'block', 'type': 'KILLPLAYER' },
        { 'kind': 'block', 'type': 'SETPLAYERTEAM' },
        { 'kind': 'block', 'type': 'SETPLAYERHEALTH' },
        { 'kind': 'block', 'type': 'SETPLAYERLOADOUT' }
      ]
    },
    {
      'kind': 'category',
      'name': 'GAME MODE',
      'colour': '#FFEB3B', // Yellow
      'contents': [
        { 'kind': 'block', 'type': 'UPDATESCOREBOARD' },
        { 'kind': 'block', 'type': 'SHOWSCOREBOARD' },
        { 'kind': 'block', 'type': 'SET_SCOREBOARD_COLUMN_WIDTHS' },
        { 'kind': 'block', 'type': 'capture_point_capturing_time' },
        { 'kind': 'block', 'type': 'capture_point_neutralization_time' },
        { 'kind': 'block', 'type': 'pause_game_mode_time' },
        { 'kind': 'block', 'type': 'reset_game_mode_time' },
        { 'kind': 'block', 'type': 'set_game_mode_score' },
        { 'kind': 'block', 'type': 'set_game_mode_target_score' },
        { 'kind': 'block', 'type': 'set_game_mode_time_limit' },
        { 'kind': 'block', 'type': 'set_mcom_fuse_time' },
        { 'kind': 'block', 'type': 'set_neutralization_time_multiplier' },
        { 'kind': 'block', 'type': 'set_redeploy_time' },
        { 'kind': 'block', 'type': 'track_variable_over_time' },
        // Statement Game Mode Blocks
        { 'kind': 'block', 'type': 'ON_START' },
        { 'kind': 'block', 'type': 'ON_PLAYER_JOIN' },
        { 'kind': 'block', 'type': 'ENDROUND' },
        { 'kind': 'block', 'type': 'PAUSEROUND' },
        { 'kind': 'block', 'type': 'SETGAMEMODE' },
        { 'kind': 'block', 'type': 'ENABLEFRIENDLYFIRE' },
        { 'kind': 'block', 'type': 'SETSCORE' },
        { 'kind': 'block', 'type': 'SETTIMELIMIT' }
      ]
    },
    {
      'kind': 'category',
      'name': 'EFFECTS',
      'colour': '#FFEB3B', // Yellow
      'contents': [
        // Statement Effects Blocks
        { 'kind': 'block', 'type': 'PLAYEFFECT' },
        { 'kind': 'block', 'type': 'STOPEFFECT' },
        { 'kind': 'block', 'type': 'PARTICLEEFFECT' },
        { 'kind': 'block', 'type': 'EXPLOSIONEFFECT' },
        { 'kind': 'block', 'type': 'SCREENFLASH' },
        { 'kind': 'block', 'type': 'SCREENFADE' },
        { 'kind': 'block', 'type': 'APPLYSCREENFILTER' }
      ]
    },
    {
      'kind': 'category',
      'name': 'USER INTERFACE',
      'colour': '#FFEB3B', // Yellow
      'contents': [
        { 'kind': 'block', 'type': 'SHOWMESSAGE' },
        { 'kind': 'block', 'type': 'SHOWBIGMESSAGE' },
        { 'kind': 'block', 'type': 'SETHUDVISIBLE' },
        { 'kind': 'block', 'type': 'UPDATEHUDTEXT' },
        { 'kind': 'block', 'type': 'CREATECUSTOMHUD' },
        { 'kind': 'block', 'type': 'clear_all_custom_messages' },
        { 'kind': 'block', 'type': 'clear_custom_message' },
        { 'kind': 'block', 'type': 'display_custom_message' },
        // Statement UI Blocks
        { 'kind': 'block', 'type': 'CLEARALLCUSTOMMESSAGES' },
        { 'kind': 'block', 'type': 'CLEARCUSTOMMESSAGE' }
      ]
    },
    {
      'kind': 'category',
      'name': 'VEHICLES',
      'colour': '#FFEB3B', // Yellow
      'contents': [
        { 'kind': 'block', 'type': 'GETVEHICLEHEALTH' },
        { 'kind': 'block', 'type': 'damage_vehicle' },
        { 'kind': 'block', 'type': 'destroy_vehicle' },
        { 'kind': 'block', 'type': 'repair_vehicle' },
        { 'kind': 'block', 'type': 'set_vehicle_max_health_multiplier' },
        // Statement Vehicle Blocks
        { 'kind': 'block', 'type': 'SPAWNVEHICLE' },
        { 'kind': 'block', 'type': 'DESPAWNVEHICLE' },
        { 'kind': 'block', 'type': 'ENABLEVEHICLE' },
        { 'kind': 'block', 'type': 'DISABLEVEHICLE' },
        { 'kind': 'block', 'type': 'LOCKVEHICLE' },
        { 'kind': 'block', 'type': 'EJECTFROMVEHICLE' },
        { 'kind': 'block', 'type': 'SETVEHICLEHEALTH' },
        { 'kind': 'block', 'type': 'SETVEHICLESPEED' }
      ]
    },
    {
      'kind': 'category',
      'name': 'OBJECTIVES (STATEMENT)',
      'colour': '#FFEB3B', // Yellow
      'contents': [
        { 'kind': 'block', 'type': 'SETOBJECTIVESTATE' },
        { 'kind': 'block', 'type': 'SETOBJECTIVEMARKER' },
        { 'kind': 'block', 'type': 'enable_capture_point_deploying' },
        { 'kind': 'block', 'type': 'set_capture_multiplier' },
        { 'kind': 'block', 'type': 'set_objective_owner' },
        { 'kind': 'block', 'type': 'CAPTUREPOINTCAPTURINGTIME' },
        { 'kind': 'block', 'type': 'CAPTUREPOINTNEUTRALIZATIONTIME' },
      ]
    },

    // --- GREEN MENUS (Value/Expression Blocks) ---
    {
      'kind': 'category',
      'name': 'AI',
      'colour': '#4CAF50', // Green
      'contents': [
        // Value AI Blocks
        { 'kind': 'block', 'type': 'GETAIHEALTH' },
        { 'kind': 'block', 'type': 'GETAITEAM' },
        { 'kind': 'block', 'type': 'AIISALIVE' },
        { 'kind': 'block', 'type': 'GETWAYPOINTPATH' }
      ]
    },
    {
      'kind': 'category',
      'name': 'ARRAYS',
      'colour': '#4CAF50', // Green
      'contents': [
        { 'kind': 'block', 'type': 'append_to_array' },
        { 'kind': 'block', 'type': 'array_contains' },
        { 'kind': 'block', 'type': 'array_slice' },
        { 'kind': 'block', 'type': 'current_array_element' },
        { 'kind': 'block', 'type': 'empty_array' },
        { 'kind': 'block', 'type': 'filtered_array' },
        { 'kind': 'block', 'type': 'index_of_array_value' },
        { 'kind': 'block', 'type': 'mapped_array' },
        { 'kind': 'block', 'type': 'randomized_array' },
        { 'kind': 'block', 'type': 'random_value_in_array' },
        { 'kind': 'block', 'type': 'remove_from_array' },
        { 'kind': 'block', 'type': 'sorted_array' },
        { 'kind': 'block', 'type': 'value_in_array' },
        // Value Array Blocks
        { 'kind': 'block', 'type': 'ARRAYLENGTH' },
        { 'kind': 'block', 'type': 'ARRAYCONTAINS' },
        { 'kind': 'block', 'type': 'ARRAYSLICE' },
        { 'kind': 'block', 'type': 'COUNTOF' },
        { 'kind': 'block', 'type': 'FINDFIRST' },
      ]
    },
    {
      'kind': 'category',
      'name': 'AUDIO',
      'colour': '#4CAF50', // Green
      'contents': [
        { 'kind': 'block', 'type': 'locational_sounds' },
        { 'kind': 'block', 'type': 'sounds' },
        { 'kind': 'block', 'type': 'voice_overs' },] // No Value blocks identified directly
    },
    {
      'kind': 'category',
      'name': 'EFFECTS',
      'colour': '#4CAF50', // Green
      'contents': [] // No Value blocks identified directly
    },
    {
      'kind': 'category',
      'name': 'EVENT PAYLOADS',
      'colour': '#4CAF50', // Green
      'contents': [
        { 'kind': 'block', 'type': 'event_capture_point' },
        { 'kind': 'block', 'type': 'event_damage_type' },
        { 'kind': 'block', 'type': 'event_death_type' },
        { 'kind': 'block', 'type': 'event_mcom' },
        { 'kind': 'block', 'type': 'event_other_player' },
        { 'kind': 'block', 'type': 'event_player' },
        { 'kind': 'block', 'type': 'event_seat' },
        { 'kind': 'block', 'type': 'event_team' },
        { 'kind': 'block', 'type': 'event_vehicle' },
        { 'kind': 'block', 'type': 'event_weapon' },
        // Value Event Payload Blocks
        { 'kind': 'block', 'type': 'EVENTATTACKER' },
        { 'kind': 'block', 'type': 'EVENTDAMAGE' },
        { 'kind': 'block', 'type': 'EVENTLOCATION' },
        { 'kind': 'block', 'type': 'EVENTPLAYER' },
        { 'kind': 'block', 'type': 'EVENTTEAM' },
        { 'kind': 'block', 'type': 'EVENTVICTIM' },
        { 'kind': 'block', 'type': 'EVENTWEAPON' }
      ]
    },
    {
      'kind': 'category',
      'name': 'GAMEPLAY',
      'colour': '#4CAF50', // Green
      'contents': [
        { 'kind': 'block', 'type': 'get_game_mode_score' },
        { 'kind': 'block', 'type': 'get_game_mode_target_score' },
        { 'kind': 'block', 'type': 'get_game_mode_time_elapsed' },
        { 'kind': 'block', 'type': 'get_game_mode_time_limit' },
        { 'kind': 'block', 'type': 'get_game_mode_time_remaining' },
        { 'kind': 'block', 'type': 'get_remaining_fuse_time' },
        // Value Gameplay Blocks
        { 'kind': 'block', 'type': 'GETGAMEMODE' },
        { 'kind': 'block', 'type': 'GETSCORE' },
        { 'kind': 'block', 'type': 'GETTIMELIMIT' }
      ]
    },
    {
      'kind': 'category',
      'name': 'LOGIC',
      'colour': '#4CAF50', // Green
      'contents': [
        { 'kind': 'block', 'type': 'GREATERTHANOREQUAL' },
        { 'kind': 'block', 'type': 'LESSTHANEQUAL' },
        { 'kind': 'block', 'type': 'and' },
        { 'kind': 'block', 'type': 'angle_between_vectors' },
        { 'kind': 'block', 'type': 'angle_difference' },
        { 'kind': 'block', 'type': 'backward_vector' },
        { 'kind': 'block', 'type': 'create_vector' },
        { 'kind': 'block', 'type': 'down_vector' },
        { 'kind': 'block', 'type': 'equals' },
        { 'kind': 'block', 'type': 'floor' },
        { 'kind': 'block', 'type': 'forward_vector' },
        { 'kind': 'block', 'type': 'get_inventory_ammo' },
        { 'kind': 'block', 'type': 'get_inventory_magazine_ammo' },
        { 'kind': 'block', 'type': 'greater_than' },
        { 'kind': 'block', 'type': 'greater_than_equal_to' },
        { 'kind': 'block', 'type': 'has_inventory' },
        { 'kind': 'block', 'type': 'if_then_else' },
        { 'kind': 'block', 'type': 'inventory_character_specialties' },
        { 'kind': 'block', 'type': 'inventory_class_gadgets' },
        { 'kind': 'block', 'type': 'inventory_melee_weapons' },
        { 'kind': 'block', 'type': 'inventory_open_gadgets' },
        { 'kind': 'block', 'type': 'inventory_primary_weapons' },
        { 'kind': 'block', 'type': 'inventory_secondary_weapons' },
        { 'kind': 'block', 'type': 'inventory_throwables' },
        { 'kind': 'block', 'type': 'is_inventory_slot_active' },
        { 'kind': 'block', 'type': 'is_true_for_all' },
        { 'kind': 'block', 'type': 'is_true_for_any' },
        { 'kind': 'block', 'type': 'left_vector' },
        { 'kind': 'block', 'type': 'less_than' },
        { 'kind': 'block', 'type': 'less_than_equal_to' },
        { 'kind': 'block', 'type': 'local_to_world_position' },
        { 'kind': 'block', 'type': 'local_to_world_vector' },
        { 'kind': 'block', 'type': 'normalize' },
        { 'kind': 'block', 'type': 'not' },
        { 'kind': 'block', 'type': 'not_equal_to' },
        { 'kind': 'block', 'type': 'or' },
        { 'kind': 'block', 'type': 'player_inventory_slots' },
        { 'kind': 'block', 'type': 'player_state_vector' },
        { 'kind': 'block', 'type': 'random_real' },
        { 'kind': 'block', 'type': 'right_vector' },
        { 'kind': 'block', 'type': 'up_vector' },
        { 'kind': 'block', 'type': 'vector_towards' },
        { 'kind': 'block', 'type': 'vehicle_state_vector' },
        { 'kind': 'block', 'type': 'world_icon_images' },
        { 'kind': 'block', 'type': 'world_icons' },
        { 'kind': 'block', 'type': 'world_to_local_position' },
        { 'kind': 'block', 'type': 'world_to_local_vector' },
        { 'kind': 'block', 'type': 'xor' },
        // Value Logic Blocks
        { 'kind': 'block', 'type': 'EQUAL' },
        { 'kind': 'block', 'type': 'NOTEQUAL' },
        { 'kind': 'block', 'type': 'LESSTHAN' },
        { 'kind': 'block', 'type': 'GREATERTHAN' },
        { 'kind': 'block', 'type': 'LESSTHANOREQUAL' },
        { 'kind': 'block', 'type': 'GREATERTHANEQUAL' },
        { 'kind': 'block', 'type': 'AND' },
        { 'kind': 'block', 'type': 'OR' },
        { 'kind': 'block', 'type': 'NOT' },
        { 'kind': 'block', 'type': 'TRUE' },
        { 'kind': 'block', 'type': 'FALSE' }
      ]
    },
    {
      'kind': 'category',
      'name': 'MATH',
      'colour': '#4CAF50', // Green
      'contents': [
        { 'kind': 'block', 'type': 'absolute_value' },
        { 'kind': 'block', 'type': 'add' },
        { 'kind': 'block', 'type': 'arccosine_in_degrees' },
        { 'kind': 'block', 'type': 'arccosine_in_radians' },
        { 'kind': 'block', 'type': 'arcsine_in_degrees' },
        { 'kind': 'block', 'type': 'arcsine_in_radians' },
        { 'kind': 'block', 'type': 'arctangent_in_degrees' },
        { 'kind': 'block', 'type': 'arctangent_in_radians' },
        { 'kind': 'block', 'type': 'ceiling' },
        { 'kind': 'block', 'type': 'cosine_from_degrees' },
        { 'kind': 'block', 'type': 'cosine_from_radians' },
        { 'kind': 'block', 'type': 'distance_between' },
        { 'kind': 'block', 'type': 'divide' },
        { 'kind': 'block', 'type': 'modulo' },
        { 'kind': 'block', 'type': 'multiply' },
        { 'kind': 'block', 'type': 'raise_to_power' },
        { 'kind': 'block', 'type': 'round_to_integer' },
        { 'kind': 'block', 'type': 'sine_from_degrees' },
        { 'kind': 'block', 'type': 'sine_from_radians' },
        { 'kind': 'block', 'type': 'subtract' },
        { 'kind': 'block', 'type': 'tangent_from_degrees' },
        { 'kind': 'block', 'type': 'tangent_from_radians' },
        // Value Math Blocks
        { 'kind': 'block', 'type': 'ABSOLUTE' },
        { 'kind': 'block', 'type': 'ADD' },
        { 'kind': 'block', 'type': 'ANGLEBETWEENVECTORS' },
        { 'kind': 'block', 'type': 'ANGLEDIFFERENCE' },
        { 'kind': 'block', 'type': 'ARCCOSINEINDEGREES' },
        { 'kind': 'block', 'type': 'ARCCOSINEINRADIANS' },
        { 'kind': 'block', 'type': 'ARCSINEINDEGREES' },
        { 'kind': 'block', 'type': 'ARCSINEINRADIANS' },
        { 'kind': 'block', 'type': 'ARCTANGENTINDEGREES' },
        { 'kind': 'block', 'type': 'ARCTANGENTINRADIANS' },
        { 'kind': 'block', 'type': 'BACKWARDVECTOR' },
        { 'kind': 'block', 'type': 'CEILING' },
        { 'kind': 'block', 'type': 'COSINEFROMDEGREES' },
        { 'kind': 'block', 'type': 'COSINEFROMRADIANS' },
        { 'kind': 'block', 'type': 'CROSSPRODUCT' },
        { 'kind': 'block', 'type': 'DISTANCEBETWEEN' },
        { 'kind': 'block', 'type': 'DIVIDE' },
        { 'kind': 'block', 'type': 'DOTPRODUCT' },
        { 'kind': 'block', 'type': 'DOWN' },
        { 'kind': 'block', 'type': 'FORWARD' },
        { 'kind': 'block', 'type': 'LEFT' },
        { 'kind': 'block', 'type': 'MODULO' },
        { 'kind': 'block', 'type': 'MULTIPLY' },
        { 'kind': 'block', 'type': 'NORMALIZE' },
        { 'kind': 'block', 'type': 'POWER' },
        { 'kind': 'block', 'type': 'RIGHT' },
        { 'kind': 'block', 'type': 'SQUAREROOT' },
        { 'kind': 'block', 'type': 'SUBTRACT' },
        { 'kind': 'block', 'type': 'UP' },
        { 'kind': 'block', 'type': 'VECTOR' },
        { 'kind': 'block', 'type': 'VECTORMAGNITUDE' },
        { 'kind': 'block', 'type': 'VECTORTOWARDS' },
        { 'kind': 'block', 'type': 'XCOMPONENTOF' },
        { 'kind': 'block', 'type': 'YCOMPONENTOF' },
        { 'kind': 'block', 'type': 'ZCOMPONENTOF' }
      ]
    },
    {
      'kind': 'category',
      'name': 'OBJECTIVE',
      'colour': '#4CAF50', // Green
      'contents': [
        { 'kind': 'block', 'type': 'capture_points' },
        { 'kind': 'block', 'type': 'compare_capture_point' },
        { 'kind': 'block', 'type': 'get_all_capture_points' },
        { 'kind': 'block', 'type': 'get_capture_point_position' },
        { 'kind': 'block', 'type': 'get_capture_progress' },
        { 'kind': 'block', 'type': 'get_mcom_state' },
        { 'kind': 'block', 'type': 'get_objective' },
        // Value Objective Blocks
        { 'kind': 'block', 'type': 'CAPTUREPOINTS' },
        { 'kind': 'block', 'type': 'COMPARECAPTUREPOINT' },
        { 'kind': 'block', 'type': 'GETOBJECTIVESTATE' }
      ]
    },
    {
      'kind': 'category',
      'name': 'OTHER',
      'colour': '#4CAF50', // Green
      'contents': [
        { 'kind': 'block', 'type': 'GETELEMENT' },
        { 'kind': 'block', 'type': 'BACKWARD' },
        { 'kind': 'block', 'type': 'count_of' },
        { 'kind': 'block', 'type': 'cross_product' },
        { 'kind': 'block', 'type': 'damage_types' },
        { 'kind': 'block', 'type': 'death_types' },
        { 'kind': 'block', 'type': 'degrees_to_radians' },
        { 'kind': 'block', 'type': 'direction_from_angles' },
        { 'kind': 'block', 'type': 'direction_towards' },
        { 'kind': 'block', 'type': 'dot_product' },
        { 'kind': 'block', 'type': 'factions' },
        { 'kind': 'block', 'type': 'first_of' },
        { 'kind': 'block', 'type': 'get_all_mco_ms' },
        { 'kind': 'block', 'type': 'get_seat_count' },
        { 'kind': 'block', 'type': 'get_x_component' },
        { 'kind': 'block', 'type': 'get_y_component' },
        { 'kind': 'block', 'type': 'get_z_component' },
        { 'kind': 'block', 'type': 'input_restrictions' },
        { 'kind': 'block', 'type': 'is_current_map' },
        { 'kind': 'block', 'type': 'is_faction' },
        { 'kind': 'block', 'type': 'is_killer_weapon' },
        { 'kind': 'block', 'type': 'is_type' },
        { 'kind': 'block', 'type': 'is_victim_damage_type' },
        { 'kind': 'block', 'type': 'is_victim_death_type' },
        { 'kind': 'block', 'type': 'last_of' },
        { 'kind': 'block', 'type': 'maps' },
        { 'kind': 'block', 'type': 'max' },
        { 'kind': 'block', 'type': 'mco_ms' },
        { 'kind': 'block', 'type': 'med_gadget_types' },
        { 'kind': 'block', 'type': 'pi' },
        { 'kind': 'block', 'type': 'radians_to_degrees' },
        { 'kind': 'block', 'type': 'resupply_types' },
        { 'kind': 'block', 'type': 'square_root' },
        { 'kind': 'block', 'type': 'types' },] // No Value blocks identified directly
    },
    {
      'kind': 'category',
      'name': 'PLAYER',
      'colour': '#4CAF50', // Green
      'contents': [
        { 'kind': 'block', 'type': 'closest_player_to' },
        { 'kind': 'block', 'type': 'farthest_player_from' },
        { 'kind': 'block', 'type': 'get_all_players_in_vehicle' },
        { 'kind': 'block', 'type': 'get_current_owner_team_id' },
        { 'kind': 'block', 'type': 'get_owner_progress_team_id' },
        { 'kind': 'block', 'type': 'get_player_deaths' },
        { 'kind': 'block', 'type': 'get_player_from_vehicle_seat' },
        { 'kind': 'block', 'type': 'get_player_kills' },
        { 'kind': 'block', 'type': 'get_players' },
        { 'kind': 'block', 'type': 'get_players_on_point' },
        { 'kind': 'block', 'type': 'get_player_state' },
        { 'kind': 'block', 'type': 'get_player_vehicle_seat' },
        { 'kind': 'block', 'type': 'get_previous_owner_team_id' },
        { 'kind': 'block', 'type': 'get_team_id' },
        { 'kind': 'block', 'type': 'get_vehicle_from_player' },
        { 'kind': 'block', 'type': 'get_vehicle_team_id' },
        { 'kind': 'block', 'type': 'is_player_valid' },
        { 'kind': 'block', 'type': 'player_soldiers' },
        { 'kind': 'block', 'type': 'player_state_bool' },
        { 'kind': 'block', 'type': 'player_state_number' },
        // Value Player Blocks
        { 'kind': 'block', 'type': 'CLOSESTPLAYERTO' },
        { 'kind': 'block', 'type': 'GETPLAYERBYID' },
        { 'kind': 'block', 'type': 'GETPLAYERNAME' },
        { 'kind': 'block', 'type': 'GETPLAYERHEALTH' },
        { 'kind': 'block', 'type': 'GETPLAYERTEAM' }
      ]
    },
    {
      'kind': 'category',
      'name': 'TRANSFORM',
      'colour': '#4CAF50', // Green
      'contents': [
        // Value Transform blocks (already in Math, for now just placeholder)
      ]
    },
    {
      'kind': 'category',
      'name': 'USER INTERFACE',
      'colour': '#4CAF50', // Green
      'contents': [
        { 'kind': 'block', 'type': 'custom_message_slot' },
        { 'kind': 'block', 'type': 'message' },] // No Value blocks identified directly, only Statement UI blocks
    },
    {
      'kind': 'category',
      'name': 'VEHICLES',
      'colour': '#4CAF50', // Green
      'contents': [
        { 'kind': 'block', 'type': 'compare_vehicle_name' },
        { 'kind': 'block', 'type': 'get_all_vehicles' },
        { 'kind': 'block', 'type': 'get_vehicle_state' },
        { 'kind': 'block', 'type': 'is_vehicle_occupied' },
        { 'kind': 'block', 'type': 'is_vehicle_seat_occupied' },
        { 'kind': 'block', 'type': 'vehicles' },
        { 'kind': 'block', 'type': 'vehicle_types' },
        // Value Vehicle Blocks
        { 'kind': 'block', 'type': 'COMPAREVEHICLENAME' },
        { 'kind': 'block', 'type': 'GETVEHICLEDRIVER' },
        { 'kind': 'block', 'type': 'VEHICLE_LIST_ITEM' }
      ]
    },
    {
      'kind': 'category',
      'name': 'SELECTION LISTS',
      'colour': '#4CAF50', // Green
      'custom': 'SELECTION_LISTS_CATEGORY'
    },
    {
      'kind': 'category',
      'name': 'LITERALS',
      'colour': '#4CAF50', // Green
      'contents': [
        { 'kind': 'block', 'type': 'BOOLEAN' },
        { 'kind': 'block', 'type': 'GETVARIABLE' },
        { 'kind': 'block', 'type': 'get_variable' },
        { 'kind': 'block', 'type': 'mcom_state_bool' },
        // Value Literal Blocks
        { 'kind': 'block', 'type': 'NUMBER' },
        { 'kind': 'block', 'type': 'STRING' },
        { 'kind': 'block', 'type': 'BOOL' }
      ]
    },
    {
      'kind': 'category',
      'name': 'VARIABLES',
      'colour': '#4CAF50', // Green
      'custom': 'VARIABLES_CATEGORY'
    },

    // --- FINAL SPECIAL MENUS ---
    {
      'kind': 'category',
      'name': 'SUBROUTINES',
      'colour': '#E65100', // Dirty Orange
      'custom': 'SUBROUTINES_CATEGORY'
    },
    {
      'kind': 'category',
      'name': 'CONTROL ACTIONS',
      'colour': '#3F51B5', // Dirty Blue
      'contents': [
        { 'kind': 'block', 'type': 'BREAK_BLOCK' },
        { 'kind': 'block', 'type': 'CONTINUE_BLOCK' },
        { 'kind': 'block', 'type': 'IF_BLOCK' },
        { 'kind': 'block', 'type': 'WHILE_BLOCK' },
        { 'kind': 'block', 'type': 'FOR_VARIABLE_BLOCK' }
      ]
    }
  ]
};