const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

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
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        icon: path.join(ROOT_DIR, 'web_ui', 'dist', 'assets', 'img', 'favicon.ico'), // Point to dist assets
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webSecurity: false // Allow loading local resources
        },
        autoHideMenuBar: true,
        title: "BF6Portal Tool - (Gemini)"
    });

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

app.on('ready', () => {
    // Clear cache to ensure fresh UI load
    if (session && session.defaultSession) {
        session.defaultSession.clearCache().then(() => {
            console.log('Cache cleared');
        });
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
