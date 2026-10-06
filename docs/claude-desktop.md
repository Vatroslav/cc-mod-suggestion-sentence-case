---
verified:
  - by: claude/opus-5.5
    at: 2026-10-06T10:50:00+02:00
    how: gh issue view 99876 -R anthropics/claude-code; repro/sdk-prompt-suggest in SDK mode on 2.1.288 (the CLI Claude Desktop runs); read the 2.1.288 bundle
stale_after: 2026-10-20T00:00:00+02:00
---

# Claude Desktop: the suggestion skips `prompt.suggest`

Measured on Claude Code 2.1.286 and 2.1.288. The mod does not work in the Code tab of Claude Desktop.

## What happens

The engine raises `prompt.suggest` for its own suggestion only in the interactive terminal session. In an SDK host, such as the Code tab of Claude Desktop, it sends the suggestion to the host as a `{ type: "prompt_suggestion", suggestion }` message without raising the event, so the mod never sees it and the suggestion shows unchanged.

In the bundle (`claude.exe`, 2.1.286 and 2.1.288) only the terminal path runs the `prompt.suggest` chain, and it returns early unless `querySource` starts with `repl_main_thread`. The SDK path builds the `prompt_suggestion` message straight from the generated text. In 2.1.286 no other event (`session.send`, `session.append`) carried that message, so no mod could reach it.

## Repro

[`repro/sdk-prompt-suggest`](../repro/sdk-prompt-suggest) is a plugin that prefixes every suggestion passing through `prompt.suggest` with `[prompt.suggest ran]`. Run it in SDK mode and send two user turns as stream-json on stdin:

```bash
claude -p --input-format stream-json --output-format stream-json --verbose --prompt-suggestions --plugin-dir repro/sdk-prompt-suggest --debug
```

The `prompt_suggestion` message arrives without the prefix, and not capitalized by this mod either. The debug log shows the modules loaded with `events: prompt.suggest` and the forked `[prompt_suggestion]` agent finishing, but no `prompt.suggest (suggestion): ...` line, which the chain writes when it runs.

| Version | Suggestion the host got |
|---|---|
| 2.1.286 | `yes` |
| 2.1.288 | `yes, write it` |

A second turn that closes the conversation ("say goodbye") may end with no suggestion at all, which proves nothing. End it with a question.

## Bug report

[anthropics/claude-code#99876](https://github.com/anthropics/claude-code/issues/99876). At the last check: open, no comments.

## When it changes

On a new Claude Code version, run the repro again and check the issue. Once the SDK path raises `prompt.suggest`, the mod works in Desktop without any change to it; then update this file and the README.
