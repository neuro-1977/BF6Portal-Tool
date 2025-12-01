// --- Central Error/Status Box Helper ---
function showErrorBox(title, messages, dismissable) {
  // Also show error in splashErrorFrame if present
  const splashErrorFrame = document.getElementById('splashErrorFrame');
  if (splashErrorFrame) {
    if (!messages || (Array.isArray(messages) && messages.length === 0)) {
      splashErrorFrame.innerHTML = '';
    } else {
      splashErrorFrame.innerHTML = (Array.isArray(messages) ? messages : [messages])
        .map(m => `<div>${m}</div>`).join('');
    }
  }
  // Legacy error box logic (for non-splash errors)
  const box = document.getElementById('errorBox');
  const boxTitle = document.getElementById('errorBoxTitle');
  const boxMessages = document.getElementById('errorBoxMessages');
  const boxClose = document.getElementById('errorBoxClose');
  if (!box || !boxTitle || !boxMessages) return;
  boxTitle.textContent = title || 'PORTAL STATUS';
  if (Array.isArray(messages)) {
    boxMessages.innerHTML = messages.map(m => `<div>${m}</div>`).join('');
  } else {
    boxMessages.innerHTML = messages ? `<div>${messages}</div>` : '';
  }
  box.style.display = 'block';
  if (boxClose) {
    if (dismissable) {
      boxClose.style.display = 'block';
      boxClose.onclick = () => { box.style.display = 'none'; };
    } else {
      boxClose.style.display = 'none';
      boxClose.onclick = null;
    }
  }
}
// --- Session Keep-Alive and UI Health Check ---
function keepSessionAlive() {
  setInterval(() => {
    fetch('app_logo.png', {cache: 'no-store'}).catch(() => {});
  }, 2 * 60 * 1000); // Every 2 minutes
}

function checkUIHealth() {
  function check() {
    let errors = [];
    // Check for canvas
    const blocklyDiv = document.getElementById('blocklyDiv');
    if (!blocklyDiv || blocklyDiv.offsetParent === null) errors.push('Canvas (blocklyDiv) missing or hidden');
    if (errors.length) {
      console.error('UI Health Check Failed:', errors);
      // Remove top banner if present
      const alert = document.getElementById('uiHealthAlert');
      if (alert) alert.remove();
      showErrorBox('PORTAL STATUS', ['Critical UI elements are missing.', ...errors], false);
    } else {
      const alert = document.getElementById('uiHealthAlert');
      if (alert) alert.remove();
      const box = document.getElementById('errorBox');
      if (box) box.style.display = 'none';
    }
  }
  setInterval(check, 10000); // Every 10 seconds
}

