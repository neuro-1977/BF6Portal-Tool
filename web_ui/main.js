// Main Entry Point for BF6 Portal Tool
// This file handles the initialization of the UI, Blockly, and event listeners.

// IMPORTANT: This file may run before Blockly is loaded (it is included before the webpack bundle).
// If code references the identifier `Blockly` before it exists, JavaScript throws a ReferenceError
// (even with optional chaining like `Blockly?.ContextMenuRegistry`). Declaring it here ensures the
// binding exists and will be populated later via `window.Blockly = ...`.
// eslint-disable-next-line no-var
var Blockly;

document.addEventListener('DOMContentLoaded', () => {
    const isModernBundleActive = !!(window && window.__BF6_MODERN_BUNDLE_ACTIVE__);

    // Always keep harmless UI helpers working.
    try { setupAboutQuotes().catch((e) => console.warn('[BF6] setupAboutQuotes failed:', e)); } catch {}
    try { setupAboutModal(); } catch {}
    try { setupCodePreviewDrawer(); } catch {}
    try { setupVersionLabel(); } catch {}

    // If the modern webpack bundle is active, do NOT run legacy Blockly init/bindings.
    // These can conflict with the webpack workspace (duplicate listeners, block overwrites,
    // preset import/export mismatches, toolbox/flyout glitches).
    if (isModernBundleActive) {
        console.log('[BF6] DOM Loaded (legacy shim). Modern bundle active; skipping legacy init.');
        try { initLiveCodePreview(); } catch { /* ignore */ }
        return;
    }

    console.log("[BF6] DOM Loaded. Initializing...");

    // Prefer the simple injection path for stability.
    // If you want to switch back to StartupSequence later, you can.
    // fallbackInjection();

    // Initialize Button Listeners
    setupButtonListeners();

    // Selection lists (Portal enums) for dropdown blocks.
    // This runs on the legacy (script-tag) Blockly instance, so it works even if
    // the webpack bundle fails to initialize for any reason.
    try {
        registerLegacySelectionListDropdown();
        // Best-effort preload so dropdowns are ready when users open them.
        void preloadLegacySelectionLists();
    } catch (e) {
        console.warn('[BF6] Selection lists init failed:', e);
    }
});

// Legacy selection list init stubs.
// The selection list system was moved into the webpack bundle (`src/selection_lists.ts`).
// Keep these as no-ops so older boot code doesn't spam the console.
function registerLegacySelectionListDropdown() {
    // no-op
}

async function preloadLegacySelectionLists() {
    // no-op
}

function getActiveWorkspace() {
    return window.workspace || null;
}

function zoomWorkspaceStep(step) {
    try {
        const ws = getActiveWorkspace();
        if (!ws || typeof ws.zoomCenter !== 'function') return;
        ws.zoomCenter(Number(step) || 0);
    } catch {
        // ignore
    }
}

function resetWorkspaceZoom() {
    try {
        const ws = getActiveWorkspace();
        if (!ws) return;

        // Match Blockly's zoom reset behavior (startScale) as closely as possible.
        const startScale = (ws.options && ws.options.zoomOptions && typeof ws.options.zoomOptions.startScale === 'number')
            ? ws.options.zoomOptions.startScale
            : 1;
        const scaleSpeed = (ws.options && ws.options.zoomOptions && typeof ws.options.zoomOptions.scaleSpeed === 'number')
            ? ws.options.zoomOptions.scaleSpeed
            : 1.2;

        if (typeof ws.zoomCenter === 'function' && typeof ws.scale === 'number' && ws.scale > 0 && scaleSpeed > 0 && scaleSpeed !== 1) {
            const steps = Math.log(startScale / ws.scale) / Math.log(scaleSpeed);
            if (Number.isFinite(steps) && Math.abs(steps) > 1e-9) {
                ws.zoomCenter(steps);
            } else if (typeof ws.setScale === 'function') {
                ws.setScale(startScale);
            }
        } else if (typeof ws.setScale === 'function') {
            ws.setScale(startScale);
        }

        try {
            if (typeof ws.scrollCenter === 'function') ws.scrollCenter();
        } catch {
            // ignore
        }
    } catch {
        // ignore
    }
}

function zoomToFitWorkspace() {
    try {
        const ws = getActiveWorkspace();
        if (!ws) return;
        if (typeof ws.zoomToFit === 'function') ws.zoomToFit();
    } catch {
        // ignore
    }
}

function deleteSelectedBlock() {
    try {
        const ws = getActiveWorkspace();
        if (!ws) return;

        let selected = null;
        if (typeof ws.getSelected === 'function') {
            selected = ws.getSelected();
        } else if (typeof Blockly !== 'undefined' && Blockly && typeof Blockly.getSelected === 'function') {
            selected = Blockly.getSelected();
        }

        if (selected && typeof selected.dispose === 'function') {
            selected.dispose(true);
        }
    } catch {
        // ignore
    }
}

function setupVersionLabel() {
    const el = document.getElementById('appVersionLabel');
    if (!el) return;

    const v = getAppVersion();
    if (!v) return;
    el.textContent = `v${v}`;
}

function getAppVersion() {
    try {
        const req = (typeof window !== 'undefined' && window.require) ? window.require : (typeof require === 'function' ? require : null);
        if (!req) return null;
        const fs = req('fs');
        const path = req('path');
        const { fileURLToPath } = req('url');

        const here = fileURLToPath(window.location.href);
        const baseDir = path.dirname(here);

        // App loads from either:
        // - dev: <root>/web_ui/dist/index.html
        // - packaged: <...>/resources/app.asar/web_ui/dist/index.html
        // package.json is typically at:
        // - dev: <root>/package.json
        // - packaged: <...>/resources/app.asar/package.json
        const candidates = [
            path.resolve(baseDir, '..', '..', 'package.json'),       // packaged (app.asar)
            path.resolve(baseDir, '..', '..', '..', 'package.json'), // dev
            path.resolve(baseDir, 'package.json'),
        ];

        let raw = null;
        for (const p of candidates) {
            try {
                if (fs.existsSync(p)) {
                    raw = fs.readFileSync(p, 'utf8');
                    break;
                }
            } catch {
                // ignore
            }
        }
        if (!raw) return null;
        const pkg = JSON.parse(raw);
        return pkg && pkg.version ? String(pkg.version) : null;
    } catch {
        return null;
    }
}

function ensureCriticalPortalStructuralBlocks() {
    // Some community/preset JSONs require `modBlock` to exist and expose a RULES statement input.
    // If not present (or present but incompatible), define a safe structural version.
    try {
        Blockly.Blocks = Blockly.Blocks || {};
        Blockly.Blocks['modBlock'] = {
            init: function() {
                this.appendDummyInput().appendField('MOD');
                try {
                    this.appendStatementInput('RULES').appendField('RULES');
                } catch {
                    this.appendStatementInput('RULES');
                }
                // Top-level container
                try { this.setColour(getSuggestedPortalBlockColour('modBlock')); } catch {}
                try { this.setTooltip('Portal template MOD container.'); } catch {}
                try { this.setHelpUrl(''); } catch {}
            }
        };

        // Blockly v12+ primarily looks at the common registry when creating blocks.
        // Registering only via Blockly.Blocks can still result in "Invalid block definition".
        try {
            if (Blockly.common && typeof Blockly.common.defineBlocks === 'function') {
                const defs = { modBlock: Blockly.Blocks['modBlock'] };
                Blockly.common.defineBlocks(defs);
            }
        } catch {
            // ignore
        }
    } catch {
        // ignore
    }
}

function setupCodePreviewDrawer() {
    const toggleBtn = document.getElementById('codePreviewBtn') || document.getElementById('terminal-toggle');
    const container = document.getElementById('terminal-drawer');
    if (!toggleBtn || !container) return;

    // The drawer is a Code Preview panel (works in both browser + Electron).
    let DrawerCtor = null;
    try {
        if (typeof require === 'function') {
            DrawerCtor = require('./terminal-drawer.js');
        } else if (window.TerminalDrawer) {
            DrawerCtor = window.TerminalDrawer;
        }
    } catch {
        DrawerCtor = window.TerminalDrawer;
    }

    if (!DrawerCtor) {
        // No drawer implementation; hide toggle.
        toggleBtn.style.display = 'none';
        return;
    }

    const drawer = new DrawerCtor('terminal-drawer');
    if (!drawer || typeof drawer.toggle !== 'function') {
        toggleBtn.style.display = 'none';
        return;
    }

    window.__terminalDrawer = drawer;
    toggleBtn.title = 'Code Preview';
    toggleBtn.addEventListener('click', () => drawer.toggle());
}

function setupButtonListeners() {
    console.log("[BF6] Setting up button listeners...");

    const btnMap = {
        'aboutBtn': () => openAboutModal(),
        'loadBtn': () => {
            const input = document.getElementById('loadInput');
            if (input) input.click();
        },
        'saveBtn': () => saveWorkspace(),
        'exportPortalBtn': () => exportToPortalJson(),
        'importTsBtn': () => alert('Import TS is coming soon.\n\nFor now: use Load JSON to import workspaces, or Export TS to get a TypeScript snapshot.'),
        'exportTsBtn': () => exportToTypeScript(),
        'importTsBtn': () => {
            try {
                void bf6Alert({
                    title: 'Import TypeScript',
                    message: 'Coming soon.\n\nTypeScript → Blocks import is planned, but it is not ready enough to guarantee correct Portal-compatible output yet.',
                    okText: 'OK'
                });
            } catch {
                alert('Import TS: Coming soon');
            }
        },
        'presetSaveBtn': () => saveCurrentWorkspaceAsPreset(),
        'presetDeleteBtn': () => deleteSelectedPreset(),
        'closeAboutModal': () => {
            closeAboutModal();
        },

        // Workspace controls (now in the header, top-right).
        'zoomOutBtn': () => zoomWorkspaceStep(-1),
        'zoomInBtn': () => zoomWorkspaceStep(1),
        'zoomResetBtn': () => resetWorkspaceZoom(),
        'zoomFitBtn': () => zoomToFitWorkspace(),
        'trashBtn': () => deleteSelectedBlock(),
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

    // Preset select listener
    const presetSelect = document.getElementById('presetSelect');
    if (presetSelect) {
        presetSelect.addEventListener('change', () => {
            const id = presetSelect.value;
            if (id) loadPresetById(id);
        });
    }
}

// --- Code Preview (TypeScript) ---

function generateTypeScriptFromWorkspace(workspace) {
    if (!workspace || !Blockly?.serialization?.workspaces?.save) {
        return `// Code Preview unavailable\n// (Blockly serialization API not found)`;
    }
    const state = Blockly.serialization.workspaces.save(workspace);
    const json = JSON.stringify(state, null, 2);
    return [
        '/*',
        '  BF6Portal Tool - Code Preview',
        '  This is a TypeScript representation of the current Blockly workspace state.',
        '  You can re-import this by converting it back to JSON (workspaceState).',
        '*/',
        '',
        'export const workspaceState = ' + json + ' as const;',
        '',
        'export default workspaceState;',
        '',
    ].join('\n');
}

function setCodePreviewText(text) {
    // In-page preview (if we later show it)
    try {
        const ta = document.getElementById('codeOutput');
        if (ta) ta.value = String(text ?? '');
    } catch {
        // ignore
    }

    // Drawer preview
    try {
        const drawer = window.__terminalDrawer;
        if (drawer && typeof drawer.setCode === 'function') {
            drawer.setCode(String(text ?? ''));
        }
    } catch {
        // ignore
    }
}

let __codePreviewTimer = null;
function scheduleCodePreviewRefresh() {
    if (!window.workspace) return;
    if (__codePreviewTimer) clearTimeout(__codePreviewTimer);
    __codePreviewTimer = setTimeout(() => {
        try {
            const ts = generateTypeScriptFromWorkspace(window.workspace);
            setCodePreviewText(ts);
        } catch (e) {
            setCodePreviewText(`// Error generating preview\n// ${String(e && e.message ? e.message : e)}`);
        }
    }, 100);
}

function initLiveCodePreview() {
    if (window.__bf6LiveCodePreviewBound) return;
    if (!window.workspace || typeof window.workspace.addChangeListener !== 'function') return;
    window.__bf6LiveCodePreviewBound = true;
    // Initial render
    scheduleCodePreviewRefresh();
    window.workspace.addChangeListener(() => {
        scheduleCodePreviewRefresh();
    });
}

// --- Presets ---

const PRESET_STORAGE_KEY = 'bf6portal.presets.user.v1';

// In some packaged Electron builds, native `prompt()` can be suppressed (returns null).
// Use an in-app modal instead so saving presets always works.
function ensureBf6ModalRoot() {
    let root = document.getElementById('bf6-modal-root');
    if (root) return root;
    root = document.createElement('div');
    root.id = 'bf6-modal-root';
    root.style.position = 'fixed';
    root.style.inset = '0';
    root.style.zIndex = '9999';
    root.style.display = 'none';
    document.body.appendChild(root);
    return root;
}

function showBf6Modal({ title, bodyEl, okText, cancelText, showCancel = true, onOk, onCancel }) {
    const root = ensureBf6ModalRoot();
    root.innerHTML = '';

    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.82)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';

    const card = document.createElement('div');
    card.style.maxWidth = '560px';
    card.style.width = 'calc(100% - 32px)';
    card.style.margin = 'auto';
    card.style.background = '#23272e';
    card.style.color = '#fff';
    card.style.borderRadius = '14px';
    card.style.boxShadow = '0 4px 32px #000a';
    card.style.padding = '18px 18px 14px 18px';
    card.style.position = 'relative';

    const h = document.createElement('div');
    h.textContent = title;
    h.style.fontSize = '1.15em';
    h.style.fontWeight = '700';
    h.style.marginBottom = '10px';

    const footer = document.createElement('div');
    footer.style.display = 'flex';
    footer.style.gap = '10px';
    footer.style.justifyContent = 'flex-end';
    footer.style.marginTop = '14px';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = cancelText || 'Cancel';
    cancelBtn.style.padding = '8px 12px';
    cancelBtn.style.borderRadius = '10px';
    cancelBtn.style.border = '1px solid #444';
    cancelBtn.style.background = '#1e1e1e';
    cancelBtn.style.color = '#fff';
    cancelBtn.style.cursor = 'pointer';

    const okBtn = document.createElement('button');
    okBtn.textContent = okText || 'OK';
    okBtn.style.padding = '8px 12px';
    okBtn.style.borderRadius = '10px';
    okBtn.style.border = '1px solid #2a2a2a';
    okBtn.style.background = '#007acc';
    okBtn.style.color = '#fff';
    okBtn.style.cursor = 'pointer';

    card.appendChild(h);
    card.appendChild(bodyEl);
    card.appendChild(footer);
    if (showCancel) footer.appendChild(cancelBtn);
    footer.appendChild(okBtn);
    overlay.appendChild(card);
    root.appendChild(overlay);
    root.style.display = 'block';

    const close = () => {
        root.style.display = 'none';
        root.innerHTML = '';
    };

    return new Promise((resolve) => {
        const cleanup = () => {
            document.removeEventListener('keydown', onKeyDown);
        };
        const finish = (result) => {
            cleanup();
            close();
            resolve(result);
        };
        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                try { onCancel && onCancel(); } catch {}
                finish('cancel');
            }
            if (e.key === 'Enter') {
                try { onOk && onOk(); } catch {}
                finish('ok');
            }
        };
        document.addEventListener('keydown', onKeyDown);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                try { onCancel && onCancel(); } catch {}
                finish('cancel');
            }
        });
        cancelBtn.addEventListener('click', () => {
            try { onCancel && onCancel(); } catch {}
            finish('cancel');
        });
        okBtn.addEventListener('click', () => {
            try { onOk && onOk(); } catch {}
            finish('ok');
        });
    });
}

