import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

/**
 * Inject the how-to-reply-to-medhy skill into every system prompt.
 *
 * The skills system advertises the skill by description only, so loading it
 * depends on the model choosing to read it. This hook makes the instructions
 * deterministic: the file is read again on every run, so edits to the skill
 * apply without touching this extension.
 *
 * A missing or empty file throws instead of failing silently, so a wrong
 * path surfaces immediately instead of quietly dropping the protocol.
 */

const SKILL_PATH = join(homedir(), ".pi/agent/skills/how-to-reply-to-medhy/SKILL.md");
const FRONTMATTER = /^---[\s\S]*?---\s*/;
const PROMPT_SECTION = "medhy_protocol";

export default function medhyProtocol(pi: ExtensionAPI) {
	pi.on("before_agent_start", async (event) => {
		const skillContent = await readFile(SKILL_PATH, "utf-8");
		const instructions = skillContent.replace(FRONTMATTER, "").trim();
		if (!instructions) throw new Error(`Skill file has no instructions: ${SKILL_PATH}`);
		event.systemPromptOptions.sections[PROMPT_SECTION] = instructions;
	});
}
