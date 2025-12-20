import * as Blockly from 'blockly';

const MOD_TYPES = ['MOD_BLOCK', 'modBlock'];
const RULE_TYPE = 'RULE_HEADER';

function pickTopMostBlock(blocks: Blockly.Block[]): Blockly.Block | null {
  if (!Array.isArray(blocks) || blocks.length === 0) return null;

  let best: Blockly.Block | null = null;
  let bestY = Number.POSITIVE_INFINITY;
  for (const b of blocks) {
    if (!b) continue;
    let y: number | null = null;
    try {
      const anyB: any = b as any;
      if (typeof anyB.getBoundingRectangle === 'function') {
        const r = anyB.getBoundingRectangle();
        if (r && typeof r.top === 'number') y = r.top;
      }
    } catch {
      // ignore
    }
    if (y == null) {
      try {
        const anyB: any = b as any;
        if (typeof anyB.getRelativeToSurfaceXY === 'function') {
          const p = anyB.getRelativeToSurfaceXY();
          if (p && typeof p.y === 'number') y = p.y;
        }
      } catch {
        // ignore
      }
    }
    const yNum = typeof y === 'number' && Number.isFinite(y) ? y : Number.POSITIVE_INFINITY;
    if (!best || yNum < bestY) {
      best = b;
      bestY = yNum;
    }
  }
  return best;
}

function scrollToBlockTop(workspace: Blockly.Workspace, block: Blockly.Block, padding = 56): boolean {
  const wsAny: any = workspace as any;
  const bAny: any = block as any;
  if (!wsAny || !bAny) return false;

  let top: number | null = null;
  try {
    if (typeof bAny.getBoundingRectangle === 'function') {
      const r = bAny.getBoundingRectangle();
      if (r && typeof r.top === 'number') top = r.top;
    }
  } catch {
    // ignore
  }
  if (top == null) {
    try {
      if (typeof bAny.getRelativeToSurfaceXY === 'function') {
        const p = bAny.getRelativeToSurfaceXY();
        if (p && typeof p.y === 'number') top = p.y;
      }
    } catch {
      // ignore
    }
  }
  if (top == null) return false;

  // Keep the current horizontal scroll if possible.
  let x = 0;
  try {
    const m = typeof wsAny.getMetrics === 'function' ? wsAny.getMetrics() : null;
    if (m && typeof m.viewLeft === 'number') x = m.viewLeft;
  } catch {
    // ignore
  }

  const y = Math.max(0, top - padding);
  try {
    if (wsAny.scrollbar && typeof wsAny.scrollbar.set === 'function') {
      wsAny.scrollbar.set(x, y);
      return true;
    }
  } catch {
    // ignore
  }

  try {
    if (typeof wsAny.scroll === 'function') {
      wsAny.scroll(x, y);
      return true;
    }
  } catch {
    // ignore
  }

  return false;
}

function centerOnBlock(workspace: Blockly.Workspace, block: Blockly.Block) {
  const wsAny: any = workspace as any;
  try {
    if (typeof wsAny.centerOnBlock === 'function') {
      wsAny.centerOnBlock((block as any).id);
    }
  } catch {
    // ignore
  }

  // Prefer aligning to the *top* of the target block, so it doesn't end up hidden
  // under the fixed header/toolbox.
  try {
    scrollToBlockTop(workspace, block);
  } catch {
    // ignore
  }

  try {
    if (typeof (block as any).select === 'function') {
      (block as any).select();
    }
  } catch {
    // ignore
  }
}

function findAncestorByType(block: Blockly.Block, types: string[]): Blockly.Block | null {
  const wanted = new Set(types);
  let cur: any = block;
  while (cur) {
    try {
      if (wanted.has(cur.type)) return cur as Blockly.Block;
    } catch {
      // ignore
    }
    try {
      cur = typeof cur.getSurroundParent === 'function' ? cur.getSurroundParent() : null;
    } catch {
      cur = null;
    }
  }
  return null;
}

function findFirstBlockByTypes(workspace: Blockly.Workspace, types: string[]): Blockly.Block | null {
  const wsAny: any = workspace as any;
  for (const t of types) {
    try {
      const blocks: Blockly.Block[] = wsAny.getBlocksByType ? wsAny.getBlocksByType(t, false) : [];
      if (Array.isArray(blocks) && blocks.length > 0) return blocks[0];
    } catch {
      // ignore
    }
  }
  return null;
}

