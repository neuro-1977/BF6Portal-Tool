
console.log('YOLO BUNDLE TEST');
(window as any)['YOLO_BLOCK'] = 42;

/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import {blocks as textBlocks} from './blocks/text';
import {blocks as homeBlocks} from './blocks/home';
import {bf6PortalBlocks} from './blocks/bf6portal';
import {bf6PortalExpandedBlocks} from './blocks/bf6portal_expanded'; // New import
import {generatedBlocks} from './blocks/generated_blocks'; // Auto-generated blocks
import { registerPortalVariableBlocks } from './blocks/portal_variables';
import {generatedToolbox} from './generated_toolbox'; // Auto-generated toolbox
import {registerMutators, SUBROUTINE_DEF_MUTATOR, SUBROUTINE_CALL_MUTATOR} from './blocks/subroutine_mutator';
import {bf6Generators} from './generators/bf6_generators'; // Custom generators
import {javascriptGenerator} from 'blockly/javascript'; // Use TypeScript generator
import {save, load} from './serialization';
import {toolbox} from './toolbox';
import {bf6Theme} from './bf6_theme';
import {MenuBar} from './components/MenuBar';
import { preloadSelectionLists, registerSelectionListExtensions } from './selection_lists';
import { initPresetsUI } from './presets';
import { openVariablesManager } from './variables_manager';
import { installBlocklyDialogs, promptText, alertText } from './dialogs';
import './index.css';
import './components/MenuBar.css';

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

// Electron builds used by this app can disable window.prompt/alert/confirm.
// Blockly's built-in Variables (and our subroutine fallback) rely on dialogs,
// so install in-app modal handlers up-front.
installBlocklyDialogs();

