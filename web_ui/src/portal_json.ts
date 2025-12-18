import * as Blockly from 'blockly';

/**
 * Portal-compatible JSON export/import helpers.
 *
 * The official Portal editor (and common community exports) use a different
 * block schema than this tool's internal blocks (e.g. `WAIT` vs `Wait`,
 * `SECONDS` vs `VALUE-0`, structural `MOD_BLOCK` vs `modBlock`, etc.).
 *
 * This module provides best-effort, bidirectional conversion:
 * - Internal workspace state -> Portal/community state (wrapped as `{ mod: ... }`).
 * - Portal/community state -> internal state for round-trip editing.
 */

export type AnyWorkspaceState = any;

type PortalSpec = {
	valueInputs: string[];
	statementInputs: string[];
};

type BlockShape = {
	valueInputs: string[];
	statementInputs: string[];
};

type PortalDocsEntry = {
	block_id?: string;
	name?: string;
	args_json?: string;
};

const PORTAL_PRESET_URL = 'presets/custom_conquest_template_V8.0.json';
const PORTAL_DOCS_URL = 'bf6portal_blocks.json';

const INTERNAL_TO_PORTAL_TYPE_OVERRIDES: Record<string, string> = {
	MOD_BLOCK: 'modBlock',
	RULE_HEADER: 'ruleBlock',
	SUBROUTINE_BLOCK: 'subroutineBlock',
	// This internal block is a call-site; Portal uses `subroutineInstanceBlock`.
	CALLSUBROUTINE: 'subroutineInstanceBlock',
};

const PORTAL_TO_INTERNAL_TYPE_OVERRIDES: Record<string, string> = {
	modBlock: 'MOD_BLOCK',
	ruleBlock: 'RULE_HEADER',
	subroutineBlock: 'SUBROUTINE_BLOCK',
	subroutineInstanceBlock: 'CALLSUBROUTINE',
};

// Some internal blocks are "Portal-ish" but differ only by casing.
const TYPE_NAME_EXPORT_OVERRIDES: Record<string, string> = {
	WAIT: 'Wait',
	WAITUNTIL: 'WaitUntil',
	ABORT: 'Abort',
	BREAK: 'Break',
	CONTINUE: 'Continue',
	IF: 'If',
	WHILE: 'While',
	// Expanded/internal control blocks in this build.
	BREAK_BLOCK: 'Break',
	CONTINUE_BLOCK: 'Continue',
	IF_BLOCK: 'If',
	WHILE_BLOCK: 'While',
	BOOLEAN: 'Boolean',
	NUMBER: 'Number',
	STRING: 'String',
	SETVARIABLE: 'SetVariable',
	GETVARIABLE: 'GetVariable',
};

const TYPE_NAME_IMPORT_OVERRIDES: Record<string, string> = {
	Wait: 'WAIT',
	WaitUntil: 'WAITUNTIL',
	Abort: 'ABORT',
	Break: 'BREAK_BLOCK',
	Continue: 'CONTINUE_BLOCK',
	If: 'IF_BLOCK',
	While: 'WHILE_BLOCK',
	Boolean: 'BOOLEAN',
	Number: 'NUMBER',
	String: 'STRING',
	SetVariable: 'SETVARIABLE',
	GetVariable: 'GETVARIABLE',
};

function extractMutatorParams(blockObj: any): Array<{ name?: string; type?: string }> {
	const candidates: any[] = [];

	if (blockObj && typeof blockObj === 'object') {
		if (blockObj.extraState && typeof blockObj.extraState === 'object') {
			candidates.push((blockObj.extraState as any).params);
			candidates.push((blockObj.extraState as any).PARAMS);
		}
		if (blockObj.mutation && typeof blockObj.mutation === 'object') {
			candidates.push((blockObj.mutation as any).params);
			candidates.push((blockObj.mutation as any).PARAMS);
		}
	}

	for (const c of candidates) {
		if (!c) continue;
		if (Array.isArray(c)) {
			return c.filter((x) => x && typeof x === 'object');
		}
		if (typeof c === 'string') {
			try {
				const parsed = JSON.parse(c);
				if (Array.isArray(parsed)) return parsed.filter((x) => x && typeof x === 'object');
			} catch {
				// ignore
			}
		}
	}

	return [];
}

function toPortalParameters(params: Array<{ name?: string; type?: string }>): Array<{ types: string; name: string }> {
	const out: Array<{ types: string; name: string }> = [];
	for (let i = 0; i < params.length; i++) {
		const p = params[i] || {};
		const name = safeString((p as any).name || `Param${i}`);
		const types = safeString((p as any).type || 'Any');
		out.push({ types, name });
	}
	return out;
}

let specsLoaded = false;

