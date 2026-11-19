import './NavBar.css'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(
    () => typeof window !== 'undefined' && window.scrollY > 8,
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const nav = navRef.current
    if (!nav || typeof ResizeObserver === 'undefined') return

    const applyHeight = () => {
      document.documentElement.style.setProperty(
        '--nav-h',
        `${nav.offsetHeight}px`,
      )
    }

    applyHeight()

    const observer = new ResizeObserver(applyHeight)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [])

  return (
    <nav ref={navRef} className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__logo">
        NARUTO
      </div>

      <div className="navbar__links">
       <Link to="/">Home</Link>
<Link to="/characters">Characters</Link>
<Link to="/villages">Villages</Link>
<Link to="/jutsu">Jutsu</Link>
<Link to="/clans">Clans</Link>
<Link to="/akatsuki">Akatsuki</Link>
<Link to="/quiz">Quiz</Link>
      </div>

      <div className="navbar__search">
        <input type="text" placeholder="Search..." />
      </div>
    </nav>
  )
}

export default Navbar