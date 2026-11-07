import { execFileSync } from "node:child_process";
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, realpathSync, rmSync, symlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Link the running Pi package into the agent's node_modules so TypeScript can
 * resolve extension imports without absolute paths in tsconfig.json.
 *
 * The types must come from the Pi build that actually runs, otherwise the
 * compiled declarations drift from the runtime API. That rules out a pinned
 * devDependency: Pi is installed globally and updated outside this directory.
 */

const PACKAGE_NAME = "@earendil-works/pi-coding-agent";
const SCOPE = "@earendil-works";
const LINK_DIR = fileURLToPath(new URL(`../node_modules/${SCOPE}/`, import.meta.url));

function packageNameAt(directory) {
	const manifest = join(directory, "package.json");
	if (!existsSync(manifest)) return undefined;
	try {
		return JSON.parse(readFileSync(manifest, "utf8")).name;
	} catch {
		return undefined;
	}
}

function ancestorsOf(start) {
	const chain = [];
	let current = start;
	for (;;) {
		chain.push(current);
		const parent = dirname(current);
		if (parent === current) return chain;
		current = parent;
	}
}

function findFromPath() {
	for (const directory of (process.env.PATH ?? "").split(":").filter(Boolean)) {
		const binary = join(directory, "pi");
		if (!existsSync(binary)) continue;
		const resolved = realpathSync(binary);
		const found = ancestorsOf(dirname(resolved)).find((d) => packageNameAt(d) === PACKAGE_NAME);
		if (found) return found;
	}
	return undefined;
}

function findFromNpmRoot() {
	let root;
	try {
		root = execFileSync("npm", ["root", "-g"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
	} catch {
		return undefined;
	}
	if (!root) return undefined;
	const candidate = join(root, ...PACKAGE_NAME.split("/"));
	return packageNameAt(candidate) === PACKAGE_NAME ? candidate : undefined;
}

function link(target) {
	mkdirSync(LINK_DIR, { recursive: true });
	const destination = join(LINK_DIR, PACKAGE_NAME.split("/")[1]);
	if (lstatSync(destination, { throwIfNoEntry: false })) rmSync(destination, { recursive: true, force: true });
	symlinkSync(target, destination);
	return destination;
}

const packageDir = findFromPath() ?? findFromNpmRoot();
if (!packageDir) {
	console.error(`Unable to locate ${PACKAGE_NAME}. Is Pi installed?`);
	process.exit(1);
}

const linked = [link(packageDir)];
const siblings = join(packageDir, "node_modules", SCOPE);
if (existsSync(siblings)) {
	for (const entry of readdirSync(siblings)) {
		const source = join(siblings, entry);
		const destination = join(LINK_DIR, entry);
		if (lstatSync(destination, { throwIfNoEntry: false })) rmSync(destination, { recursive: true, force: true });
		symlinkSync(source, destination);
		linked.push(destination);
	}
}

console.log(`linked ${linked.length} package(s) from ${packageDir}`);
