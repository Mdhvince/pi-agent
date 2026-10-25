---
name: screening-tests
description: Check tests against rules that hold in every project: observable behavior, determinism, actionable failure, sensitive assertions. Use when writing a test or assessing existing tests.
---

# Screening tests

Read this file before writing or assessing a test.


## Five rules that hold everywhere

1. A test protects an observable behavior, not a piece of code.
2. A test stays valid when the implementation changes. Only a requirement change may break it.
3. A test is deterministic and independent of other tests.
4. A failing test names its cause without extra instrumentation.
5. There is no universal target number. Measurement finds gaps, it never justifies writing a test.

## Choose a mode

| Request | Mode |
|---|---|
| New feature or bug fix | Write |
| Existing tests or a diff | Assess |

## When writing a test

1. State the behavior in one row: requirement | behavior | observable outcome.
   No empty observable outcome: do not write the test instead (see below).
2. Write given / when / then, with the data flow visible in the body (or Arrange, Act, Assert).
3. Run the checklist and fix every FAIL.
4. Run the checklist for a change.

## When assessing tests

1. List each added or modified test with the behavior it claims.
2. Run the checklist on each test, and the change checklist on the change.
3. Rank findings: blocking (no behavior protected, nondeterminism, assertion
   cannot fail), important (brittle, over-specified), cosmetic (naming, structure).
4. Give the check id, the evidence, the concrete edit.
5. Report to the user. A green pipeline is not evidence.

## Checklist for one test

Every result needs evidence: a quoted line, a test name, or a command output.

T2 is N/A when the requirement lives outside the file: absence of a spec in the
test is not evidence that no requirement exists. T7 is N/A when the fixture is
defined in a file you did not read.

| ID | Check | FAIL when | Fix |
|---|---|---|---|
| T1 | Behavior in the name | Name lacks the scenario or the outcome, or "and" joins two behaviors (compound nouns are fine) | Rename, or split |
| T2 | Traceable origin | No requirement, contract, invariant or bug behind the behavior | Do not write it; report the missing spec |
| T3 | Public entry point | Reaches private or internal surfaces | Go through the public API |
| T4 | Outcome assertion | Asserts neither the returned value, nor the resulting state, nor an effect the contract defines | Assert the outcome |
| T5 | Narrow assertion | Whole-object equality unless every field is contractual | Assert the fields the behavior defines |
| T6 | No logic | Arithmetic, concatenation, loop or conditional the reader must evaluate to know the expectation. A named constant is not logic | Inline the literal |
| T7 | Complete and concise | Relevant input hidden, or irrelevant input in the body | Inline what matters, hide the rest behind a parameterized helper |
| T8 | Deterministic | Real clock, sleep, live network, shared state, order dependency | Inject or isolate |
| T9 | Actionable failure | Name and message do not separate expected from actual | Add context or a precise assertion |
| T10 | Meaningful data | Default values, identical values across parameters, no boundary | Change the values |
| T11 | Independent | Fails alone, or after another test has run | Isolate data and state |
| T12 | Sensitive assertion | The assertion would also pass for a plausible wrong result | Assert the specific value or the property that must hold |
| T13 | Single scenario | Calls the subject again after an assertion, so two scenarios share one test | Split into one test per scenario |

## Checklist for a change

Applied to the change as a whole, not to individual tests.

| ID | Check | FAIL when |
|---|---|---|
| G1 | Unchanging tests | Existing tests were edited for a refactor, a feature or a fix |
| G2 | Bug fix sequence | No failing run existed before the fix |
| G3 | No coverage-only test | A test cannot name the defect it catches |
| G4 | Runtime and flakiness | Runtime grew, or a test was rerun until green |
| G5 | Isolated data | A shared fixture is mutated |

## When a test fails

A requirement is what the system must do, stated outside the code: an acceptance
criterion, an API contract, a business rule, a data invariant. An expectation is
what the assertion in the test says will happen. "The code does X today" is not a
requirement.

1. Name the requirement the test protects. If none exists, or it is ambiguous,
   record it first. Without it, no verdict is valid.
2. If the failure is intermittent, environmental, or caused by the test setup, fix
   the test mechanics, not its expectation.
3. If the expectation matches the requirement, the code is wrong. Fix the code and
   leave the test alone.
4. If the expectation contradicts the requirement, or the requirement changed, the
   test is wrong. Fix the test and cite the requirement.
5. Never align an expectation on the current output of the code. The only valid
   reason to change an expectation is the requirement.

## Do not write a test when

- nothing identifiable is protected;
- the behavior is already covered at the same scope;
- only a coverage number motivates it;
- you cannot name the defect it catches.

Report the stop condition instead.

## How to report findings

| Check | Result | Evidence |
|---|---|---|
| T6 No logic | FAIL | `assertEquals(base + "/u/0/photos", ...)` computes the expectation |

Result is PASS, FAIL or N/A. No result without evidence.
