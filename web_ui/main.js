// Main Entry Point for BF6 Portal Tool
// This file handles the initialization of the UI, Blockly, and event listeners.

document.addEventListener('DOMContentLoaded', () => {
    console.log("[BF6] DOM Loaded. Initializing...");

    setupTicker();
    setupAboutModal();

    // Prefer the simple injection path for stability.
    // If you want to switch back to StartupSequence later, you can.
    fallbackInjection();

    // Initialize Button Listeners
    setupButtonListeners();
});

function setupButtonListeners() {
    console.log("[BF6] Setting up button listeners...");

    const btnMap = {
        'aboutBtn': () => openAboutModal(),
        'loadBtn': () => {
            const input = document.getElementById('loadInput');
            if (input) input.click();
        },
        'saveBtn': () => saveWorkspace(),
        'exportTsBtn': () => exportToTypeScript(),
        'closeAboutModal': () => {
            closeAboutModal();
        }
    };

    for (const [id, handler] of Object.entries(btnMap)) {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', handler);
        }
    }

    // Load Input Listener
    const loadInput = document.getElementById('loadInput');
    if (loadInput) {
        loadInput.addEventListener('change', handleFileUpload);
    }
}

function setupAboutModal() {
    const modal = document.getElementById('aboutModal');
    if (!modal) return;

    // Close when clicking the dimmed backdrop (but not when clicking inside the modal content).
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeAboutModal();
        }
    });

    // Close on Escape.
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display !== 'none') {
            closeAboutModal();
        }
    });
}

function openAboutModal() {
    const modal = document.getElementById('aboutModal');
    if (!modal) return;
    modal.style.display = 'flex';
}

function closeAboutModal() {
    const modal = document.getElementById('aboutModal');
    if (!modal) return;
    modal.style.display = 'none';
}

function setupTicker() {
    const tickerEl = document.getElementById('tickerText');

    const text = 'ticker text... ticker text scrolling.... ticker text';

    if (tickerEl) tickerEl.textContent = text;

    const aboutTickerEl = document.getElementById('aboutTickerText');
    if (aboutTickerEl) aboutTickerEl.textContent = text;
}

function normalizeToolboxConfig(toolbox) {
    try {
        if (!toolbox || toolbox.kind !== 'categoryToolbox' || !Array.isArray(toolbox.contents)) return toolbox;

        // If the toolbox has a wrapper category like "BF6 Portal", flatten it so BF6 categories are the main menus.
        const bf6Wrapper = toolbox.contents.find(
            (c) => c && c.kind === 'category' && typeof c.name === 'string' && c.name.toLowerCase() === 'bf6 portal'
        );

        if (bf6Wrapper && Array.isArray(bf6Wrapper.contents)) {
            return {
                kind: 'categoryToolbox',
                contents: bf6Wrapper.contents
            };
        }

        // Otherwise, at least remove an outer "Home" wrapper if present.
        return {
            kind: 'categoryToolbox',
            contents: toolbox.contents.filter(
                (c) => !(c && c.kind === 'category' && typeof c.name === 'string' && c.name.toLowerCase() === 'home')
            )
        };
    } catch (e) {
        console.warn('[BF6] normalizeToolboxConfig failed; using original toolbox:', e);
        return toolbox;
    }
}

function fallbackInjection() {
    console.log("[BF6] Running Fallback Injection...");

    if (typeof Blockly === 'undefined') {
        console.error('[BF6] Blockly is not available on window.');
        alert('Blockly failed to load. See console for details.');
        return;
    }

    const blocklyDiv = document.getElementById('blocklyDiv');
    if (!blocklyDiv) {
        console.error("[BF6] blocklyDiv not found!");
        return;
    }

    // Ensure div is visible and has height
    blocklyDiv.style.display = 'block';
    blocklyDiv.style.height = 'calc(100vh - 48px)'; // Explicit height (viewport - header)

    // Check TOOLBOX_CONFIG
    let toolbox = null;
    if (typeof TOOLBOX_CONFIG !== 'undefined') {
        toolbox = normalizeToolboxConfig(TOOLBOX_CONFIG);
    } else {
        console.error("[BF6] TOOLBOX_CONFIG is undefined! Using emergency fallback.");
        toolbox = {
            "kind": "categoryToolbox",
            "contents": [
                {
                    "kind": "category",
                    "name": "Error: Missing Toolbox",
                    "colour": "#FF0000",
                    "contents": []
                }
            ]
        };
    }

    // Define Theme
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
            'subroutine_category': { 'colour': '#E6A85C' },
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

    // Inject
    try {
        window.workspace = Blockly.inject('blocklyDiv', {
            toolbox,
            theme: bf6_theme,
            grid: {
                spacing: 20,
                length: 6,
                colour: '#3f4a52',
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
        console.log("[BF6] Blockly injected successfully.");

        const toolboxEl = document.querySelector('.blocklyToolbox') || document.querySelector('.blocklyToolboxDiv');
        if (!toolboxEl) {
            console.warn('[BF6] Blockly workspace injected, but no toolbox element was found (.blocklyToolbox/.blocklyToolboxDiv). Toolbox may not be rendering.');
        }

        setTimeout(() => {
            Blockly.svgResize(window.workspace);
        }, 100);
    } catch (e) {
        console.error("[BF6] Blockly injection failed:", e);
    }
}

function saveWorkspace() {
    if (!window.workspace) return;
    const xml = Blockly.Xml.workspaceToDom(window.workspace);
    const xmlText = Blockly.Xml.domToPrettyText(xml);
    const blob = new Blob([xmlText], {type: 'text/xml'});
    const a = document.createElement('a');
    a.download = 'bf6_portal_rules.xml';
    a.href = URL.createObjectURL(blob);
    a.click();
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        const xmlText = e.target.result;
        if (window.workspace) {
            const xml = Blockly.Xml.textToDom(xmlText);
            window.workspace.clear();
            Blockly.Xml.domToWorkspace(xml, window.workspace);
        }
    };
    reader.readAsText(file);
}

function exportToTypeScript() {
    alert("Export to TypeScript feature coming soon!");
}
