const { ipcRenderer } = require('electron');

class TerminalDrawer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        // Load Xterm dependencies
        try {
            this.Terminal = require('xterm').Terminal;
            this.FitAddon = require('xterm-addon-fit').FitAddon;
            this.injectCSS();
        } catch (e) {
            console.error('Failed to load xterm dependencies:', e);
            return;
        }

        this.isOpen = false;
        this.initUI();
        this.initXterm();
    }

    injectCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = require.resolve('xterm/css/xterm.css');
        document.head.appendChild(link);
    }

    initUI() {
        this.container.innerHTML = `
            <div style="
                padding: 5px 10px; 
                background-color: #252526; 
                display: flex; 
                justify-content: space-between; 
                align-items: center; 
                color: #ccc; 
                font-family: sans-serif; 
                font-size: 12px;
                border-top: 1px solid #333;
            ">
                <span>NEURAL LINK (BF6 PORTAL)</span>
                <button id="term-close-btn" style="background: none; border: none; color: #ccc; cursor: pointer; font-size: 16px;">×</button>
            </div>
            <div id="xterm-container" style="flex: 1; overflow: hidden; padding: 5px; background-color: #1e1e1e;"></div>
        `;

        // Styles
        Object.assign(this.container.style, {
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
            height: '300px',
            backgroundColor: '#1e1e1e',
            transform: 'translateY(100%)',
            transition: 'transform 0.3s ease-in-out',
            zIndex: '1000',
            display: 'flex',
            flexDirection: 'column'
        });

        this.container.querySelector('#term-close-btn').onclick = () => this.toggle();
    }

    initXterm() {
        if (!this.Terminal) return;

        this.term = new this.Terminal({
            cursorBlink: true,
            theme: { background: '#1e1e1e', foreground: '#ffffff' },
            fontFamily: 'Consolas, monospace',
            fontSize: 14
        });

        const fitAddon = new this.FitAddon();
        this.term.loadAddon(fitAddon);
        
        this.term.open(this.container.querySelector('#xterm-container'));
        this.fitAddon = fitAddon;

        // Events
        this.term.onData(data => ipcRenderer.send('terminal-keystroke', data));
        
        ipcRenderer.on('terminal-incoming', (event, data) => {
            // Ensure string
            const text = (typeof data === 'string') ? data : new TextDecoder().decode(data);
            this.term.write(text);
        });

        window.addEventListener('resize', () => fitAddon.fit());
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.container.style.transform = this.isOpen ? 'translateY(0)' : 'translateY(100%)';
        
        if (this.isOpen) {
            setTimeout(() => {
                this.fitAddon.fit();
                this.term.focus();
            }, 300);
        }
    }
}

module.exports = TerminalDrawer;
