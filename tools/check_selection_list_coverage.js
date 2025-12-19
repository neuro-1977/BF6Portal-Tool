/*
  Smoke-check selection list coverage for Blockly dropdowns.

  This script:
  - Parses `web_ui/dist/selection-lists.txt` (widget 1/widget 2 format)
  - Applies the same aliasing/derived-list logic as `web_ui/src/selection_lists.ts`
  - Extracts all block outputs that use the `bf6_selection_list_dropdown` extension
  - Reports which dropdown enums still resolve to no values

  Usage: node tools/check_selection_list_coverage.js
*/

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const SEL_PATH = path.join(REPO_ROOT, 'web_ui', 'dist', 'selection-lists.txt');
const BLOCKS_PATH = path.join(REPO_ROOT, 'web_ui', 'src', 'blocks', 'bf6portal.ts');

function parseSelectionListsMarkdown(md) {
  const lines = md.split(/\r?\n/);
  const out = {};

  let i = 0;
  while (i < lines.length) {
    const line = (lines[i] || '').trim();
    i++;

    if (!line) continue;
    if (line.toUpperCase() === 'SELECTION LISTS:') continue;

    const enumNameItem = line;

    while (i < lines.length && (lines[i] || '').trim() === '') i++;
    if (i >= lines.length || (lines[i] || '').trim().toLowerCase() !== 'widget 1:') continue;
    i++;

    while (i < lines.length && (lines[i] || '').trim() === '') i++;
    let enumName = i < lines.length ? (lines[i] || '').trim() : '';
    i++;

    if (enumName.endsWith('Item')) enumName = enumName.slice(0, -4);

    while (i < lines.length && (lines[i] || '').trim() === '') i++;
    if (i >= lines.length || (lines[i] || '').trim().toLowerCase() !== 'widget 2:') continue;
    i++;

    const values = [];
    while (i < lines.length) {
      const v = (lines[i] || '').trim();
      if (!v) break;
      values.push(v);
      i++;
    }

    const normalizedEnumNameItem = enumNameItem.endsWith('Item') ? enumNameItem.slice(0, -4) : enumNameItem;
    const key = enumName || normalizedEnumNameItem;
    if (key) out[key] = values;
  }

  return out;
}

const ENUM_ALIASES = {
  DamageTypes: 'PlayerDamageTypes',
  DeathTypes: 'PlayerDeathTypes',
  InputRestrictions: 'RestrictedInputs',
  CustomMessageSlots: 'CustomNotificationSlots',
  PlayerInventorySlots: 'InventorySlots',
  PlayerSoldiers: 'SoldierClass',
  PlayerStateBool: 'SoldierStateBool',
  PlayerStateNumber: 'SoldierStateNumber',
  PlayerStateVector: 'SoldierStateVector',
  InventoryOpenGadgets: 'OpenGadgets',
  Vehicles: 'VehicleList',
  VoiceOvers: 'VoiceOverEvents2D',
  Sounds: 'MusicEvents',
  LocationalSounds: 'MusicEvents',
};

const EXTRA_SELECTION_LISTS = {
  WorldIcons: ['ICON_1', 'ICON_2', 'ICON_3', 'ICON_4', 'ICON_5', 'ICON_6', 'ICON_7', 'ICON_8', 'ICON_9', 'ICON_10'],
  CapturePoints: Array.from({ length: 26 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i)),
  MCOMs: ['A', 'B', 'C', 'D', 'E', 'F'],
  VehicleTypes: ['Airplane', 'Helicopter', 'Light', 'Medium', 'Heavy', 'Stationary'],
};

