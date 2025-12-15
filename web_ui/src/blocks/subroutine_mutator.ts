
import * as Blockly from 'blockly';

export const SUBROUTINE_DEF_MUTATOR = 'subroutine_def_mutator';
export const SUBROUTINE_CALL_MUTATOR = 'subroutine_call_mutator';

const subroutineDefMutator = {
  params: [], // Array of {name: string, type: string}

  mutationToDom: function(this: any) {
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('params', JSON.stringify(this.params));
    return container;
  },

  domToMutation: function(this: any, xmlElement: Element) {
    const params = xmlElement.getAttribute('params');
    this.params = params ? JSON.parse(params) : [];
    this.updateShape_();
  },

  updateShape_: function(this: any) {
    // Remove existing parameter inputs
    let i = 0;
    while (this.getInput('PARAM_' + i)) {
      this.removeInput('PARAM_' + i);
      i++;
    }

    // Add new parameter inputs
    // We add them before the 'ACTIONS_CONDITIONS' input if possible, or just append them.
    // The JSON definition has 'ACTIONS_CONDITIONS' as the last input.
    // We want parameters to appear after the name but before the logic.
    
    // However, inserting inputs at specific indices in Blockly can be tricky if we don't know the index.
    // We'll just append them for now, or try to insert before 'ACTIONS_CONDITIONS'.
    
    for (let j = 0; j < this.params.length; j++) {
      const param = this.params[j];
      const input = this.appendDummyInput('PARAM_' + j);
      input.appendField(`Param: ${param.name} (${param.type})`);
      // Move this input before CONDITIONS
      if (this.getInput('CONDITIONS')) {
          this.moveInputBefore('PARAM_' + j, 'CONDITIONS');
      }
    }
  },
  
  // Custom function to set params from the UI
  setParams: function(this: any, newParams: any[]) {
      this.params = newParams;
      this.updateShape_();
  }
};

const subroutineCallMutator = {
  params: [], // Array of {name: string, type: string}

  mutationToDom: function(this: any) {
    const container = Blockly.utils.xml.createElement('mutation');
    container.setAttribute('params', JSON.stringify(this.params));
    return container;
  },

  domToMutation: function(this: any, xmlElement: Element) {
    const params = xmlElement.getAttribute('params');
    this.params = params ? JSON.parse(params) : [];
    this.updateShape_();
  },

  updateShape_: function(this: any) {
    // Remove existing argument inputs
    let i = 0;
    while (this.getInput('ARG_' + i)) {
      this.removeInput('ARG_' + i);
      i++;
    }

    // Add new argument inputs
    for (let j = 0; j < this.params.length; j++) {
      const param = this.params[j];
      const input = this.appendValueInput('ARG_' + j);
      input.setCheck(param.type); // Set type check based on param type
      input.appendField(param.name);
      input.setAlign(Blockly.inputs.Align.RIGHT);
    }
  }
};

export const registerMutators = () => {
    if (!Blockly.Extensions.isRegistered(SUBROUTINE_DEF_MUTATOR)) {
        Blockly.Extensions.registerMutator(SUBROUTINE_DEF_MUTATOR, subroutineDefMutator);
    }
    if (!Blockly.Extensions.isRegistered(SUBROUTINE_CALL_MUTATOR)) {
        Blockly.Extensions.registerMutator(SUBROUTINE_CALL_MUTATOR, subroutineCallMutator);
    }
};
