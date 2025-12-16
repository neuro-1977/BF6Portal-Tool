class TerminalDrawer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.isOpen = false;
        this._isDragging = false;
        this._startY = 0;
        this._startHeight = 300;
        this._minHeight = 160;
        this._maxHeightVh = 85;

        this.initUI();
        this.initResizeDrag();
    }

    initUI() {
        this.container.innerHTML = `
            <div id="code-preview-header" style="
                padding: 6px 10px;
                background-color: #252526;
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #ccc;
                font-family: sans-serif;
                font-size: 12px;
                border-top: 1px solid #333;
                cursor: row-resize;
                user-select: none;
            ">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-weight:600;">Code Preview</span>
                    <span style="opacity:.7;">TypeScript (.ts)</span>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <button id="code-copy-btn" style="background: #1e1e1e; border: 1px solid #333; color: #baff80; cursor: pointer; padding: 4px 8px; border-radius: 6px; font-size: 12px;">Copy</button>
                    <button id="term-close-btn" style="background: none; border: none; color: #ccc; cursor: pointer; font-size: 16px;">×</button>
                </div>
            </div>
            <textarea id="code-preview-text" spellcheck="false" style="
                flex: 1;
                width: 100%;
                resize: none;
                padding: 10px;
                box-sizing: border-box;
                border: none;
                outline: none;
                background: #1e1e1e;
                color: #d4d4d4;
                font-family: Consolas, monospace;
                font-size: 12.5px;
                line-height: 1.35;
                overflow: auto;
            "></textarea>
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
            transition: 'transform 0.25s ease-in-out',
            zIndex: '1000',
            display: 'flex',
            flexDirection: 'column'
        });

        this.textarea = this.container.querySelector('#code-preview-text');
        this.container.querySelector('#term-close-btn').onclick = () => this.toggle();
        this.container.querySelector('#code-copy-btn').onclick = async () => {
            try {
                const t = this.getCode();
                if (!t) return;
                if (navigator?.clipboard?.writeText) {
                    await navigator.clipboard.writeText(t);
                    return;
                }
                // Fallback
                this.textarea.focus();
                this.textarea.select();
                document.execCommand('copy');
            } catch {
                // ignore
            }
        };
    }

    initResizeDrag() {
        const header = this.container.querySelector('#code-preview-header');
        if (!header) return;

        const onMove = (e) => {
            if (!this._isDragging) return;
            const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
            const dy = this._startY - clientY;
            const maxPx = Math.floor(window.innerHeight * (this._maxHeightVh / 100));
            const next = Math.max(this._minHeight, Math.min(maxPx, this._startHeight + dy));
            this.container.style.height = `${next}px`;
        };

        const onUp = () => {
            if (!this._isDragging) return;
            this._isDragging = false;
            document.body.style.cursor = '';
        };

        const onDown = (e) => {
            // Only drag from the header bar.
            this._isDragging = true;
            this._startY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
            this._startHeight = this.container.getBoundingClientRect().height;
            document.body.style.cursor = 'row-resize';
            e.preventDefault();
        };

        header.addEventListener('mousedown', onDown);
        header.addEventListener('touchstart', onDown, { passive: false });
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchend', onUp);
    }

    setCode(text) {
        if (!this.textarea) return;
        this.textarea.value = String(text ?? '');
    }

    getCode() {
        return this.textarea ? String(this.textarea.value ?? '') : '';
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.container.style.transform = this.isOpen ? 'translateY(0)' : 'translateY(100%)';
        if (this.isOpen) {
            setTimeout(() => {
                try { this.textarea && this.textarea.focus(); } catch {}
            }, 200);
        }
    }
}

// Support both browser globals and CommonJS (Electron).
try {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = TerminalDrawer;
    }
} catch {
    // ignore
}
try {
    if (typeof window !== 'undefined') {
        window.TerminalDrawer = TerminalDrawer;
    }
} catch {
    // ignore
}