// Portal schema lookups
const portalSpecByType = new Map<string, PortalSpec>();
const portalTypeByLower = new Map<string, string>();
const portalTypeByBlockId = new Map<string, string>();
const blockIdByPortalType = new Map<string, string>();

// Internal shape cache
const internalShapeByType = new Map<string, BlockShape>();

// Dropdown label/value mapping cache: `${type}::${fieldName}::${value}` -> label
const dropdownLabelCache = new Map<string, string>();
const dropdownValueCache = new Map<string, string>();

function safeString(x: any): string {
	return typeof x === 'string' ? x : String(x ?? '');
}

function deepClone<T>(x: T): T {
	return x && typeof x === 'object' ? (JSON.parse(JSON.stringify(x)) as T) : x;
}

async function fetchText(url: string): Promise<string> {
	// Browser/Electron fetch.
	try {
		const res = await fetch(url, { cache: 'no-store' });
		if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
		return await res.text();
	} catch (e) {
		// Electron file:// can be flaky with fetch for local assets. Since this app
		// runs with Node integration enabled, fall back to fs when available.
		const g: any = globalThis as any;
		const req = g?.require;
		if (typeof req !== 'function') throw e;

		const fs = req('fs') as typeof import('fs');
		const path = req('path') as typeof import('path');
		const { fileURLToPath } = req('url') as typeof import('url');

		const assetUrl = new URL(url, window.location.href);
		const assetPath = fileURLToPath(assetUrl);
		return fs.readFileSync(path.resolve(assetPath), 'utf8');
	}
}

async function fetchJson<T>(url: string): Promise<T> {
	const raw = await fetchText(url);
	// Strip BOM if present.
	const txt = raw.replace(/^\uFEFF/, '');
	return JSON.parse(txt) as T;
}

function isStatementInputName(name: string): boolean {
	if (!name) return false;
	if (name === 'RULES' || name === 'ACTIONS' || name === 'CONDITIONS') return true;
	if (/^DO\d*$/.test(name)) return true;
	if (/^ELSE\d*$/.test(name)) return true;
	if (name === 'ELSE' || name === 'THEN' || name === 'STACK' || name === 'BODY') return true;
	return false;
}

function sortPortalValueInputs(names: Iterable<string>): string[] {
	const arr = Array.from(new Set(Array.from(names).filter(Boolean)));
	return arr.sort((a, b) => {
		const ma = /^VALUE-(\d+)$/.exec(a);
		const mb = /^VALUE-(\d+)$/.exec(b);
		if (ma && mb) return Number(ma[1]) - Number(mb[1]);
		if (ma) return -1;
		if (mb) return 1;
		return a.localeCompare(b);
	});
}

function sortPortalStatementInputs(names: Iterable<string>): string[] {
	const order = ['RULES', 'CONDITIONS', 'ACTIONS', 'DO', 'THEN', 'ELSE', 'BODY', 'STACK'];
	const arr = Array.from(new Set(Array.from(names).filter(Boolean)));
	return arr.sort((a, b) => {
		const ia = order.indexOf(a);
		const ib = order.indexOf(b);
		if (ia !== -1 || ib !== -1) return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
		return a.localeCompare(b);
	});
}

function buildPortalSpecsFromPresetState(state: any): void {
	// State is expected to be the *portal* shape: { blocks: { blocks: [...] }, variables: [...] }
	const model = new Map<string, { value: Set<string>; statement: Set<string> }>();

	const ensure = (type: string) => {
		if (!model.has(type)) model.set(type, { value: new Set(), statement: new Set() });
		return model.get(type)!;
	};

	const visit = (block: any) => {
		if (!block || typeof block !== 'object') return;
		const type = safeString(block.type).trim();
		if (!type) return;

		if (!portalTypeByLower.has(type.toLowerCase())) portalTypeByLower.set(type.toLowerCase(), type);

		if (block.inputs && typeof block.inputs === 'object') {
			for (const k of Object.keys(block.inputs)) {
				const input = (block.inputs as any)[k];
				const child = input?.block ?? input?.shadow;
				const isStmt = isStatementInputName(k);
				const info = ensure(type);
				if (isStmt) info.statement.add(k);
				else info.value.add(k);
				if (child) visit(child);
			}
		}

		if (block.next?.block) visit(block.next.block);
	};

	const tops = state?.blocks?.blocks;
	if (Array.isArray(tops)) {
		for (const b of tops) visit(b);
	}

	for (const [type, info] of model.entries()) {
		const spec: PortalSpec = {
			valueInputs: sortPortalValueInputs(info.value),
			statementInputs: sortPortalStatementInputs(info.statement),
		};
		portalSpecByType.set(type, spec);
	}

	// Ensure well-known structural types exist (even if preset/model missed them).
	portalSpecByType.set('modBlock', portalSpecByType.get('modBlock') ?? { valueInputs: [], statementInputs: ['RULES'] });
	portalSpecByType.set('ruleBlock', portalSpecByType.get('ruleBlock') ?? { valueInputs: [], statementInputs: ['CONDITIONS', 'ACTIONS'] });
	portalSpecByType.set('conditionBlock', portalSpecByType.get('conditionBlock') ?? { valueInputs: ['CONDITION'], statementInputs: [] });
	portalSpecByType.set('subroutineBlock', portalSpecByType.get('subroutineBlock') ?? { valueInputs: [], statementInputs: ['CONDITIONS', 'ACTIONS'] });
	portalSpecByType.set('subroutineArgumentBlock', portalSpecByType.get('subroutineArgumentBlock') ?? { valueInputs: [], statementInputs: [] });
}

