import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/**
 * Block destructive Git operations that must not run without the user.
 *
 * The command is split into segments on shell separators, and only a segment
 * that starts with a Git invocation is inspected. Text that only mentions a
 * blocked operation (quoted strings, grep patterns, commit messages) stays
 * allowed. Whitespace inside a segment is collapsed, so spacing tricks do
 * not slip a command through. Leading `NAME=value` words are skipped, so
 * `FOO=1 git push` is still recognized.
 *
 * Limits: a global option before the subcommand (`git -C path push`) and Git
 * reached through another command (`xargs git push`, `sh -c "git push"`) are
 * not recognized. Here-document bodies are not parsed either.
 */

/** Shell operators that sequence commands or chain them into a pipeline. */
const SEGMENT_SEPARATORS = /&&|\|\||[;|&\n]/;

/** Environment assignments before a command, as in `FOO=1 BAR="a b" git push`. */
const LEADING_ENV_ASSIGNMENTS = /^(?:[A-Za-z_][A-Za-z0-9_]*=(?:"[^"]*"|'[^']*'|\S*)\s+)+/;

/**
 * Return the blocked operation a Git invocation performs, or null when the
 * invocation is safe.
 */
function blockedOperation(verb: string, args: string[]): string | null {
	const has = (flag: string) => args.includes(flag);
	switch (verb) {
		// Publish or rewrite history, whatever the arguments are.
		case "push":
		case "filter-branch":
		case "filter-repo":
			return `git ${verb}`;
		// Discard, only in the destructive forms.
		case "reset":
			return has("--hard") ? "git reset --hard" : null;
		case "clean":
			return args.some((arg) => arg === "--force" || /^-[a-z]*f/.test(arg)) ? "git clean --force" : null;
		case "branch":
			return has("-D") || (has("--delete") && has("--force")) ? "git branch --delete --force" : null;
		case "checkout":
		case "restore":
			// --staged only unstage; without it these pathspecs discard work.
			if (has("--staged") || has("-S")) return null;
			return args.some((arg) => arg === "." || arg === "./" || arg === ":/") ? `git ${verb} .` : null;
		case "stash":
			return args[0] === "clear" || args[0] === "drop" ? `git stash ${args[0]}` : null;
		case "update-ref":
			return has("-d") || has("--delete") ? "git update-ref --delete" : null;
		default:
			return null;
	}
}

export default function (pi: ExtensionAPI) {
	pi.on("tool_call", (event) => {
		if (event.toolName !== "bash") return;

		const command = (event.input as { command: string }).command;
		for (const segment of command.split(SEGMENT_SEPARATORS)) {
			const tokens = segment.trim().replace(LEADING_ENV_ASSIGNMENTS, "").split(/\s+/);
			if (tokens[0] !== "git" && !tokens[0].endsWith("/git")) continue;

			const operation = blockedOperation(tokens[1], tokens.slice(2));
			if (operation) return { block: true, reason: `Commande interdite par l’utilisateur : ${operation}` };
		}
	});
}