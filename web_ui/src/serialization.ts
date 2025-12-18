/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import { ensureCriticalPortalStructuralBlocks, ensurePortalBlocksRegisteredFromState } from './portal_block_registry';
import { convertInternalStateToPortalWrappedExport, looksLikePortalJson } from './portal_json';

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
        Blockly.Events.disable();
        Blockly.serialization.workspaces.load(state, workspace, undefined);
        Blockly.Events.enable();
        loaded = true;
      }
    }
  } catch {}
  if (!loaded) {
    // Fallback to localStorage
    const data = window.localStorage?.getItem(storageKey);
    if (!data) return;
    Blockly.Events.disable();
    Blockly.serialization.workspaces.load(JSON.parse(data), workspace, undefined);
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
  let exportObj: any = data;
  try {
    // Export Portal/community-compatible JSON by default.
    exportObj = await convertInternalStateToPortalWrappedExport(data);
  } catch (e) {
    console.warn('[BF6] Failed to convert export to Portal JSON; exporting internal JSON instead:', e);
    exportObj = data;
  }

  const json = JSON.stringify(exportObj, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bf6portal_mod.json';
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
    const isPortal = looksLikePortalJson(parsed);
    const data = isPortal ? normalizeWorkspaceState(parsed) : parsed;

    // If this looks like Portal/community JSON, auto-register any missing block
    // types/fields so Blockly can deserialize without throwing.
    if (isPortal) {
      try {
        ensureCriticalPortalStructuralBlocks();
        const r = ensurePortalBlocksRegisteredFromState(data);
        if (r?.created) console.log(`[BF6] Auto-registered ${r.created} block types for JSON import.`);
      } catch (e) {
        console.warn('[BF6] Failed to auto-register block types for JSON import:', e);
      }
    }

    Blockly.Events.disable();
    Blockly.serialization.workspaces.load(data, workspace, undefined);
    Blockly.Events.enable();
    (workspace as any).zoomToFit();
  } catch (e) {
    console.error("Failed to load workspace from file:", e);
    alert("Failed to load workspace. Invalid JSON file.");
  }
};
