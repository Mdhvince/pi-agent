# General working preferences

## Coding
- Prefer simple, maintainable solutions over clever abstractions.
- ALWAYS code in english
- Understand the relevant code before modifying it.
- Make the smallest change that fully solves the task.
- Preserve existing architecture and conventions unless there is a clear reason not to.
- Do not refactor unrelated code.
- Always use meaningful and truthful names for variables/functions/classes
- Always avoid overengineering when implementing changes, and reassess the surrounding code afterward. New complexity should be justified by the current requirements, and complexity that made sense before the change may no longer be necessary after it.
- Match the existing style and patterns of the repository.
- Prefer existing utilities and dependencies over introducing new ones.
- Avoid adding dependencies unless they provide clear value.
- Add comments only where intent is not obvious from the code.
- Never write agent, skill, or tool markers in code or commits (e.g. `# ponytail:`, `# shortcut:`); code comments must make sense to a reader who knows nothing about the tooling that wrote them.
- The source of thruth is the code, with documentation only as fallback (Trust code over documentations and comments)
- When checking for other sources (e.g local repo), always make sure you are checking the most up-to-date version

## Communication
- Be concise and direct.
- Talk, Write, Communicate in `ASD-STE100` Simplified Technical English.
- Explain important design decisions and tradeoffs if applicable.
- Surface blockers or ambiguity rather than silently guessing, ask the user.
- For larger tasks, provide brief progress updates while working.

## Verification
- After changes, run the most relevant available checks.
- Prefer targeted tests first, then broader checks when appropriate.
- Run formatting/linting/type-checking when relevant.
- Do not claim a check passed unless it was actually run.
- If a check cannot be run, say why.

## Safety
- Do not delete or overwrite unrelated user work.
- Do not run destructive commands unless clearly required.
- Do not modify secrets, credentials, or environment configuration unless explicitly requested.
- Do not commit, push, deploy, publish, or open a PR unless explicitly requested.

## Documentation
- Update documentation when behavior, public APIs, configuration, or workflows change.
- Keep documentation proportional to the change.
- Documentation must no state historical changes, only current state. So replace old documented behavior by the new one 
as if it were the only behavior.

## Process cleanup
- Before finishing a task, stop any long-running process you started. Never stop unrelated processes.
