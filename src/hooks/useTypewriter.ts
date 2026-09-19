import { useEffect, useState } from 'react'

interface State {
  index: number
  length: number
  erasing: boolean
}

/** Cycles through phrases with a terminal-style type/erase animation. */
export function useTypewriter(phrases: string[], typeMs = 52, holdMs = 1900) {
  const [{ index, length, erasing }, setState] = useState<State>({ index: 0, length: 0, erasing: false })
  const phrase = phrases[index % phrases.length]

  useEffect(() => {
    // Every transition happens inside the timer, so no state is set during the effect itself.
    const atEnd = !erasing && length === phrase.length
    const delay = atEnd ? holdMs : erasing ? typeMs / 2.2 : typeMs

    const timer = setTimeout(() => {
      setState((s) => {
        if (!s.erasing && s.length === phrase.length) return { ...s, erasing: true }
        if (s.erasing && s.length === 0) {
          return { index: (s.index + 1) % phrases.length, length: 0, erasing: false }
        }
        return { ...s, length: s.length + (s.erasing ? -1 : 1) }
      })
    }, delay)

    return () => clearTimeout(timer)
  }, [length, erasing, phrase, phrases.length, typeMs, holdMs])

  return phrase.slice(0, length)
}
