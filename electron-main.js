const { app, BrowserWindow, ipcMain, session, screen } = require('electron');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

// Helps Windows keep taskbar/shortcuts/icons consistent (especially across hotfix builds).
try {
    if (process.platform === 'win32') {
        app.setAppUserModelId('com.neuro.bf6portal');
    }
} catch {
    // ignore
}

// Ensure only one instance of the app runs at a time.
// This avoids “I installed a new build but I’m still looking at the old UI” confusion
// caused by a hidden/previous instance holding files open.
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        try {
            if (mainWindow) {
                if (mainWindow.isMinimized()) mainWindow.restore();
                mainWindow.focus();
            }
        } catch (e) {
            console.warn('[BF6] second-instance focus failed:', e);
        }
    });
}

// Configuration
const PORT = 8000; // Application port
// In production, app.getAppPath() points at the packaged app root (typically .../resources/app.asar).
// In dev, __dirname is the project root.
const isPackaged = app.isPackaged;
const ROOT_DIR = isPackaged ? app.getAppPath() : __dirname;

let mainWindow;
let serverProcess;
let ptyProcess;

// Try to load node-pty
let pty;
try {
    pty = require('node-pty');
} catch (e) {
    console.log('node-pty not found, falling back to spawn');
}

function log(data) {
    console.log(`[BF6] ${data.toString().trim()}`);
}

function startServer() {
    // No longer needed as we load file directly
    console.log('Server start skipped (using local file)');
}

function createWindow() {
    // Default target: 1080p. We open maximized so it fills the available work area.
    // (On smaller displays, maximize still behaves correctly; on larger displays,
    // maximize is preferable to forcing an arbitrary fixed size.)
    const TARGET_WIDTH = 1920;
    const TARGET_HEIGHT = 1080;

    // Compute a sane initial size based on the primary display work area.
    // We clamp to the available work area to avoid placing the window off-screen.
    let initialWidth = 1280;
    let initialHeight = 800;
    try {
        const primary = screen.getPrimaryDisplay();
        const work = primary && primary.workAreaSize ? primary.workAreaSize : null;
        if (work && work.width && work.height) {
            initialWidth = Math.min(TARGET_WIDTH, work.width);
            initialHeight = Math.min(TARGET_HEIGHT, work.height);
        } else {
            initialWidth = TARGET_WIDTH;
            initialHeight = TARGET_HEIGHT;
        }
    } catch {
        initialWidth = TARGET_WIDTH;
        initialHeight = TARGET_HEIGHT;
    }

    const iconCandidates = [
        path.join(ROOT_DIR, 'web_ui', 'dist', 'assets', 'img', 'app_logo.png'),
        path.join(ROOT_DIR, 'web_ui', 'dist', 'assets', 'img', 'favicon.ico'),
    ];
    const windowIcon = iconCandidates.find((p) => {
        try { return fs.existsSync(p); } catch { return false; }
    });

    mainWindow = new BrowserWindow({
        width: initialWidth,
        height: initialHeight,
        icon: windowIcon, // Point to dist assets (prefer app_logo.png)
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webSecurity: false // Allow loading local resources
        },
        autoHideMenuBar: true,
        title: "BF6Portal Tool - (Gemini)"
    });

    // Fill the screen by default (maximized window). This matches typical desktop UX.
    // We keep it as a normal window (not true fullscreen) so users can still snap,
    // resize, and access the taskbar.
    try {
        mainWindow.maximize();
    } catch {
        // ignore
    }

    const indexPath = path.join(ROOT_DIR, 'web_ui', 'dist', 'index.html');
    console.log(`Loading UI from: ${indexPath}`);
    mainWindow.loadFile(indexPath);

    // Dev-only: sanity check that Blockly/toolbox actually loaded in the renderer.
    // This gives us a definitive signal in the terminal logs without needing DevTools.
    if (!isPackaged) {
        mainWindow.webContents.once('did-finish-load', () => {
            setTimeout(async () => {
                try {
                    // If the renderer didn't inject a workspace for any reason, attempt a safe one-time injection.
                    await mainWindow.webContents.executeJavaScript(
                        `(function(){
                            try {
                                if (!window.workspace && typeof fallbackInjection === 'function') {
                                    fallbackInjection();
                                }
                            } catch (e) {
                                console.error('[BF6][diag] fallbackInjection failed:', e);
                            }
                        })()`
                    );

                    const diag = await mainWindow.webContents.executeJavaScript(
                        `(function(){
                            const hasBlockly = typeof Blockly !== 'undefined';
                            const hasToolboxConfig = typeof TOOLBOX_CONFIG !== 'undefined';
                            const hasWorkspace = !!window.workspace;
                            const hasSvg = !!document.querySelector('#blocklyDiv .blocklySvg');
                            const hasToolboxDivLegacy = !!document.querySelector('.blocklyToolboxDiv');
                            const toolboxEl = document.querySelector('.blocklyToolbox');
                            const hasToolboxEl = !!toolboxEl;
                            const tbr = toolboxEl ? toolboxEl.getBoundingClientRect() : null;
                            const toolboxRect = tbr ? { x: tbr.x, y: tbr.y, width: tbr.width, height: tbr.height } : null;

                            // Toolbox DOM content checks
                            const labelEls = Array.from(document.querySelectorAll('.blocklyToolboxCategoryLabel, .blocklyTreeLabel'));
                            const labelTexts = labelEls
                                .map(e => (e && e.textContent ? e.textContent.trim() : ''))
                                .filter(Boolean);
                            const labelSample = labelTexts.slice(0, 12);

                            let toolboxApi = null;
                            try {
                                const tb = window.workspace && typeof window.workspace.getToolbox === 'function' ? window.workspace.getToolbox() : null;
                                // Do not return DOM nodes; just return metadata.
                                toolboxApi = tb ? {
                                    hasToolbox: true,
                                    // Many Blockly builds store the toolbox div on a private field.
                                    divClass: (tb.HtmlDiv_ && tb.HtmlDiv_.className) || (tb.htmlDiv_ && tb.htmlDiv_.className) || null,
                                } : { hasToolbox: false };
                            } catch (e) {
                                toolboxApi = { hasToolbox: false, error: String(e && e.message ? e.message : e) };
                            }
                            const blocklyDiv = document.getElementById('blocklyDiv');
                            const r = blocklyDiv ? blocklyDiv.getBoundingClientRect() : null;
                            const blocklyDivRect = r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null;
                            let toolboxConfigMeta = null;
                            try {
                                const cfg = (typeof TOOLBOX_CONFIG !== 'undefined') ? TOOLBOX_CONFIG : null;
                                toolboxConfigMeta = cfg && cfg.contents ? { contentsCount: cfg.contents.length } : null;
                            } catch (e) {
                                toolboxConfigMeta = { error: String(e && e.message ? e.message : e) };
                            }

                            const selectionLists = window.__bf6_selection_lists_status || null;

                            return {
                                hasBlockly,
                                hasToolboxConfig,
                                toolboxConfigMeta,
                                hasWorkspace,
                                hasSvg,
                                hasToolboxDivLegacy,
                                hasToolboxEl,
                                toolboxRect,
                                toolboxApi,
                                toolboxLabelsCount: labelTexts.length,
                                toolboxLabelSample: labelSample,
                                selectionLists,
                                blocklyDivRect
                            };
                        })()`
                    );
                    console.log('[BF6][diag]', diag);
                } catch (e) {
                    console.error('[BF6][diag] Failed to query renderer state:', e);
                }
            }, 1500);
        });
    }

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Initialize PTY (Sliding Neural Link)
    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
    
    if (pty) {
        try {
            ptyProcess = pty.spawn(shell, [], {
                name: 'xterm-color',
                cols: 80,
                rows: 30,
                cwd: process.env.HOME,
                env: process.env
            });
        } catch (e) {
            console.error('PTY Spawn failed:', e);
        }
    }

    // Fallback if PTY failed or missing
    if (!ptyProcess) {
        ptyProcess = spawn(shell, [], {
            cwd: process.env.HOME,
            env: process.env,
            shell: true
        });
        ptyProcess.resize = () => {}; // Mock
    }

    // Data handling
    ptyProcess.stdout.on('data', (data) => {
        if (mainWindow) mainWindow.webContents.send('terminal-incoming', data);
    });
    
    if (ptyProcess.stderr) {
        ptyProcess.stderr.on('data', (data) => {
            if (mainWindow) mainWindow.webContents.send('terminal-incoming', data);
        });
    }

    // IPC
    ipcMain.on('terminal-keystroke', (event, key) => {
        if (ptyProcess) {
            if (ptyProcess.write) ptyProcess.write(key);
            else if (ptyProcess.stdin) ptyProcess.stdin.write(key);
        }
    });

    // Auto-start Gemini (Context: BF6 Portal)
    setTimeout(() => {
        const startCmd = 'gemini\r'; 
        // We could inject a system prompt here if Gemini CLI supports it via args
        // For now, we just launch it.
        if (ptyProcess) {
            if (ptyProcess.write) ptyProcess.write(startCmd);
            else if (ptyProcess.stdin) ptyProcess.stdin.write(startCmd);
        }
    }, 2000);
}

