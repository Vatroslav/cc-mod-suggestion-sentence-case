# cc-mod-suggestion-sentence-case

A Claude Code mod. After a turn, Claude Code proposes your next prompt as dim text in the empty prompt box, and Tab accepts it. The suggestion often comes in lowercase and without a full stop, so if you write your prompts as sentences, every accepted suggestion needs fixing before you send it. This mod rewrites the suggestion before it is shown: it starts with a capital letter and ends with a full stop.

| Suggested | Shown |
|---|---|
| run the tests | Run the tests. |
| why did it fail? | Why did it fail? |
| čekaj da završi | Čekaj da završi. |
| `` `npm test` again `` | `` `npm test` again. `` |
| /commit | /commit |

## Rules

- The first character is capitalized only if it is a letter. A suggestion that starts with code, a quote or a digit keeps its start.
- No full stop is added after `.`, `?`, `!`, `…` or `:`.
- A slash command stays exactly as it is.
- Spaces at either end are trimmed.
- Only the suggestion changes. Nothing you type or send is touched.

## How it works

One `prompt.suggest` hook in `plugin/hooks/register.ts` rewrites the text and passes it on with `next({ ...e, text })`. It calls nothing on `$`: no files, processes, network or model calls.

It handles every suggestion, both Claude Code's own and any that another plugin proposes through `$.prompt.suggest`.

## Limitation: not in Claude Desktop yet

In the Code tab of Claude Desktop the suggestion shows unchanged: there the engine sends it to the host without raising `prompt.suggest`, so the mod never sees it. The mod starts working there by itself once the engine routes that suggestion through `prompt.suggest`. The versions measured, a minimal repro and the bug report ([anthropics/claude-code#99876](https://github.com/anthropics/claude-code/issues/99876)) are in [`docs/claude-desktop.md`](docs/claude-desktop.md).

## Install

```bash
claude plugin marketplace add <path-to-this-repo>
claude plugin install cc-mod-suggestion-sentence-case@cc-mod-suggestion-sentence-case --scope user
```

On Claude Code builds before 2.1.287, function hooks of installed plugins may need `"CLAUDE_CODE_ENABLE_FUNCTION_HOOKS": "1"` in the `env` block of `~/.claude/settings.json`.

Check and test: `claude plugin validate ./plugin` and `claude plugin test ./plugin`.
