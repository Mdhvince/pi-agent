---
description: Audit of PR comments to filter noise and validate technical claims
argument-hint: "<PR_ID or URL>"
---
Analyze the comments posted on PR $ARGUMENTS. Your goal is to act as an impartial technical arbitrator, filtering out noise and validating technical claims.

### 1. Isolation & Analysis Phase
For each significant comment, follow this process:
- **Scope Check:** Is the comment directly related to the goals of the associated ticket? If it asks for unrelated changes, mark it as "Out of Scope".
- **Technical Validation:** Do not trust the comment blindly. If a bug or edge case is mentioned, attempt to reproduce it by analyzing the code or running a targeted test/script.
- **Contextual Link:** Is the comment based on a misunderstanding of the PR's intent or a linked ticket?

### 2. Independent Thinking Clause
You must avoid "Sycophancy". Do not agree with a comment just because it was written by a human. Only validate a comment if you can prove it technically or if it aligns with the project's core standards.

### 3. Review Standards
- **Zero Direct Interaction:** DO NOT reply to the PR or post any comments on GitHub.
- **Concise Synthesis:** Simplify the human language of the comments into technical facts.

### 4. Response Format
Your response must follow this exact structure:

**Comment Audit Table:**
| Comment (Simplified) | Problem Raised | Status (Valid / Invalid / Out of Scope) | Proof/Reasoning | Suggestion |
| :--- | :--- | :--- | :--- | :--- |
| [Short summary of the feedback] | [The technical risk or issue] | [Status] | [Why? Result of test or logic] | [How to fix or why to ignore] |

If no comments need action, simply reply: **"All comments are either noise or already addressed."**
