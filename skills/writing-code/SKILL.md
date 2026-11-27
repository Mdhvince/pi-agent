---
name: writing-code
description: Enforce engineering judgment, minimalism, root-cause fixes, and disciplined testing when writing or reviewing code.
---

# Writing Code

## 1. Before Writing Code
- **Ask, do not assume:** When requirements or design trade-offs are ambiguous, stop and ask instead of guessing.
- **Check what exists first:** Search the codebase and standard library before writing a new helper or adding a dependency. Reuse existing patterns and utilities.
- **Take the shortest valid path:** Solve the exact problem asked with the smallest possible diff. Do not refactor adjacent code, rename untouched symbols, or add unrequested features.

## 2. Architecture & Restraint
- **No speculative over-engineering:** Do not create abstractions, base classes, factories, or config flags for a single use case. Add indirection only when a second concrete case requires it.
- **No symptom patching:** Fix the upstream model or contract instead of adding local defensive checks (null guards, broad catch-alls) at the crash site.
- **No sunk-cost patching:** If an approach requires workarounds to fit, revert and rethink the root cause instead of stacking fixes.
- **Unified flow:** Handle nominal and edge cases through the same general mechanism. Avoid ad-hoc branches.
- **Integrity by construction:** Enforce invariants through types, validation boundaries, and state machines rather than scattered runtime checks.
- **No stored derived state:** Do not store what can be computed from other fields. Derive it on demand or at construction so state cannot drift.
- **Explicit failure & no global mutable state:** Fail with explicit errors/exceptions in production code (never assertions). Never introduce global mutable state.
- **Zero dead code:** Delete obsolete workarounds, redundant checks, and any dead code left behind by your change.

## 3. Readability & Hygiene
- **Accurate, positive naming:** Names must state exactly what a symbol does or returns. No generic names (`value`, `item`, `handle`, `process`) and no negative qualifiers (`isNot...`, `disable...`).
- **Decomposed readability:** Break dense one-liners and nested expressions into named intermediate steps when it clarifies intent.
- **Minimal comments:** Never comment *what* the code does. Comment only non-obvious *why* (constraints, trade-offs, invariants). Update or delete any docs or comments made stale by your change.
- **Clear communication:** Use `ASD-STE100` Simplified Technical English for communication, names, comments, and documentation.

## 4. Disciplined Testing
- **Test contracts, not implementation:** Never write tautological tests that mirror your code line-by-line or over-mock internals just to pass.
- **Test what can actually break:** Cover real behavior, invariants, boundaries, and failure modes. Do not pad the suite with trivial cases.
- **Keep tests flat and clear:** Use AAA (Arrange, Act, Assert) or Given-When-Then, matching the codebase convention. Let the test name document the behavior; omit redundant test doc comments.
- More on testing in `/screening-tests` skill.
