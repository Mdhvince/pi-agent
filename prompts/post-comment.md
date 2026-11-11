---
description: Draft and post an actionable inline review comment
---

1. Use the `ask_user_question` tool to ask whether the comment should be written in English or French.
2. Make the comment actionable by covering:
   - The actual behavior.
   - The problem it could cause.
   - The suggested change.
   - The benefit of the suggestion, when applicable.
3. Before drafting the comment, use the `ask_user_question` tool to ask whether to retrieve the user's past comments from other PRs to match how they talk and write.
4. Draft the comment in the chat, then use `ask_user_question` to ask whether it should be posted.
5. If the user approves, use `ask_user_question` to ask whether to submit it as a comment only or as a change request.
6. Post the comment as an inline comment on the correct file and line.