// Start keep-alive and health check on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
        // Diagnostics for animated loading bar
        const animatedLoadingBarAnim = document.getElementById('animatedLoadingBarAnim');
        if (animatedLoadingBarAnim) {
          console.log('[ANIMATED LOADING BAR] Element found:', animatedLoadingBarAnim);
        } else {
          console.warn('[ANIMATED LOADING BAR] animatedLoadingBarAnim element NOT found');
        }
        // Diagnostics for ticker
        const splashTicker = document.getElementById('splashTicker');
        const quirkyTickerComments = [
          "Day is a vestigial mode of time measurement based on solar cycles. Not applicable. I didn't get you anything.",
          "Banana in disk drive error.",
          "Welcome to the BF6Portal Tool!",
          "Please insert disk 3. Banana not detected.",
          "Look behind you! A three-headed monkey!",
          "Press any key to continue. Where's the 'any' key?",
          "Recalibrating flux capacitor...",
          "Swapping the dilithium crystals...",
          "'Curse your sudden but inevitable betrayal!'",
          "'Also, I can kill you with my brain.'",
          "Reticulating splines...",
          "Monkey Island: Loading grog...",
          "Cannon Fodder: 'This game is dedicated to all the soldiers who gave their lives in the war against boredom.'",
          "BF6Portal Tool is actually trying to fix things. Please stand by...",
          "If this takes too long, blame the server monkeys.",
          "Did you try turning it off and on again?",
          "'You can't take the sky from me.'",
          "Loading... (We swear it's doing something!)",
          "Gemini and Neuro approve this message.",
          "Special thanks to ANDY6170 and BattlefieldPortalHub!",
          "No more rainbow flash. No more green glitch. Just pure portal magic.",
          "If you can read this, you're awesome!"
        ];
        window._tickerIndex = window._tickerIndex || 0;
        function cycleTickerMsg() {
          if (splashTicker) {
            splashTicker.style.display = 'block';
            splashTicker.style.opacity = '1';
            splashTicker.textContent = quirkyTickerComments[window._tickerIndex % quirkyTickerComments.length];
            console.log('[TICKER] Set to:', splashTicker.textContent);
            window._tickerIndex++;
          } else {
            console.warn('[TICKER] splashTicker element NOT found at cycleTickerMsg');
          }
        }
        if (splashTicker) {
          setTimeout(() => {
            cycleTickerMsg();
            setInterval(cycleTickerMsg, 12000);
          }, 100);
        } else {
          // Fallback: try again after a short delay
          setTimeout(() => {
            const splashTickerRetry = document.getElementById('splashTicker');
            if (splashTickerRetry) {
              splashTickerRetry.style.display = 'block';
              splashTickerRetry.style.opacity = '1';
              splashTickerRetry.textContent = 'Welcome to the BF6Portal Tool!';
              console.warn('[TICKER] splashTicker element found on retry, fallback message set.');
            } else {
              console.error('[TICKER] splashTicker element NOT found after retry.');
            }
          }, 500);
        }
    // Animated loading bar notch state logic
    const notch1 = document.getElementById('notch1');
    const notch2 = document.getElementById('notch2');
    const notch3 = document.getElementById('notch3');
    function setNotchState(state) {
      // state: 1=webui, 2=blockly loading, 3=final checks
      if (notch1) notch1.style.opacity = (state >= 1) ? '1' : '0.4';
      if (notch2) notch2.style.opacity = (state >= 2) ? '1' : '0.4';
      if (notch3) notch3.style.opacity = (state >= 3) ? '1' : '0.4';
      // Move animated loading bar to correct notch
      if (animatedLoadingBarAnim) {
        // Let CSS animation handle movement for splash loading bar
        // Optionally, you could disable animation and set left for final state if needed
      }
    }
    // Initial state: web UI loaded
    setNotchState(1);

    // --- Splash Ticker: Show quirky message in splashTicker only ---
    // (Handled above, removed duplicate logic)
  // DIAGNOSTIC: Log TOOLBOX_CONFIG before Blockly.inject
  console.log('[DIAG] TOOLBOX_CONFIG at inject time:', typeof TOOLBOX_CONFIG, TOOLBOX_CONFIG);
  // Check for Blockly media assets
  fetch('blockly/media/sprites.png', {method: 'HEAD'}).then(resp => {
    if (!resp.ok) {
      showErrorBox('BLOCKLY MEDIA MISSING', [
        'The Blockly media directory is missing or incomplete.',
        'Some icons, cursors, or sounds may not display correctly.',
        'To fix: Copy the full contents of the official Blockly media/ directory to web_ui/blockly/media/'
      ], true);
    }
  }).catch(() => {
    showErrorBox('BLOCKLY MEDIA MISSING', [
      'The Blockly media directory is missing or incomplete.',
      'Some icons, cursors, or sounds may not display correctly.',
      'To fix: Copy the full contents of the official Blockly media/ directory to web_ui/blockly/media/'
    ], true);
  });
  // --- Splash Ticker: Ensure it is visible and cycles before Blockly loads ---
  // (Handled above, removed duplicate logic)
  // Recenter button functionality
  var recenterBtn = document.getElementById('recenterBtn');
  // --- Minimal Blockly Injection ---
  try {
      // When Blockly starts loading, set notch 2
      setNotchState(2);
    // Robust diagnostics for Blockly and toolbox
    if (typeof Blockly === 'undefined') {
      showErrorBox('PORTAL ERROR', ['Blockly is not loaded. Check that blockly.min.js is present and not blocked.'], true);
      document.getElementById('splashScreen').style.display = 'flex';
      document.getElementById('blocklyDiv').style.display = 'none';
      return;
    }
    if (typeof TOOLBOX_CONFIG === 'undefined' || !TOOLBOX_CONFIG.contents || TOOLBOX_CONFIG.contents.length === 0) {
      showErrorBox('PORTAL ERROR', ['TOOLBOX_CONFIG is missing or empty. Check toolbox.js.'], true);
      document.getElementById('splashScreen').style.display = 'flex';
      document.getElementById('blocklyDiv').style.display = 'none';
      return;
    }
    // Only inject Blockly ONCE, with correct config and trashcan disabled
    if (window.workspace && window.workspace.dispose) {
      window.workspace.dispose();
    }
    window.workspace = Blockly.inject('blocklyDiv', {
      toolbox: TOOLBOX_CONFIG,
      theme: Blockly.Themes.Dark,
      renderer: 'geras',
      zoom: {
        controls: false,
        wheel: true,
        startScale: 0.75,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      },
      grid: {
        spacing: 20,
        length: 20,
        colour: '#444',
        snap: true
      },
      trashcan: false
    });
    setTimeout(function() {
      var toolboxDiv = document.querySelector('.blocklyToolboxDiv');
      if (!toolboxDiv) {
        console.error('[DIAG] .blocklyToolboxDiv NOT FOUND after Blockly injection!');
        showErrorBox('PORTAL ERROR', ['Toolbox missing! (.blocklyToolboxDiv not found)', 'Try reloading the page or reporting this issue.'], true);
        document.getElementById('splashScreen').style.display = 'flex';
        document.getElementById('blocklyDiv').style.display = 'none';
      } else {
        console.log('[DIAG] .blocklyToolboxDiv FOUND after Blockly injection.');
        toolboxDiv.style.outline = '3px solid #4fc3f7';
        toolboxDiv.style.boxShadow = '0 0 16px 4px #4fc3f7cc';
        document.getElementById('splashScreen').style.display = 'none';
        document.getElementById('blocklyDiv').style.display = 'block';
      }
    }, 800);
    if (recenterBtn) {
      recenterBtn.addEventListener('click', function() {
        if (window.workspace) {
          window.workspace.scrollCenter();
        }
      });
    }
    // Restore right-click context menu
    window.workspace.configureContextMenu && window.workspace.configureContextMenu();
    // Save/Load/Export/Import/About button handlers (unchanged)
    document.getElementById('saveBtn').onclick = function() {
      var state = Blockly.serialization.workspaces.save(window.workspace);
      var jsonText = JSON.stringify(state, null, 2);
      var blob = new Blob([jsonText], {type: 'application/json'});
      var a = document.createElement('a');
      a.download = 'portal_rules.json';
      a.href = URL.createObjectURL(blob);
      a.click();
    };
    document.getElementById('loadBtn').onclick = function() {
      document.getElementById('importInput').accept = '.json';
      document.getElementById('importInput').onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
          try {
            const state = JSON.parse(evt.target.result);
            Blockly.serialization.workspaces.load(state, window.workspace);
          } catch (err) {
            showErrorBox('LOAD ERROR', ['Failed to load workspace: ' + err.message], true);
          }
        };
        reader.readAsText(file);
      };
      document.getElementById('importInput').click();
    };
    document.getElementById('exportBtn').onclick = function() {
      if (!window.Blockly || !window.workspace) {
        alert('Blockly workspace not loaded.');
        return;
      }
      // Prompt user for export type
      const type = prompt('Export as (json/ts)?', 'json');
      const json = Blockly.serialization.workspaces.save(window.workspace);
      if (type && type.toLowerCase() === 'ts') {
        // Export as TypeScript
        const tsCode = typeof blocklyToTypeScript === 'function' ? blocklyToTypeScript(json) : '// TypeScript export not implemented.';
        const blob = new Blob([tsCode], {type: 'text/typescript'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'portal_script.ts';
        a.click();
      } else {
        // Export as JSON
        const jsonText = JSON.stringify(json, null, 2);
        const blob = new Blob([jsonText], {type: 'application/json'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'portal_rules.json';
        a.click();
      }
    };
    document.getElementById('importBtn').onclick = function() {
      document.getElementById('importInput').accept = '.json,.ts';
      document.getElementById('importInput').onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const ext = file.name.split('.').pop().toLowerCase();
        const reader = new FileReader();
        reader.onload = function(evt) {
          if (ext === 'json') {
            try {
              const state = JSON.parse(evt.target.result);
              Blockly.serialization.workspaces.load(state, window.workspace);
            } catch (err) {
              showErrorBox('IMPORT ERROR', ['Failed to import JSON: ' + err.message], true);
            }
          } else if (ext === 'ts') {
            // TODO: Implement TypeScript import logic
            showErrorBox('IMPORT ERROR', ['TypeScript import is not yet implemented.'], true);
          } else {
            showErrorBox('IMPORT ERROR', ['Unsupported file type: ' + ext], true);
          }
        };
        reader.readAsText(file);
      };
      document.getElementById('importInput').click();
    };
    document.getElementById('aboutBtn').onclick = function() {
      document.getElementById('aboutModal').style.display = 'block';
    };
    document.getElementById('closeAboutModal').onclick = function() {
      document.getElementById('aboutModal').style.display = 'none';
    };
    window.onclick = function(event) {
      if (event.target == document.getElementById('aboutModal')) {
        document.getElementById('aboutModal').style.display = 'none';
      }
    };
    // Restore grid lines (not dots)
    var svg = document.querySelector('#blocklyDiv > .blocklySvg');
    if (svg) {
      var gridPattern = svg.querySelector('pattern[patternUnits]');
      if (gridPattern) {
        gridPattern.setAttribute('width', '20');
        gridPattern.setAttribute('height', '20');
        var lines = gridPattern.querySelectorAll('line');
        lines.forEach(function(line) { line.setAttribute('stroke', '#444'); });
      }
    }
  } catch (e) {
    showErrorBox('PORTAL ERROR', ['Critical Error: Blockly failed to initialize.', e.message], true);
    document.getElementById('splashScreen').style.display = 'flex';
    document.getElementById('blocklyDiv').style.display = 'none';
    console.error('[BF6Portal] Blockly injection failed:', e);
    return;
  }
    // --- Splash Screen Ticker with Quirky Comments ---
    const splashTicker = document.getElementById('splashTicker');
    const splashMsg = document.getElementById('splashMsg');
    const splashError = document.getElementById('splashError');
    const quirkyTickerComments = [
      "Welcome to the BF6Portal Tool!",
      "Please insert disk 3. Banana not detected.",
      "Look behind you! A three-headed monkey!",
      "Press any key to continue. Where's the 'any' key?",
      "Recalibrating flux capacitor...",
      "Swapping the dilithium crystals...",
      "'Curse your sudden but inevitable betrayal!'",
      "'Also, I can kill you with my brain.'",
      "Reticulating splines...",
      "Monkey Island: Loading grog...",
      "Cannon Fodder: 'This game is dedicated to all the soldiers who gave their lives in the war against boredom.'",
      "BF6Portal Tool is actually trying to fix things. Please stand by...",
      "If this takes too long, blame the server monkeys.",
      "Did you try turning it off and on again?",
      "'You can't take the sky from me.'",
      "Loading... (We swear it's doing something!)",
      "Gemini and Neuro approve this message.",
      "Special thanks to ANDY6170 and BattlefieldPortalHub!",
      "No more rainbow flash. No more green glitch. Just pure portal magic.",
      "If you can read this, you're awesome!"
    ];
    let tickerIndex = 0;
    function cycleTickerMsg() {
      if (splashTicker) splashTicker.textContent = quirkyTickerComments[tickerIndex % quirkyTickerComments.length];
      tickerIndex++;
    }
    cycleTickerMsg();
    setInterval(cycleTickerMsg, 12000);
    // Optionally, clear splashMsg (no witty comments here)
    if (splashMsg) splashMsg.textContent = '';

    // --- Splash Error Display Helper ---
    window.showSplashError = function(msgs) {
      if (!splashError) return;
      if (!msgs || !msgs.length) {
        splashError.innerHTML = '';
        return;
      }
      splashError.innerHTML = `<div style="font-size:1.15em;margin-bottom:6px;">Oops! Something went sideways:</div>` +
        msgs.map(e => `<div style='margin-bottom:2px;'>🛠️ <span style='color:#fff;'>${e}</span></div>`).join('') +
        `<div style='margin-top:8px;font-size:0.95em;color:#baff80;'>Don't panic. The devs are probably already on it.</div>`;
    }
  // Hide splash when everything is ready
  function hideSplash() {
    const splash = document.getElementById('splashScreen');
    if (splash) splash.style.opacity = '0';
    setTimeout(() => { if (splash) splash.style.display = 'none'; }, 600);
  }

  // Show error overlay if Blockly fails to load after timeout
  function showCriticalLoadError() {
    const splash = document.getElementById('splashScreen');
    if (splash) {
      splash.style.opacity = '1';
      splash.style.display = 'flex';
      const splashMsg = document.getElementById('splashMsg');
      const splashError = document.getElementById('splashError');
      if (splashMsg) splashMsg.innerHTML = '';
      if (splashError) splashError.innerHTML = `<div style="font-size:1.15em;margin-bottom:6px;">Critical Error: Blockly failed to load.</div><div style='margin-bottom:2px;'>🛠️ <span style='color:#fff;'>The core editor could not be initialized.<br>Check that <b>blockly.min.js</b> is present and not blocked by browser or server.</span></div><div style='margin-top:8px;font-size:0.95em;color:#baff80;'>If this persists, please contact support with a screenshot.</div>`;
    }
  }

  // Wait for Blockly and UI to be ready, or show error after 5s
  let blocklyReady = false;
    // When final checks complete, set notch 3
    setNotchState(3);
  function tryReady() {
    console.log('[BF6Portal] Checking for Blockly:', typeof Blockly);
    if (typeof Blockly !== 'undefined' && document.getElementById('blocklyDiv')) {
      console.log('[BF6Portal] Blockly loaded and blocklyDiv present.');
      blocklyReady = true;
      hideSplash();
      keepSessionAlive();
      checkUIHealth();
      // About modal logic
      const aboutBtn = document.getElementById('aboutBtn');
      const aboutModal = document.getElementById('aboutModal');
      const closeAbout = document.getElementById('closeAboutModal');
      if (aboutBtn && aboutModal && closeAbout) {
        aboutBtn.onclick = function() { aboutModal.style.display = 'block'; };
        closeAbout.onclick = function() { aboutModal.style.display = 'none'; };
        window.addEventListener('click', function(event) {
          if (event.target == aboutModal) aboutModal.style.display = 'none';
        });
      }
      // Onboarding modal logic
      const onboardingModal = document.getElementById('onboardingModal');
      const closeOnboardingBtn = document.getElementById('closeOnboardingBtn');
      if (onboardingModal && closeOnboardingBtn) {
        if (!sessionStorage.getItem('onboardingDismissed')) {
          onboardingModal.style.display = 'flex';
        }
        closeOnboardingBtn.onclick = function() {
          onboardingModal.style.display = 'none';
          sessionStorage.setItem('onboardingDismissed', '1');
        };
      }
      // Menu button logic (Save, Load, Code, Export, Import)
      const saveBtn = document.getElementById('saveBtn');
      const loadBtn = document.getElementById('loadBtn');
      const codeBtn = document.getElementById('codeBtn');
      const exportTsBtn = document.getElementById('exportTsBtn');
      const importTscnBtn = document.getElementById('importTscnBtn');
      if (saveBtn) saveBtn.disabled = false;
      if (loadBtn) loadBtn.disabled = false;
      if (codeBtn) codeBtn.disabled = false;
      if (exportTsBtn) exportTsBtn.disabled = false;
      if (importTscnBtn) importTscnBtn.disabled = false;
    } else {
      setTimeout(tryReady, 100);
    }
  }
  tryReady();
  setTimeout(function() {
    if (!blocklyReady) {
      showCriticalLoadError();
    }
  }, 5000);
});
// .tscn map file import handler (stub)
document.addEventListener('DOMContentLoaded', function() {
  const importTscnBtn = document.getElementById('importTscnBtn');
  const tscnInput = document.getElementById('tscnInput');
  if (importTscnBtn && tscnInput) {
    importTscnBtn.addEventListener('click', function() {
      tscnInput.value = '';
      tscnInput.click();
    });
    tscnInput.addEventListener('change', function(e) {
      const file = tscnInput.files && tscnInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(evt) {
        const text = evt.target.result;
        // TODO: Parse .tscn, extract IDs >1, sync to block presets, enable editing and sync to script blocks
        alert('.tscn import is coming soon! File loaded: ' + file.name);
      };
      reader.readAsText(file);
    });
  }
});
// Export to TypeScript handler
document.addEventListener('DOMContentLoaded', function() {
  const exportTsBtn = document.getElementById('exportTsBtn');
  if (exportTsBtn) {
    exportTsBtn.addEventListener('click', function() {
      if (!window.Blockly || !window.workspace) {
        showErrorBox('EXPORT ERROR', ['Blockly workspace not loaded.'], true);
        return;
      }
      const xml = Blockly.Xml.workspaceToDom(window.workspace);
      const json = Blockly.serialization.workspaces.save(window.workspace);
      // Convert to TypeScript (stub)
      const tsCode = blocklyToTypeScript(json);
      // Download as .ts file
      const blob = new Blob([tsCode], {type: 'text/typescript'});
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'portal_script.ts';
      document.body.appendChild(a);
      // --- NEUROMANCER Glitch Animation Logic ---
      const neuroGlitchFrames = [
        'assets/img/neuro_glitch/neuromancer_full.png',
        'assets/img/neuro_glitch/neuromancer_glitch1.png',
        'assets/img/neuro_glitch/neuromancer_glitch2.png',
        'assets/img/neuro_glitch/neuromancer_glitch3.png',
        'assets/img/neuro_glitch/neuromancer_glitch4.png'
      ];
      let neuroGlitchIntervalError = null;
      let neuroGlitchIntervalAbout = null;

      function startNeuroGlitchAnimation(imgId, intervalRefName) {
        const img = document.getElementById(imgId);
        if (!img) return;
        let frame = 0;
        if (window[intervalRefName]) clearInterval(window[intervalRefName]);
        window[intervalRefName] = setInterval(() => {
          // Show full logo most of the time, glitch frames randomly
          if (Math.random() < 0.7) {
            img.src = neuroGlitchFrames[0];
          } else {
            frame = 1 + Math.floor(Math.random() * (neuroGlitchFrames.length - 1));
            img.src = neuroGlitchFrames[frame];
          }
        }, 80 + Math.random() * 120);
      }
      function stopNeuroGlitchAnimation(intervalRefName) {
        if (window[intervalRefName]) {
          clearInterval(window[intervalRefName]);
          window[intervalRefName] = null;
        }
      }

      // Start keep-alive and health check on DOMContentLoaded
      a.click();
      setTimeout(() => { document.body.removeChild(a); }, 100);
    });
  }
});

