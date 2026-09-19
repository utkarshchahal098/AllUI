import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import GlitchText from '../components/fx/GlitchText'
import Icon from '../components/ui/Icon'
import Reveal from '../components/ui/Reveal'
import { useCountUp } from '../hooks/useCountUp'
import { games } from '../data/games'
import { compact } from '../lib/format'

const teams = [
  {
    name: 'Halcyon Ruin',
    focus: 'Open-world narrative',
    body: 'The flagship team. Builds the big branching city games — Neon Requiem, Static Saints, Terminal Velocity City. 84 people, one writers room, zero committees.',
    accent: 'var(--cyan)',
  },
  {
    name: 'Nightmarket Collective',
    focus: 'Systemic & immersive sims',
    body: 'Small, stubborn, allergic to quest markers. Chrome Lotus and Ghostline came out of a team that fits in one room and argues in it constantly.',
    accent: 'var(--magenta)',
  },
  {
    name: 'Pale Signal',
    focus: 'Horror & audio-first design',
    body: 'Started as the audio department and refused to stop. Dead Frequency runs its entire threat model through spatial sound.',
    accent: 'var(--violet)',
  },
  {
    name: 'Vector Sect',
    focus: 'Speed, physics, arcade',
    body: 'Anti-grav racing, momentum shooters, and the physics sandbox nobody asked for. They own the engine tech everyone else borrows.',
    accent: 'var(--amber)',
  },
]

const timeline = [
  { year: '2079', head: 'Four people, one room', body: 'NEONRUIN opens above a noodle stall in the market district with a single mandate: ship a game about this city that is honest about it.' },
  { year: '2081', head: 'Ruinworks engine, v1', body: 'We stop licensing renderers that cannot do wet neon properly and write our own. Every title since runs on it.' },
  { year: '2085', head: 'The desk opens', body: 'The trade-in marketplace launches. Players can sell any licence back, with the pricing formula published on day one.' },
  { year: '2087', head: 'Neon Requiem', body: 'Four million licences in eleven weeks and a writers room that has never once been asked to cut an ending for scope.' },
  { year: '2089', head: 'Sixteen titles deep', body: 'Four internal teams, one engine, 31 million licences moved, and the storyline of every best seller published in full.' },
]

const tech = [
  { icon: 'cpu' as const, head: 'Ruinworks 4', body: 'In-house renderer built for volumetric neon, wet surfaces and 200-storey interiors with no loading seams.' },
  { icon: 'bolt' as const, head: 'Deterministic sim', body: 'Every systemic game replays frame-identical from a seed, which is why our QA finds bugs you never will.' },
  { icon: 'globe' as const, head: 'Live economy', body: 'The trade desk prices against real player supply. No designer sets a buy-back number by hand.' },
  { icon: 'shield' as const, head: 'Accessibility floor', body: 'Full input remap, colour-blind sets, subtitle scaling and a no-flash mode ship in every title on day one. Not a patch.' },
]

function Counter({ to, suffix = '', label }: { to: number; suffix?: string; label: string }) {
  const { ref, value } = useCountUp(to)
  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className="statblock">
      <p className="display d-lg statblock-k">
        {value >= 1000 ? compact(Math.round(value)) : Math.round(value)}
        <span className="statblock-suffix">{suffix}</span>
      </p>
      <p className="mono statblock-l">{label}</p>
    </div>
  )
}

export default function Studio() {
  const totalSales = games.reduce((n, g) => n + g.sales, 0)
  const avgRating = games.reduce((n, g) => n + g.rating, 0) / games.length

  return (
    <div className="studio">
      <section className="shell page studio-hero">
        <motion.p className="kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          // The studio
        </motion.p>
        <motion.h1
          className="display d-xl studio-title"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          We build <GlitchText as="span" className="studio-glitch">ruins</GlitchText>
          <br />
          you can live in
        </motion.h1>
        <motion.p
          className="lede studio-lede"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          NEONRUIN is an independent studio and marketplace working out of Astra Prime's market district. Four
          internal teams, one engine written in-house, and a storefront that publishes the full plot of everything
          we sell. We think a game should survive being spoiled.
        </motion.p>
      </section>

      <section className="shell studio-counters">
        <Counter to={games.length} label="Titles shipped" />
        <Counter to={totalSales} label="Licences moved" />
        <Counter to={Math.round(avgRating * 10) / 10} label="Mean player score" />
        <Counter to={4} label="Internal teams" />
      </section>

      {/* ---------------- teams ---------------- */}
      <section className="shell page" id="teams">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="kicker kicker-m">// Internal teams</p>
              <h2 className="display d-lg">Four rooms, four temperaments</h2>
            </div>
          </div>
        </Reveal>
        <div className="grid-2">
          {teams.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <article className="team panel panel-glow cut hud-corners" style={{ ['--c1' as string]: t.accent }}>
                <p className="mono team-focus">{t.focus}</p>
                <h3 className="display d-md team-name">{t.name}</h3>
                <p className="team-body">{t.body}</p>
                <Link to={`/browse?q=${encodeURIComponent(t.name)}`} className="team-link mono">
                  Their catalogue <Icon name="arrowRight" size={13} />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- timeline ---------------- */}
      <section className="shell page">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="kicker">// History</p>
              <h2 className="display d-lg">Ten years in the district</h2>
            </div>
          </div>
        </Reveal>
        <ol className="timeline">
          {timeline.map((t, i) => (
            <motion.li
              key={t.year}
              className="tl-item"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="tl-rail" aria-hidden="true">
                <span className="tl-node" />
              </span>
              <p className="display tl-year">{t.year}</p>
              <div className="tl-body">
                <h3 className="display tl-head">{t.head}</h3>
                <p className="tl-text">{t.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* ---------------- tech ---------------- */}
      <section className="shell page" id="tech">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="kicker kicker-m">// Engine &amp; tech</p>
              <h2 className="display d-lg">What everything runs on</h2>
            </div>
          </div>
        </Reveal>
        <div className="grid-3">
          {tech.map((t, i) => (
            <Reveal key={t.head} delay={i * 0.07}>
              <article className="pillar panel panel-glow cut">
                <span className="pillar-icon">
                  <Icon name={t.icon} size={20} />
                </span>
                <h3 className="display pillar-title">{t.head}</h3>
                <p className="pillar-body">{t.body}</p>
                <span className="pillar-index mono">0{i + 1}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- closing ---------------- */}
      <section className="shell page">
        <Reveal>
          <div className="trade-band panel cut hud-corners">
            <div className="trade-band-glow" aria-hidden="true" />
            <div className="trade-band-copy">
              <p className="kicker">// Start somewhere</p>
              <h2 className="display d-lg">
                Sixteen titles. <span className="grad-text">Read them first.</span>
              </h2>
              <p className="lede">
                Open any best seller, read the acts, then decide. If it does not land, the desk buys it back at a
                price we published before you bought it.
              </p>
              <div className="trade-band-cta">
                <Link to="/browse" className="btn btn-lg btn-primary">
                  <Icon name="grid" size={15} /> Browse catalogue
                </Link>
                <Link to="/stories" className="btn btn-lg btn-ghost btn-magenta">
                  <Icon name="library" size={15} /> Story archive
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
