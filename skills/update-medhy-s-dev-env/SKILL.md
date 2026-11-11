---
name: update-medhy-s-dev-env
description: Update Medhy s development environment
disable-model-invocation: true
---

## Repositories
- https://github.com/Mdhvince/pi-agent
- https://github.com/Mdhvince/personal-zed-config
- https://github.com/Mdhvince/personal-ghostty-config
- https://github.com/Mdhvince/personal-zsh-config


## Process
- Use `ask_user_question` in multi choices to ask what to update (pi, zed, ghostty, zsh)
- Use `ask_user_question` tool to ask for additional installation if needed
- Identify local installed stuff (skills, extensions, others) that are not installed on remote repos and use `ask_user_question` to ask if we want to remove it or not
- Install gh cli if not installed
- Always check if something is already installed before reinstalling it
- No need to add a .git on the computer installing these, repos are read only for the PC
- Make sure to adapt the link/path or other to the target PC and OS
- During the process, if a difference is found 
- Use `ask_user_question` to ask for overwritting a specific file before doing it
- Use `ask_user_question` to ask if derived tool should be installed too (ollama, models config etc..)
