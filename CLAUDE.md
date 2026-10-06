# cc-mod-suggestion-sentence-case

A Claude Code mod: the dim prompt suggestion that Tab accepts starts with a capital letter and ends with a full stop. Vatra writes his prompts that way, and the suggestion often came in lowercase without a full stop. Built 5.10.2026. The idea and its history are in `personal-os/tasks/someday/claude-code-mods.md`.

## Language
- **Everything in this repo is in English** (Vatra, 5.10.2026). The repo is public since 5.10.2026. Code, comments, test names, README, CLAUDE.md and commit messages. The conversation with Vatra stays in Croatian.
- The README must stay accurate when a rule changes.

## How it works
- One `prompt.suggest` hook rewrites `e.text` and calls `next({ ...e, text })`. It calls nothing on `$`.
- Rules (approved by Vatra, 5.10.2026):
  - a slash command (`/...`) stays exactly as it is;
  - the first character is capitalized only if it is a letter (`toLowerCase() !== toUpperCase()`, which covers č, ć, đ, š and ž). Only the first character changes, so `lj`, `nj` and `dž` become `Lj`, `Nj` and `Dž`;
  - no full stop after `.`, `?`, `!`, `…` or `:`;
  - the text is trimmed.
- The mod only rewrites a suggestion before it is shown. It never decides anything and never touches what is sent (`prompt.submit` is on the red list in `~/.claude/knowledge/security-setup.md`; `prompt.suggest` is not).

## Learned
- **No origin filter.** The plan was `on('prompt.suggest', { origin: { kind: 'suggestion' } }, ...)`, for Claude Code's own suggestions only. In `claude plugin test`, `$.prompt.suggest` raises the event without an `origin` (measured 5.10.2026: the test's hook saw no `origin`), so with the filter the mod could not be tested. No other mod of Vatra's proposes text, so the filter bought nothing.
- **Does not work in Claude Desktop.** Found 6.10.2026: Vatra saw lowercase suggestions without a full stop in every Desktop session after the install ("da, dodaj", "ne prijavljujem se"), although the plugin was loaded in every process. The state (cause in the bundle, versions measured, repro, bug report anthropics/claude-code#99876 opened from Vatra's account) is in `docs/claude-desktop.md`, which carries the verification mark. Read it before changing anything here; on a new CLI version run its repro again and update it.
- The "verified live" on 5.10.2026 (dev-mods probe, "Radi") was a coincidence: that one suggestion already came with a capital letter and a full stop.
- The mod stays installed: it costs nothing and starts working by itself when the engine changes.

## Development and install
- Check: `claude plugin validate ./plugin`. Tests: `claude plugin test ./plugin` (15 cases). While the `claude` CLI is older than 2.1.287, prefix it with `CLAUDE_CODE_ENABLE_FUNCTION_HOOKS=1`.
- Installed from this folder: `claude plugin marketplace add`, then `claude plugin install cc-mod-suggestion-sentence-case@cc-mod-suggestion-sentence-case --scope user`. Installing COPIES the plugin into the cache, so a change in the repo does not apply by itself: raise `version` in `plugin/.claude-plugin/plugin.json`, run `claude plugin update cc-mod-suggestion-sentence-case@cc-mod-suggestion-sentence-case`, then a new session. `/reload-plugins` does not pick up the new version: it loads the copy the session already had again (measured 6.10.2026 on cc-mod-ferro 0.7.1 -> 0.7.2, CLI 2.1.286).
- A change shows only on a real suggestion: let a turn end with an empty prompt box and look at the dim text.
