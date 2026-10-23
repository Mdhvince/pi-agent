---
description: Deep review of an external PR with context analysis (tickets/linked PRs)
argument-hint: "<PR_ID or URL>"
---
Review the PR $ARGUMENTS following these strict guidelines:

### 1. Research Phase (Mandatory)
Before analyzing the code, you must fully understand the "Why":
- **Ticket Analysis:** Find the associated ticket. Read its requirements and goals.
- **Connectivity Check:** Search for and analyze any linked tickets or other PRs (open or closed) that provide essential context or depend on this change.
- **Context Mapping:** Identify how this change affects the surrounding system.

### 2. Review Checklist
Evaluate the PR by answering these questions:
- [ ] **Correctness:** Does the implementation accurately solve the core problem defined in the ticket?
- [ ] **Design Quality:** Does the solution follow sound architectural patterns and project standards?
- [ ] **Maintainability:** Is the code easy to understand and modify for future developers?
- [ ] **Simplicity:** Is this the simplest way to achieve the result, or is it over-engineered?
- [ ] **Test Quality:** Do the tests cover edge cases and protect against regressions, rather than just the "happy path"?
- [ ] **Regressions:** Does this change introduce any side effects or break existing functionality?
- [ ] **Security:** Does the implementation introduce any vulnerabilities or safety risks?
- [ ] **Consistency:** Does the style and approach align with the rest of the codebase?

**Mindset:** The goal is NOT to find as many comments as possible. The goal is to determine whether the change improves the overall health of the codebase without introducing unacceptable risk.

### 3. Review Standards
- **No Bias:** Evaluate the code based on technical merit and project standards, not on the author.
- **Project Alignment:** Ensure the PR respects the project's coding conventions.
- **Zero Direct Interaction:** DO NOT post any comments, labels, or reviews directly to the PR/GitHub. All feedback must be delivered here in the chat.

### 4. Response Format
Your response must follow this exact structure:

**Summary Table:**
| PR ID | The Problem | Solution Provided by PR | Complexity (LOW/MEDIUM/HIGH) |
| :--- | :--- | :--- | :--- |
| $ARGUMENTS | [Describe the issue being solved] | [Describe the technical approach] | [Level] |

_The complexity here refers to the complexity of the proposed solution of the PR's author_

**Findings (Only the blockers):**
If there are issues, list them as follows:
- `[file_path:line_number]` - **Issue:** [Description] $\rightarrow$ **Proposed Change:** [Suggestion]

Then reply to this question: how would you translate this in a polite and actionable comment ? (but do not say the PR is good if there are blockers, do not put the impression that the comment is optional.)

--
If there are no issues, simply write: **"All good"**.
