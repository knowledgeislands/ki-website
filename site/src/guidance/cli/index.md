---
layout: layouts/base.njk
title: KI CLI guidance
description: Use the KI command-line interface to manage capabilities, update verified installations, and prepare local imports.
permalink: /guidance/cli/
---

# KI CLI guidance

These guides explain the concepts and safety boundaries behind common `ki` workflows.

The installed executable owns exact, version-specific command grammar. Use `ki help` or `ki help <command>` before acting; the tracked [ki(1) manual](https://github.com/knowledgeislands/tools-ki/blob/main/man/ki.1) is the source representation maintained with the executable.

- [Manage a capability lifecycle](/guidance/cli/capability-lifecycle/) explains the boundary between installed harnesses and activated skills.
- [Update and upgrade](/guidance/cli/update-upgrade/) explains executable, harness, and repository-provider refreshes.
- [Prepare a local ChatGPT capture](/guidance/cli/chatgpt-local-capture/) explains the controlled local-capture format used by `ki acquire chatgpt import`.
- [Use local utility commands](/guidance/cli/local-commands/) explains local capability search, safe cleanup reporting, and documentation locations.
