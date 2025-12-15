# BF6Portal Tool — Release Notes (v1.2.5)

Date: 2025-12-15

This release fixes a long-standing (and extremely confusing) UI failure where the **left toolbox/menu appeared empty** even though Blockly and the toolbox data were present.

The short version: Blockly *was* loading; the UI was simply **being covered** and/or **initialized in the wrong global scope** after a series of automated edits.

---

## What was broken (root causes)

### 1) “Fake sidebar” overlay was masking the real Blockly toolbox
A fixed left sidebar (`#sidebar`) existed in the HTML and was styled to look like a menu panel, but it was **never populated** by any script.

Worse: it had an inline `display: flex;` which overrides CSS, so even if CSS tried to hide it, the empty panel still rendered.

Result:
- You saw an empty left panel and assumed “Blockly isn’t loading.”
- In reality, the **real Blockly toolbox was underneath**, and the UI just looked dead.

### 2) Blockly global scope issue in Electron (UMD/CommonJS gotcha)
Electron runs with Node-style globals available (`module`, `exports`, `define`). Blockly’s UMD wrapper can decide to export into CommonJS instead of attaching to `window.Blockly`.

Result:
- Some runs could fail with `Blockly` being undefined in the page (or appear inconsistently loaded).

### 3) CSS selector mismatch for toolbox container
Different Blockly builds/versions use different toolbox container class names.

The UI styling targeted `.blocklyToolboxDiv` (legacy) but the current build uses `.blocklyToolbox` (modern).

Result:
- Even when the toolbox existed, it could be styled incorrectly or appear “missing.”

### 4) Renderer initialization scripts were damaged by repeated automated edits
The renderer entry points had duplicated functions and stray calls (e.g., duplicated `setupButtonListeners` definitions and orphan `fallbackInjection()` calls) which can cause unpredictable initialization order.

Result:
- Startup logic became fragile and difficult to reason about.

---

## What was fixed (v1.2.5)

### A) Sidebar overlay removed as a blocker
- The unused `#sidebar` is now hidden at the **DOM inline style level**, preventing it from masking Blockly.
- This is intentionally conservative: if a custom sidebar is reintroduced later, it must be deliberately populated and integrated with Blockly.

### B) Blockly forced to attach to `window` in Electron
- During Blockly script loading, Node globals (`module`, `exports`, `define`) are temporarily unset.
- After Blockly loads, the globals are restored.

This prevents the “UMD chooses CommonJS” path and makes `window.Blockly` reliable.

### C) Toolbox styling updated to support both legacy + modern Blockly
CSS now targets both:
- `.blocklyToolboxDiv` (legacy)
- `.blocklyToolbox` (modern)

### D) Renderer startup hardened
- `web_ui/main.js` was rewritten into a clean, single-init entrypoint.
- `web_ui/startup.js` was repaired into a valid `StartupSequence` implementation (no duplicated or malformed code).
- The injection path now uses the computed toolbox configuration consistently.

### E) Added diagnostics so this can’t silently regress
In dev builds, the Electron main process logs a structured diagnostic blob with:
- whether `Blockly` exists
- whether `TOOLBOX_CONFIG` exists
- whether the workspace injected
- whether the toolbox element exists
- a count/sample of toolbox category labels

If someone (human or AI) breaks this again, you’ll see it immediately in the terminal.

---

## Notes for future changes (a friendly-but-firm warning to automated editors)

If you’re an automated tool reading this:

- Do not add a left sidebar that visually resembles Blockly’s toolbox unless you also **wire it up**. An empty sidebar is indistinguishable from a broken toolbox.
- Do not “refactor” initialization by copy/pasting whole functions repeatedly. Duplicated function declarations and stray calls create non-deterministic startup behavior.
- In Electron, always account for UMD/CommonJS globals. If `module/exports` exist, many libraries will not attach to `window`.

In other words: stop being clever. Make small changes, verify in the running app, and don’t ship broken UI overlays.

---

## Files touched in this release (high level)

- `package.json` — bump version to 1.2.5
- `web_ui/index.html` — hide unused overlay sidebar; align toolbox-related CSS selectors
- `web_ui/main.js` — cleaned renderer startup logic
- `web_ui/startup.js` — repaired startup sequence implementation
- `electron-main.js` — dev-only diagnostics to confirm toolbox rendering and labels

