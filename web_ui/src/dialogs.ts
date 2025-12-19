import * as Blockly from 'blockly';

type PromptResult = string | null;

let overlayEl: HTMLDivElement | null = null;
let panelEl: HTMLDivElement | null = null;
let titleEl: HTMLDivElement | null = null;
let messageEl: HTMLDivElement | null = null;
let inputEl: HTMLInputElement | null = null;
let okBtn: HTMLButtonElement | null = null;
let cancelBtn: HTMLButtonElement | null = null;

function ensureDialogDom(): void {
  if (overlayEl && panelEl && titleEl && messageEl && inputEl && okBtn && cancelBtn) return;

  overlayEl = document.createElement('div');
  overlayEl.id = 'bf6_dialog_overlay';
  overlayEl.style.position = 'fixed';
  overlayEl.style.inset = '0';
  overlayEl.style.background = 'rgba(0, 0, 0, 0.55)';
  overlayEl.style.display = 'none';
  overlayEl.style.alignItems = 'center';
  overlayEl.style.justifyContent = 'center';
  overlayEl.style.zIndex = '99999';

  panelEl = document.createElement('div');
  panelEl.id = 'bf6_dialog_panel';
  panelEl.style.width = 'min(520px, calc(100vw - 40px))';
  panelEl.style.background = '#23272e';
  panelEl.style.border = '1px solid #2f353a';
  panelEl.style.borderRadius = '10px';
  panelEl.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5)';
  panelEl.style.padding = '14px 14px 12px 14px';
  panelEl.style.color = '#e0e0e0';
  panelEl.style.fontFamily = '"Segoe UI", sans-serif';

  titleEl = document.createElement('div');
  titleEl.style.fontSize = '16px';
  titleEl.style.fontWeight = '700';
  titleEl.style.marginBottom = '10px';

  messageEl = document.createElement('div');
  messageEl.style.fontSize = '14px';
  messageEl.style.marginBottom = '10px';
  messageEl.style.whiteSpace = 'pre-wrap';
  messageEl.style.opacity = '0.95';

  inputEl = document.createElement('input');
  inputEl.type = 'text';
  inputEl.style.width = '100%';
  inputEl.style.boxSizing = 'border-box';
  inputEl.style.padding = '8px 10px';
  inputEl.style.borderRadius = '8px';
  inputEl.style.border = '1px solid #333';
  inputEl.style.background = '#181a1b';
  inputEl.style.color = '#e0e0e0';
  inputEl.style.marginBottom = '12px';

  const btnRow = document.createElement('div');
  btnRow.style.display = 'flex';
  btnRow.style.justifyContent = 'flex-end';
  btnRow.style.gap = '10px';

  cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.style.padding = '8px 12px';
  cancelBtn.style.borderRadius = '8px';
  cancelBtn.style.border = '1px solid #3a3f44';
  cancelBtn.style.background = '#181a1b';
  cancelBtn.style.color = '#e0e0e0';
  cancelBtn.style.cursor = 'pointer';

  okBtn = document.createElement('button');
  okBtn.textContent = 'OK';
  okBtn.style.padding = '8px 12px';
  okBtn.style.borderRadius = '8px';
  okBtn.style.border = '1px solid #2f353a';
  okBtn.style.background = '#0288D1';
  okBtn.style.color = '#ffffff';
  okBtn.style.cursor = 'pointer';

  btnRow.appendChild(cancelBtn);
  btnRow.appendChild(okBtn);

  panelEl.appendChild(titleEl);
  panelEl.appendChild(messageEl);
  panelEl.appendChild(inputEl);
  panelEl.appendChild(btnRow);
  overlayEl.appendChild(panelEl);
  document.body.appendChild(overlayEl);
}

function showOverlay(): void {
  if (!overlayEl) return;
  overlayEl.style.display = 'flex';
}

function hideOverlay(): void {
  if (!overlayEl) return;
  overlayEl.style.display = 'none';
}

export function promptText(title: string, defaultValue: string = ''): Promise<PromptResult> {
  ensureDialogDom();
  const overlay = overlayEl;
  const titleNode = titleEl;
  const messageNode = messageEl;
  const input = inputEl;
  const ok = okBtn;
  const cancel = cancelBtn;
  if (!overlay || !titleNode || !messageNode || !input || !ok || !cancel) {
    return Promise.resolve(null);
  }

  titleNode.textContent = title || 'Input';
  messageNode.textContent = '';

  input.style.display = 'block';
  input.value = defaultValue ?? '';

  ok.textContent = 'OK';
  cancel.style.display = 'inline-block';

  showOverlay();
  setTimeout(() => {
    try { input.focus(); input.select(); } catch { /* ignore */ }
  }, 0);

  return new Promise<PromptResult>((resolve) => {
    const cleanup = () => {
      try {
        ok.removeEventListener('click', onOk);
        cancel.removeEventListener('click', onCancel);
        overlay.removeEventListener('click', onOverlay);
        window.removeEventListener('keydown', onKeyDown, true);
        input.removeEventListener('keydown', onInputKeyDown, true);
      } catch {
        // ignore
      }
      hideOverlay();
    };

    const finish = (value: PromptResult) => {
      cleanup();
      resolve(value);
    };

    const onOk = (e?: any) => {
      try { e?.preventDefault?.(); e?.stopPropagation?.(); } catch { /* ignore */ }
      finish(String(input.value ?? ''));
    };

    const onCancel = (e?: any) => {
      try { e?.preventDefault?.(); e?.stopPropagation?.(); } catch { /* ignore */ }
      finish(null);
    };

    const onOverlay = (e: MouseEvent) => {
      // Click outside panel cancels.
      if (e.target === overlay) onCancel(e);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel(e);
    };

    const onInputKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') onOk(e);
    };

    ok.addEventListener('click', onOk);
    cancel.addEventListener('click', onCancel);
    overlay.addEventListener('click', onOverlay);
    window.addEventListener('keydown', onKeyDown, true);
    input.addEventListener('keydown', onInputKeyDown, true);
  });
}

