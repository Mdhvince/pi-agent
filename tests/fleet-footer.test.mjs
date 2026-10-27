import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";

import fleetFooter from "../extensions/fleet-footer.js";

// The real theme is used so an unknown color token fails here instead of
// rendering an unstyled row in the live agent.
const globalRoot = execFileSync("npm", ["root", "-g"], { encoding: "utf8" }).trim();
const { loadThemeFromPath } = await import(
	`file://${globalRoot}/@earendil-works/pi-coding-agent/dist/modes/interactive/theme/theme.js`
);
const theme = loadThemeFromPath(fileURLToPath(new URL("../themes/fleet-dark.json", import.meta.url)), "dark");

const stripAnsi = (line) => line.replace(/\x1b\[[0-9;]*m/g, "");

/** Build the footer through the extension's real registration path. */
function installFooter(session) {
	const handlers = {};
	fleetFooter({
		events: { on() {} },
		on: (name, handler) => {
			handlers[name] = handler;
		},
	});

	let factory;
	const ctx = {
		cwd: session.cwd,
		hasUI: true,
		mode: "tui",
		model: { id: "gemma4:31b-cloud", reasoning: false },
		thinkingLevel: "off",
		sessionManager: {
			getEntries: () => [],
			getSessionName: () => session.name,
		},
		getContextUsage: () => ({ percent: 12, contextWindow: 200000 }),
		ui: {
			setFooter: (fn) => {
				factory = fn;
			},
		},
	};
	handlers.session_start(undefined, ctx);

	const footer = factory({}, theme, { getGitBranch: () => session.branch });
	return {
		rename(name) {
			session.name = name;
			handlers.session_info_changed(undefined, ctx);
		},
		render(width) {
			return footer.render(width).map(stripAnsi);
		},
		dispose() {
			footer.dispose();
		},
	};
}

test("renders the current path above the session name", () => {
	const footer = installFooter({ name: "Footer work", cwd: "/tmp/work", branch: "main" });
	const rows = footer.render(100);

	assert.equal(rows.length, 2);
	assert.match(rows[0], /^\s+Pwd: \/tmp\/work · ⎇ main\s+/);
	assert.ok(rows[0].includes("gemma4:31b-cloud"), "the status segments share the path row");
	assert.match(rows[1], /^\s+Session name: Footer work\s+$/);
	footer.dispose();
});

test("shows a placeholder while the session has no name", () => {
	const footer = installFooter({ name: undefined, cwd: "/tmp/work" });
	assert.match(footer.render(100)[1], /Session name: No name yet/);
	footer.dispose();
});

test("shows the placeholder for a blank name instead of an empty row", () => {
	const footer = installFooter({ name: "   ", cwd: "/tmp/work" });
	assert.match(footer.render(100)[1], /Session name: No name yet/);
	footer.dispose();
});

test("updates the name row when the session gets named", () => {
	const footer = installFooter({ name: undefined, cwd: "/tmp/work" });
	assert.match(footer.render(100)[1], /No name yet/);

	footer.rename("Renamed session");
	assert.match(footer.render(100)[1], /Session name: Renamed session/);
	footer.dispose();
});

test("cuts a long session name without touching the status segments", () => {
	const footer = installFooter({
		name: "A very long session name that keeps going and going",
		cwd: "/tmp/work",
		branch: "main",
	});
	const rows = footer.render(60);

	assert.match(rows[1], /…/);
	assert.ok(rows[0].includes("12%"), "the context usage must survive a long name");
	assert.ok(rows[0].includes("gemma4:31b-cloud"), "the model must survive a long name");
	assert.ok(rows.every((row) => row.length <= 60));
	footer.dispose();
});

test("drops the branch before cutting the path", () => {
	const footer = installFooter({
		name: undefined,
		cwd: "/tmp/work/apps/dashboard/src/components/widgets",
		branch: "feature/footer-layout",
	});
	const rows = footer.render(45);

	assert.match(rows[0], /^ +Pwd: \/tmp\/work.*… +12% · gemma4:31b-cloud +$/);
	assert.ok(!rows[0].includes("⎇"), "the branch must give up its room first");
	assert.ok(rows.every((row) => row.length <= 45));
	footer.dispose();
});
