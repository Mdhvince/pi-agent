import { blockContentWidth, blockInset } from "./lib/layout.js";

const MCP_STATUS_EVENT = "pi-mcp-adapter/status/v1";

const NO_SESSION_NAME = "No name yet";

function formatTokens(count) {
  if (count < 1000) return String(count);
  if (count < 10000) return `${(count / 1000).toFixed(1)}k`;
  if (count < 1000000) return `${Math.round(count / 1000)}k`;
  if (count < 10000000) return `${(count / 1000000).toFixed(1)}M`;
  return `${Math.round(count / 1000000)}M`;
}

function shortenCwd(cwd) {
  const home = process.env.HOME;
  return home && cwd.startsWith(home) ? `~${cwd.slice(home.length)}` : cwd;
}

/** Cut plain text to a column budget, marking the cut with an ellipsis. */
function truncatePlain(text, maxWidth) {
  if (text.length <= maxWidth) return text;
  const room = maxWidth - 1;
  return room > 0 ? `${text.slice(0, room)}…` : "";
}

/**
 * Session name segment for the first footer row.
 *
 * An unnamed session shows a placeholder instead of an empty row, so the
 * footer keeps a stable height and the label is always discoverable.
 */
function sessionNameSegment(ctx, theme) {
  const prefix = "Session name: ";
  const name = ctx.sessionManager.getSessionName()?.trim();
  if (!name) {
    return { plain: prefix + NO_SESSION_NAME, colored: theme.fg("dim", prefix + NO_SESSION_NAME) };
  }
  return { plain: prefix + name, colored: theme.fg("dim", prefix) + theme.fg("accent", name) };
}

/**
 * Summary of the MCP servers for the footer.
 *
 * The connected count alone says little, because the adapter starts servers
 * on demand, so 0 connected is the normal state. What matters is what is
 * running right now, and what is broken. Returns null when there is
 * nothing worth showing.
 */
export function mcpSummary(status) {
  const servers = status.servers ?? [];
  const broken = servers.filter((server) => server.status === "failed" || server.status === "needs-auth" || server.status === "blocked");
  const live = servers.filter((server) => server.status === "connected");
  const names = (list) => {
    const shown = list.slice(0, 2).map((server) => server.name).join(", ");
    return list.length > 2 ? `${shown} +${list.length - 2}` : shown;
  };
  if (broken.length > 0) {
    return { plain: `mcp ! ${names(broken)}`, tone: "warning" };
  }
  if (live.length > 0) {
    return { plain: `mcp ${names(live)}`, tone: "success" };
  }
  return null;
}

function sumUsageTotals(sessionManager) {
  const totals = { input: 0, output: 0, cost: 0 };
  for (const entry of sessionManager.getEntries()) {
    let usage;
    if (entry.type === "message" && (entry.message.role === "assistant" || entry.message.role === "toolResult")) {
      usage = entry.message.usage;
    } else if ((entry.type === "branch_summary" || entry.type === "compaction") && entry.usage) {
      usage = entry.usage;
    }
    if (!usage) continue;
    totals.input += usage.input || 0;
    totals.output += usage.output || 0;
    totals.cost += usage.cost?.total || 0;
  }
  return totals;
}