function portalTypeFromDocsName(name: string): string | null {
	const n = safeString(name).trim();
	if (!n) return null;
	const first = n.split(/\s+/)[0];
	return first || null;
}

function buildPortalSpecsFromDocsArray(docs: PortalDocsEntry[]): void {
	for (const d of docs) {
		const blockId = safeString(d.block_id).trim();
		const portalType = portalTypeFromDocsName(safeString(d.name));
		if (!portalType) continue;

		if (blockId && !portalTypeByBlockId.has(blockId)) portalTypeByBlockId.set(blockId, portalType);
		if (blockId && !blockIdByPortalType.has(portalType)) blockIdByPortalType.set(portalType, blockId);

		if (!portalTypeByLower.has(portalType.toLowerCase())) portalTypeByLower.set(portalType.toLowerCase(), portalType);

		// If we already inferred a spec from the preset, keep it (it's more authoritative).
		if (portalSpecByType.has(portalType)) continue;

		const rawArgs = safeString(d.args_json);
		let args: any[] = [];
		try {
			args = rawArgs ? (JSON.parse(rawArgs) as any[]) : [];
		} catch {
			args = [];
		}

		const valueInputs: string[] = [];
		const statementInputs: string[] = [];

		for (const a of args) {
			const at = safeString(a?.type);
			const an = safeString(a?.name);
			if (!an) continue;
			if (at === 'input_value') valueInputs.push(an);
			else if (at === 'input_statement') statementInputs.push(an);
		}

		portalSpecByType.set(portalType, {
			valueInputs: sortPortalValueInputs(valueInputs),
			statementInputs: sortPortalStatementInputs(statementInputs),
		});
	}
}

function looksLikePortalWrappedExport(obj: any): boolean {
	return !!(obj && typeof obj === 'object' && obj.mod && typeof obj.mod === 'object');
}

function normalizeWorkspaceState(state: any): any {
	// Accept either:
	// - { mod: { blocks, variables } }
	// - { workspace: { blocks, variables } }
	// - { blocks: { blocks: [...] }, variables: [...] }
	if (looksLikePortalWrappedExport(state)) return normalizeWorkspaceState(state.mod);
	if (state && typeof state === 'object' && state.workspace && typeof state.workspace === 'object') return normalizeWorkspaceState(state.workspace);

	// Already workspace-like
	if (state && typeof state === 'object' && state.blocks && typeof state.blocks === 'object') {
		if (!Array.isArray(state.variables)) state.variables = [];
		if (state.blocks && typeof state.blocks === 'object' && !Array.isArray(state.blocks.blocks)) {
			if (Array.isArray((state as any).blocks)) {
				return {
					blocks: { languageVersion: 0, blocks: (state as any).blocks },
					variables: Array.isArray(state.variables) ? state.variables : [],
				};
			}
		}
		return state;
	}

	return { blocks: { languageVersion: 0, blocks: [] }, variables: [] };
}

async function ensureSpecsLoaded(): Promise<void> {
	if (specsLoaded) return;
	specsLoaded = true;

	// 1) Try to infer portal specs from a shipped preset (most authoritative for official Portal JSON).
	try {
		const preset = await fetchJson<any>(PORTAL_PRESET_URL);
		const normalized = normalizeWorkspaceState(preset);
		buildPortalSpecsFromPresetState(normalized);
	} catch (e) {
		console.warn('[BF6] Failed to load portal preset schema sample:', e);
	}

	// 2) Merge in portal docs as a fallback for types not present in the preset.
	try {
		const docs = await fetchJson<PortalDocsEntry[]>(PORTAL_DOCS_URL);
		if (Array.isArray(docs)) buildPortalSpecsFromDocsArray(docs);
	} catch (e) {
		console.warn('[BF6] Failed to load portal docs JSON:', e);
	}
}

