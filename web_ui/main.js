// Main Entry Point for BF6 Portal Tool
// This file handles the initialization of the UI, Blockly, and event listeners.

document.addEventListener('DOMContentLoaded', () => {
    console.log("[BF6] DOM Loaded. Initializing...");

    setupAboutQuotes().catch((e) => console.warn('[BF6] setupAboutQuotes failed:', e));
    setupAboutModal();
    setupCodePreviewDrawer();

    // Prefer the simple injection path for stability.
    // If you want to switch back to StartupSequence later, you can.
    // fallbackInjection();

    // Initialize Button Listeners
    setupButtonListeners();
});

function setupCodePreviewDrawer() {
    const toggleBtn = document.getElementById('terminal-toggle');
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
        'exportTsBtn': () => exportToTypeScript(),
        'presetSaveBtn': () => saveCurrentWorkspaceAsPreset(),
        'presetDeleteBtn': () => deleteSelectedPreset(),
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
        const res = await fetch(info.url, { cache: 'no-store' });
        if (!res.ok) {
            alert(`Failed to load preset: HTTP ${res.status}`);
            return;
        }
        const parsed = await res.json();
        const state = normalizeWorkspaceState(parsed);
        try { ensurePortalBlocksRegisteredFromState(state); } catch {}
        Blockly.Events.disable();
        try {
            window.workspace.clear();
            Blockly.serialization.workspaces.load(state, window.workspace, undefined);
        } finally {
            Blockly.Events.enable();
        }
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
        try { ensurePortalBlocksRegisteredFromState(state); } catch {}
        Blockly.Events.disable();
        try {
            window.workspace.clear();
            Blockly.serialization.workspaces.load(state, window.workspace, undefined);
        } finally {
            Blockly.Events.enable();
        }
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

function saveCurrentWorkspaceAsPreset() {
    if (!window.workspace || !Blockly?.serialization?.workspaces?.save) return;

    const selected = getSelectedPresetInfo();
    const builtins = getBuiltInPresets();

    let defaultName = 'My Preset';
    if (selected.kind === 'builtin' && selected.name) defaultName = `${selected.name} (Copy)`;
    if (selected.kind === 'user' && selected.name) defaultName = selected.name;

    let name = prompt('Preset name:', defaultName);
    if (!name) return;
    name = name.trim();
    if (!name) return;

    // Prevent overwriting built-ins by name.
    if (builtins.some(b => b.name.toLowerCase() === name.toLowerCase())) {
        alert('That name matches a locked built-in preset. Please choose a different name (it will be saved as a new preset).');
        return;
    }

    const user = loadUserPresets();
    const existingId = Object.keys(user).find(k => (user[k]?.name || '').toLowerCase() === name.toLowerCase());

    // If user is editing a built-in, always save as a new preset.
    let targetId = (selected.kind === 'user') ? selected.id : '';
    if (selected.kind === 'builtin') targetId = '';

    // If the name already exists under a different id, offer overwrite.
    if (existingId && existingId !== targetId) {
        const ok = confirm('A user preset with that name already exists. Overwrite it?');
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
    alert(`Saved preset: ${name}`);
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

function saveWorkspace() {
    if (!window.workspace) return;

    // Prefer JSON serialization (matches the "Save JSON" button label).
    if (Blockly?.serialization?.workspaces?.save) {
        try {
            const state = Blockly.serialization.workspaces.save(window.workspace);
            const jsonText = JSON.stringify(state, null, 2);
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
                const state = normalizeWorkspaceState(parsed);
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

                alert('Failed to load JSON. This expects a Blockly workspace JSON export from this tool.');
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
    };
    reader.readAsText(file);
}

function focusWorkspaceOnContent(workspace) {
    if (!workspace) return;

    // Many imported workspaces (e.g. custom_rush) place blocks thousands of pixels away.
    // If we don't zoom/center after load, it *looks* like nothing loaded.
    try {
        if (typeof workspace.zoomToFit === 'function') {
            workspace.zoomToFit();
            return;
        }
    } catch (e) {
        console.warn('[BF6] zoomToFit failed:', e);
    }

    try {
        if (typeof workspace.scrollCenter === 'function') {
            workspace.scrollCenter();
        }
    } catch (e) {
        console.warn('[BF6] scrollCenter failed:', e);
    }

    try {
        const top = (typeof workspace.getTopBlocks === 'function') ? workspace.getTopBlocks(true) : [];
        const first = Array.isArray(top) ? top[0] : null;
        if (first && typeof workspace.centerOnBlock === 'function') {
            workspace.centerOnBlock(first.id);
        }
    } catch (e) {
        console.warn('[BF6] centerOnBlock failed:', e);
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

    for (const [type, info] of model.entries()) {
        if (!type || typeof type !== 'string') continue;
        if (Blockly?.Blocks && Object.prototype.hasOwnProperty.call(Blockly.Blocks, type)) {
            continue;
        }

        Blockly.Blocks[type] = {
            init: function() {
                // Title
                this.appendDummyInput().appendField(type);

                // Fields (best-effort)
                const fieldNames = Array.isArray(info.fieldNames) ? info.fieldNames : [];
                for (const fname of fieldNames.slice(0, 12)) {
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
        const res = await fetch('bf6portal_blocks.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const arr = await res.json();

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
        if (Blockly?.Blocks) {
            for (const k of Object.keys(Blockly.Blocks)) types.add(k);
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
    const tooltip = doc?.tooltip ? `<div style="line-height:1.35;">${renderSimpleMarkdown(doc.tooltip)}</div>` : '<div style="opacity:.85;">No documentation found for this block type in the local docs yet.</div>';

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

    // Add a context-menu item for blocks (both in workspace and flyouts).
    try {
        if (Blockly?.ContextMenuRegistry?.registry) {
            const registry = Blockly.ContextMenuRegistry.registry;

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
                    scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
                    displayText: (scope) => {
                        return (Blockly?.Msg?.HELP || 'Help');
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
setTimeout(() => {
    try { initHelpUI(); } catch (e) { console.warn('[BF6] initHelpUI failed:', e); }
}, 0);
