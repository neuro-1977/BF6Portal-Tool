// Main Entry Point for BF6 Portal Tool ("Awesome" UI Version)

// --- Sidebar Code Menu Button Logic (Export, Import, Settings) ---
document.addEventListener('DOMContentLoaded', function() {
  const codeBtns = document.querySelectorAll('.sidebar-code-btn');
  if (!codeBtns.length) return;
  // Order: Export, Import, Settings
  const [exportBtn, importBtn, settingsBtn] = codeBtns;
  if (exportBtn) exportBtn.onclick = function() {
    // Trigger export (same as top Export .ts button)
    const topExport = document.getElementById('exportTsBtn');
    if (topExport) topExport.click();
  };
  if (importBtn) importBtn.onclick = function() {
    // Trigger import (same as top Import .tscn button)
    const topImport = document.getElementById('importTscnBtn');
    if (topImport) topImport.click();
  };
  if (settingsBtn) settingsBtn.onclick = function() {
    alert('Settings menu coming soon!');
  };
});

// --- Sidebar Category Selection Logic ---
document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;
  const cats = Array.from(document.querySelectorAll('.sidebar-category'));
  cats.forEach(cat => {
    cat.addEventListener('click', function() {
      cats.forEach(c => c.classList.remove('selected'));
      cat.classList.add('selected');
      // TODO: Populate block palette/toolbox for this category
    });
  });
  // Select first by default
  if (cats.length) cats[0].classList.add('selected');

  // Sidebar search stub (to be implemented)
  const search = document.getElementById('sidebarSearch');
  if (search) {
    search.addEventListener('input', function(e) {
      // TODO: Filter categories or blocks
    });
  }
});

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
    fetch('assets/img/app_logo.png', {cache: 'no-store'}).catch(() => {});
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
            // console.log('[TICKER] Set to:', splashTicker.textContent);
            window._tickerIndex++;
          }
        }
        if (splashTicker) {
          setTimeout(() => {
            cycleTickerMsg();
            setInterval(cycleTickerMsg, 12000);
          }, 100);
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
    }
    // Initial state: web UI loaded
    setNotchState(1);

  // Recenter button functionality
  var recenterBtn = document.getElementById('recenterBtn');
  
  const TerminalDrawer = require('./terminal-drawer');

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Terminal Drawer
    const drawer = new TerminalDrawer('terminal-drawer');
    const toggleBtn = document.getElementById('terminal-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => drawer.toggle());
    }
});

  // --- Minimal Blockly Injection ---
  try {
      // When Blockly starts loading, set notch 2
      setNotchState(2);
    // Robust diagnostics for Blockly and toolbox
    if (typeof Blockly === 'undefined') {
      showErrorBox('PORTAL ERROR', ['Blockly is not loaded. Check that blockly_compressed.js is present.'], true);
      // document.getElementById('splashScreen').style.display = 'flex';
      // document.getElementById('blocklyDiv').style.display = 'none';
      return;
    }
    if (typeof TOOLBOX_CONFIG === 'undefined' || !TOOLBOX_CONFIG.contents || TOOLBOX_CONFIG.contents.length === 0) {
      showErrorBox('PORTAL ERROR', ['TOOLBOX_CONFIG is missing or empty. Check toolbox.js.'], true);
      // document.getElementById('splashScreen').style.display = 'flex';
      // document.getElementById('blocklyDiv').style.display = 'none';
      return;
    }
    // Only inject Blockly ONCE, with correct config and trashcan disabled
    if (window.workspace && window.workspace.dispose) {
      window.workspace.dispose();
    }
    
    // Use bf6_theme if available (from boot.js), otherwise Classic
    let theme = Blockly.Themes.Classic;
    if (Blockly.Theme && Blockly.Theme.registry && Blockly.Theme.registry['bf6_theme']) {
        theme = Blockly.Theme.registry['bf6_theme'];
    } else if (typeof bf6_theme !== 'undefined') {
        theme = bf6_theme;
    }

    window.workspace = Blockly.inject('blocklyDiv', {
      toolbox: TOOLBOX_CONFIG,
      theme: theme,
      renderer: 'geras',
      trashcan: true,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      }
    });

    setTimeout(function() {
      var toolboxDiv = document.querySelector('.blocklyToolboxDiv');
      if (!toolboxDiv) {
        console.error('[DIAG] .blocklyToolboxDiv NOT FOUND after Blockly injection!');
        showErrorBox('PORTAL ERROR', ['Toolbox missing! (.blocklyToolboxDiv not found)', 'Try reloading the page or reporting this issue.'], true);
        // Do not force splash screen to show, allowing user to debug or see what's wrong
        // document.getElementById('splashScreen').style.display = 'flex';
        // document.getElementById('blocklyDiv').style.display = 'none';
      } else {
        console.log('[DIAG] .blocklyToolboxDiv FOUND after Blockly injection.');
        toolboxDiv.style.outline = '3px solid #4fc3f7';
        toolboxDiv.style.boxShadow = '0 0 16px 4px #4fc3f7cc';
        
        // Hide splash screen
        const splash = document.getElementById('splashScreen');
        if (splash) splash.style.opacity = '0';
        setTimeout(() => { if (splash) splash.style.display = 'none'; }, 600);
        document.getElementById('blocklyDiv').style.display = 'block';
        
        // Set final notch
        setNotchState(3);
        keepSessionAlive();
        checkUIHealth();
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

    // Save/Load/Export/Import/About button handlers
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.onclick = function() {
            var state = Blockly.serialization.workspaces.save(window.workspace);
            var jsonText = JSON.stringify(state, null, 2);
            var blob = new Blob([jsonText], {type: 'application/json'});
            var a = document.createElement('a');
            a.download = 'portal_rules.json';
            a.href = URL.createObjectURL(blob);
            a.click();
        };
    }

    const loadBtn = document.getElementById('loadBtn');
    if (loadBtn) {
        loadBtn.onclick = function() {
            const input = document.getElementById('loadInput');
            if (input) {
                input.accept = '.json';
                input.onchange = function(e) {
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
                input.click();
            }
        };
    }
    
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

  } catch (e) {
    showErrorBox('PORTAL ERROR', ['Critical Error: Blockly failed to initialize.', e.message], true);
    // document.getElementById('splashScreen').style.display = 'flex';
    // document.getElementById('blocklyDiv').style.display = 'none';
    console.error('[BF6Portal] Blockly injection failed:', e);
    return;
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