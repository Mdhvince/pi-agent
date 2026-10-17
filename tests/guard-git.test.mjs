import assert from "node:assert/strict";
import test from "node:test";
import guardGit from "../extensions/guard-git.ts";

let onToolCall;
guardGit({ on: (_event, handler) => { onToolCall = handler; } });

test("blocks listed Git operations but allows other commands", () => {
	for (const command of [
		"git push origin main",
		"git reset --hard HEAD",
		"git clean -fd",
		"git clean -f",
		"git branch -D feature",
		"git checkout .",
		"git restore .",
		"push --force",
		"reset --hard",
	]) {
		assert.equal(onToolCall({ toolName: "bash", input: { command } })?.block, true, command);
	}

	assert.equal(onToolCall({ toolName: "bash", input: { command: "git status" } }), undefined);
	assert.equal(onToolCall({ toolName: "read", input: { path: "file.txt" } }), undefined);
});
