/**
 * Collections / Bookmarks
 *
 * A "collection" is a named stack of blocks stored offscreen.
 * A call block acts as a bookmark (and can be expanded during codegen/export).
 */

import * as Blockly from 'blockly';

export const COLLECTION_DEF_TYPE = 'BF6_COLLECTION_DEF';
export const COLLECTION_CALL_TYPE = 'BF6_COLLECTION_CALL';

const COLLECTION_CALL_NAME_DROPDOWN_EXTENSION = 'bf6portal.collections.callNameDropdown';

// --- Call block NAME dropdown (dynamic, with manual entry) ---
// We keep the underlying field name as `NAME` so older workspaces remain compatible.
// The dropdown always lists existing collection definitions, but also accepts arbitrary
// text so imported/older workspaces don't lose their stored value.

type DropdownOption = [string, string];

const MANUAL_ENTRY_VALUE = '__bf6_manual_collection_name__';

function listCollectionNames(workspace: Blockly.Workspace | null | undefined): string[] {
  if (!workspace) return [];
  try {
    const defs = (workspace as any).getBlocksByType ? (workspace as any).getBlocksByType(COLLECTION_DEF_TYPE, false) : [];
    const names: string[] = [];
    for (const b of defs || []) {
      try {
        const n = String((b as any).getFieldValue?.('NAME') ?? '').trim();
        if (n) names.push(n);
      } catch {
        // ignore
      }
    }
    return names;
  } catch {
    return [];
  }
}

class FieldCollectionNameDropdown extends (Blockly as any).FieldDropdown {
  private __bf6PromptOpen = false;

  constructor(initialValue?: string) {
    super((): DropdownOption[] => FieldCollectionNameDropdown.buildOptions(this));

    // Validator lets us intercept the special manual-entry item.
    this.setValidator((newValue: string) => {
      const v = String(newValue ?? '');
      if (v === MANUAL_ENTRY_VALUE) {
        if (this.__bf6PromptOpen) return null;
        this.__bf6PromptOpen = true;

        const dialog: any = (Blockly as any).dialog;
        const current = String(this.getValue?.() ?? '').trim();
        const fallbackPrompt = () => {
          // Electron doesn't support native prompt; Blockly.dialog is overridden in index.ts.
          this.__bf6PromptOpen = false;
        };

        try {
          if (dialog?.prompt && typeof dialog.prompt === 'function') {
            dialog.prompt('Collection name:', current || '', (res: string | null) => {
              this.__bf6PromptOpen = false;
              const trimmed = String(res ?? '').trim();
              if (trimmed) {
                try {
                  this.setValue(trimmed);
                } catch {
                  // ignore
                }
              }
            });
            return null;
          }
        } catch {
          // ignore
        }

        fallbackPrompt();
        return null;
      }

      // Accept any string (even if it isn't currently in the dropdown list).
      return v;
    });

    if (initialValue) {
      try {
        this.setValue(String(initialValue));
      } catch {
        // ignore
      }
    }
  }

  /**
   * Blockly's FieldDropdown normally displays the *option label* for the current
   * value. When our dynamic option list is temporarily empty/out-of-sync (e.g.
   * flyout workspaces, or during block init), Blockly may display an empty
   * string. Fall back to the raw value so collection names always remain visible.
   */
  protected getText_(): string | null {
    try {
      const parentGetText = (Blockly as any).FieldDropdown?.prototype?.getText_;
      const t = typeof parentGetText === 'function' ? String(parentGetText.call(this) ?? '') : '';
      if (t && t.trim()) return t;
    } catch {
      // ignore
    }

    try {
      const v = String((this as any).getValue?.() ?? '').trim();
      return v;
    } catch {
      return '';
    }
  }

