/**
 * Collections / Bookmarks
 *
 * A "collection" is a named stack of blocks stored offscreen.
 * A call block acts as a bookmark (and can be expanded during codegen/export).
 */

import * as Blockly from 'blockly';

export const COLLECTION_DEF_TYPE = 'BF6_COLLECTION_DEF';
export const COLLECTION_CALL_TYPE = 'BF6_COLLECTION_CALL';

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
    message1: '%1',
    args1: [
      {
        type: 'input_statement',
        name: 'STACK',
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
    previousStatement: null,
    nextStatement: null,
    colour: '#cc5cff',
    tooltip: 'Bookmark/macro call. Right-click to jump to the definition.',
    helpUrl: '',
  },
]);
