
import * as Blockly from 'blockly';
import DarkTheme from '@blockly/theme-dark';

export const bf6Theme = Blockly.Theme.defineTheme('bf6_theme', {
  'name': 'bf6_theme',
  'base': DarkTheme,
  'categoryStyles': {
    'rules_category': { 'colour': '#A285E6' },
    'ai_category': { 'colour': '#B5A045' },
    'arrays_category': { 'colour': '#B5A045' },
    'audio_category': { 'colour': '#B5A045' },
    'camera_category': { 'colour': '#B5A045' },
    'effects_category': { 'colour': '#B5A045' },
    'emplacements_category': { 'colour': '#B5A045' },
    'gameplay_category': { 'colour': '#B5A045' },
    'logic_category': { 'colour': '#B5A045' },
    'objective_category': { 'colour': '#B5A045' },
    'other_category': { 'colour': '#B5A045' },
    'player_category': { 'colour': '#B5A045' },
    'transform_category': { 'colour': '#B5A045' },
    'ui_category': { 'colour': '#B5A045' },
    'vehicles_category': { 'colour': '#B5A045' },
    'selection_lists_category': { 'colour': '#45B5B5' },
    'literals_category': { 'colour': '#45B5B5' },
    'subroutines_category': { 'colour': '#E6A85C' },
    // Control actions should be blue.
    'control_actions_category': { 'colour': '#0288D1' },
    'loop_category': { 'colour': '#5CA65C' },
    'math_category': { 'colour': '#5C68A6' },
    'text_category': { 'colour': '#5CA68D' },
    'list_category': { 'colour': '#745CA6' },
    'colour_category': { 'colour': '#A65C81' },
    'variable_category': { 'colour': '#A65C5C' },
    'procedure_category': { 'colour': '#995CA6' },
    'actions_category': { 'colour': '#F9A825' },
    'conditions_category': { 'colour': '#5C81A6' },
    'events_category': { 'colour': '#5CA65C' },
    'mod_category': { 'colour': '#995CA6' },
    'variables_category': { 'colour': '#A65C5C' },
  },
  'componentStyles': {
    'workspaceBackgroundColour': '#2b2b2b',
    'toolboxBackgroundColour': '#333333',
    'toolboxForegroundColour': '#fff',
    'flyoutBackgroundColour': '#252526',
    'flyoutForegroundColour': '#ccc',
    'flyoutOpacity': 1,
    'scrollbarColour': '#797979',
    'insertionMarkerColour': '#fff',
    'insertionMarkerOpacity': 0.3,
    'scrollbarOpacity': 0.4,
    'cursorColour': '#d0d0d0'
  }
});
