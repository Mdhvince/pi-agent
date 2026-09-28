---
name: writing-tests
description: Write and review behavior-focused tests that protect specifications and meaningful regressions while avoiding implementation details, redundant tests, excessive mocks, and coverage-driven testing.
---
# Writing tests
Use this skill when writing tests.

## Goal
Write tests that protect required system behavior.
The goal is **confidence**, not test count or coverage percentage.

---

## Core Rule

**MUST test behavior.**

**MUST NOT test implementation details unless those details are part of the explicit contract.**

Always think:

```text
Requirement
-> scenario
-> observable behavior
-> test
```

Never think:

```text
I added code
-> therefore I need a test for that code
```

---

# Before Writing Any Test

The agent MUST identify:

1. What requirement, contract, invariant, bug, or business rule is protected?
2. What observable behavior proves it works?
3. What realistic regression would make the test fail?
4. Is this behavior already covered?
5. What is the smallest appropriate test scope?

If there is no clear answer to these questions, **DO NOT add the test automatically**.

---

# Required Rules

## Behavior First

Tests MUST originate from:

- specification
- acceptance criteria
- business rules
- public contracts
- important invariants
- meaningful failure cases
- regressions

Tests MUST NOT originate solely from the structure of the implementation.

---

## Observable Outcomes

Prefer assertions on:

- returned values
- persisted state
- HTTP responses
- domain events
- externally visible side effects
- errors defined by the contract

Avoid assertions on:

- private methods
- internal calls
- intermediate objects
- implementation-specific sequencing

unless explicitly required by the contract.

---

## Refactoring

A behavior-preserving refactor SHOULD NOT require rewriting tests.

Ask:

> If this implementation were replaced while preserving behavior, should this test still pass?

If yes, design the test accordingly.

---

## Coverage

Coverage is a diagnostic signal only.

The agent MUST NOT:

- create tests only to increase coverage
- target 100% coverage by default
- test getters/setters automatically
- test every branch automatically
- test every method automatically

Before testing an uncovered branch, ask:

> What meaningful behavior does this branch represent?

If the answer is unclear, do not add a test solely for coverage.

---

## Test Value

Every test MUST be able to catch a meaningful defect.

Ask:

> What could I intentionally break to make this test fail?

If no meaningful answer exists, reconsider the test.

---

## Mocks

Mocks MUST NOT be the default.

Prefer real dependencies when they are:

- fast
- local
- deterministic
- cheap
- easy to configure

Mocks SHOULD be used for:

- external APIs
- network calls
- clocks
- randomness
- expensive infrastructure
- nondeterministic systems
- failure injection

Avoid tests whose main purpose is:

```text
verify(A).called()
verify(B).called()
verify(C).called()
```

unless those interactions are themselves part of the required behavior.

---

## Assertions

Only assert what the specification requires.

MUST NOT assert properties simply because they are currently true.

For every assertion ask:

> Would the product be incorrect if this stopped being true?

If not, remove or reconsider the assertion.

---

## Scope

Use the smallest test scope that proves the behavior.

Prefer:

1. focused/domain tests
2. integration tests for boundaries
3. end-to-end tests for critical workflows

Do NOT equate:

```text
unit test = one production method
```

One behavioral test may legitimately exercise several classes.

---

## Failure Cases

For important behavior, consider meaningful failures such as:

- invalid input
- missing resources
- authorization failure
- dependency failure
- timeout
- duplicate request
- boundary values
- partial failure

Do NOT invent arbitrary edge cases purely to increase test count.

---

## Regression Bugs

When fixing a bug:

1. reproduce the incorrect behavior with a test when practical
2. confirm the test fails
3. fix the bug
4. confirm the test passes

The regression test MUST protect the behavior, not the exact implementation of the fix.

---

## Determinism

Tests MUST be deterministic.

Tests MUST NOT depend on:

- execution order
- another test
- shared mutable state
- uncontrolled current time
- leftover database records
- unreliable external systems
- machine-specific configuration

---

## Flaky Tests

Flaky tests are defects.

The agent MUST NOT treat this as acceptable:

```text
rerun it, it sometimes fails
```

Fix, redesign, or isolate the cause.

---

## Waiting

Avoid arbitrary:

```text
sleep(...)
```

Prefer:

- controllable clocks
- explicit synchronization
- deterministic schedulers
- bounded condition polling

---

## Readability

Tests MUST clearly communicate:

```text
Given
When
Then
```

Test names SHOULD describe behavior.

Prefer:

```text
suspended_user_cannot_make_payment
```

Avoid:

```text
test_payment_service
test_method_x
test_branch_3
```

---

## Test Data

Only expose data relevant to the scenario.

Prefer:

```text
aUser().suspended()
```

over constructing large objects containing irrelevant fields.

---

## Duplication

Some duplication is acceptable if it improves readability.

Do NOT aggressively DRY tests when abstraction hides:

- scenario
- expected outcome
- business meaning

---

# AI Coding Agent Rules

When implementing a feature, the agent MUST:

1. Read the specification or acceptance criteria first.
2. Identify required behaviors.
3. Inspect existing tests.
4. Identify gaps in behavioral coverage.
5. Add only tests that provide additional confidence.
6. Prefer observable outcomes.
7. Avoid implementation coupling.
8. Avoid unnecessary mocks.
9. Run relevant existing tests.
10. Review tests as critically as production code.

The agent MUST NOT automatically generate tests for every:

- function
- method
- class
- DTO
- mapper
- getter
- setter
- conditional branch

---

# AI Review Rules

When reviewing tests, ask:

- What behavior does this protect?
- Is that behavior actually required?
- What bug would this catch?
- Could the feature be broken while this test still passes?
- Is it testing implementation instead of behavior?
- Would a valid refactor break it?
- Are the mocks necessary?
- Are assertions over-specifying the result?
- Is this already tested elsewhere?
- Is the test deterministic?

Tests MUST NOT be approved simply because:

```text
tests exist
coverage increased
CI is green
```

---

# Bad Patterns

Treat these as warning signs:

```text
new method -> new test
```

```text
uncovered line -> new test
```

```text
mock everything
```

```text
verify internal call
```

```text
assert every property
```

```text
huge snapshot
```

```text
sleep and retry
```

```text
duplicate test with slightly different setup
```

---

# Final Rule

Before keeping a test, ask:

> If this test disappeared, what meaningful confidence would we lose?

Good answer:

```text
We could violate business rule X without detecting it.
```

Bad answer:

```text
Coverage would decrease.
```

Optimize for:

```text
maximum confidence
with the smallest maintainable set
of reliable behavioral tests
```