app.on('ready', async () => {
    // Reduce stale UI/caching issues between installs/builds.
    // NOTE: We intentionally do NOT clear localStorage (user presets) here.
    try {
        // Disable Chromium's HTTP cache as an extra safety net.
        try { app.commandLine.appendSwitch('disable-http-cache'); } catch { /* ignore */ }
        try { app.commandLine.appendSwitch('disable-gpu-shader-disk-cache'); } catch { /* ignore */ }

        if (session && session.defaultSession) {
            await session.defaultSession.clearCache();
            const clearCodeCaches = session.defaultSession.clearCodeCaches;
            if (typeof clearCodeCaches === 'function') {
                // Electron has changed this API signature over time. Some versions
                // require an options object and/or callback.
                try {
                    // Try Promise-style API: clearCodeCaches(options)
                    const result = clearCodeCaches.call(session.defaultSession, {});
                    if (result && typeof result.then === 'function') {
                        await result;
                    }
                } catch (e1) {
                    // Fallback: callback-style API: clearCodeCaches(options, callback)
                    try {
                        await new Promise((resolve, reject) => {
                            try {
                                clearCodeCaches.call(session.defaultSession, {}, (err) => {
                                    if (err) reject(err);
                                    else resolve();
                                });
                            } catch (e2) {
                                reject(e2);
                            }
                        });
                    } catch (e2) {
                        console.warn('[BF6] clearCodeCaches failed:', e2);
                    }
                }
            }
        }
        console.log('[BF6] Cache cleared');
    } catch (e) {
        console.warn('[BF6] Cache clear failed:', e);
    }

    startServer();
    createWindow();
});

app.on('window-all-closed', () => {
    // Force kill any child processes
    if (serverProcess) {
        try { process.kill(serverProcess.pid); } catch(e) {}
    }
    if (ptyProcess) {
        try { ptyProcess.kill(); } catch(e) {}
    }
    
    // Explicitly quit the app
    app.quit();
});

app.on('before-quit', () => {
    // Ensure everything is dead
    if (ptyProcess) {
        try { ptyProcess.kill(); } catch(e) {}
    }
});
