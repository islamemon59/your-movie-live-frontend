import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import styles from '../../styles/BackButton.module.css'

// Global back button shown only on mobile / small-tablet screens (handled in CSS).
// Rendered once in App so every page gets a consistent back control in the same spot.
export const BackButton = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Home is the root — there's nowhere to go "back" to.
  if (pathname === '/') return null

  const handleBack = () => {
    // react-router tracks a history index; idx === 0 means the user landed here
    // directly (deep link / new tab), so going back would leave the site.
    // Fall back to home in that case.
    const idx = window.history.state?.idx ?? 0
    if (idx > 0) navigate(-1)
    else navigate('/')
  }

  return (
    <button className={styles.backBtn} onClick={handleBack} aria-label="Go back">
      <ChevronLeft size={20} />
      <span>Back</span>
    </button>
  )
}
