import assert from "node:assert/strict";
import test from "node:test";
import guardGit from "../extensions/guard-git.ts";

let onToolCall;
guardGit({ on: (_event, handler) => { onToolCall = handler; } });

const blocks = (command) => onToolCall({ toolName: "bash", input: { command } })?.block === true;

test("blocks destructive Git operations, alone or inside a command chain", () => {
	for (const command of [
		"git push origin main",
		"git  push origin main",
		"git push --force-with-lease origin main",
		"cd repo && git push",
		"git reset --hard HEAD",
		"git clean -f",
		"git clean -fd",
		"git branch -D feature",
		"git checkout .",
		"git restore .",
	]) {
		assert.equal(blocks(command), true, command);
	}
});

test("blocks the destructive forms of scoped Git operations", () => {
	for (const command of [
		"git reset HEAD~2 --hard",
		"git branch --delete --force feature",
		"git checkout -- .",
		"git checkout ./",
		"git stash clear",
		"git stash drop stash@{1}",
		"git update-ref -d refs/heads/main",
		"git filter-branch -f --env-filter x",
		"git filter-repo --force",
	]) {
		assert.equal(blocks(command), true, command);
	}
});

test("blocks a destructive operation behind leading environment assignments", () => {
	for (const command of [
		"SKIP=ggshield git push",
		"A=1 B=2 git push origin main",
		'A="two words" git push',
		"A='two words' git reset --hard",
		"cd repo && FOO=1 git clean -f",
	]) {
		assert.equal(blocks(command), true, command);
	}
});

test("allows safe Git operations", () => {
	for (const command of [
		"git status",
		"git reset --soft HEAD~1",
		"git clean -n",
		"git branch -d merged",
		"git checkout feature",
		"git restore --staged .",
		"git restore src/file.ts",
		"git stash pop",
		"git commit --amend",
		"SKIP=ggshield git commit -m fix",
		'A="two words" git status',
	]) {
		assert.equal(onToolCall({ toolName: "bash", input: { command } }), undefined, command);
	}
});

test("allows commands that only mention a blocked operation as data", () => {
	for (const command of [
		'node -e "console.log(\'git push\')"',
		'git commit -m "doc: the git push step"',
		'git grep "git reset --hard"',
		"grep 'git checkout .' README.md",
		"git log --oneline | grep push",
		"node --test tests/guard-git.test.mjs",
		"echo FOO=1 git push",
		"FOO=1",
		"FOO=1 echo git push",
	]) {
		assert.equal(onToolCall({ toolName: "bash", input: { command } }), undefined, command);
	}
});

test("ignores tool calls that are not bash", () => {
	assert.equal(onToolCall({ toolName: "read", input: { path: "file.txt" } }), undefined);
});