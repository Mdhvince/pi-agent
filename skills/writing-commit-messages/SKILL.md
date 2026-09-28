---
name: writing-commit-messages
description: Writing conventions for commit messages
---

# Write commit messages

Use this skill when writing or amending a commit message.

## Commit messages
A commit message is ONE short sentence, in English, describing what the  change does.
- Imperative mood: "Add password reset endpoint", not "Added" or "Adds".
- Describe the change itself, not the process ("Fix login redirect loop", never "Update views.py" or "Address review comments").
- No body, no bullet lists, unless the user explicitly asks for a detailed commit message.

## Forbidden - AI attribution (commits AND PRs)
- NEVER include `Co-Authored-By: ...` (any variant, any capitalization)
- NEVER include `Generated with Claude Code` or any similar AI/tool attribution
- NEVER include Session links (claude.ai session URLs) or `Claude-Session` trailers

## Examples
Commit input: "Checkout now rejects expired coupons before charging, and the  regression is covered."
Commit output: `Reject expired coupons before checkout charges`

## Final checklist
- The commit is short, imperative, English.
- A commit has no body unless requested; a PR body says what changed and why.
- Repository templates or explicit user requests are followed without filler.
- No AI attribution, co-author trailer, session link, or tool signature appears.
- Talk, Write, Communicate in `ASD-STE100` Simplified Technical English when communicating or writing in english.
