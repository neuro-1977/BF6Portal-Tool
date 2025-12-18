import * as Blockly from 'blockly';

import { COLLECTION_CALL_TYPE, COLLECTION_DEF_TYPE } from './blocks/collections';

type XY = { x: number; y: number };

function safePrompt(message: string, initialValue: string): string | null {
  try {
    const v = window.prompt(message, initialValue);
    if (v === null) return null;
    const trimmed = String(v).trim();
    return trimmed ? trimmed : null;
  } catch {
    return null;
  }
}

function listCollectionNames(workspace: Blockly.Workspace): string[] {
  const defs = (workspace as any).getBlocksByType
    ? (workspace as any).getBlocksByType(COLLECTION_DEF_TYPE, false)
    : [];
  const names: string[] = [];
  for (const b of defs) {
    try {
      const n = String(b.getFieldValue('NAME') ?? '').trim();
      if (n) names.push(n);
    } catch {
      // ignore
    }
  }
  return names;
}

function makeUniqueCollectionName(workspace: Blockly.Workspace, base: string): string {
  const existing = new Set(listCollectionNames(workspace).map((s) => s.toLowerCase()));
  const normalizedBase = String(base || 'Collection').trim() || 'Collection';
  if (!existing.has(normalizedBase.toLowerCase())) return normalizedBase;

  for (let i = 2; i < 1000; i++) {
    const candidate = `${normalizedBase} ${i}`;
    if (!existing.has(candidate.toLowerCase())) return candidate;
  }

  // Extremely unlikely, but keep it deterministic.
  return `${normalizedBase} ${Date.now()}`;
}

function getBlockXY(block: Blockly.Block): XY {
  const anyBlock: any = block as any;
  try {
    if (typeof anyBlock.getRelativeToSurfaceXY === 'function') {
      const p = anyBlock.getRelativeToSurfaceXY();
      if (p && typeof p.x === 'number' && typeof p.y === 'number') return { x: p.x, y: p.y };
    }
  } catch {
    // ignore
  }
  try {
    if (typeof anyBlock.getXY === 'function') {
      const p = anyBlock.getXY();
      if (p && typeof p.x === 'number' && typeof p.y === 'number') return { x: p.x, y: p.y };
    }
  } catch {
    // ignore
  }
  return { x: 0, y: 0 };
}

function computeOffscreenLibraryXY(workspace: Blockly.Workspace): XY {
  // Place collections to the right of the furthest content.
  // Imported templates can be far away already, so we just go "further right".
  const wsAny: any = workspace as any;
  const blocks: Blockly.Block[] = wsAny.getAllBlocks ? wsAny.getAllBlocks(false) : [];

  let maxX = 0;
  let minY = 0;

  for (const b of blocks) {
    try {
      const { x, y } = getBlockXY(b);
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
    } catch {
      // ignore
    }
  }

  // Keep some air gap so the library doesn't overlap normal work.
  const baseX = maxX + 3000;
  const baseY = minY;

  // Stagger definitions vertically.
  const defs: Blockly.Block[] = wsAny.getBlocksByType ? wsAny.getBlocksByType(COLLECTION_DEF_TYPE, false) : [];
  const idx = Array.isArray(defs) ? defs.length : 0;

  return { x: baseX, y: baseY + idx * 280 };
}

export function findCollectionDefByName(workspace: Blockly.Workspace, name: string): Blockly.Block | null {
  const target = String(name ?? '').trim().toLowerCase();
  if (!target) return null;

  const wsAny: any = workspace as any;
  const defs: Blockly.Block[] = wsAny.getBlocksByType ? wsAny.getBlocksByType(COLLECTION_DEF_TYPE, false) : [];
  for (const b of defs) {
    try {
      const n = String((b as any).getFieldValue?.('NAME') ?? '').trim().toLowerCase();
      if (n && n === target) return b;
    } catch {
      // ignore
    }
  }
  return null;
}

export function jumpToCollectionDefinition(workspace: Blockly.Workspace, name: string) {
  const def = findCollectionDefByName(workspace, name);
  if (!def) {
    alert(`Collection not found: ${name}`);
    return;
  }

  const wsAny: any = workspace as any;
  try {
    if (typeof wsAny.centerOnBlock === 'function') {
      wsAny.centerOnBlock((def as any).id);
    }
  } catch {
    // ignore
  }
}

