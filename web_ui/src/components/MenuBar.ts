
export class MenuBar {
  private container: HTMLElement;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) {
        throw new Error(`Container ${containerId} not found`);
    }
    this.container = el;
  }

  render() {
    this.container.innerHTML = `
      <div class="menu-bar">
        <div class="menu-logo">Serenity</div>
        <div class="menu-links">
          <a href="#" class="menu-link active">Editor</a>
          <a href="#" class="menu-link">Documentation</a>
          <a href="#" class="menu-link">Settings</a>
          <a href="#" class="menu-link">Help</a>
        </div>
        <div class="menu-actions">
           <button id="saveBtn" class="menu-btn">Save</button>
           <button id="loadBtn" class="menu-btn">Load</button>
        </div>
      </div>
    `;
    
    // Add event listeners for dummy links
    const links = this.container.querySelectorAll('.menu-link');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            links.forEach(l => l.classList.remove('active'));
            (e.target as HTMLElement).classList.add('active');
            alert(`Navigating to: ${(e.target as HTMLElement).textContent}`);
        });
    });

    // Add listeners for buttons
    document.getElementById('saveBtn')?.addEventListener('click', () => {
        alert('Save functionality to be implemented');
    });
    
    document.getElementById('loadBtn')?.addEventListener('click', () => {
        alert('Load functionality to be implemented');
    });
  }
}
