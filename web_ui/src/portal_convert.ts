import * as Blockly from 'blockly';

import { normalizeWorkspaceState } from './portal_json';

type PortalSpec = { valueInputs: string[]; statementInputs: string[] };

let portalTypeByLower: Map<string, string> | null = null;
let portalSpecsByType: Map<string, PortalSpec> | null = null;
let internalShapesByType: Map<string, PortalSpec> | null = null;

const PORTAL_TYPE_EXPORT_OVERRIDES: Record<string, string> = {
  // Structural blocks: tool-internal -> portal/community
  MOD_BLOCK: 'modBlock',
  RULE_HEADER: 'ruleBlock',
  CONDITION_BLOCK: 'conditionBlock',
  condition: 'conditionBlock',
  SUBROUTINE_BLOCK: 'subroutineBlock',
  CALLSUBROUTINE: 'subroutineInstanceBlock',
};

type InternalSubParam = { name?: any; type?: any; types?: any };
type PortalSubParam = { name: string; types: string };

function getFieldString(blockObj: any, fieldName: string): string {
  try {
    const v = blockObj?.fields?.[fieldName];
    return typeof v === 'string' ? v : String(v ?? '').trim();
  } catch {
    return '';
  }
}

function normalizePortalSubParams(params: any): PortalSubParam[] {
  const arr = Array.isArray(params) ? params : [];
  const out: PortalSubParam[] = [];
  for (const p of arr) {
    try {
      const pi: InternalSubParam = (p && typeof p === 'object') ? (p as any) : { name: String(p ?? ''), type: '' };
      const name = String(pi.name ?? '').trim();
      const tRaw = (pi.types != null) ? pi.types : pi.type;
      const types = String(tRaw ?? '').trim();
      if (!name) continue;
      out.push({ name, types: types || 'Any' });
    } catch {
      // ignore
    }
  }
  return out;
}

function extractSubroutineParamsForPortal(blockObj: any): PortalSubParam[] {
  // Priority:
  // 1) Portal-style (parameters)
  // 2) Tool internal JSON mutator state (params)
  // 3) Legacy "mutation"/string shapes (best-effort)
  try {
    const es = blockObj?.extraState;
    if (es && typeof es === 'object') {
      if (Array.isArray((es as any).parameters)) {
        return normalizePortalSubParams((es as any).parameters);
      }
      if (Array.isArray((es as any).params)) {
        return normalizePortalSubParams((es as any).params);
      }
    }
  } catch {
    // ignore
  }

  try {
    const mut = (blockObj as any)?.mutation;
    const raw = mut && typeof mut === 'object' ? (mut as any).params : null;
    if (Array.isArray(raw)) return normalizePortalSubParams(raw);
    if (typeof raw === 'string' && raw.trim()) {
      try {
        const parsed = JSON.parse(raw);
        return normalizePortalSubParams(parsed);
      } catch {
        // ignore
      }
    }
  } catch {
    // ignore
  }

  return [];
}

function renameCallSubroutineArgsToPortal(inputsObj: any): any {
  if (!inputsObj || typeof inputsObj !== 'object') return inputsObj;
  const out: any = { ...inputsObj };
  for (const k of Object.keys(out)) {
    const m = /^ARG_(\d+)$/.exec(k);
    if (!m) continue;
    const idx = m[1];
    const to = `PARAM-${idx}`;
    if (Object.prototype.hasOwnProperty.call(out, to)) continue;
    out[to] = out[k];
    delete out[k];
  }
  return out;
}

function deepCloneJson<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

async function loadJsonAsset(url: string): Promise<any> {
  // 1) Prefer fetch in normal web contexts.
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    // 2) Electron/file:// fallback: use Node fs.
    try {
      const req = (window as any)?.require;
      if (!req) throw e;
      const fs = req('fs');
      const urlMod = req('url');

      const fileURLToPath = urlMod?.fileURLToPath;
      if (typeof fileURLToPath !== 'function') throw e;

      const fileUrl = new URL(url, window.location.href);
      const filePath = fileURLToPath(fileUrl);
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    } catch (e2) {
      throw e2;
    }
  }
}