export function alertText(title: string, message: string): Promise<void> {
  ensureDialogDom();
  const overlay = overlayEl;
  const titleNode = titleEl;
  const messageNode = messageEl;
  const input = inputEl;
  const ok = okBtn;
  const cancel = cancelBtn;
  if (!overlay || !titleNode || !messageNode || !input || !ok || !cancel) {
    return Promise.resolve();
  }

  titleNode.textContent = title || 'Alert';
  messageNode.textContent = message || '';
  input.style.display = 'none';

  ok.textContent = 'OK';
  cancel.style.display = 'none';

  showOverlay();
  setTimeout(() => {
    try { ok.focus(); } catch { /* ignore */ }
  }, 0);

  return new Promise<void>((resolve) => {
    const cleanup = () => {
      try {
        ok.removeEventListener('click', onOk);
        overlay.removeEventListener('click', onOverlay);
        window.removeEventListener('keydown', onKeyDown, true);
      } catch {
        // ignore
      }
      hideOverlay();
    };

    const finish = () => {
      cleanup();
      resolve();
    };

    const onOk = (e?: any) => {
      try { e?.preventDefault?.(); e?.stopPropagation?.(); } catch { /* ignore */ }
      finish();
    };

    const onOverlay = (e: MouseEvent) => {
      if (e.target === overlay) onOk(e);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') onOk(e);
    };

    ok.addEventListener('click', onOk);
    overlay.addEventListener('click', onOverlay);
    window.addEventListener('keydown', onKeyDown, true);
  });
}

export function confirmText(title: string, message: string): Promise<boolean> {
  ensureDialogDom();
  const overlay = overlayEl;
  const titleNode = titleEl;
  const messageNode = messageEl;
  const input = inputEl;
  const ok = okBtn;
  const cancel = cancelBtn;
  if (!overlay || !titleNode || !messageNode || !input || !ok || !cancel) {
    return Promise.resolve(false);
  }

  titleNode.textContent = title || 'Confirm';
  messageNode.textContent = message || '';
  input.style.display = 'none';

  ok.textContent = 'OK';
  cancel.style.display = 'inline-block';

  showOverlay();
  setTimeout(() => {
    try { ok.focus(); } catch { /* ignore */ }
  }, 0);

  return new Promise<boolean>((resolve) => {
    const cleanup = () => {
      try {
        ok.removeEventListener('click', onOk);
        cancel.removeEventListener('click', onCancel);
        overlay.removeEventListener('click', onOverlay);
        window.removeEventListener('keydown', onKeyDown, true);
      } catch {
        // ignore
      }
      hideOverlay();
    };

    const finish = (value: boolean) => {
      cleanup();
      resolve(value);
    };

    const onOk = (e?: any) => {
      try { e?.preventDefault?.(); e?.stopPropagation?.(); } catch { /* ignore */ }
      finish(true);
    };

    const onCancel = (e?: any) => {
      try { e?.preventDefault?.(); e?.stopPropagation?.(); } catch { /* ignore */ }
      finish(false);
    };

    const onOverlay = (e: MouseEvent) => {
      if (e.target === overlay) onCancel(e);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel(e);
    };

    ok.addEventListener('click', onOk);
    cancel.addEventListener('click', onCancel);
    overlay.addEventListener('click', onOverlay);
    window.addEventListener('keydown', onKeyDown, true);
  });
}

export function installBlocklyDialogs(): void {
  // Blockly uses its own dialog layer for Variables/Procedures/etc.
  // In Electron builds, window.prompt/alert can be disabled, so we provide
  // our own handlers.
  const anyB: any = Blockly as any;
  const dialog: any = anyB?.dialog;
  if (!dialog) return;

  try {
    if (typeof dialog.setPrompt === 'function') {
      dialog.setPrompt((message: any, defaultValue: any, callback: any) => {
        void promptText(String(message ?? 'Input'), String(defaultValue ?? '')).then((v) => {
          try { callback(v); } catch { /* ignore */ }
        });
      });
    }
  } catch (e) {
    console.warn('[BF6] Failed to install Blockly prompt handler:', e);
  }

  try {
    if (typeof dialog.setAlert === 'function') {
      dialog.setAlert((message: any, callback: any) => {
        void alertText('Alert', String(message ?? '')).then(() => {
          try { callback?.(); } catch { /* ignore */ }
        });
      });
    }
  } catch (e) {
    console.warn('[BF6] Failed to install Blockly alert handler:', e);
  }

  try {
    if (typeof dialog.setConfirm === 'function') {
      dialog.setConfirm((message: any, callback: any) => {
        void confirmText('Confirm', String(message ?? '')).then((ok) => {
          try { callback(ok); } catch { /* ignore */ }
        });
      });
    }
  } catch (e) {
    console.warn('[BF6] Failed to install Blockly confirm handler:', e);
  }
}
