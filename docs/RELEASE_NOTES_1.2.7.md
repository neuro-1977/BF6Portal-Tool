# BF6Portal Tool — Release Notes (v1.2.7)

Date: 2025-12-16

This release focuses on **matching the official Portal editor UX**, especially around the **RULE block UI** and **toolbox/menu layout**.

---

## Highlights

### Official-style RULE block layout
- The `RULE_HEADER` block now places the **rule name textbox + Event dropdown + scope dropdown on a single top row**, matching the official editor layout.
- Event dropdown populated from the official list provided (starting with **Ongoing**).
- The second (scope) dropdown is **unlabeled** and starts with **Global**, matching the official UI.

### Official toolbox/menu structure (with strict colour-group separation)
- Toolbox now matches the requested official layout:
  - **Search box** at the top of the toolbox.
  - **RULES** menu contains: `MOD_BLOCK`, `RULE_HEADER`, `CONDITION_BLOCK`.
  - **ACTIONS** (yellow group): AI, ARRAYS, AUDIO, CAMERA, EFFECTS, EMPLACEMENTS, GAMEPLAY, LOGIC, OBJECTIVE, OTHER, PLAYER, TRANSFORM, USER INTERFACE, VEHICLES.
  - **VALUES** (green group): AI, ARRAYS, AUDIO, EFFECTS, EVENT PAYLOADS, GAMEPLAY, LOGIC, MATH, OBJECTIVE, OTHER, PLAYER, TRANSFORM, USER INTERFACE, VEHICLES, SELECTION LISTS, LITERALS, VARIABLES.
  - **SUBROUTINES** (dark orange) menu.
  - **CONTROL ACTIONS** (blue) menu.
- Enforced the rule: **no output/value blocks in Actions menus** and **no statement/action blocks in Values menus**.

---

## Files of interest
- `web_ui/main.js` — builds the official toolbox layout at runtime and adds the toolbox search box.
- `web_ui/block_definitions.js` — updated `RULE_HEADER` to match the official top-row field layout.

---

## Known limitations
- Some blocks may still have placeholder visuals/colours until full native Portal definitions are implemented, but they will now appear under the correct *menu group* (Actions vs Values) based on connection type.
