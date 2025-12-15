/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

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

/**
 * Saves the workspace to a JSON file and triggers a download.
 * @param workspace Blockly workspace to save.
 */
export const saveToFile = function (workspace: Blockly.Workspace) {
  const data = Blockly.serialization.workspaces.save(workspace);
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bf6portal_workspace.json';
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
    const data = JSON.parse(jsonContent);
    Blockly.Events.disable();
    Blockly.serialization.workspaces.load(data, workspace, undefined);
    Blockly.Events.enable();
    (workspace as any).scrollCenter();
  } catch (e) {
    console.error("Failed to load workspace from file:", e);
    alert("Failed to load workspace. Invalid JSON file.");
  }
};
