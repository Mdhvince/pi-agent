---
description: Deep review of an external PR with context analysis (tickets/linked PRs)
argument-hint: "<PR_ID or URL>"
---
Review the PR $ARGUMENTS following these strict guidelines:

### 1. Research Phase (Mandatory)
Before analyzing the code, understand the "Why":
- **Read-Only Inspection:** Never mutate the shared working tree, branches, local environment, or secrets. Use read-only inspection or an isolated temporary checkout, and clean up afterward.
- **Ticket & Scope:** Read the associated ticket and map each acceptance criterion as met, unmet, or unverifiable (stating how you checked).
- **Connectivity & Stack:** Check linked tickets and related/stacked PRs. To confirm whether an issue is pre-existing or fixed downstream, inspect the other PR's **diff** on touched files—never rely on its description or file list.
- **Context Mapping:** Identify how this change affects the surrounding system.

### 2. Review Focus & Severity
Evaluate **Correctness**, **Regressions**, **Security**, **Test Coverage** (edge cases, not just happy paths), and **Design/Maintainability** (only when it creates real architectural or operational risk—not style nits).

**Mindset:** The goal is NOT to maximize comments, but to determine whether the change improves codebase health without introducing unacceptable risk.

**Severity (Report BLOCKERs and GAPs only; omit nits and nice-to-haves):**
- **BLOCKER:** Merging makes the system worse than base or breaks a contract (bug, regression, state corruption, security vulnerability, broken CI/prod). *Test:* "If we merge as is, what exactly breaks or gets worse than base?" If you cannot name it, it is not a blocker.
- **GAP:** An acceptance criterion is unmet, but nothing regresses vs. base. Report it to me (who must decide, and whether merging auto-closes the ticket). Never classify a GAP as a BLOCKER on its own.

### 3. Review Standards
- **Independent Evidence:** Form your own view from the code before reading existing or bot reviews (treat them as leads, not proof). Before finalizing, verify every finding against the exact file and line at the reviewed commit—claim nothing beyond what the quoted line proves.
- **Anti-Sycophancy:** If a suggestion is suboptimal, constructively challenge it with technical proof and a superior alternative. Do not agree simply to be agreeable.
- **No Bias:** Evaluate the code based on technical merit and project standards, not on the author.
- **Zero Direct Interaction:** DO NOT post comments, labels, or reviews to GitHub. Deliver all feedback here in the chat.

### 4. Response Format
- Use the /how-to-reply-to-medhy skill.
- **Final Step:** Re-verify every BLOCKER against the Severity test and its quoted line; drop any that fail. Draft a polite, actionable comment for the author containing **BLOCKERs only** (omit if none; GAPs go to me, not the author).
- **Verdict:** End with ❌ (1+ BLOCKERs), ⚠️ (0 BLOCKERs, 1+ GAPs — needs decision), or ✅ (0 BLOCKERs, 0 GAPs).