function getVariableNameFromBlock(block: Blockly.Block): string {
  // Our custom variable blocks use field_variable with names: VARIABLE / VARIABLE_NAME.
  const bAny: any = block as any;

  try {
    const f = bAny.getField?.('VARIABLE') || bAny.getField?.('VARIABLE_NAME');
    if (f) {
      // FieldVariable: value is usually the variable ID; text is the display name.
      const text = typeof f.getText === 'function' ? String(f.getText() ?? '').trim() : '';
      if (text) return text;

      const raw = typeof f.getValue === 'function' ? String(f.getValue() ?? '').trim() : '';
      if (raw) return raw;
    }
  } catch {
    // ignore
  }

  try {
    const v1 = String(bAny.getFieldValue?.('VARIABLE') ?? '').trim();
    if (v1) return v1;
  } catch {
    // ignore
  }

  try {
    const v2 = String(bAny.getFieldValue?.('VARIABLE_NAME') ?? '').trim();
    if (v2) return v2;
  } catch {
    // ignore
  }

  return '';
}

function findFirstVariableRef(workspace: Blockly.Workspace, type: string, variableName: string): Blockly.Block | null {
  const target = String(variableName ?? '').trim();
  if (!target) return null;

  const wsAny: any = workspace as any;
  const blocks: Blockly.Block[] = wsAny.getBlocksByType ? wsAny.getBlocksByType(type, false) : [];
  if (!Array.isArray(blocks)) return null;

  for (const b of blocks) {
    try {
      const n = getVariableNameFromBlock(b);
      if (n === target) return b;
    } catch {
      // ignore
    }
  }

  // Fallback: case-insensitive match for users who typed odd casing.
  const lower = target.toLowerCase();
  for (const b of blocks) {
    try {
      const n = getVariableNameFromBlock(b);
      if (n && n.toLowerCase() === lower) return b;
    } catch {
      // ignore
    }
  }

  return null;
}