let menuBar: MenuBar | undefined;

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
  Blockly.common.defineBlocks(textBlocks);
  Blockly.common.defineBlocks(homeBlocks);
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
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 3,
      minScale: 0.3,
      scaleSpeed: 1.2,
      pinch: true
    },
  });
  
  // Expose workspace globally
  (window as any).workspace = ws;

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

  console.log("Final Toolbox Configuration:", filterToolbox('')); // Added console log

  if (menuBar) {
      menuBar.setWorkspace(ws);
  }

  // Blockly expects toolbox category callbacks to return XML Elements.
  // Using document.createElement() in an HTML document can produce HTML elements
  // with subtly different behavior/attributes, causing buttons to appear but not fire.
  const xmlEl = (name: string): Element => {
    const anyB: any = Blockly as any;
    const create = anyB?.utils?.xml?.createElement;
    if (typeof create === 'function') return create(name);

    // Fallback: ensure we create an element in Blockly's XML namespace.
    // This is critical for flyout <button> callbacks to register/click properly.
    try {
      return document.createElementNS('https://developers.google.com/blockly/xml', name);
    } catch {
      // Last resort.
      return document.createElement(name);
    }
  };

  // --- Custom Toolbox Category for Variables ---
  ws.registerToolboxCategoryCallback('VARIABLES_CATEGORY', (workspace) => {
    const xmlList: Element[] = [];
    
    // 1. "Manage Variables" Button
    const btn = xmlEl('button');
    btn.setAttribute('text', 'Manage Variables');
    btn.setAttribute('callbackKey', 'MANAGE_VARIABLES');
    xmlList.push(btn);

    // 2. Portal-compatible variable blocks (dynamic per variable)
    // The Portal block set uses GETVARIABLE/SETVARIABLE with field_variable.
    const anyWs: any = workspace as any;
    const varMap = typeof anyWs.getVariableMap === 'function' ? anyWs.getVariableMap() : null;
    const vars = (varMap && typeof varMap.getAllVariables === 'function')
      ? varMap.getAllVariables()
      : (typeof anyWs.getAllVariables === 'function' ? anyWs.getAllVariables() : []);

    if (!Array.isArray(vars) || vars.length === 0) {
      const label = xmlEl('label');
      label.setAttribute('text', 'No variables yet (click “Manage Variables”)');
      xmlList.push(label);

      // Still show generic blocks so users see what’s available.
      const blockSet = xmlEl('block');
      blockSet.setAttribute('type', 'SETVARIABLE');
      xmlList.push(blockSet);

      const blockGet = xmlEl('block');
      blockGet.setAttribute('type', 'GETVARIABLE');
      xmlList.push(blockGet);

      return xmlList;
    }

    for (const v of vars) {
      const varName = String((v && (v.name ?? (typeof v.getName === 'function' ? v.getName() : ''))) || '');
      const varId = String((v && (v.id ?? (typeof v.getId === 'function' ? v.getId() : ''))) || '');

      const setBlock = xmlEl('block');
      setBlock.setAttribute('type', 'SETVARIABLE');
      const setField = xmlEl('field');
      setField.setAttribute('name', 'VARIABLE');
      if (varId) setField.setAttribute('id', varId);
      setField.textContent = varName;
      setBlock.appendChild(setField);
      xmlList.push(setBlock);

      const getBlock = xmlEl('block');
      getBlock.setAttribute('type', 'GETVARIABLE');
      const getField = xmlEl('field');
      getField.setAttribute('name', 'VARIABLE_NAME');
      if (varId) getField.setAttribute('id', varId);
      getField.textContent = varName;
      getBlock.appendChild(getField);
      xmlList.push(getBlock);
    }
    
    return xmlList;
  });

  ws.registerButtonCallback('MANAGE_VARIABLES', (button) => {
      // NOTE: Some Blockly versions/skins pass a flyout button object that does
      // not expose `getTargetWorkspace()` reliably. Use the injected workspace
      // we closed over instead.
      try {
        openVariablesManager(ws as any);
      } catch (e) {
        console.warn('[BF6] Failed to open variables manager:', e);
      }
  });

  // --- Custom Toolbox Category for Selection Lists ---
  ws.registerToolboxCategoryCallback('SELECTION_LISTS_CATEGORY', (workspace) => {
    const xmlList: Element[] = [];
    // Keep the curated (hand-picked) blocks listed in `web_ui/src/toolbox.ts`.
    // These are the most commonly used selection list helpers.
    const cat = (toolbox as any)?.contents?.find((c: any) => c && c.kind === 'category' && c.name === 'SELECTION LISTS');
    const curated = Array.isArray(cat?.contents) ? cat.contents : [];
    for (const entry of curated) {
      if (!entry || entry.kind !== 'block' || !entry.type) continue;
      const block = xmlEl('block');
      block.setAttribute('type', String(entry.type));
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
  const closeBtn = document.getElementsByClassName("close")[0];
  const addParamBtn = document.getElementById("addParamBtn");
  const createSubBtn = document.getElementById("createSubBtn");
  const paramsContainer = document.getElementById("paramsContainer");
  const subNameInput = document.getElementById("subNameInput") as HTMLInputElement;

  if (modal && closeBtn && addParamBtn && createSubBtn && paramsContainer && subNameInput) {
      
      // Close modal
      (closeBtn as HTMLElement).onclick = function() {
        modal.style.display = "none";
      }
      window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }

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
     try {
       // Preferred UX: show modal when present.
       if (modal && subNameInput && paramsContainer) {
           subNameInput.value = '';
           paramsContainer.innerHTML = ''; // Clear params
           modal.style.display = "block";
           return;
       }

       // Fallback UX (used by the legacy/"Awesome UI" index.html which doesn't
       // include the modal markup): prompt for a name and create the block.
       void promptText('Subroutine name:', '').then((name) => {
         if (!name) return;

         const block = ws.newBlock('SUBROUTINE_BLOCK');
         block.setFieldValue(String(name), 'SUBROUTINE_NAME');
         block.initSvg();
         block.render();

         const metrics = ws.getMetrics();
         if (metrics) {
           block.moveBy(metrics.viewLeft + 100, metrics.viewTop + 100);
         }

         ws.refreshToolboxSelection();
       });
     } catch (e) {
       console.warn('[BF6] Failed to create subroutine:', e);
     }
  });

  // XML for initial workspace with connected blocks
  const initialXml = `<xml xmlns="https://developers.google.com/blockly/xml">
    <block type="MOD_BLOCK" id="mod_block_id" x="100" y="100">
      <statement name="RULES">
        <block type="RULE_HEADER" id="rule_header_id">
          <field name="RULE_NAME">New Rule</field>
          <field name="EVENT_TYPE">ONGOING</field>
          <field name="SCOPE_TYPE">GLOBAL</field>
          <value name="CONDITIONS">
            <block type="CONDITION_BLOCK" id="condition_block_id">
              <value name="INPUT_CONDITION">
                <block type="EQUAL" id="equal_block_id"></block>
              </value>
            </block>
          </value>
        </block>
      </statement>
    </block>
  </xml>`;

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(initialXml, "text/xml");
  Blockly.Xml.domToWorkspace(xmlDoc.firstChild as Element, ws);

  // No manual block creation or connection needed here anymore


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
