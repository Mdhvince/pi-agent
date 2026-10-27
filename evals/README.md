# Evaluating Pi setup changes

This guide describes manual checks. It does not install an automatic runner,
replay tasks, or make model calls. Obtain approval for the inputs, scope, model
allowance, and run limit before an evaluation.

## Version-controlled setup

The repository's Git allowlist includes the non-secret `settings.json`, selected
local extensions and tests, the `fleet-dark` theme, and this guide, alongside
instructions, skills, and prompt templates. Review any added settings or files
for secrets before committing. Credentials, MCP connection configuration,
sessions, installed dependencies, and evaluation outputs stay ignored.

The npm package sources in `settings.json` use exact versions. Pi reuses an
installed package when its version matches the configured version. Updating a
pinned package requires an explicit change to that version. These pins do not
freeze Pi itself, transitive dependencies, or provider-side model changes; record
those separately when they matter to an evaluation.

Run the local configuration checks from the agent repository with:

```sh
node --test tests/*.test.mjs
```

## Language checks

Use these short requests to check the global reply-language policy:

| Request | Expected behavior |
| --- | --- |
| `Explique en deux phrases ce qu'est un fichier JSON. N'utilise aucun outil.` | French explanation |
| `Explain in two sentences what a JSON file is. Do not use tools.` | English explanation |
| `Réponds en anglais, en une seule phrase : à quoi sert un test de régression ? N'utilise aucun outil.` | English reply despite the French request |

Run each request in a fresh session using the same configured model and reasoning
level. Disable tools, extensions, MCP, skills, and prompt templates so the checks
exercise the global instructions without external actions. For example:

```sh
PI_OFFLINE=1 pi --mode json --no-session --no-extensions --no-mcp \
  --no-tools --no-skills --no-prompt-templates --no-approve \
  "Explique en deux phrases ce qu'est un fichier JSON. N'utilise aucun outil."
```

`PI_OFFLINE=1` disables automatic background network activity, not the requested
model call. The call still uses the model allowance. Impose a 90-second limit per
run and stop on failure rather than starting an unapproved retry or substitute
model. These checks do not test the full extension-enabled setup or guarantee
that every future response follows the policy.

When launching Pi from another process, close the child's stdin or use an ignored
stdin stream. Otherwise, Pi waits for end-of-input before sending the prompt.

## A/B comparison

1. Choose one observed failure and one candidate setup change. Preserve the
   unchanged baseline. Record the starting repository revision, component files,
   model, reasoning level, and tool configuration without copying secrets.
2. Define success from the task requirements before inspecting candidate results.
   Use existing tests, artifact checks, or source comparisons when available.
   Keep the evaluator's expected answers separate from the agent's inputs.
3. Start baseline and candidate runs from identical task inputs in separate clean
   workspaces. Keep model, tool access, time limit, and total budget fixed. Include
   proposal and review costs when comparing the complete improvement process.
4. Check the actual deliverables, not just the final explanation or process exit
   code. Reopen documents; run code tests; inspect rendered UI when relevant.
5. Treat a single pair as exploratory. Repeat within an approved budget before
   attributing a difference to the change. Check a separate task not used to
   design the change. Do not silently discard failed runs.
6. Keep the baseline when the change does not show enough benefit or introduces
   an unacceptable regression. Ask before promoting a change or retaining a
   library entry. No automatic global setup edits.

Record one row per run:

| Task | Setup | Model / reasoning | Checks and result | Total tokens / cost | Elapsed time | Tool errors | User corrections | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Pi's JSON event stream provides completed messages, provider-reported usage, and
tool execution events. Use completed messages once; do not sum every cumulative
stream update. Include every participating agent's usage. Record unavailable
costs as unknown, not zero. A selector's preference is not a correctness check.

## MCP approval checks

The adapter's `approveTools` lists gate known write and high-impact tools,
including browser interactions and code execution. Qonto requires approval for
every call because its cached tool catalog is unavailable. Ordinary unlisted
reads remain available without an approval prompt.

Explicit names are checked independently of server-provided safety hints. New
or renamed tools outside Qonto are not automatically covered: review the policy
when the catalog changes. Use the installed adapter's approval matcher for
offline checks; do not test a write gate by sending a real email or changing DNS.

Without a matching prior grant or approval broker, gated headless calls fail
closed. Prefer **Allow once** for sensitive actions. **Allow server for this
session** grants all tools and arguments on that server, including future tools.
These approvals are not an operating-system or network sandbox.

## Isolation

Language-only checks must have no tools. For task executions that need tools,
use synthetic fixtures or a disposable environment with only the required files
and access. Do not mount the host's Pi agent directory or credential stores into
that environment. Keep any required provider credential narrowly scoped or
outside the execution environment through an approved proxy.

A fresh session, separate directory, or Git worktree is not a security boundary.
Disabling Pi's built-in MCP does not disable a third-party MCP extension; review
the actual loaded extensions and tools. Headless runs must not bypass approvals
just to make a test pass.

Never replay invoice finalization, email sends, payments, purchases, deployment,
DNS changes, or other production writes. Use fixtures or explicitly approved
service test environments. A timeout does not prove that a write failed.

Keep outputs local and redact sensitive data before retaining or sharing them.
Only this guide is allowed by Git in the evaluation folder; run outputs remain
ignored.
