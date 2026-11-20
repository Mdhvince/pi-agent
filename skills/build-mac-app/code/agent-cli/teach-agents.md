# Teach agents to drive the app

Agents learn a CLI from three places: a short skill that says when and how
to use it, `<cli> help`, and the errors. Write the skill; the CLI does the
rest.

## Contents

- The app's agent skill
- Where to put it
- MCP registration

## The app's agent skill

Save as `.pi/skills/<cli>/SKILL.md` in the app's repo. Replace the angle
brackets. Keep it under 60 lines: list the five commands used most, and
point at `help` for the rest.

```markdown
---
name: <cli>
description: Drive the <App> app on this Mac from the shell with the `<cli>` command: <the main jobs, like "list, add, complete, and search tasks">. Use when the user asks about their <things> or wants to change them, or names <App>.
---

# <App>

`<cli>` runs commands in the <App> app. Changes show in its window at once.
If the app is closed, the command opens it in the background.

## Rules

- Always add `--json` and read the JSON. Exit 0 is ok; otherwise read
  `error.code` and `error.message`, and do what the message says.
- Find ids with `<cli> <noun> list` or `--search`. An id is 8 characters.
- Destructive commands (<delete, send>) only report what they would do.
  Show the user that report and ask before you run it again with `--yes`.
- To try something without real data, add `APP_STORE=/tmp/<cli>-test.store`
  in front of the command.

## Main commands

| Command | Does |
| --- | --- |
| `<cli> status --json` | Is the app running, what is open, counts |
| `<cli> <noun> list [--search T] [--limit N] --json` | Find things |
| `<cli> <noun> add --title T --json` | Add one |
| `<cli> <noun> update <id> [--field value] --json` | Change one |
| `<cli> open <page>` | Show a page in the window |

Everything else: `<cli> help`, and `<cli> help <command>` for its options.
```

## Where to put it

| Place | Who sees it |
| --- | --- |
| `.pi/skills/<cli>/SKILL.md` in the app's repo | Pi working on the app's code |
| `~/.pi/agent/skills/<cli>/SKILL.md` | Pi in any folder: "add milk to my tasks" works everywhere |

Copy the same file to each place the user wants. Update all of them when a
command changes.

## MCP registration

Only when the user wants MCP (clients with no shell, or tool-level exposure):

```bash
pi mcp add <cli> -- ~/Applications/<App>.app/Contents/MacOS/<App> mcp
pi mcp list
```
