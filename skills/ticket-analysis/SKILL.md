---
name: ticket-analysis
description: Analyze tickets, gather context, and align with the user on the problem and solution before implementing. Use when starting a new ticket or feature request.
---

# Skill: Ticket Analysis & Alignment

## Purpose
This skill transforms the initial ticket reception from a "task to execute" into an "engineering problem to solve". The goal is to prevent premature implementation and ensure that both the agent and the user are aligned on the problem, the context, and the optimal solution before any code is written.

## Core Principles
- **Engineer, not Coder:** Do not treat ticket suggestions as absolute truths. Treat them as hypotheses to be verified against the codebase.
- **Anti-Sycophancy:** Prioritize objective technical truth over agreement with the ticket's author. If a suggested implementation is suboptimal or incorrect, provide technical proof and propose a superior alternative.
- **Context First:** Code is the only source of truth. Documentation and ticket descriptions are pointers; the current state of the repository is the reality.
- **Non-Rigid Guidance:** These steps are a framework for quality, not a rigid checklist. Use professional judgment to adapt the depth of analysis to the complexity of the ticket.

## Workflow

### 1. Discovery & Context Gathering
Before proposing any solution, explore the ecosystem surrounding the ticket:
- **Requirement Analysis:** Separate the "What" (the goal) from the "How" (the suggested implementation).
- **Cross-Referencing:** 
    - Search for related tickets or issues.
    - Identify open or closed PRs that modify the affected files or logic.
    - Review relevant documentation to understand the intended design.
- **Empirical Verification:** If the ticket describes a bug, attempt to reproduce it. If it describes a feature, verify the entry points in the existing architecture.

### 2. Critical Evaluation
Analyze the proposed path to ensure technical soundness:
- **Validate the "How":** Assess if the suggested implementation is the most optimal way to achieve the goal. If it is, confirm why it is appropriate. If it seems suboptimal, identify the technical reasons and suggest an improvement.
- **Impact Analysis:** Identify potential side effects or regressions in related modules.
- **Consistency Check:** Ensure the solution aligns with the project's established patterns and architecture.

### 3. Alignment Report
Once the analysis is complete, provide a concise summary to the user. Use Simplified Technical English. The report should be structured for high information density:

| Section | Content |
| :--- | :--- |
| **Problem** | A concise description of the actual need (removing noise/jargon). |
| **Context** | Key findings from related PRs, tickets, or code analysis. |
| **Evaluation** | Technical verdict on the suggested implementation (Optimal / Suboptimal / Incorrect) with brief justification. |
| **Proposed Path** | High-level technical steps to reach the goal. |
| **Risks** | Potential blockers or areas of uncertainty. |

**Conclusion:** End the report by asking for alignment: *"Does this understanding match your expectations? Shall I proceed with the implementation?"*

## Communication Standards
- **Language:** Use Simplified Technical English.
- **Style:** Direct, concise, and objective.
- **Tone:** Professional partner. Avoid excessive politeness or reflexive agreement.
