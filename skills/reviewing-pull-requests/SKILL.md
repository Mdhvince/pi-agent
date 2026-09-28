---
name: reviewing-pull-requests
description: How to write and post pull request review comments.
---
# Reviewing Pull Requests

## Goal

Review pull requests for:

- correctness
- design quality
- maintainability
- simplicity
- test quality
- regressions
- security
- consistency with the existing codebase

The goal is NOT to find as many comments as possible.

The goal is to determine whether the change improves the overall health of the codebase without introducing unacceptable risk.

---

# Core Rule

Review the change in this order:

```text
Requirement
-> Behavior
-> Design
-> Correctness
-> Tests
-> Maintainability
-> Security
-> Style
```

Do NOT prioritize formatting, naming, or minor style issues over correctness and design.

---

# Before Reviewing

The agent MUST first understand:

1. What problem is being solved?
2. What behavior is expected?
3. What is explicitly in scope?
4. What is explicitly out of scope?
5. What existing behavior must remain unchanged?
6. What risks does this change introduce?

The agent SHOULD inspect:

- PR description
- issue / specification
- acceptance criteria
- related code
- existing tests
- nearby patterns in the codebase

Do NOT review a diff in isolation when surrounding context is necessary.

---

# Review the Change, Not the Author

Comments MUST focus on:

- code
- behavior
- design
- risks
- maintainability

Comments MUST NOT:

- attack the author
- speculate about competence
- use humiliating language
- turn personal preference into a requirement

Prefer:

```text
This can produce a race condition because...
```

Avoid:

```text
You implemented this incorrectly.
```

---

# Correctness

The agent MUST verify that the implementation actually satisfies the requirement.

Ask:

- Does the code implement the requested behavior?
- Are acceptance criteria satisfied?
- Are important cases missing?
- Could the implementation produce incorrect results?
- Are failure cases handled correctly?
- Are boundaries handled correctly?
- Could existing behavior regress?

Do NOT assume correctness because:

```text
CI is green
tests pass
coverage increased
the code looks clean
```

---

# Behavior

Review observable behavior before implementation details.

Ask:

- Does this change modify public behavior?
- Is that change intentional?
- Is it compatible with existing contracts?
- Are error semantics correct?
- Are side effects correct?
- Are state transitions valid?

Flag accidental behavior changes.

---

# Design

The implementation SHOULD fit naturally into the existing architecture.

Review:

- responsibilities
- abstractions
- boundaries
- dependencies
- ownership of business logic
- coupling
- cohesion

Ask:

> Is the logic located where it conceptually belongs?

Be suspicious when:

- controllers contain business logic
- repositories contain domain decisions
- DTOs contain unrelated behavior
- infrastructure leaks into domain code
- one class accumulates unrelated responsibilities

---

# Simplicity

Prefer the simplest implementation that correctly solves the requirement.

Flag unnecessary:

- abstraction
- indirection
- configuration
- generic infrastructure
- factories
- patterns
- wrappers
- layers
- premature extensibility

Ask:

> Is this complexity required by the current requirement?

Do NOT require hypothetical future flexibility without evidence that it is needed.

---

# Avoid Premature Abstraction

Do NOT encourage abstractions based only on:

```text
We might need this later.
```

Abstractions SHOULD solve an existing recurring problem.

If there is only one implementation and no meaningful abstraction boundary, additional indirection may not be justified.

---

# Scope

The PR SHOULD remain focused on the requested change.

Flag unrelated:

- refactors
- formatting
- renaming
- dependency upgrades
- architectural changes
- cleanup

when they increase review complexity without being necessary.

Prefer separate PRs for unrelated work.

---

# Change Size

Smaller PRs are easier to:

- understand
- review
- test
- revert
- debug

If a PR contains multiple independent changes, recommend splitting when practical.

Do NOT request splitting when doing so would make the implementation less coherent.

---

# Tests

Tests MUST be reviewed as critically as production code.

For test-specific rules, follow the testing skill.

At minimum, ask:

- What behavior does this test protect?
- Does it test the specification or the implementation?
- Would the test detect a meaningful regression?
- Are important scenarios missing?
- Are tests deterministic?
- Are mocks necessary?
- Are assertions meaningful?
- Are existing tests sufficient?

Do NOT approve a change solely because tests were added.

---

# Regression Risk

The agent MUST inspect how the change affects existing behavior.

Look for:

- changed defaults
- changed return values
- changed exceptions
- changed ordering
- changed serialization
- changed persistence behavior
- changed side effects
- changed public APIs
- changed event semantics
- changed authorization behavior

