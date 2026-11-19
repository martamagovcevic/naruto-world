import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

import introBg from '../../assets/images/intro/naruto-intro.webp'

import './Intro.css'

type IntroPhase = 'boot' | 'ready' | 'loading' | 'fading' | 'splitting' | 'done'

const STORAGE_KEY = 'narutoIntroShown'

const BAR_DURATION = 1500
const FADE_DURATION = 350
const SPLIT_DURATION = 900

function buildSpiralPath() {
  const cx = 60
  const cy = 60
  const turns = 2.35
  const steps = 220
  const innerRadius = 2.2
  const outerRadius = 50
  const totalRotation = turns * Math.PI * 2

  const points: string[] = []

  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const theta = t * totalRotation
    const radius = innerRadius + (outerRadius - innerRadius) * t

    const x = cx + radius * Math.cos(theta)
    const y = cy + radius * Math.sin(theta)

    points.push(`${x.toFixed(2)} ${y.toFixed(2)}`)
  }

  return `M ${points.join(' L ')}`
}

function KonohaSymbol() {
  const spiral = useMemo(buildSpiralPath, [])

  return (
    <svg
      className="intro__symbol"
      width="180"
      height="180"
      viewBox="0 0 120 120"
      role="img"
      aria-label="Konoha, the Hidden Leaf Village symbol"
    >
      <defs>
        <filter id="intro-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="blur" />

          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle
        className="intro__symbol-orbit"
        cx="60"
        cy="60"
        r="54"
        fill="none"
        stroke="#ff7a2f"
        strokeOpacity="0.4"
        strokeWidth="1.5"
        strokeDasharray="6 11"
      />

      <g filter="url(#intro-glow)">
        <path
          d={spiral}
          fill="none"
          stroke="#ff7a2f"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle cx="60" cy="60" r="2.4" fill="#ff7a2f" />
      </g>
    </svg>
  )
}

function Intro() {
  const [phase, setPhase] = useState<IntroPhase>(() =>
    sessionStorage.getItem(STORAGE_KEY) === '1' ? 'done' : 'boot',
  )

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(STORAGE_KEY) === '1'
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (alreadyShown || prefersReducedMotion) {
      setPhase('done')

      return
    }

    let disposed = false

    const link = document.createElement('link')

    link.rel = 'preload'
    link.as = 'image'
    link.href = introBg

    document.head.appendChild(link)

    const preload = new Image()

    preload.onload = () => {
      if (!disposed) setPhase('ready')
    }

    preload.onerror = () => {
      if (!disposed) setPhase('done')
    }

    preload.src = introBg

    return () => {
      disposed = true

      document.head.removeChild(link)
    }
  }, [])

  useEffect(() => {
    if (phase === 'ready') setPhase('loading')
  }, [phase])

  useEffect(() => {
    if (phase !== 'loading') return

    const timer = window.setTimeout(() => setPhase('fading'), BAR_DURATION)

    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'fading') return

    const timer = window.setTimeout(() => setPhase('splitting'), FADE_DURATION)

    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== 'splitting') return

    const timer = window.setTimeout(() => setPhase('done'), SPLIT_DURATION)

    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase === 'done') {
      sessionStorage.setItem(STORAGE_KEY, '1')
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'boot' || phase === 'ready' || phase === 'done') return

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [phase])

  if (phase === 'done') return null

  const showContent = phase === 'loading' || phase === 'fading'
  const showBackground =
    phase === 'loading' || phase === 'fading' || phase === 'splitting'
  const isFading = phase === 'fading'
  const isSplitting = phase === 'splitting'

  const skipButton = (
    <button
      className={`intro__skip ${
        isFading || isSplitting ? 'intro__skip--hidden' : ''
      }`}
      type="button"
      autoFocus
      onClick={() => setPhase('done')}
    >
      Skip intro
    </button>
  )

  return (
    <div
      className={`intro ${showContent ? 'intro--active' : ''} ${
        isFading ? 'intro--fading' : ''
      } ${isSplitting ? 'intro--splitting' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Cinematic intro"
    >
      {createPortal(skipButton, document.body)}

      {showBackground && (
        <>
          <div
            className="intro__panel intro__panel--left"
            aria-hidden="true"
            style={{ backgroundImage: `url(${introBg})` }}
          />

          <div
            className="intro__panel intro__panel--right"
            aria-hidden="true"
            style={{ backgroundImage: `url(${introBg})` }}
          />
        </>
      )}

      <div className="intro__overlay" />

      {showContent && (
        <div className="intro__content">
          <KonohaSymbol />

          <h1 className="intro__title">ENTERING THE SHINOBI WORLD...</h1>

          <div className="intro__bar" aria-hidden="true">
            <span className="intro__bar-fill" />
          </div>
        </div>
      )}
    </div>
  )
}

export default Intro