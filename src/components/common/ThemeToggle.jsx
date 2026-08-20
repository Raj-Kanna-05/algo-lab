import { useState, useEffect } from 'react'

/**
 * ThemeToggle — a fixed pill button in the top-right corner.
 * Toggles the 'light' class on <html>, persisted in localStorage.
 */
export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(() => {
    // Initialise from localStorage (or system preference as fallback)
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'light'
    return window.matchMedia('(prefers-color-scheme: light)').matches
  })

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add('light')
      localStorage.setItem('theme', 'light')
    } else {
      document.documentElement.classList.remove('light')
      localStorage.setItem('theme', 'dark')
    }
  }, [isLight])

  return (
    <button
      className="theme-toggle"
      onClick={() => setIsLight(l => !l)}
      id="theme-toggle-btn"
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      title={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <span className="theme-toggle-icon">{isLight ? '☀️' : '🌙'}</span>
      {isLight ? 'Light' : 'Dark'}
    </button>
  )
}
