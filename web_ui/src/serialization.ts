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
    if (Array.isArray((state as any).blocks)) {
      return {
        blocks: { languageVersion: 0, blocks: (state as any).blocks },
        variables: Array.isArray((state as any).variables) ? (state as any).variables : [],
      };
    }
  }
  return state;
}

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
): BlockState | null {
  if (!block) return null;

  // Expand collection call blocks by inlining the referenced definition stack.
  if (block.type === COLLECTION_CALL_TYPE) {
    const name = getFieldString(block, 'NAME');
    const nameKey = name.toLowerCase();
    const nextOriginal = getNextBlock(block);

    if (!name) {
      // No usable name: drop the call for Portal export.
      return expandCollectionsInBlockTree(nextOriginal, defsByName, stack);
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
      return expandCollectionsInBlockTree(nextOriginal, defsByName, stack);
    }

    const clonedHead: BlockState = deepCloneJson(defHead);
    const expandedHead = expandCollectionsInBlockTree(clonedHead, defsByName, [...stack, nameKey]);
    const expandedNext = expandCollectionsInBlockTree(nextOriginal, defsByName, stack);

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
        input.block = expandCollectionsInBlockTree(input.block, defsByName, stack);
      }
      // We intentionally do not mutate shadows.
    }
  }

  if (block.next && block.next.block) {
    block.next.block = expandCollectionsInBlockTree(block.next.block, defsByName, stack);
  }

  return block;
}

function expandCollectionsForPortalExport(state: WorkspaceState): WorkspaceState {
  const normalized = normalizeWorkspaceState(deepCloneJson(state));
  const blocksRoot = normalized?.blocks;
  if (!blocksRoot || typeof blocksRoot !== 'object') return normalized;

  const topBlocks: BlockState[] = Array.isArray(blocksRoot.blocks) ? blocksRoot.blocks : [];

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
    topBlocks[i] = expandCollectionsInBlockTree(b, defsByName, []);
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

  const portal = wrapPortalExport(expanded);
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
