import * as Blockly from 'blockly';

/**
 * Utilities for importing/exporting Portal-style Blockly JSON.
 *
 * Portal community/official exports commonly wrap the workspace state as:
 *   { "mod": { "blocks": { languageVersion: 0, blocks: [...] } } }
 */

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

/**
 * Normalize various community/Portal wrapper formats into Blockly's workspace state
 * shape expected by `Blockly.serialization.workspaces.load`.
 */
export function normalizeWorkspaceState(state: any): any {
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

/**
 * Ensure variables from a serialized workspace state are present in the target
 * workspace's variable map.
 *
 * This is a defensive step for community/Portal exports that sometimes omit
 * variable map updates during load in certain environments.
 */
export function ensureVariablesExistFromState(workspace: Blockly.WorkspaceSvg, state: any): void {
  try {
    if (!workspace) return;
    if (!state || typeof state !== 'object') return;

    const map = (workspace as any).getVariableMap ? (workspace as any).getVariableMap() : null;
    if (!map || typeof map.getAllVariables !== 'function') return;

    const existingIds = new Set<string>();
    const existingNamesLower = new Set<string>();
    try {
      const vars = map.getAllVariables();
      for (const v of vars || []) {
        try {
          const vAny: any = v as any;
          const id = vAny?.getId ? String(vAny.getId()) : String(vAny?.id ?? '');
          const name = String(vAny?.name ?? '');
          if (id) existingIds.add(id);
          if (name) existingNamesLower.add(name.toLowerCase());
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore
    }

    const upsert = (id: string, name: string, type: string) => {
      const cleanName = String(name || '').trim();
      if (!cleanName) return;
      const cleanId = typeof id === 'string' ? id : '';
      const cleanType = typeof type === 'string' ? type : '';
      if (cleanId && existingIds.has(cleanId)) return;
      if (!cleanId && existingNamesLower.has(cleanName.toLowerCase())) return;
      try {
        (workspace as any).createVariable?.(cleanName, cleanType || undefined, cleanId || undefined);
        if (cleanId) existingIds.add(cleanId);
        existingNamesLower.add(cleanName.toLowerCase());
      } catch {
        // ignore
      }
    };

    // 1) Preferred: explicit `variables` array.
    try {
      if (Array.isArray((state as any).variables)) {
        for (const v of (state as any).variables as any[]) {
          if (!v || typeof v !== 'object') continue;
          const id = typeof (v as any).id === 'string' ? (v as any).id : '';
          const name = typeof (v as any).name === 'string' ? (v as any).name : '';
          const type = typeof (v as any).type === 'string' ? (v as any).type : '';
          upsert(id, name, type);
        }
      }
    } catch {
      // ignore
    }

    // 2) Defensive: scan serialized block fields for variable references.
    // Some community presets/templates omit `variables: []` but still reference
    // variables via field objects like {id,name,type} inside block.fields.
    const visitBlock = (block: any) => {
      if (!block || typeof block !== 'object') return;
      try {
        const fields = (block as any).fields;
        if (fields && typeof fields === 'object') {
          for (const value of Object.values(fields)) {
            const v: any = value as any;
            if (!v || typeof v !== 'object') continue;
            const id = typeof v.id === 'string' ? v.id : '';
            const name = typeof v.name === 'string' ? v.name : '';
            const type = typeof v.type === 'string' ? v.type : '';
            if (name) upsert(id, name, type);
          }
        }

        const inputs = (block as any).inputs;
        if (inputs && typeof inputs === 'object') {
          for (const input of Object.values(inputs)) {
            const child = (input as any)?.block || (input as any)?.shadow;
            if (child) visitBlock(child);
          }
        }

        const next = (block as any).next?.block;
        if (next) visitBlock(next);
      } catch {
        // ignore
      }
    };

    try {
      const blocksRoot = (state as any)?.blocks;
      if (blocksRoot && typeof blocksRoot === 'object' && Array.isArray((blocksRoot as any).blocks)) {
        for (const top of (blocksRoot as any).blocks) visitBlock(top);
      } else if (Array.isArray((state as any)?.blocks)) {
        for (const top of (state as any).blocks) visitBlock(top);
      }
    } catch {
      // ignore
    }
  } catch {
    // ignore
  }
}

/**
 * Extra defensive pass: ensure that variables referenced by blocks that are
 * already in the workspace have corresponding VariableModels.
 *
 * This is useful after deserialization in environments where the variable map
 * doesn't fully hydrate.
 */
export function ensureVariablesExistFromWorkspaceFields(workspace: Blockly.WorkspaceSvg): void {
  try {
    if (!workspace) return;
    const map = (workspace as any).getVariableMap ? (workspace as any).getVariableMap() : null;
    if (!map) return;

    const existingIds = new Set<string>();
    try {
      const vars = map.getAllVariables?.() || [];
      for (const v of vars) {
        try {
          const vAny: any = v as any;
          const id = vAny?.getId ? String(vAny.getId()) : String(vAny?.id ?? '');
          if (id) existingIds.add(id);
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore
    }

    const blocks: any[] = (workspace as any).getAllBlocks ? (workspace as any).getAllBlocks(false) : [];
    for (const b of blocks || []) {
      try {
        const inputs = (b as any)?.inputList || [];
        for (const input of inputs) {
          const row = (input as any)?.fieldRow || [];
          for (const field of row) {
            const f: any = field as any;
            // Blockly FieldVariable implements referencesVariables().
            const refs = typeof f?.referencesVariables === 'function' ? !!f.referencesVariables() : false;
            if (!refs) continue;

            const id = String(f?.getValue?.() ?? '');
            const name = String(f?.getText?.() ?? '').trim();
            const type = String((f?.getVariableTypes?.()?.[0] ?? f?.getVariableType?.() ?? '') || '');

            if (!name) continue;
            if (id && existingIds.has(id)) continue;

            try {
              (workspace as any).createVariable?.(name, type || undefined, id || undefined);
              if (id) existingIds.add(id);
            } catch {
              // ignore
            }
          }
        }
      } catch {
        // ignore
      }
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

export function ensurePortalBlocksRegisteredFromState(state: any): { created: number } {
  // Build a model of block shapes from the incoming JSON state and register
  // placeholder blocks for any types not present in this build.
  const model = buildPortalBlockModelFromState(state);
  if (!model || model.size === 0) return { created: 0 };

  let created = 0;

  const FORCE_OVERRIDE_TYPES = new Set<string>([
    // These community/template structural types must have specific inputs for load to work.
    'modBlock',
  ]);

  const defineCompat = (type: string, def: any) => {
    try {
      (Blockly as any).Blocks = (Blockly as any).Blocks || {};
      (Blockly as any).Blocks[type] = def;
    } catch {
      // ignore
    }

    // Blockly v12+ primarily looks in the common registry when creating blocks.
    // Defining via `Blockly.Blocks[...] = ...` alone may not be sufficient.
    try {
      const defs: any = {};
      defs[type] = def;
      Blockly.common.defineBlocks(defs);
    } catch {
      // ignore (already defined or registry rejects override)
    }
  };

  for (const [type, info] of model.entries()) {
    if (!type || typeof type !== 'string') continue;

    const blocksRegistry = (Blockly as any)?.Blocks;
    if (!FORCE_OVERRIDE_TYPES.has(type) && blocksRegistry && Object.prototype.hasOwnProperty.call(blocksRegistry, type)) {
      continue;
    }

    const def: any = {
      init: function (this: Blockly.Block) {
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

    defineCompat(type, def);

    created++;
  }

  return { created };
}

export function ensureCriticalPortalStructuralBlocks() {
  // Some preset JSONs require `modBlock` to have a RULES statement input.
  // If a conflicting definition exists, override it.
  try {
    const def: any = {
      init: function (this: Blockly.Block) {
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

    try {
      (Blockly as any).Blocks = (Blockly as any).Blocks || {};
      (Blockly as any).Blocks['modBlock'] = def;
    } catch {
      // ignore
    }

    try {
      Blockly.common.defineBlocks({ modBlock: def } as any);
    } catch {
      // ignore
    }
  } catch {
    // ignore
  }
}

/**
 * Convert a Blockly workspace state into an official-ish Portal export wrapper.
 *
 * Official Portal exports commonly only include blocks under `mod.blocks`.
 */
export function wrapPortalExport(state: any): any {
  const normalized = normalizeWorkspaceState(state);
  if (normalized && typeof normalized === 'object' && normalized.blocks && typeof normalized.blocks === 'object') {
    return {
      mod: {
        blocks: normalized.blocks,
        variables: Array.isArray((normalized as any).variables) ? (normalized as any).variables : [],
      },
    };
  }
  return { mod: { blocks: { languageVersion: 0, blocks: [] }, variables: [] } };
}