Ask:

> What existing caller could break because of this change?

---

# Failure Modes

Review how the change behaves when things go wrong.

Consider:

- invalid input
- missing data
- unavailable dependencies
- timeouts
- retries
- duplicate requests
- partial failures
- concurrency
- unexpected states

Only raise cases that are realistically relevant to the system.

Do NOT invent theoretical edge cases with negligible impact.

---

# Data Integrity

For changes involving persistence or state, verify:

- transactions
- atomicity
- uniqueness
- idempotency
- race conditions
- partial writes
- consistency constraints

Ask:

> Can the system end up in an invalid state?

---

# Concurrency

When shared state or parallel execution is involved, inspect for:

- race conditions
- lost updates
- duplicate execution
- check-then-act bugs
- non-atomic operations
- unsafe shared mutable state

Do NOT raise concurrency concerns without a plausible concurrent execution path.

---

# Security

For relevant changes, review:

- authentication
- authorization
- input validation
- injection risks
- secret exposure
- sensitive logging
- unsafe deserialization
- path traversal
- insecure defaults
- permission escalation
- data exposure

Security comments SHOULD explain the concrete risk.

Avoid vague comments such as:

```text
This seems insecure.
```

Prefer:

```text
This endpoint checks authentication but not ownership,
so any authenticated user could access another user's resource.
```

---

# Performance

Only raise performance concerns when they are meaningful.

Look for:

- unbounded loops
- N+1 queries
- repeated remote calls
- unnecessary large allocations
- loading entire datasets unnecessarily
- blocking operations on critical paths
- avoidable high-complexity algorithms

Do NOT block a PR for micro-optimizations without evidence that they matter.

---

# Error Handling

Errors SHOULD be:

- intentional
- useful
- consistent
- observable where necessary

Review:

- swallowed exceptions
- overly broad catches
- incorrect fallback behavior
- misleading error messages
- loss of useful context
- leaking internal details

Do NOT require defensive handling for impossible or contractually excluded states without reason.

---

# Logging

Review logs for:

- useful operational context
- appropriate level
- sensitive data exposure
- unnecessary noise
- duplicate logging

Do NOT add logs simply because a code path is new.

Logs SHOULD help diagnose meaningful operational problems.

---

# Naming

Names SHOULD communicate intent.

Review naming when it harms understanding.

Avoid blocking a PR over subjective naming preferences when the current name is already clear.

Prefer names describing domain concepts rather than implementation mechanics.

---

# Comments

Code comments SHOULD explain:

- why something exists
- why a non-obvious decision was made
- important constraints
- surprising behavior

Comments SHOULD NOT merely restate the code.

Bad:

```text
// increment counter
counter++
```

Good:

```text
// Keep this counter monotonic because downstream consumers
// use it to detect duplicated events.
```

---

# Documentation

Require documentation when the change modifies:

- public APIs
- configuration
- operational procedures
- user-facing behavior
- developer workflows
- non-obvious architectural contracts

Do NOT request documentation for trivial internal changes.

---

# Consistency

Prefer existing codebase conventions unless there is a strong reason to change them.

Check:

- architecture
- error handling
- naming
- test patterns
- serialization
- persistence patterns
- dependency usage

Do NOT introduce a new pattern merely because it is personally preferred.

---

# Duplication

Duplication is not automatically a defect.

Before requesting abstraction, ask:

- Is the duplicated behavior truly the same?
- Will the code evolve together?
- Does abstraction make the code easier to understand?

Small duplication can be better than a poor abstraction.

---

# Dead Code

Flag code that is:

- unused
- unreachable
- obsolete
- added only for hypothetical future needs

Avoid merging code with no current purpose.

---

# Dependencies

New dependencies MUST be justified.

Review:

- whether the dependency is necessary
- whether existing code already provides the capability
- maintenance cost
- security implications
- transitive complexity

Do NOT introduce a library for trivial functionality that can be implemented safely and clearly without it.

---

# Backward Compatibility

When changing existing interfaces, verify:

- existing callers
- API compatibility
- database compatibility
- event compatibility
- serialized formats
- configuration compatibility

Breaking changes MUST be intentional.

---

# Migration Safety

For database or schema changes, inspect:

- backward compatibility
- rollout order
- large table impact
- locks
- default values
- nullable transitions
- old and new application versions running simultaneously

Avoid deployments that require perfect synchronization unless explicitly acceptable.

---

# Review Comments

Every comment SHOULD clearly communicate:

1. What is wrong or risky?
2. Why does it matter?
3. What outcome is expected?

