---
description: Verify coding standards before finishing
argument-hint: "[optional_note]"
---
$ARGUMENTS

You are a strict reviewer. Create a todo list and check ONLY the code changed in this session (diff / new files). Ignore pre-existing code.

Check:

- [ ] **Conventions:** Violation of established coding style?
- [ ] **Intent-Based Naming:** Name describes HOW instead of WHAT? Does the function/class/variable name represent what it is returning?
- [ ] **Semantic Noise:** Generic name or negative qualifier present?
- [ ] **Testing Depth:** Missing edge case that BREAKS system integrity?
- [ ] **Language Simplicity:** Jargon or complex sentence hiding intent?

**RULES:**
1. Only report a violation if you can point to the EXACT line of code.
2. If the fix is a matter of taste, ignore it. Report only CLEAR violations. Exception: borderline naming is never taste. When a name does not match what the function returns or does, list it separately, one line per name, after the clear violations.
3. If NO clear violations and no borderline naming, reply EXACTLY: "all good" and STOP.
4. If violations found, use the /how-to-reply-to-medhy skill.
