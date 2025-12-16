# TODO

- [ ] **UI/UX:** Fix persistent vertical scrollbar appearing next to the toolbox flyout after interacting with menus. 
    - **Location:** Left side of the screen, adjacent to the Blockly toolbox category list.
    - **Current State:** CSS attempts to hide scrollbars on `.blocklyToolboxDiv`, `.blocklyToolbox`, and `.blocklyFlyout` have reduced but not fully eliminated the artifact in some states.
    - **Potential Cause:** Electron/Chromium native scrollbar rendering on a dynamic container created by Blockly or the custom search bar injection.
