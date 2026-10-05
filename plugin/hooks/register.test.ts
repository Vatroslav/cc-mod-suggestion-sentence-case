import { expect, test } from 'claude-code/testing'

// The test's hook stands in for Claude Code: it catches the suggestion text the mod passes on.
async function shown($: any, on: any, text: string): Promise<string> {
  let seen = ''
  on('prompt.suggest', async ($: any, e: { text: string }) => {
    seen = e.text
    return { isShown: true }
  })
  await $.prompt.suggest({ text })
  return seen
}

const CASES: [string, string, string][] = [
  ['lowercase without a full stop', 'run the tests', 'Run the tests.'],
  ['Croatian letter at the start', 'čekaj da završi', 'Čekaj da završi.'],
  ['Croatian digraph lj', 'ljepše je ovako', 'Ljepše je ovako.'],
  ['already a sentence', 'Commit it.', 'Commit it.'],
  ['question mark stays', 'why did it fail?', 'Why did it fail?'],
  ['exclamation mark stays', 'great!', 'Great!'],
  ['three dots stay', 'hmm...', 'Hmm...'],
  ['ellipsis character stays', 'maybe…', 'Maybe…'],
  ['colon stays', 'here is the list:', 'Here is the list:'],
  ['slash command untouched', '/commit', '/commit'],
  ['slash command with an argument untouched', '/code-review high', '/code-review high'],
  ['code at the start: no capital, full stop added', '`npm test` again', '`npm test` again.'],
  ['digit at the start', '3 tests fail', '3 tests fail.'],
  ['spaces around the text', '  yes  ', 'Yes.'],
  ['closing parenthesis at the end', 'run it (fast ones only)', 'Run it (fast ones only).'],
]

for (const [name, input, expected] of CASES) {
  test(name, async ($, on) => {
    expect(await shown($, on, input)).toBe(expected)
  })
}