function getPortalSpec(portalType: string): PortalSpec | null {
	const t = safeString(portalType).trim();
	if (!t) return null;
	return portalSpecByType.get(t) ?? null;
}

function getInternalShape(type: string): BlockShape {
	const t = safeString(type).trim();
	if (!t) return { valueInputs: [], statementInputs: [] };
	if (internalShapeByType.has(t)) return internalShapeByType.get(t)!;

	const empty: BlockShape = { valueInputs: [], statementInputs: [] };
	internalShapeByType.set(t, empty);

	try {
		const ws = new Blockly.Workspace();
		const block = ws.newBlock(t);

		const valueInputs: string[] = [];
		const statementInputs: string[] = [];

		const inputTypes: any = (Blockly as any).inputTypes;
		for (const inp of (block as any).inputList ?? []) {
			if (!inp?.name) continue;
			if (inputTypes && inp.type === inputTypes.VALUE) valueInputs.push(inp.name);
			else if (inputTypes && inp.type === inputTypes.STATEMENT) statementInputs.push(inp.name);
		}

		try { (block as any).dispose(false); } catch {}
		try { (ws as any).dispose(); } catch {}

		const shape: BlockShape = { valueInputs, statementInputs };
		internalShapeByType.set(t, shape);
		return shape;
	} catch {
		return empty;
	}
}