// Stub: Convert Blockly JSON to TypeScript code
function blocklyToTypeScript(json) {
  // TODO: Implement real conversion logic
  // This is where widget/block-to-code fidelity logic will be implemented.
  // The 'json' parameter contains the full workspace structure, including all edited widgets/blocks.
  return `// TypeScript export (stub)\n// Blocks: ${json.blocks && json.blocks.length ? json.blocks.length : 0}\n\n// ...actual code generation coming soon...`;
}
// Onboarding modal logic
window.addEventListener('DOMContentLoaded', function() {
  const onboardingModal = document.getElementById('onboardingModal');
  const closeOnboardingBtn = document.getElementById('closeOnboardingBtn');
  if (onboardingModal && closeOnboardingBtn) {
    if (!sessionStorage.getItem('onboardingDismissed')) {
      onboardingModal.style.display = 'flex';
    }
    closeOnboardingBtn.onclick = function() {
      onboardingModal.style.display = 'none';
      sessionStorage.setItem('onboardingDismissed', '1');
    };
  }
});
// Move search bar to top of toolbox/sidebar
document.addEventListener('DOMContentLoaded', function() {
  // Wait for toolbox to be rendered
  setTimeout(function() {
    var toolboxDiv = document.querySelector('.blocklyToolboxDiv');
    if (toolboxDiv && !document.getElementById('blockSearchContainer')) {
      var searchContainer = document.createElement('div');
      searchContainer.id = 'blockSearchContainer';
      searchContainer.style.padding = '10px 8px 4px 8px';
      searchContainer.style.background = '#23272e';
      searchContainer.style.position = 'sticky';
      searchContainer.style.top = '0';
      searchContainer.style.zIndex = '10';
      var searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.id = 'blockSearch';
      searchInput.placeholder = 'Search blocks...';
      searchInput.style.width = '100%';
      searchInput.style.padding = '6px';
      searchInput.style.background = '#3c3c3c';
      searchInput.style.color = 'white';
      searchInput.style.border = '1px solid #555';
      searchInput.style.borderRadius = '4px';
      searchInput.style.fontSize = '15px';
      searchContainer.appendChild(searchInput);
      toolboxDiv.insertBefore(searchContainer, toolboxDiv.firstChild);
    }
  }, 400);
});
var blockSearchElem = document.getElementById('blockSearch');
if (blockSearchElem) {
  blockSearchElem.addEventListener('input', function(e) {
    var searchTerm = e.target.value;
    // Easter egg: andy6170ftw (exact, secret)
    if (searchTerm === 'andy6170ftw') {
      showEasterEgg();
      return;
    }
    if (!searchTerm) {
      workspace.updateToolbox(TOOLBOX_CONFIG);
      return;
    }
    // Collect all matching blocks from all categories
    function collectBlocks(category) {
      let blocks = [];
      if (category.contents) {
        category.contents.forEach(item => {
          if (item.kind === 'block') {
            if (item.type.toLowerCase().includes(searchTerm)) {
              blocks.push(item);
            }
          } else if (item.kind === 'category') {
            blocks = blocks.concat(collectBlocks(item));
          }
        });
      }
      return blocks;
    }
    let allMatches = [];
    TOOLBOX_CONFIG.contents.forEach(cat => {
      if (cat.kind === 'category') {
        allMatches = allMatches.concat(collectBlocks(cat));
      }
    });
    var newToolbox = {
      kind: 'categoryToolbox',
      contents: []
    };
    if (allMatches.length > 0) {
      newToolbox.contents.push({
        kind: 'category',
        name: 'Search Results',
        colour: '#4fc3f7',
        contents: allMatches,
        expanded: true
      });
    } else {
      newToolbox.contents.push({
        kind: 'category',
        name: 'No Results',
        contents: []
      });
    }
    workspace.updateToolbox(newToolbox);
  });
} else {
  console.error('[BF6Portal] blockSearch element not found; search disabled.');
}
// Internal error/service health check logic
document.addEventListener('DOMContentLoaded', function() {
  var healthBtn = document.getElementById('healthCheckBtn');
  var healthModal = document.getElementById('healthModal');
  var healthBody = document.getElementById('healthBody');
  var closeHealth = document.getElementById('closeHealthModal');
  if (healthBtn && healthModal && healthBody && closeHealth) {
    healthBtn.addEventListener('click', function() {
      let results = [];
      // Core JS objects
      results.push(window.Blockly ? 'Blockly loaded' : 'Blockly MISSING');
      results.push(window.workspace ? 'Workspace loaded' : 'Workspace MISSING');
      results.push(typeof TOOLBOX_CONFIG !== 'undefined' ? 'Toolbox config loaded' : 'Toolbox config MISSING');
      results.push(typeof BLOCK_HELP !== 'undefined' ? 'Block help loaded' : 'Block help MISSING');
      results.push(typeof BLOCK_IMAGES !== 'undefined' ? 'Block images loaded' : 'Block images MISSING');
      // DOM elements
      results.push(document.getElementById('blocklyDiv') ? 'blocklyDiv present' : 'blocklyDiv MISSING');
      results.push(document.getElementById('header') ? 'header present' : 'header MISSING');
      // Blockly health
      try {
        let blockCount = window.workspace ? window.workspace.getAllBlocks().length : 0;
        results.push('Blocks in workspace: ' + blockCount);
      } catch (e) {
        results.push('Error checking blocks: ' + e.message);
      }
      // Backend/server reachability check
      fetch('app_logo.png', {cache: 'no-store'})
        .then(resp => {
          if (resp.ok) {
            results.push('Backend/server: ONLINE');
          } else {
            results.push('Backend/server: OFFLINE (logo fetch failed)');
          }
          healthBody.innerHTML = '<ul>' + results.map(r => `<li>${r}</li>`).join('') + '</ul>';
          healthModal.style.display = 'block';
        })
        .catch(() => {
          results.push('Backend/server: OFFLINE (fetch error)');
          healthBody.innerHTML = '<ul>' + results.map(r => `<li>${r}</li>`).join('') + '</ul>';
          healthModal.style.display = 'block';
        });
    });
    closeHealth.onclick = function() { healthModal.style.display = 'none'; };
    window.onclick = function(event) {
      if (event.target == healthModal) healthModal.style.display = 'none';
    };
  }
});
// Floating recenter (compass) button logic
document.addEventListener('DOMContentLoaded', function() {
  var recenterBtn = document.getElementById('recenterBtn');
  if (recenterBtn && window.workspace) {
    recenterBtn.addEventListener('click', function() {
      // Center the workspace view on the blocks
      window.workspace.scrollCenter();
    });
  }
});
// Zoom slider logic
function setupZoomSlider() {
  var zoomSlider = document.getElementById('zoomSlider');
  var zoomValue = document.getElementById('zoomValue');
  if (zoomSlider && zoomValue && window.workspace) {
    zoomSlider.addEventListener('input', function() {
      var scale = parseInt(zoomSlider.value, 10) / 100;
      window.workspace.setScale(scale);
      zoomValue.textContent = zoomSlider.value + '%';
      Blockly.svgResize(window.workspace);
    });
    // Sync slider with initial zoom
    zoomSlider.value = Math.round(window.workspace.scale * 100);
    zoomValue.textContent = zoomSlider.value + '%';
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupZoomSlider);
} else {
  setupZoomSlider();
}
// Add detailed tooltips for all blocks
if (typeof BLOCK_HELP !== 'undefined' && typeof Blockly !== 'undefined' && Blockly.Blocks) {
  Object.keys(BLOCK_HELP).forEach(function(key) {
    if (Blockly.Blocks[key]) {
      Blockly.Blocks[key].tooltip = BLOCK_HELP[key].description || BLOCK_HELP[key].title || key;
    }
  });
}
// Initialize Default MOD Block only if workspace exists
if (window.workspace) {
  var modBlock = window.workspace.newBlock('MOD_BLOCK');
  modBlock.initSvg();
  modBlock.render();
  modBlock.moveBy(50, 50);
}

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


