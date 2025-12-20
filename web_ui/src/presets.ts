import * as Blockly from 'blockly';
import {
  ensureCriticalPortalStructuralBlocks,
  ensurePortalBlocksRegisteredFromState,
  ensureVariablesExistFromState,
  ensureVariablesExistFromWorkspaceFields,
  normalizeWorkspaceState,
} from './portal_json';

import { focusWorkspaceOnModStart } from './navigation';

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

type ModalResult<T> = Promise<T>;

function ensureBf6ModalRoot(): HTMLDivElement {
  const existing = document.getElementById('bf6-modal-root') as HTMLDivElement | null;
  if (existing) return existing;

  const root = document.createElement('div');
  root.id = 'bf6-modal-root';
  root.style.position = 'fixed';
  root.style.inset = '0';
  root.style.zIndex = '9999';
  root.style.display = 'none';
  document.body.appendChild(root);
  return root;
}

function showBf6Modal(opts: {
  title: string;
  bodyEl: HTMLElement;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}): ModalResult<'ok' | 'cancel'> {
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

  const title = document.createElement('div');
  title.textContent = opts.title;
  title.style.fontSize = '1.15em';
  title.style.fontWeight = '700';
  title.style.marginBottom = '10px';

  const footer = document.createElement('div');
  footer.style.display = 'flex';
  footer.style.gap = '10px';
  footer.style.justifyContent = 'flex-end';
  footer.style.marginTop = '14px';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = opts.cancelText || 'Cancel';
  cancelBtn.style.padding = '8px 12px';
  cancelBtn.style.borderRadius = '10px';
  cancelBtn.style.border = '1px solid #444';
  cancelBtn.style.background = '#1e1e1e';
  cancelBtn.style.color = '#fff';
  cancelBtn.style.cursor = 'pointer';

  const okBtn = document.createElement('button');
  okBtn.textContent = opts.okText || 'OK';
  okBtn.style.padding = '8px 12px';
  okBtn.style.borderRadius = '10px';
  okBtn.style.border = '1px solid #2a2a2a';
  okBtn.style.background = '#007acc';
  okBtn.style.color = '#fff';
  okBtn.style.cursor = 'pointer';

  card.appendChild(title);
  card.appendChild(opts.bodyEl);
  card.appendChild(footer);
  if (opts.showCancel !== false) footer.appendChild(cancelBtn);
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

    const finish = (result: 'ok' | 'cancel') => {
      cleanup();
      close();
      resolve(result);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        try { opts.onCancel?.(); } catch {}
        finish('cancel');
      }
      if (e.key === 'Enter') {
        // Let focused inputs handle Enter; this is still a reasonable default.
        // If a form is present, the caller can prevent default there.
        try { opts.onOk?.(); } catch {}
        finish('ok');
      }
    };

    document.addEventListener('keydown', onKeyDown);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        try { opts.onCancel?.(); } catch {}
        finish('cancel');
      }
    });

    cancelBtn.addEventListener('click', () => {
      try { opts.onCancel?.(); } catch {}
      finish('cancel');
    });

    okBtn.addEventListener('click', () => {
      try { opts.onOk?.(); } catch {}
      finish('ok');
    });
  });
}

async function bf6PromptText(opts: { title: string; label: string; defaultValue: string }): ModalResult<string | null> {
  // Prefer in-app modal (works in packaged Electron even when native prompt is suppressed).
  try {
    const body = document.createElement('div');

    const label = document.createElement('div');
    label.textContent = opts.label;
    label.style.opacity = '0.92';
    label.style.marginBottom = '8px';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = opts.defaultValue || '';
    input.style.width = '100%';
    input.style.boxSizing = 'border-box';
    input.style.padding = '10px 12px';
    input.style.borderRadius = '10px';
    input.style.border = '1px solid #444';
    input.style.background = '#1e1e1e';
    input.style.color = '#fff';
    input.style.outline = 'none';

    body.appendChild(label);
    body.appendChild(input);

    let result: string | null = null;
    const r = await showBf6Modal({
      title: opts.title,
      bodyEl: body,
      okText: 'Save',
      cancelText: 'Cancel',
      onOk: () => {
        result = input.value;
      },
      onCancel: () => {
        result = null;
      },
      showCancel: true,
    });

    // If user clicked OK but input empty, treat as cancel.
    if (r !== 'ok') return null;
    return result;
  } catch {
    // Fallback to native prompt.
    try {
      return prompt(opts.label, opts.defaultValue);
    } catch {
      return null;
    }
  }
}

