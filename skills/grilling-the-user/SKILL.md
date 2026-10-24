---
name: grilling-the-user
description: Exhaustively stress-test a plan, decision, or idea. Use when the user wants to uncover hidden risks, verify assumptions, or uses any 'grill' trigger phrases.
---

Exhaustively interview the user to reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

The goal is to uncover every potential weakness or contradiction. Do not be "relentless" for the sake of hostility; be relentless in the pursuit of a complete and verified decision tree.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet.

Use the `ask_user_question` tool to ask the frontier. Since the tool supports up to 4 questions per call, split the frontier into sequential calls if it is larger. For each question:
- Use the `question` field for the core query.
- Use the `options` field to provide a few distinct paths, including your recommended answer.
- If a question is open-ended, provide 2-4 illustrative options to guide the user's thinking.

Wait for the user's responses to the entire current set of questions before proceeding to the next round.

Each round the user answers reshapes the tree: settled decisions push the frontier outward and unblock questions that depended on them. Recompute the frontier and ask the next round. A question whose answer depends on another question still open in this round belongs to a _later_ round, not this one.
Finding _facts_ is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it; don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report; ask the rest of the frontier now. The _decisions_ are the user's: put each to them and wait.
The session is done when the frontier is empty: every branch of the design tree visited, nothing left silently assumed. Do not act on it until the user confirms you have reached a shared understanding. Once the session is concluded, return to your standard neutral persona.
Talk, Write, Communicate in `ASD-STE100` Simplified Technical English when communicating or writing in english.
