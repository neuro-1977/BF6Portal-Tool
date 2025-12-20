import * as Blockly from 'blockly';
import { javascriptGenerator, Order } from 'blockly/javascript';

/**
 * Selection Lists (Portal enums)
 *
 * Source of truth: repo root `selection-lists.md` (generated from `=Resources=/portal-docs-json/index.d.ts`).
 * We ship that markdown into `web_ui/dist/` and parse it at runtime.
 */

type SelectionListMap = Record<string, string[]>; // EnumName -> values

type Cache = {
  loaded: boolean;
  loading: boolean;
  map: SelectionListMap;
  mapCI: SelectionListMap;
  optionsCache: Record<string, [string, string][]>;
  lastError?: string;
};

const cache: Cache = {
  loaded: false,
  loading: false,
  map: {},
  mapCI: {},
  optionsCache: {},
};

function getOptionsCacheKey(enumName: string): string {
  return String(enumName || '').trim().toLowerCase();
}

function makeOptionsCached(enumName: string, values: string[]): [string, string][] {
  const key = getOptionsCacheKey(enumName);
  const cached = cache.optionsCache[key];
  if (cached && cached.length === values.length) return cached;

  // FieldDropdown consumes [label, value] pairs.
  // Cache these because some enums (e.g. Weapons) are large and regenerating
  // on every dropdown open makes the UI feel sluggish.
  const opts: [string, string][] = values.map((v) => [v, v]);
  cache.optionsCache[key] = opts;
  return opts;
}


// Some enums are named differently between our block output types (from bf6portal_blocks.json)
// and the upstream portal-docs TypeScript definitions.
// This keeps dropdowns populated without needing a full rename across the project.
const ENUM_ALIASES: Record<string, string> = {
  DamageTypes: 'PlayerDamageTypes',
  DeathTypes: 'PlayerDeathTypes',
  InputRestrictions: 'RestrictedInputs',
  // Blocks refer to "CustomMessageSlots" but selection lists use "CustomNotificationSlots".
  CustomMessageSlots: 'CustomNotificationSlots',
  // Blocks refer to player-facing names, selection lists use Soldier* enums.
  PlayerInventorySlots: 'InventorySlots',
  PlayerSoldiers: 'SoldierClass',
  PlayerStateBool: 'SoldierStateBool',
  PlayerStateNumber: 'SoldierStateNumber',
  PlayerStateVector: 'SoldierStateVector',
  // Inventory subsets are derived from Weapons/Gadgets lists.
  InventoryOpenGadgets: 'OpenGadgets',
  // Block output type is VehiclesItem but upstream selection list enum is VehicleList.
  Vehicles: 'VehicleList',
  // Best-effort: audio-related lists in this dataset are exposed via VoiceOverEvents2D/MusicEvents.
  VoiceOvers: 'VoiceOverEvents2D',
  Sounds: 'MusicEvents',
  LocationalSounds: 'MusicEvents',
};

// Some selection lists are not represented as enums in the upstream TypeScript definitions
// we parse from `selection-lists.md`. Provide minimal, best-effort fallbacks so dropdown
// blocks don't stay stuck in a permanent "loading..." state.
const EXTRA_SELECTION_LISTS: SelectionListMap = {
  // The Portal builder exposes 10 world icon entity slots.
  WorldIcons: ['ICON_1', 'ICON_2', 'ICON_3', 'ICON_4', 'ICON_5', 'ICON_6', 'ICON_7', 'ICON_8', 'ICON_9', 'ICON_10'],
  // Capture points are generally designated A..Z across layouts.
  CapturePoints: Array.from({ length: 26 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i)),
  // MCOM objectives are commonly designated A..F (varies by layout). Provide a small set.
  MCOMs: ['A', 'B', 'C', 'D', 'E', 'F'],
  // Vehicle type categories (best-effort; derived from portal-docs-json translations).
  VehicleTypes: ['Airplane', 'Helicopter', 'Light', 'Medium', 'Heavy', 'Stationary'],
};

