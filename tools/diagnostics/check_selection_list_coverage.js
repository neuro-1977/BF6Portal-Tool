/*
  Diagnostics: Selection list dropdown coverage

  This script helps verify that blocks using the bf6_selection_list_dropdown extension
  can be resolved against the selection lists dataset (selection-lists.md).

  It does NOT modify project files.

  Usage (from repo root):
    node tools/diagnostics/check_selection_list_coverage.js
*/

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

// Keep these in sync with `web_ui/src/selection_lists.ts`.
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

function parseSelectionListsMarkdown(md) {
  const lines = md.split(/\r?\n/);
  const out = {};

  let i = 0;
  while (i < lines.length) {
    const line = String(lines[i] || '').trim();
    i++;

    if (!line) continue;
    if (line.toUpperCase() === 'SELECTION LISTS:') continue;

    const enumNameItem = line;

    // Seek widget 1
    while (i < lines.length && String(lines[i] || '').trim() === '') i++;
    if (i >= lines.length || String(lines[i] || '').trim().toLowerCase() !== 'widget 1:') continue;
    i++;

    while (i < lines.length && String(lines[i] || '').trim() === '') i++;
    let enumName = i < lines.length ? String(lines[i] || '').trim() : '';
    i++;

    if (enumName.endsWith('Item')) enumName = enumName.slice(0, -4);

    // Seek widget 2
    while (i < lines.length && String(lines[i] || '').trim() === '') i++;
    if (i >= lines.length || String(lines[i] || '').trim().toLowerCase() !== 'widget 2:') continue;
    i++;

    const values = [];
    while (i < lines.length) {
      const v = String(lines[i] || '').trim();
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

function resolvesSelectionList(map, enumName) {
  if (!enumName) return false;

  const extra = EXTRA_SELECTION_LISTS[enumName];
  if (Array.isArray(extra) && extra.length) return true;

  if (Array.isArray(map[enumName]) && map[enumName].length) return true;

  const alias = ENUM_ALIASES[enumName];
  if (alias && Array.isArray(map[alias]) && map[alias].length) return true;

  // Case-insensitive fallback.
  const lower = Object.create(null);
  for (const k of Object.keys(map)) lower[String(k).toLowerCase()] = k;
  const directCI = lower[String(enumName).toLowerCase()];
  if (directCI && Array.isArray(map[directCI]) && map[directCI].length) return true;

  if (alias) {
    const aliasCI = lower[String(alias).toLowerCase()];
    if (aliasCI && Array.isArray(map[aliasCI]) && map[aliasCI].length) return true;
    const extraAlias = EXTRA_SELECTION_LISTS[alias];
    if (Array.isArray(extraAlias) && extraAlias.length) return true;
  }

  return false;
}

function extractSelectionListBlockOutputsFromBlockFileText(text) {
  // We only need outputs for blocks that declare the selection list extension.
  // This is a best-effort, line-based extraction (these block defs are single-line JSON objects in TS).
  const re = /\{[^\n]*?"extensions"\s*:\s*\[\s*"bf6_selection_list_dropdown"\s*\][^\n]*?\}/g;
  const outputs = new Set();
  let m;
  while ((m = re.exec(text))) {
    const obj = m[0];
    const out = obj.match(/"output"\s*:\s*"([^"]+)"/);
    if (out && out[1]) outputs.add(out[1]);
  }
  return outputs;
}

function main() {
  const mdPath = path.join(ROOT, 'selection-lists.md');
  const md = fs.readFileSync(mdPath, 'utf8');
  const map = parseSelectionListsMarkdown(md);
  const enumKeys = new Set(Object.keys(map));

  const blockFiles = [
    path.join(ROOT, 'web_ui', 'src', 'blocks', 'bf6portal.ts'),
    path.join(ROOT, 'web_ui', 'src', 'blocks', 'bf6portal_expanded.ts'),
    path.join(ROOT, 'web_ui', 'src', 'blocks', 'generated.ts'),
  ].filter((p) => fs.existsSync(p));

  const outTypes = new Set();
  for (const p of blockFiles) {
    const txt = fs.readFileSync(p, 'utf8');
    for (const t of extractSelectionListBlockOutputsFromBlockFileText(txt)) outTypes.add(t);
  }

  const unknown = [];
  for (const t of outTypes) {
    const enumName = t.endsWith('Item') ? t.slice(0, -4) : t;
    if (enumKeys.has(enumName)) continue;
    if (resolvesSelectionList(map, enumName)) continue;
    unknown.push({ output: t, enumName });
  }

  unknown.sort((a, b) => a.enumName.localeCompare(b.enumName));

  console.log('--- Selection list coverage diagnostics ---');
  console.log('Repo root:', ROOT);
  console.log('Selection list enums parsed:', enumKeys.size);
  console.log('Selection-list dropdown block output types:', outTypes.size);
  console.log('Unmatched outputs (no direct enum match in selection-lists.md):', unknown.length);

  if (unknown.length) {
    for (const u of unknown) {
      console.log(`- ${u.enumName} (from ${u.output})`);
    }
  }
}

main();