export function registerGeneralNavigationContextMenus(workspace: Blockly.Workspace) {
  const reg: any = (Blockly as any)?.ContextMenuRegistry?.registry;
  if (!reg) return;

  // --- Jump to MOD (from anywhere) ---
  const idJumpMod = 'bf6portal.nav.jumpToMod';
  if (!reg.getItem?.(idJumpMod)) {
    reg.register({
      id: idJumpMod,
      scopeType: (Blockly as any).ContextMenuRegistry.ScopeType.BLOCK,
      displayText: () => 'Jump to MOD',
      preconditionFn: (scope: any) => {
        const b: Blockly.Block | undefined = scope?.block;
        if (!b) return 'hidden';
        const mod = findAncestorByType(b, MOD_TYPES) || findFirstBlockByTypes(workspace, MOD_TYPES);
        return mod ? 'enabled' : 'disabled';
      },
      callback: (scope: any) => {
        const b: Blockly.Block | undefined = scope?.block;
        if (!b) return;
        const mod = findAncestorByType(b, MOD_TYPES) || findFirstBlockByTypes(workspace, MOD_TYPES);
        if (!mod) {
          alert('MOD block not found.');
          return;
        }
        centerOnBlock(workspace, mod);
      },
      weight: 9,
    });
  }

  // --- Jump to owning Rule ---
  const idJumpRule = 'bf6portal.nav.jumpToOwningRule';
  if (!reg.getItem?.(idJumpRule)) {
    reg.register({
      id: idJumpRule,
      scopeType: (Blockly as any).ContextMenuRegistry.ScopeType.BLOCK,
      displayText: () => 'Jump to owning Rule',
      preconditionFn: (scope: any) => {
        const b: Blockly.Block | undefined = scope?.block;
        if (!b) return 'hidden';
        // If you right-click a Rule itself, hide this item.
        if (b.type === RULE_TYPE) return 'hidden';
        const rule = findAncestorByType(b, [RULE_TYPE]);
        return rule ? 'enabled' : 'hidden';
      },
      callback: (scope: any) => {
        const b: Blockly.Block | undefined = scope?.block;
        if (!b) return;
        const rule = findAncestorByType(b, [RULE_TYPE]);
        if (!rule) return;
        centerOnBlock(workspace, rule);
      },
      weight: 8,
    });
  }

  // --- Jump to first Rule (handy when you're deep in offscreen land) ---
  const idJumpFirstRule = 'bf6portal.nav.jumpToFirstRule';
  if (!reg.getItem?.(idJumpFirstRule)) {
    reg.register({
      id: idJumpFirstRule,
      scopeType: (Blockly as any).ContextMenuRegistry.ScopeType.BLOCK,
      displayText: () => 'Jump to first Rule',
      preconditionFn: (scope: any) => {
        const b: Blockly.Block | undefined = scope?.block;
        if (!b) return 'hidden';
        const wsAny: any = workspace as any;
        const rules: Blockly.Block[] = wsAny.getBlocksByType ? wsAny.getBlocksByType(RULE_TYPE, false) : [];
        return Array.isArray(rules) && rules.length > 0 ? 'enabled' : 'disabled';
      },
      callback: () => {
        const wsAny: any = workspace as any;
        const rules: Blockly.Block[] = wsAny.getBlocksByType ? wsAny.getBlocksByType(RULE_TYPE, false) : [];
        if (!Array.isArray(rules) || rules.length === 0) {
          alert('No Rule blocks found.');
          return;
        }
        centerOnBlock(workspace, rules[0]);
      },
      weight: 7,
    });
  }

  // --- Jump to stack root (top of current statement chain) ---
  const idJumpRoot = 'bf6portal.nav.jumpToStackRoot';
  if (!reg.getItem?.(idJumpRoot)) {
    reg.register({
      id: idJumpRoot,
      scopeType: (Blockly as any).ContextMenuRegistry.ScopeType.BLOCK,
      displayText: () => 'Jump to stack root',
      preconditionFn: (scope: any) => {
        const b: any = scope?.block;
        if (!b) return 'hidden';
        const root = typeof b.getRootBlock === 'function' ? b.getRootBlock() : null;
        if (!root || root === b) return 'hidden';
        return 'enabled';
      },
      callback: (scope: any) => {
        const b: any = scope?.block;
        if (!b) return;
        const root = typeof b.getRootBlock === 'function' ? b.getRootBlock() : null;
        if (!root) return;
        centerOnBlock(workspace, root);
      },
      weight: 6,
    });
  }

  // --- Variable navigation (SET/GETVARIABLE) ---
  const idJumpVarSetter = 'bf6portal.nav.jumpToVariableSetter';
  if (!reg.getItem?.(idJumpVarSetter)) {
    reg.register({
      id: idJumpVarSetter,
      scopeType: (Blockly as any).ContextMenuRegistry.ScopeType.BLOCK,
      displayText: () => 'Jump to first variable setter',
      preconditionFn: (scope: any) => {
        const b: Blockly.Block | undefined = scope?.block;
        if (!b) return 'hidden';
        if (b.type !== 'GETVARIABLE') return 'hidden';
        const name = getVariableNameFromBlock(b);
        if (!name) return 'disabled';
        return findFirstVariableRef(workspace, 'SETVARIABLE', name) ? 'enabled' : 'disabled';
      },
      callback: (scope: any) => {
        const b: Blockly.Block | undefined = scope?.block;
        if (!b) return;
        const name = getVariableNameFromBlock(b);
        if (!name) return;
        const setter = findFirstVariableRef(workspace, 'SETVARIABLE', name);
        if (!setter) {
          alert(`No setter found for variable: ${name}`);
          return;
        }
        centerOnBlock(workspace, setter);
      },
      weight: 5,
    });
  }

  const idJumpVarGetter = 'bf6portal.nav.jumpToVariableGetter';
  if (!reg.getItem?.(idJumpVarGetter)) {
    reg.register({
      id: idJumpVarGetter,
      scopeType: (Blockly as any).ContextMenuRegistry.ScopeType.BLOCK,
      displayText: () => 'Jump to first variable getter',
      preconditionFn: (scope: any) => {
        const b: Blockly.Block | undefined = scope?.block;
        if (!b) return 'hidden';
        if (b.type !== 'SETVARIABLE') return 'hidden';
        const name = getVariableNameFromBlock(b);
        if (!name) return 'disabled';
        return findFirstVariableRef(workspace, 'GETVARIABLE', name) ? 'enabled' : 'disabled';
      },
      callback: (scope: any) => {
        const b: Blockly.Block | undefined = scope?.block;
        if (!b) return;
        const name = getVariableNameFromBlock(b);
        if (!name) return;
        const getter = findFirstVariableRef(workspace, 'GETVARIABLE', name);
        if (!getter) {
          alert(`No getter found for variable: ${name}`);
          return;
        }
        centerOnBlock(workspace, getter);
      },
      weight: 4,
    });
  }
}

/**
 * Default "start" focus: align the view to the top of the MOD block (where the
 * first Rule chain is attached). This avoids users having to hunt around large
 * templates that are positioned far off-screen.
 */
export function focusWorkspaceOnModStart(workspace: Blockly.Workspace, padding = 72): boolean {
  if (!workspace) return false;
  const wsAny: any = workspace as any;

  // Prefer MOD_BLOCK (tool-internal) but also support community/Portal modBlock.
  let mod: Blockly.Block | null = null;
  try {
    const all: Blockly.Block[] = [];
    for (const t of MOD_TYPES) {
      try {
        const arr: Blockly.Block[] = wsAny.getBlocksByType ? wsAny.getBlocksByType(t, false) : [];
        if (Array.isArray(arr) && arr.length) all.push(...arr);
      } catch {
        // ignore
      }
    }
    mod = pickTopMostBlock(all);
  } catch {
    mod = null;
  }

  if (!mod) return false;

  // Center horizontally/roughly, then align the top so it is not hidden under the header.
  try {
    if (typeof wsAny.centerOnBlock === 'function') {
      wsAny.centerOnBlock((mod as any).id);
    }
  } catch {
    // ignore
  }

  try {
    scrollToBlockTop(workspace, mod, padding);
  } catch {
    // ignore
  }

  try {
    (mod as any).select?.();
  } catch {
    // ignore
  }

  return true;
}