async function bf6PromptText({ title, label, defaultValue }) {
    try {
        const body = document.createElement('div');
        const l = document.createElement('div');
        l.textContent = label;
        l.style.opacity = '0.92';
        l.style.marginBottom = '8px';

        const input = document.createElement('input');
        input.type = 'text';
        input.value = defaultValue || '';
        input.style.width = '100%';
        input.style.boxSizing = 'border-box';
        input.style.padding = '10px 12px';
        input.style.borderRadius = '10px';
        input.style.border = '1px solid #444';
        input.style.background = '#1e1e1e';
        input.style.color = '#fff';
        input.style.outline = 'none';

        body.appendChild(l);
        body.appendChild(input);

        let result = null;
        const r = await showBf6Modal({
            title,
            bodyEl: body,
            okText: 'Save',
            cancelText: 'Cancel',
            showCancel: true,
            onOk: () => { result = input.value; },
            onCancel: () => { result = null; },
        });

        if (r !== 'ok') return null;
        return result;
    } catch {
        try {
            return prompt(label, defaultValue);
        } catch {
            return null;
        }
    }
}

async function bf6Confirm({ title, message, okText, cancelText }) {
    try {
        const body = document.createElement('div');
        body.textContent = message;
        body.style.whiteSpace = 'pre-wrap';
        const r = await showBf6Modal({ title, bodyEl: body, okText: okText || 'OK', cancelText: cancelText || 'Cancel', showCancel: true });
        return r === 'ok';
    } catch {
        try { return confirm(message); } catch { return false; }
    }
}

async function bf6Alert({ title, message, okText }) {
    try {
        const body = document.createElement('div');
        body.textContent = message;
        body.style.whiteSpace = 'pre-wrap';
        await showBf6Modal({ title, bodyEl: body, okText: okText || 'OK', showCancel: false });
    } catch {
        try { alert(message); } catch {}
    }
}

function getBuiltInPresets() {
    return [
        { id: 'builtin:rush', name: 'Andy6170 - Rush (V1.0)', url: 'presets/custom_rush_V1.0.json', locked: true },
        { id: 'builtin:conquest', name: 'Andy6170 - Conquest (V8.0)', url: 'presets/custom_conquest_template_V8.0.json', locked: true },
        { id: 'builtin:breakthrough', name: 'Andy6170 - Breakthrough (V1.1)', url: 'presets/custom_breakthrough_V1.1.json', locked: true },
    ];
}

function loadUserPresets() {
    try {
        const raw = localStorage.getItem(PRESET_STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return (parsed && typeof parsed === 'object') ? parsed : {};
    } catch {
        return {};
    }
}

function saveUserPresets(obj) {
    try {
        localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(obj || {}));
    } catch {
        // ignore
    }
}

function refreshPresetDropdown(selectedId) {
    const select = document.getElementById('presetSelect');
    if (!select) return;

    const builtins = getBuiltInPresets();
    const user = loadUserPresets();
    const userEntries = Object.entries(user)
        .filter(([id, v]) => v && typeof v === 'object' && typeof v.name === 'string')
        .map(([id, v]) => ({ id, name: v.name }));

    select.innerHTML = '';

    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Select…';
    select.appendChild(placeholder);

    const ogBuilt = document.createElement('optgroup');
    ogBuilt.label = 'Built-in (locked)';
    for (const p of builtins) {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.name;
        ogBuilt.appendChild(opt);
    }
    select.appendChild(ogBuilt);

    const ogUser = document.createElement('optgroup');
    ogUser.label = 'Your presets';
    if (userEntries.length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = '(none yet)';
        opt.disabled = true;
        ogUser.appendChild(opt);
    } else {
        userEntries.sort((a, b) => a.name.localeCompare(b.name));
        for (const p of userEntries) {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.textContent = p.name;
            ogUser.appendChild(opt);
        }
    }
    select.appendChild(ogUser);

    if (selectedId) select.value = selectedId;
    updatePresetButtons();
}

function getSelectedPresetInfo() {
    const select = document.getElementById('presetSelect');
    const id = select ? String(select.value || '') : '';
    if (!id) return { id: '', kind: 'none', locked: false };

    const builtin = getBuiltInPresets().find(p => p.id === id);
    if (builtin) return { ...builtin, kind: 'builtin', locked: true };

    const user = loadUserPresets();
    const item = user[id];
    if (item) return { id, kind: 'user', locked: false, name: item.name, state: item.state };

    return { id, kind: 'unknown', locked: false };
}

function updatePresetButtons() {
    const delBtn = document.getElementById('presetDeleteBtn');
    if (!delBtn) return;
    const info = getSelectedPresetInfo();
    delBtn.disabled = !(info && info.kind === 'user');
    delBtn.style.opacity = delBtn.disabled ? '0.5' : '1';
    delBtn.title = delBtn.disabled ? 'Built-in presets are locked' : 'Delete selected user preset';
}

