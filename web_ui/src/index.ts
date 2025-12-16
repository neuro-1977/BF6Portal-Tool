
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
import {generatedToolbox} from './generated_toolbox'; // Auto-generated toolbox
import {registerMutators, SUBROUTINE_DEF_MUTATOR, SUBROUTINE_CALL_MUTATOR} from './blocks/subroutine_mutator';
import {bf6Generators} from './generators/bf6_generators'; // Custom generators
import {javascriptGenerator} from 'blockly/javascript'; // Use TypeScript generator
import {save, load} from './serialization';
import {toolbox} from './toolbox';
import {bf6Theme} from './bf6_theme';
import {MenuBar} from './components/MenuBar';
import './index.css';
import './components/MenuBar.css';

// Expose toolbox globally for legacy scripts
(window as any).TOOLBOX_CONFIG = toolbox;

let menuBar: MenuBar | undefined;

// Initialize Menu Bar
try {
    menuBar = new MenuBar('menuBarContainer');
    menuBar.render();
} catch (e) {
    console.error("Failed to initialize MenuBar:", e);
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

  console.log("Final Toolbox Configuration:", filterToolbox('')); // Added console log

  if (menuBar) {
      menuBar.setWorkspace(ws);
  }

  // --- Custom Toolbox Category for Variables ---
  ws.registerToolboxCategoryCallback('VARIABLES_CATEGORY', (workspace) => {
    const xmlList: Element[] = [];
    
    // 1. "Manage Variables" Button
    const btn = document.createElement('button');
    btn.setAttribute('text', 'Manage Variables');
    btn.setAttribute('callbackKey', 'MANAGE_VARIABLES');
    xmlList.push(btn);

    // 2. Get/Set Blocks (Standard)
    const blockSet = document.createElement('block');
    blockSet.setAttribute('type', 'SETVARIABLE');
    xmlList.push(blockSet);

    const blockGet = document.createElement('block');
    blockGet.setAttribute('type', 'GETVARIABLE');
    xmlList.push(blockGet);
    
    return xmlList;
  });

  ws.registerButtonCallback('MANAGE_VARIABLES', (button) => {
      // Use Blockly's built-in variable prompt for now, or a custom one if needed.
      // Since the user asked for a "list of all selectable variables", 
      // we can just trigger the standard variable creation flow or show a custom modal.
      // For now, let's create a new variable via prompt as a simple "Manage" action.
      Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace(), undefined, 'String');
  });

  // --- Custom Toolbox Category for Selection Lists ---
  ws.registerToolboxCategoryCallback('SELECTION_LISTS_CATEGORY', (workspace) => {
    const xmlList: Element[] = [];
    
    // We need to find all blocks that are GREEN (#4CAF50 or similar) and have a dropdown.
    // Since we can't easily inspect definitions at runtime in a clean way without iterating internal structures,
    // we will manually list the known ones or try to inspect.
    
    // Known Green Blocks with Dropdowns:
    const candidates = ['BOOL', 'VEHICLE_LIST_ITEM']; 
    // Note: RULE_HEADER is Purple.
    
    for (const type of candidates) {
        const block = document.createElement('block');
        block.setAttribute('type', type);
        xmlList.push(block);
    }
    
    return xmlList;
  });

  // --- Custom Toolbox Category for Subroutines ---
  ws.registerToolboxCategoryCallback('SUBROUTINES_CATEGORY', (workspace) => {
    const xmlList: Element[] = [];
    
    // 1. "New Subroutine" Button
    const btn = document.createElement('button');
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

      const blockXml = document.createElement('block');
      blockXml.setAttribute('type', 'CALLSUBROUTINE');
      
      // Add mutation to the call block so it knows what inputs to create
      const mutation = document.createElement('mutation');
      mutation.setAttribute('params', JSON.stringify(params));
      blockXml.appendChild(mutation);

      const field = document.createElement('field');
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
              alert("Please enter a subroutine name.");
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
