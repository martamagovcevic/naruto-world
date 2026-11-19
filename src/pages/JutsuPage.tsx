import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { CSSProperties } from 'react'

import rasengan from '../assets/images/jutsu/jutsu-rasengan.png'
import chidori from '../assets/images/jutsu/sasuke-jutsu/chidori-jutsu.png'

import {
  jutsuArchive,
  type ChakraNature,
  type JutsuRank,
  type JutsuType,
} from '../data/jutsu'

import './JutsuPage.css'

const natureColors: Record<ChakraNature, string> = {
  Fire: '#ff6b3d',
  Water: '#4aa8ff',
  Wind: '#42d9c9',
  Lightning: '#ffd166',
  Earth: '#d8a25e',
}

const natures: { id: ChakraNature; kanji: string; label: string }[] = [
  { id: 'Fire', kanji: '火', label: 'Fire' },
  { id: 'Water', kanji: '水', label: 'Water' },
  { id: 'Wind', kanji: '風', label: 'Wind' },
  { id: 'Lightning', kanji: '雷', label: 'Lightning' },
  { id: 'Earth', kanji: '土', label: 'Earth' },
]

const jutsuTypes: ('All' | JutsuType)[] = [
  'All',
  'Ninjutsu',
  'Dōjutsu',
  'Medical',
  'Taijutsu',
]

const jutsuRanks: ('All' | JutsuRank)[] = ['All', 'D', 'C', 'B', 'A', 'S']

const heroParticles = Array.from({ length: 14 }, (_, index) => index)

function JutsuPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [natureFilter, setNatureFilter] = useState<ChakraNature | 'All'>(
    'All',
  )
  const [typeFilter, setTypeFilter] = useState<'All' | JutsuType>('All')
  const [rankFilter, setRankFilter] = useState<'All' | JutsuRank>('All')

  const results = jutsuArchive.filter((jutsu) => {
    const query = searchTerm.trim().toLowerCase()

    const matchesSearch =
      query === '' ||
      [jutsu.name, jutsu.romaji, jutsu.japanese, jutsu.type, jutsu.nature]
        .join(' ')
        .toLowerCase()
        .includes(query)

    const matchesNature =
      natureFilter === 'All' || jutsu.nature === natureFilter

    const matchesType = typeFilter === 'All' || jutsu.type === typeFilter

    const matchesRank = rankFilter === 'All' || jutsu.rank === rankFilter

    return matchesSearch && matchesNature && matchesType && matchesRank
  })

  const resetFilters = () => {
    setNatureFilter('All')
    setTypeFilter('All')
    setRankFilter('All')
    setSearchTerm('')
  }

  return (
    <main className="jutsu-page">
      {/* ============ CINEMATIC HERO ============ */}

      <section className="jutsu-hero">
        <div className="jutsu-hero__art" aria-hidden="true">
          <img
            className="jutsu-hero__art-img jutsu-hero__art-img--naruto"
            src={rasengan}
            alt=""
          />
          <img
            className="jutsu-hero__art-img jutsu-hero__art-img--sasuke"
            src={chidori}
            alt=""
          />
          <div className="jutsu-hero__art-shade" />
        </div>

        <div className="jutsu-hero__glow" aria-hidden="true" />

        <div className="jutsu-hero__particles" aria-hidden="true">
          {heroParticles.map((particle) => (
            <span
              key={particle}
              className="jutsu-hero__particle"
              style={{ '--p': particle } as CSSProperties}
            />
          ))}
        </div>

        <span className="jutsu-hero__kanji" aria-hidden="true">
          術
        </span>

        <div className="jutsu-hero__content">
          <p className="jutsu-hero__eyebrow">忍術・THE ART OF JUTSU</p>

          <h1 className="jutsu-hero__title">THE ART OF&nbsp;JUTSU</h1>

          <p className="jutsu-hero__tagline">
            Every technique is a story of will, resolve and the shaping of
            chakra. Unravel the energies of the five natures and the
            legendary moves they forged.
          </p>
        </div>
      </section>

      {/* ============ CHAKRA NATURES ============ */}

      <section className="jutsu-natures">
        <p className="jutsu-natures__eyebrow">THE FIVE NATURES</p>

        <h2 className="jutsu-natures__title">CHAKRA&nbsp;NATURES</h2>

        <div className="jutsu-natures__row">
          <button
            type="button"
            onClick={() => setNatureFilter('All')}
            className={`jutsu-natures__all ${
              natureFilter === 'All' ? 'jutsu-natures__all--active' : ''
            }`}
            aria-pressed={natureFilter === 'All'}
          >
            <span className="jutsu-natures__all-kanji">全</span>
            <span className="jutsu-natures__all-label">All&nbsp;Jutsu</span>
          </button>

          {natures.map((nature) => {
            const active = natureFilter === nature.id

            return (
              <button
                key={nature.id}
                type="button"
                onClick={() => setNatureFilter(nature.id)}
                className={`jutsu-nature jutsu-nature--${nature.id.toLowerCase()} ${
                  active ? 'jutsu-nature--active' : ''
                }`}
                style={{ '--nature-accent': natureColors[nature.id] } as CSSProperties}
                aria-label={`Filter by ${nature.id} Release`}
                aria-pressed={active}
              >
                <span className="jutsu-nature__kanji">{nature.kanji}</span>
                <span className="jutsu-nature__label">{nature.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* ============ JUTSU ARCHIVE ============ */}

      <section className="jutsu-archive">
        <div className="jutsu-archive__head">
          <div>
            <p className="jutsu-archive__eyebrow">JUTSU ENCYCLOPEDIA</p>

            <h2 className="jutsu-archive__title">THE&nbsp;ARCHIVE</h2>
          </div>

          <span className="jutsu-archive__count">
            {results.length}{' '}
            {results.length === 1 ? 'TECHNIQUE' : 'TECHNIQUES'}
          </span>
        </div>

        <div className="jutsu-toolbar">
          <div className="jutsu-toolbar__search">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search a technique..."
              className="jutsu-search"
              aria-label="Search techniques"
            />
          </div>

          <div className="jutsu-toolbar__group">
            <span className="jutsu-toolbar__label">TYPE</span>

            <div className="jutsu-filters__chips">
              {jutsuTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTypeFilter(type)}
                  className={`jutsu-chip ${
                    typeFilter === type ? 'jutsu-chip--active' : ''
                  }`}
                  aria-pressed={typeFilter === type}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="jutsu-toolbar__group">
            <span className="jutsu-toolbar__label">RANK</span>

            <div className="jutsu-filters__chips">
              {jutsuRanks.map((rank) => (
                <button
                  key={rank}
                  type="button"
                  onClick={() => setRankFilter(rank)}
                  className={`jutsu-chip ${
                    rankFilter === rank ? 'jutsu-chip--active' : ''
                  }`}
                  aria-pressed={rankFilter === rank}
                >
                  {rank}
                </button>
              ))}
            </div>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="jutsu-grid">
            {results.map((jutsu, index) => {
              const accent =
                jutsu.nature !== 'None' ? natureColors[jutsu.nature] : '#9fb4c2'

              return (
                <Link
                  key={`${jutsu.id}-${natureFilter}-${typeFilter}-${rankFilter}`}
                  to={`/jutsu/${jutsu.id}`}
                  className="jutsu-archive-card"
                  style={
                    {
                      '--is-accent': accent,
                      '--i': index,
                    } as CSSProperties
                  }
                  aria-label={`Read about ${jutsu.name}`}
                >
                  <div className="jutsu-archive-card__media">
                    {jutsu.image ? (
                      <img
                        src={jutsu.image}
                        alt={jutsu.name}
                        loading="lazy"
                        className="jutsu-archive-card__image"
                      />
                    ) : (
                      <div className="jutsu-archive-card__aura" aria-hidden="true" />
                    )}

                    <div className="jutsu-archive-card__shade" aria-hidden="true" />

                    <span className="jutsu-archive-card__kanji" aria-hidden="true">
                      {jutsu.nature !== 'None'
                        ? natures.find((n) => n.id === jutsu.nature)?.kanji
                        : '忍'}
                    </span>

                    <span className="jutsu-archive-card__rank">{jutsu.rank}</span>

                    <span className="jutsu-archive-card__nature" aria-hidden="true">
                      {jutsu.nature !== 'None' ? jutsu.nature : 'Chakra'}
                    </span>
                  </div>

                  <div className="jutsu-archive-card__body">
                    <h3>{jutsu.name}</h3>

                    <div className="jutsu-archive-card__meta">
                      <span>{jutsu.type}</span>
                      <i aria-hidden="true" />
                      <span>
                        {jutsu.nature !== 'None'
                          ? `${jutsu.nature} Release`
                          : 'Shape & Chakra'}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="jutsu-empty">
            <span className="jutsu-empty__kanji" aria-hidden="true">
              空
            </span>

            <h3>No techniques found</h3>

            <p>
              Nothing in the archive matches this combination of filters.
            </p>

            <button type="button" onClick={resetFilters} className="jutsu-empty__reset">
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default JutsuPage