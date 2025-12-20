import * as Blockly from 'blockly';

/**
 * Blockly Variables integration helpers.
 *
 * Portal/community templates ship a `variables` array in workspace state.
 * These blocks let users pick those variables from the toolbox/flyout.
 */
export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  {
    type: 'BF6_VARIABLE_REF',
    message0: 'Variable %1',
    args0: [
      {
        type: 'field_variable',
        name: 'VAR',
        variable: 'item',
        // Allow typed variables imported from Portal/community templates.
        // (If omitted, Blockly defaults can filter out non-default types.)
        variableTypes: null,
        defaultType: null,
      },
    ],
    output: 'Variable',
    colour: '#A65C5C',
    tooltip: 'Reference a workspace variable (output type: Variable).',
    helpUrl: '',
  },
  {
    type: 'GETVARIABLE',
    message0: 'Get %1',
    args0: [
      {
        type: 'field_variable',
        name: 'VARIABLE_NAME',
        variable: 'item',
        // Allow typed variables imported from Portal/community templates.
        variableTypes: null,
        defaultType: null,
      },
    ],
    output: 'Any',
    colour: '#A65C5C',
    tooltip: 'Get the value of a workspace variable.',
    helpUrl: '',
  },
  {
    type: 'SETVARIABLE',
    message0: 'Set %1 to %2',
    args0: [
      {
        type: 'field_variable',
        name: 'VARIABLE',
        variable: 'item',
        // Allow typed variables imported from Portal/community templates.
        variableTypes: null,
        defaultType: null,
      },
      {
        type: 'input_value',
        name: 'VALUE',
        check: 'Any',
      },
    ],
    previousStatement: 'Action',
    nextStatement: 'Action',
    colour: '#A65C5C',
    tooltip: 'Set the value of a workspace variable.',
    helpUrl: '',
  },
]);
