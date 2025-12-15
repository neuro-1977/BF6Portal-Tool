import * as Blockly from 'blockly';

const modBlocks = [
  {
    type: 'bf6_mod',
    message0: 'MOD %1 Description %2',
    args0: [
      {
        type: 'field_input',
        name: 'MOD_NAME',
        text: 'MyGameMode'
      },
      {
        type: 'field_input',
        name: 'DESCRIPTION',
        text: 'Description'
      }
    ],
    message1: '%1',
    args1: [
      {
        type: 'input_statement',
        name: 'DO'
      }
    ],
    colour: '#4A4A4A',
    tooltip: 'Define a BF6Portal MOD (game mode) with description',
    helpUrl: ''
  }
];

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(modBlocks);
