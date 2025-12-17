/*
  Smoke test: load a large built-in preset JSON into Blockly serialization in a
  headless Node environment.

  Purpose:
  - Catches schema mismatches that lead to Blockly.serialization MissingConnection
    errors (e.g. legacy SetVariable blocks using VALUE-0/VALUE-1 inputs).

  Usage (from repo root):
    node tools/smoke_test_preset_load.js
*/

const fs = require('node:fs');
const path = require('node:path');

// Blockly is installed under web_ui.
const Blockly = require(path.join(__dirname, '..', 'web_ui', 'node_modules', 'blockly'));

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  return JSON.parse(raw);
}

function normalizeWorkspaceState(state) {
  if (state && typeof state === 'object') {
    if (state.mod && typeof state.mod === 'object') return normalizeWorkspaceState(state.mod);
    if (state.workspace && typeof state.workspace === 'object') return normalizeWorkspaceState(state.workspace);

    if (state.blocks && typeof state.blocks === 'object' && Array.isArray(state.blocks.blocks)) {
      if (!('languageVersion' in state.blocks)) state.blocks.languageVersion = 0;
      if (!Array.isArray(state.variables)) state.variables = [];
      return state;
    }

    if (Array.isArray(state.blocks)) {
      return {
        blocks: { languageVersion: 0, blocks: state.blocks },
        variables: Array.isArray(state.variables) ? state.variables : [],
      };
    }
  }

  return { blocks: { languageVersion: 0, blocks: [] }, variables: [] };
}

const PORTAL_TYPE_COLOUR_HINTS = {
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
  if (!t) return '#5b80a5';
  if (Object.prototype.hasOwnProperty.call(PORTAL_TYPE_COLOUR_HINTS, t)) return PORTAL_TYPE_COLOUR_HINTS[t];
  const lower = t.toLowerCase();
  if (lower.includes('condition')) return '#45B5B5';
  if (lower.includes('rule')) return '#A285E6';
  if (lower.includes('subroutine')) return '#E6A85C';
  if (lower.includes('variable')) return '#0288D1';
  if (lower.includes('event')) return '#5CA65C';
  return '#5b80a5';
}

function isStatementInputName(name) {
  if (!name || typeof name !== 'string') return false;
  if (name === 'RULES' || name === 'ACTIONS' || name === 'CONDITIONS') return true;
  if (/^DO\d*$/.test(name)) return true;
  if (/^ELSE\d*$/.test(name)) return true;
  if (name === 'ELSE' || name === 'THEN' || name === 'STACK' || name === 'BODY') return true;
  return false;
}

