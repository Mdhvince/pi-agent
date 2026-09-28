## Guidelines and principles to follow when writing code

### General principles

- Keep It Simple, Stupid (KISS).
- Don't Repeat Yourself (DRY).
- Trust code over comments and documentations

### Simplicity and readability

- Avoid unnecessary intermediate variables and aliases.
- Introduce a local variable only when it adds meaning, transformation, or readability.
- Add comments only where intent is not obvious from the code.

### Code evolution and dead code

- Modify or replace existing code instead of creating a parallel implementation for the same behavior.
- Remove obsolete, unused, or replaced code. Do not keep it "just in case".
- Do not comment out old code; delete it and rely on Git history if it ever needs to be recovered.

### Minimal and root-cause changes

- Make the smallest change that fully satisfies the requirement.
- Fix the problem at its root cause instead of adding a workaround around the symptom.
- Make the change in the component or layer that owns the behavior, not at a convenient downstream location.
- Prefer changing the source of truth over adding compensating logic elsewhere.