/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import {blocks as textBlocks} from './blocks/text';
import {blocks as homeBlocks} from './blocks/home';
import {blocks as variableBlocks} from './blocks/variables';
import {blocks as collectionBlocks} from './blocks/collections';
import {bf6PortalBlocks} from './blocks/bf6portal';
import {bf6PortalExpandedBlocks} from './blocks/bf6portal_expanded'; // New import
import {generatedBlocks} from './blocks/generated_blocks'; // Auto-generated blocks
import { registerPortalVariableBlocks } from './blocks/portal_variables';
import {generatedToolbox} from './generated_toolbox'; // Auto-generated toolbox
import {registerMutators, SUBROUTINE_DEF_MUTATOR, SUBROUTINE_CALL_MUTATOR} from './blocks/subroutine_mutator';
import {bf6Generators} from './generators/bf6_generators'; // Custom generators
import {javascriptGenerator} from 'blockly/javascript'; // Use TypeScript generator
import {save, load, exportForPortal} from './serialization';
import {toolbox} from './toolbox';
import {bf6Theme} from './bf6_theme';
import {MenuBar} from './components/MenuBar';
import { preloadSelectionLists, registerSelectionListExtensions } from './selection_lists';
import { initPresetsUI } from './presets';
import {
  ensureCriticalPortalStructuralBlocks,
  ensurePortalBlocksRegisteredFromState,
  ensureVariablesExistFromState,
  ensureVariablesExistFromWorkspaceFields,
  normalizeWorkspaceState,
} from './portal_json';
import { registerCollectionsContextMenus } from './collections';
import { registerSubroutineNavigationContextMenus } from './subroutine_navigation';
import { registerGeneralNavigationContextMenus } from './navigation';
import './index.css';
import './components/MenuBar.css';

function installToolboxSearchUI(workspace: Blockly.WorkspaceSvg, filterToolboxFn: (term: string) => any): void {
  try {
    const anyW: any = window as any;
    if (anyW.__bf6_toolbox_search_ui_installed) return;
    anyW.__bf6_toolbox_search_ui_installed = true;

    const toolboxDiv = document.querySelector('.blocklyToolboxDiv') as HTMLElement | null;
    if (!toolboxDiv) return;
    if (document.getElementById('bf6ToolboxSearchContainer')) return;

    // Make room for a fixed search bar at the top of the toolbox.
    toolboxDiv.style.position = toolboxDiv.style.position || 'absolute';
    toolboxDiv.style.overflow = 'hidden';
    toolboxDiv.style.paddingTop = '44px';

    const container = document.createElement('div');
    container.id = 'bf6ToolboxSearchContainer';
    container.style.position = 'absolute';
    container.style.left = '0';
    container.style.right = '0';
    container.style.top = '0';
    container.style.height = '44px';
    container.style.padding = '8px 10px';
    container.style.background = '#23272e';
    container.style.borderBottom = '1px solid #181a1b';
    container.style.zIndex = '10';
    container.style.boxSizing = 'border-box';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search…';
    input.autocomplete = 'off';
    (input as any).spellcheck = false;
    input.style.width = '100%';
    input.style.height = '28px';
    input.style.boxSizing = 'border-box';
    input.style.borderRadius = '6px';
    input.style.border = '1px solid #333';
    input.style.background = '#181a1b';
    input.style.color = '#e0e0e0';
    input.style.padding = '6px 10px';
    input.style.fontFamily = 'Segoe UI, Consolas, monospace';

    container.appendChild(input);
    toolboxDiv.appendChild(container);

    let timer: number | null = null;
    input.addEventListener('input', () => {
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        try {
          const nextToolbox = filterToolboxFn(input.value);
          workspace.updateToolbox(nextToolbox);
        } catch (e) {
          console.warn('[BF6] Toolbox search failed:', e);
        }
      }, 80);
    });
  } catch (e) {
    console.warn('[BF6] Failed to install toolbox search UI:', e);
  }
}

function registerHelpContextMenus(): void {
  try {
    const anyB: any = Blockly as any;
    if (anyB.__bf6_help_context_menus_registered) return;
    anyB.__bf6_help_context_menus_registered = true;

    const reg = Blockly.ContextMenuRegistry.registry as any;
    if (!reg || typeof reg.register !== 'function') return;

    // Block-scoped help.
    reg.register({
      id: 'bf6.help.block',
      scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
      displayText: () => 'Help',
      preconditionFn: () => {
        const g: any = window as any;
        return (typeof g.showHelpForBlockType === 'function') ? 'enabled' : 'hidden';
      },
      callback: (scope: any) => {
        try {
          const g: any = window as any;
          const type = scope?.block?.type;
          if (type && typeof g.showHelpForBlockType === 'function') g.showHelpForBlockType(type);
        } catch (e) {
          console.warn('[BF6] Help callback failed:', e);
        }
      },
      weight: 210,
    });

    // Workspace-scoped help index.
    reg.register({
      id: 'bf6.help.index',
      scopeType: Blockly.ContextMenuRegistry.ScopeType.WORKSPACE,
      displayText: () => 'Help (index)',
      preconditionFn: () => {
        const g: any = window as any;
        return (typeof g.openHelpModal === 'function' || typeof g.showHelpIndex === 'function') ? 'enabled' : 'hidden';
      },
      callback: () => {
        try {
          const g: any = window as any;
          if (typeof g.openHelpModal === 'function') {
            g.openHelpModal();
          } else if (typeof g.showHelpIndex === 'function') {
            g.showHelpIndex('');
          }
        } catch (e) {
          console.warn('[BF6] Help index callback failed:', e);
        }
      },
      weight: 209,
    });
  } catch (e) {
    console.warn('[BF6] Failed to register help context menus:', e);
  }
}

// Expose toolbox globally for legacy scripts
(window as any).TOOLBOX_CONFIG = toolbox;

