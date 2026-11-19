
import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import './Footer.css'

function Footer() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <footer className="footer">
      <div className="footer__main">
        <div className="footer__container">

          <div className="footer__top">

            <div className="footer__brand">
              <Link to="/" className="footer__logo">
                NARUTO
              </Link>

              <p>
                Explore the world of shinobi,
                legendary characters and powerful jutsu.
              </p>
            </div>

            <nav
              className="footer__navigation"
              aria-label="Footer navigation"
            >
              <Link to="/">Home</Link>
              <Link to="/characters">Characters</Link>
              <Link to="/jutsu">Jutsu</Link>
              <Link to="/villages">Villages</Link>
              <Link to='/akatsuki'>Akatsuki</Link>
              <Link to='clans'>Clans</Link>
            </nav>

            <button
              type="button"
              className="footer__back-to-top"
              onClick={scrollToTop}
              aria-label="Back to top"
              title="Back to top"
            >
              ↑
            </button>

          </div>

          <div className="footer__bottom">
            <p>
              © {new Date().getFullYear()} Naruto Fan Project
            </p>

            <p>
              Unofficial fan-made website.
              Naruto belongs to its respective creators
              and rights holders.
            </p>
          </div>

        </div>
      </div>

    </footer>
  )
}

export default Footer
