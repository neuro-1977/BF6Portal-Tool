# TODO (user-facing)

This file is intended to be *your* current task list.

## Done (v1.3.0)

- [x] **Official Portal integration:** exported workspaces/presets import correctly into the official Portal Rules Editor (validated with Rush template export).
- [x] **Collections UX polish:** call blocks show their names in the flyout and on spawned blocks; jump-to-definition is centered; contextual menu labels.
- [x] **Collections Help:** right-click Help shows a local doc entry for Collections blocks.

## Next (optimization / cleanup)

- [ ] **Bundle size / load time:** reduce `index.bundle.js` size via code-splitting (lazy-load heavy subsystems like presets/docs/selection lists).
- [ ] **Single-source UI init:** revisit loading both legacy `web_ui/main.js` and the webpack bundle; keep only what is required to avoid double-init risk.
- [ ] **Export regression tests:** add a small set of canned workspaces and verify Portal export round-trips (JSON -> official import -> re-import) as a smoke test.
- [ ] **Collections robustness:** add diagnostics / guards for name resolution when importing older workspaces or when defs are missing.
- [ ] **Release hygiene:** optionally sign the Windows installer and add SHA256 checksums to GitHub Release assets.