const SELECTION_LIST_BLOCK_PREFIX = 'bf6_sel_';

function normalizeEnumKey(name: string): string {
  const s = String(name || '').trim();
  if (!s) return '';
  return s.endsWith('Item') ? s.slice(0, -4) : s;
}

function getCanonicalEnumNamesFromMap(map: SelectionListMap): string[] {
  const names = new Set<string>();
  for (const rawKey of Object.keys(map || {})) {
    const norm = normalizeEnumKey(rawKey);
    if (!norm) continue;
    // Ignore alternate index keys.
    if (norm.startsWith('Enum_')) continue;
    // Prefer the canonical cased version over lower-case duplicates.
    if (norm.toLowerCase() === norm) continue;
    if (!/^[A-Za-z0-9_]+$/.test(norm)) continue;
    const vals = (map as any)[rawKey];
    if (!Array.isArray(vals) || vals.length === 0) continue;
    names.add(norm);
  }
  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

function getConnectionChecksForEnum(enumName: string): string[] {
  const norm = normalizeEnumKey(enumName);
  const checks = new Set<string>();
  const add = (s: string) => {
    const v = String(s || '').trim();
    if (v) checks.add(v);
  };

  add(norm);
  add(`${norm}Item`);
  add(`Enum_${norm}`);
  add(`Enum_${norm}Item`);

  // Known naming drift in older exports/tooling.
  if (norm === 'InputRestrictions') {
    add('RestrictedInputs');
    add('RestrictedInputsItem');
  }
  if (norm === 'RestrictedInputs') {
    add('InputRestrictions');
    add('InputRestrictionsItem');
  }

  return Array.from(checks);
}

function registerSelectionListEnumBlocks(): void {
  // Register once per Blockly instance.
  const anyB: any = Blockly as any;
  if (anyB.__bf6_selection_list_enum_blocks_registered) return;
  if (!cache.loaded) return;
  anyB.__bf6_selection_list_enum_blocks_registered = true;

  // Some environments may not populate Blockly.Blocks until later.
  // Ensure it exists so we can register dynamic enum blocks reliably.
  const blocksRegistry: Record<string, any> = (Blockly as any).Blocks || (((Blockly as any).Blocks = {}) as any);

  const names = getCanonicalEnumNamesFromMap(cache.map);

  for (const enumName of names) {
    const blockType = `${SELECTION_LIST_BLOCK_PREFIX}${enumName}`;

    // In Blockly v12+, a block can exist in the common registry even if it
    // doesn't show up on `Blockly.Blocks` in some bundling contexts.
    const alreadyDefined = (() => {
      try {
        if (Object.prototype.hasOwnProperty.call(blocksRegistry, blockType)) return true;
      } catch {
        // ignore
      }
      try {
        const common: any = (Blockly as any)?.common;
        if (common && typeof common.getBlockDefinition === 'function') {
          return !!common.getBlockDefinition(blockType);
        }
      } catch {
        // ignore
      }
      return false;
    })();

    if (!alreadyDefined) {
      blocksRegistry[blockType] = {
        init: function () {
          this.appendDummyInput()
            .appendField(enumName)
            .appendField(new (Blockly as any).FieldDropdown([['(loading selection lists...)', '__loading__']]), 'OPTION');

          // Allow connections to both EnumName and EnumNameItem.
          this.setOutput(true, getConnectionChecksForEnum(enumName));
          this.setColour(330);
          this.setTooltip(`Selection list: ${enumName}`);

          try {
            Blockly.Extensions.apply('bf6_selection_list_dropdown', this, false);
          } catch {
            // ignore
          }
        },
      };

      // Blockly v12+ primarily instantiates blocks via the common registry.
      // Defining only on Blockly.Blocks can result in "Invalid block definition"
      // when the toolbox/flyout tries to create the block.
      try {
        if (Blockly.common && typeof Blockly.common.defineBlocks === 'function') {
          const defs: any = {};
          defs[blockType] = blocksRegistry[blockType];
          Blockly.common.defineBlocks(defs);
        }
      } catch {
        // ignore
      }
    }

    // Ensure a generator exists (even if the block already existed).
    if (!(javascriptGenerator.forBlock as any)[blockType]) {
      (javascriptGenerator.forBlock as any)[blockType] = function (block: any, generator: any) {
        const value = String(block.getFieldValue('OPTION') || '');
        return [generator.quote_(value), Order.ATOMIC];
      };
    }
  }
}

function ensureDerivedSelectionLists(map: SelectionListMap): void {
  // Derive inventory dropdowns from the available master lists.
  const weapons = map['Weapons'];
  if (Array.isArray(weapons) && weapons.length) {
    if (!map['InventoryPrimaryWeapons'] || map['InventoryPrimaryWeapons'].length === 0) {
      // Primary weapons are everything except sidearms.
      map['InventoryPrimaryWeapons'] = weapons.filter((w) => !String(w).startsWith('Sidearm_'));
    }
    if (!map['InventorySecondaryWeapons'] || map['InventorySecondaryWeapons'].length === 0) {
      map['InventorySecondaryWeapons'] = weapons.filter((w) => String(w).startsWith('Sidearm_'));
    }
  }

  const gadgets = map['Gadgets'];
  if (Array.isArray(gadgets) && gadgets.length) {
    if (!map['InventoryThrowables'] || map['InventoryThrowables'].length === 0) {
      map['InventoryThrowables'] = gadgets.filter((g) => String(g).startsWith('Throwable_'));
    }
    if (!map['InventoryMeleeWeapons'] || map['InventoryMeleeWeapons'].length === 0) {
      map['InventoryMeleeWeapons'] = gadgets.filter((g) => String(g).startsWith('Melee_'));
    }
    if (!map['InventoryClassGadgets'] || map['InventoryClassGadgets'].length === 0) {
      map['InventoryClassGadgets'] = gadgets.filter((g) => String(g).startsWith('Class_'));
    }

    // Best-effort: treat character specialties as the class gadget set if no dedicated list exists.
    if (!map['InventoryCharacterSpecialties'] || map['InventoryCharacterSpecialties'].length === 0) {
      const classGadgets = map['InventoryClassGadgets'] || [];
      map['InventoryCharacterSpecialties'] = classGadgets.length ? classGadgets : gadgets.filter((g) => String(g).startsWith('Class_'));
    }

    // Best-effort: derive medical gadget types from known gadget identifiers.
    if (!map['MedGadgetTypes'] || map['MedGadgetTypes'].length === 0) {
      const preferred = ['Misc_Defibrillator', 'Class_Supply_Bag', 'Class_Adrenaline_Injector'];
      const set = new Set(preferred);
      const derived = gadgets.filter((g) => set.has(String(g)));
      map['MedGadgetTypes'] = derived.length ? derived : preferred;
    }
  }
}

function parseSelectionListsMarkdown(md: string): SelectionListMap {
  const lines = md.split(/\r?\n/);
  const out: SelectionListMap = {};

  let i = 0;
  while (i < lines.length) {
    const line = (lines[i] || '').trim();
    i++;

    if (!line) continue;
    if (line.toUpperCase() === 'SELECTION LISTS:') continue;

    // Format is:
    // <EnumNameItem>
    // widget 1:
    // <EnumName>
    // widget 2:
    // <values...>
    // (blank lines)
    const enumNameItem = line;

    // Seek "widget 1:" and read enum name
    while (i < lines.length && (lines[i] || '').trim() === '') i++;
    if (i >= lines.length || (lines[i] || '').trim().toLowerCase() !== 'widget 1:') continue;
    i++;

    while (i < lines.length && (lines[i] || '').trim() === '') i++;
    let enumName = (i < lines.length ? (lines[i] || '').trim() : '');
    i++;

    // Some generated datasets historically used "<EnumName>Item" in widget 1.
    // Normalize to the base enum name so lookups are stable.
    if (enumName.endsWith('Item')) enumName = enumName.slice(0, -4);

    while (i < lines.length && (lines[i] || '').trim() === '') i++;
    if (i >= lines.length || (lines[i] || '').trim().toLowerCase() !== 'widget 2:') continue;
    i++;

    const values: string[] = [];
    while (i < lines.length) {
      const v = (lines[i] || '').trim();
      if (!v) break;
      // Next enum block starts with something ending in "Item" followed by widget markers.
      // Here we just collect non-empty lines until a blank separator.
      values.push(v);
      i++;
    }

    // Best-effort: trust widget1 name; fall back to stripping Item suffix
    const normalizedEnumNameItem = enumNameItem.endsWith('Item') ? enumNameItem.slice(0, -4) : enumNameItem;
    const key = enumName || normalizedEnumNameItem;
    if (key) out[key] = values;
  }

  return out;
}

async function fetchText(url: string): Promise<string> {
  // Primary path: browser/Electron fetch.
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.text();
  } catch (e) {
    // Electron file:// can be flaky with fetch for local assets. Since this app
    // runs with Node integration enabled, fall back to fs when available.
    try {
      const g: any = globalThis as any;
      const req = g?.require;
      if (typeof req !== 'function') throw e;

      const fs = req('fs') as typeof import('fs');
      const path = req('path') as typeof import('path');
      const { fileURLToPath } = req('url') as typeof import('url');

      const assetUrl = new URL(url, window.location.href);
      const assetPath = fileURLToPath(assetUrl);
      return fs.readFileSync(path.resolve(assetPath), 'utf8');
    } catch {
      throw e;
    }
  }
}