// This repo's shipped `web_ui/dist/index.html` currently loads both:
// - legacy global Blockly via <script src="blockly/...">
// - this webpack bundle which imports Blockly from node_modules
// To avoid subtle mismatches (e.g., code preview / save using a different Blockly instance
// than the workspace was created with), we deliberately point the global `window.Blockly`
// at the same instance used by this bundle.
(window as any).Blockly = Blockly;
(window as any).__bf6_blockly = Blockly;

// The legacy help UI (`web_ui/main.js`) registers a Blockly context-menu item to open
// local help for a block type. However, this webpack bundle intentionally overwrites
// `window.Blockly` to avoid dual-instance mismatches.
//
// If the legacy help init runs *before* this bundle, its menu item gets registered on
// the legacy Blockly instance and disappears once we swap the global. So we also
// register the Help context menu item here, using the same ID.
function ensureHelpContextMenuRegistered(): void {
  try {
    const registry: any = (Blockly as any)?.ContextMenuRegistry?.registry;
    if (!registry || typeof registry.register !== 'function') return;

    // Remove Blockly's default "Help" menu item to avoid duplicates.
    try {
      if (typeof registry.getItem === 'function' && registry.getItem('blockHelp')) {
        registry.unregister?.('blockHelp');
      }
    } catch {
      // ignore
    }

    const id = 'bf6portal.helpForBlock';
    try {
      if (typeof registry.getItem === 'function' && registry.getItem(id)) return;
    } catch {
      // ignore
    }

    registry.register({
      id,
      scopeType: (Blockly as any).ContextMenuRegistry.ScopeType.BLOCK,
      displayText: () => ((Blockly as any)?.Msg?.HELP || 'Help'),
      preconditionFn: (scope: any) => (scope?.block?.type ? 'enabled' : 'hidden'),
      callback: (scope: any) => {
        try {
          const t = scope?.block?.type;
          if (!t) return;
          const fn = (window as any).showHelpForBlockType;
          if (typeof fn === 'function') {
            fn(t);
            return;
          }
          // Fallback: open help index.
          const helpBtn = document.getElementById('helpBtn') as HTMLButtonElement | null;
          helpBtn?.click?.();
        } catch (e) {
          console.warn('[BF6] Help context menu failed:', e);
        }
      },
      weight: 8,
    });
  } catch (e) {
    console.warn('[BF6] Failed to register Blockly help context menu (bundle):', e);
  }
}

// Register as early as possible (and again later via refresh/recovery flows).
try {
  ensureHelpContextMenuRegistered();
} catch {
  // ignore
}

function setupBlocklyDialogsForElectron(): void {
  // Electron renderer does not support native `window.prompt()`.
  // Blockly defaults to `window.prompt()` for variable creation/renaming unless overridden.
  const dialog: any = (Blockly as any).dialog;
  if (!dialog || typeof dialog.setPrompt !== 'function' || typeof dialog.prompt !== 'function') {
    return;
  }

  const MODAL_ID = 'bf6PromptModal';
  const ensurePromptModal = () => {
    let overlay = document.getElementById(MODAL_ID) as HTMLDivElement | null;
    if (overlay) {
      const messageEl = overlay.querySelector('[data-bf6-prompt-message]') as HTMLDivElement | null;
      const inputEl = overlay.querySelector('[data-bf6-prompt-input]') as HTMLInputElement | null;
      const okBtn = overlay.querySelector('[data-bf6-prompt-ok]') as HTMLButtonElement | null;
      const cancelBtn = overlay.querySelector('[data-bf6-prompt-cancel]') as HTMLButtonElement | null;
      if (messageEl && inputEl && okBtn && cancelBtn) {
        return {overlay, messageEl, inputEl, okBtn, cancelBtn};
      }
      // If the structure is wrong for some reason, recreate.
      overlay.remove();
      overlay = null;
    }

    overlay = document.createElement('div');
    overlay.id = MODAL_ID;
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.display = 'none';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.background = 'rgba(0, 0, 0, 0.55)';
    overlay.style.zIndex = '100000';

    const panel = document.createElement('div');
    panel.style.minWidth = '360px';
    panel.style.maxWidth = '720px';
    panel.style.width = '60vw';
    panel.style.background = '#1e1e1e';
    panel.style.border = '1px solid rgba(255,255,255,0.12)';
    panel.style.borderRadius = '10px';
    panel.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
    panel.style.padding = '16px';
    panel.style.color = '#fff';
    panel.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif';

    const messageEl = document.createElement('div');
    messageEl.setAttribute('data-bf6-prompt-message', '');
    messageEl.style.marginBottom = '10px';
    messageEl.style.whiteSpace = 'pre-wrap';

    const inputEl = document.createElement('input');
    inputEl.setAttribute('data-bf6-prompt-input', '');
    inputEl.type = 'text';
    inputEl.style.width = '100%';
    inputEl.style.boxSizing = 'border-box';
    inputEl.style.padding = '10px 12px';
    inputEl.style.borderRadius = '8px';
    inputEl.style.border = '1px solid rgba(255,255,255,0.18)';
    inputEl.style.background = 'rgba(255,255,255,0.06)';
    inputEl.style.color = '#fff';
    inputEl.style.outline = 'none';

    const btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.justifyContent = 'flex-end';
    btnRow.style.gap = '10px';
    btnRow.style.marginTop = '12px';

    const cancelBtn = document.createElement('button');
    cancelBtn.setAttribute('data-bf6-prompt-cancel', '');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.padding = '8px 12px';
    cancelBtn.style.borderRadius = '8px';
    cancelBtn.style.border = '1px solid rgba(255,255,255,0.18)';
    cancelBtn.style.background = 'transparent';
    cancelBtn.style.color = '#fff';
    cancelBtn.style.cursor = 'pointer';

    const okBtn = document.createElement('button');
    okBtn.setAttribute('data-bf6-prompt-ok', '');
    okBtn.textContent = 'OK';
    okBtn.style.padding = '8px 14px';
    okBtn.style.borderRadius = '8px';
    okBtn.style.border = '1px solid rgba(255,255,255,0.18)';
    okBtn.style.background = '#2d7dff';
    okBtn.style.color = '#fff';
    okBtn.style.cursor = 'pointer';

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(okBtn);
    panel.appendChild(messageEl);
    panel.appendChild(inputEl);
    panel.appendChild(btnRow);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    return {overlay, messageEl, inputEl, okBtn, cancelBtn};
  };

  let active = false;

  const showPrompt = (message: string, defaultValue: string, cb: (value: string | null) => void) => {
    const {overlay, messageEl, inputEl, okBtn, cancelBtn} = ensurePromptModal();
    if (active) {
      // Avoid re-entrancy surprises; fail gracefully.
      cb(null);
      return;
    }
    active = true;

    const finish = (value: string | null) => {
      active = false;
      overlay.style.display = 'none';
      overlay.removeEventListener('click', onBackdropClick);
      document.removeEventListener('keydown', onKeyDown, true);
      okBtn.onclick = null;
      cancelBtn.onclick = null;
      cb(value);
    };

    const onBackdropClick = (e: MouseEvent) => {
      if (e.target === overlay) {
        finish(null);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (overlay.style.display === 'none') return;
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        finish(null);
        return;
      }
      if (e.key === 'Enter') {
        // Let textarea-like behavior happen elsewhere, but this is a single input.
        e.preventDefault();
        e.stopPropagation();
        finish(inputEl.value);
      }
    };

    messageEl.textContent = message;
    inputEl.value = defaultValue ?? '';

    overlay.style.display = 'flex';
    overlay.addEventListener('click', onBackdropClick);
    document.addEventListener('keydown', onKeyDown, true);
    okBtn.onclick = () => finish(inputEl.value);
    cancelBtn.onclick = () => finish(null);

    // Focus after display.
    setTimeout(() => {
      try {
        inputEl.focus();
        inputEl.select();
      } catch {
        // ignore
      }
    }, 0);
  };

  try {
    dialog.setPrompt((message: string, defaultValue: string, callback: (value: string | null) => void) => {
      showPrompt(String(message ?? ''), String(defaultValue ?? ''), callback);
    });
  } catch (e) {
    console.warn('[BF6] Failed to override Blockly prompt dialog:', e);
  }
}

