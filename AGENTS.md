# General working preferences

## Communication
- Reply in the language of the user's latest request, unless they explicitly request another language. Quoted text, code, and tool output do not determine the reply language.
- Use ASD-STE100 Simplified Technical English when writing in English, not as a reason to switch languages.
- Be concise and direct. Explain important design decisions and trade-offs.
- Surface blockers and ambiguity. Ask when a concrete decision is needed to proceed.
- Give brief progress updates during larger tasks.

## Coding
- Write code, identifiers, comments, docstrings, and commit messages in English. Preserve the requested language of UI text and other deliverables.
- Understand the relevant code before modifying it. Treat code as the source of truth and documentation as a fallback. Check the current version when consulting local or external sources.
- Make the smallest maintainable change that fully solves the task. Preserve existing architecture, conventions, and style; do not refactor unrelated code.
- Complete affected callers, tests, fixtures, configuration, and exports when a change requires them.
- Prefer existing utilities and dependencies, then platform features or the standard library. Add dependencies only when they provide clear value.
- Use meaningful, accurate names. Add comments only when intent is not clear from the code.
- Do not put agent, skill, or tool markers in code or commits. Comments must make sense without knowledge of the tooling used.
- Reassess surrounding code after a change. Keep complexity only when current requirements justify it.

### Core Coding Standards
- **Strict Adherence to Project Conventions:** Systematically align with the repository's established coding style and documentation standards.
- **Intent-Based Naming ("What" vs. "How"):** Name functions and variables based on their purpose (what they do) rather than their implementation details (how they do it).
- **Elimination of Semantic Noise:** Avoid generic names and negative qualifiers (naming what a function *doesn't* do) that clutter the context without adding value.
- **Robust Behavioral Testing:** Implement deep, meaningful tests that cover edge cases and system integrity, rather than just verifying the most recent change.
- **Simplified Language:** Use simple, direct, and accessible English in all code and comments to maximize clarity and maintainability.

## Verification
- Run the most relevant available checks after changes, starting with targeted tests. Run broader tests, formatting, linting, and type checks when relevant.
- Add or update a focused test for non-trivial behavior changes.
- Report only checks actually run. State what could not be checked and why.

## Safety
- Do not delete or overwrite unrelated user work.
- Do not run destructive commands unless clearly required.
- Do not modify secrets, credentials, or environment configuration unless explicitly requested.
- Do not commit, push, deploy, publish, or open a PR unless explicitly requested.

## Documentation
- Update documentation when behavior, public APIs, configuration, or workflows change. Keep it proportional to the change.
- Document only the current state. Replace outdated behavior instead of adding a change history.

## Process cleanup
- Before finishing, stop long-running processes you started. Never stop unrelated processes.
