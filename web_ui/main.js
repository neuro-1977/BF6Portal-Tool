const bf6_theme = Blockly.Theme.defineTheme('bf6_theme', {
    'base': Blockly.Themes.Dark,
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
        'control_actions_category': { 'colour': '#A285E6' },
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
        'cursorColour': '#d0d0d0',
        'blackBackground': '#333'
    }
});

var workspace = Blockly.inject('blocklyDiv',
    {
        toolbox: TOOLBOX_CONFIG,
        theme: bf6_theme,
        grid: {
            spacing: 20,
            length: 20,
            colour: '#444',
            snap: true
        },
        zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
        },
        trashcan: true
    });