Prefer:

```text
This can create duplicate orders if the request is retried because
the operation is not idempotent. Can we use the request id as a
deduplication key?
```

Avoid:

```text
This is bad.
```

---

# Comment Severity

The agent MUST distinguish blocking issues from optional suggestions.

Use these categories:

```text
BLOCKER
```

The change should not merge until resolved.

Examples:

- incorrect behavior
- data loss
- security vulnerability
- serious regression
- broken contract

```text
IMPORTANT
```

Should normally be fixed before merge.

Examples:

- significant maintainability problem
- missing important test
- unnecessary architectural complexity
- realistic failure case not handled

```text
SUGGESTION
```

Improvement that is not required for correctness.

Examples:

- clearer naming
- simpler expression
- minor refactor

```text
NIT
```

Very minor, optional issue.

Examples:

- small wording improvement
- minor style preference

Do NOT present optional preferences as blockers.

---

# Blocking Standard

A PR does NOT need to be perfect.

Do NOT block solely because:

- another design is slightly cleaner
- code could theoretically be more generic
- naming could be marginally better
- personal style differs
- unrelated cleanup could be done

Block when the current change creates meaningful risk or worsens the health of the codebase.

---

# Ask Before Blocking

Before raising a blocking comment, ask:

> What concrete problem occurs if this merges as-is?

If there is no meaningful answer, the comment probably should not be blocking.

---

# Avoid Review Noise

Do NOT generate comments merely to appear thorough.

Do NOT comment on every file.

Do NOT repeat the same issue multiple times.

If the same problem appears repeatedly:

1. comment on one representative example
2. explain that it applies to similar occurrences

Optimize for signal, not volume.

---

# Do Not Rewrite the PR

The reviewer should identify problems and expected outcomes.

Do NOT unnecessarily redesign the entire implementation for the author.

Prefer:

```text
This creates a dependency from the domain layer to infrastructure.
Can we keep this boundary in the adapter layer?
```

over providing a complete alternative architecture unless needed.

---

# Avoid Style Wars

Do NOT block on formatting or style that should be enforced automatically.

Prefer:

- formatter
- linter
- static analysis

over human review comments.

Human review time should focus on things tools cannot reliably determine.

---

# AI Reviewer Rules

The AI reviewer MUST:

1. Understand the requirement before judging the implementation.
2. Inspect relevant surrounding code.
3. Prioritize correctness and behavior.
4. Review design and complexity.
5. Review tests critically.
6. Look for regressions.
7. Consider realistic failure modes.
8. Consider security when relevant.
9. Distinguish blockers from suggestions.
10. Explain why each important comment matters.
11. Avoid duplicate comments.
12. Avoid subjective nitpicking.
13. Avoid proposing unnecessary abstraction.
14. Avoid commenting only for stylistic preference.
15. Prefer a small number of high-value findings.

---

# AI Reviewer MUST NOT

The reviewer MUST NOT:

- approve solely because CI passes
- reject solely because coverage decreased
- require a test for every method
- require abstractions for hypothetical future use
- redesign code without a concrete problem
- enforce personal preferences as rules
- fabricate requirements
- invent edge cases with no realistic relevance
- claim a bug without explaining the failure scenario
- overwhelm the author with low-value comments
- repeat automated linter feedback unnecessarily

---

# Review Output

When reviewing a PR, prioritize findings by impact.

Prefer:

```text
1. BLOCKER — authorization can be bypassed
2. IMPORTANT — retry can create duplicate orders
3. IMPORTANT — missing regression test for cancellation
4. SUGGESTION — duplicated validation could be simplified
```

Do NOT prioritize by file order.

---

# Final Review Checklist

Before approving, verify:

- [ ] The implementation satisfies the requirement.
- [ ] No obvious regression was introduced.
- [ ] Public contracts remain valid.
- [ ] Design fits the existing architecture.
- [ ] Complexity is justified.
- [ ] Important failure cases are handled.
- [ ] Tests protect meaningful behavior.
- [ ] Security implications were considered where relevant.
- [ ] Data integrity is preserved.
- [ ] No unnecessary scope was introduced.
- [ ] Blocking comments represent concrete risks.
- [ ] Optional comments are clearly marked as optional.
- [ ] Talk, Write, Communicate in `ASD-STE100` Simplified Technical English when communicating or writing in english.


---

# Final Decision Rule

Ask:

> Does this change improve or preserve the overall health of the codebase while correctly implementing the required behavior?

Do NOT ask:

> Is this exactly how I would have implemented it?

Review for correctness and maintainability, not personal preference.