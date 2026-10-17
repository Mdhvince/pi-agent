import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
	const blocked = [
		"git push",
		"git reset --hard",
		"git clean -f",
		"git branch -D",
		"git checkout .",
		"git restore .",
		"push --force",
		"reset --hard",
	];

	pi.on("tool_call", (event) => {
		if (event.toolName !== "bash") return;

		const command = (event.input as { command: string }).command;
		const pattern = blocked.find((pattern) => command.includes(pattern));
		if (pattern) return { block: true, reason: `Commande interdite par l’utilisateur : ${pattern}` };
	});
}
