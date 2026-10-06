import type { Register } from 'claude-code'

// Marks every suggestion that passes through prompt.suggest. A suggestion without the
// marker was shown without the hook running.
export const register: Register = on => {
  on('prompt.suggest', ($, e, next) => next({ ...e, text: `[prompt.suggest ran] ${e.text}` }))
}