export function convertBlockStackToCollection(workspace: Blockly.Workspace, block: Blockly.Block) {
  const bAny: any = block as any;
  if (!block || !workspace) return;

  if (block.type === COLLECTION_CALL_TYPE || block.type === COLLECTION_DEF_TYPE) return;

  const baseName = 'Collection';
  const suggested = makeUniqueCollectionName(workspace, baseName);
  const name = safePrompt('Create collection name:', suggested);
  if (!name) return;

  const uniqueName = makeUniqueCollectionName(workspace, name);

  const originalXY = getBlockXY(block);

  // Capture the connection we need to reattach into the chain.
  const prevTargetConn = bAny.previousConnection?.targetConnection ?? null;

  Blockly.Events.setGroup(true);
  Blockly.Events.disable();
  try {
    // Disconnect the stack from its current location.
    try {
      if (bAny.previousConnection?.isConnected?.()) {
        bAny.previousConnection.disconnect();
      }
    } catch {
      // ignore
    }

    // Create definition block offscreen.
    const def = (workspace as any).newBlock(COLLECTION_DEF_TYPE) as Blockly.Block;
    (def as any).initSvg?.();
    (def as any).render?.();
    (def as any).setFieldValue?.(uniqueName, 'NAME');

    const libXY = computeOffscreenLibraryXY(workspace);
    (def as any).moveBy?.(libXY.x, libXY.y);

    // Connect the moved stack under the definition.
    const stackConn = (def as any).getInput?.('STACK')?.connection ?? null;
    if (stackConn && bAny.previousConnection) {
      stackConn.connect(bAny.previousConnection);
    }

    // Create call/bookmark block at original location.
    const call = (workspace as any).newBlock(COLLECTION_CALL_TYPE) as Blockly.Block;
    (call as any).initSvg?.();
    (call as any).render?.();
    (call as any).setFieldValue?.(uniqueName, 'NAME');
    (call as any).moveBy?.(originalXY.x, originalXY.y);

    // Re-attach call block where the original stack lived.
    if (prevTargetConn && (call as any).previousConnection) {
      try {
        prevTargetConn.connect((call as any).previousConnection);
      } catch {
        // ignore
      }
    }

    // Optional: keep definitions visually small.
    try {
      (def as any).setCollapsed?.(true);
    } catch {
      // ignore
    }

    // Nudge view back to the call block.
    try {
      const wsAny: any = workspace as any;
      if (typeof wsAny.centerOnBlock === 'function') {
        wsAny.centerOnBlock((call as any).id);
      }
    } catch {
      // ignore
    }
  } finally {
    Blockly.Events.enable();
    Blockly.Events.setGroup(false);
  }
}

export function renameCollection(workspace: Blockly.Workspace, defBlock: Blockly.Block) {
  if (defBlock.type !== COLLECTION_DEF_TYPE) return;

  const oldName = String((defBlock as any).getFieldValue?.('NAME') ?? '').trim();
  const nextNameRaw = safePrompt('Rename collection:', oldName || 'Collection');
  if (!nextNameRaw) return;

  const nextName = makeUniqueCollectionName(workspace, nextNameRaw);
  if (!nextName || nextName === oldName) return;

  Blockly.Events.setGroup(true);
  Blockly.Events.disable();
  try {
    (defBlock as any).setFieldValue?.(nextName, 'NAME');

    // Update all call blocks referencing the old name.
    const wsAny: any = workspace as any;
    const calls: Blockly.Block[] = wsAny.getBlocksByType ? wsAny.getBlocksByType(COLLECTION_CALL_TYPE, false) : [];
    for (const c of calls) {
      try {
        const n = String((c as any).getFieldValue?.('NAME') ?? '').trim();
        if (n === oldName) {
          (c as any).setFieldValue?.(nextName, 'NAME');
        }
      } catch {
        // ignore
      }
    }
  } finally {
    Blockly.Events.enable();
    Blockly.Events.setGroup(false);
  }
}

