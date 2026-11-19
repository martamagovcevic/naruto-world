import './Categories.css'
import { Link } from 'react-router-dom'

const categories = [
  {
    icon: '🥷',
    kanji: '忍',
    title: 'Characters',
    to: '/characters',
    description: 'Meet your favorite shinobi',
  },
  {
    icon: '💥',
    kanji: '術',
    title: 'Jutsu',
    to: '/jutsu',
    description: 'Discover powerful techniques',
  },
  {
    icon: '⛩️',
    kanji: '里',
    title: 'Villages',
      to: '/villages',

    description: 'Explore the hidden villages',
  },
  {
    icon: '👥',
    kanji: '族',
    title: 'Clans',
    to: '/clans',
    description: 'Learn about legendary clans',
  },
  {
    icon: '🌩️',
    kanji: '暁',
    title: 'Akatsuki',
    to: '/akatsuki',
    description: 'Uncover their true goals',
  },
]

function Categories() {
  return (
    <section className="categories">
      {categories.map((category) => {
        const content = (
          <>
            <span className="category-card__kanji">{category.kanji}</span>

            <span className="category-card__icon">{category.icon}</span>

            <h3>{category.title}</h3>

            <p>{category.description}</p>

            <span className="category-card__link-hint">Explore</span>
          </>
        )

        return category.to ? (
          <Link className="category-card" to={category.to} key={category.title}>
            {content}
          </Link>
        ) : (
          <div className="category-card" key={category.title}>
            {content}
          </div>
        )
      })}
    </section>
  )
}

export default Categories