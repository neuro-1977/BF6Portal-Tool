import * as Blockly from 'blockly';

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
  lastError?: string;
};

const cache: Cache = {
  loaded: false,
  loading: false,
  map: {},
  mapCI: {},
};

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

export async function preloadSelectionLists(): Promise<void> {
  if (cache.loaded || cache.loading) return;
  cache.loading = true;
  cache.lastError = undefined;
  try {
    // Copied into dist by webpack (see `web_ui/webpack.config.js`).
    // NOTE: Electron packaging excludes *.md by default in this repo, so we ship a
    // `.txt` copy for runtime and fall back to `.md` for dev.
    let md: string | null = null;
    try {
      md = await fetchText('selection-lists.txt');
    } catch {
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
    cache.loaded = true;
  } catch (e: any) {
    cache.lastError = String(e?.message || e);
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
  } catch {
    // ignore
  }

  return null;
}

function makeOptions(values: string[]): [string, string][] {
  return values.map((v) => [v, v]);
}

export function registerSelectionListExtensions(): void {
  // Avoid double registration during HMR/dev.
  if ((Blockly as any).__bf6_selection_lists_registered) return;
  (Blockly as any).__bf6_selection_lists_registered = true;

  Blockly.Extensions.register('bf6_selection_list_dropdown', function(this: Blockly.Block) {
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

      return makeOptions(values);
    };

    // Ensure there is *some* value set.
    try {
      const cur = String(field.getValue?.() ?? '');
      if (!cur || cur === '__loading__' || cur === '__error__' || cur === '__missing__') {
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
