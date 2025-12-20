/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';

import {
  ensureCriticalPortalStructuralBlocks,
  ensurePortalBlocksRegisteredFromState,
  normalizeWorkspaceState,
  wrapPortalExport,
} from './portal_json';

import {
  convertWorkspaceStateInternalToPortal,
  describePortalExportUnknownTypes,
} from './portal_convert';

import { COLLECTION_CALL_TYPE, COLLECTION_DEF_TYPE } from './blocks/collections';

const storageKey = 'mainWorkspace';

/**
 * Saves the state of the workspace to browser's local storage.
 * @param workspace Blockly workspace to save.
 */
export const save = function (workspace: Blockly.Workspace) {
  const data = Blockly.serialization.workspaces.save(workspace);
  window.localStorage?.setItem(storageKey, JSON.stringify(data));
  // Also save to backend NeDB
  fetch('/api/bf6portal/workspace', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ state: data })
  }).catch(() => {});
};

/**
 * Loads saved state from local storage into the given workspace.
 * @param workspace Blockly workspace to load into.
 */
export const load = async function (workspace: Blockly.Workspace) {
  // Try backend first
  let loaded = false;
  try {
    const res = await fetch('/api/bf6portal/workspace');
    if (res.ok) {
      const { state } = await res.json();
      if (state) {
        const normalized = normalizeWorkspaceState(state);
        ensureCriticalPortalStructuralBlocks();
        try {
          ensurePortalBlocksRegisteredFromState(normalized);
        } catch {
          // ignore
        }
        Blockly.Events.disable();
        Blockly.serialization.workspaces.load(normalized, workspace, undefined);
        Blockly.Events.enable();
        loaded = true;
      }
    }
  } catch {}
  if (!loaded) {
    // Fallback to localStorage
    const data = window.localStorage?.getItem(storageKey);
    if (!data) return;
    const normalized = normalizeWorkspaceState(JSON.parse(data));
    ensureCriticalPortalStructuralBlocks();
    try {
      ensurePortalBlocksRegisteredFromState(normalized);
    } catch {
      // ignore
    }
    Blockly.Events.disable();
    Blockly.serialization.workspaces.load(normalized, workspace, undefined);
    Blockly.Events.enable();
  }
};

/**
 * Saves the workspace to a JSON file and triggers a download.
 * @param workspace Blockly workspace to save.
 */
