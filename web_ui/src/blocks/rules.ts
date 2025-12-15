import * as Blockly from 'blockly';

const rulesBlocks = [
  {
    type: 'bf6_rule',
    message0: 'RULE %1 Event %2 Scope %3 Global %4',
    args0: [
      {
        type: 'field_input',
        name: 'RULE_NAME',
        text: 'New Rule'
      },
      {
        type: 'field_dropdown',
        name: 'EVENT_TYPE',
        options: [
          ['Ongoing', 'Ongoing'],
          ['OnPlayerJoin', 'OnPlayerJoin'],
          ['OnPlayerDeath', 'OnPlayerDeath'],
          ['OnPlayerSpawn', 'OnPlayerSpawn']
        ]
      },
      {
        type: 'field_dropdown',
        name: 'SCOPE',
        options: [
          ['Global', 'Global'],
          ['Team', 'Team'],
          ['Squad', 'Squad'],
          ['Player', 'Player']
        ]
      },
      {
        type: 'field_checkbox',
        name: 'IS_GLOBAL',
        checked: true
      }
    ],
    message1: '%1',
    args1: [
      {
        type: 'input_statement',
        name: 'DO'
      }
    ],
    colour: '#7E3F96',
    tooltip: 'Define a BF6Portal rule with event and scope',
    helpUrl: ''
  }
];

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray(rulesBlocks);
