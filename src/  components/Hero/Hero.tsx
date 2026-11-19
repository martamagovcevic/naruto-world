import './Hero.css'
import { Link } from 'react-router-dom'
import heroImage from '../../assets/images/naruto-slika-hero.png'

function Hero() {
  return (
    <section className="hero"
  style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="hero__overlay"></div>

      <div className="hero__content">
        <p className="hero__eyebrow">A STORY ABOUT</p>

        <h1 className="hero__title">
          NEVER GIVING UP
        </h1>

        <p className="hero__description">
          Follow the journey of Naruto Uzumaki and explore the world
          of shinobi - characters, villages, jutsu, clans and more.
        </p>

        <div className="hero__actions">
          <Link to="/characters" className="hero__button hero__button--primary">
            Explore Characters
          </Link>

          <button className="hero__button hero__button--secondary">
            Take the Quiz
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
