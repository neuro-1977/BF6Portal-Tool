class ErrorManager {
    constructor() {
        this.errorContainer = document.createElement('div');
        this.errorContainer.id = 'error-container';
        this.errorContainer.style.position = 'fixed';
        this.errorContainer.style.top = '20px';
        this.errorContainer.style.right = '20px';
        this.errorContainer.style.zIndex = '9999';
        document.body.appendChild(this.errorContainer);
    }

    showError(title, message, severity = 'error') {
        console.error(`[${severity.toUpperCase()}] ${title}: ${message}`);

        const errorToast = document.createElement('div');
        errorToast.style.backgroundColor = severity === 'error' ? '#d32f2f' : '#fbc02d';
        errorToast.style.color = '#fff';
        errorToast.style.padding = '15px';
        errorToast.style.marginBottom = '10px';
        errorToast.style.borderRadius = '4px';
        errorToast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        errorToast.style.minWidth = '300px';
        errorToast.style.fontFamily = 'sans-serif';
        errorToast.style.opacity = '0';
        errorToast.style.transition = 'opacity 0.3s ease-in-out';

        const titleEl = document.createElement('strong');
        titleEl.textContent = title;
        titleEl.style.display = 'block';
        titleEl.style.marginBottom = '5px';

        const msgEl = document.createElement('div');
        msgEl.textContent = message;

        errorToast.appendChild(titleEl);
        errorToast.appendChild(msgEl);

        this.errorContainer.appendChild(errorToast);

        // Fade in
        requestAnimationFrame(() => {
            errorToast.style.opacity = '1';
        });

        // Auto dismiss after 5 seconds
        setTimeout(() => {
            errorToast.style.opacity = '0';
            setTimeout(() => {
                if (errorToast.parentNode) {
                    errorToast.parentNode.removeChild(errorToast);
                }
            }, 300);
        }, 5000);
    }
}

class StartupSequence {
    constructor() {
        this.errorManager = new ErrorManager();
        this.steps = [
            this.stepInitializeUI.bind(this),
            this.stepLoadBlocks.bind(this),
            this.stepInjectBlockly.bind(this)
        ];
    }

    async start() {
        console.log("Starting Startup Sequence...");
        try {
            for (const step of this.steps) {
                await step();
            }
            console.log("Startup Sequence Completed Successfully.");
        } catch (error) {
            this.errorManager.showError("Startup Error", error.message);
            console.error("Startup Sequence Failed:", error);
        }
    }

    async stepInitializeUI() {
        console.log("Step: Initialize UI");
        const header = document.getElementById('header');
        if (!header) {
            throw new Error("Header element not found.");
        }
    }

    async stepLoadBlocks() {
        console.log("Step: Load Blocks");
        if (typeof Blockly === 'undefined') {
            throw new Error("Blockly library not loaded.");
        }
        if (typeof TOOLBOX_CONFIG === 'undefined') {
            throw new Error("Toolbox configuration not loaded.");
        }
    }

    async stepInjectBlockly() {
        console.log("Step: Inject Blockly");
        const blocklyDiv = document.getElementById('blocklyDiv');
        if (!blocklyDiv) {
            throw new Error("blocklyDiv element not found.");
        }

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

        window.workspace = Blockly.inject('blocklyDiv', {
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
    }
}