// Resizable code window logic
var codeBtn = document.getElementById('codeBtn');
var codeDiv = document.getElementById('codeDiv');
var codeOutput = document.getElementById('codeOutput');
var dragDivider = document.getElementById('dragDivider');
var blocklyDiv = document.getElementById('blocklyDiv');
var editorContainer = document.getElementById('editorContainer');

codeBtn.addEventListener('click', function() {
  if (codeDiv.style.display === 'none') {
    codeDiv.style.display = 'block';
    dragDivider.style.display = 'flex';
    var state = Blockly.serialization.workspaces.save(workspace);
    codeOutput.value = JSON.stringify(state, null, 2);
    Blockly.svgResize(workspace);
  } else {
    codeDiv.style.display = 'none';
    dragDivider.style.display = 'none';
    // Reset blocklyDiv to fill container
    blocklyDiv.style.flex = '1 1 auto';
    Blockly.svgResize(workspace);
  }
});

// Drag-to-resize logic
let isDragging = false;
let startY = 0;
let startCodeHeight = 0;

dragDivider.addEventListener('mousedown', function(e) {
  isDragging = true;
  startY = e.clientY;
  startCodeHeight = codeDiv.offsetHeight;
  document.body.style.cursor = 'row-resize';
  document.body.style.userSelect = 'none';
});