function buildPortalSpecsFromDocsArray(arr: any[]): Map<string, PortalSpec> {
  // Build a compact map: portalType -> { valueInputs: [names], statementInputs: [names] }
  // using bf6portal_blocks.json (args_json).
  const specs = new Map<string, PortalSpec>();
  if (!Array.isArray(arr)) return specs;

  for (const item of arr) {
    try {
      const name = item?.name;
      if (typeof name !== 'string' || !name.trim()) continue;
      const portalType = name.trim().split(/\s+/)[0];
      if (!portalType) continue;

      let args: any[] = [];
      if (typeof item.args_json === 'string' && item.args_json.trim()) {
        try {
          args = JSON.parse(item.args_json);
        } catch {
          args = [];
        }
      }

      const valueInputs: string[] = [];
      const statementInputs: string[] = [];
      if (Array.isArray(args)) {
        for (const a of args) {
          if (!a || typeof a !== 'object') continue;
          const at = String(a.type || '');
          const an = String(a.name || '');
          if (!an) continue;
          if (at === 'input_value') valueInputs.push(an);
          if (at === 'input_statement') statementInputs.push(an);
        }
      }

      // Prefer the spec with the most information.
      const prev = specs.get(portalType);
      if (!prev || (valueInputs.length + statementInputs.length) > (prev.valueInputs.length + prev.statementInputs.length)) {
        specs.set(portalType, { valueInputs, statementInputs });
      }
    } catch {
      // ignore
    }
  }

  return specs;
}

async function ensurePortalSpecsLoaded(): Promise<void> {
  if (portalSpecsByType && portalTypeByLower) return;

  const arr = await loadJsonAsset('bf6portal_blocks.json');
  const specs = buildPortalSpecsFromDocsArray(Array.isArray(arr) ? arr : []);

  const byLower = new Map<string, string>();
  for (const portalType of specs.keys()) {
    byLower.set(portalType.toLowerCase(), portalType);
  }

  portalSpecsByType = specs;
  portalTypeByLower = byLower;
}

function ensureInternalShapeCache(): void {
  if (!internalShapesByType) internalShapesByType = new Map();
}

function getPortalSpec(portalType: string): PortalSpec | null {
  try {
    return (portalSpecsByType && portalType) ? (portalSpecsByType.get(portalType) || null) : null;
  } catch {
    return null;
  }
}

function getInternalShape(type: string): PortalSpec {
  ensureInternalShapeCache();
  const cache = internalShapesByType!;

  if (cache.has(type)) return cache.get(type)!;

  const empty: PortalSpec = { valueInputs: [], statementInputs: [] };
  cache.set(type, empty);

  try {
    const WsCtor: any = (Blockly as any).Workspace;
    if (typeof WsCtor !== 'function') return empty;

    const ws = new WsCtor();
    const block = (ws as any).newBlock?.(type);
    if (!block) {
      try { (ws as any).dispose?.(); } catch { /* ignore */ }
      return empty;
    }

    // Blockly input type numeric constants: VALUE=1, STATEMENT=2, DUMMY=3.
    const inputTypes: any = (Blockly as any).inputTypes || { VALUE: 1, STATEMENT: 2 };

    const valueInputs: string[] = [];
    const statementInputs: string[] = [];

    const inputs: any[] = Array.isArray((block as any).inputList) ? (block as any).inputList : [];
    for (const inp of inputs) {
      try {
        if (!inp || !inp.name) continue;
        if (inp.type === inputTypes.VALUE) valueInputs.push(inp.name);
        else if (inp.type === inputTypes.STATEMENT) statementInputs.push(inp.name);
      } catch {
        // ignore
      }
    }

    try { (block as any).dispose?.(false); } catch { /* ignore */ }
    try { (ws as any).dispose?.(); } catch { /* ignore */ }

    const shape: PortalSpec = { valueInputs, statementInputs };
    cache.set(type, shape);
    return shape;
  } catch {
    return empty;
  }
}

function resolvePortalTypeFromInternalType(internalType: string): string {
  const t = String(internalType || '').trim();
  if (!t) return t;

  if (Object.prototype.hasOwnProperty.call(PORTAL_TYPE_EXPORT_OVERRIDES, t)) {
    return PORTAL_TYPE_EXPORT_OVERRIDES[t];
  }

  // Map by case-insensitive match against Portal docs.
  const candidate = (() => {
    try {
      const byLower = portalTypeByLower;
      if (byLower) {
        return byLower.get(t.toLowerCase()) || t;
      }
      return t;
    } catch {
      return t;
    }
  })();

  // Safety: only convert type names when the block's input arity looks compatible
  // with the Portal spec.
  try {
    if (candidate && candidate !== t) {
      const spec = getPortalSpec(candidate);
      if (spec) {
        const internalShape = getInternalShape(t);
        const want = (spec.valueInputs.length || 0) + (spec.statementInputs.length || 0);
        const have = (internalShape.valueInputs.length || 0) + (internalShape.statementInputs.length || 0);
        if (want > 0 && have !== want) return t;
      }
    }
  } catch {
    // ignore
  }

  return candidate || t;
}

