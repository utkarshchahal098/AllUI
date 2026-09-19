import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Hero from '../components/home/Hero'
import Spotlight from '../components/home/Spotlight'
import Ticker from '../components/home/Ticker'
import GameCard, { GameCardSkeleton } from '../components/game/GameCard'
import GamePoster from '../components/game/GamePoster'
import Icon from '../components/ui/Icon'
import Reveal from '../components/ui/Reveal'
import { stagger } from '../components/ui/motion'
import { games } from '../data/games'
import { useBestSellersQuery } from '../hooks/useGames'
import { useCountUp } from '../hooks/useCountUp'
import { compact } from '../lib/format'

const pillars = [
  {
    icon: 'library' as const,
    title: 'Story first',
    body: 'Every best seller ships with its full act structure published on the storefront. Spoilers are a service, not a leak.',
  },
  {
    icon: 'coins' as const,
    title: 'Sell it back',
    body: 'The trade desk quotes you before you commit. Condition, demand multiplier and escrow are all shown in the open.',
  },
  {
    icon: 'cpu' as const,
    title: 'Built in-house',
    body: 'Four internal teams, one shared engine, and a render pipeline we wrote because nothing else did neon properly.',
  },
  {
    icon: 'shield' as const,
    title: 'No dark patterns',
    body: 'Flat prices, no loot crates, no timed pressure. If a discount is running, the original price stays on screen.',
  },
]

function StatBlock({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { ref, value } = useCountUp(target)
  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className="statblock">
      <p className="display d-lg statblock-k">
        {value >= 1000 ? compact(Math.round(value)) : Math.round(value).toLocaleString()}
        <span className="statblock-suffix">{suffix}</span>
      </p>
      <p className="mono statblock-l">{label}</p>
    </div>
  )
}

export default function Home() {
  const { data: best, isPending } = useBestSellersQuery(8)
  const storyGame = games.find((g) => g.slug === 'neon-requiem')!

  return (
    <>
      <Hero />
      <Ticker />

      {/* ---------------- spotlight ---------------- */}
      <section className="shell page section-spotlight">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="kicker">// 01 — In the window</p>
              <h2 className="display d-lg">Featured this cycle</h2>
            </div>
            <Link to="/browse" className="btn btn-sm btn-ghost">
              All titles <Icon name="arrowRight" size={13} />
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <Spotlight />
        </Reveal>
      </section>

      {/* ---------------- best sellers ---------------- */}
      <section className="shell page">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="kicker kicker-m">// 02 — Moving fastest</p>
              <h2 className="display d-lg">Best sellers</h2>
              <p className="lede">
                Ranked by licences moved through the desk this quarter. Every title below has its storyline
                published in full.
              </p>
            </div>
            <Link to="/browse" className="btn btn-sm btn-ghost btn-magenta">
              Open catalogue <Icon name="arrowRight" size={13} />
            </Link>
          </div>
        </Reveal>

        <motion.div
          className="grid-games"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
        >
          {isPending
            ? Array.from({ length: 8 }, (_, i) => <GameCardSkeleton key={i} />)
            : best?.map((g) => <GameCard key={g.id} game={g} />)}
        </motion.div>
      </section>

      {/* ---------------- story feature ---------------- */}
      <section className="story-band">
        <div className="shell story-band-inner">
          <Reveal className="story-band-art">
            <div className="story-art-frame cut hud-corners">
              <GamePoster
                seed={storyGame.slug}
                variant={storyGame.art}
                palette={storyGame.palette}
                ratio={0.82}
                className="story-art-svg"
              />
              <div className="story-art-scrim" />
              <span className="scan-sweep story-art-sweep" />
            </div>
          </Reveal>

          <div className="story-band-body">
            <Reveal>
              <p className="kicker">// 03 — Know before you buy</p>
              <h2 className="display d-lg">
                The whole <span className="grad-text">storyline</span>, published
              </h2>
              <p className="lede story-band-lede">
                We do not hide the plot behind a purchase. Every best seller has an act-by-act breakdown on its
                dossier page — premise, turns, endings, and which choices actually change the city. Read it, then
                decide.
              </p>
            </Reveal>

            <div className="story-acts">
              {storyGame.story?.map((a, i) => (
                <Reveal key={a.act} delay={0.06 * i}>
                  <article className="story-act panel cut-sm">
                    <p className="mono story-act-num">{a.act}</p>
                    <h3 className="display story-act-title">{a.title}</h3>
                    <p className="story-act-sum">{a.summary}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2}>
              <div className="story-band-cta">
                <Link to={`/game/${storyGame.slug}`} className="btn btn-primary">
                  <Icon name="library" size={14} /> Read {storyGame.title} in full
                </Link>
                <Link to="/stories" className="btn btn-ghost">
                  Story archive <Icon name="arrowRight" size={13} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- pillars ---------------- */}
      <section className="shell page">
        <Reveal>
          <div className="section-head">
            <div>
              <p className="kicker">// 04 — How we operate</p>
              <h2 className="display d-lg">Four rules of the house</h2>
            </div>
          </div>
        </Reveal>
        <div className="grid-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <article className="pillar panel panel-glow cut">
                <span className="pillar-icon">
                  <Icon name={p.icon} size={20} />
                </span>
                <h3 className="display pillar-title">{p.title}</h3>
                <p className="pillar-body">{p.body}</p>
                <span className="pillar-index mono">0{i + 1}</span>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- trade band ---------------- */}
      <section className="shell page">
        <Reveal>
          <div className="trade-band panel cut hud-corners">
            <div className="trade-band-glow" aria-hidden="true" />
            <div className="trade-band-copy">
              <p className="kicker kicker-m">// 05 — The other side of the desk</p>
              <h2 className="display d-lg">
                Done with it? <span className="grad-text">We buy it back.</span>
              </h2>
              <p className="lede">
                Pick a licence, declare its condition, and the desk returns a live quote built from base price,
                condition multiplier and current demand. Accept it and the credits land in your balance instantly —
                minus a 4% escrow fee we show you up front.
              </p>
              <div className="trade-band-cta">
                <Link to="/sell" className="btn btn-lg btn-primary">
                  <Icon name="coins" size={15} /> Get a quote
                </Link>
                <Link to="/library" className="btn btn-lg btn-ghost">
                  <Icon name="library" size={15} /> Your licences
                </Link>
              </div>
            </div>
            <div className="trade-band-stats">
              <StatBlock target={31_400_000} suffix="" label="Licences traded" />
              <StatBlock target={62} suffix="%" label="Peak buy-back rate" />
              <StatBlock target={15} suffix="min" label="Quote validity" />
              <StatBlock target={4} suffix="%" label="Escrow fee" />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