async function loadPresetById(id) {
    if (!window.workspace) return;
    const info = getSelectedPresetInfo();
    updatePresetButtons();

    // Confirm replacing existing work.
    try {
        const count = (typeof window.workspace.getAllBlocks === 'function') ? window.workspace.getAllBlocks(false).length : 0;
        if (count > 0) {
            const ok = confirm('Loading a preset will replace your current workspace. Continue?');
            if (!ok) {
                // revert selection
                refreshPresetDropdown('');
                return;
            }
        }
    } catch {
        // ignore
    }

    if (info.kind === 'builtin' && info.url) {
        let parsed = null;
        try {
            const res = await fetch(info.url, { cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            parsed = await res.json();
        } catch (e) {
            // In Electron/file:// contexts, fetch can fail. Fall back to Node fs.
            try {
                const req = (typeof window !== 'undefined' && window.require) ? window.require : (typeof require === 'function' ? require : null);
                if (!req) throw e;
                const fs = req('fs');
                const path = req('path');
                const { fileURLToPath } = req('url');
                const here = fileURLToPath(window.location.href);
                const baseDir = path.dirname(here);
                const absPath = path.resolve(baseDir, info.url);
                const raw = fs.readFileSync(absPath, 'utf8');
                parsed = JSON.parse(raw);
            } catch (e2) {
                const msg = String(e2 && e2.message ? e2.message : e2);
                alert(`Failed to load preset.\n\n${msg}`);
                return;
            }
        }
        const state = normalizeWorkspaceState(parsed);
        try { ensureCriticalPortalStructuralBlocks(); } catch {}
        try { ensurePortalBlocksRegisteredFromState(state); } catch {}
        Blockly.Events.disable();
        try {
            window.workspace.clear();
            Blockly.serialization.workspaces.load(state, window.workspace, undefined);
        } finally {
            Blockly.Events.enable();
        }

        // Custom toolbox categories can cache their flyout contents.
        // After a deserialize, refresh so imported variables appear.
        try {
            window.workspace.refreshToolboxSelection?.();
            window.workspace.getToolbox?.()?.refreshSelection?.();
        } catch {}
        setTimeout(() => {
            try {
                Blockly.svgResize(window.workspace);
                focusWorkspaceOnContent(window.workspace);
                applyDocColoursToWorkspace(window.workspace);
                scheduleCodePreviewRefresh();
            } catch {}
        }, 0);
        return;
    }

    if (info.kind === 'user' && info.state) {
        const state = normalizeWorkspaceState(info.state);
        try { ensureCriticalPortalStructuralBlocks(); } catch {}
        try { ensurePortalBlocksRegisteredFromState(state); } catch {}
        Blockly.Events.disable();
        try {
            window.workspace.clear();
            Blockly.serialization.workspaces.load(state, window.workspace, undefined);
        } finally {
            Blockly.Events.enable();
        }

        try {
            window.workspace.refreshToolboxSelection?.();
            window.workspace.getToolbox?.()?.refreshSelection?.();
        } catch {}
        setTimeout(() => {
            try {
                Blockly.svgResize(window.workspace);
                focusWorkspaceOnContent(window.workspace);
                applyDocColoursToWorkspace(window.workspace);
                scheduleCodePreviewRefresh();
            } catch {}
        }, 0);
        return;
    }
}

function makeUserPresetId() {
    return `user:${Date.now()}:${Math.random().toString(16).slice(2)}`;
}

function bf6PromptAsync(message, defaultValue) {
    return new Promise((resolve) => {
        try {
            if (Blockly?.dialog?.prompt && typeof Blockly.dialog.prompt === 'function') {
                Blockly.dialog.prompt(message, defaultValue ?? '', (value) => resolve(value));
                return;
            }
        } catch {
            // ignore
        }
        // Native prompt is not supported in Electron; fail gracefully.
        resolve(null);
    });
}

async function saveCurrentWorkspaceAsPreset() {
    if (!window.workspace || !Blockly?.serialization?.workspaces?.save) return;

    const selected = getSelectedPresetInfo();
    const builtins = getBuiltInPresets();

    let defaultName = 'My Preset';
    if (selected.kind === 'builtin' && selected.name) defaultName = `${selected.name} (Copy)`;
    if (selected.kind === 'user' && selected.name) defaultName = selected.name;

    let name = await bf6PromptAsync('Preset name:', defaultName);
    if (!name) return;
    name = name.trim();
    if (!name) return;

    // Prevent overwriting built-ins by name.
    if (builtins.some(b => b.name.toLowerCase() === name.toLowerCase())) {
        // Friendly UX: auto-suffix so users can quickly save a copy.
        name = `${name} (Copy)`;
    }

    const user = loadUserPresets();
    const existingId = Object.keys(user).find(k => (user[k]?.name || '').toLowerCase() === name.toLowerCase());

    // If user is editing a built-in, always save as a new preset.
    let targetId = (selected.kind === 'user') ? selected.id : '';
    if (selected.kind === 'builtin') targetId = '';

    // If the name already exists under a different id, offer overwrite.
    if (existingId && existingId !== targetId) {
        const ok = await bf6Confirm({
            title: 'Overwrite preset?',
            message: 'A user preset with that name already exists. Overwrite it?',
            okText: 'Overwrite',
            cancelText: 'Cancel'
        });
        if (!ok) return;
        targetId = existingId;
    }

    if (!targetId) targetId = makeUserPresetId();

    const state = Blockly.serialization.workspaces.save(window.workspace);
    user[targetId] = {
        name,
        state,
        updatedAt: new Date().toISOString(),
        createdAt: user[targetId]?.createdAt || new Date().toISOString(),
    };
    saveUserPresets(user);
    refreshPresetDropdown(targetId);
    await bf6Alert({ title: 'Preset saved', message: `Saved preset: ${name}` });
}

function deleteSelectedPreset() {
    const selected = getSelectedPresetInfo();
    if (!selected || selected.kind !== 'user') {
        updatePresetButtons();
        return;
    }
    const ok = confirm(`Delete preset "${selected.name}"? This cannot be undone.`);
    if (!ok) return;
    const user = loadUserPresets();
    delete user[selected.id];
    saveUserPresets(user);
    refreshPresetDropdown('');
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

async function setupAboutQuotes() {
    // Quotes are shown only inside the About modal.
    const line1El = document.getElementById('aboutQuoteLine1');
    const line2El = document.getElementById('aboutQuoteLine2');
    if (!line1El || !line2El) return;

    // NOTE (copyright): I can’t “google” and paste long copyrighted quotes into the repo.
    // Instead, this reads from a local file shipped with the app: web_ui/quotes.json.
    // Put your own quotes in there. You can force a 2-line display by including "\n".
    const fallbackQuotes = [
        'River Tam:\n(paste your quote in quotes.json)',
        'Portal logic armed.\nProceed with reckless creativity.',
        'If it\'s stupid but it works…\nIt\'s still probably portal scripting.',
    ];

    const { quotes, rotateMs } = await loadAboutQuotes();
    const effectiveQuotes = (Array.isArray(quotes) && quotes.length > 0) ? quotes : fallbackQuotes;
    const effectiveRotateMs = (Number.isFinite(rotateMs) && rotateMs >= 1000) ? rotateMs : 12000;

    let idx = 0;

    const render = (q) => {
        const [a, b] = splitQuoteTwoLines(String(q || ''), 64);
        line1El.textContent = a;
        line2El.textContent = b;
    };

    render(effectiveQuotes[idx]);

    // Rotate.
    setInterval(() => {
        idx = (idx + 1) % effectiveQuotes.length;
        render(effectiveQuotes[idx]);
    }, effectiveRotateMs);
}

async function loadAboutQuotes() {
    // Supports either:
    // 1) An array of strings
    // 2) { rotateSeconds?: number, rotateMs?: number, quotes: string[] }
    try {
        // Try a local override first. This file should be ignored by git so users can
        // keep personal/copyrighted quote sets locally without committing them.
        const local = await tryFetchJson('quotes.local.json');
        if (local) return normalizeQuotesPayload(local);

        const shipped = await tryFetchJson('quotes.json');
        if (shipped) return normalizeQuotesPayload(shipped);

        return { quotes: null, rotateMs: null };
    } catch (e) {
        console.warn('[BF6] Quotes not loaded (using fallback):', e);
        return { quotes: null, rotateMs: null };
    }
}

async function tryFetchJson(url) {
    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

function normalizeQuotesPayload(data) {
    if (Array.isArray(data)) {
        return {
            quotes: data.filter((q) => typeof q === 'string' && q.trim().length > 0),
            rotateMs: null,
        };
    }

    if (data && typeof data === 'object') {
        const rawQuotes = Array.isArray(data.quotes) ? data.quotes : [];
        const quotes = rawQuotes
            .filter((q) => typeof q === 'string' && q.trim().length > 0);

        let rotateMs = null;
        if (Number.isFinite(data.rotateMs)) rotateMs = Number(data.rotateMs);
        if (Number.isFinite(data.rotateSeconds)) rotateMs = Number(data.rotateSeconds) * 1000;

        return { quotes, rotateMs };
    }

    return { quotes: null, rotateMs: null };
}

function splitQuoteTwoLines(text, maxLineLen) {
    // Manual split wins.
    if (text.includes('\n')) {
        const parts = text.split('\n');
        const a = (parts[0] || '').trim();
        const b = (parts.slice(1).join(' ') || '').trim();
        return [a, b];
    }

    const t = (text || '').trim();
    if (t.length <= maxLineLen) return [t, ''];

    // Try to split on a space near the midpoint.
    const target = Math.min(Math.floor(t.length / 2), maxLineLen);
    let splitAt = t.lastIndexOf(' ', target);
    if (splitAt < 0) splitAt = t.indexOf(' ', target);
    if (splitAt < 0) return [t.slice(0, maxLineLen).trim(), t.slice(maxLineLen).trim()];
    return [t.slice(0, splitAt).trim(), t.slice(splitAt + 1).trim()];
}

function normalizeToolboxConfig(toolbox) {
    try {
        if (!toolbox || toolbox.kind !== 'categoryToolbox' || !Array.isArray(toolbox.contents)) return toolbox;

        // If the toolbox has a wrapper category like "BF6 Portal", flatten it so BF6 categories are the main menus.
        const bf6Wrapper = toolbox.contents.find(
            (c) => c && c.kind === 'category' && typeof c.name === 'string' && c.name.toLowerCase() === 'bf6 portal'
        );

        if (bf6Wrapper && Array.isArray(bf6Wrapper.contents)) {
            const flattened = bf6Wrapper.contents;
            return {
                kind: 'categoryToolbox',
                contents: reorderTopCategories(flattened)
            };
        }

        // Otherwise, at least remove an outer "Home" wrapper if present.
        return {
            kind: 'categoryToolbox',
            contents: reorderTopCategories(toolbox.contents.filter(
                (c) => !(c && c.kind === 'category' && typeof c.name === 'string' && c.name.toLowerCase() === 'home')
            ))
        };
    } catch (e) {
        console.warn('[BF6] normalizeToolboxConfig failed; using original toolbox:', e);
        return toolbox;
    }
}

// --- Official toolbox layout (strict Actions vs Values) ---

const __bf6ToolboxKindCache = {
    kindByType: new Map(),
    hasDropdownByType: new Map(),
};

function classifyBlockType(workspace, type) {
    if (!workspace || !type) return { kind: 'unknown' };
    if (__bf6ToolboxKindCache.kindByType.has(type)) return __bf6ToolboxKindCache.kindByType.get(type);

    let result = { kind: 'unknown', isStatement: false, isValue: false };
    try {
        const b = workspace.newBlock(type);
        const isValue = !!b.outputConnection;
        const isStatement = !!b.previousConnection || !!b.nextConnection;
        result = { kind: (isValue ? 'value' : (isStatement ? 'statement' : 'unknown')), isStatement, isValue };
        b.dispose(false);
    } catch {
        // ignore
    }

    __bf6ToolboxKindCache.kindByType.set(type, result);
    return result;
}

function blockTypeHasDropdown(workspace, type) {
    if (!workspace || !type) return false;
    if (__bf6ToolboxKindCache.hasDropdownByType.has(type)) return __bf6ToolboxKindCache.hasDropdownByType.get(type);
    let has = false;
    try {
        const b = workspace.newBlock(type);
        for (const input of (b.inputList || [])) {
            for (const field of (input.fieldRow || [])) {
                if (field && field.constructor && field.constructor.name === 'FieldDropdown') {
                    has = true;
                    break;
                }
            }
            if (has) break;
        }
        b.dispose(false);
    } catch {
        // ignore
    }
    __bf6ToolboxKindCache.hasDropdownByType.set(type, has);
    return has;
}

function findCategoryByName(contents, nameLower) {
    if (!Array.isArray(contents)) return null;
    const key = String(nameLower || '').toLowerCase();
    return contents.find((c) => c && c.kind === 'category' && typeof c.name === 'string' && c.name.toLowerCase() === key) || null;
}

function cloneJson(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function filterToolboxNode(node, keepBlockTypeFn) {
    if (!node || typeof node !== 'object') return null;

    if (node.kind === 'block') {
        const t = node.type;
        return (t && keepBlockTypeFn(String(t))) ? cloneJson(node) : null;
    }

    if (node.kind === 'sep') {
        // Keep for now; we'll trim later.
        return cloneJson(node);
    }

    if (node.kind === 'category') {
        const out = cloneJson(node);
        if (Array.isArray(node.contents)) {
            out.contents = node.contents
                .map((child) => filterToolboxNode(child, keepBlockTypeFn))
                .filter(Boolean);
            out.contents = trimSeps(out.contents);
        }
        if (out.custom) {
            // Dynamic categories: keep them as-is.
            return out;
        }
        if (Array.isArray(out.contents) && out.contents.length === 0) return null;
        return out;
    }

    // Unknown node type
    return null;
}

function trimSeps(contents) {
    if (!Array.isArray(contents)) return contents;
    const out = [];
    for (const item of contents) {
        if (!item) continue;
        if (item.kind === 'sep') {
            if (out.length === 0) continue;
            // Don't allow duplicate separators.
            if (out[out.length - 1] && out[out.length - 1].kind === 'sep') continue;
        }
        out.push(item);
    }
    // Trim trailing sep
    while (out.length > 0 && out[out.length - 1] && out[out.length - 1].kind === 'sep') out.pop();
    return out;
}

function retintCategoryTree(node, categorystyle) {
    if (!node || typeof node !== 'object') return node;
    if (node.kind === 'category') {
        node.categorystyle = categorystyle;
        delete node.colour;
        if (Array.isArray(node.contents)) {
            node.contents = node.contents.map((c) => retintCategoryTree(c, categorystyle));
        }
    }
    return node;
}

function getAllBlockTypesInToolbox(toolbox) {
    const set = new Set();
    function walk(node) {
        if (!node || typeof node !== 'object') return;
        if (node.kind === 'block' && node.type) {
            set.add(String(node.type));
            return;
        }
        if (Array.isArray(node.contents)) {
            for (const c of node.contents) walk(c);
        }
    }
    if (toolbox && Array.isArray(toolbox.contents)) {
        for (const c of toolbox.contents) walk(c);
    }
    return set;
}

function buildOfficialToolboxLayout(sourceToolbox, workspace) {
    // Source should already be normalized/flattish.
    const src = sourceToolbox && sourceToolbox.kind === 'categoryToolbox' ? sourceToolbox : normalizeToolboxConfig(sourceToolbox);
    const contents = (src && Array.isArray(src.contents)) ? src.contents : [];

    const rulesCat = findCategoryByName(contents, 'rules');
    const subroutineCat = findCategoryByName(contents, 'subroutine');
    const subroutinesCat = findCategoryByName(contents, 'subroutines');
    const eventsCat = findCategoryByName(contents, 'events');
    const conditionsCat = findCategoryByName(contents, 'conditions');

    // Control actions: use LOGIC -> Control Flow if available.
    const logicCat = findCategoryByName(contents, 'logic');
    let controlActionTypes = new Set();
    try {
        if (logicCat && Array.isArray(logicCat.contents)) {
            const controlFlow = (logicCat.contents || []).find((c) => c && c.kind === 'category' && typeof c.name === 'string' && c.name.toLowerCase() === 'control flow');
            const tmp = getAllBlockTypesInToolbox({ kind: 'categoryToolbox', contents: [controlFlow].filter(Boolean) });
            controlActionTypes = tmp;
        }
    } catch {
        // ignore
    }

    // Event payloads: EVENTS -> Event Payloads
    let eventPayloadTypes = new Set();
    try {
        if (eventsCat && Array.isArray(eventsCat.contents)) {
            const payloads = (eventsCat.contents || []).find((c) => c && c.kind === 'category' && typeof c.name === 'string' && c.name.toLowerCase() === 'event payloads');
            const tmp = getAllBlockTypesInToolbox({ kind: 'categoryToolbox', contents: [payloads].filter(Boolean) });
            eventPayloadTypes = tmp;
        }
    } catch {
        // ignore
    }

    const literalTypes = new Set(['NUMBER', 'STRING', 'BOOLEAN']);
    const variableTypes = new Set(['GETVARIABLE', 'SETVARIABLE']);

    const isSelectionList = (type) => {
        // Heuristic: output block with a dropdown and no value inputs.
        try {
            const b = workspace.newBlock(type);
            const isValue = !!b.outputConnection;
            if (!isValue) {
                b.dispose(false);
                return false;
            }
            let hasValueInput = false;
            for (const input of (b.inputList || [])) {
                if (input && input.type === Blockly.INPUT_VALUE) {
                    hasValueInput = true;
                    break;
                }
            }
            const hasDropdown = blockTypeHasDropdown(workspace, type);
            b.dispose(false);
            return hasDropdown && !hasValueInput;
        } catch {
            return false;
        }
    };

    const keepAsAction = (type) => {
        if (!type) return false;
        if (controlActionTypes.has(type)) return false;
        const k = classifyBlockType(workspace, type);
        return !!k.isStatement;
    };

    const keepAsValue = (type) => {
        if (!type) return false;
        const k = classifyBlockType(workspace, type);
        return !!k.isValue;
    };

    const keepAsValueGeneral = (type) => {
        if (!keepAsValue(type)) return false;
        if (eventPayloadTypes.has(type)) return false;
        if (literalTypes.has(type)) return false;
        if (variableTypes.has(type)) return false;
        if (isSelectionList(type)) return false;
        return true;
    };

    const makeGroupCategory = (name, categorystyle, subcats) => {
        return {
            kind: 'category',
            name,
            categorystyle,
            contents: (subcats || []).filter(Boolean)
        };
    };

    const getAndFilterTopCat = (topName, predicate, tintStyle, renameTo) => {
        const srcCat = findCategoryByName(contents, topName);
        if (!srcCat) return null;
        const filtered = filterToolboxNode(srcCat, predicate);
        if (!filtered) return null;
        if (renameTo) filtered.name = renameTo;
        if (tintStyle) retintCategoryTree(filtered, tintStyle);
        return filtered;
    };

    // Yellow (Actions) menus
    const yellowStyle = 'actions_category';
    const yellowMenus = [
        getAndFilterTopCat('ai', keepAsAction, yellowStyle, 'AI'),
        getAndFilterTopCat('arrays', keepAsAction, yellowStyle, 'ARRAYS'),
        getAndFilterTopCat('audio', keepAsAction, yellowStyle, 'AUDIO'),
        getAndFilterTopCat('camera', keepAsAction, yellowStyle, 'CAMERA'),
        getAndFilterTopCat('effects', keepAsAction, yellowStyle, 'EFFECTS'),
        getAndFilterTopCat('emplacements', keepAsAction, yellowStyle, 'EMPLACEMENTS'),
        getAndFilterTopCat('gameplay', keepAsAction, yellowStyle, 'GAMEPLAY'),
        // LOGIC (actions) excludes the control-flow blocks we move to CONTROL ACTIONS.
        getAndFilterTopCat('logic', (t) => keepAsAction(t) && !controlActionTypes.has(t), yellowStyle, 'LOGIC'),
        // CONDITIONS are value-y in Portal; but if we have statement-y ones, keep them under LOGIC/OTHER via other categories.
        getAndFilterTopCat('objective', keepAsAction, yellowStyle, 'OBJECTIVE'),
        getAndFilterTopCat('other', keepAsAction, yellowStyle, 'OTHER'),
        getAndFilterTopCat('player', keepAsAction, yellowStyle, 'PLAYER'),
        getAndFilterTopCat('transform', keepAsAction, yellowStyle, 'TRANSFORM'),
        getAndFilterTopCat('ui', keepAsAction, yellowStyle, 'USER INTERFACE'),
        getAndFilterTopCat('vehicles', keepAsAction, yellowStyle, 'VEHICLES'),
    ].filter(Boolean);

    // Green (Values) menus
    const greenStyle = 'values_category';
    const greenMenus = [
        getAndFilterTopCat('ai', keepAsValueGeneral, greenStyle, 'AI'),
        getAndFilterTopCat('arrays', keepAsValueGeneral, greenStyle, 'ARRAYS'),
        getAndFilterTopCat('audio', keepAsValueGeneral, greenStyle, 'AUDIO'),
        getAndFilterTopCat('effects', keepAsValueGeneral, greenStyle, 'EFFECTS'),
        // EVENT PAYLOADS
        (() => {
            if (!eventsCat) return null;
            const payloadOnly = filterToolboxNode(eventsCat, (t) => keepAsValue(t) && eventPayloadTypes.has(t));
            if (!payloadOnly) return null;
            payloadOnly.name = 'EVENT PAYLOADS';
            retintCategoryTree(payloadOnly, greenStyle);
            // Flatten so we don't keep Game Events
            payloadOnly.contents = (payloadOnly.contents || []).filter((c) => c && c.kind === 'block');
            // If the payloads were nested, fall back to collecting them.
            if (!payloadOnly.contents || payloadOnly.contents.length === 0) {
                const types = Array.from(eventPayloadTypes);
                payloadOnly.contents = types.map((t) => ({ kind: 'block', type: t }));
            }
            return payloadOnly;
        })(),
        getAndFilterTopCat('gameplay', keepAsValueGeneral, greenStyle, 'GAMEPLAY'),
        // LOGIC values: include comparisons/booleans; also merge CONDITIONS into LOGIC.
        (() => {
            const baseLogic = getAndFilterTopCat('logic', keepAsValueGeneral, greenStyle, 'LOGIC');
            const cond = conditionsCat ? filterToolboxNode(conditionsCat, keepAsValueGeneral) : null;
            if (cond) retintCategoryTree(cond, greenStyle);
            if (baseLogic && cond) {
                baseLogic.contents = trimSeps([...(baseLogic.contents || []), { kind: 'sep' }, ...(cond.contents || [])]);
            }
            return baseLogic || cond;
        })(),
        getAndFilterTopCat('math', keepAsValueGeneral, greenStyle, 'MATH'),
        getAndFilterTopCat('objective', keepAsValueGeneral, greenStyle, 'OBJECTIVE'),
        getAndFilterTopCat('other', keepAsValueGeneral, greenStyle, 'OTHER'),
        getAndFilterTopCat('player', keepAsValueGeneral, greenStyle, 'PLAYER'),
        getAndFilterTopCat('transform', keepAsValueGeneral, greenStyle, 'TRANSFORM'),
        getAndFilterTopCat('ui', keepAsValueGeneral, greenStyle, 'USER INTERFACE'),
        getAndFilterTopCat('vehicles', keepAsValueGeneral, greenStyle, 'VEHICLES'),
        // SELECTION LISTS
        (() => {
            const allTypes = Array.from(getAllBlockTypesInToolbox(src));
            const selectionTypes = allTypes
                .filter((t) => keepAsValue(t) && isSelectionList(t) && !eventPayloadTypes.has(t) && !literalTypes.has(t) && !variableTypes.has(t))
                .sort();
            if (selectionTypes.length === 0) return null;
            return {
                kind: 'category',
                name: 'SELECTION LISTS',
                categorystyle: greenStyle,
                contents: selectionTypes.map((t) => ({ kind: 'block', type: t }))
            };
        })(),
        // LITERALS
        {
            kind: 'category',
            name: 'LITERALS',
            categorystyle: greenStyle,
            contents: Array.from(literalTypes).map((t) => ({ kind: 'block', type: t }))
        },
        // VARIABLES
        (() => {
            const allTypes = Array.from(getAllBlockTypesInToolbox(src));
            const vars = allTypes
                .filter((t) => keepAsValue(t) && variableTypes.has(t))
                .sort();
            if (vars.length === 0) return null;
            return {
                kind: 'category',
                name: 'VARIABLES',
                categorystyle: greenStyle,
                contents: vars.map((t) => ({ kind: 'block', type: t }))
            };
        })(),
    ].filter(Boolean);

    // Subroutines
    const subroutinesTypes = new Set();
    for (const cat of [subroutineCat, subroutinesCat].filter(Boolean)) {
        for (const t of getAllBlockTypesInToolbox({ kind: 'categoryToolbox', contents: [cat] })) subroutinesTypes.add(t);
    }
    const subroutinesMenu = {
        kind: 'category',
        name: 'SUBROUTINES',
        categorystyle: 'subroutines_category',
        contents: Array.from(subroutinesTypes).map((t) => ({ kind: 'block', type: t }))
    };

    // Control actions
    const controlActionsMenu = {
        kind: 'category',
        name: 'CONTROL ACTIONS',
        categorystyle: 'control_actions_category',
        contents: Array.from(controlActionTypes).map((t) => ({ kind: 'block', type: t }))
    };

    // RULES
    const rulesMenu = rulesCat ? cloneJson(rulesCat) : {
        kind: 'category',
        name: 'RULES',
        categorystyle: 'rules_category',
        contents: []
    };
    rulesMenu.name = 'RULES';
    rulesMenu.categorystyle = 'rules_category';

    const finalToolbox = {
        kind: 'categoryToolbox',
        contents: [
            rulesMenu,
            makeGroupCategory('ACTIONS', 'actions_category', yellowMenus),
            makeGroupCategory('VALUES', 'values_category', greenMenus),
            subroutinesMenu,
            controlActionsMenu,
        ]
    };

    return finalToolbox;
}

function applyToolboxSearchBox(workspace, getBaseToolbox) {
    try {
        const toolboxDiv = document.querySelector('.blocklyToolboxDiv');
        if (!toolboxDiv) return;

        // Avoid duplicates.
        if (document.getElementById('bf6ToolboxSearchContainer')) return;

        toolboxDiv.style.position = 'absolute';
        toolboxDiv.style.overflow = 'hidden';

        const container = document.createElement('div');
        container.id = 'bf6ToolboxSearchContainer';
        container.style.position = 'absolute';
        container.style.left = '0';
        container.style.right = '0';
        container.style.top = '0';
        container.style.height = '44px';
        container.style.padding = '8px 10px';
        container.style.background = '#23272e';
        container.style.borderBottom = '1px solid #181a1b';
        container.style.zIndex = '10';
        container.style.boxSizing = 'border-box';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Search…';
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.style.width = '100%';
        input.style.height = '28px';
        input.style.boxSizing = 'border-box';
        input.style.borderRadius = '6px';
        input.style.border = '1px solid #333';
        input.style.background = '#181a1b';
        input.style.color = '#e0e0e0';
        input.style.padding = '6px 10px';
        input.style.fontFamily = 'Segoe UI, Consolas, monospace';

        container.appendChild(input);
        toolboxDiv.appendChild(container);

        // Make room for the search bar.
        toolboxDiv.style.paddingTop = '44px';

        const filterToolbox = (toolbox, term) => {
            const t = String(term || '').trim().toLowerCase();
            if (!t) return toolbox;

            const matchBlock = (type) => String(type || '').toLowerCase().includes(t);

            const walk = (node) => {
                if (!node || typeof node !== 'object') return null;
                if (node.kind === 'block') {
                    return matchBlock(node.type) ? cloneJson(node) : null;
                }
                if (node.kind === 'sep') return cloneJson(node);
                if (node.kind === 'category') {
                    // If category name matches, keep everything.
                    const name = String(node.name || '').toLowerCase();
                    if (name && name.includes(t)) return cloneJson(node);

                    const out = cloneJson(node);
                    if (Array.isArray(node.contents)) {
                        out.contents = node.contents.map(walk).filter(Boolean);
                        out.contents = trimSeps(out.contents);
                    }
                    if (Array.isArray(out.contents) && out.contents.length === 0) return null;
                    return out;
                }
                return null;
            };

            const filtered = {
                kind: 'categoryToolbox',
                contents: (toolbox.contents || []).map(walk).filter(Boolean)
            };
            return filtered;
        };

        let timer = null;
        input.addEventListener('input', () => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                try {
                    const base = (typeof getBaseToolbox === 'function') ? getBaseToolbox() : null;
                    if (!base) return;
                    const next = filterToolbox(base, input.value);
                    workspace.updateToolbox(next);
                } catch (e) {
                    console.warn('[BF6] toolbox search failed:', e);
                }
            }, 80);
        });
    } catch (e) {
        console.warn('[BF6] applyToolboxSearchBox failed:', e);
    }
}

function reorderTopCategories(contents) {
    if (!Array.isArray(contents)) return contents;

    const byName = new Map();
    for (const c of contents) {
        if (c && c.kind === 'category' && typeof c.name === 'string') {
            byName.set(c.name.toLowerCase(), c);
        }
    }

    // Desired order: RULES first (official), then everything else.
    const preferredNames = ['rules'];
    const preferred = preferredNames
        .map((n) => byName.get(n))
        .filter(Boolean);

    const preferredSet = new Set(preferred);
    const rest = contents.filter((c) => !preferredSet.has(c));
    return [...preferred, ...rest];
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
        // Keep the toolbox exactly as-authored so menus stay nested where they were.
        // (Search filtering will still work on the full nested structure.)
        toolbox = TOOLBOX_CONFIG;
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
            'values_category': { 'colour': '#4CAF50' },
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
                // Subtle, BF6-ish grid: short ticks (dot-grid vibe) and low contrast.
                length: 2,
                colour: 'rgba(63, 74, 82, 0.28)',
                snap: true
            },
            zoom: {
                controls: false,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2
            },
            trashcan: false
        });
        console.log("[BF6] Blockly injected successfully.");

        // Search box (keep original nested toolbox; no Actions/Values regrouping).
        try {
            window.__bf6BaseToolbox = cloneJson(toolbox);
            applyToolboxSearchBox(window.workspace, () => window.__bf6BaseToolbox);
        } catch (e) {
            console.warn('[BF6] Failed to apply toolbox search:', e);
        }

        // Initialize live TypeScript code preview + presets UI now that we have a workspace.
        try { initLiveCodePreview(); } catch (e) { console.warn('[BF6] initLiveCodePreview failed:', e); }
        try { refreshPresetDropdown(''); } catch (e) { console.warn('[BF6] refreshPresetDropdown failed:', e); }

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

