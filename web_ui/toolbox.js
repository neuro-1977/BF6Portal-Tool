// web_ui/toolbox.js - Generates the Blockly toolbox from menu data with specified order and colours

import * as Blockly from 'blockly';
import menuData from './bf6portal-menu-data.json'; // Load your menu data

// Function to generate toolbox XML in the required order
export function generateToolbox() {
  let toolboxXML = '<xml id="toolbox" style="display: none">';

  // Search box (placeholder - integrate with your UI if needed; this adds a category for search)
  toolboxXML += '<category name="Search" colour="0">'; // Grey for search
  toolboxXML += '<block type="search_block_placeholder"></block>'; // Add a custom search block if needed
  toolboxXML += '</category>';

  // Rules menu
  toolboxXML += '<category name="Rules" colour="65">'; // Orange for events/rules
  toolboxXML += '<block type="mod"></block>'; // mod
  toolboxXML += '<block type="rules"></block>'; // rules
  toolboxXML += '<block type="condition"></block>'; // condition
  toolboxXML += '</category>';

  // Yellow menus (colour 60 - Yellow) for action/statement blocks
  const yellowMenus = ['AI', 'ARRAYS', 'AUDIO', 'EFFECTS', 'EMPLACEMENTS', 'GAMEPLAY', 'LOGIC', 'OBJECTIVE', 'OTHER', 'PLAYER', 'TRANSFORM', 'USER INTERFACE', 'VEHICLES'];
  toolboxXML += '<category name="Yellow Menus" colour="60">';
  yellowMenus.forEach(menu => {
    toolboxXML += `<category name="${menu}" colour="60">`;
    // Add all yellow (statement) blocks to this menu (filter from all_blocks or menuData)
    // Example: toolboxXML += '<block type="set_variable"></block>'; // Add your yellow blocks here
    // Use a function to add blocks dynamically from bf6portal.ts or menuData
    toolboxXML += getBlocksForMenu(menu, 'yellow'); // Custom function below
    toolboxXML += '</category>';
  });
  toolboxXML += '</category>';

  // Green menus (colour 120 - Green) for value blocks
  const greenMenus = ['AI', 'ARRAYS', 'AUDIO', 'EFFECTS', 'EVENT PAYLOADS', 'GAMEPLAY', 'LOGIC', 'MATH', 'OBJECTIVE', 'OTHER', 'PLAYER', 'TRANSFORM', 'USER INTERFACE', 'VEHICLES', 'SELECTION LISTS', 'LITERALS', 'VARIABLES'];
  toolboxXML += '<category name="Green Menus" colour="120">';
  greenMenus.forEach(menu => {
    toolboxXML += `<category name="${menu}" colour="120">`;
    toolboxXML += getBlocksForMenu(menu, 'green');
    toolboxXML += '</category>';
  });
  toolboxXML += '</category>';

  // Dark orange subroutines menu (colour 30 - Dark orange)
  toolboxXML += '<category name="Subroutines" colour="30">';
  toolboxXML += '<block type="subroutine"></block>'; // Add subroutine blocks
  toolboxXML += '</category>';

  // Blue control actions menu (colour 210 - Blue)
  toolboxXML += '<category name="Control Actions" colour="210">';
  toolboxXML += '<block type="if"></block>'; // Add control blocks like if, while, etc.
  toolboxXML += '</category>';

  toolboxXML += '</xml>';
  return toolboxXML;
}

// Helper function to get blocks for a menu (filter by type: yellow for statements, green for values)
function getBlocksForMenu(menuName, type) {
  // Logic to filter blocks from bf6portal.ts or menuData.json
  // Example: Return XML for blocks in that menu
  // For now, placeholder - replace with actual block types from your data
  let xml = '';
  // E.g., if (menuName === 'MATH' && type === 'green') xml += '<block type="add"></block>';
  // Integrate with menuData or all_blocks list to populate dynamically
  return xml;
}

// In your main app (e.g., index.ts or view-data.ts), use this to set the toolbox
const toolbox = generateToolbox();
workspace.updateToolbox(toolbox);