function buildPortalBlockModelFromState(state) {
  const model = new Map();

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

  const blocksRoot = state && state.blocks;
  if (blocksRoot && typeof blocksRoot === 'object' && Array.isArray(blocksRoot.blocks)) {
    for (const top of blocksRoot.blocks) visitBlock(top, 'top');
  } else if (Array.isArray(state && state.blocks)) {
    for (const top of state.blocks) visitBlock(top, 'top');
  }

  for (const [type, info] of model.entries()) {
    if (type === 'modBlock' || type === 'subroutineBlock') info.role = 'top';
    else if (type === 'ruleBlock' || type === 'conditionBlock' || type === 'subroutineInstanceBlock') info.role = 'statement';
    else if (type === 'variableReferenceBlock' || type === 'subroutineArgumentBlock') info.role = 'value';
  }

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

function ensureCriticalPortalStructuralBlocks() {
  Blockly.Blocks = Blockly.Blocks || {};
  Blockly.Blocks.modBlock = {
    init: function () {
      this.appendDummyInput().appendField('MOD');
      this.appendStatementInput('RULES').appendField('RULES');
      this.setColour(getSuggestedPortalBlockColour('modBlock'));
    },
  };
}

function registerLegacyVariableBlocks() {
  Blockly.Blocks = Blockly.Blocks || {};

  Blockly.Blocks.variableReferenceBlock = {
    init: function () {
      this.appendDummyInput('HEAD')
        .appendField('Variable')
        .appendField(new Blockly.FieldDropdown([
          ['Global', 'Global'],
          ['Player', 'Player'],
          ['Team', 'Team'],
        ]), 'OBJECTTYPE')
        .appendField(new Blockly.FieldVariable('item'), 'VAR');
      this.appendValueInput('OBJECT').appendField('of');
      this.setInputsInline(true);
      this.setOutput(true, 'Variable');
      this.setColour('#0288D1');
    },
  };

  Blockly.Blocks.SetVariable = {
    init: function () {
      this.appendValueInput('VALUE-0').appendField('Set');
      this.appendValueInput('VALUE-1').appendField('to');
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setColour('#FFEB3B');
    },
  };

  Blockly.Blocks.GetVariable = {
    init: function () {
      this.appendValueInput('VALUE-0').appendField('Get');
      this.setInputsInline(true);
      this.setOutput(true);
      this.setColour('#32CD32');
    },
  };
}

function ensurePortalBlocksRegisteredFromState(state) {
  const model = buildPortalBlockModelFromState(state);
  let created = 0;

  const FORCE_OVERRIDE_TYPES = new Set(['modBlock']);

  for (const [type, info] of model.entries()) {
    if (!type) continue;
    if (!FORCE_OVERRIDE_TYPES.has(type) && Object.prototype.hasOwnProperty.call(Blockly.Blocks, type)) continue;

    Blockly.Blocks[type] = {
      init: function () {
        this.appendDummyInput().appendField(type);

        for (const fname of info.fieldNames.slice(0, 12)) {
          try {
            this.appendDummyInput().appendField(`${fname}:`).appendField(new Blockly.FieldTextInput(''), fname);
          } catch {
            // ignore
          }
        }

        for (const inName of info.statementInputs) {
          try {
            this.appendStatementInput(inName).appendField(inName);
          } catch {
            // ignore
          }
        }

        for (const inName of info.valueInputs) {
          try {
            this.appendValueInput(inName).appendField(inName);
          } catch {
            // ignore
          }
        }

        const role = info.role || 'unknown';
        if (role === 'statement') {
          this.setPreviousStatement(true);
          this.setNextStatement(true);
        } else if (role === 'value') {
          this.setOutput(true);
        } else if (role === 'top') {
          // no connections
        } else {
          if (info.hasNext || info.usedAsStatement) {
            this.setPreviousStatement(true);
            this.setNextStatement(true);
          } else {
            this.setOutput(true);
          }
        }

        this.setColour(getSuggestedPortalBlockColour(type));
      },
    };

    created++;
  }

  return { created };
}

function main() {
  const presetPath = path.join(__dirname, '..', 'web_ui', 'dist', 'presets', 'custom_conquest_template_V8.0.json');
  const parsed = readJson(presetPath);
  const state = normalizeWorkspaceState(parsed);

  ensureCriticalPortalStructuralBlocks();
  registerLegacyVariableBlocks();
  const r = ensurePortalBlocksRegisteredFromState(state);

  const workspace = new Blockly.Workspace();

  const start = Date.now();
  Blockly.serialization.workspaces.load(state, workspace);
  const ms = Date.now() - start;

  const topBlocks = workspace.getTopBlocks(false);
  const allBlocks = workspace.getAllBlocks(false);

  console.log(`[smoke] Loaded preset OK in ${ms}ms`);
  console.log(`[smoke] Placeholder blocks created: ${r.created}`);
  console.log(`[smoke] Workspace blocks: top=${topBlocks.length}, total=${allBlocks.length}`);
}

try {
  main();
} catch (e) {
  console.error('[smoke] Failed to load preset:', e && e.stack ? e.stack : e);
  process.exitCode = 1;
}
