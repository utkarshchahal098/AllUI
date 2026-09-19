import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import GamePoster from '../components/game/GamePoster'
import Icon from '../components/ui/Icon'
import Reveal from '../components/ui/Reveal'
import { games } from '../data/games'
import { compact, plural } from '../lib/format'

const withStory = games.filter((g) => g.story?.length)

export default function Stories() {
  const [activeSlug, setActiveSlug] = useState(withStory[0].slug)
  const [openAct, setOpenAct] = useState<string | null>(withStory[0].story![0].act)
  const game = withStory.find((g) => g.slug === activeSlug)!

  const pick = (slug: string) => {
    const next = withStory.find((g) => g.slug === slug)!
    setActiveSlug(slug)
    setOpenAct(next.story![0].act)
  }

  return (
    <div className="shell page stories" style={{ ['--c1' as string]: game.palette[0], ['--c2' as string]: game.palette[1] }}>
      <header className="stories-head">
        <p className="kicker kicker-m">// Story archive</p>
        <h1 className="display d-lg">
          Every plot, <span className="grad-text">in the open</span>
        </h1>
        <p className="lede">
          {withStory.length} of our titles ship with their complete act structure on the storefront. Premise,
          turns, endings — all of it. Pick a dossier on the left and read the whole thing before you spend a
          credit.
        </p>
      </header>

      <div className="stories-layout">
        {/* ------- index ------- */}
        <nav className="stories-index" aria-label="Titles with published storylines">
          {withStory.map((g) => (
            <button
              key={g.slug}
              className={`story-pick ${g.slug === activeSlug ? 'is-on' : ''}`}
              onClick={() => pick(g.slug)}
              style={{ ['--c1' as string]: g.palette[0], ['--c2' as string]: g.palette[1] }}
              aria-current={g.slug === activeSlug}
            >
              <span className="story-pick-art">
                <GamePoster seed={g.slug} variant={g.art} palette={g.palette} ratio={0.9} className="story-pick-svg" />
              </span>
              <span className="story-pick-text">
                <span className="display story-pick-title">{g.title}</span>
                <span className="mono story-pick-meta">
                  {plural(g.story!.length, 'act')} · {compact(g.sales)} sold
                </span>
              </span>
              <Icon name="chevronRight" size={15} className="story-pick-chev" />
            </button>
          ))}
        </nav>

        {/* ------- reader ------- */}
        <section className="stories-reader" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={game.slug}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="reader-head panel cut hud-corners">
                <div className="reader-head-art">
                  <GamePoster seed={game.slug} variant={game.art} palette={game.palette} ratio={2.4} className="reader-head-svg" />
                  <span className="reader-head-scrim" />
                </div>
                <div className="reader-head-body">
                  <p className="mono dim">{game.studio} · {game.year} · {game.genres.join(' / ')}</p>
                  <h2 className="display d-md">{game.title}</h2>
                  <p className="reader-tagline">“{game.tagline}”</p>
                  <p className="lede reader-syn">{game.synopsis}</p>
                  <Link to={`/game/${game.slug}`} className="btn btn-sm btn-primary">
                    <Icon name="arrowRight" size={13} /> Full dossier
                  </Link>
                </div>
              </div>

              <ol className="reader-acts">
                {game.story!.map((a, i) => {
                  const open = openAct === a.act
                  return (
                    <li key={a.act} className={`reader-act panel cut ${open ? 'is-open' : ''}`}>
                      <button
                        className="reader-act-head"
                        onClick={() => setOpenAct(open ? null : a.act)}
                        aria-expanded={open}
                      >
                        <span className="mono reader-act-num">{String(i + 1).padStart(2, '0')}</span>
                        <span className="reader-act-titles">
                          <span className="mono reader-act-label">{a.act}</span>
                          <span className="display reader-act-title">{a.title}</span>
                        </span>
                        <Icon name="chevronDown" size={16} className="reader-act-chev" />
                      </button>

                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                            className="reader-act-body"
                          >
                            <div className="reader-act-inner">
                              <p className="reader-act-sum">{a.summary}</p>
                              <ul className="reader-beats">
                                {a.beats.map((b, k) => (
                                  <motion.li
                                    key={b}
                                    initial={{ opacity: 0, x: -14 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.08 + k * 0.07 }}
                                  >
                                    <span className="reader-beat-dot" aria-hidden="true" />
                                    {b}
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  )
                })}
              </ol>

              {!!game.characters?.length && (
                <Reveal>
                  <div className="reader-cast">
                    <p className="kicker">// Principal cast</p>
                    <div className="reader-cast-grid">
                      {game.characters.map((c) => (
                        <article key={c.name} className="reader-cast-card panel cut-sm">
                          <p className="display reader-cast-name">{c.name}</p>
                          <p className="mono dim reader-cast-role">{c.role}</p>
                          <p className="reader-cast-line">“{c.line}”</p>
                        </article>
                      ))}
                    </div>
                  </div>
                </Reveal>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </div>
    </div>
  )
}