function remapInputsByPosition(inputsObj: any, fromNames: string[], toNames: string[]): any {
  // Rename input keys in `inputsObj` based on positional mapping.
  // Only renames existing keys; leaves extra keys untouched.
  if (!inputsObj || typeof inputsObj !== 'object') return inputsObj;
  if (!Array.isArray(fromNames) || !Array.isArray(toNames)) return inputsObj;

  const out: any = { ...inputsObj };
  const n = Math.min(fromNames.length, toNames.length);
  for (let i = 0; i < n; i++) {
    const from = fromNames[i];
    const to = toNames[i];
    if (!from || !to || from === to) continue;
    if (!Object.prototype.hasOwnProperty.call(out, from)) continue;
    if (Object.prototype.hasOwnProperty.call(out, to)) continue;
    out[to] = out[from];
    delete out[from];
  }
  return out;
}

function convertBlockTreeInternalToPortal(blockObj: any): any {
  if (!blockObj || typeof blockObj !== 'object') return blockObj;

  const internalType = String(blockObj.type || '');
  const portalType = resolvePortalTypeFromInternalType(internalType);

  // Convert children first.
  if (blockObj.inputs && typeof blockObj.inputs === 'object') {
    const newInputs: any = {};
    for (const [k, v] of Object.entries(blockObj.inputs)) {
      if (v && typeof v === 'object' && (v as any).block) {
        newInputs[k] = { ...(v as any), block: convertBlockTreeInternalToPortal((v as any).block) };
      } else {
        newInputs[k] = v;
      }
    }
    blockObj = { ...blockObj, inputs: newInputs };
  }
  if (blockObj.next && blockObj.next.block) {
    blockObj = { ...blockObj, next: { ...blockObj.next, block: convertBlockTreeInternalToPortal(blockObj.next.block) } };
  }

  // Structural field remaps.
  if (internalType === 'RULE_HEADER' && blockObj.fields && typeof blockObj.fields === 'object') {
    const f: any = { ...blockObj.fields };
    if (Object.prototype.hasOwnProperty.call(f, 'RULE_NAME') && !Object.prototype.hasOwnProperty.call(f, 'NAME')) {
      f.NAME = f.RULE_NAME;
      delete f.RULE_NAME;
    }
    if (Object.prototype.hasOwnProperty.call(f, 'EVENT_TYPE') && !Object.prototype.hasOwnProperty.call(f, 'EVENTTYPE')) {
      f.EVENTTYPE = f.EVENT_TYPE;
      delete f.EVENT_TYPE;
    }
    // Some builds used SCOPE instead of SCOPE_TYPE.
    if (Object.prototype.hasOwnProperty.call(f, 'SCOPE') && !Object.prototype.hasOwnProperty.call(f, 'OBJECTTYPE')) {
      f.OBJECTTYPE = f.SCOPE;
      delete f.SCOPE;
    }
    if (Object.prototype.hasOwnProperty.call(f, 'SCOPE_TYPE') && !Object.prototype.hasOwnProperty.call(f, 'OBJECTTYPE')) {
      f.OBJECTTYPE = f.SCOPE_TYPE;
      delete f.SCOPE_TYPE;
    }
    blockObj = { ...blockObj, fields: f };
  }

  // Portal metadata synthesis for structural blocks that require `extraState`.
  // (The official editor is strict about these fields.)
  try {
    if (internalType === 'SUBROUTINE_BLOCK') {
      const subName = getFieldString(blockObj, 'SUBROUTINE_NAME') || getFieldString(blockObj, 'SUBROUTINE') || '';
      const params = extractSubroutineParamsForPortal(blockObj);
      const existing = (blockObj as any).extraState;
      const extra: any = (existing && typeof existing === 'object') ? { ...existing } : {};
      if (subName && typeof extra.subroutineName !== 'string') extra.subroutineName = subName;
      if (!Array.isArray(extra.parameters) || extra.parameters.length === 0) extra.parameters = params;
      blockObj = { ...blockObj, extraState: extra };
    }

    if (internalType === 'CALLSUBROUTINE') {
      const subName = getFieldString(blockObj, 'SUBROUTINE_NAME') || getFieldString(blockObj, 'SUBROUTINE') || '';
      const params = extractSubroutineParamsForPortal(blockObj);
      const existing = (blockObj as any).extraState;
      const extra: any = (existing && typeof existing === 'object') ? { ...existing } : {};
      if (subName && typeof extra.subroutineName !== 'string') extra.subroutineName = subName;
      if (!Array.isArray(extra.parameters) || extra.parameters.length === 0) extra.parameters = params;

      // CALLSUBROUTINE uses dynamic ARG_n inputs; remap those explicitly to Portal's PARAM-n.
      if (blockObj.inputs && typeof blockObj.inputs === 'object') {
        blockObj = { ...blockObj, inputs: renameCallSubroutineArgsToPortal(blockObj.inputs) };
      }

      blockObj = { ...blockObj, extraState: extra };
    }

    if (internalType === 'RULE_HEADER') {
      const existing = (blockObj as any).extraState;
      if (!existing || typeof existing !== 'object') {
        // Best-effort: default to false when not present.
        blockObj = { ...blockObj, extraState: { isOngoingEvent: false } };
      }
    }
  } catch {
    // ignore
  }

  // Input renames based on portal spec + internal shape.
  try {
    if (portalType !== internalType && blockObj.inputs && typeof blockObj.inputs === 'object') {
      const spec = getPortalSpec(portalType);
      if (spec) {
        const internalShape = getInternalShape(internalType);
        const remapped = remapInputsByPosition(blockObj.inputs, internalShape.valueInputs, spec.valueInputs);
        const remapped2 = remapInputsByPosition(remapped, internalShape.statementInputs, spec.statementInputs);
        blockObj = { ...blockObj, inputs: remapped2 };
      }
    }
  } catch {
    // ignore
  }

  if (portalType && portalType !== internalType) {
    blockObj = { ...blockObj, type: portalType };
  }

  return blockObj;
}

