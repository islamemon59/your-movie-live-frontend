import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { HelpCircle, X, Download, Search, Magnet, CheckCircle2 } from 'lucide-react'
import styles from '../../styles/HowToDownload.module.css'

const STEPS = [
  {
    icon: Download,
    title: 'Tap the Download button',
    text: 'On this page, click the red “Download” button next to Play. A list of download servers opens.',
  },
  {
    icon: Search,
    title: 'Pick a server',
    text: 'Choose any server — it opens a results page in a new tab with the result already searched for you.',
  },
  {
    icon: Magnet,
    title: 'Choose your quality',
    text: 'Select the result with the most seeders at the quality you want (4K · 1080p · 720p), then tap its magnet / download link.',
  },
  {
    icon: CheckCircle2,
    title: 'Save & watch offline',
    text: 'Your download manager (e.g. qBittorrent) opens automatically. When it finishes, the file is saved on your device to watch anytime — no internet needed.',
  },
]

export const HowToDownload = ({ mediaType = 'movie' }) => {
  const [open, setOpen] = useState(false)
  const noun = mediaType === 'tv' ? 'an episode' : 'a movie'

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label="How to download"
      >
        <HelpCircle size={16} />
        How to Download?
      </button>

      {open &&
        createPortal(
          <div className={styles.overlay} onClick={() => setOpen(false)}>
            <div
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              aria-label={`How to download ${noun}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.header}>
                <h2 className={styles.title}>
                  <Download size={20} />
                  How to download {noun}
                </h2>
                <button
                  type="button"
                  className={styles.close}
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <p className={styles.intro}>
                Follow these steps to download {noun} from our website and watch it offline.
              </p>

              <ol className={styles.steps}>
                {STEPS.map((step, i) => {
                  const Icon = step.icon
                  return (
                    <li key={i} className={styles.step}>
                      <span className={styles.num}>{i + 1}</span>
                      <div className={styles.stepBody}>
                        <span className={styles.stepTitle}>
                          <Icon size={15} />
                          {step.title}
                        </span>
                        <span className={styles.stepText}>{step.text}</span>
                      </div>
                    </li>
                  )
                })}
              </ol>

              <button
                type="button"
                className={styles.gotIt}
                onClick={() => setOpen(false)}
              >
                Got it
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