  /**
   * Blockly's FieldDropdown assumes values are always present in its option list.
   * For Collections we allow arbitrary string values (older imports, flyout blocks
   * created from XML, etc.). Ensure the raw value is preserved even when it isn't
   * present in the dynamic option list at update-time.
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention
  protected doValueUpdate_(newValue: any): void {
    const v = String(newValue ?? '');

    try {
      const parentDoValueUpdate = (Blockly as any).FieldDropdown?.prototype?.doValueUpdate_;
      if (typeof parentDoValueUpdate === 'function') {
        parentDoValueUpdate.call(this, v);
      }
    } catch {
      // ignore
    }

    // Preserve the raw value even if the base implementation coerced it.
    try {
      (this as any).value_ = v;
    } catch {
      // ignore
    }

    // Keep a reasonable selected option so Blockly doesn't render an empty label.
    try {
      const opts: any[] = (this as any).getOptions?.(true) ?? [];
      const match = Array.isArray(opts)
        ? opts.find((o) => Array.isArray(o) && o.length >= 2 && String(o[1]) === v)
        : null;
      (this as any).selectedOption = match || [v, v];
    } catch {
      try {
        (this as any).selectedOption = [v, v];
      } catch {
        // ignore
      }
    }
  }

  // Allow values that aren't in the current option set (needed for older imports).
  protected doClassValidation_(newValue: any): string | null {
    const v = String(newValue ?? '');
    if (v === MANUAL_ENTRY_VALUE) return null;
    return v;
  }

  private static buildOptions(field: any): DropdownOption[] {
    const sourceBlock = field?.getSourceBlock?.();
    const ws: Blockly.Workspace | null = sourceBlock?.workspace ?? null;

    const current = String(field?.getValue?.() ?? '').trim();
    const names = listCollectionNames(ws)
      .filter((n) => !!n)
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    const options: DropdownOption[] = names.map((n) => [n, n]);

    // Ensure the current value is always selectable/displayable even if the definition
    // doesn't exist yet (imported older workspace, typo, etc.).
    if (current && !options.some(([, v]) => v === current)) {
      options.unshift([current, current]);
    }

    if (options.length === 0) {
      // Provide a stable placeholder, but keep it non-destructive (manual entry exists).
      options.push(['(no collections yet)', current || '']);
    }

    options.push(['(type name…)', MANUAL_ENTRY_VALUE]);
    return options;
  }
}

function registerCollectionCallDropdownExtension(): void {
  const extensions: any = (Blockly as any).Extensions;
  if (!extensions || typeof extensions.register !== 'function') return;

  // Avoid duplicate registration during hot reload / multi-bundle scenarios.
  const anyExt: any = extensions as any;
  if ((anyExt.__bf6CollectionsCallDropdownRegistered as boolean) === true) return;
  anyExt.__bf6CollectionsCallDropdownRegistered = true;

  try {
    extensions.register(COLLECTION_CALL_NAME_DROPDOWN_EXTENSION, function (this: Blockly.Block) {
      try {
        const existing: any = (this as any).getField?.('NAME');
        if (!existing) return;
        const parentInput: any = existing.getParentInput?.();
        if (!parentInput) return;

        const current = String(existing.getValue?.() ?? existing.getText?.() ?? '').trim();
        try {
          parentInput.removeField('NAME');
        } catch {
          // ignore
        }

        const dd = new FieldCollectionNameDropdown(current);
        parentInput.appendField(dd, 'NAME');

        // Defensive: in some Blockly init/load paths, the field value is applied
        // after extensions run. Re-apply what we observed so the label renders.
        if (current) {
          try {
            dd.setValue(current);
          } catch {
            // ignore
          }
        }
      } catch {
        // ignore
      }
    });
  } catch {
    // ignore
  }
}

// Register on module load so blocks created later pick it up.
registerCollectionCallDropdownExtension();

// NOTE: These blocks are tool-internal helpers. They are not part of the official
// Portal block set, but they enable workspace hygiene and navigation.
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  {
    type: COLLECTION_DEF_TYPE,
    message0: 'COLLECTION %1',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'MyCollection',
      },
    ],
    // Extra spacer rows so the block reads more like a "header + body" container.
    // (This also makes it easier to spot in large workspaces.)
    message1: '%1',
    args1: [
      {
        type: 'input_dummy',
      },
    ],
    message2: '%1',
    args2: [
      {
        type: 'input_statement',
        name: 'STACK',
      },
    ],
    message3: '%1',
    args3: [
      {
        type: 'input_dummy',
      },
    ],
    colour: '#cc5cff',
    tooltip: 'Collection definition (stored offscreen).',
    helpUrl: '',
  },
  {
    type: COLLECTION_CALL_TYPE,
    message0: 'COLLECT %1',
    args0: [
      {
        type: 'field_input',
        name: 'NAME',
        text: 'MyCollection',
      },
    ],
    extensions: [COLLECTION_CALL_NAME_DROPDOWN_EXTENSION],
    // Make call blocks taller (roughly ~2x) so they read like a distinct
    // "macro call" / bookmark.
    message1: '%1',
    args1: [
      {
        type: 'input_dummy',
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: '#cc5cff',
    tooltip: 'Bookmark/macro call. Right-click to jump to the definition.',
    helpUrl: '',
  },
]);