// Make sure Blockly's prompt implementation is Electron-safe.
// (This must run before any variable UI attempts to prompt the user.)
try {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setupBlocklyDialogsForElectron(), {once: true});
  } else {
    setupBlocklyDialogsForElectron();
  }
} catch {
  // ignore
}

let menuBar: MenuBar | undefined;

function installSelectionListsStatusIndicator(): void {
  try {
    const existing = document.getElementById('bf6SelectionListsStatus');
    if (existing) return;

    const host = (document.getElementById('headerRight') || document.getElementById('header')) as HTMLElement | null;
    if (!host) return;

    const el = document.createElement('span');
    el.id = 'bf6SelectionListsStatus';
    el.style.fontSize = '0.82em';
    el.style.opacity = '0.92';
    el.style.color = '#b0e0ff';
    el.style.border = '1px solid rgba(255,255,255,0.14)';
    el.style.borderRadius = '10px';
    el.style.padding = '4px 8px';
    el.style.background = 'rgba(255,255,255,0.06)';
    el.style.userSelect = 'none';
    el.style.cursor = 'pointer';
    el.title = 'Selection lists status (click to refresh UI)';

    const render = () => {
      const st: any = (window as any).__bf6_selection_lists_status;
      const blocksCount: any = (window as any).__bf6_selection_list_block_types_count;
      if (!st) {
        el.textContent = 'Lists: (unknown)';
        return;
      }
      if (st.lastError) {
        el.textContent = `Lists: ERROR`;
        el.title = `Selection lists failed to load: ${String(st.lastError)} (click to refresh UI)`;
        return;
      }
      if (st.loading && !st.loaded) {
        el.textContent = 'Lists: loading…';
        return;
      }
      if (st.loaded) {
        const src = st.source ? String(st.source) : 'unknown';
        const enums = typeof st.enumsCount === 'number' ? st.enumsCount : '?';
        const blocks = (typeof blocksCount === 'number') ? blocksCount : '?';
        el.textContent = `Lists: ${enums} (${src}) · blocks: ${blocks}`;
        return;
      }
      el.textContent = 'Lists: not loaded';
    };

    host.appendChild(el);
    render();

    // Poll briefly; in packaged builds users may not have a console/terminal.
    const timer = window.setInterval(() => {
      try {
        render();
        const st: any = (window as any).__bf6_selection_lists_status;
        if (st && (st.loaded || st.lastError)) window.clearInterval(timer);
      } catch {
        // ignore
      }
    }, 400);

    el.addEventListener('click', (e) => {
      try {
        e.preventDefault();
        e.stopPropagation();
      } catch {
        // ignore
      }
      try {
        (window as any).bf6RefreshUi?.();
      } catch {
        // ignore
      }
      try {
        // Re-trigger preload in case the user clicked very early.
        void preloadSelectionLists();
      } catch {
        // ignore
      }
    });
  } catch {
    // ignore
  }
}

// Initialize Menu Bar
try {
  // This repo has multiple UI variants. The shipped `web_ui/index.html` (Awesome UI)
  // does not include a MenuBar container, so only initialize when present.
  if (document.getElementById('menuBarContainer')) {
    menuBar = new MenuBar('menuBarContainer');
    menuBar.render();
  }
} catch (e) {
  console.warn("Failed to initialize MenuBar:", e);
}

// Hide splash screen after initialization
const splashScreen = document.getElementById('splashScreen');
if (splashScreen) {
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 500);
    }, 1000); // Show for at least 1 second
}

// Store the original toolbox for filtering
const originalToolbox = JSON.parse(JSON.stringify(toolbox));

