# BF6Portal Tool: Master UI/UX and Refactor Prompt (2025-11-29)

## Master Prompt: UI/UX and Refactor Plan 
-----------------------------------------------------------------------
user editable area keep safe.
-----------------------------------------------------------------------
prompt Updated.
# -- //no agent response required to thie intial call of this prompt.//


---
**STATUS UPDATE (2025-11-29):**
All web UI functions are now complete except for the ticker text on the boot/splash screen. The ticker is the only remaining incomplete feature; all other UI/UX requirements and controls are implemented and working as specified. Continue work on restoring/cycling the quirky ticker comments at the bottom of the splash. All other web UI features are considered done unless new issues are found.

---

-----------------------------------------------------------------------
check blocks folder for screenshots analyze them and make documentation for them in a seperate folder
### 1. Boot/Splash Screen ("Green Box")
- **Do NOT change the working boot/splash screen except for bugfixes or visual polish.**
	- The green box, logo, credits, loading bar, are correct and match the screenshot and prompt.
	the ticker text is missing and we may need to fix it.
	- The **ticker** cycles quirky, community-driven comments every 12 seconds. These are visible and distinct from the loading message
- **The boot screen must always show for at least 1–2 seconds, then fade out if all is well.**
- **If there’s a load error, the error is reported in the green box panel.**

### 2. Blockly Desktop (Main Scene)
- **All controls (zoom, save, load, code, export, import, recenter) must be vertically stacked and centered at the top of the blockly desktop, not horizontal.**
- **Search bar (when enabled) goes under the controls.**
- **The blockly canvas/grid is the main scene, no trashcan, all blocks working.**
- **The blockly desktop and splash/boot screens are visually and structurally separated.**

### 3. Transition
- **The boot screen should always show for at least 1–2 seconds, then fade out if all is well.**
- **If there’s a load error, the error is reported in the green box panel.**

### 4. Documentation and Concept Art
- **Update all docs and mockups to reflect the new workspace/screen separation and UI layout.**
- **Ensure all docs and mockups reflect the new workspace/screen separation and UI layout.**

### 5. File Organization
- **Keep splash/boot and blockly desktop logic/styles separate to avoid interference.**

### 6. Review and Iteration
- **Reload the web UI for user review.**
- **Ensure the transition from boot to blockly desktop is smooth and visually clear.**
- **Set and maintain this as the master prompt for further updates.**
- **All future changes should reference this plan and the attached screenshot.**

---



## Asset Requirements and Diagnostics (2025-11-29)
