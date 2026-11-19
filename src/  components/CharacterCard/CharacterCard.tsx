import { Link } from 'react-router-dom'
import type { Character } from "../../data/character"

import './CharacterCard.css'

type CharacterCardProps = {
  character: Character
}

function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Link
      to={`/characters/${character.id}`}
      className="character-card__link"
    >
      <article className="character-card">
        <div className="character-card__image-wrapper">
          <img
            className="character-card__image"
            src={character.image}
            alt={character.name}
          />
        </div>

        <div className="character-card__content">
          <span className="character-card__affiliation">
            {character.affiliation}
          </span>

          <h3>{character.name}</h3>

          <p>
            {character.clan} · {character.rank}
          </p>
        </div>
      </article>
    </Link>
  )
}

export default CharacterCard