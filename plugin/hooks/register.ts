import type { Register } from 'claude-code'

// The prompt suggestion (the dim text in an empty prompt box that Tab accepts) as a sentence:
// a capital first letter and a full stop at the end.
const ENDS_SENTENCE = /[.?!…:]$/

const toSentence = (text: string): string => {
  const trimmed = text.trim()
  // A slash command stays as it is.
  if (trimmed === '' || trimmed.startsWith('/')) return text
  const first = trimmed[0]
  // Only a letter is capitalized; code, a quote or a digit at the start stays as it is.
  const isLetter = first.toLowerCase() !== first.toUpperCase()
  const capped = isLetter ? first.toUpperCase() + trimmed.slice(1) : trimmed
  return ENDS_SENTENCE.test(capped) ? capped : `${capped}.`
}

// Every suggestion, not only Claude's own (origin kind 'suggestion'): a suggestion another
// plugin proposes should read the same way, and a test can only raise one without an origin.
export const register: Register = on => {
  on('prompt.suggest', ($, e, next) => next({ ...e, text: toSentence(e.text) }))
}
