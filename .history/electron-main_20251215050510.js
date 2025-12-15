const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const os = require('os');

// Configuration
const PORT = 8000; // Application port
// In production (asar), we need to step out of the archive to find unpacked resources if we unpacked them
// Or use __dirname if we are in dev.
const isPackaged = app.isPackaged;
const ROOT_DIR = isPackaged ? path.join(process.resourcesPath, 'app.asar.unpacked') : __dirname;

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
        icon: path.join(ROOT_DIR, 'web_ui', 'assets', 'favicon.ico'), // Ensure this exists
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
    startServer();
    createWindow();
});

app.on('window-all-closed', () => {
    if (serverProcess) spawn('taskkill', ['/F', '/PID', serverProcess.pid]);
    if (ptyProcess) ptyProcess.kill();
    app.quit();
});