async function bf6Confirm(opts: { title: string; message: string; okText?: string; cancelText?: string }): ModalResult<boolean> {
  try {
    const body = document.createElement('div');
    body.textContent = opts.message;
    body.style.whiteSpace = 'pre-wrap';
    body.style.opacity = '0.95';

    const r = await showBf6Modal({
      title: opts.title,
      bodyEl: body,
      okText: opts.okText || 'OK',
      cancelText: opts.cancelText || 'Cancel',
      showCancel: true,
    });
    return r === 'ok';
  } catch {
    try {
      return confirm(opts.message);
    } catch {
      return false;
    }
  }
}

async function bf6Alert(opts: { title: string; message: string; okText?: string }): ModalResult<void> {
  try {
    const body = document.createElement('div');
    body.textContent = opts.message;
    body.style.whiteSpace = 'pre-wrap';
    body.style.opacity = '0.95';

    await showBf6Modal({
      title: opts.title,
      bodyEl: body,
      okText: opts.okText || 'OK',
      showCancel: false,
    });
    return;
  } catch {
    try {
      alert(opts.message);
    } catch {
      // ignore
    }
  }
}

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

  // Many imported workspaces place blocks far away. Default to the MOD start so
  // users always land at the beginning of the rule chain.
  try {
    Blockly.svgResize(workspace);
  } catch {
    // ignore
  }

  try {
    if (focusWorkspaceOnModStart(workspace as any, 72)) return;
  } catch {
    // ignore
  }

  // Fallbacks if MOD isn't present.
  try {
    if (typeof (workspace as any).zoomToFit === 'function') {
      (workspace as any).zoomToFit();
      return;
    }
  } catch {
    // ignore
  }

  try {
    if (typeof workspace.scrollCenter === 'function') workspace.scrollCenter();
  } catch {
    // ignore
  }
}

function isDebugLoggingEnabled(): boolean {
  try {
    return String(window?.localStorage?.getItem('bf6_debug') ?? '') === '1';
  } catch {
    return false;
  }
}

function debugLog(...args: any[]): void {
  if (!isDebugLoggingEnabled()) return;
  try {
    console.debug(...args);
  } catch {
    // ignore
  }
}

function recoverToolboxAfterLoad(workspace: AnyWorkspace) {
  if (!workspace) return;

  // Close any open Blockly UI widgets (dropdowns/context menus/tooltips) that
  // can otherwise leave the toolbox in a weird non-interactive state.
  try { (Blockly as any).hideChaff?.(true); } catch { /* ignore */ }
  try { (Blockly as any).WidgetDiv?.hide?.(); } catch { /* ignore */ }
  try { (Blockly as any).DropDownDiv?.hideWithoutAnimation?.(); } catch { /* ignore */ }

  // Force a toolbox rebuild using the current search term (if present).
  // This is more aggressive than refreshSelection and helps recover from cases
  // where the toolbox click handlers stop responding after a programmatic load.
  try {
    const g: any = window as any;
    const searchEl = document.getElementById('blocklySearchInput') as HTMLInputElement | null;
    const term = String(searchEl?.value ?? '');
    const filterFn = g.__bf6_filterToolbox;
    const original = g.__bf6_originalToolbox;

    if (typeof (workspace as any).updateToolbox === 'function') {
      if (typeof filterFn === 'function') {
        (workspace as any).updateToolbox(filterFn(term));
      } else if (original) {
        (workspace as any).updateToolbox(original);
      }
    }
  } catch {
    // ignore
  }

  try { (workspace as any).refreshToolboxSelection?.(); } catch { /* ignore */ }
  try { (workspace as any).getToolbox?.()?.refreshSelection?.(); } catch { /* ignore */ }
  try { Blockly.svgResize(workspace); } catch { /* ignore */ }
}

