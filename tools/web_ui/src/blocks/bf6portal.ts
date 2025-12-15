import * as Blockly from 'blockly';

export const bf6PortalBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  { "type": "abort", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 120, "tooltip": "Official tooltip for abort from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "abort_if", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 120, "tooltip": "Official tooltip for abort_if from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "absolute_value", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for absolute_value from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "add", "message0": "%1 %2 %3", "args0": [{"type": "input_value", "name": "A", "check": "Number"}, {"type": "field_label", "text": "+"}, {"type": "input_value", "name": "B", "check": "Number"}], "colour": 210, "tooltip": "Official tooltip for add from portal-docs", "output": "Number", "previousStatement": null, "nextStatement": null },
  { "type": "and", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for and from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "angle_between_vectors", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for angle_between_vectors from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "angle_difference", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for angle_difference from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "append_to_array", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 120, "tooltip": "Official tooltip for append_to_array from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "apply_med_gadget", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for apply_med_gadget from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "arccosine_in_degrees", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for arccosine_in_degrees from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "arccosine_in_radians", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for arccosine_in_radians from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "arcsine_in_degrees", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for arcsine_in_degrees from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "arcsine_in_radians", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for arcsine_in_radians from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "arctangent_in_degrees", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for arctangent_in_degrees from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "arctangent_in_radians", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for arctangent_in_radians from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "array_contains", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 160, "tooltip": "Official tooltip for array_contains from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "array_slice", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 160, "tooltip": "Official tooltip for array_slice from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "backward_vector", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for backward_vector from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "bool", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for bool from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "break", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 120, "tooltip": "Official tooltip for break from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "capture_point_capturing_time", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for capture_point_capturing_time from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "capture_point_neutralization_time", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for capture_point_neutralization_time from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "capture_points", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for capture_points from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "ceiling", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for ceiling from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "clear_all_custom_messages", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for clear_all_custom_messages from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "clear_custom_message", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for clear_custom_message from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "closest_player_to", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for closest_player_to from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "compare_capture_point", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for compare_capture_point from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "compare_vehicle_name", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for compare_vehicle_name from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "condition", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for condition from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "continue", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 120, "tooltip": "Official tooltip for continue from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "cosine_from_degrees", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for cosine_from_degrees from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "cosine_from_radians", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for cosine_from_radians from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "count_of", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 160, "tooltip": "Official tooltip for count_of from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "create_vector", "message0": "Create Vector X %1 Y %2 Z %3", "args0": [{"type": "input_value", "name": "X", "check": "Number"}, {"type": "input_value", "name": "Y", "check": "Number"}, {"type": "input_value", "name": "Z", "check": "Number"}], "colour": 260, "tooltip": "Official tooltip for create_vector from portal-docs", "output": "Vector", "previousStatement": null, "nextStatement": null },
  { "type": "cross_product", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for cross_product from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "current_array_element", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 160, "tooltip": "Official tooltip for current_array_element from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "custom_message_slot", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for custom_message_slot from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "damage_types", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 0, "tooltip": "Official tooltip for damage_types from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "damage_vehicle", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for damage_vehicle from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "deal_damage", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for deal_damage from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "death_types", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 330, "tooltip": "Official tooltip for death_types from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "degrees_to_radians", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for degrees_to_radians from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "deploy_all_players", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for deploy_all_players from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "deploy_player", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for deploy_player from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "destroy_vehicle", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for destroy_vehicle from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "direction_from_angles", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for direction_from_angles from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "direction_towards", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for direction_towards from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "display_custom_message", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for display_custom_message from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "display_game_mode_message", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for display_game_mode_message from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "display_highlighted_world_log_message", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for display_highlighted_world_log_message from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "display_notification_message", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 120, "tooltip": "Official tooltip for display_notification_message from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "distance_between", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for distance_between from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "divide", "message0": "%1 %2 %3", "args0": [{"type": "input_value", "name": "A", "check": "Number"}, {"type": "field_label", "text": "+"}, {"type": "input_value", "name": "B", "check": "Number"}], "colour": 210, "tooltip": "Official tooltip for divide from portal-docs", "output": "Number", "previousStatement": null, "nextStatement": null },
  { "type": "dot_product", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for dot_product from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "down_vector", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for down_vector from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "else", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 120, "tooltip": "Official tooltip for else from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "else_if", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 120, "tooltip": "Official tooltip for else_if from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "empty_array", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 160, "tooltip": "Official tooltip for empty_array from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "enable_all_input_restrictions", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for enable_all_input_restrictions from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "enable_all_player_deploy", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for enable_all_player_deploy from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "enable_capture_point_deploying", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for enable_capture_point_deploying from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "enable_capturing", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for enable_capturing from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "enable_default_game_mode_scoring", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for enable_default_game_mode_scoring from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "enable_default_game_mode_win_condition", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for enable_default_game_mode_win_condition from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "enable_game_mode_objective", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for enable_game_mode_objective from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "enable_hq", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for enable_hq from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "enable_input_restriction", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for enable_input_restriction from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "enable_ticket_bleed_acceleration", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for enable_ticket_bleed_acceleration from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "enable_vo_messaging", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for enable_vo_messaging from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "enable_world_icon_image", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for enable_world_icon_image from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "enable_world_icon_text", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for enable_world_icon_text from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "end_game_mode", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 120, "tooltip": "Official tooltip for end_game_mode from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "equals", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for equals from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "event_capture_point", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 65, "tooltip": "Official tooltip for event_capture_point from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "event_damage_type", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 65, "tooltip": "Official tooltip for event_damage_type from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "event_death_type", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 65, "tooltip": "Official tooltip for event_death_type from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "event_mcom", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 65, "tooltip": "Official tooltip for event_mcom from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "event_other_player", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 65, "tooltip": "Official tooltip for event_other_player from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "event_player", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 65, "tooltip": "Official tooltip for event_player from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "event_seat", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 65, "tooltip": "Official tooltip for event_seat from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "event_team", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 65, "tooltip": "Official tooltip for event_team from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "event_vehicle", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 65, "tooltip": "Official tooltip for event_vehicle from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "event_weapon", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 65, "tooltip": "Official tooltip for event_weapon from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "factions", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 330, "tooltip": "Official tooltip for factions from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "farthest_player_from", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for farthest_player_from from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "filtered_array", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 160, "tooltip": "Official tooltip for filtered_array from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "first_of", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 160, "tooltip": "Official tooltip for first_of from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "floor", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for floor from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "force_all_exit_vehicle", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for force_all_exit_vehicle from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "force_mandown", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for force_mandown from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "force_player_exit_vehicle", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for force_player_exit_vehicle from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "force_player_to_seat", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for force_player_to_seat from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "force_revive", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for force_revive from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "force_switch_inventory", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 0, "tooltip": "Official tooltip for force_switch_inventory from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "forward_vector", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for forward_vector from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_all_capture_points", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_all_capture_points from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_all_mcoms", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_all_mcoms from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_all_players_in_vehicle", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_all_players_in_vehicle from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_all_vehicles", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_all_vehicles from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_capture_point_position", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_capture_point_position from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_capture_progress", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_capture_progress from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_current_owner_team_id", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_current_owner_team_id from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_game_mode_score", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_game_mode_score from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_game_mode_target_score", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_game_mode_target_score from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_game_mode_time_elapsed", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_game_mode_time_elapsed from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_game_mode_time_limit", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_game_mode_time_limit from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_game_mode_time_remaining", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_game_mode_time_remaining from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_inventory_ammo", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_inventory_ammo from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_inventory_magazine_ammo", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_inventory_magazine_ammo from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_mcom_state", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_mcom_state from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_objective", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_objective from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_owner_progress_team_id", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_owner_progress_team_id from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_player_deaths", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_player_deaths from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_player_from_vehicle_seat", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_player_from_vehicle_seat from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_player_kills", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_player_kills from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_players", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_players from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_players_on_point", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_players_on_point from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_player_state", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_player_state from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_player_vehicle_seat", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_player_vehicle_seat from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_previous_owner_team_id", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_previous_owner_team_id from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_remaining_fuse_time", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_remaining_fuse_time from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_seat_count", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 160, "tooltip": "Official tooltip for get_seat_count from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_subroutine_argument", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 65, "tooltip": "Official tooltip for get_subroutine_argument from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_team_id", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_team_id from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_variable", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_variable from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_vehicle_from_player", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_vehicle_from_player from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_vehicle_state", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_vehicle_state from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_vehicle_team_id", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for get_vehicle_team_id from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_x_component", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for get_x_component from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_y_component", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for get_y_component from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "get_z_component", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for get_z_component from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "greater_than", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for greater_than from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "greater_than_equal_to", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for greater_than_equal_to from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "has_inventory", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 0, "tooltip": "Official tooltip for has_inventory from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "heal", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for heal from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "if", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 120, "tooltip": "Official tooltip for if from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "if_then_else", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 120, "tooltip": "Official tooltip for if_then_else from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "index_of_array_value", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 160, "tooltip": "Official tooltip for index_of_array_value from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "input_restrictions", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for input_restrictions from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "inventory_character_specialties", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 0, "tooltip": "Official tooltip for inventory_character_specialties from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "inventory_class_gadgets", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 0, "tooltip": "Official tooltip for inventory_class_gadgets from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "inventory_melee_weapons", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 0, "tooltip": "Official tooltip for inventory_melee_weapons from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "inventory_open_gadgets", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 0, "tooltip": "Official tooltip for inventory_open_gadgets from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "inventory_primary_weapons", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 0, "tooltip": "Official tooltip for inventory_primary_weapons from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "inventory_secondary_weapons", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 0, "tooltip": "Official tooltip for inventory_secondary_weapons from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "inventory_throwables", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 0, "tooltip": "Official tooltip for inventory_throwables from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "is_current_map", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for is_current_map from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "is_faction", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for is_faction from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "is_inventory_slot_active", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for is_inventory_slot_active from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "is_killer_weapon", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for is_killer_weapon from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "is_player_using_soldier", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for is_player_using_soldier from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "is_player_valid", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for is_player_valid from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "is_true_for_all", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for is_true_for_all from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "is_true_for_any", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for is_true_for_any from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "is_type", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for is_type from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "is_vehicle_occupied", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for is_vehicle_occupied from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "is_vehicle_seat_occupied", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for is_vehicle_seat_occupied from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "is_victim_damage_type", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for is_victim_damage_type from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "is_victim_death_type", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for is_victim_death_type from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "kill", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for kill from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "last_of", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 160, "tooltip": "Official tooltip for last_of from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "left_vector", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for left_vector from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "less_than", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for less_than from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "less_than_equal_to", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for less_than_equal_to from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "local_to_world_position", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for local_to_world_position from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "local_to_world_vector", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for local_to_world_vector from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "locational_sounds", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for locational_sounds from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "loop_variable", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for loop_variable from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "mapped_array", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 160, "tooltip": "Official tooltip for mapped_array from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "maps", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for maps from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "max", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for max from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "mcom_state_bool", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for mcom_state_bool from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "mcoms", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for mcoms from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "med_gadget_types", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for med_gadget_types from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "message", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for message from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "mod", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for mod from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "modulo", "message0": "%1 %2 %3", "args0": [{"type": "input_value", "name": "A", "check": "Number"}, {"type": "field_label", "text": "+"}, {"type": "input_value", "name": "B", "check": "Number"}], "colour": 210, "tooltip": "Official tooltip for modulo from portal-docs", "output": "Number", "previousStatement": null, "nextStatement": null },
  { "type": "multiply", "message0": "%1 %2 %3", "args0": [{"type": "input_value", "name": "A", "check": "Number"}, {"type": "field_label", "text": "+"}, {"type": "input_value", "name": "B", "check": "Number"}], "colour": 210, "tooltip": "Official tooltip for multiply from portal-docs", "output": "Number", "previousStatement": null, "nextStatement": null },
  { "type": "normalize", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for normalize from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "not", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for not from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "not_equal_to", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for not_equal_to from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "number", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for number from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "or", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for or from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "pause_game_mode_time", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 120, "tooltip": "Official tooltip for pause_game_mode_time from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "pi", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for pi from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "player_inventory_slots", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 0, "tooltip": "Official tooltip for player_inventory_slots from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "player_soldiers", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for player_soldiers from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "player_state_bool", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for player_state_bool from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "player_state_number", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for player_state_number from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "player_state_vector", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for player_state_vector from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "radians_to_degrees", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for radians_to_degrees from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "raise_to_power", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for raise_to_power from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "randomized_array", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 160, "tooltip": "Official tooltip for randomized_array from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "random_value_in_array", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 160, "tooltip": "Official tooltip for random_value_in_array from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "random_real", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for random_real from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "remove_from_array", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 160, "tooltip": "Official tooltip for remove_from_array from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "remove_player_inventory", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 160, "tooltip": "Official tooltip for remove_player_inventory from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "remove_player_inventory_at_slot", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 160, "tooltip": "Official tooltip for remove_player_inventory_at_slot from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "repair_vehicle", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for repair_vehicle from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "replace_player_inventory", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 0, "tooltip": "Official tooltip for replace_player_inventory from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "reset_game_mode_time", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 120, "tooltip": "Official tooltip for reset_game_mode_time from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "resupply", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for resupply from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "resupply_types", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 260, "tooltip": "Official tooltip for resupply_types from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "right_vector", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for right_vector from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "round_to_integer", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for round_to_integer from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "rule", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 65, "tooltip": "Official tooltip for rule from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "send_error_report", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 120, "tooltip": "Official tooltip for send_error_report from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "set_capture_multiplier", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 0, "tooltip": "Official tooltip for set_capture_multiplier from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "set_game_mode_score", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 0, "tooltip": "Official tooltip for set_game_mode_score from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "set_game_mode_target_score", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for set_game_mode_target_score from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "set_game_mode_time_limit", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 0, "tooltip": "Official tooltip for set_game_mode_time_limit from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "set_inventory_ammo", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 0, "tooltip": "Official tooltip for set_inventory_ammo from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "set_inventory_magazine_ammo", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 0, "tooltip": "Official tooltip for set_inventory_magazine_ammo from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "set_mcom_fuse_time", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 0, "tooltip": "Official tooltip for set_mcom_fuse_time from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "set_neutralization_time_multiplier", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 0, "tooltip": "Official tooltip for set_neutralization_time_multiplier from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "set_objective_owner", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 0, "tooltip": "Official tooltip for set_objective_owner from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "set_player_max_health", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 0, "tooltip": "Official tooltip for set_player_max_health from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "set_player_soldier", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 0, "tooltip": "Official tooltip for set_player_soldier from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "set_redeploy_time", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 0, "tooltip": "Official tooltip for set_redeploy_time from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "set_team_id", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 0, "tooltip": "Official tooltip for set_team_id from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "set_variable", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 0, "tooltip": "Official tooltip for set_variable from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "set_variable_at_index", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 160, "tooltip": "Official tooltip for set_variable_at_index from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "set_vehicle_max_health_multiplier", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 0, "tooltip": "Official tooltip for set_vehicle_max_health_multiplier from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "set_world_icon_image", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 0, "tooltip": "Official tooltip for set_world_icon_image from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "set_world_icon_owner", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 0, "tooltip": "Official tooltip for set_world_icon_owner from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "set_world_icon_position", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 0, "tooltip": "Official tooltip for set_world_icon_position from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "set_world_icon_text", "message0": "%1", "args0": [{"type": "input_statement", "name": "DO"}], "colour": 0, "tooltip": "Official tooltip for set_world_icon_text from portal-docs", "output": null, "previousStatement": true, "nextStatement": true },
  { "type": "sine_from_degrees", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for sine_from_degrees from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "sine_from_radians", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for sine_from_radians from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "skip", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 120, "tooltip": "Official tooltip for skip from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "skip_if", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 120, "tooltip": "Official tooltip for skip_if from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "skip_mandown", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 120, "tooltip": "Official tooltip for skip_mandown from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "sorted_array", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 160, "tooltip": "Official tooltip for sorted_array from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "sounds", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for sounds from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "spot_target", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for spot_target from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "spot_target_for_player", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for spot_target_for_player from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "square_root", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for square_root from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "stop_tracking_variable", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for stop_tracking_variable from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "string", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for string from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "subroutine", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 65, "tooltip": "Official tooltip for subroutine from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "subroutine_instance", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 65, "tooltip": "Official tooltip for subroutine_instance from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "subtract", "message0": "%1 %2 %3", "args0": [{"type": "input_value", "name": "A", "check": "Number"}, {"type": "field_label", "text": "+"}, {"type": "input_value", "name": "B", "check": "Number"}], "colour": 210, "tooltip": "Official tooltip for subtract from portal-docs", "output": "Number", "previousStatement": null, "nextStatement": null },
  { "type": "tangent_from_degrees", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for tangent_from_degrees from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "tangent_from_radians", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 210, "tooltip": "Official tooltip for tangent_from_radians from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "teleport", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for teleport from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "track_variable_at_rate", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for track_variable_at_rate from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "track_variable_over_time", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for track_variable_over_time from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "trigger_audio", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for trigger_audio from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "trigger_audio_at_location", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for trigger_audio_at_location from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "types", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 330, "tooltip": "Official tooltip for types from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "undeploy_all_players", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for undeploy_all_players from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "undeploy_player", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for undeploy_player from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "unspot_target", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 0, "tooltip": "Official tooltip for unspot_target from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "up_vector", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for up_vector from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "value_in_array", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 160, "tooltip": "Official tooltip for value_in_array from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "variable", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for variable from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "vector_towards", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for vector_towards from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "vehicles", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 0, "tooltip": "Official tooltip for vehicles from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "vehicle_state_vector", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for vehicle_state_vector from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "vehicle_types_item", "message0": "%1 %2", "args0": [{"type": "field_label", "text": "Select"}, {"type": "field_dropdown", "name": "OPTION", "options": [["Option1", "OPT1"], ["Option2", "OPT2"]]}], "colour": 0, "tooltip": "Official tooltip for vehicle_types_item from portal-docs", "output": "String", "previousStatement": null, "nextStatement": null },
  { "type": "voice_overs", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 330, "tooltip": "Official tooltip for voice_overs from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "wait", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 120, "tooltip": "Official tooltip for wait from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "wait_until", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 120, "tooltip": "Official tooltip for wait_until from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "while", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 120, "tooltip": "Official tooltip for while from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "world_icon_images", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for world_icon_images from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "world_icons", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for world_icons from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "world_to_local_position", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for world_to_local_position from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "world_to_local_vector", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 260, "tooltip": "Official tooltip for world_to_local_vector from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
  { "type": "xor", "message0": "%1", "args0": [{"type": "input_value", "name": "INPUT"}], "colour": 290, "tooltip": "Official tooltip for xor from portal-docs", "output": "Any", "previousStatement": null, "nextStatement": null },
]);

