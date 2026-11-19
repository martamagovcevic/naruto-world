import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { characters } from '../data/character'

import './CharacterProfilePage.css'

function CharacterProfilePage() {
  const { id } = useParams()

  const [activeTab, setActiveTab] = useState('overview')

  const chapterTitles = [
    { kanji: '序', en: 'BEGINNING' },
    { kanji: '破', en: 'TURNING POINT' },
    { kanji: '急', en: 'RESOLUTION' },
  ]

  const character = characters.find(
    (character) => character.id === id
  )

  if (!character) {
    return (
      <main className="character-profile">
        <h1>Character not found</h1>
      </main>
    )
  }

  return (
    <main
      className="character-profile"
      style={{ backgroundImage: `url(${character.image})` }}
    >
      <div className="character-profile__container">

        <Link
          to="/characters"
          className="character-profile__back"
        >
          ← Back to Characters
        </Link>

        <section className="character-profile__top">

          {/* CHARACTER POSTER */}

          <div className="character-profile__poster-wrapper">
            <img
              src={character.image}
              alt={character.name}
              className="character-profile__poster"
            />
          </div>

          {/* MAIN CHARACTER INFO */}

          <div className="character-profile__main-info">

            <span className="character-profile__eyebrow">
              SHINOBI PROFILE
            </span>

            <h1>{character.name}</h1>

            <p className="character-profile__japanese">
              忍者 • NINJA
            </p>

            <p className="character-profile__quote">
              {character.quote ||
                'Every shinobi has a story that shapes who they become.'}
            </p>

            <p className="character-profile__description">
              {character.description ||
                `Discover the story, abilities and legacy of ${character.name}.`}
            </p>

          </div>

          {/* CHARACTER STATS */}

          <aside className="character-profile__stats">

            <div className="character-profile__stats-symbol">
              忍
            </div>

            <div className="character-profile__stat">
              <span>Affiliation</span>
              <strong>{character.affiliation}</strong>
            </div>

            <div className="character-profile__stat">
              <span>Clan</span>
              <strong>{character.clan}</strong>
            </div>

            <div className="character-profile__stat">
              <span>Rank</span>
              <strong>{character.rank}</strong>
            </div>

            <div className="character-profile__stat character-profile__stat--nature">
              <span>Nature</span>

              <div className="character-profile__nature">
                {character.nature?.length ? (
                  character.nature.map((nature) => (
                    <span
                      className="character-profile__nature-tag"
                      key={nature}
                    >
                      {nature}
                    </span>
                  ))
                ) : (
                  <strong>Unknown</strong>
                )}
              </div>
            </div>

            <div className="character-profile__stat">
              <span>Birthday</span>

              <strong>
                {character.birthday || 'Unknown'}
              </strong>
            </div>

            <div className="character-profile__stat">
              <span>Status</span>

              <strong
                className={`character-profile__status character-profile__status--${(
                  character.status || 'unknown'
                ).toLowerCase()}`}
              >
                {character.status || 'Unknown'}
              </strong>
            </div>

          </aside>

        </section>

        {/* LOWER PROFILE CONTENT */}

        <section className="character-profile__lower">

          <div className="character-profile__tabs">

            <button
              className={
                activeTab === 'overview'
                  ? 'profile-tab profile-tab--active'
                  : 'profile-tab'
              }
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>

            <button
              className={
                activeTab === 'jutsu'
                  ? 'profile-tab profile-tab--active'
                  : 'profile-tab'
              }
              onClick={() => setActiveTab('jutsu')}
            >
              Jutsu
            </button>

            <button
              className={
                activeTab === 'background'
                  ? 'profile-tab profile-tab--active'
                  : 'profile-tab'
              }
              onClick={() => setActiveTab('background')}
            >
              Background
            </button>

            <button
              className={
                activeTab === 'gallery'
                  ? 'profile-tab profile-tab--active'
                  : 'profile-tab'
              }
              onClick={() => setActiveTab('gallery')}
            >
              Gallery
            </button>

          </div>

          <div className="character-profile__tab-content">

            {/* OVERVIEW */}

            {activeTab === 'overview' && (
              <div className="character-profile__overview">

                <div className="character-profile__section-heading">
                  <span>PROFILE SUMMARY</span>
                  <h2>OVERVIEW</h2>
                </div>

                <div className="character-profile__overview-grid">

                  <div
                    className="character-profile__overview-card"
                    data-kanji="村"
                  >
                    <span className="character-profile__overview-heading">
                      村 ·
                    </span>
                    <strong>{character.village}</strong>
                  </div>

                  <div
                    className="character-profile__overview-card"
                    data-kanji="族"
                  >
                    <span className="character-profile__overview-heading">
                      族 ·
                    </span>
                    <strong>{character.clan}</strong>
                  </div>

                  <div
                    className="character-profile__overview-card"
                    data-kanji="階"
                  >
                    <span className="character-profile__overview-heading">
                      階 ·
                    </span>
                    <strong>{character.rank}</strong>
                  </div>

                  <div
                    className="character-profile__overview-card"
                    data-kanji="状"
                  >
                    <span className="character-profile__overview-heading">
                      状 ·
                    </span>
                    <strong>{character.status || 'Unknown'}</strong>
                  </div>

                </div>

                <div className="character-profile__overview-text">
                  <h3>About {character.name}</h3>

                  <p>
                    {character.description ||
                      `More information about ${character.name} is coming soon.`}
                  </p>
                </div>

              </div>
            )}

            {/* JUTSU */}

            {activeTab === 'jutsu' && (
              <>
                <div className="character-profile__section-heading">
                  <span>JUTSU ARCHIVE</span>
                  <h2>{character.name}'s Techniques</h2>
                </div>

                <div className="character-profile__jutsu-grid">

                  {character.jutsu?.length ? (
                    character.jutsu.map((jutsu) => (

                      <article
                        className="jutsu-card"
                        key={jutsu.name}
                      >

<div className="jutsu-card__image-wrapper">
  {jutsu.image ? (
    <img
      src={jutsu.image}
      alt={jutsu.name}
      className="jutsu-card__image"
    />
  ) : (
    <span className="jutsu-card__glyph" aria-hidden="true">
      忍
    </span>
  )}
</div>

                        <div className="jutsu-card__content">
                          <h3>{jutsu.name}</h3>
                          <p>{jutsu.description}</p>
                        </div>

                      </article>

                    ))
                  ) : (
                    <p className="character-profile__no-jutsu">
                      Jutsu information coming soon.
                    </p>
                  )}

                </div>
              </>
            )}

            {/* BACKGROUND */}

            {activeTab === 'background' && (
              <div className="character-profile__panel character-profile__panel--story">

                <span>STORY</span>

                <h2>BACKGROUND</h2>

                <div className="character-profile__story">
                  {character.background?.length ? (
                    character.background.map((paragraph, index) => (
                      <article
                        className="character-profile__story-chapter"
                        key={index}
                        style={{ animationDelay: `${index * 90}ms` }}
                      >
                        <span className="character-profile__story-number">
                          {index + 1}
                        </span>

                        <div className="character-profile__story-body">
                          <h3 className="character-profile__story-label">
                            {chapterTitles[index]?.kanji ?? index + 1}
                            {' · '}
                            {chapterTitles[index]?.en ?? 'CHAPTER'}
                          </h3>
                          <p>{paragraph}</p>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p>
                      Background information for {character.name} is coming soon.
                    </p>
                  )}
                </div>

              </div>
            )}

            {/* GALLERY */}

            {activeTab === 'gallery' && (
              <div className="character-profile__panel">

                <span>VISUAL ARCHIVE</span>

                <h2>GALLERY</h2>

                <p>
                  Character artwork and memorable moments will appear here.
                </p>

              </div>
            )}

          </div>

        </section>

      </div>
    </main>
  )
}

export default CharacterProfilePage