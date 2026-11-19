import { Link, useParams } from 'react-router-dom'
import type { CSSProperties } from 'react'

import { characters } from '../data/character'
import { jutsuArchive, type ChakraNature } from '../data/jutsu'

import './JutsuDetailPage.css'

const natureColors: Record<ChakraNature, string> = {
  Fire: '#ff6b3d',
  Water: '#4aa8ff',
  Wind: '#42d9c9',
  Lightning: '#ffd166',
  Earth: '#d8a25e',
}

const natureKanji: Record<ChakraNature, string> = {
  Fire: '火',
  Water: '水',
  Wind: '風',
  Lightning: '雷',
  Earth: '土',
}

const charactersById = new Map(
  characters.map((character) => [character.id, character]),
)

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function JutsuDetailPage() {
  const { id } = useParams()

  const jutsu = jutsuArchive.find((entry) => entry.id === id)

  if (!jutsu) {
    return (
      <main className="jutsu-detail jutsu-detail--empty">
        <Link to="/jutsu" className="jutsu-detail__back">
          ← Back to Jutsu
        </Link>

        <h1>Jutsu not found</h1>

        <p>
          This technique isn’t recorded in the archive.
        </p>

        <Link to="/jutsu" className="jutsu-detail__cta">
          Browse the archive
        </Link>
      </main>
    )
  }

  const accent =
    jutsu.nature !== 'None'
      ? natureColors[jutsu.nature]
      : '#9fb4c2'

  const kanji = jutsu.nature !== 'None' ? natureKanji[jutsu.nature] : '忍'

  const heroChips = [
    { label: jutsu.type, accent: false },
    { label: `Rank ${jutsu.rank}`, accent: false },
    {
      label:
        jutsu.nature !== 'None'
          ? `遁 · ${jutsu.nature} Release`
          : 'Chakra Technique',
      accent: jutsu.nature !== 'None',
    },
  ]

  const classification = [
    { label: 'Type', value: jutsu.type, accent: false },
    { label: 'Rank', value: jutsu.rank, accent: false },
    {
      label: 'Nature',
      value:
        jutsu.nature !== 'None'
          ? `${jutsu.nature} · ${kanji}`
          : 'Non-elemental',
      accent: jutsu.nature !== 'None',
    },
  ]

  const related = jutsuArchive
    .filter((entry) => entry.id !== jutsu.id)
    .map((entry) => ({
      entry,
      score:
        (entry.nature === jutsu.nature && jutsu.nature !== 'None' ? 2 : 0) +
        (entry.type === jutsu.type ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((match) => match.entry)

  return (
    <main
      className="jutsu-detail"
      style={{ '--dk-accent': accent } as CSSProperties}
    >
      {/* ============ CINEMATIC HERO ============ */}

      <section className="jutsu-detail__hero">
        <div className="jutsu-detail__backdrop" aria-hidden="true">
          {jutsu.image ? (
            <img
              src={jutsu.image}
              alt=""
              className="jutsu-detail__backdrop-img"
            />
          ) : (
            <div className="jutsu-detail__backdrop-spin" />
          )}

          <div className="jutsu-detail__backdrop-shade" />
        </div>

        {jutsu.image && (
          <div className="jutsu-detail__art" aria-hidden="true">
            <img
              src={jutsu.image}
              alt=""
              className="jutsu-detail__art-img"
              style={
                {
                  '--art-pos': jutsu.artPosition ?? 'center center',
                } as CSSProperties
              }
            />
          </div>
        )}

        <div className="jutsu-detail__hero-bar">
          <Link to="/jutsu" className="jutsu-detail__back">
            ← Back to Jutsu
          </Link>

          <span className="jutsu-detail__symbol" aria-hidden="true">
            {kanji}
          </span>
        </div>

        <div className="jutsu-detail__hero-inner">
          <p className="jutsu-detail__eyebrow">JUTSU DOSSIER</p>

          <h1 className="jutsu-detail__title">{jutsu.name}</h1>

          <p className="jutsu-detail__japanese">
            {jutsu.japanese} · {jutsu.romaji}
          </p>

          <ul className="jutsu-detail__meta">
            {heroChips.map((chip) => (
              <li
                key={chip.label}
                className={`jutsu-detail__chip ${
                  chip.accent ? 'jutsu-detail__chip--nature' : ''
                }`}
              >
                {chip.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ DESCRIPTION + CLASSIFICATION ============ */}

      <div className="jutsu-detail__shell">
        <section className="jutsu-detail__lede">
          <p className="jutsu-detail__section-eyebrow">ABOUT THE TECHNIQUE</p>

          <p className="jutsu-detail__description">{jutsu.description}</p>
        </section>

        <dl className="jutsu-detail__stats">
          {classification.map((row) => (
            <div
              className={`jutsu-detail__stat ${
                row.accent ? 'jutsu-detail__stat--nature' : ''
              }`}
              key={row.label}
            >
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ============ KNOWN USERS ============ */}

      <section className="jutsu-detail__users">
        <div className="jutsu-detail__users-head">
          <p className="jutsu-detail__section-eyebrow">KNOWN USERS</p>

          <h2 className="jutsu-detail__section-title">Masters of this technique</h2>
        </div>

        <div className="jutsu-detail__user-grid">
          {jutsu.users.map((user) => {
            const character = user.id ? charactersById.get(user.id) : undefined

            return user.id && character ? (
              <Link
                key={`${jutsu.id}-${user.id}`}
                to={`/characters/${user.id}`}
                className="jutsu-detail__user-card"
                aria-label={`View ${user.name}'s profile`}
              >
                <div className="jutsu-detail__user-media">
                  <img src={character.image} alt="" loading="lazy" />

                  <div className="jutsu-detail__user-shade" />
                </div>

                <span className="jutsu-detail__user-name">{user.name}</span>
              </Link>
            ) : (
              <div
                key={`${jutsu.id}-${user.name}`}
                className="jutsu-detail__user-card jutsu-detail__user-card--text"
              >
                <div className="jutsu-detail__user-media">
                  <span className="jutsu-detail__user-monogram" aria-hidden="true">
                    {initialsOf(user.name)}
                  </span>

                  <div className="jutsu-detail__user-shade" />
                </div>

                <span className="jutsu-detail__user-name">{user.name}</span>
              </div>
            )
          })}
        </div>
      </section>

      {/* ============ EXPLORE MORE ============ */}

      <section className="jutsu-detail__explore">
        <div className="jutsu-detail__explore-head">
          <div>
            <p className="jutsu-detail__section-eyebrow">RELATED TECHNIQUES</p>

            <h2 className="jutsu-detail__section-title">Explore more</h2>
          </div>

          <Link to="/jutsu" className="jutsu-detail__archive-link">
            View full archive →
          </Link>
        </div>

        <div className="jutsu-detail__explore-grid">
          {related.map((entry) => {
            const relatedAccent =
              entry.nature !== 'None'
                ? natureColors[entry.nature]
                : '#9fb4c2'

            return (
              <Link
                key={entry.id}
                to={`/jutsu/${entry.id}`}
                className="jutsu-detail__explore-card"
                style={{ '--is-accent': relatedAccent } as CSSProperties}
                aria-label={`Read about ${entry.name}`}
              >
                <div className="jutsu-detail__explore-media">
                  {entry.image ? (
                    <img src={entry.image} alt="" loading="lazy" />
                  ) : (
                    <span
                      className="jutsu-detail__explore-monogram"
                      aria-hidden="true"
                    >
                      術
                    </span>
                  )}

                  <div className="jutsu-detail__explore-shade" />

                  <span className="jutsu-detail__explore-rank">{entry.rank}</span>
                </div>

                <div className="jutsu-detail__explore-info">
                  <h3>{entry.name}</h3>

                  <p>
                    {entry.nature !== 'None'
                      ? `${entry.nature} Release`
                      : entry.type}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default JutsuDetailPage