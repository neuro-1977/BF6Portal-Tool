// Initialize Blockly
var workspace = Blockly.inject('blocklyDiv', {
  toolbox: TOOLBOX_CONFIG,
  theme: Blockly.Themes.Dark,
  renderer: 'geras', // Standard puzzle-piece style
  zoom: {
    controls: true,
    wheel: true,
    startScale: 0.75, // Smaller blocks as requested
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2
  },
  grid: {
    spacing: 20,
    length: 3,
    colour: '#444',
    snap: true
  },
  trashcan: true
});

// Initialize Default MOD Block
var modBlock = workspace.newBlock('MOD_BLOCK');
modBlock.initSvg();
modBlock.render();
modBlock.moveBy(50, 50);

// Save/Load Functionality (JSON)
document.getElementById('saveBtn').addEventListener('click', function() {
  var state = Blockly.serialization.workspaces.save(workspace);
  var jsonText = JSON.stringify(state, null, 2);
  var blob = new Blob([jsonText], {type: 'application/json'});
  var a = document.createElement('a');
  a.download = 'portal_rules.json';
  a.href = URL.createObjectURL(blob);
  a.click();
});

document.getElementById('loadBtn').addEventListener('click', function() {
  document.getElementById('loadInput').click();
});

document.getElementById('codeBtn').addEventListener('click', function() {
  var codeDiv = document.getElementById('codeDiv');
  var codeOutput = document.getElementById('codeOutput');
  
  if (codeDiv.style.display === 'none') {
    codeDiv.style.display = 'block';
    var state = Blockly.serialization.workspaces.save(workspace);
    codeOutput.value = JSON.stringify(state, null, 2);
    // Resize workspace
    Blockly.svgResize(workspace);
  } else {
    codeDiv.style.display = 'none';
    Blockly.svgResize(workspace);
  }
});

// Update code view on change if visible
workspace.addChangeListener(function(event) {
  var codeDiv = document.getElementById('codeDiv');
  if (codeDiv.style.display !== 'none' && event.type !== Blockly.Events.UI) {
    var state = Blockly.serialization.workspaces.save(workspace);
    document.getElementById('codeOutput').value = JSON.stringify(state, null, 2);
  }
});

document.getElementById('loadInput').addEventListener('change', function(e) {
  var file = e.target.files[0];
  if (!file) return;
  
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var jsonText = e.target.result;
      var state = JSON.parse(jsonText);
      workspace.clear();
      Blockly.serialization.workspaces.load(state, workspace);
      console.log("Workspace loaded successfully.");
      alert("Workspace loaded successfully!");
    } catch (err) {
      console.error("Error loading workspace:", err);
      alert("Failed to load workspace. Please ensure the file is a valid JSON file saved from this editor.\n\nError: " + err.message);
    }
    // Reset input so same file can be loaded again if needed
    document.getElementById('loadInput').value = '';
  };
  reader.readAsText(file);
});

// Force toolbox style after injection (Fallback)
setTimeout(function() {
  var toolbox = document.getElementsByClassName('blocklyToolboxDiv')[0];
  if (toolbox) {
    toolbox.style.backgroundColor = '#1e1e1e';
  }
}, 100);

// Search Functionality
document.getElementById('blockSearch').addEventListener('input', function(e) {
  var searchTerm = e.target.value.toLowerCase();
  
  if (!searchTerm) {
    workspace.updateToolbox(TOOLBOX_CONFIG);
    return;
  }

  // Filter the toolbox config
  var newToolbox = {
    kind: 'categoryToolbox',
    contents: []
  };

  // Helper to search recursively
  function searchCategory(category) {
    var matchingBlocks = [];
    
    if (category.contents) {
      category.contents.forEach(item => {
        if (item.kind === 'block') {
          if (item.type.toLowerCase().includes(searchTerm)) {
            matchingBlocks.push(item);
          }
        } else if (item.kind === 'category') {
          // Recursive search in subcategories
          var subResults = searchCategory(item);
          if (subResults.length > 0) {
             // If subcategory has matches, add them (flattened or structured?)
             // Let's flatten for search results to make it easy to find
             matchingBlocks = matchingBlocks.concat(subResults);
          }
        }
      });
    }
    return matchingBlocks;
  }

  // Iterate top level categories
  TOOLBOX_CONFIG.contents.forEach(cat => {
    if (cat.kind === 'category') {
       var matches = searchCategory(cat);
       if (matches.length > 0) {
         // Create a filtered category
         newToolbox.contents.push({
           kind: 'category',
           name: cat.name,
           colour: cat.colour,
           contents: matches,
           expanded: true // Expand to show results
         });
       }
    }
  });
  
  // If no matches found, show empty
  if (newToolbox.contents.length === 0) {
      newToolbox.contents.push({
          kind: 'category',
          name: 'No Results',
          contents: []
      });
  }

  workspace.updateToolbox(newToolbox);
});

// Custom Context Menu Registry
// 1. Refresh Workspace
Blockly.ContextMenuRegistry.registry.register({
  displayText: 'Refresh Workspace',
  preconditionFn: function(scope) {
    return 'enabled';
  },
  callback: function(scope) {
    location.reload();
  },
  scopeType: Blockly.ContextMenuRegistry.ScopeType.WORKSPACE,
  id: 'refresh_workspace',
  weight: 0, // Top of the list
});

// 2. Block Help
Blockly.ContextMenuRegistry.registry.register({
  displayText: 'Show Help',
  preconditionFn: function(scope) {
    return 'enabled';
  },
  callback: function(scope) {
    var block = scope.block;
    showHelp(block.type);
  },
  scopeType: Blockly.ContextMenuRegistry.ScopeType.BLOCK,
  id: 'show_block_help',
  weight: 100,
});

// Help Modal Logic
var modal = document.getElementById("helpModal");
var span = document.getElementsByClassName("close")[0];
var helpTitle = document.getElementById("helpTitle");
var helpBody = document.getElementById("helpBody");

span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function showHelp(blockType) {
  // Try to find help data
  // 1. Direct match in BLOCK_HELP
  // 2. Category match (e.g. all MATH blocks might share help if not specific)
  
  var data = BLOCK_HELP[blockType];
  var image = BLOCK_IMAGES[blockType];
  
  // Fallback: Try to find category-level image if no specific image
  if (!image) {
     // Simple heuristic: check if blockType starts with a category name
     for (var key in BLOCK_IMAGES) {
         if (blockType.startsWith(key)) {
             image = BLOCK_IMAGES[key];
             break;
         }
     }
  }

  var html = "";
  
  if (data) {
    helpTitle.innerText = data.title || blockType;
    html += `<div class="help-section"><p>${data.description || "No description available."}</p></div>`;
    
    if (data.usage && data.usage.length > 0) {
        html += `<div class="help-section"><h3>Usage</h3><ul>`;
        data.usage.forEach(u => html += `<li>${u}</li>`);
        html += `</ul></div>`;
    }
    
    if (data.tips && data.tips.length > 0) {
        html += `<div class="help-section"><h3>Tips</h3><ul>`;
        data.tips.forEach(t => html += `<li>${t}</li>`);
        html += `</ul></div>`;
    }
  } else {
    helpTitle.innerText = blockType;
    html += `<p>No specific help data available for this block.</p>`;
  }

  if (image) {
    html += `<div class="help-section"><h3>Reference Image</h3><img src="${image}" class="help-image" alt="${blockType} Reference"></div>`;
  }

  helpBody.innerHTML = html;
  modal.style.display = "block";
}