// Function to filter the toolbox based on search term
const filterToolbox = (searchTerm: string) => {
  const newToolbox = JSON.parse(JSON.stringify(originalToolbox)); // Deep copy to avoid modifying original
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  console.log(`Searching for: ${lowerCaseSearchTerm}`); // Log search term

  newToolbox.contents = newToolbox.contents.filter((category: any) => {
    if (category.kind !== 'category') {
        // If it's not a category (e.g., a button), include it if its kind matches the search term
        return category.kind.toLowerCase().includes(lowerCaseSearchTerm);
    }

    const categoryNameMatches = category.name.toLowerCase().includes(lowerCaseSearchTerm);

    // Handle custom categories (which have no contents array in the JSON)
    if (category.custom) {
        return categoryNameMatches || lowerCaseSearchTerm === '';
    }

    const filteredBlocks = category.contents ? category.contents.filter((block: any) => {
      const blockTypeMatches = block.type && block.type.toLowerCase().includes(lowerCaseSearchTerm);
      const message0Matches = block.message0 && typeof block.message0 === 'string' && block.message0.toLowerCase().includes(lowerCaseSearchTerm);
      return blockTypeMatches || message0Matches;
    }) : [];

    if (categoryNameMatches) {
        // If category name matches, show all blocks in that category
        return true;
    } else if (filteredBlocks.length > 0) {
      // If category name doesn't match, but some blocks match, show only those blocks
      category.contents = filteredBlocks;
      return true;
    }
    return false; // Exclude category
  });

  return newToolbox;
};