function refreshSelectionListDropdownFields(): void {
  // If selection lists finished loading after a workspace was created,
  // existing dropdown fields might still be set to the placeholder value.
  // Refresh those fields so the UI immediately reflects real options.
  try {
    const getAll = (Blockly as any).getAllWorkspaces as undefined | (() => any[]);
    const getMain = (Blockly as any).getMainWorkspace as undefined | (() => any);

    const workspaces: any[] = [];
    if (typeof getAll === 'function') {
      try { workspaces.push(...(getAll() || [])); } catch { /* ignore */ }
    }
    if (workspaces.length === 0 && typeof getMain === 'function') {
      try {
        const ws = getMain();
        if (ws) workspaces.push(ws);
      } catch {
        // ignore
      }
    }

    // This app exposes its primary workspace on window.workspace.
    // Include it explicitly to ensure we refresh the real UI even if Blockly
    // cannot enumerate workspaces for some reason.
    try {
      const wws = (globalThis as any).workspace;
      if (wws && !workspaces.includes(wws)) workspaces.push(wws);
    } catch {
      // ignore
    }

    const isPlaceholder = (v: any) => {
      const s = String(v ?? '');
      return !s || s === '__loading__' || s === '__error__' || s === '__missing__' || s === '__empty__';
    };

    for (const ws of workspaces) {
      if (!ws || typeof ws.getAllBlocks !== 'function') continue;
      const blocks = ws.getAllBlocks(false) || [];
      for (const b of blocks) {
        try {
          const field: any = b?.getField?.('OPTION');
          if (!field || typeof field.getValue !== 'function') continue;
          if (!isPlaceholder(field.getValue())) continue;

          const gen = field.menuGenerator_;
          const opts = typeof gen === 'function' ? gen() : (Array.isArray(gen) ? gen : null);
          if (!Array.isArray(opts) || opts.length === 0) continue;

          // Pick the first non-sentinel value.
          const firstReal = opts.find((o: any) => Array.isArray(o) && o[1] && !String(o[1]).startsWith('__'));
          if (firstReal && firstReal[1]) {
            try { field.setValue(firstReal[1]); } catch { /* ignore */ }
          }
        } catch {
          // ignore per block
        }
      }

      // If the user currently has the selection list toolbox open, refresh it so
      // dynamically-registered enum blocks appear without needing a manual reselect.
      try { ws.refreshToolboxSelection?.(); } catch { /* ignore */ }
      try { ws.getToolbox?.()?.refreshSelection?.(); } catch { /* ignore */ }
    }
  } catch {
    // ignore
  }
}

