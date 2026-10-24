import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";

/**
 * Resolve the pi packages the way the live agent resolves them, so the
 * checks exercise the extension against the installed versions. The agent
 * directory has no node_modules: the hooks redirect the bare imports.
 */
const globalRoot = execFileSync("npm", ["root", "-g"], { encoding: "utf8" }).trim();
const piPackage = `file://${globalRoot}/@earendil-works/pi-coding-agent`;
const piTui = `file://${globalRoot}/@earendil-works/pi-coding-agent/node_modules/@earendil-works/pi-tui`;

registerHooks({
	resolve(specifier, context, nextResolve) {
		if (specifier === "@earendil-works/pi-coding-agent") {
			return { url: `${piPackage}/dist/index.js`, shortCircuit: true };
		}
		if (specifier === "@earendil-works/pi-tui") {
			return { url: `${piTui}/dist/index.js`, shortCircuit: true };
		}
		return nextResolve(specifier, context);
	},
});

const { loadThemeFromPath } = await import(`${piPackage}/dist/modes/interactive/theme/theme.js`);
const { default: centeredInputBlock } = await import("../extensions/centered-input-block.js");

const themePath = fileURLToPath(new URL("../themes/fleet-dark.json", import.meta.url));

/** Build a block editor through the extension's real registration path. */
function installBlock(theme) {
	const handlers = {};
	centeredInputBlock({ on: (name, fn) => { handlers[name] = fn; } });

	let factory;
	const ui = {
		theme,
		setEditorComponent: (fn) => { factory = fn; },
		getEditorComponent: () => factory,
	};
	handlers.session_start(undefined, { hasUI: true, mode: "tui", ui });

	const tui = { requestRender() {}, width: 120, terminal: { rows: 40, columns: 120 } };
	return factory(tui, theme, {});
}

test("loads the custom theme with the colors the block consumes", () => {
	const theme = loadThemeFromPath(themePath, "dark");
	assert.equal(theme.name, "fleet-dark");
	assert.ok(theme.sourcePath, "the dust fill reads export.pageBg from the theme file");
	for (const token of ["customMessageBg", "accent", "success", "warning", "error", "dim"]) {
		assert.ok(theme.colors[token], token);
	}
});

test("renders the block with the installed pi packages", () => {
	const theme = loadThemeFromPath(themePath, "dark");
	const editor = installBlock(theme);
	const rows = editor.render(80);
	assert.ok(Array.isArray(rows) && rows.length > 0);
	for (const row of rows) assert.equal(typeof row, "string");
	editor.dispose();
});

test("renders the dust indicator while the agent works", () => {
	const theme = loadThemeFromPath(themePath, "dark");
	const editor = installBlock(theme);
	editor.workingStatusIndicator = { kind: "working" };
	editor.dustLevel = 1;
	const rows = editor.render(80);
	assert.ok(rows.some((row) => /[.\u00b7\u02d9\u2022]/.test(row)), "no dust dot rendered");
	editor.dispose();
});

test("keeps the session alive when custom rendering fails", () => {
	const theme = loadThemeFromPath(themePath, "dark");
	const editor = installBlock(theme);
	editor.workingStatusIndicator = { kind: "working" };
	editor.dustLevel = 1;
	const brokenTheme = {
		colors: theme.colors,
		sourcePath: theme.sourcePath,
		style: () => { throw new Error("simulated pi API drift"); },
		bg: () => { throw new Error("simulated pi API drift"); },
	};
	editor.resolveTheme = () => brokenTheme;

	const messages = [];
	const originalError = console.error;
	console.error = (message) => messages.push(message);
	try {
		const rows = editor.render(80);
		assert.ok(Array.isArray(rows) && rows.length > 0, "the first render must not throw");
		const again = editor.render(80);
		assert.ok(Array.isArray(again) && again.length > 0, "later renders must not throw");
	} finally {
		console.error = originalError;
		editor.dispose();
	}
	assert.equal(messages.length, 1, "the fallback must be reported exactly once");
	assert.match(messages[0], /fell back to the base editor/);
});