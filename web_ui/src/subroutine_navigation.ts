import * as Blockly from 'blockly';

const SUBROUTINE_DEF_TYPE = 'SUBROUTINE_BLOCK';
const SUBROUTINE_CALL_TYPE = 'CALLSUBROUTINE';

function getNameFromBlock(block: Blockly.Block, fieldName: string): string {
  try {
    return String((block as any).getFieldValue?.(fieldName) ?? '').trim();
  } catch {
    return '';
  }
}

function centerOnBlock(workspace: Blockly.Workspace, block: Blockly.Block) {
  const wsAny: any = workspace as any;
  try {
    if (typeof wsAny.centerOnBlock === 'function') {
      wsAny.centerOnBlock((block as any).id);
      return;
    }
  } catch {
    // ignore
  }
}

function findSubroutineDefByName(workspace: Blockly.Workspace, name: string): Blockly.Block | null {
  const target = String(name ?? '').trim().toLowerCase();
  if (!target) return null;

  const wsAny: any = workspace as any;
  const defs: Blockly.Block[] = wsAny.getBlocksByType ? wsAny.getBlocksByType(SUBROUTINE_DEF_TYPE, false) : [];
  for (const d of defs) {
    const n = getNameFromBlock(d, 'SUBROUTINE_NAME').toLowerCase();
    if (n && n === target) return d;
  }
  return null;
}

function findFirstSubroutineCaller(workspace: Blockly.Workspace, name: string): Blockly.Block | null {
  const target = String(name ?? '').trim().toLowerCase();
  if (!target) return null;

  const wsAny: any = workspace as any;
  const calls: Blockly.Block[] = wsAny.getBlocksByType ? wsAny.getBlocksByType(SUBROUTINE_CALL_TYPE, false) : [];
  for (const c of calls) {
    const n = getNameFromBlock(c, 'SUBROUTINE_NAME').toLowerCase();
    if (n && n === target) return c;
  }
  return null;
}

export function registerSubroutineNavigationContextMenus(workspace: Blockly.Workspace) {
  const reg: any = (Blockly as any)?.ContextMenuRegistry?.registry;
  if (!reg) return;

  const idJumpToDef = 'bf6portal.subroutines.jumpToDefinition';
  if (!reg.getItem?.(idJumpToDef)) {
    reg.register({
      id: idJumpToDef,
      scopeType: (Blockly as any).ContextMenuRegistry.ScopeType.BLOCK,
      displayText: () => 'Jump to subroutine definition',
      preconditionFn: (scope: any) => {
        const b: Blockly.Block | undefined = scope?.block;
        if (!b) return 'hidden';
        if (b.type !== SUBROUTINE_CALL_TYPE) return 'hidden';
        const name = getNameFromBlock(b, 'SUBROUTINE_NAME');
        if (!name) return 'disabled';
        return findSubroutineDefByName(workspace, name) ? 'enabled' : 'disabled';
      },
      callback: (scope: any) => {
        const b: Blockly.Block | undefined = scope?.block;
        if (!b) return;
        const name = getNameFromBlock(b, 'SUBROUTINE_NAME');
        if (!name) return;
        const def = findSubroutineDefByName(workspace, name);
        if (!def) {
          alert(`Subroutine not found: ${name}`);
          return;
        }
        centerOnBlock(workspace, def);
      },
      weight: 7,
    });
  }

  const idJumpToCaller = 'bf6portal.subroutines.jumpToFirstCaller';
  if (!reg.getItem?.(idJumpToCaller)) {
    reg.register({
      id: idJumpToCaller,
      scopeType: (Blockly as any).ContextMenuRegistry.ScopeType.BLOCK,
      displayText: () => 'Jump to first caller',
      preconditionFn: (scope: any) => {
        const b: Blockly.Block | undefined = scope?.block;
        if (!b) return 'hidden';
        if (b.type !== SUBROUTINE_DEF_TYPE) return 'hidden';
        const name = getNameFromBlock(b, 'SUBROUTINE_NAME');
        if (!name) return 'disabled';
        return findFirstSubroutineCaller(workspace, name) ? 'enabled' : 'disabled';
      },
      callback: (scope: any) => {
        const b: Blockly.Block | undefined = scope?.block;
        if (!b) return;
        const name = getNameFromBlock(b, 'SUBROUTINE_NAME');
        if (!name) return;
        const call = findFirstSubroutineCaller(workspace, name);
        if (!call) {
          alert(`No callers found for: ${name}`);
          return;
        }
        centerOnBlock(workspace, call);
      },
      weight: 6,
    });
  }
}