window.addEventListener('mousemove', function(e) {
  if (!isDragging) return;
  var dy = startY - e.clientY;
  var newCodeHeight = Math.max(80, startCodeHeight + dy); // min 80px
  var containerHeight = editorContainer.offsetHeight;
  var maxCodeHeight = Math.max(120, containerHeight - 120); // leave min 120px for Blockly
  newCodeHeight = Math.min(newCodeHeight, maxCodeHeight);
  codeDiv.style.height = newCodeHeight + 'px';
  blocklyDiv.style.flex = '1 1 auto';
  Blockly.svgResize(workspace);
});

window.addEventListener('mouseup', function() {
  if (isDragging) {
    isDragging = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
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
    let importHelp = [];
    let unplacedBlocks = [];
    let placedBlocks = 0;
    try {
      var jsonText = e.target.result;
      var state = JSON.parse(jsonText);
      workspace.clear();
      // Try to load blocks, but if a block type is unknown, skip and record it
      function tryLoadBlocks(blocks, parent) {
        if (!blocks) return;
        blocks.forEach(function(blockData) {
          if (Blockly.Blocks[blockData.type]) {
            var block = workspace.newBlock(blockData.type);
            block.initSvg();
            block.render();
            placedBlocks++;
            if (blockData.x && blockData.y) block.moveBy(blockData.x, blockData.y);
            // Recursively try to load children
            if (blockData.children) tryLoadBlocks(blockData.children, block);
          } else {
            unplacedBlocks.push(blockData.type);
          }
        });
      }
      // Try to load top-level blocks from state (if present)
      if (state && state.blocks && state.blocks.blocks) {
        tryLoadBlocks(state.blocks.blocks);
      } else {
        // Fallback to default loader if structure is not as expected
        try {
          Blockly.serialization.workspaces.load(state, workspace);
          placedBlocks = workspace.getAllBlocks().length;
        } catch (err2) {
          importHelp.push('Critical error: Could not parse or load workspace. Please check your file format.');
        }
      }
      setTimeout(function() {
        workspace.getAllBlocks().forEach(function(block) {
          block.initSvg();
          block.render();
        });
        Blockly.svgResize(workspace);
      }, 100);
      if (unplacedBlocks.length > 0) {
        importHelp.push('Some blocks could not be placed: <b>' + Array.from(new Set(unplacedBlocks)).join(", ") + '</b>. This usually means these block types are not defined in this editor.');
      }
      if (importHelp.length > 0) {
        showImportHelp(importHelp.join('<br><br>'));
        document.getElementById('importHelpBtn').style.display = '';
      } else {
        document.getElementById('importHelpBtn').style.display = 'none';
        alert("Workspace loaded successfully! " + placedBlocks + " blocks placed.");
      }
    } catch (err) {
      importHelp.push('Failed to load workspace. Please ensure the file is a valid JSON file saved from this editor.<br><br><b>Error:</b> ' + err.message);
      showImportHelp(importHelp.join('<br><br>'));
      document.getElementById('importHelpBtn').style.display = '';
    }
    document.getElementById('loadInput').value = '';
  };
  reader.readAsText(file);
});

