import { AnimatePresence, motion } from 'framer-motion'
import { useUiStore, type ToastTone } from '../../store/useUiStore'
import Icon, { type IconName } from './Icon'

const toneIcon: Record<ToastTone, IconName> = {
  info: 'bolt',
  success: 'check',
  warn: 'shield',
  error: 'close',
}

export default function Toaster() {
  const toasts = useUiStore((s) => s.toasts)
  const dismiss = useUiStore((s) => s.dismiss)

  return (
    <div className="toaster" role="region" aria-label="Notifications">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 60, scale: 0.94 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.94 }}
            transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            className={`toast toast-${t.tone} cut-sm`}
          >
            <span className="toast-icon">
              <Icon name={toneIcon[t.tone]} size={15} />
            </span>
            <div className="toast-body">
              <p className="toast-title">{t.title}</p>
              {t.body && <p className="toast-text">{t.body}</p>}
            </div>
            <button className="toast-x" onClick={() => dismiss(t.id)} aria-label="Dismiss notification">
              <Icon name="close" size={13} />
            </button>
            <span className="toast-bar" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
