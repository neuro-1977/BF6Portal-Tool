import * as Blockly from 'blockly';

const PRESET_STORAGE_KEY = 'bf6portal.presets.user.v1';

type AnyWorkspace = Blockly.WorkspaceSvg;

type BuiltInPreset = {
  id: string;
  name: string;
  url: string;
  locked: true;
};

type UserPreset = {
  name: string;
  state: any;
  createdAt?: string;
  updatedAt?: string;
};

type PresetInfo =
  | { id: ''; kind: 'none'; locked: false }
  | ({ id: string; kind: 'builtin'; locked: true } & BuiltInPreset)
  | { id: string; kind: 'user'; locked: false; name: string; state: any }
  | { id: string; kind: 'unknown'; locked: false };

function getBuiltInPresets(): BuiltInPreset[] {
  return [
    { id: 'builtin:rush', name: 'Andy6170 - Rush (V1.0)', url: 'presets/custom_rush_V1.0.json', locked: true },
    { id: 'builtin:conquest', name: 'Andy6170 - Conquest (7.2)', url: 'presets/custom_conquest_template_7.2.json', locked: true },
    { id: 'builtin:breakthrough', name: 'Andy6170 - Breakthrough (V1.1)', url: 'presets/custom_breakthrough_V1.1.json', locked: true },
  ];
}

function makeUserPresetId(): string {
  return `user:${Date.now()}:${Math.random().toString(16).slice(2)}`;
}

function loadUserPresets(): Record<string, UserPreset> {
  try {
    const raw = window.localStorage?.getItem(PRESET_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, UserPreset>) : {};
  } catch {
    return {};
  }
}

function saveUserPresets(obj: Record<string, UserPreset>) {
  try {
    window.localStorage?.setItem(PRESET_STORAGE_KEY, JSON.stringify(obj || {}));
  } catch {
    // ignore
  }
}

function normalizeWorkspaceState(state: any): any {
  // Blockly JSON serialization format (preferred):
  // { blocks: { languageVersion: 0, blocks: [...] }, variables: [...] }
  if (state && typeof state === 'object') {
    // Unwrap common community/container formats.
    if (state.mod && typeof state.mod === 'object') {
      return normalizeWorkspaceState(state.mod);
    }
    if (state.workspace && typeof state.workspace === 'object') {
      return normalizeWorkspaceState(state.workspace);
    }

    if (state.blocks && typeof state.blocks === 'object' && Array.isArray(state.blocks.blocks)) {
      if (!('languageVersion' in state.blocks)) {
        state.blocks.languageVersion = 0;
      }
      if (!Array.isArray(state.variables)) {
        state.variables = [];
      }
      return state;
    }

    // Some exports provide the blocks array directly.
    if (Array.isArray(state.blocks)) {
      return {
        blocks: { languageVersion: 0, blocks: state.blocks },
        variables: Array.isArray(state.variables) ? state.variables : [],
      };
    }
  }
  return state;
}

function getSelectedPresetInfo(): PresetInfo {
  const select = document.getElementById('presetSelect') as HTMLSelectElement | null;
  const id = select ? String(select.value || '') : '';
  if (!id) return { id: '', kind: 'none', locked: false };

  const builtin = getBuiltInPresets().find((p) => p.id === id);
  if (builtin) return { ...builtin, kind: 'builtin', locked: true };

  const user = loadUserPresets();
  const item = user[id];
  if (item) return { id, kind: 'user', locked: false, name: item.name, state: item.state };

  return { id, kind: 'unknown', locked: false };
}

function updatePresetButtons() {
  const delBtn = document.getElementById('presetDeleteBtn') as HTMLButtonElement | null;
  if (!delBtn) return;

  const info = getSelectedPresetInfo();
  delBtn.disabled = !(info && info.kind === 'user');
  delBtn.style.opacity = delBtn.disabled ? '0.5' : '1';
  delBtn.title = delBtn.disabled ? 'Built-in presets are locked' : 'Delete selected user preset';
}

