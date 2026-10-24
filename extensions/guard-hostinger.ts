import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/**
 * Ask before the agent runs a destructive Hostinger CLI command.
 *
 * The same operations were gated by `approveTools` while the Hostinger MCP
 * servers were in use. This guard keeps that gate now that the commands run
 * through `bash`. Read-only commands pass through untouched.
 *
 * Each entry is the group, subgroup and verb of `hostinger <group> <subgroup>
 * <verb>`. Flags between them are ignored, so `hostinger vps --format json
 * virtual-machines stop 1` is still caught.
 */
export const BLOCKED_COMMANDS: string[][] = [
  // DNS
  ["dns", "records", "update"],
  ["dns", "records", "delete"],
  ["dns", "records", "reset"],
  ["dns", "snapshots", "restore"],

  // Domains: forwarding
  ["domains", "forwarding", "create"],
  ["domains", "forwarding", "update"],
  ["domains", "forwarding", "delete"],
  // Domains: moves between accounts
  ["domains", "move", "accept-incoming"],
  ["domains", "move", "reject-incoming"],
  ["domains", "move", "start-outgoing"],
  ["domains", "move", "cancel-outgoing"],
  // Domains: portfolio ownership
  ["domains", "portfolio", "purchase"],
  ["domains", "portfolio", "claim-free"],
  ["domains", "portfolio", "complete-setup"],
  ["domains", "portfolio", "enable-lock"],
  ["domains", "portfolio", "disable-lock"],
  ["domains", "portfolio", "enable-privacy-protection"],
  ["domains", "portfolio", "disable-privacy-protection"],
  ["domains", "portfolio", "update-nameservers"],
  ["domains", "portfolio", "authorization-code"],
  // Domains: transfer and WHOIS
  ["domains", "transfer", "claim-free"],
  ["domains", "transfer", "start"],
  ["domains", "whois", "create"],
  ["domains", "whois", "delete"],
  ["domains", "whois", "change-for"],
  ["domains", "whois", "set-as-default"],
  ["domains", "whois", "unset-default"],
  ["domains", "whois", "cancel-pending-irtp-verification"],

  // VPS: virtual machines
  ["vps", "virtual-machines", "start"],
  ["vps", "virtual-machines", "stop"],
  ["vps", "virtual-machines", "restart"],
  ["vps", "virtual-machines", "recreate"],
  ["vps", "virtual-machines", "purchase"],
  ["vps", "virtual-machines", "setup"],
  ["vps", "virtual-machines", "set-hostname"],
  ["vps", "virtual-machines", "reset-hostname"],
  ["vps", "virtual-machines", "set-nameservers"],
  ["vps", "virtual-machines", "set-root-password"],
  ["vps", "virtual-machines", "set-panel-password"],
  // VPS: docker projects
  ["vps", "docker", "create"],
  ["vps", "docker", "update"],
  ["vps", "docker", "delete"],
  ["vps", "docker", "restart"],
  ["vps", "docker", "start"],
  ["vps", "docker", "stop"],
  // VPS: firewall
  ["vps", "firewall", "activate"],
  ["vps", "firewall", "deactivate"],
  ["vps", "firewall", "create"],
  ["vps", "firewall", "delete"],
  ["vps", "firewall", "create-rule"],
  ["vps", "firewall", "update-rule"],
  ["vps", "firewall", "delete-rule"],
  ["vps", "firewall", "replace-all-rules-in-group"],
  ["vps", "firewall", "sync"],
  ["vps", "firewall", "sync-to-all-assigned-v-ms"],
  // VPS: keys, recovery, backups, snapshots, scripts, malware
  ["vps", "public-keys", "attach"],
  ["vps", "public-keys", "create"],
  ["vps", "public-keys", "delete"],
  ["vps", "ssh-keys", "add-virtual-machine"],
  ["vps", "ssh-keys", "remove-virtual-machine"],
  ["vps", "recovery", "start"],
  ["vps", "recovery", "stop"],
  ["vps", "backups", "restore"],
  ["vps", "snapshots", "create"],
  ["vps", "snapshots", "delete"],
  ["vps", "snapshots", "restore"],
  ["vps", "post-install-scripts", "create"],
  ["vps", "post-install-scripts", "update"],
  ["vps", "post-install-scripts", "delete"],
  ["vps", "monarx", "install"],
  ["vps", "monarx", "uninstall"],
];

/** Shell tokens that end one command and start the next. */
const SEPARATORS = new Set(["&&", "||", ";", "|", "&", "\n"]);

/** Split a bash command into shell-ish tokens, keeping quotes out of the way. */
export function tokenize(command: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let quote: string | null = null;
  for (let i = 0; i < command.length; i++) {
    const char = command[i];
    if (quote) {
      if (char === quote) quote = null;
      else current += char;
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      continue;
    }
    if (/\s/.test(char)) {
      if (current) tokens.push(current);
      current = "";
      continue;
    }
    if (char === ";" || char === "|" || char === "&") {
      if (current) tokens.push(current);
      current = "";
      tokens.push(char);
      continue;
    }
    current += char;
  }
  if (current) tokens.push(current);
  return tokens;
}

/**
 * Find the blocked Hostinger command in a shell line, or null when there is
 * none. Only tokens between two separators are considered, so a later command
 * in the same line does not change the match.
 */
export function findBlockedCommand(command: string): string[] | null {
  const tokens = tokenize(command);
  for (let start = 0; start < tokens.length; start++) {
    const token = tokens[start];
    if (!token.endsWith("hostinger")) continue;
    // Collect the arguments of this one command.
    const args: string[] = [];
    for (let i = start + 1; i < tokens.length; i++) {
      if (SEPARATORS.has(tokens[i])) break;
      args.push(tokens[i]);
    }
    // Match each blocked sequence in order, ignoring flags and their values.
    for (const sequence of BLOCKED_COMMANDS) {
      let index = 0;
      for (const arg of args) {
        if (arg.startsWith("-")) continue;
        if (arg === sequence[index]) {
          index += 1;
          if (index === sequence.length) return sequence;
        }
      }
    }
  }
  return null;
}

export default function (pi: ExtensionAPI) {
  pi.on("tool_call", (event) => {
    if (event.toolName !== "bash") return;
    const command = (event.input as { command: string }).command;
    const blocked = findBlockedCommand(command);
    if (blocked) {
      return {
        block: true,
        reason: `Commande hostinger destructive, à confirmer par l’utilisateur : ${blocked.join(" ")}`,
      };
    }
  });
}