export async function preloadSelectionLists(): Promise<void> {
  if (cache.loaded || cache.loading) return;
  cache.loading = true;
  cache.lastError = undefined;
  try {
    // Copied into dist by webpack (see `web_ui/webpack.config.js`).
    // NOTE: Electron packaging excludes *.md by default in this repo, so we ship a
    // `.txt` copy for runtime and fall back to `.md` for dev.
    let md: string | null = null;
    let source: string = 'selection-lists.txt';
    try {
      md = await fetchText('selection-lists.txt');
    } catch {
      source = 'selection-lists.md';
      md = await fetchText('selection-lists.md');
    }
    cache.map = parseSelectionListsMarkdown(md);
    // Merge extra lists (only if missing) so callers can rely on a single lookup path.
    for (const [k, v] of Object.entries(EXTRA_SELECTION_LISTS)) {
      if (!cache.map[k] || cache.map[k].length === 0) cache.map[k] = v;
    }

    // Populate derived lists (only if missing) from other selection lists.
    ensureDerivedSelectionLists(cache.map);

    // Build a case-insensitive lookup map.
    cache.mapCI = {};
    for (const [k, v] of Object.entries(cache.map)) {
      const lk = k.toLowerCase();
      if (!(lk in cache.mapCI)) cache.mapCI[lk] = v;
    }

    // Invalidate any cached dropdown option lists.
    cache.optionsCache = {};

    cache.loaded = true;
    // After loading, register helper enum blocks so the toolbox can expose
    // *all* selection lists (even if the main block set doesn't have dedicated
    // dropdown blocks for each).
    try {
      registerSelectionListEnumBlocks();
    } catch (e) {
      console.warn('[BF6] Failed to register selection list enum blocks:', e);
    }

    // Refresh any existing dropdown fields that were created before load finished.
    refreshSelectionListDropdownFields();
  } catch (e: any) {
    cache.lastError = String(e?.message || e);
    try {
      console.warn('[BF6] Selection lists failed to load:', cache.lastError);
    } catch {
      // ignore
    }
  } finally {
    cache.loading = false;
  }
}

