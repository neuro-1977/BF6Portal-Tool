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

type PortalBlockModelInfo = {
  fieldNames: string[];
  statementInputs: string[];
  valueInputs: string[];
  usedAsStatement: boolean;
  usedAsValue: boolean;
  hasNext: boolean;
  role: 'unknown' | 'top' | 'statement' | 'value';
};

const PLACEHOLDER_DEFAULT_COLOUR = '#5b80a5';

const PORTAL_TYPE_COLOUR_HINTS: Record<string, string> = {
  // Common structural types from community Portal exports.
  modBlock: '#4A4A4A',
  ruleBlock: '#A285E6',
  conditionBlock: '#45B5B5',
  subroutineBlock: '#E6A85C',
  subroutineInstanceBlock: '#E6A85C',
  variableReferenceBlock: '#0288D1',
  subroutineArgumentBlock: '#0288D1',
};

function getSuggestedPortalBlockColour(type: string): string {
  const t = String(type || '').trim();
  if (!t) return PLACEHOLDER_DEFAULT_COLOUR;

  if (Object.prototype.hasOwnProperty.call(PORTAL_TYPE_COLOUR_HINTS, t)) {
    return PORTAL_TYPE_COLOUR_HINTS[t];
  }

  const lower = t.toLowerCase();
  if (lower.includes('condition')) return '#45B5B5';
  if (lower.includes('rule')) return '#A285E6';
  if (lower.includes('subroutine')) return '#E6A85C';
  if (lower.includes('variable')) return '#0288D1';
  if (lower.includes('event')) return '#5CA65C';

  return PLACEHOLDER_DEFAULT_COLOUR;
}

function buildPortalBlockModelFromState(state: any): Map<string, PortalBlockModelInfo> {
  const model = new Map<
    string,
    {
      fieldNames: Set<string>;
      statementInputs: Set<string>;
      valueInputs: Set<string>;
      usedAsStatement: boolean;
      usedAsValue: boolean;
      hasNext: boolean;
      role: PortalBlockModelInfo['role'];
    }
  >();

  const isStatementInputName = (name: string) => {
    if (!name || typeof name !== 'string') return false;
    if (name === 'RULES' || name === 'ACTIONS' || name === 'CONDITIONS') return true;
    if (/^DO\d*$/.test(name)) return true;
    if (/^ELSE\d*$/.test(name)) return true;
    if (name === 'ELSE' || name === 'THEN' || name === 'STACK' || name === 'BODY') return true;
    return false;
  };

  const ensure = (type: string) => {
    if (!model.has(type)) {
      model.set(type, {
        fieldNames: new Set<string>(),
        statementInputs: new Set<string>(),
        valueInputs: new Set<string>(),
        usedAsStatement: false,
        usedAsValue: false,
        hasNext: false,
        role: 'unknown',
      });
    }
    return model.get(type)!;
  };

  const visitBlock = (block: any, context: 'top' | 'statement' | 'value') => {
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
        const childContext: 'statement' | 'value' = isStatementInputName(inName) ? 'statement' : 'value';

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
  const out = new Map<string, PortalBlockModelInfo>();
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

function ensurePortalBlocksRegisteredFromState(state: any): { created: number } {
  // Build a model of block shapes from the incoming JSON state and register
  // placeholder blocks for any types not present in this build.
  const model = buildPortalBlockModelFromState(state);
  if (!model || model.size === 0) return { created: 0 };

  let created = 0;

  const FORCE_OVERRIDE_TYPES = new Set<string>([
    // These community/template structural types must have specific inputs for load to work.
    'modBlock',
  ]);

  for (const [type, info] of model.entries()) {
    if (!type || typeof type !== 'string') continue;
    if (!FORCE_OVERRIDE_TYPES.has(type) && (Blockly as any)?.Blocks && Object.prototype.hasOwnProperty.call((Blockly as any).Blocks, type)) {
      continue;
    }

    (Blockly as any).Blocks[type] = {
      init: function () {
        // Title
        this.appendDummyInput().appendField(type);

        // Fields (best-effort)
        const fieldNames = Array.isArray(info.fieldNames) ? info.fieldNames : [];
        for (const fname of fieldNames.slice(0, 12)) {
          try {
            this.appendDummyInput().appendField(`${fname}:`).appendField(new (Blockly as any).FieldTextInput(''), fname);
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

        // Visual distinction for placeholders.
        this.setColour(getSuggestedPortalBlockColour(type));
        this.setTooltip('Placeholder block (auto-created during import).');
        this.setHelpUrl('');
      },
    };

    created++;
  }

  return { created };
}

function ensureCriticalPortalStructuralBlocks() {
  // Some preset JSONs require `modBlock` to have a RULES statement input.
  // If a conflicting definition exists, override it.
  try {
    (Blockly as any).Blocks = (Blockly as any).Blocks || {};
    (Blockly as any).Blocks['modBlock'] = {
      init: function () {
        this.appendDummyInput().appendField('MOD');
        try {
          this.appendStatementInput('RULES').appendField('RULES');
        } catch {
          this.appendStatementInput('RULES');
        }
        // Top-level container
        this.setColour(getSuggestedPortalBlockColour('modBlock'));
        this.setTooltip('Portal template MOD container.');
        this.setHelpUrl('');
      },
    };
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

async function saveCurrentWorkspaceAsPreset(workspace: AnyWorkspace) {
  if (!workspace || !Blockly?.serialization?.workspaces?.save) return;

  const selected = getSelectedPresetInfo();
  const builtins = getBuiltInPresets();

  let defaultName = 'My Preset';
  if (selected.kind === 'builtin' && (selected as any).name) defaultName = `${(selected as any).name} (Copy)`;
  if (selected.kind === 'user' && (selected as any).name) defaultName = (selected as any).name;

  const raw = await bf6PromptText({
    title: 'Save Preset',
    label: 'Preset name:',
    defaultValue: defaultName,
  });
  if (raw == null) return;
  let name = String(raw).trim();
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
    const ok = await bf6Confirm({
      title: 'Overwrite preset?',
      message: 'A user preset with that name already exists. Overwrite it?',
      okText: 'Overwrite',
      cancelText: 'Cancel',
    });
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
