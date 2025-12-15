
import * as Blockly from 'blockly';

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  {
    "type": "home_block",
    "message0": "%1 Home %2",
    "args0": [
      {
        "type": "input_value",
        "name": "LEFT"
      },
      {
        "type": "input_value",
        "name": "RIGHT"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "colour": "#1565C0",
    "tooltip": "The central home block",
    "helpUrl": ""
  }
]);