function remapInputsByPosition(inputsObj: any, fromNames: string[], toNames: string[]): any {
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

function resolvePortalTypeFromInternalType(internalType: string): string {
	const t = safeString(internalType).trim();
	if (!t) return t;
	if (Object.prototype.hasOwnProperty.call(INTERNAL_TO_PORTAL_TYPE_OVERRIDES, t)) return INTERNAL_TO_PORTAL_TYPE_OVERRIDES[t];
	if (Object.prototype.hasOwnProperty.call(TYPE_NAME_EXPORT_OVERRIDES, t)) return TYPE_NAME_EXPORT_OVERRIDES[t];

	// If it's a block-id (snake_case) known by docs, map it.
	const byId = portalTypeByBlockId.get(t);
	if (byId) return byId;

	// Case-insensitive match against known portal type names.
	const lowerMatch = portalTypeByLower.get(t.toLowerCase());
	if (lowerMatch) return lowerMatch;

	return t;
}

function resolveInternalTypeFromPortalType(portalType: string): string {
	const t = safeString(portalType).trim();
	if (!t) return t;
	if (Object.prototype.hasOwnProperty.call(PORTAL_TO_INTERNAL_TYPE_OVERRIDES, t)) return PORTAL_TO_INTERNAL_TYPE_OVERRIDES[t];
	if (Object.prototype.hasOwnProperty.call(TYPE_NAME_IMPORT_OVERRIDES, t)) return TYPE_NAME_IMPORT_OVERRIDES[t];

	// Prefer an internal type that exists in this build.
	const candidates: string[] = [];
	if ((Blockly as any).Blocks && Object.prototype.hasOwnProperty.call((Blockly as any).Blocks, t)) candidates.push(t);
	const up = t.toUpperCase();
	if ((Blockly as any).Blocks && Object.prototype.hasOwnProperty.call((Blockly as any).Blocks, up)) candidates.push(up);

	// Try docs-derived block id (often used by some of our internal block sets).
	const blockId = blockIdByPortalType.get(t);
	if (blockId) {
		if ((Blockly as any).Blocks && Object.prototype.hasOwnProperty.call((Blockly as any).Blocks, blockId)) candidates.push(blockId);
		const bidUp = blockId.toUpperCase();
		if ((Blockly as any).Blocks && Object.prototype.hasOwnProperty.call((Blockly as any).Blocks, bidUp)) candidates.push(bidUp);
	}

	if (candidates.length) return candidates[0];
	return t;
}

function dropdownValueToLabel(blockType: string, fieldName: string, storedValue: string): string {
	const key = `${blockType}::${fieldName}::${storedValue}`;
	if (dropdownLabelCache.has(key)) return dropdownLabelCache.get(key)!;

	try {
		const ws = new Blockly.Workspace();
		const b = ws.newBlock(blockType);
		const f = (b as any).getField?.(fieldName);
		if (f && typeof f.setValue === 'function') f.setValue(storedValue);
		const label = safeString(f?.getText?.() ?? storedValue);
		try { (b as any).dispose(false); } catch {}
		try { (ws as any).dispose(); } catch {}
		dropdownLabelCache.set(key, label);
		return label;
	} catch {
		dropdownLabelCache.set(key, storedValue);
		return storedValue;
	}
}

function dropdownLabelToValue(blockType: string, fieldName: string, label: string): string {
	const key = `${blockType}::${fieldName}::${label}`;
	if (dropdownValueCache.has(key)) return dropdownValueCache.get(key)!;

	try {
		const ws = new Blockly.Workspace();
		const b = ws.newBlock(blockType);
		const f = (b as any).getField?.(fieldName);
		const opts = typeof f?.getOptions === 'function' ? f.getOptions() : [];
		const match = (opts as any[]).find((o: any) => Array.isArray(o) && safeString(o[0]) === label);
		const value = match ? safeString(match[1]) : label;
		try { (b as any).dispose(false); } catch {}
		try { (ws as any).dispose(); } catch {}
		dropdownValueCache.set(key, value);
		return value;
	} catch {
		dropdownValueCache.set(key, label);
		return label;
	}
}

function extractInternalConditionExpression(condObj: any): any {
	if (!condObj || typeof condObj !== 'object') return condObj;

	// Internal helper wrapper: CONDITION_BLOCK { inputs: { INPUT_CONDITION: { block: ... } } }
	const t = safeString(condObj.type);
	if (t === 'CONDITION_BLOCK' || t === 'condition') {
		const inner = condObj.inputs?.INPUT_CONDITION?.block ?? condObj.inputs?.INPUT_CONDITION?.shadow;
		if (inner) return inner;
		const inner2 = condObj.inputs?.['VALUE-0']?.block ?? condObj.inputs?.['VALUE-0']?.shadow;
		if (inner2) return inner2;
	}

	return condObj;
}

function buildPortalConditionChainFromInternalConditionValue(conditionValueBlock: any): any {
	const expr = extractInternalConditionExpression(conditionValueBlock);
	if (!expr) return null;

	// Portal condition blocks are statement-linked, and each wraps the boolean
	// expression in its `CONDITION` value input.
	return {
		type: 'conditionBlock',
		id: safeString(expr?.id || '') ? `${expr.id}__cond` : undefined,
		inputs: {
			CONDITION: { block: expr },
		},
	};
}

function collectPortalConditionExpressions(conditionChain: any): any[] {
	// Walks a portal `conditionBlock` statement chain and returns the raw
	// expression blocks connected to each `CONDITION` input.
	const out: any[] = [];
	let b = conditionChain;
	while (b && typeof b === 'object') {
		if (safeString(b.type) !== 'conditionBlock') break;
		const expr = b.inputs?.CONDITION?.block ?? b.inputs?.CONDITION?.shadow;
		if (expr) out.push(expr);
		b = b.next?.block;
	}
	return out;
}

function foldConditionsToInternalBoolean(conds: any[]): any {
	// Portal semantics: multiple conditionBlock entries are ANDed.
	if (!conds.length) return null;
	if (conds.length === 1) return conds[0];

	// Build a left-associated AND tree: AND(AND(c1,c2),c3)...
	let acc = conds[0];
	for (let i = 1; i < conds.length; i++) {
		const rhs = conds[i];
		const idBase = `${safeString(acc?.id || 'cond')}_${safeString(rhs?.id || i)}`;
		acc = {
			type: 'AND',
			id: idBase,
			inputs: {
				A: { block: acc },
				B: { block: rhs },
			},
		};
	}
	return acc;
}

function convertBlockTreeInternalToPortal(blockObj: any): any {
	if (!blockObj || typeof blockObj !== 'object') return blockObj;

	const internalType = safeString(blockObj.type);

	// Convert children first.
	if (blockObj.inputs && typeof blockObj.inputs === 'object') {
		const newInputs: any = {};
		for (const [k, v] of Object.entries(blockObj.inputs)) {
			const vv: any = v as any;
			const child = vv?.block ? convertBlockTreeInternalToPortal(vv.block) : vv?.shadow ? convertBlockTreeInternalToPortal(vv.shadow) : null;
			if (child) {
				if (vv.block) newInputs[k] = { ...vv, block: child };
				else newInputs[k] = { ...vv, shadow: child };
			} else {
				newInputs[k] = vv;
			}
		}
		blockObj = { ...blockObj, inputs: newInputs };
	}

	if (blockObj.next?.block) {
		blockObj = { ...blockObj, next: { ...blockObj.next, block: convertBlockTreeInternalToPortal(blockObj.next.block) } };
	}

	// Special structural conversion: RULE_HEADER -> ruleBlock needs conditions wrapping.
	if (internalType === 'RULE_HEADER') {
		const portalType = 'ruleBlock';
		const fields: any = { ...(blockObj.fields || {}) };

		const originalEventValue = safeString(fields.EVENT_TYPE);

		// Field key + value conversion.
		// RULE_NAME -> NAME (string)
		if (Object.prototype.hasOwnProperty.call(fields, 'RULE_NAME')) {
			fields.NAME = fields.RULE_NAME;
			delete fields.RULE_NAME;
		}

		// EVENT_TYPE stored values are internal enums (e.g. ONGOING) but portal stores labels (e.g. Ongoing).
		if (Object.prototype.hasOwnProperty.call(fields, 'EVENT_TYPE')) {
			fields.EVENTTYPE = dropdownValueToLabel('RULE_HEADER', 'EVENT_TYPE', safeString(fields.EVENT_TYPE));
			delete fields.EVENT_TYPE;
		}

		// Scope/object type
		if (Object.prototype.hasOwnProperty.call(fields, 'SCOPE_TYPE')) {
			fields.OBJECTTYPE = dropdownValueToLabel('RULE_HEADER', 'SCOPE_TYPE', safeString(fields.SCOPE_TYPE));
			delete fields.SCOPE_TYPE;
		} else if (Object.prototype.hasOwnProperty.call(fields, 'SCOPE')) {
			fields.OBJECTTYPE = dropdownValueToLabel('RULE_HEADER', 'SCOPE', safeString(fields.SCOPE));
			delete fields.SCOPE;
		}

		const inputs: any = { ...(blockObj.inputs || {}) };

		// Convert internal value CONDITIONS -> portal statement CONDITIONS (conditionBlock chain).
		const condValue = inputs.CONDITIONS?.block ?? inputs.CONDITIONS?.shadow;
		if (condValue) {
			const chain = buildPortalConditionChainFromInternalConditionValue(condValue);
			if (chain) inputs.CONDITIONS = { block: chain };
		} else {
			delete inputs.CONDITIONS;
		}

		// ACTIONS stays a statement list.

		const extraState: any = { ...(blockObj.extraState || {}) };
		// Portal templates commonly include this hint; it appears safe and helps the editor.
		extraState.isOngoingEvent = originalEventValue === 'ONGOING';

		blockObj = { ...blockObj, type: portalType, fields, inputs, extraState };
	}

	// Special structural conversion: SUBROUTINE_BLOCK -> subroutineBlock needs conditions wrapping.
	if (internalType === 'SUBROUTINE_BLOCK') {
		const portalType = 'subroutineBlock';
		const inputs: any = { ...(blockObj.inputs || {}) };

		const params = extractMutatorParams(blockObj);
		const subName = safeString(blockObj.fields?.SUBROUTINE_NAME ?? blockObj.extraState?.subroutineName ?? '');

		const extraState: any = {
			...(blockObj.extraState || {}),
			subroutineName: subName,
			parameters: toPortalParameters(params),
		};

		const condValue = inputs.CONDITIONS?.block ?? inputs.CONDITIONS?.shadow;
		if (condValue) {
			const chain = buildPortalConditionChainFromInternalConditionValue(condValue);
			if (chain) inputs.CONDITIONS = { block: chain };
		} else {
			delete inputs.CONDITIONS;
		}

		// Fields already use SUBROUTINE_NAME.
		blockObj = { ...blockObj, type: portalType, inputs, extraState };
	}

	// Subroutine calls: CALLSUBROUTINE -> subroutineInstanceBlock.
	if (internalType === 'CALLSUBROUTINE') {
		const rawName = safeString(blockObj.fields?.SUBROUTINE_NAME ?? blockObj.extraState?.subroutineName ?? '');
		const params = extractMutatorParams(blockObj);
		const portalParams = toPortalParameters(params);

		const newInputs: any = {};
		const inputs: any = blockObj.inputs && typeof blockObj.inputs === 'object' ? blockObj.inputs : {};
		for (const [k, v] of Object.entries(inputs)) {
			const m = /^ARG_(\d+)$/.exec(k);
			if (m) {
				const idx = Number(m[1]);
				newInputs[`PARAM-${idx}`] = v;
			} else {
				// Preserve any unexpected inputs.
				newInputs[k] = v;
			}
		}

		const extraState: any = {
			...(blockObj.extraState || {}),
			subroutineName: rawName,
			parameters: portalParams,
		};

		blockObj = {
			...blockObj,
			type: 'subroutineInstanceBlock',
			fields: {
				...(blockObj.fields || {}),
				SUBROUTINE_NAME: rawName,
			},
			inputs: newInputs,
			extraState,
		};
	}

	// Convert internal variable blocks (field_variable) into portal variableReferenceBlock + Set/GetVariable.
	if (internalType === 'SETVARIABLE') {
		const value = blockObj.inputs?.VALUE?.block ?? blockObj.inputs?.VALUE?.shadow;
		const variableField = blockObj.fields?.VARIABLE;

		const varId = typeof variableField === 'object' && variableField ? safeString(variableField.id ?? variableField) : safeString(variableField);

		const variableReferenceBlock: any = {
			type: 'variableReferenceBlock',
			id: varId ? `${varId}__varref` : undefined,
			extraState: { isObjectVar: false },
			fields: {
				OBJECTTYPE: 'Global',
				VAR: varId ? { id: varId } : undefined,
			},
		};

		const portalValue = value ? convertBlockTreeInternalToPortal(value) : null;

		blockObj = {
			...blockObj,
			type: 'SetVariable',
			// Portal version uses VALUE-0 (var ref) and VALUE-1 (value)
			inputs: {
				'VALUE-0': { block: variableReferenceBlock },
				...(portalValue ? { 'VALUE-1': { block: portalValue } } : {}),
			},
			fields: undefined,
		};
	}

	if (internalType === 'GETVARIABLE') {
		const variableField = blockObj.fields?.VARIABLE_NAME;
		const varId = typeof variableField === 'object' && variableField ? safeString(variableField.id ?? variableField) : safeString(variableField);

		const variableReferenceBlock: any = {
			type: 'variableReferenceBlock',
			id: varId ? `${varId}__varref` : undefined,
			extraState: { isObjectVar: false },
			fields: {
				OBJECTTYPE: 'Global',
				VAR: varId ? { id: varId } : undefined,
			},
		};

		blockObj = {
			...blockObj,
			type: 'GetVariable',
			inputs: {
				'VALUE-0': { block: variableReferenceBlock },
			},
			fields: undefined,
		};
	}

	// Generic type + input remap.
	const portalType = resolvePortalTypeFromInternalType(internalType);
	if (portalType && portalType !== internalType) {
		const spec = getPortalSpec(portalType);
		if (spec && blockObj.inputs && typeof blockObj.inputs === 'object') {
			const shape = getInternalShape(internalType);
			const remappedValues = remapInputsByPosition(blockObj.inputs, shape.valueInputs, spec.valueInputs);
			const remapped = remapInputsByPosition(remappedValues, shape.statementInputs, spec.statementInputs);
			blockObj = { ...blockObj, inputs: remapped };
		}
		blockObj = { ...blockObj, type: portalType };
	}

	// Literal blocks: map type casing to Portal canonical types.
	if (internalType === 'BOOLEAN') blockObj = { ...blockObj, type: 'Boolean' };
	if (internalType === 'NUMBER') blockObj = { ...blockObj, type: 'Number' };
	if (internalType === 'STRING') blockObj = { ...blockObj, type: 'String' };

	return blockObj;
}

function convertBlockTreePortalToInternal(blockObj: any): any {
	if (!blockObj || typeof blockObj !== 'object') return blockObj;

	const portalType = safeString(blockObj.type);

	// Convert children first.
	if (blockObj.inputs && typeof blockObj.inputs === 'object') {
		const newInputs: any = {};
		for (const [k, v] of Object.entries(blockObj.inputs)) {
			const vv: any = v as any;
			const child = vv?.block ? convertBlockTreePortalToInternal(vv.block) : vv?.shadow ? convertBlockTreePortalToInternal(vv.shadow) : null;
			if (child) {
				if (vv.block) newInputs[k] = { ...vv, block: child };
				else newInputs[k] = { ...vv, shadow: child };
			} else {
				newInputs[k] = vv;
			}
		}
		blockObj = { ...blockObj, inputs: newInputs };
	}

	if (blockObj.next?.block) {
		blockObj = { ...blockObj, next: { ...blockObj.next, block: convertBlockTreePortalToInternal(blockObj.next.block) } };
	}

	// Special structural: ruleBlock -> RULE_HEADER (handle condition statement chain).
	if (portalType === 'ruleBlock') {
		const fields: any = { ...(blockObj.fields || {}) };
		const inputs: any = { ...(blockObj.inputs || {}) };

		// Field key/value conversion to internal.
		if (Object.prototype.hasOwnProperty.call(fields, 'NAME')) {
			fields.RULE_NAME = fields.NAME;
			delete fields.NAME;
		}

		if (Object.prototype.hasOwnProperty.call(fields, 'EVENTTYPE')) {
			fields.EVENT_TYPE = dropdownLabelToValue('RULE_HEADER', 'EVENT_TYPE', safeString(fields.EVENTTYPE));
			delete fields.EVENTTYPE;
		}

		if (Object.prototype.hasOwnProperty.call(fields, 'OBJECTTYPE')) {
			fields.SCOPE_TYPE = dropdownLabelToValue('RULE_HEADER', 'SCOPE_TYPE', safeString(fields.OBJECTTYPE));
			delete fields.OBJECTTYPE;
		}

		// Convert portal CONDITIONS statement chain -> internal single boolean value.
		const condChain = inputs.CONDITIONS?.block ?? inputs.CONDITIONS?.shadow;
		if (condChain) {
			const exprs = collectPortalConditionExpressions(condChain).map(convertBlockTreePortalToInternal);
			const folded = foldConditionsToInternalBoolean(exprs.filter(Boolean));
			if (folded) inputs.CONDITIONS = { block: folded };
			else delete inputs.CONDITIONS;
		}

		blockObj = { ...blockObj, type: 'RULE_HEADER', fields, inputs };
	}

	// Special structural: subroutineBlock -> SUBROUTINE_BLOCK.
	if (portalType === 'subroutineBlock') {
		const inputs: any = { ...(blockObj.inputs || {}) };
		const condChain = inputs.CONDITIONS?.block ?? inputs.CONDITIONS?.shadow;
		if (condChain) {
			const exprs = collectPortalConditionExpressions(condChain).map(convertBlockTreePortalToInternal);
			const folded = foldConditionsToInternalBoolean(exprs.filter(Boolean));
			if (folded) inputs.CONDITIONS = { block: folded };
			else delete inputs.CONDITIONS;
		}

		blockObj = { ...blockObj, type: 'SUBROUTINE_BLOCK', inputs };
	}

	// Variable portal blocks -> internal SETVARIABLE/GETVARIABLE.
	if (portalType === 'SetVariable') {
		const value = blockObj.inputs?.['VALUE-1']?.block;
		const varRef = blockObj.inputs?.['VALUE-0']?.block;
		const varId = safeString(varRef?.fields?.VAR?.id ?? varRef?.fields?.VAR ?? '');

		blockObj = {
			...blockObj,
			type: 'SETVARIABLE',
			fields: {
				VARIABLE: varId ? { id: varId } : undefined,
			},
			inputs: {
				VALUE: value ? { block: convertBlockTreePortalToInternal(value) } : undefined,
			},
		};

		// Clean undefineds.
		if (!blockObj.inputs.VALUE) delete blockObj.inputs.VALUE;
	}

	if (portalType === 'GetVariable') {
		const varRef = blockObj.inputs?.['VALUE-0']?.block;
		const varId = safeString(varRef?.fields?.VAR?.id ?? varRef?.fields?.VAR ?? '');

		blockObj = {
			...blockObj,
			type: 'GETVARIABLE',
			fields: {
				VARIABLE_NAME: varId ? { id: varId } : undefined,
			},
			inputs: {},
		};
	}

	// Generic type + input remap.
	const internalType = resolveInternalTypeFromPortalType(portalType);
	if (internalType && internalType !== portalType) {
		const spec = getPortalSpec(portalType);
		if (spec && blockObj.inputs && typeof blockObj.inputs === 'object') {
			const shape = getInternalShape(internalType);
			const remappedValues = remapInputsByPosition(blockObj.inputs, spec.valueInputs, shape.valueInputs);
			const remapped = remapInputsByPosition(remappedValues, spec.statementInputs, shape.statementInputs);
			blockObj = { ...blockObj, inputs: remapped };
		}
		blockObj = { ...blockObj, type: internalType };
	}

	// Literal types.
	if (portalType === 'Boolean') blockObj = { ...blockObj, type: 'BOOLEAN' };
	if (portalType === 'Number') blockObj = { ...blockObj, type: 'NUMBER' };
	if (portalType === 'String') blockObj = { ...blockObj, type: 'STRING' };

	return blockObj;
}

export async function convertInternalStateToPortalWrappedExport(state: AnyWorkspaceState): Promise<any> {
	await ensureSpecsLoaded();
	const s = deepClone(normalizeWorkspaceState(state));
	const blocksArr = s?.blocks?.blocks;
	if (s?.blocks && Array.isArray(blocksArr)) {
		s.blocks.blocks = blocksArr.map((b: any) => convertBlockTreeInternalToPortal(b));
	}
	return { mod: s };
}

export async function convertPortalWrappedExportToInternalState(obj: any): Promise<AnyWorkspaceState> {
	await ensureSpecsLoaded();
	const s = deepClone(normalizeWorkspaceState(obj));
	const blocksArr = s?.blocks?.blocks;
	if (s?.blocks && Array.isArray(blocksArr)) {
		s.blocks.blocks = blocksArr.map((b: any) => convertBlockTreePortalToInternal(b));
	}
	return s;
}

export function looksLikePortalJson(obj: any): boolean {
	if (!obj || typeof obj !== 'object') return false;
	if (looksLikePortalWrappedExport(obj)) return true;

	const s = normalizeWorkspaceState(obj);
	const tops = s?.blocks?.blocks;
	if (!Array.isArray(tops) || !tops.length) return false;
	const t0 = safeString(tops[0]?.type);
	return t0 === 'modBlock' || t0 === 'ruleBlock' || t0 === 'subroutineBlock' || t0 === 'conditionBlock';
}