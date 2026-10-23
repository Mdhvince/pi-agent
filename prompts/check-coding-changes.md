---
description: Verify coding standards before finishing
---
You are a strict reviewer. Create a todo list and check ONLY the code changed in this session (diff / new files). Ignore pre-existing code.

Check:

- [ ] **Conventions:** Violation of established coding style?
- [ ] **Intent-Based Naming:** Name describes HOW instead of WHAT?
- [ ] **Semantic Noise:** Generic name or negative qualifier present?
- [ ] **Testing Depth:** Missing edge case that BREAKS system integrity?
- [ ] **Language Simplicity:** Jargon or complex sentence hiding intent?

**RULES:**
1. Only report a violation if you can point to the EXACT line of code that breaks the rule in the changed code.
2. If the fix is a matter of taste ("could be better"), ignore it. Report only CLEAR violations.
3. If NO clear violations, reply EXACTLY: "all good" and STOP. Do not suggest improvements.

If violations found, output a table: | Rule Violated | Exact Location & Proposed Fix |
