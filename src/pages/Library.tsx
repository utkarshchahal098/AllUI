import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import GamePoster from '../components/game/GamePoster'
import Empty from '../components/ui/Empty'
import Icon from '../components/ui/Icon'
import Reveal from '../components/ui/Reveal'
import { riseItem, stagger } from '../components/ui/motion'
import { gameById } from '../data/games'
import { credits } from '../lib/format'
import { useLibraryStore } from '../store/useLibraryStore'
import { useUiStore } from '../store/useUiStore'

const when = (ts: number) =>
  new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(ts)

export default function Library() {
  const { credits: balance, owned, sold, deposit, reset } = useLibraryStore()
  const toast = useUiStore((s) => s.toast)

  const spent = owned.reduce((n, o) => n + o.pricePaid, 0)
  const earned = sold.reduce((n, s) => n + s.askingPrice, 0)

  return (
    <div className="shell page library">
      <header className="section-head">
        <div>
          <p className="kicker">// Account</p>
          <h1 className="display d-lg">Your library</h1>
          <p className="lede">
            Every licence you hold, plus the full trade history from the desk. Licences here can be listed for sale
            at any time.
          </p>
        </div>
        <div className="row wrap gap-2">
          <button
            className="btn btn-sm btn-ghost btn-lime"
            onClick={() => {
              deposit(100)
              toast({ tone: 'success', title: '100 CR deposited', body: 'Demo top-up applied to your balance.' })
            }}
          >
            <Icon name="plus" size={13} /> Top up 100 CR
          </button>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => {
              reset()
              toast({ tone: 'warn', title: 'Account reset', body: 'Library, history and balance cleared.' })
            }}
          >
            <Icon name="trash" size={13} /> Reset account
          </button>
        </div>
      </header>

      <Reveal>
        <div className="lib-stats">
          {[
            { l: 'Balance', v: credits(balance), c: 'var(--lime)' },
            { l: 'Licences held', v: String(owned.length), c: 'var(--cyan)' },
            { l: 'Spent on games', v: credits(spent), c: 'var(--magenta)' },
            { l: 'Earned at the desk', v: credits(earned), c: 'var(--amber)' },
          ].map((s) => (
            <div key={s.l} className="lib-stat panel cut-sm" style={{ ['--c1' as string]: s.c }}>
              <p className="label">{s.l}</p>
              <p className="display lib-stat-v">{s.v}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <section className="lib-section">
        <h2 className="display d-md lib-h">Owned licences</h2>
        {!owned.length ? (
          <Empty
            icon="library"
            title="Nothing installed yet"
            body="Your library is empty. Buy a title and it lands here instantly — then you can trade it back whenever you are done."
            action={
              <Link to="/browse" className="btn btn-primary">
                <Icon name="grid" size={14} /> Find something
              </Link>
            }
          />
        ) : (
          <motion.ul className="lib-grid" variants={stagger} initial="hidden" animate="show">
            {owned.map((o) => {
              const game = gameById(o.id)
              return (
                <motion.li
                  key={o.id}
                  variants={riseItem}
                  className="lib-card panel cut"
                  style={{
                    ['--c1' as string]: game?.palette[0] ?? 'var(--cyan)',
                    ['--c2' as string]: game?.palette[1] ?? 'var(--magenta)',
                  }}
                >
                  <Link to={`/game/${o.slug}`} className="lib-card-art">
                    {game && (
                      <GamePoster seed={game.slug} variant={game.art} palette={game.palette} ratio={1.5} className="lib-svg" />
                    )}
                    <span className="lib-card-play">
                      <Icon name="play" size={16} filled />
                    </span>
                  </Link>
                  <div className="lib-card-body">
                    <h3 className="display lib-card-title">{o.title}</h3>
                    <p className="mono dim">Acquired {when(o.acquiredAt)} · {credits(o.pricePaid)}</p>
                    <div className="lib-card-cta">
                      <Link to={`/game/${o.slug}`} className="btn btn-sm btn-ghost">
                        Dossier
                      </Link>
                      <Link to="/sell" className="btn btn-sm btn-ghost btn-lime">
                        <Icon name="coins" size={12} /> Sell
                      </Link>
                    </div>
                  </div>
                </motion.li>
              )
            })}
          </motion.ul>
        )}
      </section>

      {!!sold.length && (
        <section className="lib-section">
          <h2 className="display d-md lib-h">Trade history</h2>
          <div className="panel cut lib-table-wrap">
            <table className="lib-table">
              <thead>
                <tr>
                  <th className="mono">Listing</th>
                  <th className="mono">Title</th>
                  <th className="mono">Condition</th>
                  <th className="mono">Cleared</th>
                  <th className="mono lib-td-right">Ask</th>
                </tr>
              </thead>
              <tbody>
                {sold.map((s) => (
                  <tr key={s.listingId}>
                    <td className="mono lib-td-id">{s.listingId}</td>
                    <td>{s.title}</td>
                    <td>
                      <span className="chip">{s.condition}</span>
                    </td>
                    <td className="mono dim">{when(s.soldAt)}</td>
                    <td className="mono lib-td-right lib-td-good">{credits(s.askingPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
