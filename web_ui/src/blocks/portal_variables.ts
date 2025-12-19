/**
 * Portal variable helper blocks.
 *
 * These blocks are primarily here for compatibility with community presets and
 * older exports (including the built-in Conquest preset) that reference:
 *  - `variableReferenceBlock`
 *  - `SetVariable`
 *  - `GetVariable`
 *
 * Those presets expect specific input/field names (e.g. `VALUE-0`, `VALUE-1`,
 * `OBJECTTYPE`, `OBJECT`). Keep this schema stable to avoid
 * Blockly.serialization MissingConnection errors during workspace load.
 */

import * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';

export function registerPortalVariableBlocks(): void {
  try {
    // Avoid double-registration in hot reload / multi-bundle scenarios.
    const anyB: any = Blockly as any;
    if (anyB.__bf6_portal_variable_blocks_registered) return;
    anyB.__bf6_portal_variable_blocks_registered = true;

    // 1) Variable reference value block.
    // Produces an output that other blocks can treat as a "Variable".
    Blockly.common.defineBlocks({
      variableReferenceBlock: {
        init: function () {
          // Many presets store:
          //  - fields.OBJECTTYPE: "Global" | "Player" | "Team" | ...
          //  - fields.VAR: { id: "..." }
          //  - extraState.isObjectVar: boolean
          //  - inputs.OBJECT: { block: ... } (when object vars are used)

          this.appendDummyInput('HEAD')
            .appendField('Variable')
            .appendField(
              new Blockly.FieldDropdown([
                ['Global', 'Global'],
                ['Player', 'Player'],
                ['Team', 'Team'],
              ]),
              'OBJECTTYPE',
            )
            // Pass `null` as the variable type filter so *typed* variables from
            // presets (e.g. type: "Team" / "Player") appear in the dropdown.
            .appendField(new (Blockly as any).FieldVariable('item', undefined, null), 'VAR');

          this.appendValueInput('OBJECT').appendField('of');
          this.setInputsInline(true);
          this.setOutput(true, 'Variable');
          this.setColour('#0288D1');
          this.setTooltip('Reference a Portal variable by name.');

          const block: any = this;

          const updateObjectInput = () => {
            try {
              const objectType = String(block.getFieldValue('OBJECTTYPE') || 'Global');
              const input = block.getInput('OBJECT');
              if (!input) return;
              const wantsObject = objectType !== 'Global';
              input.setVisible(wantsObject);
              // Re-render when in a rendered workspace.
              if (block.rendered) block.render();
            } catch {
              // ignore
            }
          };

          // Initial shape.
          updateObjectInput();

          // React to dropdown changes.
          block.setOnChange(function (evt: any) {
            try {
              if (!evt) return;
              if (evt.type === Blockly.Events.BLOCK_CHANGE && evt.blockId === block.id && evt.name === 'OBJECTTYPE') {
                updateObjectInput();
              }
            } catch {
              // ignore
            }
          });
        },
      },

      // 2) SetVariable statement block.
      SetVariable: {
        init: function () {
          // Compatibility note:
          // Older presets use VALUE-0 (variable) and VALUE-1 (value).
          this.appendValueInput('VALUE-0').setCheck('Variable').appendField('Set');
          this.appendValueInput('VALUE-1').appendField('to');
          this.setInputsInline(true);
          this.setPreviousStatement(true);
          this.setNextStatement(true);
          this.setColour('#FFEB3B');
          this.setTooltip('Set a Portal variable to a value.');
        },
      },

      // 3) GetVariable value block.
      GetVariable: {
        init: function () {
          // Compatibility note:
          // Older presets use VALUE-0 (variable).
          this.appendValueInput('VALUE-0').setCheck('Variable').appendField('Get');
          this.setInputsInline(true);
          this.setOutput(true, 'Any');
          this.setColour('#32CD32');
          this.setTooltip('Get the value of a Portal variable.');
        },
      },
    });

    // Generators (best-effort)
    // NOTE: The Portal scripting runtime uses `mod.*` helpers. In the web editor
    // preview, this may just be illustrative (and can be adapted later).
    (javascriptGenerator.forBlock as any)['variableReferenceBlock'] = function (block: any, generator: any) {
      // Blockly FieldVariable stores an id. Prefer variable name when possible.
      const idOrName = block.getFieldValue('VAR') || '';
      let name = String(idOrName);
      try {
        const v = (block.workspace && typeof block.workspace.getVariableById === 'function')
          ? block.workspace.getVariableById(idOrName)
          : null;
        if (v && typeof v.name === 'string' && v.name) name = v.name;
      } catch {
        // ignore
      }
      const objectType = String(block.getFieldValue('OBJECTTYPE') || 'Global');
      const objectExpr = generator.valueToCode(block, 'OBJECT', Order.NONE) || 'null';
      const ref = (objectType && objectType !== 'Global')
        ? `${objectType}:${name}(${objectExpr})`
        : `${name}`;
      // Treat variable refs as string identifiers.
      return [generator.quote_(ref), Order.ATOMIC];
    };

    (javascriptGenerator.forBlock as any)['SetVariable'] = function (block: any, generator: any) {
      const variableExpr = generator.valueToCode(block, 'VALUE-0', Order.NONE) || '""';
      const valueExpr = generator.valueToCode(block, 'VALUE-1', Order.NONE) || 'null';
      return `mod.SetVariable(${variableExpr}, ${valueExpr});\n`;
    };

    (javascriptGenerator.forBlock as any)['GetVariable'] = function (block: any, generator: any) {
      const variableExpr = generator.valueToCode(block, 'VALUE-0', Order.NONE) || '""';
      return [`mod.GetVariable(${variableExpr})`, Order.FUNCTION_CALL];
    };
  } catch (e) {
    console.warn('[BF6] Failed to register portal variable blocks:', e);
  }
}