export default function fleetFooter(pi) {
  let lastCtx = null;
  let mcpStatus = null;
  let footerInstalled = false;
  let footerDataRef = null;

  pi.events.on(MCP_STATUS_EVENT, (snapshot) => {
    mcpStatus = snapshot;
  });

  function installFooter(ctx) {
    if (footerInstalled || !ctx.hasUI || ctx.mode !== "tui") return;
    footerInstalled = true;

    ctx.ui.setFooter((_tui, theme, footerData) => {
      footerDataRef = footerData;
      return {
        render(width) {
          try {
            return renderLines(width, theme);
          } catch {
            return [""];
          }
        },
        dispose() {
          footerDataRef = null;
        },
      };
    });
  }

  function statusSegments(ctx, theme) {
    // Plain text and colored variants are built together so layout math
    // can use plain lengths (ANSI codes have no visible width).
    const segments = [];
    const push = (priority, plain, colored) => segments.push({ priority, plain, colored });

    const totals = sumUsageTotals(ctx.sessionManager);
    const tokensPlain = `↑${formatTokens(totals.input)} ↓${formatTokens(totals.output)}`;
    push(3, tokensPlain, theme.fg("muted", tokensPlain));

    if (totals.cost > 0) {
      const costPlain = `$${totals.cost.toFixed(3)}`;
      push(1, costPlain, theme.fg("text", costPlain));
    }

    const contextUsage = ctx.getContextUsage();
    if (contextUsage) {
      const percent = contextUsage.percent;
      const plain = percent === null ? `?/${formatTokens(contextUsage.contextWindow)}` : `${Math.round(percent)}%`;
      let token = "text";
      if (percent !== null && percent > 90) token = "error";
      else if (percent !== null && percent > 70) token = "warning";
      push(0, plain, theme.fg(token, plain));
    }

    if (mcpStatus) {
      const summary = mcpSummary(mcpStatus);
      if (summary) push(2, summary.plain, theme.fg(summary.tone, summary.plain));
    }

    if (ctx.model) {
      let plain = ctx.model.id;
      if (ctx.model.reasoning && ctx.thinkingLevel && ctx.thinkingLevel !== "off") {
        plain += ` · ${ctx.thinkingLevel}`;
      }
      push(0, plain, theme.fg("accent", plain));
    }

    return segments;
  }

  function renderLines(width, theme) {
    const ctx = lastCtx;
    if (!ctx) return [""];

    // Keep the notes inside the same horizontal band as the input block.
    const inset = blockInset(width);
    const contentWidth = blockContentWidth(width);
    const gutter = " ".repeat(inset);

    const sep = { plain: " · ", colored: theme.fg("dim", " · ") };

    return [
      pathRow(ctx, theme, contentWidth, gutter, sep),
      sessionNameRow(ctx, theme, contentWidth, gutter),
    ];
  }

  // The path leads the first row and the status segments share it on the right.
  // The branch sits next to the path but gives up its room like a droppable
  // status segment, and the path itself is cut only as a last resort.
  function pathRow(ctx, theme, contentWidth, gutter, sep) {
    const prefix = "Pwd: ";
    const path = shortenCwd(ctx.cwd);
    const branch = footerDataRef?.getGitBranch();
    let statuses = statusSegments(ctx, theme);
    let branchSegment = branch ? { priority: 2, plain: `⎇ ${branch}` } : null;

    const plainOf = (segments) => segments.map((s) => s.plain).join(sep.plain);
    const leftPlain = () => prefix + path + (branchSegment ? sep.plain + branchSegment.plain : "");

    // Drop the cheapest segment (highest priority number) until the row fits.
    while (leftPlain().length + 2 + plainOf(statuses).length > contentWidth) {
      const droppable = [...statuses.filter((s) => s.priority > 0), ...(branchSegment ? [branchSegment] : [])];
      if (droppable.length === 0) break;
      const worst = droppable.reduce((a, b) => (b.priority > a.priority ? b : a));
      if (worst === branchSegment) branchSegment = null;
      else statuses = statuses.filter((s) => s !== worst);
    }

    const rightPlain = plainOf(statuses);
    const rightColored = statuses.map((s) => s.colored).join(sep.colored);
    const room = contentWidth - rightPlain.length - (rightPlain ? 2 : 0);
    const pathText = truncatePlain(path, Math.max(room - prefix.length, 0));

    let colored = theme.fg("dim", prefix) + theme.fg("text", pathText);
    let leftPlainLength = prefix.length + pathText.length;
    if (branchSegment) {
      colored += sep.colored + theme.fg("accent", branchSegment.plain);
      leftPlainLength += sep.plain.length + branchSegment.plain.length;
    }

    const padding = contentWidth - leftPlainLength - rightPlain.length;
    const gap = rightPlain ? Math.max(padding, 2) : 0;
    return gutter + colored + " ".repeat(gap) + rightColored + gutter;
  }

  // The session name gets its own row, so a long name competes with nothing.
  function sessionNameRow(ctx, theme, contentWidth, gutter) {
    const name = sessionNameSegment(ctx, theme);
    const namePlain = truncatePlain(name.plain, contentWidth);
    const nameColored = namePlain === name.plain ? name.colored : theme.fg("dim", namePlain);
    return gutter + nameColored + gutter;
  }

  const track = (_event, ctx) => {
    lastCtx = ctx;
    installFooter(ctx);
  };

  pi.on("session_start", track);
  pi.on("session_info_changed", track);
  pi.on("agent_start", track);
  pi.on("agent_end", track);
  pi.on("turn_end", track);
  pi.on("message_end", track);
  pi.on("model_select", track);
  pi.on("thinking_level_select", track);
  pi.on("session_compact", track);
}
