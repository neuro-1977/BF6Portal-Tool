import * as Blockly from 'blockly';
import { saveToFile, loadFromFile, exportForPortal } from '../serialization';

export class MenuBar {
  private container: HTMLElement;
  private workspace: Blockly.Workspace | null = null;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) {
        throw new Error(`Container ${containerId} not found`);
    }
    this.container = el;
  }

  setWorkspace(ws: Blockly.Workspace) {
      this.workspace = ws;
  }

  render() {
    this.container.innerHTML = `
      <div class="menu-bar">
        <div class="menu-logo">BF6Portal</div>
        <div class="menu-links">
          <a href="#" class="menu-link active" data-target="editor">Editor</a>
          <a href="#" class="menu-link" data-target="help">Help</a>
        </div>
        <div class="menu-actions">
           <button id="saveBtn" class="menu-btn">Save</button>
                     <button id="exportPortalBtn" class="menu-btn">Export Portal</button>
           <button id="loadBtn" class="menu-btn">Load</button>
           <input type="file" id="fileInput" style="display: none;" accept=".json">
        </div>
      </div>
    `;
    
    // Navigation Links
    const links = this.container.querySelectorAll('.menu-link');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = (e.target as HTMLElement).dataset.target;
            
            links.forEach(l => l.classList.remove('active'));
            (e.target as HTMLElement).classList.add('active');

            if (target === 'help') {
                const helpModal = document.getElementById('helpModal');
                if (helpModal) helpModal.style.display = 'block';
            }
        });
    });

    // Save Button
    document.getElementById('saveBtn')?.addEventListener('click', () => {
        if (this.workspace) {
            saveToFile(this.workspace);
        } else {
            console.warn("Workspace not set for MenuBar");
        }
    });

    // Export for Portal (expands collections, removes tool-only helpers)
    document.getElementById('exportPortalBtn')?.addEventListener('click', () => {
        if (this.workspace) {
            exportForPortal(this.workspace);
        } else {
            console.warn("Workspace not set for MenuBar");
        }
    });
    
    // Load Button
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    document.getElementById('loadBtn')?.addEventListener('click', () => {
        fileInput?.click();
    });

    fileInput?.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file && this.workspace) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                if (this.workspace) {
                    loadFromFile(this.workspace, content);
                }
            };
            reader.readAsText(file);
        }
        // Reset input so same file can be selected again
        fileInput.value = '';
    });
  }
}
