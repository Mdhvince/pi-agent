import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

test("keeps reviewed setup files visible to Git and private state ignored", () => {
	const publicPaths = [
		".gitignore",
		"AGENTS.md",
		"APPEND_SYSTEM.md",
		"settings.json",
		"tsconfig.json",
		"package.json",
		"package-lock.json",
		"scripts/link-pi-types.mjs",
		"prompts/answer.md",
		"skills/screening-tests/SKILL.md",
		"extensions/guard-git.ts",
		"extensions/fleet-footer.js",
		"extensions/lib/layout.js",
		"extensions/medhy-protocol.ts",
		"themes/fleet-dark.json",
		"tests/guard-git.test.mjs",
		"tests/setup-config.test.mjs",
		"tests/centered-input-block.test.mjs",
		"tests/fleet-footer.test.mjs",
	];
	// Files that must stay ignored. Existing files are listed as they are;
	// the synthetic ones cover directories that the allowlist reopens with "!".
	const privatePaths = [
		"auth.json",
		"mcp-adapter.json",
		"mcp-cache.json",
		"extensions/credentials.json",
		"themes/private.json",
		"tests/fixtures/client-data.json",
	];

	// A deleted setup file must fail here instead of passing as an ignored path.
	for (const publicPath of publicPaths) {
		assert.ok(existsSync(new URL(`../${publicPath}`, import.meta.url)), `${publicPath} is listed as public but missing`);
	}

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

	const agentPackage = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
	for (const [name, version] of Object.entries(agentPackage.devDependencies ?? {})) {
		assert.match(version, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/, `${name} must use an exact version`);
	}
});
