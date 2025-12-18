import * as Blockly from 'blockly';
import {
  ensureCriticalPortalStructuralBlocks,
  ensurePortalBlocksRegisteredFromState,
  normalizeWorkspaceState,
} from './portal_json';

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
    { id: 'builtin:conquest', name: 'Andy6170 - Conquest (V8.0)', url: 'presets/custom_conquest_template_V8.0.json', locked: true },
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
  if (!workspace) return;

  // Many imported workspaces (including the shipped templates) place blocks far away.
  // If we don't zoom/center after load, it can look like nothing loaded.
  try {
    Blockly.svgResize(workspace);
  } catch {
    // ignore
  }

  try {
    if (typeof (workspace as any).zoomToFit === 'function') {
      (workspace as any).zoomToFit();
      return;
    }
  } catch {
    // ignore
  }

  try {
    if (typeof workspace.scrollCenter === 'function') {
      workspace.scrollCenter();
    }
  } catch {
    // ignore
  }

  try {
    const top = typeof workspace.getTopBlocks === 'function' ? workspace.getTopBlocks(true) : [];
    const first = Array.isArray(top) ? top[0] : null;
    if (first && typeof (workspace as any).centerOnBlock === 'function') {
      (workspace as any).centerOnBlock(first.id);
    }
  } catch {
    // ignore
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
    // Make sure the key structural container blocks exist and have required inputs.
    ensureCriticalPortalStructuralBlocks();
    try {
      const r = ensurePortalBlocksRegisteredFromState(state);
      if (r?.created) console.log(`[BF6] Auto-registered ${r.created} block types for preset load.`);
    } catch (e) {
      console.warn('[BF6] Failed to auto-register block types:', e);
    }

    Blockly.Events.disable();
    try {
      workspace.clear();
      await Promise.resolve((Blockly.serialization.workspaces.load(state, workspace, undefined) as any));
    } catch (e: any) {
      console.warn('[BF6] Failed to load preset workspace:', e);
      alert(`Failed to load preset.\n\n${String(e?.message || e)}`);
    } finally {
      Blockly.Events.enable();
    }

    setTimeout(() => {
      try {
        focusWorkspaceOnContent(workspace);
      } catch {
        // ignore
      }
    }, 0);
    return;
  }

  if (info.kind === 'user') {
    const state = normalizeWorkspaceState(info.state);

    ensureCriticalPortalStructuralBlocks();

    try {
      const r = ensurePortalBlocksRegisteredFromState(state);
      if (r?.created) console.log(`[BF6] Auto-registered ${r.created} block types for preset load.`);
    } catch (e) {
      console.warn('[BF6] Failed to auto-register block types:', e);
    }

    Blockly.Events.disable();
    try {
      workspace.clear();
      await Promise.resolve((Blockly.serialization.workspaces.load(state, workspace, undefined) as any));
    } catch (e: any) {
      console.warn('[BF6] Failed to load preset workspace:', e);
      alert(`Failed to load preset.\n\n${String(e?.message || e)}`);
    } finally {
      Blockly.Events.enable();
    }

    setTimeout(() => {
      try {
        focusWorkspaceOnContent(workspace);
      } catch {
        // ignore
      }
    }, 0);
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

  const raw = prompt('Preset name:', defaultName);
  if (raw == null) return;
  let name = raw.trim();
  if (!name) return;

  // Prevent overwriting built-ins by name.
  if (builtins.some((b) => b.name.toLowerCase() === name.toLowerCase())) {
    // Friendly UX: don't hard-block. Auto-suffix so users can quickly save a copy.
    name = `${name} (Copy)`;
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
        if (id) void loadPresetById(workspace, id).catch((err) => console.warn('[BF6] Preset load failed:', err));
        updatePresetButtons();
      },
      true
    );
  }

  if (saveBtn) {
    saveBtn.addEventListener(
      'click',
      (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        e.stopPropagation();
        try {
          saveCurrentWorkspaceAsPreset(workspace);
        } catch (err) {
          console.warn('[BF6] Save preset failed:', err);
          try {
            alert(`Save preset failed: ${String((err as any)?.message || err)}`);
          } catch {
            // ignore
          }
        }
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
