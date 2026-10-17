const MCP_STATUS_EVENT = "pi-mcp-adapter/status/v1";

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

  function buildSegments(ctx, theme) {
    // Plain text and colored variants are built together so layout math
    // can use plain lengths (ANSI codes have no visible width).
    const segments = [];
    const push = (priority, plain, colored) => segments.push({ priority, plain, colored });

    const branch = footerDataRef?.getGitBranch();
    const project = shortenCwd(ctx.cwd);
    push(0, project, theme.fg("text", project));
    if (branch) push(2, `⎇ ${branch}`, theme.fg("accent", `⎇ ${branch}`));

    return segments;
  }

  function installFooter(ctx) {
    if (footerInstalled || !ctx.hasUI || ctx.mode !== "tui") return;
    footerInstalled = true;

    ctx.ui.setFooter((_tui, theme, footerData) => {
      footerDataRef = footerData;
      return {
        render(width) {
          try {
            return [renderLine(width, theme)];
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

  function renderLine(width, theme) {
    const ctx = lastCtx;
    if (!ctx) return "";

    const sep = { plain: " · ", colored: theme.fg("dim", " · ") };
    const left = buildSegments(ctx, theme);

    // Right-side segments, cheapest-to-drop first is handled via priority below.
    const right = [];
    const push = (priority, plain, colored) => right.push({ priority, plain, colored });

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
      const total = mcpStatus.servers.length - mcpStatus.disabledCount;
      const failing = mcpStatus.servers.some((server) => server.status === "failed" || server.status === "needs-auth");
      const plain = `mcp ${mcpStatus.connectedCount}/${total}`;
      push(2, plain, theme.fg(failing ? "warning" : "success", plain));
    }

    if (ctx.model) {
      let plain = ctx.model.id;
      if (ctx.model.reasoning && ctx.thinkingLevel && ctx.thinkingLevel !== "off") {
        plain += ` · ${ctx.thinkingLevel}`;
      }
      push(0, plain, theme.fg("accent", plain));
    }

    // Drop lowest-priority segments (highest number first) until the line fits.
    const line = (leftSegs, rightSegs) => {
      const leftPlain = leftSegs.map((s) => s.plain).join(" ");
      const rightPlain = rightSegs.map((s) => s.plain).join(sep.plain);
      return { plainLength: leftPlain.length + 2 + rightPlain.length, leftPlain };
    };
    let leftSegs = [...left];
    let rightSegs = [...right];
    while (line(leftSegs, rightSegs).plainLength > width) {
      const droppable = [...rightSegs, ...leftSegs].filter((s) => s.priority > 0);
      if (droppable.length === 0) break;
      const worst = droppable.reduce((a, b) => (b.priority > a.priority ? b : a));
      leftSegs = leftSegs.filter((s) => s !== worst);
      rightSegs = rightSegs.filter((s) => s !== worst);
    }

    let leftPlain = leftSegs.map((s) => s.plain).join(" ");
    let leftColored = leftSegs.map((s) => s.colored).join(" ");
    const rightPlain = rightSegs.map((s) => s.plain).join(sep.plain);
    const rightColored = rightSegs.map((s) => s.colored).join(sep.colored);

    let padding = width - leftPlain.length - rightPlain.length;
    if (padding < 2) {
      const keep = Math.max(width - rightPlain.length - 2 - 1, 0);
      leftPlain = `${leftPlain.slice(0, keep)}…`;
      leftColored = theme.fg("text", leftPlain);
      padding = width - leftPlain.length - rightPlain.length;
    }
    return leftColored + " ".repeat(Math.max(padding, 2)) + rightColored;
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