function refreshPresetDropdown(selectedId?: string) {
  const select = document.getElementById('presetSelect') as HTMLSelectElement | null;
  if (!select) return;

  const builtins = getBuiltInPresets();
  const user = loadUserPresets();
  const userEntries = Object.entries(user)
    .filter(([_, v]) => v && typeof v === 'object' && typeof (v as any).name === 'string')
    .map(([id, v]) => ({ id, name: (v as any).name as string }));

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

function focusWorkspaceOnContent(workspace: AnyWorkspace) {
  try {
    Blockly.svgResize(workspace);
  } catch {
    // ignore
  }
  try {
    // Works in WorkspaceSvg.
    (workspace as any).zoomToFit?.();
  } catch {
    // ignore
  }
  try {
    workspace.scrollCenter();
  } catch {
    // ignore
  }
}

function collectBlockTypesFromState(state: any): Set<string> {
  const out = new Set<string>();

  const visitBlock = (b: any) => {
    if (!b || typeof b !== 'object') return;
    if (typeof b.type === 'string') out.add(b.type);

    if (b.next && b.next.block) visitBlock(b.next.block);
    if (b.inputs && typeof b.inputs === 'object') {
      for (const k of Object.keys(b.inputs)) {
        const inp = b.inputs[k];
        if (inp && inp.block) visitBlock(inp.block);
        if (inp && inp.shadow) visitBlock(inp.shadow);
      }
    }
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

function ensureBlocksRegisteredForState(state: any) {
  // Best-effort: register placeholder blocks for missing types so loads don't hard-fail.
  // (This mirrors legacy behavior in `web_ui/main.js`.)
  const types = collectBlockTypesFromState(state);
  if (types.size === 0) return;

  for (const t of types) {
    try {
      if ((Blockly as any).Blocks && Object.prototype.hasOwnProperty.call((Blockly as any).Blocks, t)) continue;
      (Blockly as any).Blocks[t] = {
        init: function () {
          this.appendDummyInput().appendField(t);
          this.setColour('#5b80a5');
          this.setTooltip('Placeholder block (auto-created during preset/import).');
          this.setHelpUrl('');
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
        },
      };
    } catch {
      // ignore
    }
  }
}

async function loadPresetById(workspace: AnyWorkspace, id: string) {
  if (!workspace) return;

  const select = document.getElementById('presetSelect') as HTMLSelectElement | null;

  // Confirm replacing existing work.
  try {
    const count = typeof workspace.getAllBlocks === 'function' ? workspace.getAllBlocks(false).length : 0;
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

  const info = getSelectedPresetInfo();
  updatePresetButtons();

  if (info.kind === 'builtin') {
    const res = await fetch(info.url, { cache: 'no-store' });
    if (!res.ok) {
      alert(`Failed to load preset: HTTP ${res.status}`);
      return;
    }
    const parsed = await res.json();
    const state = normalizeWorkspaceState(parsed);
    ensureBlocksRegisteredForState(state);

    Blockly.Events.disable();
    try {
      workspace.clear();
      Blockly.serialization.workspaces.load(state, workspace, undefined);
    } finally {
      Blockly.Events.enable();
    }

    setTimeout(() => focusWorkspaceOnContent(workspace), 0);
    return;
  }

  if (info.kind === 'user') {
    const state = normalizeWorkspaceState(info.state);
    ensureBlocksRegisteredForState(state);

    Blockly.Events.disable();
    try {
      workspace.clear();
      Blockly.serialization.workspaces.load(state, workspace, undefined);
    } finally {
      Blockly.Events.enable();
    }

    setTimeout(() => focusWorkspaceOnContent(workspace), 0);
    return;
  }

  if (info.kind === 'unknown') {
    alert('Unknown preset id.');
    // reset selection to placeholder
    if (select) select.value = '';
    updatePresetButtons();
  }
}

function saveCurrentWorkspaceAsPreset(workspace: AnyWorkspace) {
  if (!workspace || !Blockly?.serialization?.workspaces?.save) return;

  const selected = getSelectedPresetInfo();
  const builtins = getBuiltInPresets();

  let defaultName = 'My Preset';
  if (selected.kind === 'builtin' && (selected as any).name) defaultName = `${(selected as any).name} (Copy)`;
  if (selected.kind === 'user' && (selected as any).name) defaultName = (selected as any).name;

  let name = prompt('Preset name:', defaultName);
  if (!name) return;
  name = name.trim();
  if (!name) return;

  // Prevent overwriting built-ins by name.
  if (builtins.some((b) => b.name.toLowerCase() === name.toLowerCase())) {
    alert('That name matches a locked built-in preset. Please choose a different name (it will be saved as a new preset).');
    return;
  }

  const user = loadUserPresets();
  const existingId = Object.keys(user).find((k) => (user[k]?.name || '').toLowerCase() === name.toLowerCase());

  // If user is editing a built-in, always save as a new preset.
  let targetId = selected.kind === 'user' ? selected.id : '';
  if (selected.kind === 'builtin') targetId = '';

  // If the name already exists under a different id, offer overwrite.
  if (existingId && existingId !== targetId) {
    const ok = confirm('A user preset with that name already exists. Overwrite it?');
    if (!ok) return;
    targetId = existingId;
  }

  if (!targetId) targetId = makeUserPresetId();

  const state = Blockly.serialization.workspaces.save(workspace);
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

export function initPresetsUI(workspace: AnyWorkspace) {
  // Always refresh once on init so built-ins show up.
  refreshPresetDropdown('');

  const presetSelect = document.getElementById('presetSelect') as HTMLSelectElement | null;
  const saveBtn = document.getElementById('presetSaveBtn') as HTMLButtonElement | null;
  const delBtn = document.getElementById('presetDeleteBtn') as HTMLButtonElement | null;

  // Capture-phase listeners so legacy `web_ui/main.js` can't interfere (it uses global Blockly).
  if (presetSelect) {
    presetSelect.addEventListener(
      'change',
      (e) => {
        e.stopImmediatePropagation();
        const id = String(presetSelect.value || '');
        if (id) void loadPresetById(workspace, id);
        updatePresetButtons();
      },
      true
    );
  }

  if (saveBtn) {
    saveBtn.addEventListener(
      'click',
      (e) => {
        e.stopImmediatePropagation();
        saveCurrentWorkspaceAsPreset(workspace);
      },
      true
    );
  }

  if (delBtn) {
    delBtn.addEventListener(
      'click',
      (e) => {
        e.stopImmediatePropagation();
        deleteSelectedPreset();
      },
      true
    );
  }

  updatePresetButtons();
}
