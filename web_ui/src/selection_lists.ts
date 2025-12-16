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
  lastError?: string;
};

const cache: Cache = {
  loaded: false,
  loading: false,
  map: {},
};

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

    // Best-effort: trust widget1 name; fall back to stripping Item suffix
    const key = enumName || (enumNameItem.endsWith('Item') ? enumNameItem.slice(0, -4) : enumNameItem);
    if (key) out[key] = values;
  }

  return out;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
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

      const values = cache.map[enumName];
      if (!values || values.length === 0) {
        // Kick off a load if needed.
        void preloadSelectionLists();

        if (cache.lastError) {
          return [[`(selection lists failed to load: ${cache.lastError})`, '__error__']];
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