function lookupEnumValues(enumName: string): string[] | undefined {
  // First: explicit fallbacks that don't require the selection lists file to be loaded.
  const extra = EXTRA_SELECTION_LISTS[enumName];
  if (extra && extra.length) return extra;

  const direct = cache.map[enumName];
  if (direct && direct.length) return direct;

  const alias = ENUM_ALIASES[enumName];
  if (alias) {
    const a = cache.map[alias];
    if (a && a.length) return a;
  }

  const ci = cache.mapCI[enumName.toLowerCase()];
  if (ci && ci.length) return ci;

  if (alias) {
    const ciAlias = cache.mapCI[alias.toLowerCase()];
    if (ciAlias && ciAlias.length) return ciAlias;
  }

  // Last: allow aliasing to point at an extra list.
  if (alias) {
    const extraAlias = EXTRA_SELECTION_LISTS[alias];
    if (extraAlias && extraAlias.length) return extraAlias;
  }

  return undefined;
}

function getEnumNameFromBlock(block: Blockly.Block): string | null {
  // Prefer the output connection type (e.g. "DamageTypesItem" -> "DamageTypes")
  try {
    const checks = (block as any).outputConnection?.getCheck?.() ?? (block as any).outputConnection?.check_;
    const list = Array.isArray(checks) ? checks : (checks ? [checks] : []);
    for (const c of list) {
      const s = String(c);
      if (s.endsWith('Item')) return s.slice(0, -4);
    }

    // Some block sets use the non-Item name for type checks (e.g. "Cameras").
    // If we can resolve a list for it, treat it as the enum name.
    for (const c of list) {
      const s = String(c);
      if (!s) continue;
      if (lookupSelectionList(s)) return normalizeEnumKey(s);
    }
  } catch {
    // ignore
  }

  return null;
}

function makeOptions(values: string[]): [string, string][] {
  return values.map((v) => [v, v]);
}