function collectBlockTypesFromState(state: any): Set<string> {
  const out = new Set<string>();

  const visit = (b: any) => {
    if (!b || typeof b !== 'object') return;
    if (typeof b.type === 'string') out.add(b.type);

    if (b.next && b.next.block) visit(b.next.block);
    if (b.inputs && typeof b.inputs === 'object') {
      for (const k of Object.keys(b.inputs)) {
        const inp = b.inputs[k];
        if (inp && inp.block) visit(inp.block);
        if (inp && inp.shadow) visit(inp.shadow);
      }
    }

    if (Array.isArray(b.blocks)) {
      for (const child of b.blocks) visit(child);
    }
  };

  const blocksRoot = state?.blocks;
  if (blocksRoot && typeof blocksRoot === 'object' && Array.isArray(blocksRoot.blocks)) {
    for (const top of blocksRoot.blocks) visit(top);
  } else if (Array.isArray(state?.blocks)) {
    for (const top of state.blocks) visit(top);
  }

  return out;
}

export function describePortalExportUnknownTypes(state: any): string | null {
  const types = collectBlockTypesFromState(state);
  if (types.size === 0) return null;

  // Types known in Portal docs (function blocks) + structural wrappers.
  const known = new Set<string>();
  try {
    for (const t of portalSpecsByType?.keys?.() || []) known.add(t);
  } catch {
    // ignore
  }

  for (const t of Object.values(PORTAL_TYPE_EXPORT_OVERRIDES)) known.add(t);

  const missing: string[] = [];
  for (const t of types) {
    if (!known.has(t)) missing.push(t);
  }

  if (missing.length === 0) return null;

  missing.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  const sample = missing.slice(0, 30);
  const more = missing.length > sample.length ? ` (+${missing.length - sample.length} more)` : '';
  return `Unknown/unsupported Portal block types (${missing.length}):\n- ${sample.join('\n- ')}${more}`;
}

/**
 * Converts this tool's internal Blockly workspace serialization into a more
 * Portal/community-compatible shape.
 *
 * - Converts block types to Portal type strings (case-sensitive)
 * - Remaps RULE_HEADER fields to Portal schema
 * - Renames inputs by position (internal shape -> Portal spec)
 */
export async function convertWorkspaceStateInternalToPortal(state: any): Promise<any> {
  await ensurePortalSpecsLoaded();

  const s = normalizeWorkspaceState(deepCloneJson(state));
  const blocksArr = s?.blocks?.blocks;
  if (s?.blocks && Array.isArray(blocksArr)) {
    s.blocks.blocks = blocksArr.map((b: any) => convertBlockTreeInternalToPortal(b));
  }

  return s;
}