function ensureDerivedSelectionLists(map) {
  const weapons = map.Weapons;
  if (Array.isArray(weapons) && weapons.length) {
    if (!map.InventoryPrimaryWeapons || map.InventoryPrimaryWeapons.length === 0) {
      map.InventoryPrimaryWeapons = weapons.filter((w) => !String(w).startsWith('Sidearm_'));
    }
    if (!map.InventorySecondaryWeapons || map.InventorySecondaryWeapons.length === 0) {
      map.InventorySecondaryWeapons = weapons.filter((w) => String(w).startsWith('Sidearm_'));
    }
  }

  const gadgets = map.Gadgets;
  if (Array.isArray(gadgets) && gadgets.length) {
    if (!map.InventoryThrowables || map.InventoryThrowables.length === 0) {
      map.InventoryThrowables = gadgets.filter((g) => String(g).startsWith('Throwable_'));
    }
    if (!map.InventoryMeleeWeapons || map.InventoryMeleeWeapons.length === 0) {
      map.InventoryMeleeWeapons = gadgets.filter((g) => String(g).startsWith('Melee_'));
    }
    if (!map.InventoryClassGadgets || map.InventoryClassGadgets.length === 0) {
      map.InventoryClassGadgets = gadgets.filter((g) => String(g).startsWith('Class_'));
    }

    if (!map.InventoryCharacterSpecialties || map.InventoryCharacterSpecialties.length === 0) {
      map.InventoryCharacterSpecialties =
        (map.InventoryClassGadgets && map.InventoryClassGadgets.length ? map.InventoryClassGadgets : gadgets.filter((g) => String(g).startsWith('Class_')));
    }

    if (!map.MedGadgetTypes || map.MedGadgetTypes.length === 0) {
      const preferred = ['Misc_Defibrillator', 'Class_Supply_Bag', 'Class_Adrenaline_Injector'];
      const set = new Set(preferred);
      const derived = gadgets.filter((g) => set.has(String(g)));
      map.MedGadgetTypes = derived.length ? derived : preferred;
    }
  }
}

function lookupEnumValues(map, enumName) {
  if (map[enumName] && map[enumName].length) return map[enumName];

  const alias = ENUM_ALIASES[enumName];
  if (alias && map[alias] && map[alias].length) return map[alias];

  const lc = enumName.toLowerCase();
  for (const k of Object.keys(map)) {
    if (k.toLowerCase() === lc && map[k] && map[k].length) return map[k];
  }

  if (alias) {
    const alc = alias.toLowerCase();
    for (const k of Object.keys(map)) {
      if (k.toLowerCase() === alc && map[k] && map[k].length) return map[k];
    }
  }

  return null;
}

function main() {
  if (!fs.existsSync(SEL_PATH)) {
    console.error(`Missing ${SEL_PATH}. Run web_ui build first.`);
    process.exitCode = 2;
    return;
  }
  if (!fs.existsSync(BLOCKS_PATH)) {
    console.error(`Missing ${BLOCKS_PATH}.`);
    process.exitCode = 2;
    return;
  }

  const md = fs.readFileSync(SEL_PATH, 'utf8');
  const map = parseSelectionListsMarkdown(md);

  for (const [k, v] of Object.entries(EXTRA_SELECTION_LISTS)) {
    if (!map[k] || map[k].length === 0) map[k] = v;
  }
  ensureDerivedSelectionLists(map);

  const src = fs.readFileSync(BLOCKS_PATH, 'utf8');
  // `bf6portal.ts` is generated as one JSON object per line; keep extraction simple and fast.
  const outputs = [];
  for (const line of src.split(/\r?\n/)) {
    if (!line.includes('"bf6_selection_list_dropdown"')) continue;
    const m = line.match(/\"output\"\s*:\s*\"([^\"]+)\"/);
    if (m) outputs.push(m[1]);
  }

  const enumNames = [...new Set(outputs.map((o) => (o.endsWith('Item') ? o.slice(0, -4) : o)))].sort();

  const missing = [];
  for (const e of enumNames) {
    const values = lookupEnumValues(map, e);
    if (!values || values.length === 0) missing.push(e);
  }

  console.log(`Dropdown enums found: ${enumNames.length}`);
  console.log(`Dropdown enums missing values: ${missing.length}`);
  if (missing.length) {
    console.log(missing.join(', '));
    process.exitCode = 1;
  }
}

main();