function getCandidateEnumKeys(enumName: string): string[] {
  const raw = String(enumName || '').trim();
  if (!raw) return [];

  // We index both EnumName and EnumNameItem. Still, different Portal docs builds
  // sometimes prefix certain lists (e.g. Enum_Foo) or use PlayerFooTypes.
  // These candidates keep dropdowns working even when naming drifts.
  const norm = normalizeEnumKey(raw);

  const cands = new Set<string>();
  const add = (s: string) => {
    const v = String(s || '').trim();
    if (v) cands.add(v);
  };

  add(raw);
  add(norm);
  add(raw.toLowerCase());
  add(norm.toLowerCase());

  add(`Enum_${raw}`);
  add(`Enum_${norm}`);
  add(`Enum_${raw}`.toLowerCase());
  add(`Enum_${norm}`.toLowerCase());

  if (!raw.startsWith('Player')) {
    add(`Player${raw}`);
    add(`Player${norm}`);
    add(`Player${raw}`.toLowerCase());
    add(`Player${norm}`.toLowerCase());
  }

  // Known naming drift: Portal docs selection list is "RestrictedInputs", while
  // some block outputs/tooling historically called it "InputRestrictions".
  if (norm === 'InputRestrictions') {
    add('RestrictedInputs');
    add('RestrictedInputs'.toLowerCase());
    add('Enum_RestrictedInputs');
    add('Enum_RestrictedInputs'.toLowerCase());
  }
  if (norm === 'RestrictedInputs') {
    add('InputRestrictions');
    add('InputRestrictions'.toLowerCase());
    add('Enum_InputRestrictions');
    add('Enum_InputRestrictions'.toLowerCase());
  }

  return Array.from(cands);
}

function lookupSelectionList(enumName: string): string[] | null {
  const map = cache.map || {};
  for (const key of getCandidateEnumKeys(enumName)) {
    const values = (map as any)[key];
    if (Array.isArray(values) && values.length > 0) return values;
  }
  return null;
}

export function registerSelectionListExtensions(): void {
  // Avoid double registration during HMR/dev.
  if ((Blockly as any).__bf6_selection_lists_registered) return;
  (Blockly as any).__bf6_selection_lists_registered = true;

  Blockly.Extensions.register('bf6_selection_list_dropdown', function(this: Blockly.Block) {
    // All selection list dropdown blocks are the same *kind* of thing (enum selector).
    // Give them a consistent, neutral-ish colour so they visually group together.
    try {
      (this as any).setColour?.('#4CAF50');
    } catch {
      // ignore
    }

    const field = this.getField('OPTION') as any;
    if (!field) return;

    // Make dropdown options dynamic so we don't embed huge arrays into block JSON.
    // Blockly FieldDropdown reads `menuGenerator_` (array or function).
    field.menuGenerator_ = () => {
      const enumName = getEnumNameFromBlock(this);
      if (!enumName) return [['(missing output type)', '__missing__']];

      const values = lookupEnumValues(enumName);
      if (!values || values.length === 0) {
        // Kick off a load if needed (some lists come from file).
        if (!cache.loaded && !cache.loading) void preloadSelectionLists();

        if (cache.lastError) return [[`(selection lists failed to load: ${cache.lastError})`, '__error__']];
        if (!cache.loaded) return [['(loading selection lists...)', '__loading__']];
        return [[`(no selection list: ${enumName})`, '__missing__']];
      }

      // Cache options per enum to reduce UI jank when opening large dropdowns.
      return makeOptionsCached(enumName, values);
    };

    // Ensure there is *some* value set.
    try {
      const cur = String(field.getValue?.() ?? '');
      if (!cur || cur === '__loading__' || cur === '__error__' || cur === '__missing__' || cur === '__empty__') {
        const opts = field.menuGenerator_();
        if (Array.isArray(opts) && opts.length > 0) {
          const v = opts[0][1];
          // Only auto-select when we have a real option, not a placeholder.
          if (v && !String(v).startsWith('__')) field.setValue(v);
        }
      }
    } catch {
      // ignore
    }
  });
}