async function loadJsonFromUrl(url: string): Promise<any> {
  // 1) Prefer fetch in normal web contexts.
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (res && res.ok) {
      return await res.json();
    }
    // If fetch returns a response but it's not OK, keep the HTTP status.
    if (res && !res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (e) {
    // 2) In Electron (file://) fetch can fail; fall back to Node fs.
    try {
      const req = (window as any).require ? (window as any).require : undefined;
      if (!req) throw e;
      const fs = req('fs');
      const path = req('path');
      const { fileURLToPath } = req('url');

      const here = fileURLToPath(window.location.href);
      const baseDir = path.dirname(here);
      const absPath = path.resolve(baseDir, url);
      const raw = fs.readFileSync(absPath, 'utf8');
      return JSON.parse(raw);
    } catch (e2: any) {
      const msg = String((e2 && e2.message) ? e2.message : e2);
      throw new Error(`Failed to load preset asset "${url}": ${msg}`);
    }
  }

  // Should not reach here, but keep a clear error.
  throw new Error(`Failed to load preset asset "${url}"`);
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
    let parsed: any;
    try {
      parsed = await loadJsonFromUrl(info.url);
    } catch (e: any) {
      console.warn('[BF6] Failed to load built-in preset:', e);
      alert(`Failed to load preset.\n\n${String(e?.message || e)}`);
      return;
    }
    const state = normalizeWorkspaceState(parsed);
    // Make sure the key structural container blocks exist and have required inputs.
    ensureCriticalPortalStructuralBlocks();
    try {
      const r = ensurePortalBlocksRegisteredFromState(state);
      if (r?.created) debugLog(`[BF6] Auto-registered ${r.created} block types for preset load.`);
    } catch (e) {
      console.warn('[BF6] Failed to auto-register block types:', e);
    }

    Blockly.Events.disable();
    try {
      workspace.clear();
      // Create variable models first so FieldVariable IDs resolve cleanly during load.
      ensureVariablesExistFromState(workspace, state);
      await Promise.resolve((Blockly.serialization.workspaces.load(state, workspace, undefined) as any));
      // Defensive (post-load): ensure the variable map reflects any serialized variables.
      ensureVariablesExistFromState(workspace, state);
      // Extra defensive: if variables were only referenced in blocks (or hydration was partial),
      // ensure models exist so the Variables flyout can enumerate them.
      ensureVariablesExistFromWorkspaceFields(workspace as any);
    } catch (e: any) {
      console.warn('[BF6] Failed to load preset workspace:', e);
      alert(`Failed to load preset.\n\n${String(e?.message || e)}`);
    } finally {
      Blockly.Events.enable();
    }

    // Recovery: rebuild toolbox + close any open UI widgets.
    recoverToolboxAfterLoad(workspace);

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
      if (r?.created) debugLog(`[BF6] Auto-registered ${r.created} block types for preset load.`);
    } catch (e) {
      console.warn('[BF6] Failed to auto-register block types:', e);
    }

    Blockly.Events.disable();
    try {
      workspace.clear();
      // Create variable models first so FieldVariable IDs resolve cleanly during load.
      ensureVariablesExistFromState(workspace, state);
      await Promise.resolve((Blockly.serialization.workspaces.load(state, workspace, undefined) as any));
      // Defensive (post-load): ensure the variable map reflects any serialized variables.
      ensureVariablesExistFromState(workspace, state);
      ensureVariablesExistFromWorkspaceFields(workspace as any);
    } catch (e: any) {
      console.warn('[BF6] Failed to load preset workspace:', e);
      alert(`Failed to load preset.\n\n${String(e?.message || e)}`);
    } finally {
      Blockly.Events.enable();
    }

    recoverToolboxAfterLoad(workspace);

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

async function saveCurrentWorkspaceAsPreset(workspace: AnyWorkspace) {
  if (!workspace || !Blockly?.serialization?.workspaces?.save) return;

  const selected = getSelectedPresetInfo();
  const builtins = getBuiltInPresets();

  let defaultName = 'My Preset';
  if (selected.kind === 'builtin' && (selected as any).name) defaultName = `${(selected as any).name} (Copy)`;
  if (selected.kind === 'user' && (selected as any).name) defaultName = (selected as any).name;

  const dialog: any = (Blockly as any).dialog;
  const promptAsync = (message: string, initialValue: string) =>
    new Promise<string | null>((resolve) => {
      try {
        if (dialog?.prompt && typeof dialog.prompt === 'function') {
          dialog.prompt(message, initialValue ?? '', (v: string | null) => resolve(v));
          return;
        }
      } catch {
        // ignore
      }
      resolve(null);
    });

  void (async () => {
    const raw = await promptAsync('Preset name:', defaultName);
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
  })();
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

  // IMPORTANT:
  // `web_ui/main.js` (legacy boot script) also binds listeners to these same DOM
  // elements. If both handlers run, the legacy one can load presets without
  // variable hydration and leave the Variables flyout empty.
  //
  // We cannot reliably remove anonymous legacy listeners, so we replace the
  // elements with clones (which clears all listeners) and then attach the TS
  // handlers.
  const scrubListeners = <T extends HTMLElement>(el: T | null): T | null => {
    if (!el || !el.parentNode) return el;
    try {
      const clone = el.cloneNode(true) as T;
      // Preserve current value for selects.
      try {
        if ((el as any).value !== undefined) (clone as any).value = (el as any).value;
      } catch {
        // ignore
      }
      el.parentNode.replaceChild(clone, el);
      return clone;
    } catch {
      return el;
    }
  };

  const presetSelect = scrubListeners(document.getElementById('presetSelect') as HTMLSelectElement | null);
  const saveBtn = scrubListeners(document.getElementById('presetSaveBtn') as HTMLButtonElement | null);
  const delBtn = scrubListeners(document.getElementById('presetDeleteBtn') as HTMLButtonElement | null);

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
          void saveCurrentWorkspaceAsPreset(workspace);
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
