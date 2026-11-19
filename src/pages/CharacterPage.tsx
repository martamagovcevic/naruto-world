import { useState } from 'react'

import CharacterCard from "../  components/CharacterCard/CharacterCard"
import { characters } from "../data/character"

import "./CharacterPage.css"

function CharactersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const filters = ['All', 'Konoha', 'Akatsuki', 'Suna', 'Other']

  const filteredCharacters = characters.filter((character) => {
    const matchesSearch = character.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesFilter =
      activeFilter === 'All' ||
      character.affiliation === activeFilter ||
      (activeFilter === 'Other' &&
        !['Konoha', 'Akatsuki', 'Suna'].includes(character.affiliation))

    return matchesSearch && matchesFilter
  })

  return (
    <main className="characters-page">
      <section className="characters-page__header">
        <p>SHINOBI DATABASE</p>

        <h1>CHARACTERS</h1>

        <span>
          Meet the shinobi who shaped the world.
        </span>
      </section>

      <section className="characters-page__controls">
        <input
          type="text"
          placeholder="Search characters..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="characters-page__search"
        />

        <div className="characters-page__filters">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={
                activeFilter === filter
                  ? 'filter-button filter-button--active'
                  : 'filter-button'
              }
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="characters-page__grid">
        {filteredCharacters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
          />
        ))}
      </section>
    </main>
  )
}

export default CharactersPage