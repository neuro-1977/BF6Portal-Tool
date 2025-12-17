import * as Blockly from 'blockly';
import { promptText } from './dialogs';

/**
 * Opens a variables manager dialog.
 *
 * Blockly's built-in UI typically exposes a variable creation dialog via
 * `Blockly.Variables.createVariableButtonHandler(workspace)`.
 * We fall back to a simple prompt if that API isn't present.
 */
export function openVariablesManager(workspace: Blockly.Workspace): void {
  // NOTE: In some builds, Blockly's built-in variable UI hook may be missing or
  // may no-op depending on how Blockly is bundled. We always fall back to a
  // simple prompt so the button visibly "does something".
  const wsAny: any = workspace as any;

  try {
    const vars: any = (Blockly as any)?.Variables;
    if (vars && typeof vars.createVariableButtonHandler === 'function') {
      try {
        vars.createVariableButtonHandler(workspace);
        return;
      } catch (e) {
        console.warn('[BF6] Built-in variable UI failed, falling back to prompt:', e);
      }
    }

    void promptText('New variable name:', '').then((name) => {
      if (!name) return;
      try {
        const created = wsAny.createVariable(name);
        // Some Blockly UIs require a toolbox refresh to pick up variable changes.
        wsAny.refreshToolboxSelection?.();

        // UX improvement: drop a SETVARIABLE block onto the canvas using the
        // newly created variable, so users immediately see "a variable block".
        try {
          const wsSvg: any = wsAny;
          if (typeof wsSvg.newBlock === 'function' && (Blockly as any).Blocks) {
            const hasPortalSet = Boolean((Blockly as any).Blocks['SETVARIABLE']);
            const hasBlocklySet = Boolean((Blockly as any).Blocks['variables_set']);
            const blockType = hasPortalSet ? 'SETVARIABLE' : (hasBlocklySet ? 'variables_set' : null);
            if (!blockType) return;

            const b = wsSvg.newBlock(blockType);
            const varId = String((created && (created.id ?? (typeof created.getId === 'function' ? created.getId() : ''))) || '');

            if (blockType === 'SETVARIABLE') {
              // Portal set uses field_variable named "VARIABLE".
              try {
                const f = b.getField?.('VARIABLE');
                if (f && typeof f.setValue === 'function') {
                  try {
                    if (varId) f.setValue(varId);
                    else f.setValue(String(name));
                  } catch {
                    f.setValue(String(name));
                  }
                } else if (typeof b.setFieldValue === 'function') {
                  b.setFieldValue(String(name), 'VARIABLE');
                }
              } catch {
                // ignore
              }
            } else if (blockType === 'variables_set') {
              // Core Blockly set uses field_variable named "VAR".
              try {
                const f = b.getField?.('VAR');
                if (f && typeof f.setValue === 'function') {
                  try {
                    if (varId) f.setValue(varId);
                    else f.setValue(String(name));
                  } catch {
                    f.setValue(String(name));
                  }
                } else if (typeof b.setFieldValue === 'function') {
                  b.setFieldValue(String(name), 'VAR');
                }
              } catch {
                // ignore
              }
            }

            b.initSvg?.();
            b.render?.();

            const metrics = wsSvg.getMetrics?.();
            if (metrics && typeof b.moveBy === 'function') {
              b.moveBy(metrics.viewLeft + 120, metrics.viewTop + 120);
            } else if (typeof b.moveBy === 'function') {
              b.moveBy(120, 120);
            }
          }
        } catch (e) {
          console.warn('[BF6] Failed to drop variable block:', e);
        }
      } catch (e) {
        console.warn('[BF6] Failed to create variable:', e);
      }
    });
  } catch (e) {
    console.warn('[BF6] Failed to open variables manager:', e);
  }
}