export function registerCollectionsContextMenus(workspace: Blockly.Workspace) {
  const reg: any = (Blockly as any)?.ContextMenuRegistry?.registry;
  if (!reg) return;

  const idJump = 'bf6portal.collections.jumpToDef';
  if (!reg.getItem?.(idJump)) {
    reg.register({
      id: idJump,
      scopeType: (Blockly as any).ContextMenuRegistry.ScopeType.BLOCK,
      displayText: () => 'Jump to collection definition',
      preconditionFn: (scope: any) => {
        const b: Blockly.Block | undefined = scope?.block;
        if (!b) return 'hidden';
        if (b.type !== COLLECTION_CALL_TYPE) return 'hidden';
        const n = String((b as any).getFieldValue?.('NAME') ?? '').trim();
        return n ? 'enabled' : 'disabled';
      },
      callback: (scope: any) => {
        const b: Blockly.Block | undefined = scope?.block;
        if (!b) return;
        const n = String((b as any).getFieldValue?.('NAME') ?? '').trim();
        if (!n) return;
        jumpToCollectionDefinition(workspace, n);
      },
      weight: 7,
    });
  }

  const idConvert = 'bf6portal.collections.convertToCollection';
  if (!reg.getItem?.(idConvert)) {
    reg.register({
      id: idConvert,
      scopeType: (Blockly as any).ContextMenuRegistry.ScopeType.BLOCK,
      displayText: () => 'Convert to collection (bookmark + move stack)',
      preconditionFn: (scope: any) => {
        const b: any = scope?.block;
        if (!b) return 'hidden';
        if (b.type === COLLECTION_CALL_TYPE || b.type === COLLECTION_DEF_TYPE) return 'hidden';
        // Only offer for statement blocks.
        const isStatement = !!(b.previousConnection || b.nextConnection);
        return isStatement ? 'enabled' : 'hidden';
      },
      callback: (scope: any) => {
        const b: Blockly.Block | undefined = scope?.block;
        if (!b) return;
        convertBlockStackToCollection(workspace, b);
      },
      weight: 6,
    });
  }

  const idRename = 'bf6portal.collections.renameDef';
  if (!reg.getItem?.(idRename)) {
    reg.register({
      id: idRename,
      scopeType: (Blockly as any).ContextMenuRegistry.ScopeType.BLOCK,
      displayText: () => 'Rename collection…',
      preconditionFn: (scope: any) => {
        const b: any = scope?.block;
        if (!b) return 'hidden';
        if (b.type !== COLLECTION_DEF_TYPE) return 'hidden';
        return 'enabled';
      },
      callback: (scope: any) => {
        const b: Blockly.Block | undefined = scope?.block;
        if (!b) return;
        renameCollection(workspace, b);
      },
      weight: 5,
    });
  }

  const idJumpBack = 'bf6portal.collections.jumpToFirstCaller';
  if (!reg.getItem?.(idJumpBack)) {
    reg.register({
      id: idJumpBack,
      scopeType: (Blockly as any).ContextMenuRegistry.ScopeType.BLOCK,
      displayText: () => 'Jump to first caller',
      preconditionFn: (scope: any) => {
        const b: any = scope?.block;
        if (!b) return 'hidden';
        if (b.type !== COLLECTION_DEF_TYPE) return 'hidden';
        const n = String((b as any).getFieldValue?.('NAME') ?? '').trim();
        if (!n) return 'disabled';
        const wsAny: any = workspace as any;
        const calls: any[] = wsAny.getBlocksByType ? wsAny.getBlocksByType(COLLECTION_CALL_TYPE, false) : [];
        const hasCaller = Array.isArray(calls) && calls.some((c) => String(c.getFieldValue?.('NAME') ?? '').trim() === n);
        return hasCaller ? 'enabled' : 'disabled';
      },
      callback: (scope: any) => {
        const b: any = scope?.block;
        if (!b) return;
        const n = String(b.getFieldValue?.('NAME') ?? '').trim();
        if (!n) return;
        const wsAny: any = workspace as any;
        const calls: any[] = wsAny.getBlocksByType ? wsAny.getBlocksByType(COLLECTION_CALL_TYPE, false) : [];
        const call = Array.isArray(calls) ? calls.find((c) => String(c.getFieldValue?.('NAME') ?? '').trim() === n) : null;
        if (!call) return;
        try {
          if (typeof wsAny.centerOnBlock === 'function') {
            wsAny.centerOnBlock(call.id);
          }
        } catch {
          // ignore
        }
      },
      weight: 4,
    });
  }
}