# Generator stubs for all blocks
Blockly.JavaScript['abort'] = function(block) {
  // TODO: Assemble JavaScript into code variable for abort.
  var code = 'abort();
';
  return code;
};
Blockly.JavaScript['abort_if'] = function(block) {
  // TODO: Assemble JavaScript into code variable for abort_if.
  var code = 'abort_if();
';
  return code;
};
Blockly.JavaScript['absolute_value'] = function(block) {
  // TODO: Assemble JavaScript into code variable for absolute_value.
  var code = 'absolute_value();
';
  return code;
};
Blockly.JavaScript['add'] = function(block) {
  // TODO: Assemble JavaScript into code variable for add.
  var code = 'add();
';
  return code;
};
Blockly.JavaScript['and'] = function(block) {
  // TODO: Assemble JavaScript into code variable for and.
  var code = 'and();
';
  return code;
};
Blockly.JavaScript['angle_between_vectors'] = function(block) {
  // TODO: Assemble JavaScript into code variable for angle_between_vectors.
  var code = 'angle_between_vectors();
';
  return code;
};
Blockly.JavaScript['angle_difference'] = function(block) {
  // TODO: Assemble JavaScript into code variable for angle_difference.
  var code = 'angle_difference();
';
  return code;
};
Blockly.JavaScript['append_to_array'] = function(block) {
  // TODO: Assemble JavaScript into code variable for append_to_array.
  var code = 'append_to_array();
';
  return code;
};
Blockly.JavaScript['apply_med_gadget'] = function(block) {
  // TODO: Assemble JavaScript into code variable for apply_med_gadget.
  var code = 'apply_med_gadget();
';
  return code;
};
Blockly.JavaScript['arccosine_in_degrees'] = function(block) {
  // TODO: Assemble JavaScript into code variable for arccosine_in_degrees.
  var code = 'arccosine_in_degrees();
';
  return code;
};
Blockly.JavaScript['arccosine_in_radians'] = function(block) {
  // TODO: Assemble JavaScript into code variable for arccosine_in_radians.
  var code = 'arccosine_in_radians();
';
  return code;
};
Blockly.JavaScript['arcsine_in_degrees'] = function(block) {
  // TODO: Assemble JavaScript into code variable for arcsine_in_degrees.
  var code = 'arcsine_in_degrees();
';
  return code;
};
Blockly.JavaScript['arcsine_in_radians'] = function(block) {
  // TODO: Assemble JavaScript into code variable for arcsine_in_radians.
  var code = 'arcsine_in_radians();
';
  return code;
};
Blockly.JavaScript['arctangent_in_degrees'] = function(block) {
  // TODO: Assemble JavaScript into code variable for arctangent_in_degrees.
  var code = 'arctangent_in_degrees();
';
  return code;
};
Blockly.JavaScript['arctangent_in_radians'] = function(block) {
  // TODO: Assemble JavaScript into code variable for arctangent_in_radians.
  var code = 'arctangent_in_radians();
';
  return code;
};
Blockly.JavaScript['array_contains'] = function(block) {
  // TODO: Assemble JavaScript into code variable for array_contains.
  var code = 'array_contains();
';
  return code;
};
Blockly.JavaScript['array_slice'] = function(block) {
  // TODO: Assemble JavaScript into code variable for array_slice.
  var code = 'array_slice();
';
  return code;
};
Blockly.JavaScript['backward_vector'] = function(block) {
  // TODO: Assemble JavaScript into code variable for backward_vector.
  var code = 'backward_vector();
';
  return code;
};
Blockly.JavaScript['bool'] = function(block) {
  // TODO: Assemble JavaScript into code variable for bool.
  var code = 'bool();
';
  return code;
};
Blockly.JavaScript['break'] = function(block) {
  // TODO: Assemble JavaScript into code variable for break.
  var code = 'break();
';
  return code;
};
Blockly.JavaScript['capture_point_capturing_time'] = function(block) {
  // TODO: Assemble JavaScript into code variable for capture_point_capturing_time.
  var code = 'capture_point_capturing_time();
';
  return code;
};
Blockly.JavaScript['capture_point_neutralization_time'] = function(block) {
  // TODO: Assemble JavaScript into code variable for capture_point_neutralization_time.
  var code = 'capture_point_neutralization_time();
';
  return code;
};
Blockly.JavaScript['capture_points'] = function(block) {
  // TODO: Assemble JavaScript into code variable for capture_points.
  var code = 'capture_points();
';
  return code;
};
Blockly.JavaScript['ceiling'] = function(block) {
  // TODO: Assemble JavaScript into code variable for ceiling.
  var code = 'ceiling();
';
  return code;
};
Blockly.JavaScript['clear_all_custom_messages'] = function(block) {
  // TODO: Assemble JavaScript into code variable for clear_all_custom_messages.
  var code = 'clear_all_custom_messages();
';
  return code;
};
Blockly.JavaScript['clear_custom_message'] = function(block) {
  // TODO: Assemble JavaScript into code variable for clear_custom_message.
  var code = 'clear_custom_message();
';
  return code;
};
Blockly.JavaScript['closest_player_to'] = function(block) {
  // TODO: Assemble JavaScript into code variable for closest_player_to.
  var code = 'closest_player_to();
';
  return code;
};
Blockly.JavaScript['compare_capture_point'] = function(block) {
  // TODO: Assemble JavaScript into code variable for compare_capture_point.
  var code = 'compare_capture_point();
';
  return code;
};
Blockly.JavaScript['compare_vehicle_name'] = function(block) {
  // TODO: Assemble JavaScript into code variable for compare_vehicle_name.
  var code = 'compare_vehicle_name();
';
  return code;
};
Blockly.JavaScript['condition'] = function(block) {
  // TODO: Assemble JavaScript into code variable for condition.
  var code = 'condition();
';
  return code;
};
Blockly.JavaScript['continue'] = function(block) {
  // TODO: Assemble JavaScript into code variable for continue.
  var code = 'continue();
';
  return code;
};
Blockly.JavaScript['cosine_from_degrees'] = function(block) {
  // TODO: Assemble JavaScript into code variable for cosine_from_degrees.
  var code = 'cosine_from_degrees();
';
  return code;
};
Blockly.JavaScript['cosine_from_radians'] = function(block) {
  // TODO: Assemble JavaScript into code variable for cosine_from_radians.
  var code = 'cosine_from_radians();
';
  return code;
};
Blockly.JavaScript['count_of'] = function(block) {
  // TODO: Assemble JavaScript into code variable for count_of.
  var code = 'count_of();
';
  return code;
};
Blockly.JavaScript['create_vector'] = function(block) {
  // TODO: Assemble JavaScript into code variable for create_vector.
  var code = 'create_vector();
';
  return code;
};
Blockly.JavaScript['cross_product'] = function(block) {
  // TODO: Assemble JavaScript into code variable for cross_product.
  var code = 'cross_product();
';
  return code;
};
Blockly.JavaScript['current_array_element'] = function(block) {
  // TODO: Assemble JavaScript into code variable for current_array_element.
  var code = 'current_array_element();
';
  return code;
};
Blockly.JavaScript['custom_message_slot'] = function(block) {
  // TODO: Assemble JavaScript into code variable for custom_message_slot.
  var code = 'custom_message_slot();
';
  return code;
};
Blockly.JavaScript['damage_types'] = function(block) {
  // TODO: Assemble JavaScript into code variable for damage_types.
  var code = 'damage_types();
';
  return code;
};
Blockly.JavaScript['damage_vehicle'] = function(block) {
  // TODO: Assemble JavaScript into code variable for damage_vehicle.
  var code = 'damage_vehicle();
';
  return code;
};
Blockly.JavaScript['deal_damage'] = function(block) {
  // TODO: Assemble JavaScript into code variable for deal_damage.
  var code = 'deal_damage();
';
  return code;
};
Blockly.JavaScript['death_types'] = function(block) {
  // TODO: Assemble JavaScript into code variable for death_types.
  var code = 'death_types();
';
  return code;
};
Blockly.JavaScript['degrees_to_radians'] = function(block) {
  // TODO: Assemble JavaScript into code variable for degrees_to_radians.
  var code = 'degrees_to_radians();
';
  return code;
};
Blockly.JavaScript['deploy_all_players'] = function(block) {
  // TODO: Assemble JavaScript into code variable for deploy_all_players.
  var code = 'deploy_all_players();
';
  return code;
};
Blockly.JavaScript['deploy_player'] = function(block) {
  // TODO: Assemble JavaScript into code variable for deploy_player.
  var code = 'deploy_player();
';
  return code;
};
Blockly.JavaScript['destroy_vehicle'] = function(block) {
  // TODO: Assemble JavaScript into code variable for destroy_vehicle.
  var code = 'destroy_vehicle();
';
  return code;
};
Blockly.JavaScript['direction_from_angles'] = function(block) {
  // TODO: Assemble JavaScript into code variable for direction_from_angles.
  var code = 'direction_from_angles();
';
  return code;
};
Blockly.JavaScript['direction_towards'] = function(block) {
  // TODO: Assemble JavaScript into code variable for direction_towards.
  var code = 'direction_towards();
';
  return code;
};
Blockly.JavaScript['display_custom_message'] = function(block) {
  // TODO: Assemble JavaScript into code variable for display_custom_message.
  var code = 'display_custom_message();
';
  return code;
};
Blockly.JavaScript['display_game_mode_message'] = function(block) {
  // TODO: Assemble JavaScript into code variable for display_game_mode_message.
  var code = 'display_game_mode_message();
';
  return code;
};
Blockly.JavaScript['display_highlighted_world_log_message'] = function(block) {
  // TODO: Assemble JavaScript into code variable for display_highlighted_world_log_message.
  var code = 'display_highlighted_world_log_message();
';
  return code;
};
Blockly.JavaScript['display_notification_message'] = function(block) {
  // TODO: Assemble JavaScript into code variable for display_notification_message.
  var code = 'display_notification_message();
';
  return code;
};
Blockly.JavaScript['distance_between'] = function(block) {
  // TODO: Assemble JavaScript into code variable for distance_between.
  var code = 'distance_between();
';
  return code;
};
Blockly.JavaScript['divide'] = function(block) {
  // TODO: Assemble JavaScript into code variable for divide.
  var code = 'divide();
';
  return code;
};
Blockly.JavaScript['dot_product'] = function(block) {
  // TODO: Assemble JavaScript into code variable for dot_product.
  var code = 'dot_product();
';
  return code;
};
Blockly.JavaScript['down_vector'] = function(block) {
  // TODO: Assemble JavaScript into code variable for down_vector.
  var code = 'down_vector();
';
  return code;
};
Blockly.JavaScript['else'] = function(block) {
  // TODO: Assemble JavaScript into code variable for else.
  var code = 'else();
';
  return code;
};
Blockly.JavaScript['else_if'] = function(block) {
  // TODO: Assemble JavaScript into code variable for else_if.
  var code = 'else_if();
';
  return code;
};
Blockly.JavaScript['empty_array'] = function(block) {
  // TODO: Assemble JavaScript into code variable for empty_array.
  var code = 'empty_array();
';
  return code;
};
Blockly.JavaScript['enable_all_input_restrictions'] = function(block) {
  // TODO: Assemble JavaScript into code variable for enable_all_input_restrictions.
  var code = 'enable_all_input_restrictions();
';
  return code;
};
Blockly.JavaScript['enable_all_player_deploy'] = function(block) {
  // TODO: Assemble JavaScript into code variable for enable_all_player_deploy.
  var code = 'enable_all_player_deploy();
';
  return code;
};
Blockly.JavaScript['enable_capture_point_deploying'] = function(block) {
  // TODO: Assemble JavaScript into code variable for enable_capture_point_deploying.
  var code = 'enable_capture_point_deploying();
';
  return code;
};
Blockly.JavaScript['enable_capturing'] = function(block) {
  // TODO: Assemble JavaScript into code variable for enable_capturing.
  var code = 'enable_capturing();
';
  return code;
};
Blockly.JavaScript['enable_default_game_mode_scoring'] = function(block) {
  // TODO: Assemble JavaScript into code variable for enable_default_game_mode_scoring.
  var code = 'enable_default_game_mode_scoring();
';
  return code;
};
Blockly.JavaScript['enable_default_game_mode_win_condition'] = function(block) {
  // TODO: Assemble JavaScript into code variable for enable_default_game_mode_win_condition.
  var code = 'enable_default_game_mode_win_condition();
';
  return code;
};
Blockly.JavaScript['enable_game_mode_objective'] = function(block) {
  // TODO: Assemble JavaScript into code variable for enable_game_mode_objective.
  var code = 'enable_game_mode_objective();
';
  return code;
};
Blockly.JavaScript['enable_hq'] = function(block) {
  // TODO: Assemble JavaScript into code variable for enable_hq.
  var code = 'enable_hq();
';
  return code;
};
Blockly.JavaScript['enable_input_restriction'] = function(block) {
  // TODO: Assemble JavaScript into code variable for enable_input_restriction.
  var code = 'enable_input_restriction();
';
  return code;
};
Blockly.JavaScript['enable_ticket_bleed_acceleration'] = function(block) {
  // TODO: Assemble JavaScript into code variable for enable_ticket_bleed_acceleration.
  var code = 'enable_ticket_bleed_acceleration();
';
  return code;
};
Blockly.JavaScript['enable_vo_messaging'] = function(block) {
  // TODO: Assemble JavaScript into code variable for enable_vo_messaging.
  var code = 'enable_vo_messaging();
';
  return code;
};
Blockly.JavaScript['enable_world_icon_image'] = function(block) {
  // TODO: Assemble JavaScript into code variable for enable_world_icon_image.
  var code = 'enable_world_icon_image();
';
  return code;
};
Blockly.JavaScript['enable_world_icon_text'] = function(block) {
  // TODO: Assemble JavaScript into code variable for enable_world_icon_text.
  var code = 'enable_world_icon_text();
';
  return code;
};
Blockly.JavaScript['end_game_mode'] = function(block) {
  // TODO: Assemble JavaScript into code variable for end_game_mode.
  var code = 'end_game_mode();
';
  return code;
};
Blockly.JavaScript['equals'] = function(block) {
  // TODO: Assemble JavaScript into code variable for equals.
  var code = 'equals();
';
  return code;
};
Blockly.JavaScript['event_capture_point'] = function(block) {
  // TODO: Assemble JavaScript into code variable for event_capture_point.
  var code = 'event_capture_point();
';
  return code;
};
Blockly.JavaScript['event_damage_type'] = function(block) {
  // TODO: Assemble JavaScript into code variable for event_damage_type.
  var code = 'event_damage_type();
';
  return code;
};
Blockly.JavaScript['event_death_type'] = function(block) {
  // TODO: Assemble JavaScript into code variable for event_death_type.
  var code = 'event_death_type();
';
  return code;
};
Blockly.JavaScript['event_mcom'] = function(block) {
  // TODO: Assemble JavaScript into code variable for event_mcom.
  var code = 'event_mcom();
';
  return code;
};
Blockly.JavaScript['event_other_player'] = function(block) {
  // TODO: Assemble JavaScript into code variable for event_other_player.
  var code = 'event_other_player();
';
  return code;
};
Blockly.JavaScript['event_player'] = function(block) {
  // TODO: Assemble JavaScript into code variable for event_player.
  var code = 'event_player();
';
  return code;
};
Blockly.JavaScript['event_seat'] = function(block) {
  // TODO: Assemble JavaScript into code variable for event_seat.
  var code = 'event_seat();
';
  return code;
};
Blockly.JavaScript['event_team'] = function(block) {
  // TODO: Assemble JavaScript into code variable for event_team.
  var code = 'event_team();
';
  return code;
};
Blockly.JavaScript['event_vehicle'] = function(block) {
  // TODO: Assemble JavaScript into code variable for event_vehicle.
  var code = 'event_vehicle();
';
  return code;
};
Blockly.JavaScript['event_weapon'] = function(block) {
  // TODO: Assemble JavaScript into code variable for event_weapon.
  var code = 'event_weapon();
';
  return code;
};
Blockly.JavaScript['factions'] = function(block) {
  // TODO: Assemble JavaScript into code variable for factions.
  var code = 'factions();
';
  return code;
};
Blockly.JavaScript['farthest_player_from'] = function(block) {
  // TODO: Assemble JavaScript into code variable for farthest_player_from.
  var code = 'farthest_player_from();
';
  return code;
};
Blockly.JavaScript['filtered_array'] = function(block) {
  // TODO: Assemble JavaScript into code variable for filtered_array.
  var code = 'filtered_array();
';
  return code;
};
Blockly.JavaScript['first_of'] = function(block) {
  // TODO: Assemble JavaScript into code variable for first_of.
  var code = 'first_of();
';
  return code;
};
Blockly.JavaScript['floor'] = function(block) {
  // TODO: Assemble JavaScript into code variable for floor.
  var code = 'floor();
';
  return code;
};
Blockly.JavaScript['force_all_exit_vehicle'] = function(block) {
  // TODO: Assemble JavaScript into code variable for force_all_exit_vehicle.
  var code = 'force_all_exit_vehicle();
';
  return code;
};
Blockly.JavaScript['force_mandown'] = function(block) {
  // TODO: Assemble JavaScript into code variable for force_mandown.
  var code = 'force_mandown();
';
  return code;
};
Blockly.JavaScript['force_player_exit_vehicle'] = function(block) {
  // TODO: Assemble JavaScript into code variable for force_player_exit_vehicle.
  var code = 'force_player_exit_vehicle();
';
  return code;
};
Blockly.JavaScript['force_player_to_seat'] = function(block) {
  // TODO: Assemble JavaScript into code variable for force_player_to_seat.
  var code = 'force_player_to_seat();
';
  return code;
};
Blockly.JavaScript['force_revive'] = function(block) {
  // TODO: Assemble JavaScript into code variable for force_revive.
  var code = 'force_revive();
';
  return code;
};
Blockly.JavaScript['force_switch_inventory'] = function(block) {
  // TODO: Assemble JavaScript into code variable for force_switch_inventory.
  var code = 'force_switch_inventory();
';
  return code;
};
Blockly.JavaScript['forward_vector'] = function(block) {
  // TODO: Assemble JavaScript into code variable for forward_vector.
  var code = 'forward_vector();
';
  return code;
};
Blockly.JavaScript['get_all_capture_points'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_all_capture_points.
  var code = 'get_all_capture_points();
';
  return code;
};
Blockly.JavaScript['get_all_mcoms'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_all_mcoms.
  var code = 'get_all_mcoms();
';
  return code;
};
Blockly.JavaScript['get_all_players_in_vehicle'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_all_players_in_vehicle.
  var code = 'get_all_players_in_vehicle();
';
  return code;
};
Blockly.JavaScript['get_all_vehicles'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_all_vehicles.
  var code = 'get_all_vehicles();
';
  return code;
};
Blockly.JavaScript['get_capture_point_position'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_capture_point_position.
  var code = 'get_capture_point_position();
';
  return code;
};
Blockly.JavaScript['get_capture_progress'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_capture_progress.
  var code = 'get_capture_progress();
';
  return code;
};
Blockly.JavaScript['get_current_owner_team_id'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_current_owner_team_id.
  var code = 'get_current_owner_team_id();
';
  return code;
};
Blockly.JavaScript['get_game_mode_score'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_game_mode_score.
  var code = 'get_game_mode_score();
';
  return code;
};
Blockly.JavaScript['get_game_mode_target_score'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_game_mode_target_score.
  var code = 'get_game_mode_target_score();
';
  return code;
};
Blockly.JavaScript['get_game_mode_time_elapsed'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_game_mode_time_elapsed.
  var code = 'get_game_mode_time_elapsed();
';
  return code;
};
Blockly.JavaScript['get_game_mode_time_limit'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_game_mode_time_limit.
  var code = 'get_game_mode_time_limit();
';
  return code;
};
Blockly.JavaScript['get_game_mode_time_remaining'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_game_mode_time_remaining.
  var code = 'get_game_mode_time_remaining();
';
  return code;
};
Blockly.JavaScript['get_inventory_ammo'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_inventory_ammo.
  var code = 'get_inventory_ammo();
';
  return code;
};
Blockly.JavaScript['get_inventory_magazine_ammo'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_inventory_magazine_ammo.
  var code = 'get_inventory_magazine_ammo();
';
  return code;
};
Blockly.JavaScript['get_mcom_state'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_mcom_state.
  var code = 'get_mcom_state();
';
  return code;
};
Blockly.JavaScript['get_objective'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_objective.
  var code = 'get_objective();
';
  return code;
};
Blockly.JavaScript['get_owner_progress_team_id'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_owner_progress_team_id.
  var code = 'get_owner_progress_team_id();
';
  return code;
};
Blockly.JavaScript['get_player_deaths'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_player_deaths.
  var code = 'get_player_deaths();
';
  return code;
};
Blockly.JavaScript['get_player_from_vehicle_seat'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_player_from_vehicle_seat.
  var code = 'get_player_from_vehicle_seat();
';
  return code;
};
Blockly.JavaScript['get_player_kills'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_player_kills.
  var code = 'get_player_kills();
';
  return code;
};
Blockly.JavaScript['get_players'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_players.
  var code = 'get_players();
';
  return code;
};
Blockly.JavaScript['get_players_on_point'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_players_on_point.
  var code = 'get_players_on_point();
';
  return code;
};
Blockly.JavaScript['get_player_state'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_player_state.
  var code = 'get_player_state();
';
  return code;
};
Blockly.JavaScript['get_player_vehicle_seat'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_player_vehicle_seat.
  var code = 'get_player_vehicle_seat();
';
  return code;
};
Blockly.JavaScript['get_previous_owner_team_id'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_previous_owner_team_id.
  var code = 'get_previous_owner_team_id();
';
  return code;
};
Blockly.JavaScript['get_remaining_fuse_time'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_remaining_fuse_time.
  var code = 'get_remaining_fuse_time();
';
  return code;
};
Blockly.JavaScript['get_seat_count'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_seat_count.
  var code = 'get_seat_count();
';
  return code;
};
Blockly.JavaScript['get_subroutine_argument'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_subroutine_argument.
  var code = 'get_subroutine_argument();
';
  return code;
};
Blockly.JavaScript['get_team_id'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_team_id.
  var code = 'get_team_id();
';
  return code;
};
Blockly.JavaScript['get_variable'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_variable.
  var code = 'get_variable();
';
  return code;
};
Blockly.JavaScript['get_vehicle_from_player'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_vehicle_from_player.
  var code = 'get_vehicle_from_player();
';
  return code;
};
Blockly.JavaScript['get_vehicle_state'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_vehicle_state.
  var code = 'get_vehicle_state();
';
  return code;
};
Blockly.JavaScript['get_vehicle_team_id'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_vehicle_team_id.
  var code = 'get_vehicle_team_id();
';
  return code;
};
Blockly.JavaScript['get_x_component'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_x_component.
  var code = 'get_x_component();
';
  return code;
};
Blockly.JavaScript['get_y_component'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_y_component.
  var code = 'get_y_component();
';
  return code;
};
Blockly.JavaScript['get_z_component'] = function(block) {
  // TODO: Assemble JavaScript into code variable for get_z_component.
  var code = 'get_z_component();
';
  return code;
};
Blockly.JavaScript['greater_than'] = function(block) {
  // TODO: Assemble JavaScript into code variable for greater_than.
  var code = 'greater_than();
';
  return code;
};
Blockly.JavaScript['greater_than_equal_to'] = function(block) {
  // TODO: Assemble JavaScript into code variable for greater_than_equal_to.
  var code = 'greater_than_equal_to();
';
  return code;
};
Blockly.JavaScript['has_inventory'] = function(block) {
  // TODO: Assemble JavaScript into code variable for has_inventory.
  var code = 'has_inventory();
';
  return code;
};
Blockly.JavaScript['heal'] = function(block) {
  // TODO: Assemble JavaScript into code variable for heal.
  var code = 'heal();
';
  return code;
};
Blockly.JavaScript['if'] = function(block) {
  // TODO: Assemble JavaScript into code variable for if.
  var code = 'if();
';
  return code;
};
Blockly.JavaScript['if_then_else'] = function(block) {
  // TODO: Assemble JavaScript into code variable for if_then_else.
  var code = 'if_then_else();
';
  return code;
};
Blockly.JavaScript['index_of_array_value'] = function(block) {
  // TODO: Assemble JavaScript into code variable for index_of_array_value.
  var code = 'index_of_array_value();
';
  return code;
};
Blockly.JavaScript['input_restrictions'] = function(block) {
  // TODO: Assemble JavaScript into code variable for input_restrictions.
  var code = 'input_restrictions();
';
  return code;
};
Blockly.JavaScript['inventory_character_specialties'] = function(block) {
  // TODO: Assemble JavaScript into code variable for inventory_character_specialties.
  var code = 'inventory_character_specialties();
';
  return code;
};
Blockly.JavaScript['inventory_class_gadgets'] = function(block) {
  // TODO: Assemble JavaScript into code variable for inventory_class_gadgets.
  var code = 'inventory_class_gadgets();
';
  return code;
};
Blockly.JavaScript['inventory_melee_weapons'] = function(block) {
  // TODO: Assemble JavaScript into code variable for inventory_melee_weapons.
  var code = 'inventory_melee_weapons();
';
  return code;
};
Blockly.JavaScript['inventory_open_gadgets'] = function(block) {
  // TODO: Assemble JavaScript into code variable for inventory_open_gadgets.
  var code = 'inventory_open_gadgets();
';
  return code;
};
Blockly.JavaScript['inventory_primary_weapons'] = function(block) {
  // TODO: Assemble JavaScript into code variable for inventory_primary_weapons.
  var code = 'inventory_primary_weapons();
';
  return code;
};
Blockly.JavaScript['inventory_secondary_weapons'] = function(block) {
  // TODO: Assemble JavaScript into code variable for inventory_secondary_weapons.
  var code = 'inventory_secondary_weapons();
';
  return code;
};
Blockly.JavaScript['inventory_throwables'] = function(block) {
  // TODO: Assemble JavaScript into code variable for inventory_throwables.
  var code = 'inventory_throwables();
';
  return code;
};
Blockly.JavaScript['is_current_map'] = function(block) {
  // TODO: Assemble JavaScript into code variable for is_current_map.
  var code = 'is_current_map();
';
  return code;
};
Blockly.JavaScript['is_faction'] = function(block) {
  // TODO: Assemble JavaScript into code variable for is_faction.
  var code = 'is_faction();
';
  return code;
};
Blockly.JavaScript['is_inventory_slot_active'] = function(block) {
  // TODO: Assemble JavaScript into code variable for is_inventory_slot_active.
  var code = 'is_inventory_slot_active();
';
  return code;
};
Blockly.JavaScript['is_killer_weapon'] = function(block) {
  // TODO: Assemble JavaScript into code variable for is_killer_weapon.
  var code = 'is_killer_weapon();
';
  return code;
};
Blockly.JavaScript['is_player_using_soldier'] = function(block) {
  // TODO: Assemble JavaScript into code variable for is_player_using_soldier.
  var code = 'is_player_using_soldier();
';
  return code;
};
Blockly.JavaScript['is_player_valid'] = function(block) {
  // TODO: Assemble JavaScript into code variable for is_player_valid.
  var code = 'is_player_valid();
';
  return code;
};
Blockly.JavaScript['is_true_for_all'] = function(block) {
  // TODO: Assemble JavaScript into code variable for is_true_for_all.
  var code = 'is_true_for_all();
';
  return code;
};
Blockly.JavaScript['is_true_for_any'] = function(block) {
  // TODO: Assemble JavaScript into code variable for is_true_for_any.
  var code = 'is_true_for_any();
';
  return code;
};
Blockly.JavaScript['is_type'] = function(block) {
  // TODO: Assemble JavaScript into code variable for is_type.
  var code = 'is_type();
';
  return code;
};
Blockly.JavaScript['is_vehicle_occupied'] = function(block) {
  // TODO: Assemble JavaScript into code variable for is_vehicle_occupied.
  var code = 'is_vehicle_occupied();
';
  return code;
};
Blockly.JavaScript['is_vehicle_seat_occupied'] = function(block) {
  // TODO: Assemble JavaScript into code variable for is_vehicle_seat_occupied.
  var code = 'is_vehicle_seat_occupied();
';
  return code;
};
Blockly.JavaScript['is_victim_damage_type'] = function(block) {
  // TODO: Assemble JavaScript into code variable for is_victim_damage_type.
  var code = 'is_victim_damage_type();
';
  return code;
};
Blockly.JavaScript['is_victim_death_type'] = function(block) {
  // TODO: Assemble JavaScript into code variable for is_victim_death_type.
  var code = 'is_victim_death_type();
';
  return code;
};
Blockly.JavaScript['kill'] = function(block) {
  // TODO: Assemble JavaScript into code variable for kill.
  var code = 'kill();
';
  return code;
};
Blockly.JavaScript['last_of'] = function(block) {
  // TODO: Assemble JavaScript into code variable for last_of.
  var code = 'last_of();
';
  return code;
};
Blockly.JavaScript['left_vector'] = function(block) {
  // TODO: Assemble JavaScript into code variable for left_vector.
  var code = 'left_vector();
';
  return code;
};
Blockly.JavaScript['less_than'] = function(block) {
  // TODO: Assemble JavaScript into code variable for less_than.
  var code = 'less_than();
';
  return code;
};
Blockly.JavaScript['less_than_equal_to'] = function(block) {
  // TODO: Assemble JavaScript into code variable for less_than_equal_to.
  var code = 'less_than_equal_to();
';
  return code;
};
Blockly.JavaScript['local_to_world_position'] = function(block) {
  // TODO: Assemble JavaScript into code variable for local_to_world_position.
  var code = 'local_to_world_position();
';
  return code;
};
Blockly.JavaScript['local_to_world_vector'] = function(block) {
  // TODO: Assemble JavaScript into code variable for local_to_world_vector.
  var code = 'local_to_world_vector();
';
  return code;
};
Blockly.JavaScript['locational_sounds'] = function(block) {
  // TODO: Assemble JavaScript into code variable for locational_sounds.
  var code = 'locational_sounds();
';
  return code;
};
Blockly.JavaScript['loop_variable'] = function(block) {
  // TODO: Assemble JavaScript into code variable for loop_variable.
  var code = 'loop_variable();
';
  return code;
};
Blockly.JavaScript['mapped_array'] = function(block) {
  // TODO: Assemble JavaScript into code variable for mapped_array.
  var code = 'mapped_array();
';
  return code;
};
Blockly.JavaScript['maps'] = function(block) {
  // TODO: Assemble JavaScript into code variable for maps.
  var code = 'maps();
';
  return code;
};
Blockly.JavaScript['max'] = function(block) {
  // TODO: Assemble JavaScript into code variable for max.
  var code = 'max();
';
  return code;
};
Blockly.JavaScript['mcom_state_bool'] = function(block) {
  // TODO: Assemble JavaScript into code variable for mcom_state_bool.
  var code = 'mcom_state_bool();
';
  return code;
};
Blockly.JavaScript['mcoms'] = function(block) {
  // TODO: Assemble JavaScript into code variable for mcoms.
  var code = 'mcoms();
';
  return code;
};
Blockly.JavaScript['med_gadget_types'] = function(block) {
  // TODO: Assemble JavaScript into code variable for med_gadget_types.
  var code = 'med_gadget_types();
';
  return code;
};
Blockly.JavaScript['message'] = function(block) {
  // TODO: Assemble JavaScript into code variable for message.
  var code = 'message();
';
  return code;
};
Blockly.JavaScript['mod'] = function(block) {
  // TODO: Assemble JavaScript into code variable for mod.
  var code = 'mod();
';
  return code;
};
Blockly.JavaScript['modulo'] = function(block) {
  // TODO: Assemble JavaScript into code variable for modulo.
  var code = 'modulo();
';
  return code;
};
Blockly.JavaScript['multiply'] = function(block) {
  // TODO: Assemble JavaScript into code variable for multiply.
  var code = 'multiply();
';
  return code;
};
Blockly.JavaScript['normalize'] = function(block) {
  // TODO: Assemble JavaScript into code variable for normalize.
  var code = 'normalize();
';
  return code;
};
Blockly.JavaScript['not'] = function(block) {
  // TODO: Assemble JavaScript into code variable for not.
  var code = 'not();
';
  return code;
};
Blockly.JavaScript['not_equal_to'] = function(block) {
  // TODO: Assemble JavaScript into code variable for not_equal_to.
  var code = 'not_equal_to();
';
  return code;
};
Blockly.JavaScript['number'] = function(block) {
  // TODO: Assemble JavaScript into code variable for number.
  var code = 'number();
';
  return code;
};
Blockly.JavaScript['or'] = function(block) {
  // TODO: Assemble JavaScript into code variable for or.
  var code = 'or();
';
  return code;
};
Blockly.JavaScript['pause_game_mode_time'] = function(block) {
  // TODO: Assemble JavaScript into code variable for pause_game_mode_time.
  var code = 'pause_game_mode_time();
';
  return code;
};
Blockly.JavaScript['pi'] = function(block) {
  // TODO: Assemble JavaScript into code variable for pi.
  var code = 'pi();
';
  return code;
};
Blockly.JavaScript['player_inventory_slots'] = function(block) {
  // TODO: Assemble JavaScript into code variable for player_inventory_slots.
  var code = 'player_inventory_slots();
';
  return code;
};
Blockly.JavaScript['player_soldiers'] = function(block) {
  // TODO: Assemble JavaScript into code variable for player_soldiers.
  var code = 'player_soldiers();
';
  return code;
};
Blockly.JavaScript['player_state_bool'] = function(block) {
  // TODO: Assemble JavaScript into code variable for player_state_bool.
  var code = 'player_state_bool();
';
  return code;
};
Blockly.JavaScript['player_state_number'] = function(block) {
  // TODO: Assemble JavaScript into code variable for player_state_number.
  var code = 'player_state_number();
';
  return code;
};
Blockly.JavaScript['player_state_vector'] = function(block) {
  // TODO: Assemble JavaScript into code variable for player_state_vector.
  var code = 'player_state_vector();
';
  return code;
};
Blockly.JavaScript['radians_to_degrees'] = function(block) {
  // TODO: Assemble JavaScript into code variable for radians_to_degrees.
  var code = 'radians_to_degrees();
';
  return code;
};
Blockly.JavaScript['raise_to_power'] = function(block) {
  // TODO: Assemble JavaScript into code variable for raise_to_power.
  var code = 'raise_to_power();
';
  return code;
};
Blockly.JavaScript['randomized_array'] = function(block) {
  // TODO: Assemble JavaScript into code variable for randomized_array.
  var code = 'randomized_array();
';
  return code;
};
Blockly.JavaScript['random_value_in_array'] = function(block) {
  // TODO: Assemble JavaScript into code variable for random_value_in_array.
  var code = 'random_value_in_array();
';
  return code;
};
Blockly.JavaScript['random_real'] = function(block) {
  // TODO: Assemble JavaScript into code variable for random_real.
  var code = 'random_real();
';
  return code;
};
Blockly.JavaScript['remove_from_array'] = function(block) {
  // TODO: Assemble JavaScript into code variable for remove_from_array.
  var code = 'remove_from_array();
';
  return code;
};
Blockly.JavaScript['remove_player_inventory'] = function(block) {
  // TODO: Assemble JavaScript into code variable for remove_player_inventory.
  var code = 'remove_player_inventory();
';
  return code;
};
Blockly.JavaScript['remove_player_inventory_at_slot'] = function(block) {
  // TODO: Assemble JavaScript into code variable for remove_player_inventory_at_slot.
  var code = 'remove_player_inventory_at_slot();
';
  return code;
};
Blockly.JavaScript['repair_vehicle'] = function(block) {
  // TODO: Assemble JavaScript into code variable for repair_vehicle.
  var code = 'repair_vehicle();
';
  return code;
};
Blockly.JavaScript['replace_player_inventory'] = function(block) {
  // TODO: Assemble JavaScript into code variable for replace_player_inventory.
  var code = 'replace_player_inventory();
';
  return code;
};
Blockly.JavaScript['reset_game_mode_time'] = function(block) {
  // TODO: Assemble JavaScript into code variable for reset_game_mode_time.
  var code = 'reset_game_mode_time();
';
  return code;
};
Blockly.JavaScript['resupply'] = function(block) {
  // TODO: Assemble JavaScript into code variable for resupply.
  var code = 'resupply();
';
  return code;
};
Blockly.JavaScript['resupply_types'] = function(block) {
  // TODO: Assemble JavaScript into code variable for resupply_types.
  var code = 'resupply_types();
';
  return code;
};
Blockly.JavaScript['right_vector'] = function(block) {
  // TODO: Assemble JavaScript into code variable for right_vector.
  var code = 'right_vector();
';
  return code;
};
Blockly.JavaScript['round_to_integer'] = function(block) {
  // TODO: Assemble JavaScript into code variable for round_to_integer.
  var code = 'round_to_integer();
';
  return code;
};
Blockly.JavaScript['rule'] = function(block) {
  // TODO: Assemble JavaScript into code variable for rule.
  var code = 'rule();
';
  return code;
};
Blockly.JavaScript['send_error_report'] = function(block) {
  // TODO: Assemble JavaScript into code variable for send_error_report.
  var code = 'send_error_report();
';
  return code;
};
Blockly.JavaScript['set_capture_multiplier'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_capture_multiplier.
  var code = 'set_capture_multiplier();
';
  return code;
};
Blockly.JavaScript['set_game_mode_score'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_game_mode_score.
  var code = 'set_game_mode_score();
';
  return code;
};
Blockly.JavaScript['set_game_mode_target_score'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_game_mode_target_score.
  var code = 'set_game_mode_target_score();
';
  return code;
};
Blockly.JavaScript['set_game_mode_time_limit'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_game_mode_time_limit.
  var code = 'set_game_mode_time_limit();
';
  return code;
};
Blockly.JavaScript['set_inventory_ammo'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_inventory_ammo.
  var code = 'set_inventory_ammo();
';
  return code;
};
Blockly.JavaScript['set_inventory_magazine_ammo'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_inventory_magazine_ammo.
  var code = 'set_inventory_magazine_ammo();
';
  return code;
};
Blockly.JavaScript['set_mcom_fuse_time'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_mcom_fuse_time.
  var code = 'set_mcom_fuse_time();
';
  return code;
};
Blockly.JavaScript['set_neutralization_time_multiplier'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_neutralization_time_multiplier.
  var code = 'set_neutralization_time_multiplier();
';
  return code;
};
Blockly.JavaScript['set_objective_owner'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_objective_owner.
  var code = 'set_objective_owner();
';
  return code;
};
Blockly.JavaScript['set_player_max_health'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_player_max_health.
  var code = 'set_player_max_health();
';
  return code;
};
Blockly.JavaScript['set_player_soldier'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_player_soldier.
  var code = 'set_player_soldier();
';
  return code;
};
Blockly.JavaScript['set_redeploy_time'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_redeploy_time.
  var code = 'set_redeploy_time();
';
  return code;
};
Blockly.JavaScript['set_team_id'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_team_id.
  var code = 'set_team_id();
';
  return code;
};
Blockly.JavaScript['set_variable'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_variable.
  var code = 'set_variable();
';
  return code;
};
Blockly.JavaScript['set_variable_at_index'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_variable_at_index.
  var code = 'set_variable_at_index();
';
  return code;
};
Blockly.JavaScript['set_vehicle_max_health_multiplier'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_vehicle_max_health_multiplier.
  var code = 'set_vehicle_max_health_multiplier();
';
  return code;
};
Blockly.JavaScript['set_world_icon_image'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_world_icon_image.
  var code = 'set_world_icon_image();
';
  return code;
};
Blockly.JavaScript['set_world_icon_owner'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_world_icon_owner.
  var code = 'set_world_icon_owner();
';
  return code;
};
Blockly.JavaScript['set_world_icon_position'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_world_icon_position.
  var code = 'set_world_icon_position();
';
  return code;
};
Blockly.JavaScript['set_world_icon_text'] = function(block) {
  // TODO: Assemble JavaScript into code variable for set_world_icon_text.
  var code = 'set_world_icon_text();
';
  return code;
};
Blockly.JavaScript['sine_from_degrees'] = function(block) {
  // TODO: Assemble JavaScript into code variable for sine_from_degrees.
  var code = 'sine_from_degrees();
';
  return code;
};
Blockly.JavaScript['sine_from_radians'] = function(block) {
  // TODO: Assemble JavaScript into code variable for sine_from_radians.
  var code = 'sine_from_radians();
';
  return code;
};
Blockly.JavaScript['skip'] = function(block) {
  // TODO: Assemble JavaScript into code variable for skip.
  var code = 'skip();
';
  return code;
};
Blockly.JavaScript['skip_if'] = function(block) {
  // TODO: Assemble JavaScript into code variable for skip_if.
  var code = 'skip_if();
';
  return code;
};
Blockly.JavaScript['skip_mandown'] = function(block) {
  // TODO: Assemble JavaScript into code variable for skip_mandown.
  var code = 'skip_mandown();
';
  return code;
};
Blockly.JavaScript['sorted_array'] = function(block) {
  // TODO: Assemble JavaScript into code variable for sorted_array.
  var code = 'sorted_array();
';
  return code;
};
Blockly.JavaScript['sounds'] = function(block) {
  // TODO: Assemble JavaScript into code variable for sounds.
  var code = 'sounds();
';
  return code;
};
Blockly.JavaScript['spot_target'] = function(block) {
  // TODO: Assemble JavaScript into code variable for spot_target.
  var code = 'spot_target();
';
  return code;
};
Blockly.JavaScript['spot_target_for_player'] = function(block) {
  // TODO: Assemble JavaScript into code variable for spot_target_for_player.
  var code = 'spot_target_for_player();
';
  return code;
};
Blockly.JavaScript['square_root'] = function(block) {
  // TODO: Assemble JavaScript into code variable for square_root.
  var code = 'square_root();
';
  return code;
};
Blockly.JavaScript['stop_tracking_variable'] = function(block) {
  // TODO: Assemble JavaScript into code variable for stop_tracking_variable.
  var code = 'stop_tracking_variable();
';
  return code;
};
Blockly.JavaScript['string'] = function(block) {
  // TODO: Assemble JavaScript into code variable for string.
  var code = 'string();
';
  return code;
};
Blockly.JavaScript['subroutine'] = function(block) {
  // TODO: Assemble JavaScript into code variable for subroutine.
  var code = 'subroutine();
';
  return code;
};
Blockly.JavaScript['subroutine_instance'] = function(block) {
  // TODO: Assemble JavaScript into code variable for subroutine_instance.
  var code = 'subroutine_instance();
';
  return code;
};
Blockly.JavaScript['subtract'] = function(block) {
  // TODO: Assemble JavaScript into code variable for subtract.
  var code = 'subtract();
';
  return code;
};
Blockly.JavaScript['tangent_from_degrees'] = function(block) {
  // TODO: Assemble JavaScript into code variable for tangent_from_degrees.
  var code = 'tangent_from_degrees();
';
  return code;
};
Blockly.JavaScript['tangent_from_radians'] = function(block) {
  // TODO: Assemble JavaScript into code variable for tangent_from_radians.
  var code = 'tangent_from_radians();
';
  return code;
};
Blockly.JavaScript['teleport'] = function(block) {
  // TODO: Assemble JavaScript into code variable for teleport.
  var code = 'teleport();
';
  return code;
};
Blockly.JavaScript['track_variable_at_rate'] = function(block) {
  // TODO: Assemble JavaScript into code variable for track_variable_at_rate.
  var code = 'track_variable_at_rate();
';
  return code;
};
Blockly.JavaScript['track_variable_over_time'] = function(block) {
  // TODO: Assemble JavaScript into code variable for track_variable_over_time.
  var code = 'track_variable_over_time();
';
  return code;
};
Blockly.JavaScript['trigger_audio'] = function(block) {
  // TODO: Assemble JavaScript into code variable for trigger_audio.
  var code = 'trigger_audio();
';
  return code;
};
Blockly.JavaScript['trigger_audio_at_location'] = function(block) {
  // TODO: Assemble JavaScript into code variable for trigger_audio_at_location.
  var code = 'trigger_audio_at_location();
';
  return code;
};
Blockly.JavaScript['types'] = function(block) {
  // TODO: Assemble JavaScript into code variable for types.
  var code = 'types();
';
  return code;
};
Blockly.JavaScript['undeploy_all_players'] = function(block) {
  // TODO: Assemble JavaScript into code variable for undeploy_all_players.
  var code = 'undeploy_all_players();
';
  return code;
};
Blockly.JavaScript['undeploy_player'] = function(block) {
  // TODO: Assemble JavaScript into code variable for undeploy_player.
  var code = 'undeploy_player();
';
  return code;
};
Blockly.JavaScript['unspot_target'] = function(block) {
  // TODO: Assemble JavaScript into code variable for unspot_target.
  var code = 'unspot_target();
';
  return code;
};
Blockly.JavaScript['up_vector'] = function(block) {
  // TODO: Assemble JavaScript into code variable for up_vector.
  var code = 'up_vector();
';
  return code;
};
Blockly.JavaScript['value_in_array'] = function(block) {
  // TODO: Assemble JavaScript into code variable for value_in_array.
  var code = 'value_in_array();
';
  return code;
};
Blockly.JavaScript['variable'] = function(block) {
  // TODO: Assemble JavaScript into code variable for variable.
  var code = 'variable();
';
  return code;
};
Blockly.JavaScript['vector_towards'] = function(block) {
  // TODO: Assemble JavaScript into code variable for vector_towards.
  var code = 'vector_towards();
';
  return code;
};
Blockly.JavaScript['vehicles'] = function(block) {
  // TODO: Assemble JavaScript into code variable for vehicles.
  var code = 'vehicles();
';
  return code;
};
Blockly.JavaScript['vehicle_state_vector'] = function(block) {
  // TODO: Assemble JavaScript into code variable for vehicle_state_vector.
  var code = 'vehicle_state_vector();
';
  return code;
};
Blockly.JavaScript['vehicle_types_item'] = function(block) {
  // TODO: Assemble JavaScript into code variable for vehicle_types_item.
  var code = 'vehicle_types_item();
';
  return code;
};
Blockly.JavaScript['voice_overs'] = function(block) {
  // TODO: Assemble JavaScript into code variable for voice_overs.
  var code = 'voice_overs();
';
  return code;
};
Blockly.JavaScript['wait'] = function(block) {
  // TODO: Assemble JavaScript into code variable for wait.
  var code = 'wait();
';
  return code;
};
Blockly.JavaScript['wait_until'] = function(block) {
  // TODO: Assemble JavaScript into code variable for wait_until.
  var code = 'wait_until();
';
  return code;
};
Blockly.JavaScript['while'] = function(block) {
  // TODO: Assemble JavaScript into code variable for while.
  var code = 'while();
';
  return code;
};
Blockly.JavaScript['world_icon_images'] = function(block) {
  // TODO: Assemble JavaScript into code variable for world_icon_images.
  var code = 'world_icon_images();
';
  return code;
};
Blockly.JavaScript['world_icons'] = function(block) {
  // TODO: Assemble JavaScript into code variable for world_icons.
  var code = 'world_icons();
';
  return code;
};
Blockly.JavaScript['world_to_local_position'] = function(block) {
  // TODO: Assemble JavaScript into code variable for world_to_local_position.
  var code = 'world_to_local_position();
';
  return code;
};
Blockly.JavaScript['world_to_local_vector'] = function(block) {
  // TODO: Assemble JavaScript into code variable for world_to_local_vector.
  var code = 'world_to_local_vector();
';
  return code;
};
Blockly.JavaScript['xor'] = function(block) {
  // TODO: Assemble JavaScript into code variable for xor.
  var code = 'xor();
';
  return code;
};
