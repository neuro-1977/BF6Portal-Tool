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
  lastError?: string;
};

const cache: Cache = {
  loaded: false,
  loading: false,
  map: {},
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

  const names = getCanonicalEnumNamesFromMap(cache.map);
  for (const enumName of names) {
    const blockType = `${SELECTION_LIST_BLOCK_PREFIX}${enumName}`;

    if ((Blockly as any).Blocks && Object.prototype.hasOwnProperty.call((Blockly as any).Blocks, blockType)) {
      continue;
    }

    (Blockly as any).Blocks[blockType] = {
      init: function () {
        // Dropdown (options are provided dynamically by the extension).
        this.appendDummyInput()
          .appendField(enumName)
          .appendField(new (Blockly as any).FieldDropdown([["(loading selection lists...)", "__loading__"]]), 'OPTION');

        // Allow connections to both EnumName and EnumNameItem, since different
        // block sets use different naming conventions.
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

    // Generator: treat selection values as string constants for the preview.
    (javascriptGenerator.forBlock as any)[blockType] = function (block: any, generator: any) {
      const value = String(block.getFieldValue('OPTION') || '');
      return [generator.quote_(value), Order.ATOMIC];
    };
  }
}

function addEnumKeys(out: SelectionListMap, rawKey: string, values: string[]): void {
  const k1 = String(rawKey || '').trim();
  const k2 = normalizeEnumKey(k1);

  // Some sources use EnumNameItem, others use EnumName. Index both.
  // Prefer the first non-empty assignment to avoid accidental overwrites.
  if (k1 && (!out[k1] || out[k1].length === 0)) out[k1] = values;
  if (k2 && (!out[k2] || out[k2].length === 0)) out[k2] = values;
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
    const enumName = (i < lines.length ? (lines[i] || '').trim() : '');
    i++;

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

    // Some versions of selection-lists.md have widget1 including the Item suffix,
    // others do not. Also, the header line may differ. Index all known forms.
    const primary = enumName || '';
    const fallback = enumNameItem || '';

    if (primary) addEnumKeys(out, primary, values);
    if (fallback) addEnumKeys(out, fallback, values);
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
    cache.loaded = true;
    // After loading, register helper enum blocks so the toolbox can expose
    // *all* selection lists (even if the main block set doesn't have dedicated
    // dropdown blocks for each).
    try {
      registerSelectionListEnumBlocks();
    } catch (e) {
      console.warn('[BF6] Failed to register selection list enum blocks:', e);
    }
  } catch (e: any) {
    cache.lastError = String(e?.message || e);
  } finally {
    cache.loading = false;
  }
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

      const values = lookupSelectionList(enumName);
      if (!values || values.length === 0) {
        // Kick off a load if needed.
        if (!cache.loaded && !cache.loading) {
          void preloadSelectionLists();
        }

        if (cache.lastError) {
          return [[`(selection lists failed to load: ${cache.lastError})`, '__error__']];
        }

        // If we already loaded the data but *this* enum key is missing, don't show
        // an infinite "loading" placeholder—surface a real hint.
        if (cache.loaded) {
          return [[`(no selection list for: ${enumName})`, '__empty__']];
        }

        return [['(loading selection lists...)', '__loading__']];
      }

      return makeOptions(values);
    };

    // Ensure there is *some* value set.
    try {
      const cur = String(field.getValue?.() ?? '');
      if (!cur || cur === '__loading__' || cur === '__error__' || cur === '__missing__') {
        const opts = field.menuGenerator_();
        if (Array.isArray(opts) && opts.length > 0) {
          field.setValue(opts[0][1]);
        }
      }
    } catch {
      // ignore
    }
  });
}