export const saveToFile = async function (workspace: Blockly.Workspace) {
  const data = Blockly.serialization.workspaces.save(workspace);
  const portal = wrapPortalExport(data);
  const json = JSON.stringify(portal, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'custom_draft_workspace.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

type BlockState = any;
type WorkspaceState = any;

function deepCloneJson<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function collectIdsFromBlockTree(block: any, out: Set<string>): void {
  if (!block || typeof block !== 'object') return;
  try {
    const id = typeof block.id === 'string' ? block.id : '';
    if (id) out.add(id);
  } catch {
    // ignore
  }

  try {
    const inputs = block.inputs;
    if (inputs && typeof inputs === 'object') {
      for (const k of Object.keys(inputs)) {
        const child = inputs[k]?.block;
        const shadow = inputs[k]?.shadow;
        if (child) collectIdsFromBlockTree(child, out);
        if (shadow) collectIdsFromBlockTree(shadow, out);
      }
    }
  } catch {
    // ignore
  }

  try {
    const next = block.next?.block;
    if (next) collectIdsFromBlockTree(next, out);
  } catch {
    // ignore
  }
}

function generateUniqueBlockId(existing: Set<string>): string {
  const anyCrypto: any = (globalThis as any).crypto;
  for (let i = 0; i < 50; i++) {
    let id = '';
    try {
      if (anyCrypto && typeof anyCrypto.randomUUID === 'function') {
        id = anyCrypto.randomUUID();
      }
    } catch {
      // ignore
    }

    if (!id) {
      try {
        const gen = (Blockly as any)?.utils?.idGenerator?.genUid;
        if (typeof gen === 'function') id = String(gen());
      } catch {
        // ignore
      }
    }

    if (!id) {
      id = `bf6_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
    }

    if (!existing.has(id)) {
      existing.add(id);
      return id;
    }
  }

  // Extremely unlikely fallback.
  const fallback = `bf6_${Date.now()}_${Math.random()}`;
  existing.add(fallback);
  return fallback;
}

function reassignIdsForClonedTree(block: any, existing: Set<string>): void {
  if (!block || typeof block !== 'object') return;
  try {
    block.id = generateUniqueBlockId(existing);
  } catch {
    // ignore
  }

  try {
    const inputs = block.inputs;
    if (inputs && typeof inputs === 'object') {
      for (const k of Object.keys(inputs)) {
        const child = inputs[k]?.block;
        const shadow = inputs[k]?.shadow;
        if (child) reassignIdsForClonedTree(child, existing);
        if (shadow) reassignIdsForClonedTree(shadow, existing);
      }
    }
  } catch {
    // ignore
  }

  try {
    const next = block.next?.block;
    if (next) reassignIdsForClonedTree(next, existing);
  } catch {
    // ignore
  }
}

function getFieldString(block: BlockState | null | undefined, name: string): string {
  try {
    const v = block?.fields?.[name];
    return String(v ?? '').trim();
  } catch {
    return '';
  }
}

function getNextBlock(block: BlockState | null | undefined): BlockState | null {
  return (block && block.next && block.next.block) ? block.next.block : null;
}

function setNextBlock(block: BlockState, next: BlockState | null): void {
  if (!block) return;
  if (!next) {
    if (block.next) delete block.next;
    return;
  }
  block.next = block.next && typeof block.next === 'object' ? block.next : {};
  block.next.block = next;
}

function getTail(block: BlockState | null): BlockState | null {
  let cur = block;
  while (cur && cur.next && cur.next.block) cur = cur.next.block;
  return cur;
}

function expandCollectionsInBlockTree(
  block: BlockState | null,
  defsByName: Map<string, BlockState>,
  stack: string[],
  existingIds: Set<string>,
): BlockState | null {
  if (!block) return null;

  // Expand collection call blocks by inlining the referenced definition stack.
  if (block.type === COLLECTION_CALL_TYPE) {
    const name = getFieldString(block, 'NAME');
    const nameKey = name.toLowerCase();
    const nextOriginal = getNextBlock(block);

    if (!name) {
      // No usable name: drop the call for Portal export.
      return expandCollectionsInBlockTree(nextOriginal, defsByName, stack, existingIds);
    }

    if (stack.includes(nameKey)) {
      throw new Error(`Recursive collection call blocked: ${name}`);
    }

    const def = defsByName.get(nameKey);
    if (!def) {
      throw new Error(`Collection definition not found: ${name}`);
    }

    // The definition's body is the statement stack under input STACK.
    const defHead: BlockState | null = def?.inputs?.STACK?.block ?? null;
    if (!defHead) {
      // Empty definition => acts like a no-op.
      return expandCollectionsInBlockTree(nextOriginal, defsByName, stack, existingIds);
    }

    const clonedHead: BlockState = deepCloneJson(defHead);
    // Re-ID the cloned subtree to avoid duplicate block IDs in the export.
    reassignIdsForClonedTree(clonedHead, existingIds);

    const expandedHead = expandCollectionsInBlockTree(clonedHead, defsByName, [...stack, nameKey], existingIds);
    const expandedNext = expandCollectionsInBlockTree(nextOriginal, defsByName, stack, existingIds);

    if (!expandedHead) return expandedNext;
    const tail = getTail(expandedHead);
    if (tail) setNextBlock(tail, expandedNext);
    return expandedHead;
  }

  // Recurse into inputs (statement/value) and next chain.
  if (block.inputs && typeof block.inputs === 'object') {
    for (const key of Object.keys(block.inputs)) {
      const input = block.inputs[key];
      if (input && input.block) {
        input.block = expandCollectionsInBlockTree(input.block, defsByName, stack, existingIds);
      }
      // We intentionally do not mutate shadows.
    }
  }

  if (block.next && block.next.block) {
    block.next.block = expandCollectionsInBlockTree(block.next.block, defsByName, stack, existingIds);
  }

  return block;
}

function expandCollectionsForPortalExport(state: WorkspaceState): WorkspaceState {
  const normalized = normalizeWorkspaceState(deepCloneJson(state));
  const blocksRoot = normalized?.blocks;
  if (!blocksRoot || typeof blocksRoot !== 'object') return normalized;

  const topBlocks: BlockState[] = Array.isArray(blocksRoot.blocks) ? blocksRoot.blocks : [];

  // Track all existing IDs in the workspace so clones can be assigned fresh IDs.
  const existingIds = new Set<string>();
  for (const b of topBlocks) collectIdsFromBlockTree(b, existingIds);

  // Build definitions map from top-level collection definition blocks.
  const defsByName = new Map<string, BlockState>();
  for (const b of topBlocks) {
    if (!b || b.type !== COLLECTION_DEF_TYPE) continue;
    const name = getFieldString(b, 'NAME');
    if (!name) continue;
    const key = name.toLowerCase();
    if (!defsByName.has(key)) {
      defsByName.set(key, b);
    }
  }

  // Expand calls everywhere, starting from each top-level block.
  for (let i = 0; i < topBlocks.length; i++) {
    const b = topBlocks[i];
    if (!b) continue;
    topBlocks[i] = expandCollectionsInBlockTree(b, defsByName, [], existingIds);
  }

  // Strip tool-only blocks from the final export.
  blocksRoot.blocks = (topBlocks || []).filter((b) => !!b && b.type !== COLLECTION_DEF_TYPE && b.type !== COLLECTION_CALL_TYPE);

  // Sanity: ensure no internal collection blocks remain.
  const scan = (blk: any): boolean => {
    if (!blk) return false;
    if (blk.type === COLLECTION_CALL_TYPE || blk.type === COLLECTION_DEF_TYPE) return true;
    if (blk.inputs) {
      for (const k of Object.keys(blk.inputs)) {
        const child = blk.inputs[k]?.block;
        if (scan(child)) return true;
      }
    }
    if (blk.next?.block && scan(blk.next.block)) return true;
    return false;
  };
  for (const b of blocksRoot.blocks || []) {
    if (scan(b)) {
      throw new Error('Internal collection blocks remained after export expansion.');
    }
  }

  return normalized;
}

/**
 * Export a Portal-compatible JSON that expands collections and removes tool-only
 * collection helper blocks.
 */
export const exportForPortal = function (workspace: Blockly.Workspace) {
  const data = Blockly.serialization.workspaces.save(workspace);

  let expanded: any;
  try {
    expanded = expandCollectionsForPortalExport(data);
  } catch (e) {
    console.error('[BF6] Export for Portal failed:', e);
    alert(`Export for Portal failed: ${String((e as any)?.message ?? e)}`);
    return;
  }

  (async () => {
    let portalReady: any = expanded;
    try {
      portalReady = await convertWorkspaceStateInternalToPortal(expanded);
    } catch (e) {
      console.warn('[BF6] Portal conversion failed; exporting expanded internal state instead:', e);
      portalReady = expanded;
    }

    // Optional diagnostics: if unknown types remain, Portal may reject the import.
    try {
      const msg = describePortalExportUnknownTypes(portalReady);
      if (msg) {
        console.warn(`[BF6] ${msg}`);
      }
    } catch {
      // ignore
    }

    const portal = wrapPortalExport(portalReady);
    const json = JSON.stringify(portal, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'portal_export_workspace.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  })();
};

/**
 * Loads a workspace from a JSON file content.
 * @param workspace Blockly workspace to load into.
 * @param jsonContent The JSON string content of the file.
 */
export const loadFromFile = async function (workspace: Blockly.Workspace, jsonContent: string) {
  try {
    const parsed = JSON.parse(jsonContent);
    const data = normalizeWorkspaceState(parsed);

    try {
      const count = typeof (workspace as any).getAllBlocks === 'function' ? (workspace as any).getAllBlocks(false).length : 0;
      if (count > 0) {
        const ok = confirm('Loading a file will replace your current workspace. Continue?');
        if (!ok) return;
      }
    } catch {
      // ignore
    }

    ensureCriticalPortalStructuralBlocks();
    try {
      ensurePortalBlocksRegisteredFromState(data);
    } catch {
      // ignore
    }

    Blockly.Events.disable();
    try {
      (workspace as any).clear?.();
    } catch {
      // ignore
    }
    Blockly.serialization.workspaces.load(data, workspace, undefined);
    Blockly.Events.enable();
    try {
      (workspace as any).zoomToFit?.();
    } catch {
      // ignore
    }
  } catch (e) {
    console.error("Failed to load workspace from file:", e);
    alert("Failed to load workspace. Invalid JSON file.");
  }
};
