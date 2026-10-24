import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

test("keeps reviewed setup files visible to Git and private state ignored", () => {
	const publicPaths = [
		".gitignore",
		"AGENTS.md",
		"settings.json",
		"prompts/answer.md",
		"skills/structuring-frontend-code/SKILL.md",
		"extensions/guard-git.ts",
		"extensions/fleet-footer.js",
		"themes/fleet-dark.json",
		"tests/guard-git.test.mjs",
		"tests/setup-config.test.mjs",
		"tests/centered-input-block.test.mjs",
		"evals/README.md",
	];
	const privatePaths = [
		"auth.json",
		"mcp-adapter.json",
		"mcp-cache.json",
		"mcp-oauth/tokens.json",
		"sessions/private.jsonl",
		"npm/package-lock.json",
		"extensions/credentials.json",
		"themes/private.json",
		"tests/fixtures/client-data.json",
		"evals/results.json",
		"harness-library/INDEX.md",
	];
	const ignored = execFileSync("git", ["check-ignore", "--no-index", "--stdin"], {
		cwd: root,
		input: [...publicPaths, ...privatePaths].join("\n") + "\n",
		encoding: "utf8",
	}).trim().split(/\r?\n/);
	assert.deepEqual(ignored, privatePaths);
});

test("pins configured npm packages to exact versions", () => {
	const settings = JSON.parse(readFileSync(new URL("../settings.json", import.meta.url), "utf8"));
	for (const source of settings.packages) {
		assert.match(source, /^npm:(?:@[^/@\s]+\/)?[^/@\s]+@\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/);
	}
});