async function saveWorkspace() {
    if (!window.workspace) return;

    // Ensure docs/specs are available for best-effort Portal-compatible export.
    try { await loadBlockDocs(); } catch {}

    // Prefer JSON serialization.
    if (Blockly?.serialization?.workspaces?.save) {
        try {
            const internalState = Blockly.serialization.workspaces.save(window.workspace);

            // Export Portal/community compatible JSON by default so the output can be
            // imported into other Portal editors.
            // Also keep it round-trippable by converting back on import.
            const portalState = convertWorkspaceStateInternalToPortal(internalState);
            const wrapped = { mod: portalState };
            const jsonText = JSON.stringify(wrapped, null, 2);
            downloadText(jsonText, 'bf6_portal_rules.json', 'application/json');
            return;
        } catch (e) {
            console.warn('[BF6] JSON save failed; falling back to XML:', e);
        }
    }

    // Legacy fallback: XML.
    const xml = Blockly.Xml.workspaceToDom(window.workspace);
    const xmlText = Blockly.Xml.domToPrettyText(xml);
    downloadText(xmlText, 'bf6_portal_rules.xml', 'text/xml');
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        (async () => {
            const text = String(e.target.result ?? '');
            const cleaned = text.replace(/^\uFEFF/, '');
            if (!window.workspace) return;

        // Allow re-loading the same file consecutively.
        try {
            event.target.value = '';
        } catch {
            // ignore
        }

        const looksLikeXml = /^\s*</.test(cleaned);
        const looksLikeJson = /^\s*[\[{]/.test(cleaned);

        // Prefer JSON when available.
        if (!looksLikeXml && looksLikeJson && Blockly?.serialization?.workspaces?.load) {
            try {
                const parsed = JSON.parse(cleaned);
                let state = normalizeWorkspaceState(parsed);

                // If this looks like a Portal/community export (including our own
                // mod-wrapped exports), convert it to this tool's internal schema
                // so it loads with correct connections.
                const portalWrapped = looksLikePortalWrappedExport(parsed);
                const portalShaped = portalWrapped || looksLikePortalWorkspaceState(state);
                if (portalShaped) {
                    try { await loadBlockDocs(); } catch {}
                    try { state = convertWorkspaceStatePortalToInternal(state); } catch {}
                }
                const expectedBlockCount = (() => {
                    try {
                        const arr = state?.blocks?.blocks;
                        return Array.isArray(arr) ? arr.length : 0;
                    } catch {
                        return 0;
                    }
                })();

                // Auto-register missing block types referenced by the imported JSON.
                // This is especially important for community Portal templates.
                try {
                    try { ensureCriticalPortalStructuralBlocks(); } catch {}
                    const r = ensurePortalBlocksRegisteredFromState(state);
                    if (r && r.created) {
                        console.log(`[BF6] Auto-registered ${r.created} block types for import.`);
                    }
                } catch (e) {
                    console.warn('[BF6] Failed to auto-register block types:', e);
                }

                Blockly.Events.disable();
                try {
                    window.workspace.clear();
                    Blockly.serialization.workspaces.load(state, window.workspace, undefined);
                } finally {
                    Blockly.Events.enable();
                }

                try {
                    window.workspace.refreshToolboxSelection?.();
                    window.workspace.getToolbox?.()?.refreshSelection?.();
                } catch {}

                // Ensure the SVG recalculates size after a big load.
                setTimeout(() => {
                    Blockly.svgResize(window.workspace);
                    focusWorkspaceOnContent(window.workspace);
                    applyDocColoursToWorkspace(window.workspace);
                    logWorkspaceSummary(window.workspace, file?.name);

                    // If the JSON clearly had blocks, but none were created, provide actionable hints.
                    try {
                        const actual = (typeof window.workspace.getAllBlocks === 'function')
                            ? window.workspace.getAllBlocks(false).length
                            : 0;
                        if (actual === 0 && expectedBlockCount > 0) {
                            const report = describeMissingBlockTypes(state);
                            const hint = report
                                ? report
                                : 'The file contains blocks, but none could be created. This usually means the required block definitions are missing or incompatible with this build.';
                            console.warn('[BF6] JSON contained blocks but 0 blocks were created. Likely missing block definitions or unsupported format.');
                            alert(
                                'Loaded JSON, but 0 blocks were created in the workspace.\n\n' +
                                hint +
                                '\n\nTry updating/rebuilding the app with the needed block definitions, or share this JSON so we can add compatibility.'
                            );
                        }
                    } catch {
                        // ignore
                    }
                }, 0);
                return;
            } catch (err) {
                console.warn('[BF6] Failed to load JSON workspace:', err);

                // If this *was* JSON, try to help the user by reporting missing block types.
                try {
                    const parsed = JSON.parse(cleaned);
                    const state = normalizeWorkspaceState(parsed);
                    const report = describeMissingBlockTypes(state);
                    if (report) {
                        alert(
                            'Failed to load JSON workspace.\n\n' +
                            report +
                            '\n\nThis file may require block definitions that are not present in your current build.'
                        );
                        return;
                    }
                } catch {
                    // ignore
                }

                alert('Failed to load JSON. This expects a Portal/community workspace JSON export (mod-wrapped) or a JSON export from this tool.');
                return;
            }
        }

        // Fallback: XML load (legacy).
        if (looksLikeXml) {
            try {
                const xml = Blockly.Xml.textToDom(cleaned);
                window.workspace.clear();
                Blockly.Xml.domToWorkspace(xml, window.workspace);
                setTimeout(() => {
                    Blockly.svgResize(window.workspace);
                    focusWorkspaceOnContent(window.workspace);
                    logWorkspaceSummary(window.workspace, file?.name);
                }, 0);
                return;
            } catch (err) {
                console.warn('[BF6] Failed to load XML workspace:', err);
                alert('Failed to load XML workspace.');
                return;
            }
        }

        alert('Unrecognized file format. Please load a Blockly workspace JSON (.json) or legacy XML (.xml).');
        })().catch((err) => {
            console.warn('[BF6] File load handler failed:', err);
            alert('Failed to load file.');
        });
    };
    reader.readAsText(file);
}

function focusWorkspaceOnContent(workspace) {
    if (!workspace) return;

    function __bf6PickTopMostBlock(blocks) {
        if (!Array.isArray(blocks) || blocks.length === 0) return null;
        let best = null;
        let bestY = Infinity;
        for (const b of blocks) {
            if (!b) continue;
            let y = null;
            try {
                if (typeof b.getBoundingRectangle === 'function') {
                    const r = b.getBoundingRectangle();
                    if (r && typeof r.top === 'number') y = r.top;
                }
            } catch {
                // ignore
            }
            if (y == null) {
                try {
                    if (typeof b.getRelativeToSurfaceXY === 'function') {
                        const p = b.getRelativeToSurfaceXY();
                        if (p && typeof p.y === 'number') y = p.y;
                    }
                } catch {
                    // ignore
                }
            }
            const yNum = (typeof y === 'number' && isFinite(y)) ? y : Infinity;
            if (!best || yNum < bestY) {
                best = b;
                bestY = yNum;
            }
        }
        return best;
    }

    function __bf6ScrollToBlockTop(block, padding) {
        if (!block) return false;
        let top = null;
        try {
            if (typeof block.getBoundingRectangle === 'function') {
                const r = block.getBoundingRectangle();
                if (r && typeof r.top === 'number') top = r.top;
            }
        } catch {
            // ignore
        }
        if (top == null) {
            try {
                if (typeof block.getRelativeToSurfaceXY === 'function') {
                    const p = block.getRelativeToSurfaceXY();
                    if (p && typeof p.y === 'number') top = p.y;
                }
            } catch {
                // ignore
            }
        }
        if (top == null) return false;

        // Keep current horizontal scroll if possible.
        let x = 0;
        try {
            const m = (typeof workspace.getMetrics === 'function') ? workspace.getMetrics() : null;
            if (m && typeof m.viewLeft === 'number') x = m.viewLeft;
        } catch {
            // ignore
        }
        const y = Math.max(0, top - (padding || 72));
        try {
            if (workspace.scrollbar && typeof workspace.scrollbar.set === 'function') {
                workspace.scrollbar.set(x, y);
                return true;
            }
        } catch {
            // ignore
        }
        try {
            if (typeof workspace.scroll === 'function') {
                workspace.scroll(x, y);
                return true;
            }
        } catch {
            // ignore
        }
        return false;
    }

    function __bf6FocusModStart(padding) {
        try {
            const types = ['MOD_BLOCK', 'modBlock'];
            const all = [];
            for (const t of types) {
                try {
                    const arr = (typeof workspace.getBlocksByType === 'function') ? workspace.getBlocksByType(t, false) : [];
                    if (Array.isArray(arr) && arr.length) all.push(...arr);
                } catch {
                    // ignore
                }
            }
            const mod = __bf6PickTopMostBlock(all);
            if (!mod) return false;
            try {
                if (typeof workspace.centerOnBlock === 'function') {
                    workspace.centerOnBlock(mod.id);
                }
            } catch {
                // ignore
            }
            __bf6ScrollToBlockTop(mod, padding || 72);
            try { if (typeof mod.select === 'function') mod.select(); } catch { /* ignore */ }
            return true;
        } catch {
            return false;
        }
    }

    // Default focus: MOD start (top of MOD where first rule chain attaches).
    try {
        Blockly.svgResize(workspace);
    } catch {
        // ignore
    }
    try {
        if (__bf6FocusModStart(72)) return;
    } catch {
        // ignore
    }

    // Many imported workspaces (e.g. custom_rush) place blocks thousands of pixels away.
    // If we don't zoom/center after load, it *looks* like nothing loaded.
    try {
        if (typeof workspace.zoomToFit === 'function') {
            workspace.zoomToFit();
            return;
        }
    } catch (e) {
        console.debug('[BF6] zoomToFit failed:', e);
    }

    try {
        if (typeof workspace.scrollCenter === 'function') {
            workspace.scrollCenter();
        }
    } catch (e) {
        console.debug('[BF6] scrollCenter failed:', e);
    }

    try {
        const top = (typeof workspace.getTopBlocks === 'function') ? workspace.getTopBlocks(true) : [];
        const first = Array.isArray(top) ? top[0] : null;
        if (first && typeof workspace.centerOnBlock === 'function') {
            workspace.centerOnBlock(first.id);
        }
    } catch (e) {
        console.debug('[BF6] centerOnBlock failed:', e);
    }
}

function logWorkspaceSummary(workspace, filename) {
    try {
        const total = (typeof workspace.getAllBlocks === 'function') ? workspace.getAllBlocks(false).length : 0;
        console.log(`[BF6] Loaded workspace${filename ? ` from ${filename}` : ''}. Blocks: ${total}`);
    } catch {
        // ignore
    }
}

function normalizeWorkspaceState(state) {
    // Blockly JSON serialization format (preferred):
    // { blocks: { languageVersion: 0, blocks: [...] }, variables: [...] }
    if (state && typeof state === 'object') {
        // Some Portal exports wrap the workspace under a top-level container like:
        // { "mod": { blocks: {...}, variables: [...] } }
        // Unwrap it so Blockly's workspace loader sees the expected shape.
        if (state.mod && typeof state.mod === 'object') {
            return normalizeWorkspaceState(state.mod);
        }

        if (state.blocks && typeof state.blocks === 'object' && Array.isArray(state.blocks.blocks)) {
            // Ensure languageVersion exists (some exports omit it).
            if (!('languageVersion' in state.blocks)) {
                state.blocks.languageVersion = 0;
            }
            return state;
        }

        // Some exports may provide the blocks array directly.
        if (Array.isArray(state.blocks)) {
            return {
                blocks: { languageVersion: 0, blocks: state.blocks },
                variables: Array.isArray(state.variables) ? state.variables : [],
            };
        }

        // Sometimes nested.
        if (state.workspace && typeof state.workspace === 'object') {
            return normalizeWorkspaceState(state.workspace);
        }
    }
    return state;
}

// --- Portal compatibility: convert between this tool's internal block schema and
// community/Portal-compatible JSON (as used by built-in presets).

function looksLikePortalWrappedExport(obj) {
    try {
        return !!(obj && typeof obj === 'object' && obj.mod && typeof obj.mod === 'object');
    } catch {
        return false;
    }
}

function looksLikePortalWorkspaceState(state) {
    // Heuristics: portal exports commonly use VALUE-0 style inputs and
    // modBlock/ruleBlock/conditionBlock structural block types.
    try {
        const blocks = state?.blocks?.blocks;
        if (!Array.isArray(blocks) || blocks.length === 0) return false;
        const stack = [...blocks];
        let checked = 0;
        while (stack.length && checked < 50) {
            const b = stack.pop();
            checked++;
            if (!b || typeof b !== 'object') continue;
            const t = String(b.type || '');
            if (t === 'modBlock' || t === 'ruleBlock' || t === 'conditionBlock' || t === 'subroutineBlock') return true;
            const ins = b.inputs || {};
            for (const k of Object.keys(ins)) {
                if (/^VALUE-\d+$/.test(k)) return true;
                const child = ins[k]?.block;
                if (child) stack.push(child);
            }
            const next = b.next?.block;
            if (next) stack.push(next);
        }
    } catch {
        // ignore
    }
    return false;
}

let BF6_PORTAL_SPECS_BY_TYPE = null;
let __BF6_INTERNAL_SHAPES = null;

function buildPortalSpecsFromDocsArray(arr) {
    // Build a compact map: portalType -> { valueInputs: [names], statementInputs: [names] }
    // using bf6portal_blocks.json (args_json).
    const specs = new Map();
    if (!Array.isArray(arr)) return specs;
    for (const item of arr) {
        try {
            const name = item?.name;
            if (typeof name !== 'string' || !name.trim()) continue;
            const portalType = name.trim().split(/\s+/)[0];
            if (!portalType) continue;
            let args = [];
            if (typeof item.args_json === 'string' && item.args_json.trim()) {
                try {
                    args = JSON.parse(item.args_json);
                } catch {
                    args = [];
                }
            }
            const valueInputs = [];
            const statementInputs = [];
            if (Array.isArray(args)) {
                for (const a of args) {
                    if (!a || typeof a !== 'object') continue;
                    const at = String(a.type || '');
                    const an = String(a.name || '');
                    if (!an) continue;
                    if (at === 'input_value') valueInputs.push(an);
                    if (at === 'input_statement') statementInputs.push(an);
                }
            }

            // Prefer the spec with the most information.
            const prev = specs.get(portalType);
            if (!prev || (valueInputs.length + statementInputs.length) > ((prev.valueInputs?.length || 0) + (prev.statementInputs?.length || 0))) {
                specs.set(portalType, { valueInputs, statementInputs });
            }
        } catch {
            // ignore
        }
    }
    return specs;
}

function getPortalSpec(portalType) {
    try {
        if (!BF6_PORTAL_SPECS_BY_TYPE) {
            // If docs haven't loaded yet, we can't build portal specs.
            // Ensure loadBlockDocs() has run.
            return null;
        }
        return BF6_PORTAL_SPECS_BY_TYPE.get(portalType) || null;
    } catch {
        return null;
    }
}

function ensureInternalShapeCache() {
    if (__BF6_INTERNAL_SHAPES) return;
    __BF6_INTERNAL_SHAPES = new Map();
}

function getInternalShape(type) {
    ensureInternalShapeCache();
    if (__BF6_INTERNAL_SHAPES.has(type)) return __BF6_INTERNAL_SHAPES.get(type);

    // Default empty (cached even on failure to avoid repeated work).
    const empty = { valueInputs: [], statementInputs: [] };
    __BF6_INTERNAL_SHAPES.set(type, empty);

    try {
        if (!Blockly || typeof Blockly.Workspace !== 'function') return empty;
        const ws = new Blockly.Workspace();
        const block = ws.newBlock(type);
        // Some blocks rely on init() being called by newBlock; just in case:
        try { if (typeof block.initSvg === 'function') block.initSvg(); } catch {}

        const valueInputs = [];
        const statementInputs = [];
        try {
            const inputTypes = Blockly?.inputTypes;
            for (const inp of (block.inputList || [])) {
                if (!inp || !inp.name) continue;
                if (inputTypes && inp.type === inputTypes.VALUE) valueInputs.push(inp.name);
                else if (inputTypes && inp.type === inputTypes.STATEMENT) statementInputs.push(inp.name);
            }
        } catch {
            // ignore
        }

        // Cleanup
        try { block.dispose(false); } catch {}
        try { ws.dispose(); } catch {}

        const shape = { valueInputs, statementInputs };
        __BF6_INTERNAL_SHAPES.set(type, shape);
        return shape;
    } catch {
        return empty;
    }
}

const PORTAL_TYPE_EXPORT_OVERRIDES = {
    // Structural blocks: tool-internal -> portal/community
    MOD_BLOCK: 'modBlock',
    RULE_HEADER: 'ruleBlock',
    CONDITION_BLOCK: 'conditionBlock',
    condition: 'conditionBlock',
    SUBROUTINE_BLOCK: 'subroutineBlock',
    CALLSUBROUTINE: 'subroutineInstanceBlock',
};

const PORTAL_TYPE_IMPORT_OVERRIDES = {
    // Structural blocks: portal/community -> tool-internal
    modBlock: 'MOD_BLOCK',
    ruleBlock: 'RULE_HEADER',
    conditionBlock: 'condition',
    subroutineBlock: 'SUBROUTINE_BLOCK',
    subroutineInstanceBlock: 'CALLSUBROUTINE',
};

function resolvePortalTypeFromInternalType(internalType) {
    const t = String(internalType || '').trim();
    if (!t) return t;
    if (Object.prototype.hasOwnProperty.call(PORTAL_TYPE_EXPORT_OVERRIDES, t)) return PORTAL_TYPE_EXPORT_OVERRIDES[t];

    // Safety: only convert type names when the block's input arity looks compatible
    // with the Portal spec. This avoids corrupting blocks that happen to share a
    // similar name but use a different schema (fields vs value inputs, etc.).
    try {
        const candidate = (function() {
            const doc = BF6_BLOCK_DOCS ? (BF6_BLOCK_DOCS.get(t) || BF6_BLOCK_DOCS.get(t.toUpperCase()) || BF6_BLOCK_DOCS.get(t.toLowerCase())) : null;
            if (doc && typeof doc.type === 'string' && doc.type.trim()) return doc.type.trim();
            return t;
        })();

        if (candidate && candidate !== t) {
            const spec = getPortalSpec(candidate);
            if (spec) {
                const internalShape = getInternalShape(t);
                const want = (spec.valueInputs?.length || 0) + (spec.statementInputs?.length || 0);
                const have = (internalShape.valueInputs?.length || 0) + (internalShape.statementInputs?.length || 0);
                // If portal expects inputs but internal doesn't match, skip conversion.
                if (want > 0 && have !== want) return t;
            }
        }

        return candidate || t;
    } catch {
        return t;
    }
}

function resolveInternalTypeFromPortalType(portalType) {
    const t = String(portalType || '').trim();
    if (!t) return t;
    if (Object.prototype.hasOwnProperty.call(PORTAL_TYPE_IMPORT_OVERRIDES, t)) return PORTAL_TYPE_IMPORT_OVERRIDES[t];

    // Prefer a type that exists in this build and is schema-compatible with the
    // portal spec (so we don't map a Portal value-input block onto a local
    // field-only block).
    try {
        const spec = getPortalSpec(t);
        const candidates = [];
        if (Blockly?.Blocks && Object.prototype.hasOwnProperty.call(Blockly.Blocks, t)) candidates.push(t);
        const up = t.toUpperCase();
        if (Blockly?.Blocks && Object.prototype.hasOwnProperty.call(Blockly.Blocks, up)) candidates.push(up);

        if (!spec) {
            // No spec information: fall back to "exists" preference.
            return candidates[0] || t;
        }

        const want = (spec.valueInputs?.length || 0) + (spec.statementInputs?.length || 0);
        for (const cand of candidates) {
            const shape = getInternalShape(cand);
            const have = (shape.valueInputs?.length || 0) + (shape.statementInputs?.length || 0);
            if (want === 0 || have === want) return cand;
        }

        // If nothing matched, keep portal type so placeholder blocks retain
        // the correct Portal-shaped inputs.
        return t;
    } catch {
        return t;
    }
}

function remapInputsByPosition(inputsObj, fromNames, toNames) {
    // Rename input keys in `inputsObj` based on positional mapping.
    // Only renames existing keys; leaves extra keys untouched.
    if (!inputsObj || typeof inputsObj !== 'object') return inputsObj;
    if (!Array.isArray(fromNames) || !Array.isArray(toNames)) return inputsObj;

    const out = { ...inputsObj };
    const n = Math.min(fromNames.length, toNames.length);
    for (let i = 0; i < n; i++) {
        const from = fromNames[i];
        const to = toNames[i];
        if (!from || !to || from === to) continue;
        if (!Object.prototype.hasOwnProperty.call(out, from)) continue;
        if (Object.prototype.hasOwnProperty.call(out, to)) continue;
        out[to] = out[from];
        delete out[from];
    }
    return out;
}

function convertBlockTreeInternalToPortal(blockObj) {
    if (!blockObj || typeof blockObj !== 'object') return blockObj;

    const internalType = String(blockObj.type || '');
    const portalType = resolvePortalTypeFromInternalType(internalType);

    // Convert children first (so we don't lose structure).
    if (blockObj.inputs && typeof blockObj.inputs === 'object') {
        const newInputs = {};
        for (const [k, v] of Object.entries(blockObj.inputs)) {
            if (v && typeof v === 'object' && v.block) {
                newInputs[k] = { ...v, block: convertBlockTreeInternalToPortal(v.block) };
            } else {
                newInputs[k] = v;
            }
        }
        blockObj = { ...blockObj, inputs: newInputs };
    }
    if (blockObj.next && blockObj.next.block) {
        blockObj = { ...blockObj, next: { ...blockObj.next, block: convertBlockTreeInternalToPortal(blockObj.next.block) } };
    }

    // Structural field remaps.
    if (internalType === 'RULE_HEADER' && blockObj.fields && typeof blockObj.fields === 'object') {
        const f = { ...blockObj.fields };
        if (Object.prototype.hasOwnProperty.call(f, 'RULE_NAME') && !Object.prototype.hasOwnProperty.call(f, 'NAME')) {
            f.NAME = f.RULE_NAME;
            delete f.RULE_NAME;
        }
        if (Object.prototype.hasOwnProperty.call(f, 'EVENT_TYPE') && !Object.prototype.hasOwnProperty.call(f, 'EVENTTYPE')) {
            f.EVENTTYPE = f.EVENT_TYPE;
            delete f.EVENT_TYPE;
        }
        // Some builds used SCOPE instead of SCOPE_TYPE.
        if (Object.prototype.hasOwnProperty.call(f, 'SCOPE') && !Object.prototype.hasOwnProperty.call(f, 'OBJECTTYPE')) {
            f.OBJECTTYPE = f.SCOPE;
            delete f.SCOPE;
        }
        if (Object.prototype.hasOwnProperty.call(f, 'SCOPE_TYPE') && !Object.prototype.hasOwnProperty.call(f, 'OBJECTTYPE')) {
            f.OBJECTTYPE = f.SCOPE_TYPE;
            delete f.SCOPE_TYPE;
        }
        blockObj = { ...blockObj, fields: f };
    }

    // Input renames based on portal spec + internal shape.
    try {
        if (portalType !== internalType && blockObj.inputs && typeof blockObj.inputs === 'object') {
            const spec = getPortalSpec(portalType);
            if (spec) {
                const internalShape = getInternalShape(internalType);
                const remapped = remapInputsByPosition(blockObj.inputs, internalShape.valueInputs, spec.valueInputs);
                const remapped2 = remapInputsByPosition(remapped, internalShape.statementInputs, spec.statementInputs);
                blockObj = { ...blockObj, inputs: remapped2 };
            }
        }
    } catch {
        // ignore
    }

    if (portalType && portalType !== internalType) {
        blockObj = { ...blockObj, type: portalType };
    }
    return blockObj;
}

function convertBlockTreePortalToInternal(blockObj) {
    if (!blockObj || typeof blockObj !== 'object') return blockObj;

    const portalType = String(blockObj.type || '');
    const internalType = resolveInternalTypeFromPortalType(portalType);

    // Convert children first.
    if (blockObj.inputs && typeof blockObj.inputs === 'object') {
        const newInputs = {};
        for (const [k, v] of Object.entries(blockObj.inputs)) {
            if (v && typeof v === 'object' && v.block) {
                newInputs[k] = { ...v, block: convertBlockTreePortalToInternal(v.block) };
            } else {
                newInputs[k] = v;
            }
        }
        blockObj = { ...blockObj, inputs: newInputs };
    }
    if (blockObj.next && blockObj.next.block) {
        blockObj = { ...blockObj, next: { ...blockObj.next, block: convertBlockTreePortalToInternal(blockObj.next.block) } };
    }

    // Structural field remaps.
    if (portalType === 'ruleBlock' && internalType === 'RULE_HEADER' && blockObj.fields && typeof blockObj.fields === 'object') {
        const f = { ...blockObj.fields };
        if (Object.prototype.hasOwnProperty.call(f, 'NAME') && !Object.prototype.hasOwnProperty.call(f, 'RULE_NAME')) {
            f.RULE_NAME = f.NAME;
            delete f.NAME;
        }
        if (Object.prototype.hasOwnProperty.call(f, 'EVENTTYPE') && !Object.prototype.hasOwnProperty.call(f, 'EVENT_TYPE')) {
            f.EVENT_TYPE = f.EVENTTYPE;
            delete f.EVENTTYPE;
        }
        if (Object.prototype.hasOwnProperty.call(f, 'OBJECTTYPE') && !Object.prototype.hasOwnProperty.call(f, 'SCOPE')) {
            f.SCOPE = f.OBJECTTYPE;
            delete f.OBJECTTYPE;
        }
        blockObj = { ...blockObj, fields: f };
    }

    // Input renames based on portal spec + internal shape.
    try {
        if (portalType !== internalType && blockObj.inputs && typeof blockObj.inputs === 'object') {
            const spec = getPortalSpec(portalType);
            if (spec) {
                const internalShape = getInternalShape(internalType);
                const remapped = remapInputsByPosition(blockObj.inputs, spec.valueInputs, internalShape.valueInputs);
                const remapped2 = remapInputsByPosition(remapped, spec.statementInputs, internalShape.statementInputs);
                blockObj = { ...blockObj, inputs: remapped2 };
            }
        }
    } catch {
        // ignore
    }

    if (internalType && internalType !== portalType) {
        blockObj = { ...blockObj, type: internalType };
    }
    return blockObj;
}

function convertWorkspaceStateInternalToPortal(state) {
    try {
        const s = state && typeof state === 'object' ? JSON.parse(JSON.stringify(state)) : state;
        const blocksArr = s?.blocks?.blocks;
        if (s?.blocks && Array.isArray(blocksArr)) {
            s.blocks.blocks = blocksArr.map(b => convertBlockTreeInternalToPortal(b));
        }
        return s;
    } catch {
        return state;
    }
}

function convertWorkspaceStatePortalToInternal(state) {
    try {
        const s = state && typeof state === 'object' ? JSON.parse(JSON.stringify(state)) : state;
        const blocksArr = s?.blocks?.blocks;
        if (s?.blocks && Array.isArray(blocksArr)) {
            s.blocks.blocks = blocksArr.map(b => convertBlockTreePortalToInternal(b));
        }
        return s;
    } catch {
        return state;
    }
}

function describeMissingBlockTypes(state) {
    const types = collectBlockTypesFromState(state);
    if (!types || types.size === 0) return null;

    const missing = [];
    for (const t of types) {
        // Blockly keeps block definitions in Blockly.Blocks
        if (!Blockly?.Blocks || !Object.prototype.hasOwnProperty.call(Blockly.Blocks, t)) {
            missing.push(t);
        }
    }

    if (missing.length === 0) return null;

    const sample = missing.slice(0, 25);
    const more = missing.length > sample.length ? ` (+${missing.length - sample.length} more)` : '';
    return `Missing block types (${missing.length}):\n- ${sample.join('\n- ')}${more}`;
}

function ensurePortalBlocksRegisteredFromState(state) {
    // Build a model of block shapes from the incoming JSON state and register
    // placeholder blocks for any types not present in this build.
    // This allows importing community templates created in other editors.
    const model = buildPortalBlockModelFromState(state);
    if (!model || model.size === 0) return { created: 0 };

    let created = 0;

    const FORCE_OVERRIDE_TYPES = new Set(['modBlock']);

    for (const [type, info] of model.entries()) {
        if (!type || typeof type !== 'string') continue;
        if (!FORCE_OVERRIDE_TYPES.has(type) && Blockly?.Blocks && Object.prototype.hasOwnProperty.call(Blockly.Blocks, type)) {
            continue;
        }

        Blockly.Blocks[type] = {
            init: function() {
                // Title
                this.appendDummyInput().appendField(type);

                // Fields (best-effort)
                const fieldNames = Array.isArray(info.fieldNames) ? info.fieldNames : [];
                // Important: placeholders must create *all* fields referenced by the
                // incoming JSON, otherwise Blockly serialization throws (field not found).
                for (const fname of fieldNames) {
                    try {
                        this.appendDummyInput()
                            .appendField(`${fname}:`)
                            .appendField(new Blockly.FieldTextInput(''), fname);
                    } catch {
                        // ignore
                    }
                }

                // Inputs
                const statementInputs = Array.isArray(info.statementInputs) ? info.statementInputs : [];
                const valueInputs = Array.isArray(info.valueInputs) ? info.valueInputs : [];

                for (const inName of statementInputs) {
                    try {
                        this.appendStatementInput(inName).appendField(inName);
                    } catch {
                        // ignore
                    }
                }

                for (const inName of valueInputs) {
                    try {
                        this.appendValueInput(inName).appendField(inName);
                    } catch {
                        // ignore
                    }
                }

                // Connection inference
                const role = info.role || 'unknown';
                if (role === 'top') {
                    // no connections
                } else if (role === 'statement') {
                    this.setPreviousStatement(true, null);
                    this.setNextStatement(true, null);
                } else if (role === 'value') {
                    this.setOutput(true, null);
                } else {
                    if (info.hasNext || info.usedAsStatement) {
                        this.setPreviousStatement(true, null);
                        this.setNextStatement(true, null);
                    } else {
                        this.setOutput(true, null);
                    }
                }

                // Visual distinction for placeholders (but try to match the closest
                // real category colour when we can).
                this.setColour(getSuggestedPortalBlockColour(type));
                this.setTooltip('Placeholder block (auto-created during import).');
                this.setHelpUrl('');
            }
        };

        // Also register into the common registry so workspace.newBlock/load works reliably.
        try {
            if (Blockly.common && typeof Blockly.common.defineBlocks === 'function') {
                const defs = {};
                defs[type] = Blockly.Blocks[type];
                Blockly.common.defineBlocks(defs);
            }
        } catch {
            // ignore
        }

        created++;
    }

    return { created };
}

const PLACEHOLDER_DEFAULT_COLOUR = '#5b80a5';
const PORTAL_TYPE_COLOUR_HINTS = {
    // Common structural types from community Portal exports.
    modBlock: '#4A4A4A',
    ruleBlock: '#A285E6',
    conditionBlock: '#45B5B5',
    subroutineBlock: '#E6A85C',
    subroutineInstanceBlock: '#E6A85C',
    variableReferenceBlock: '#0288D1',
    subroutineArgumentBlock: '#0288D1',
};

function getSuggestedPortalBlockColour(type) {
    const t = String(type || '').trim();
    if (!t) return PLACEHOLDER_DEFAULT_COLOUR;

    // Prefer explicit type hints for known Portal structural blocks.
    if (Object.prototype.hasOwnProperty.call(PORTAL_TYPE_COLOUR_HINTS, t)) {
        return PORTAL_TYPE_COLOUR_HINTS[t];
    }

    // Then try local docs (when available).
    const doc = BF6_BLOCK_DOCS ? (BF6_BLOCK_DOCS.get(t) || BF6_BLOCK_DOCS.get(t.toUpperCase()) || BF6_BLOCK_DOCS.get(t.toLowerCase())) : null;
    const c = doc ? doc.colour : null;
    if (typeof c === 'number' && Number.isFinite(c)) return c;
    if (typeof c === 'string' && c.trim()) return c.trim();

    // Heuristic fallback based on name.
    const lower = t.toLowerCase();
    if (lower.includes('condition')) return '#45B5B5';
    if (lower.includes('rule')) return '#A285E6';
    if (lower.includes('subroutine')) return '#E6A85C';
    if (lower.includes('variable')) return '#0288D1';
    if (lower.includes('event')) return '#5CA65C';

    return PLACEHOLDER_DEFAULT_COLOUR;
}

function isAutoPlaceholderBlock(block) {
    try {
        if (!block) return false;
        const tip = (typeof block.getTooltip === 'function') ? block.getTooltip() : (block.tooltip_ || '');
        return String(tip || '').includes('auto-created during import');
    } catch {
        return false;
    }
}

function applyDocColoursToWorkspace(workspace) {
    try {
        if (!workspace || !BF6_BLOCK_DOCS) return;
        if (typeof workspace.getAllBlocks !== 'function') return;
        const blocks = workspace.getAllBlocks(false);
        for (const b of blocks) {
            if (!isAutoPlaceholderBlock(b)) continue;
            const desired = getSuggestedPortalBlockColour(b.type);
            if (desired && desired !== PLACEHOLDER_DEFAULT_COLOUR) {
                try { b.setColour(desired); } catch {}
            }
        }
    } catch {
        // ignore
    }
}

function scheduleApplyDocColoursToWorkspace(maxTries) {
    let tries = 0;
    const limit = (typeof maxTries === 'number' && maxTries > 0) ? maxTries : 20;
    const tick = () => {
        tries++;
        if (window.workspace && BF6_BLOCK_DOCS) {
            applyDocColoursToWorkspace(window.workspace);
            return;
        }
        if (tries < limit) setTimeout(tick, 150);
    };
    setTimeout(tick, 0);
}

function buildPortalBlockModelFromState(state) {
    const model = new Map();

    const isStatementInputName = (name) => {
        if (!name || typeof name !== 'string') return false;
        if (name === 'RULES' || name === 'ACTIONS' || name === 'CONDITIONS') return true;
        if (/^DO\d*$/.test(name)) return true;
        if (/^ELSE\d*$/.test(name)) return true;
        if (name === 'ELSE' || name === 'THEN' || name === 'STACK' || name === 'BODY') return true;
        return false;
    };

    const ensure = (type) => {
        if (!model.has(type)) {
            model.set(type, {
                fieldNames: new Set(),
                statementInputs: new Set(),
                valueInputs: new Set(),
                usedAsStatement: false,
                usedAsValue: false,
                hasNext: false,
                role: 'unknown',
            });
        }
        return model.get(type);
    };

    const visitBlock = (block, context) => {
        if (!block || typeof block !== 'object') return;
        const type = block.type;
        if (typeof type !== 'string') return;

        const info = ensure(type);
        if (context === 'statement') info.usedAsStatement = true;
        if (context === 'value') info.usedAsValue = true;
        if (block.next && block.next.block) info.hasNext = true;

        if (block.fields && typeof block.fields === 'object') {
            for (const k of Object.keys(block.fields)) info.fieldNames.add(k);
        }

        if (block.inputs && typeof block.inputs === 'object') {
            for (const inName of Object.keys(block.inputs)) {
                const input = block.inputs[inName];
                const child = input && (input.block || input.shadow);
                const childContext = isStatementInputName(inName) ? 'statement' : 'value';

                if (isStatementInputName(inName)) info.statementInputs.add(inName);
                else info.valueInputs.add(inName);

                visitBlock(child, childContext);
            }
        }

        if (block.next && block.next.block) {
            visitBlock(block.next.block, 'statement');
        }
    };

    try {
        const blocksRoot = state?.blocks;
        if (blocksRoot && typeof blocksRoot === 'object' && Array.isArray(blocksRoot.blocks)) {
            for (const top of blocksRoot.blocks) visitBlock(top, 'top');
        } else if (Array.isArray(state?.blocks)) {
            for (const top of state.blocks) visitBlock(top, 'top');
        }
    } catch {
        // ignore
    }

    // Special-case known structural Portal block types.
    for (const [type, info] of model.entries()) {
        if (type === 'modBlock' || type === 'subroutineBlock') {
            info.role = 'top';
        } else if (type === 'ruleBlock' || type === 'conditionBlock' || type === 'subroutineInstanceBlock') {
            info.role = 'statement';
        } else if (type === 'variableReferenceBlock' || type === 'subroutineArgumentBlock') {
            info.role = 'value';
        }
    }

    // Convert sets to arrays for stable init ordering.
    const out = new Map();
    for (const [type, info] of model.entries()) {
        out.set(type, {
            fieldNames: Array.from(info.fieldNames).sort(),
            statementInputs: Array.from(info.statementInputs).sort(),
            valueInputs: Array.from(info.valueInputs).sort(),
            usedAsStatement: !!info.usedAsStatement,
            usedAsValue: !!info.usedAsValue,
            hasNext: !!info.hasNext,
            role: info.role,
        });
    }

    return out;
}

function collectBlockTypesFromState(state) {
    const out = new Set();

    const visitBlock = (b) => {
        if (!b || typeof b !== 'object') return;
        if (typeof b.type === 'string') out.add(b.type);

        // Common nested locations in Blockly serialization JSON.
        if (b.next && b.next.block) visitBlock(b.next.block);
        if (b.inputs && typeof b.inputs === 'object') {
            for (const k of Object.keys(b.inputs)) {
                const inp = b.inputs[k];
                if (inp && inp.block) visitBlock(inp.block);
                if (inp && inp.shadow) visitBlock(inp.shadow);
            }
        }

        // Some formats use statement arrays.
        if (Array.isArray(b.blocks)) {
            for (const child of b.blocks) visitBlock(child);
        }
    };

    try {
        const blocksRoot = state?.blocks;
        if (blocksRoot && typeof blocksRoot === 'object' && Array.isArray(blocksRoot.blocks)) {
            for (const top of blocksRoot.blocks) visitBlock(top);
        } else if (Array.isArray(state?.blocks)) {
            for (const top of state.blocks) visitBlock(top);
        }
    } catch {
        // ignore
    }

    return out;
}

function downloadText(text, filename, mimeType) {
    const blob = new Blob([text], { type: mimeType || 'text/plain' });
    const a = document.createElement('a');
    a.download = filename || 'download.txt';
    a.href = URL.createObjectURL(blob);
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function exportToPortalJson() {
    try {
        // Provided by the webpack/TypeScript bundle (see web_ui/src/index.ts).
        const fn = window.bf6ExportForPortal;
        if (typeof fn === 'function') {
            fn();
            return;
        }

        alert(
            'Export Portal is not available in this UI build.\n\n' +
            'Tip: open the packaged app (or web_ui/dist/index.html) which loads the TypeScript bundle, then try again.'
        );
    } catch (e) {
        console.warn('[BF6] Export Portal failed:', e);
        const msg = (e && e.message) ? e.message : String(e);
        alert(`Failed to export Portal JSON.\n\n${msg}`);
    }
}

function exportToTypeScript() {
    try {
        const ts = generateTypeScriptFromWorkspace(window.workspace);
        downloadText(ts, 'bf6_portal_rules.ts', 'text/plain');
    } catch (e) {
        console.warn('[BF6] Export TS failed:', e);
        alert('Failed to export TypeScript. See console for details.');
    }
}

// --- Help / Block docs ---

let BF6_BLOCK_DOCS = null;

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderSimpleMarkdown(text) {
    // Minimal formatting: bold/italic + line breaks. Keep it safe.
    const t = escapeHtml(text || '');
    return t
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/_(.+?)_/g, '<em>$1</em>')
        .replace(/\n/g, '<br/>');
}

async function loadBlockDocs() {
    if (BF6_BLOCK_DOCS) return BF6_BLOCK_DOCS;
    try {
        let arr = null;
        try {
            const res = await fetch('bf6portal_blocks.json', { cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            arr = await res.json();
        } catch (fetchErr) {
            // Electron packaged builds can run under file:// where fetch may be blocked.
            // Fall back to reading the JSON directly from disk when Node integration is available.
            try {
                const req = (typeof require === 'function') ? require : (typeof window !== 'undefined' ? window.require : null);
                if (!req) throw fetchErr;

                const fs = req('fs');
                const urlMod = req('url');
                const fileUrl = new URL('bf6portal_blocks.json', window.location.href);
                const filePath = (typeof urlMod.fileURLToPath === 'function')
                    ? urlMod.fileURLToPath(fileUrl)
                    : decodeURIComponent(fileUrl.pathname || '').replace(/^\//, '');

                const txt = fs.readFileSync(filePath, 'utf8');
                arr = JSON.parse(txt);
            } catch (fsErr) {
                console.warn('[BF6] Failed to load bf6portal_blocks.json via fetch and fs fallback:', fetchErr, fsErr);
                throw fetchErr;
            }
        }

        // Build portal input specs (used for JSON import/export compatibility).
        try {
            BF6_PORTAL_SPECS_BY_TYPE = buildPortalSpecsFromDocsArray(arr);
        } catch {
            BF6_PORTAL_SPECS_BY_TYPE = new Map();
        }

        const map = new Map();
        const upsert = (key, doc) => {
            if (!key || typeof key !== 'string') return;
            const k = key.trim();
            if (!k) return;
            const prev = map.get(k);
            if (!prev || (doc?.tooltip && !prev.tooltip)) {
                map.set(k, doc);
            }
        };

        const toPascalFromSnake = (s) => {
            if (!s || typeof s !== 'string') return '';
            return s
                .split('_')
                .filter(Boolean)
                .map(p => p ? (p[0].toUpperCase() + p.slice(1)) : '')
                .join('');
        };

        if (Array.isArray(arr)) {
            for (const item of arr) {
                const name = item?.name;
                const blockId = item?.block_id;
                if (typeof name !== 'string' || !name.trim()) continue;
                const typeFromName = name.trim().split(/\s+/)[0];
                if (!typeFromName) continue;

                const tooltip = (typeof item.tooltip === 'string') ? item.tooltip : '';
                const colour = item?.colour;

                const doc = {
                    type: typeFromName,
                    blockId: (typeof blockId === 'string') ? blockId : '',
                    displayName: name.replace(/\s*%\d+/g, '').trim(),
                    category: item.category || 'Uncategorized',
                    tooltip,
                    colour: (typeof colour === 'number' || typeof colour === 'string') ? colour : null,
                };

                // Index docs under multiple common identifiers to make lookup resilient.
                upsert(typeFromName, doc);
                upsert(typeFromName.toUpperCase(), doc);
                upsert(typeFromName.toLowerCase(), doc);

                if (typeof blockId === 'string' && blockId.trim()) {
                    const bid = blockId.trim();
                    const pascal = toPascalFromSnake(bid);
                    upsert(bid, doc);
                    upsert(bid.toUpperCase(), doc);
                    upsert(bid.toLowerCase(), doc);
                    if (pascal) {
                        upsert(pascal, doc);
                        upsert(pascal.toUpperCase(), doc);
                        upsert(pascal.toLowerCase(), doc);
                    }
                }
            }
        }

        BF6_BLOCK_DOCS = map;
        // Once docs are available, try to recolour any already-imported placeholders.
        scheduleApplyDocColoursToWorkspace(25);
        return BF6_BLOCK_DOCS;
    } catch (e) {
        console.warn('[BF6] Failed to load bf6portal_blocks.json docs:', e);
        BF6_BLOCK_DOCS = new Map();
        return BF6_BLOCK_DOCS;
    }
}

function getKnownBlockTypes() {
    const types = new Set();
    try {
        const B = (typeof window !== 'undefined') ? window.Blockly : null;
        if (B && B.Blocks) {
            for (const k of Object.keys(B.Blocks)) types.add(k);
        }
    } catch {
        // ignore
    }
    if (BF6_BLOCK_DOCS) {
        for (const k of BF6_BLOCK_DOCS.keys()) types.add(k);
    }
    return Array.from(types).sort((a, b) => a.localeCompare(b));
}

function openHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) modal.style.display = 'flex';
}

function closeHelpModal() {
    const modal = document.getElementById('helpModal');
    if (modal) modal.style.display = 'none';
}

function __bf6NormalizeHelpKey(s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function __bf6ResolveHelpDoc(type) {
    try {
        if (!BF6_BLOCK_DOCS) return null;
        const t = String(type || '').trim();
        if (!t) return null;

        // Fast path: common exact/case variants.
        return (
            BF6_BLOCK_DOCS.get(t) ||
            BF6_BLOCK_DOCS.get(t.toUpperCase()) ||
            BF6_BLOCK_DOCS.get(t.toLowerCase()) ||
            (() => {
                // Last resort: normalized comparison (handles mod_* / casing / underscores).
                const want = __bf6NormalizeHelpKey(t);
                if (!want) return null;
                for (const [k, v] of BF6_BLOCK_DOCS.entries()) {
                    if (__bf6NormalizeHelpKey(k) === want) return v;
                }
                return null;
            })()
        );
    } catch {
        return null;
    }
}

function showHelpForBlockType(type) {
    const titleEl = document.getElementById('helpTitle');
    const bodyEl = document.getElementById('helpBody');
    if (!titleEl || !bodyEl) return;

    const key = String(type || '');
    const doc = BF6_BLOCK_DOCS
        ? (BF6_BLOCK_DOCS.get(key) || BF6_BLOCK_DOCS.get(key.toUpperCase()) || BF6_BLOCK_DOCS.get(key.toLowerCase()))
        : null;
    titleEl.textContent = doc?.displayName || type || 'Block Help';

    const category = doc?.category ? `<div style="opacity:.85; margin-bottom:8px;">Category: <strong>${escapeHtml(doc.category)}</strong></div>` : '';
    const tooltip = doc?.tooltip
        ? `<div style="line-height:1.35;">${renderSimpleMarkdown(doc.tooltip)}</div>`
        : '<div style="opacity:.85;">No documentation found for this block type in the local docs yet. Try the Help index (top bar) and search by name, or update the local docs dataset.</div>';

    bodyEl.innerHTML = `${category}${tooltip}`;
    openHelpModal();
}

function showHelpIndex(filterText) {
    const titleEl = document.getElementById('helpTitle');
    const bodyEl = document.getElementById('helpBody');
    if (!titleEl || !bodyEl) return;

    titleEl.textContent = 'Block Help';

    const ensureIndexUi = () => {
        // Build the help index UI once. Subsequent filtering updates the list only.
        if (document.getElementById('helpSearch') && document.getElementById('helpIndexList')) return;
        bodyEl.innerHTML = `
          <div style="margin-bottom: 10px;">
            <input id="helpSearch" placeholder="Search block types..." value="" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #333; background:#1e1e1e; color:#fff; box-sizing:border-box;" />
          </div>
          <div id="helpIndexList" style="max-height: 55vh; overflow:auto; padding-right: 6px;"></div>
          <div id="helpIndexCount" style="opacity:.7; margin-top:10px; font-size: 12px;"></div>
        `;

        const searchEl = document.getElementById('helpSearch');
        if (searchEl) {
            searchEl.oninput = (ev) => {
                updateHelpIndexList(ev.target.value);
            };
        }
    };

    const updateHelpIndexList = (text) => {
        const listEl = document.getElementById('helpIndexList');
        const countEl = document.getElementById('helpIndexCount');
        if (!listEl || !countEl) return;

        const all = getKnownBlockTypes();
        const q = String(text || '').trim().toLowerCase();
        const filtered = q ? all.filter(t => t.toLowerCase().includes(q)) : all;

        const itemsHtml = filtered.slice(0, 400).map(t => {
            const doc = BF6_BLOCK_DOCS ? (BF6_BLOCK_DOCS.get(t) || BF6_BLOCK_DOCS.get(t.toUpperCase()) || BF6_BLOCK_DOCS.get(t.toLowerCase())) : null;
            const cat = doc?.category ? ` <span style="opacity:.7;">(${escapeHtml(doc.category)})</span>` : '';
            return `<div style="padding:6px 0; border-bottom: 1px solid #333; cursor:pointer;" data-help-type="${escapeHtml(t)}"><strong>${escapeHtml(t)}</strong>${cat}</div>`;
        }).join('');

        listEl.innerHTML = itemsHtml || '<div style="opacity:.85;">No blocks found.</div>';
        countEl.textContent = `Showing ${Math.min(filtered.length, 400)} of ${filtered.length} matched (and ${all.length} total known).`;

        listEl.querySelectorAll('[data-help-type]').forEach((el) => {
            el.addEventListener('click', () => {
                const t = el.getAttribute('data-help-type');
                if (t) showHelpForBlockType(t);
            });
        });
    };

    ensureIndexUi();

    const searchEl = document.getElementById('helpSearch');
    if (searchEl) {
        searchEl.value = String(filterText || '');
        updateHelpIndexList(searchEl.value);
        setTimeout(() => {
            try {
                searchEl.focus();
                const len = searchEl.value.length;
                if (typeof searchEl.setSelectionRange === 'function') {
                    searchEl.setSelectionRange(len, len);
                }
            } catch {
                // ignore
            }
        }, 0);
    } else {
        updateHelpIndexList(filterText);
    }

    openHelpModal();
}

async function initHelpUI() {
    await loadBlockDocs();

    // Help is ready; apply doc-based colours to any imported placeholders.
    scheduleApplyDocColoursToWorkspace(25);

    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', () => showHelpIndex(''));
    }

    const modal = document.getElementById('helpModal');
    const closeEl = modal ? modal.querySelector('.close') : null;
    if (closeEl) closeEl.addEventListener('click', closeHelpModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeHelpModal();
        });
    }

    // Add/override a context-menu item for blocks (both in workspace and flyouts).
    try {
        const B = (typeof window !== 'undefined') ? window.Blockly : null;
        if (B && B.ContextMenuRegistry && B.ContextMenuRegistry.registry) {
            const registry = B.ContextMenuRegistry.registry;

            // Remove Blockly's default "Help" item to avoid having two help menu entries.
            // We'll provide our own help menu that pulls from the local docs / main help.
            try {
                if (registry.getItem && registry.getItem('blockHelp')) {
                    registry.unregister('blockHelp');
                }
            } catch {
                // ignore
            }

            const id = 'bf6portal.helpForBlock';
            // Avoid duplicate registration if hot-reloaded.
            if (!registry.getItem(id)) {
                registry.register({
                    id,
                    scopeType: B.ContextMenuRegistry.ScopeType.BLOCK,
                    displayText: (scope) => {
                        return ((B.Msg && B.Msg.HELP) || 'Help');
                    },
                    preconditionFn: (scope) => (scope?.block?.type ? 'enabled' : 'hidden'),
                    callback: (scope) => {
                        try {
                            const t = scope?.block?.type;
                            if (t) showHelpForBlockType(t);
                        } catch (e) {
                            console.warn('[BF6] Help context menu failed:', e);
                        }
                    },
                    weight: 8,
                });
            }
        }
    } catch (e) {
        console.warn('[BF6] Failed to register Blockly help context menu:', e);
    }
}

// Initialize Help UI after load.
// main.js is loaded before the webpack bundle; delay until Blockly is available.
(function scheduleInitHelpUI() {
    try {
        const B = (typeof window !== 'undefined') ? window.Blockly : (typeof Blockly !== 'undefined' ? Blockly : null);
        if (!B) {
            setTimeout(scheduleInitHelpUI, 50);
            return;
        }
        initHelpUI().catch((e) => console.warn('[BF6] initHelpUI failed:', e));
    } catch (e) {
        console.warn('[BF6] initHelpUI failed:', e);
    }
})();