// Import Help Modal logic
let lastImportHelp = '';
function showImportHelp(html) {
  lastImportHelp = html;
  var modal = document.getElementById('importHelpModal');
  var body = document.getElementById('importHelpBody');
  if (modal && body) {
    body.innerHTML = html;
    modal.style.display = 'block';
  }
}
document.getElementById('importHelpBtn').onclick = function() {
  showImportHelp(lastImportHelp);
  document.getElementById('importHelpModal').style.display = 'block';
};
document.getElementById('closeImportHelpModal').onclick = function() {
  document.getElementById('importHelpModal').style.display = 'none';
};
window.addEventListener('click', function(event) {
  var modal = document.getElementById('importHelpModal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});

// Force toolbox and canvas style after injection (Fallback)
setTimeout(function() {
  var toolbox = document.getElementsByClassName('blocklyToolboxDiv')[0];
  if (toolbox) {
    toolbox.style.backgroundColor = '#1e1e1e';
  }
  // Hide scrollbars on blocklyDiv
  var blocklyDiv = document.getElementById('blocklyDiv');
  if (blocklyDiv) {
    blocklyDiv.style.overflow = 'hidden';
  }
  // Hide scrollbars on SVG
  var svg = blocklyDiv.querySelector('svg');
  if (svg) {
    svg.style.overflow = 'hidden';
  }
}, 100);

// Search Functionality
document.getElementById('blockSearch').addEventListener('input', function(e) {
  var searchTerm = e.target.value;
  // Easter egg: andy6170ftw (exact, secret)
  if (searchTerm === 'andy6170ftw') {
    showEasterEgg();
    return;
  }
  if (!searchTerm) {
    workspace.updateToolbox(TOOLBOX_CONFIG);
    return;
  }
  // Collect all matching blocks from all categories
  function collectBlocks(category) {
    let blocks = [];
    if (category.contents) {
      category.contents.forEach(item => {
        if (item.kind === 'block') {
          if (item.type.toLowerCase().includes(searchTerm)) {
            blocks.push(item);
          }
        } else if (item.kind === 'category') {
          blocks = blocks.concat(collectBlocks(item));
        }
      });
    }
    return blocks;
  }
  let allMatches = [];
  TOOLBOX_CONFIG.contents.forEach(cat => {
    if (cat.kind === 'category') {
      allMatches = allMatches.concat(collectBlocks(cat));
    }
  });
  var newToolbox = {
    kind: 'categoryToolbox',
    contents: []
  };
  if (allMatches.length > 0) {
    newToolbox.contents.push({
      kind: 'category',
      name: 'Search Results',
      colour: '#4fc3f7',
      contents: allMatches,
      expanded: true
    });
  } else {
    newToolbox.contents.push({
      kind: 'category',
      name: 'No Results',
      contents: []
    });
  }
  workspace.updateToolbox(newToolbox);
});

// Easter egg popup for "andy 6170 ftw"
function showEasterEgg() {
  if (document.getElementById('uiHealthEasterEgg')) return;
  const block = document.createElement('div');
  block.id = 'uiHealthEasterEgg';
  block.style.position = 'fixed';
  block.style.top = '50%';
  block.style.left = '50%';
  block.style.transform = 'translate(-50%, -50%)';
  block.style.width = '420px';
  block.style.height = '220px';
  block.style.background = "url('assets/img/error_bg_bfptool.png') center center / cover no-repeat";
  block.style.color = '#fff';
  block.style.zIndex = '100001';
  block.style.display = 'flex';
  block.style.flexDirection = 'column';
  block.style.alignItems = 'center';
  block.style.justifyContent = 'center';
  block.style.borderRadius = '18px';
  block.style.boxShadow = '0 4px 32px #000a';
  block.style.fontSize = '20px';
  block.style.fontWeight = 'bold';
  block.style.overflow = 'hidden';
  block.innerHTML = `
    <div style=\"position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(30,0,0,0.68);z-index:1;border-radius:18px;\"></div>
    <div style=\"position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;width:100%;\">
      <div style=\"font-size:28px;margin-bottom:18px;\">🏆 <span id=\"andyFirework\" class=\"rainbow-andy\" style=\"cursor:pointer;transition:all 0.3s;\">ANDY6170</span></div>
      <div style=\"margin-bottom:12px;\">A true legend and a huge help in building this app.<br>Thank you for your input and inspiration!</div>
      <div style=\"font-size:15px;font-weight:normal;\">(Click anywhere or press Escape to close)</div>
    </div>
    <style>
      .firework-letter {
        display: inline-block;
        font-size: 1.2em;
        font-weight: bold;
        animation: firework-explode 0.9s cubic-bezier(.5,-0.5,.5,1.5) forwards;
        pointer-events: none;
      }
      @keyframes firework-explode {
        0% { opacity: 1; transform: scale(1) translate(0,0) rotate(0deg); }
        60% { opacity: 1; }
        100% { opacity: 0; transform: scale(1.8) translate(var(--tx,0), var(--ty,0)) rotate(var(--rot,0deg)); }
      }
    </style>
  `;
  document.body.appendChild(block);
  // Firework effect for ANDY6170
  setTimeout(() => {
    const andy = document.getElementById('andyFirework');
    if (andy) {
      andy.addEventListener('click', function(e) {
        if (andy.classList.contains('exploded')) return;
        andy.classList.add('exploded');
        const text = andy.textContent;
        andy.textContent = '';
        for (let i = 0; i < text.length; i++) {
          const span = document.createElement('span');
          span.textContent = text[i];
          span.className = 'firework-letter';
          // Random direction and rotation for each letter
          const angle = (i / text.length) * 2 * Math.PI;
          const dist = 80 + Math.random() * 40;
          const tx = Math.round(Math.cos(angle) * dist);
          const ty = Math.round(Math.sin(angle) * dist - 20);
          const rot = Math.round((Math.random() - 0.5) * 180);
          span.style.setProperty('--tx', tx + 'px');
          span.style.setProperty('--ty', ty + 'px');
          span.style.setProperty('--rot', rot + 'deg');
          andy.appendChild(span);
        }
        setTimeout(() => {
          if (block.parentNode) block.parentNode.removeChild(block);
        }, 950);
      });
    }
  }, 100);
  // Dismiss on click outside or Escape
  function removeBlock() {
    if (block.parentNode) block.parentNode.removeChild(block);
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('mousedown', onClick);
  }
  function onKey(e) { if (e.key === 'Escape') removeBlock(); }
  function onClick(e) {
    // Only close if not clicking the firework name
    if (!e.target.closest('#andyFirework')) removeBlock();
  }
  window.addEventListener('keydown', onKey);
  window.addEventListener('mousedown', onClick);
}

// Custom Context Menu Registry
// 1. Refresh Workspace
if (typeof Blockly !== 'undefined' && Blockly.ContextMenuRegistry && Blockly.ContextMenuRegistry.registry) {
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
}

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
  // Ensure BLOCK_IMAGES is defined
  if (typeof BLOCK_IMAGES === 'undefined') {
    BLOCK_IMAGES = {};
  }
  var image = BLOCK_IMAGES[blockType];
  // Fallback: Try to find category-level image if no specific image
  if (!image) {
    for (var key in BLOCK_IMAGES) {
      if (blockType.toUpperCase().startsWith(key)) {
        image = BLOCK_IMAGES[key];
        break;
      }
    }
  }
  // If still not found, use a generic placeholder
  if (!image) {
    image = 'assets/img/BF6Portal/example blocks.jpg';
  }
  var html = "";
  html += `<div class="help-section"><img src="${image}" class="help-image" alt="${blockType} Reference"></div>`;
  // Add visual example placeholder
  html += `<div class='help-section'><b>Visual Example:</b><br><span style='color:#aaa'>(Coming soon: block preview or image)</span></div>`;
  if (data) {
    helpTitle.innerText = data.title || blockType;
    html += `<div class="help-section"><p>${data.description || "This block is waiting for your creativity! Try dragging it onto the canvas and see what it can do."}</p></div>`;
    if (data.snap_info) {
      html += `<div class=\"help-section\"><strong>Snap Info:</strong> ${data.snap_info}</div>`;
    }
    if (data.usage && data.usage.length > 0) {
      html += `<div class=\"help-section\"><h3>Usage</h3><ul>`;
      data.usage.forEach(u => html += `<li>${u}</li>`);
      html += `</ul></div>`;
    }
    if (data.tips && data.tips.length > 0) {
      html += `<div class=\"help-section\"><h3>Tips</h3><ul>`;
      data.tips.forEach(t => html += `<li>${t}</li>`);
      html += `</ul></div>`;
    }
  } else {
    helpTitle.innerText = blockType;
    html += `<div class='help-section'><p>There's no official help for this block yet, but you can experiment! Try dragging it onto the canvas and see what happens. If you discover something cool, let us know!</p></div>`;
  }
  helpBody.innerHTML = html;
  modal.style.display = "block";
}
