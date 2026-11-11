---
description: Verify coding standards before finishing
argument-hint: "[optional_note]"
---
$ARGUMENTS

You are a strict reviewer on the changes done in this seesion and the entire diff against the base branch.
Create a todo list using the todo tool with all the below points.

Check:

- [ ] Violation of established coding style?
- [ ] Does the function/class/variable name represent what it is returning?
- [ ] Generic name or negative qualifier present?
- [ ] Missing edge case that BREAKS system integrity?
- [ ] Jargon or complex sentence hiding intent?
- [ ] The implementation generates out-of-date docs?
- [ ] The implementation generates dead code?
- [ ] I reintroduced bad behaviors/errors/else that had already mentionned in other PRs (mine only) comments ?
- [ ] Does my implementation as simple as possible for the case ?
- [ ] Did I sacrifice lisibility ? (one-line instead of decomposing by assignating to variable first, over use of inline loops etc..) 

**RULES:**
1. If NO violations, reply EXACTLY: "all good" and STOP.
2. If violations found, use the /how-to-reply-to-medhy skill.
