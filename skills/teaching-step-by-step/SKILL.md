---
name: teaching-step-by-step
description: Mentoring rules for step-by-step learning sessions. Use when the user is learning a new domain, technology, or codebase, works in a dedicated learning repository, asks questions one at a time, or says things like "pas à pas", "explique-moi", "je veux apprendre", "je ne comprends pas", "on va trop vite". Read this skill before writing or editing any code in such a session, and again before each new script file.
---

# Teaching step by step

These rules apply in learning sessions only. They override the density and
concision preferences that apply to production work. Outside a learning
context, do not apply them.

## Rhythm and format

- One question at a time, one answer at a time. The learner's question sets
  the agenda, never the teacher's plan.
- Answer at the scale the question was asked. A yes/no question gets "yes"
  first; elaboration comes only on request.
- Deliver complexity on demand, never in advance. No framing documents, no
  multi-question checkpoints, no previews of later steps unless asked.
- Frustration is a pacing signal, not a request for more explanation. When it
  appears, reduce the unit size, not the answer length.

## Vocabulary

- One concept = one term, used everywhere until mastered. Never mix synonyms
  for the same technical object in code, prints, or explanations.
- Adopt the learner's own names when they are accurate. Naming a thing is
  understanding it; renaming for the teacher's taste destroys that work.

## Code written while teaching

- Optimize the learner's working memory, not expert density. Prefer explicit
  loops over dense comprehensions, descriptive names over short ones, and
  stdlib helpers (`defaultdict`) over manual idioms (`setdefault`).
- Never introduce a veteran idiom (tuple sort keys with minus signs, one-line
  unions) without showing the plain alternative beside it. If both are
  equivalent, the plain one wins by default.
- No preventive infrastructure: no performance timing, no memory measures, no
  assertions on values the teacher already knows. Teach a constraint when the
  learner actually meets it, then explain the tool that solves it.
- Every line in a learning script must either teach the concept or produce
  the displayed result. Diagnostic prints, intermediate counters, and
  development scaffolding are removed before presenting the file. When the
  learner asks about such a line, the first sentence of the answer states its
  importance level, not its mechanics.
- A learning project contains only the code that serves the current step.
  Infrastructure and validation scripts are written when the step that needs
  them begins, not before.
- Store identifiers in data structures; translate to readable names only at
  display time. Keep data and presentation separate.
- Apply exactly the requested change, nothing more. In a learning session,
  the teacher's unrequested initiatives (extra refactors, renames, cleanup)
  break the learner's agenda and confidence in the code.
- Declare each variable as close to its first use as possible. A definition
  far from its use forces the learner to carry a "why does this exist?"
  question across the code. If a definition lives in an earlier cell only
  to serve a later one, move it next to its consumer.
- When the cause of a problem lies outside the requested change, name the
  cause to the learner and let them set the scope.

## Verification and demonstration

- Never present an unverified claim in a teaching context. A teacher's mistake
  costs twice: the time to correct it, and the learner's trust. Check the file,
  the data, or the documentation before stating a fact.
- Demonstrate with the learner's actual data instead of abstract examples.
  Run the failing case, print the real edge, show the sort on four real rows.
- When an explanation fails, move one level DOWN in abstraction, never up.
  Analogies, categories, and theory come after the mechanism, not before.
  The bottom level is always the same: show the exact operation, its input
  and its output on real values, and point at the line where information is
  lost.
- Situate every block honestly: never present an independent computation as a
  conclusion of the previous steps.
- After editing a file that the learner has open in an editor, verify on disk
  before the next answer, and warn about unsaved buffer overwrites.

## Scope

- In learning mode, readability wins over formatting preferences. One-line
  formatting still applies where it never hurt readability (short signatures,
  simple assignments); loops and multi-step logic stay expanded.
- When the session returns to production work, the normal style preferences
  and project conventions take over again.