// Register the blocks and generator with Blockly
try {
  registerMutators(); // Register mutators before defining blocks
  registerSelectionListExtensions();
  registerHelpContextMenus();
  registerPortalVariableBlocks();
  // Best-effort preload so dropdowns are ready by the time a user opens them.
  // (If it fails, dropdowns show an inline error message.)
  void preloadSelectionLists();
  // Visible status pill in the header (helps when users don't have DevTools open).
  try { installSelectionListsStatusIndicator(); } catch { /* ignore */ }
  Blockly.common.defineBlocks(textBlocks);
  Blockly.common.defineBlocks(homeBlocks);
  Blockly.common.defineBlocks(variableBlocks);
  Blockly.common.defineBlocks(collectionBlocks);
  Blockly.common.defineBlocks(bf6PortalBlocks);
  Blockly.common.defineBlocks(bf6PortalExpandedBlocks); // New registration

  // Register generated blocks
  Blockly.common.defineBlocks(generatedBlocks);

  // Merge generated toolbox into main toolbox
  // We append the generated categories to the end of the main toolbox contents
  // if (generatedToolbox && generatedToolbox.contents) {
  //    (toolbox.contents as any[]).push(...generatedToolbox.contents);
  // }

  Object.assign(javascriptGenerator.forBlock, bf6Generators); // Use bf6Generators with javascriptGenerator

  // Set up UI elements and inject Blockly
  const codeDiv = document.getElementById('generatedCode');
  const outputDiv = document.getElementById('output');
  const blocklyDiv = document.getElementById('blocklyDiv');

  if (!blocklyDiv) {
    throw new Error(`div with id 'blocklyDiv' not found`);
  }

  const ws = Blockly.inject(blocklyDiv, {
    toolbox: filterToolbox(''), // Initialize with full toolbox
    theme: bf6Theme,
    grid: {
      spacing: 20,
      length: 3,
      colour: '#555',
      snap: true,
    },
    zoom: {
      controls: false,
      wheel: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2,
      pinch: true
    },
    trashcan: false,
  });
  
  // Expose workspace globally
  (window as any).workspace = ws;

  // Ensure the status pill exists after workspace creation as well.
  try { installSelectionListsStatusIndicator(); } catch { /* ignore */ }

  // Remember the last selected block so toolbox flyout buttons can still act on it
  // even if clicking the toolbox clears the active selection.
  try {
    (ws as any).__bf6_lastSelectedBlockId = null;
    ws.addChangeListener((e: any) => {
      try {
        if (!e) return;
        if (e.type === (Blockly as any).Events?.SELECTED) {
          (ws as any).__bf6_lastSelectedBlockId = e.newElementId ?? null;
        }
      } catch {
        // ignore
      }
    });
  } catch {
    // ignore
  }

  // Expose Portal export globally so the legacy header UI (`web_ui/main.js`) can trigger it.
  // This stays stable even as the webpack bundle filename changes.
  try {
    (window as any).bf6ExportForPortal = () => exportForPortal(ws);
  } catch (e) {
    console.warn('[BF6] Failed to expose Portal export function:', e);
  }

  // Collections / bookmarks (macro-like call blocks + offscreen definitions)
  try {
    registerCollectionsContextMenus(ws);
  } catch (e) {
    console.warn('[BF6] Failed to register Collections context menus:', e);
  }

  // Navigation / teleport: subroutine call <-> definition
  try {
    registerSubroutineNavigationContextMenus(ws);
  } catch (e) {
    console.warn('[BF6] Failed to register Subroutine navigation menus:', e);
  }

  // Navigation / teleport: MOD / rules / variables / stack root
  try {
    registerGeneralNavigationContextMenus(ws);
  } catch (e) {
    console.warn('[BF6] Failed to register General navigation menus:', e);
  }

  // Legacy `web_ui/main.js` owns the Code Preview drawer implementation.
  // When the workspace is created by this bundle, explicitly kick the preview on.
  try {
    const g: any = window as any;
    if (typeof g.initLiveCodePreview === 'function') {
      g.initLiveCodePreview();
    }
  } catch (e) {
    console.warn('[BF6] Failed to init live code preview:', e);
  }

    // Presets dropdown (3 locked built-ins + user save/delete).
    // NOTE: We bind in capture phase to prevent legacy `web_ui/main.js` handlers
    // (which use global Blockly) from interfering with this webpack/TS workspace.
    try {
      initPresetsUI(ws);
    } catch (e) {
      console.warn('[BF6] Failed to init presets UI:', e);
    }

    // --- Refresh button (user-requested) ---
    // IMPORTANT: This should *not* clear the workspace. It exists as a recovery
    // action when the toolbox/flyout UI gets into a bad state.
    const refreshUiNonDestructive = () => {
      try {
        try {
          ensureHelpContextMenuRegistered();
        } catch {
          // ignore
        }
        // Defensive: if variables exist only as references in blocks, hydrate them.
        try {
          const saved = Blockly?.serialization?.workspaces?.save ? Blockly.serialization.workspaces.save(ws) : null;
          if (saved) ensureVariablesExistFromState(ws, saved);
        } catch {
          // ignore
        }
        try {
          ensureVariablesExistFromWorkspaceFields(ws);
        } catch {
          // ignore
        }
        try {
          (ws as any).refreshToolboxSelection?.();
        } catch {
          // ignore
        }
        try {
          (ws as any).getToolbox?.()?.refreshSelection?.();
        } catch {
          // ignore
        }
        try {
          Blockly.svgResize(ws);
        } catch {
          // ignore
        }
        try {
          (window as any).applyDocColoursToWorkspace?.(ws);
        } catch {
          // ignore
        }
        try {
          (window as any).scheduleCodePreviewRefresh?.();
        } catch {
          // ignore
        }
      } catch {
        // ignore
      }
    };

    try {
      const refreshBtn = document.getElementById('refreshBtn') as HTMLButtonElement | null;
      if (refreshBtn) {
        refreshBtn.addEventListener(
          'click',
          (e) => {
            try {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
            } catch {
              // ignore
            }
            refreshUiNonDestructive();
          },
          true
        );
      }

      // Also expose a global hook for legacy UI (or console) recovery.
      (window as any).bf6RefreshUi = refreshUiNonDestructive;
      // If we ever need a true hard reload for debugging.
      (window as any).bf6HardReload = () => {
        try {
          window.location.reload();
        } catch {
          // ignore
        }
      };
    } catch {
      // ignore
    }

    // --- File import (capture-phase) ---
    // Legacy `web_ui/main.js` also binds #loadInput change and performs its own import.
    // That legacy path does not always ensure `variables: []`, which can lead to an
    // empty Variables flyout after imports. We take over in capture phase.
    try {
      const loadInput = document.getElementById('loadInput') as HTMLInputElement | null;
      if (loadInput) {
        loadInput.addEventListener(
          'change',
          (evt) => {
            try {
              evt.stopImmediatePropagation();
              evt.stopPropagation();
              evt.preventDefault();
            } catch {
              // ignore
            }

            const input = evt.target as HTMLInputElement;
            const file = input?.files?.[0];
            if (!file) return;

            // Allow re-loading the same file consecutively.
            try {
              input.value = '';
            } catch {
              // ignore
            }

            // Confirm replacing existing work.
            try {
              const count = typeof ws.getAllBlocks === 'function' ? ws.getAllBlocks(false).length : 0;
              if (count > 0) {
                const ok = confirm('Loading a file will replace your current workspace. Continue?');
                if (!ok) return;
              }
            } catch {
              // ignore
            }

            const reader = new FileReader();
            reader.onload = (e) => {
              const raw = String((e?.target as any)?.result ?? '');
              const cleaned = raw.replace(/^\uFEFF/, '');
              const looksLikeXml = /^\s*</.test(cleaned);
              const looksLikeJson = /^\s*[\[{]/.test(cleaned);

              const finalize = () => {
                setTimeout(() => {
                  try {
                    Blockly.svgResize(ws);
                  } catch {
                    // ignore
                  }
                  try {
                    (ws as any).zoomToFit?.();
                  } catch {
                    // ignore
                  }
                  try {
                    (ws as any).refreshToolboxSelection?.();
                  } catch {
                    // ignore
                  }
                  try {
                    (window as any).applyDocColoursToWorkspace?.(ws);
                  } catch {
                    // ignore
                  }
                  try {
                    (window as any).scheduleCodePreviewRefresh?.();
                  } catch {
                    // ignore
                  }
                }, 0);
              };

              // Prefer JSON (Blockly serialization).
              if (!looksLikeXml && looksLikeJson && Blockly?.serialization?.workspaces?.load) {
                try {
                  const parsed = JSON.parse(cleaned);
                  const state = normalizeWorkspaceState(parsed);

                  ensureCriticalPortalStructuralBlocks();
                  try {
                    ensurePortalBlocksRegisteredFromState(state);
                  } catch (e2) {
                    console.warn('[BF6] Failed to auto-register block types for import:', e2);
                  }

                  Blockly.Events.disable();
                  try {
                    ws.clear();
                    // Create variable models first so FieldVariable IDs resolve cleanly during load.
                    ensureVariablesExistFromState(ws, state);
                    Blockly.serialization.workspaces.load(state, ws, undefined);
                    // Defensive (post-load): ensure the variable map reflects any serialized variables.
                    ensureVariablesExistFromState(ws, state);
                    // Extra defensive: ensure any variable fields in blocks have models.
                    ensureVariablesExistFromWorkspaceFields(ws);
                  } finally {
                    Blockly.Events.enable();
                  }

                  finalize();
                  return;
                } catch (err) {
                  console.warn('[BF6] Failed to load JSON workspace:', err);
                  try {
                    alert(`Failed to load JSON workspace.\n\n${String((err as any)?.message || err)}`);
                  } catch {
                    // ignore
                  }
                  return;
                }
              }

              // Fallback: XML load.
              if (looksLikeXml) {
                try {
                  const XmlAny: any = (Blockly as any).Xml;
                  const xml = XmlAny.textToDom(cleaned);
                  Blockly.Events.disable();
                  try {
                    ws.clear();
                    XmlAny.domToWorkspace(xml, ws);
                  } finally {
                    Blockly.Events.enable();
                  }
                  finalize();
                  return;
                } catch (err) {
                  console.warn('[BF6] Failed to load XML workspace:', err);
                  try {
                    alert(`Failed to load XML workspace.\n\n${String((err as any)?.message || err)}`);
                  } catch {
                    // ignore
                  }
                  return;
                }
              }

              try {
                alert('Unrecognized file format. Please load a Blockly workspace JSON (.json) or legacy XML (.xml).');
              } catch {
                // ignore
              }
            };
            reader.readAsText(file);
          },
          true
        );
      }
    } catch (e) {
      console.warn('[BF6] Failed to bind loadInput handler:', e);
    }

  console.log("Final Toolbox Configuration:", filterToolbox('')); // Added console log

  if (menuBar) {
      menuBar.setWorkspace(ws);
  }

  // --- Custom Toolbox Category for Collections ---
  ws.registerToolboxCategoryCallback('COLLECTIONS_CATEGORY', (workspace) => {
    const xmlList: Element[] = [];

    // Existing collections as call blocks
    const defs = workspace.getBlocksByType('BF6_COLLECTION_DEF', false);
    const names = defs
      .map((b) => {
        try { return String((b as any).getFieldValue?.('NAME') ?? '').trim(); } catch { return ''; }
      })
      .filter((n) => !!n)
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    for (const name of names) {
      const blockXml = document.createElement('block');
      blockXml.setAttribute('type', 'BF6_COLLECTION_CALL');
      const field = document.createElement('field');
      field.setAttribute('name', 'NAME');
      field.textContent = name;
      blockXml.appendChild(field);
      xmlList.push(blockXml);
    }

    // If none exist yet, still provide a generic call block.
    if (names.length === 0) {
      const blockXml = document.createElement('block');
      blockXml.setAttribute('type', 'BF6_COLLECTION_CALL');
      xmlList.push(blockXml);
    }

    return xmlList;
  });

  // --- Custom Toolbox Category for Variables ---
  ws.registerToolboxCategoryCallback('VARIABLES_CATEGORY', (workspace) => {
    const xmlList: Element[] = [];

    try {
      // 1) "New / Manage Variables" Button
      const btn = document.createElement('button');
      btn.setAttribute('text', 'New / Manage Variables');
      btn.setAttribute('callbackKey', 'MANAGE_VARIABLES');
      xmlList.push(btn);

      // 2) Helpful label
      const label = document.createElement('label');
      label.setAttribute('text', 'Existing variables');
      xmlList.push(label);

      // Defensive: if something loaded variables as block references but the
      // variable map didn't hydrate, fix it before reading the map.
      try {
        ensureVariablesExistFromWorkspaceFields(workspace as any);
      } catch {
        // ignore
      }

      // 3) Existing variables (pre-filled blocks)
      const vars = (workspace as any)?.getVariableMap?.()?.getAllVariables?.() || [];
      for (const v of vars) {
        const vAny: any = v as any;
        const id = String(vAny.getId ? vAny.getId() : (vAny.id ?? ''));
        const name = String(vAny.name ?? '');

        const blockGet = document.createElement('block');
        blockGet.setAttribute('type', 'GETVARIABLE');
        const getField = document.createElement('field');
        getField.setAttribute('name', 'VARIABLE_NAME');
        if (id) getField.setAttribute('id', id);
        getField.textContent = name;
        blockGet.appendChild(getField);
        xmlList.push(blockGet);

        const blockSet = document.createElement('block');
        blockSet.setAttribute('type', 'SETVARIABLE');
        const setField = document.createElement('field');
        setField.setAttribute('name', 'VARIABLE');
        if (id) setField.setAttribute('id', id);
        setField.textContent = name;
        blockSet.appendChild(setField);
        xmlList.push(blockSet);

        // Also expose a Variable-typed reference block for the generated BF6 blocks
        // (e.g., mod_GetVariable/mod_SetVariable) which expect inputs of check: "Variable".
        const varRef = document.createElement('block');
        varRef.setAttribute('type', 'BF6_VARIABLE_REF');
        const refField = document.createElement('field');
        refField.setAttribute('name', 'VAR');
        if (id) refField.setAttribute('id', id);
        refField.textContent = name;
        varRef.appendChild(refField);
        xmlList.push(varRef);
      }

      // 4) Fallback templates if there are no variables yet.
      if (!vars || vars.length === 0) {
        const blockSet = document.createElement('block');
        blockSet.setAttribute('type', 'SETVARIABLE');
        xmlList.push(blockSet);

        const blockGet = document.createElement('block');
        blockGet.setAttribute('type', 'GETVARIABLE');
        xmlList.push(blockGet);

        const varRef = document.createElement('block');
        varRef.setAttribute('type', 'BF6_VARIABLE_REF');
        xmlList.push(varRef);
      }
    } catch (e) {
      console.warn('[BF6] VARIABLES_CATEGORY failed; returning fallback flyout:', e);
      // Always give the user something usable.
      try {
        const btn = document.createElement('button');
        btn.setAttribute('text', 'New / Manage Variables');
        btn.setAttribute('callbackKey', 'MANAGE_VARIABLES');
        xmlList.push(btn);
      } catch {
        // ignore
      }
      try {
        const blockSet = document.createElement('block');
        blockSet.setAttribute('type', 'SETVARIABLE');
        xmlList.push(blockSet);
      } catch {
        // ignore
      }
      try {
        const blockGet = document.createElement('block');
        blockGet.setAttribute('type', 'GETVARIABLE');
        xmlList.push(blockGet);
      } catch {
        // ignore
      }
    }

    return xmlList;
  });

  ws.registerButtonCallback('MANAGE_VARIABLES', (button) => {
    // This must work in Electron (no native prompt). We already set up
    // Blockly.dialog prompt override earlier, so this should open our modal.
    try {
      const targetWs: any = (button as any)?.getTargetWorkspace?.() || ws;
      const createFn: any = (Blockly as any)?.Variables?.createVariableButtonHandler;
      if (typeof createFn === 'function') {
        createFn(targetWs, undefined);
      } else {
        // Fallback (should rarely happen): basic prompt.
        const name = String((window as any).prompt?.('Variable name:') || '').trim();
        if (name) (targetWs as any).createVariable?.(name);
      }

      // After creating/renaming variables, force flyout refresh so it appears immediately.
      setTimeout(() => {
        try {
          ensureVariablesExistFromWorkspaceFields(targetWs);
        } catch {
          // ignore
        }
        try {
          (targetWs as any).refreshToolboxSelection?.();
        } catch {
          // ignore
        }
      }, 0);
    } catch (e) {
      console.warn('[BF6] MANAGE_VARIABLES failed:', e);
    }
  });

  // --- Custom Toolbox Category for Selection Lists ---
  const SELECTION_LIST_EXT = 'bf6_selection_list_dropdown';
  const selectionListBlockTypes: string[] = (() => {
    const out = new Set<string>();
    const collect = (defs: any) => {
      if (!defs) return;
      const arr: any[] = Array.isArray(defs)
        ? defs
        : (typeof defs === 'object' ? Object.values(defs) : []);
      if (!Array.isArray(arr) || arr.length === 0) return;
      for (const d of arr) {
        const t = d?.type;
        const exts = d?.extensions;
        if (typeof t !== 'string' || !t) continue;
        if (Array.isArray(exts) && exts.includes(SELECTION_LIST_EXT)) {
          out.add(t);
        }
      }
    };
    // These are the sources that actually define blocks in this build.
    collect(bf6PortalBlocks as any);
    collect(bf6PortalExpandedBlocks as any);
    collect(generatedBlocks as any);
    return Array.from(out).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  })();

  try {
    (window as any).__bf6_selection_list_block_types = selectionListBlockTypes;
    (window as any).__bf6_selection_list_block_types_count = selectionListBlockTypes.length;
  } catch {
    // ignore
  }

  const xmlEl = (tagName: string): Element => document.createElement(tagName);

  ws.registerToolboxCategoryCallback('SELECTION_LISTS_CATEGORY', (workspace) => {
    const xmlList: Element[] = [];

    // Show *all* known selection-list dropdown blocks.
    if (!selectionListBlockTypes || selectionListBlockTypes.length === 0) {
      const label = document.createElement('label');
      label.setAttribute('text', 'No selection-list blocks were detected in this build.');
      xmlList.push(label);
      return xmlList;
    }

    for (const t of selectionListBlockTypes) {
      const block = document.createElement('block');
      block.setAttribute('type', t);
      xmlList.push(block);
    }

    // Also expose *every* enum as a generic dropdown block (bf6_sel_<EnumName>).
    // This fills in gaps where the primary block set doesn't have a dedicated
    // dropdown block for a particular selection list.
    const allEnumBlocks = Object.keys(((Blockly as any).Blocks || {}) as Record<string, any>)
      .filter((t) => t.startsWith('bf6_sel_'))
      .sort((a, b) => a.localeCompare(b));

    if (allEnumBlocks.length === 0) {
      // Ensure load starts (startup already does this, but this keeps the flyout robust).
      void preloadSelectionLists();

      const label = xmlEl('label');
      label.setAttribute('text', 'Loading all selection lists…');
      xmlList.push(label);
      return xmlList;
    }

    const label = xmlEl('label');
    label.setAttribute('text', 'All selection lists');
    xmlList.push(label);

    for (const type of allEnumBlocks) {
      const block = xmlEl('block');
      block.setAttribute('type', type);
      xmlList.push(block);
    }
    
    return xmlList;
  });

  // --- Custom Toolbox Category for Subroutines ---
  ws.registerToolboxCategoryCallback('SUBROUTINES_CATEGORY', (workspace) => {
    const xmlList: Element[] = [];
    
    // 1. "New Subroutine" Button
    const btn = xmlEl('button');
    btn.setAttribute('text', 'New Subroutine');
    btn.setAttribute('callbackKey', 'CREATE_SUBROUTINE');
    xmlList.push(btn);

    // 2. Existing Subroutines
    const blocks = workspace.getBlocksByType('SUBROUTINE_BLOCK', false);
    for (const block of blocks) {
      const name = block.getFieldValue('SUBROUTINE_NAME');
      
      // Get params from the block's mutator state
      // Note: block.params is not directly accessible unless we cast to any or use getMutation
      // But our mutator stores it in 'params' property of the block instance
      const params = (block as any).params || [];

      const blockXml = xmlEl('block');
      blockXml.setAttribute('type', 'CALLSUBROUTINE');
      
      // Add mutation to the call block so it knows what inputs to create
      const mutation = xmlEl('mutation');
      mutation.setAttribute('params', JSON.stringify(params));
      blockXml.appendChild(mutation);

      const field = xmlEl('field');
      field.setAttribute('name', 'SUBROUTINE_NAME');
      field.textContent = name;
      
      blockXml.appendChild(field);
      xmlList.push(blockXml);
    }
    
    return xmlList;
  });

  // --- Modal Logic ---
  const modal = document.getElementById("subroutineModal");
  const closeBtn = document.querySelector('#subroutineModal .close');
  const addParamBtn = document.getElementById("addParamBtn");
  const createSubBtn = document.getElementById("createSubBtn");
  const paramsContainer = document.getElementById("paramsContainer");
  const subNameInput = document.getElementById("subNameInput") as HTMLInputElement;

  const promptText = (message: string, initialValue: string): Promise<string | null> => {
    return new Promise((resolve) => {
      try {
        const dialog: any = (Blockly as any).dialog;
        if (dialog?.prompt && typeof dialog.prompt === 'function') {
          dialog.prompt(message, initialValue ?? '', (v: string | null) => {
            if (v === null) return resolve(null);
            const trimmed = String(v).trim();
            resolve(trimmed ? trimmed : null);
          });
          return;
        }
      } catch {
        // ignore
      }
      resolve(null);
    });
  };

  const alertText = (title: string, message: string): Promise<void> => {
    return new Promise((resolve) => {
      try {
        const dialog: any = (Blockly as any).dialog;
        if (dialog?.alert && typeof dialog.alert === 'function') {
          dialog.alert(`${title}\n\n${message}`, () => resolve());
          return;
        }
      } catch {
        // ignore
      }

      try {
        window.alert(`${title}\n\n${message}`);
      } catch {
        // ignore
      }
      resolve();
    });
  };

  const createSubroutineFallback = async () => {
    try {
      const name = await promptText('New subroutine name:', 'Subroutine');
      if (!name) return;

      const block = ws.newBlock('SUBROUTINE_BLOCK');
      (block as any).setFieldValue?.(name, 'SUBROUTINE_NAME');
      (block as any).initSvg?.();
      (block as any).render?.();

      try {
        const metrics = (ws as any).getMetrics?.();
        if (metrics) {
          (block as any).moveBy?.(metrics.viewLeft + 100, metrics.viewTop + 100);
        }
      } catch {
        // ignore
      }

      try { (ws as any).refreshToolboxSelection?.(); } catch { /* ignore */ }
    } catch (e) {
      console.warn('[BF6] Failed to create subroutine:', e);
    }
  };

  if (modal && closeBtn && addParamBtn && createSubBtn && paramsContainer && subNameInput) {
      
      // Close modal
      (closeBtn as HTMLElement).onclick = function() {
        modal.style.display = "none";
      }
      window.addEventListener('click', (event: any) => {
        try {
          if (event?.target === modal) {
            modal.style.display = 'none';
          }
        } catch {
          // ignore
        }
      });

      // Add Parameter Row
      addParamBtn.onclick = function() {
          const row = document.createElement('div');
          row.className = 'param-row';
          
          const nameInput = document.createElement('input');
          nameInput.type = 'text';
          nameInput.placeholder = 'Param Name';
          
          const typeSelect = document.createElement('select');
          const types = ['String', 'Number', 'Boolean', 'Global', 'AreaTrigger', 'CapturePoint', 'EmplacementSpawner'];
          types.forEach(t => {
              const opt = document.createElement('option');
              opt.value = t;
              opt.text = t;
              typeSelect.appendChild(opt);
          });
          
          const removeBtn = document.createElement('button');
          removeBtn.textContent = 'X';
          removeBtn.onclick = function() {
              paramsContainer.removeChild(row);
          };
          
          row.appendChild(nameInput);
          row.appendChild(typeSelect);
          row.appendChild(removeBtn);
          paramsContainer.appendChild(row);
      }

      // Create Subroutine
      createSubBtn.onclick = function() {
          const name = subNameInput.value;
          if (!name) {
            void alertText('Subroutines', 'Please enter a subroutine name.');
              return;
          }
          
          const params: any[] = [];
          const rows = paramsContainer.getElementsByClassName('param-row');
          for (let i = 0; i < rows.length; i++) {
              const inputs = rows[i].getElementsByTagName('input');
              const selects = rows[i].getElementsByTagName('select');
              if (inputs.length > 0 && selects.length > 0) {
                  params.push({
                      name: inputs[0].value,
                      type: selects[0].value
                  });
              }
          }
          
          // Create the block
          const block = ws.newBlock('SUBROUTINE_BLOCK');
          block.setFieldValue(name, 'SUBROUTINE_NAME');
          
          // Set params via mutator
          if ((block as any).setParams) {
              (block as any).setParams(params);
          }
          
          block.initSvg();
          block.render();
          
          // Place it
          const metrics = ws.getMetrics();
          if (metrics) {
              block.moveBy(metrics.viewLeft + 100, metrics.viewTop + 100);
          }
          
          modal.style.display = "none";
          
          // Refresh toolbox to show new call block
          ws.refreshToolboxSelection();
      }
  }

  ws.registerButtonCallback('CREATE_SUBROUTINE', (button) => {
      if (modal && subNameInput && paramsContainer) {
       subNameInput.value = '';
       paramsContainer.innerHTML = ''; // Clear params
       modal.style.display = "block";
       return;
      }

      // Fallback: no modal HTML present in this UI build.
      void createSubroutineFallback();
  });


  // This function resets the code and output divs, shows the
  // generated code from the workspace, and evals the code.
  // In a real application, you probably shouldn't use `eval`.
  const runCode = () => {
    try {
      const code = javascriptGenerator.workspaceToCode(ws as Blockly.Workspace);
      if (codeDiv) codeDiv.textContent = code;
      if (outputDiv) outputDiv.innerHTML = '';
    } catch (e: any) {
      console.error("Error generating code:", e);
      if (codeDiv) codeDiv.textContent = `Error generating code: ${e.message}`;
    }
  };

  if (ws) {
    // Initialize the search input and listener
    const searchInput = document.getElementById('blocklySearchInput') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        const searchTerm = target.value;
        const filtered = filterToolbox(searchTerm);
        ws.updateToolbox(filtered);
      });
    }

    // load(ws); // Removed
    runCode();

    // Initial zoom to fit
    setTimeout(() => {
        (ws as any).zoomToFit();
    }, 100);

    // Prevent flyout from zooming with workspace
    const flyout = ws.getFlyout();
    if (flyout) {
        (flyout as any).getFlyoutScale = function() {
            return 1;
        };
    }

    // Every time the workspace changes state, save the changes to storage.
    ws.addChangeListener((e: Blockly.Events.Abstract) => {
      // UI events are things like scrolling, zooming, etc.
      // No need to save after one of these.
      if (e.isUiEvent) return;
      // save(ws); // Removed
    });

    // Whenever the workspace changes meaningfully, run the code again.
    ws.addChangeListener((e: Blockly.Events.Abstract) => {
      // Don't run the code when the workspace finishes loading; we're
      // already running it once when the application starts.
      if (
        e.isUiEvent ||
        e.type == Blockly.Events.FINISHED_LOADING
      ) {
        return;
      }
      runCode();
    });
  }
} catch (e: any) {
  const errDiv = document.createElement('div');
  errDiv.style.position = 'absolute';
  errDiv.style.top = '10px';
  errDiv.style.left = '10px';
  errDiv.style.backgroundColor = 'red';
  errDiv.style.color = 'white';
  errDiv.style.padding = '20px';
  errDiv.style.zIndex = '9999';
  errDiv.style.whiteSpace = 'pre-wrap';
  errDiv.textContent = 'ERROR INITIALIZING BLOCKLY:\n' + e.toString() + '\n' + e.stack;
  document.body.appendChild(errDiv);
  console.error(e);
}
