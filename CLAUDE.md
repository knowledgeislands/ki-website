# CLAUDE.md — ki-website

@AGENTS.md

[AGENTS.md](AGENTS.md) carries this repository's orientation. `.ki.toml` declares `chatgpt-codex` alongside Claude Code, and a runtime that does not implement `@`-imports cannot resolve one, so the orientation lives in the literal file every runtime reads. This file holds only what is specific to Claude Code.

<!-- headroom:learn:start -->

- When removing or renaming a route, run `bun run ki:site:clean` before `bun run ki:site:build`; an ordinary Eleventy build can retain obsolete output in `apps/site/dist/`.

<!-- headroom:learn:end -->
