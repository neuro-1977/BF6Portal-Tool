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
    console.log('Starting BF6 Web Server...');
    // Simple python server for now, or we could use a small express app
    // Using python http.server as per previous setup
    serverProcess = spawn('python', ['-m', 'http.server', PORT.toString()], {
        cwd: path.join(ROOT_DIR, 'web_ui', 'dist'),
        shell: true
    });
    serverProcess.stdout.on('data', log);
    serverProcess.stderr.on('data', log);
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        icon: path.join(ROOT_DIR, 'web_ui', 'assets', 'favicon.ico'), // Ensure this exists
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        autoHideMenuBar: true,
        title: "BF6Portal Tool - (Gemini)"
    });

    setTimeout(() => {
        mainWindow.loadURL(`http://localhost:${PORT}`);
    }, 1000);

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
