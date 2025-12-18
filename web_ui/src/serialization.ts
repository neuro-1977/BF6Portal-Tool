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
export const saveToFile = function (workspace: Blockly.Workspace) {
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

/**
 * Loads a workspace from a JSON file content.
 * @param workspace Blockly workspace to load into.
 * @param jsonContent The JSON string content of the file.
 */
export const loadFromFile = function (workspace: Blockly.Workspace, jsonContent: string) {
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
