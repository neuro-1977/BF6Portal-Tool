import * as Blockly from 'blockly';

/**
 * Helpers for loading Portal/community JSON into the TS/webpack runtime.
 *
 * Many community presets use block types (e.g. `Wait`, `ruleBlock`) that are not
 * necessarily registered in the current build. Blockly serialization will throw
 * if it encounters an unknown type or a missing field.
 *
 * These functions register placeholder blocks on-the-fly so that Portal-shaped
 * JSON can be loaded safely.
 */

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
        // NOTE: We must create *all* fields referenced by incoming JSON, otherwise
        // Blockly serialization will throw during load (field not found).
        for (const fname of fieldNames) {
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

export function ensureCriticalPortalStructuralBlocks() {
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
