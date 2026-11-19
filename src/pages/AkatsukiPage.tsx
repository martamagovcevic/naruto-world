import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import { akatsukiMembers } from '../data/akatsuki'
import { characters } from '../data/character'

import './AkatsukiPage.css'

const charactersById = new Map(characters.map((c) => [c.id, c]))

type MemberVM = {
  id: string
  name: string
  origin: string
  partner: string
  ring: string
  ringName: string
  role: string
  glyph: string
  short: string
  accent: string
  image: string
  profileId: string
}

const members: MemberVM[] = akatsukiMembers.map((member) => {
  const character = charactersById.get(member.characterId)!

  return {
    ...member,
    name: character.name,
    origin: character.village,
    image: character.image,
    profileId: character.id,
  }
})

const ROSTER_COPY = {
  eyebrow: 'The Roster',
  title: 'Members',
  count: '10 Operatives',
}

const ORG_COPY = {
  eyebrow: 'Behind the Red Clouds',
  title: 'The Organization',
  lead:
    'Akatsuki began as a dream in the rain of Amegakure \u2014 three war orphans raised by Jiraiya who swore to end the cycle of war. When that dream died, what rose in its place gathered the world\u2019s most dangerous missing-nin under blood-red clouds, bound by a single creed: to capture the tailed beasts, force the endless conflict to a halt, and write peace in the only language the world understands \u2014 pain.',
}

function Cloud() {
  return (
    <span className="ak-cloud" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  )
}

function AkatsukiPage() {
  const [openId, setOpenId] = useState<string | null>(null)
  const rosterRef = useRef<HTMLElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  const leader = members[0]
  const gridMembers = members.slice(1)

  const openMember = useMemo(
    () => members.find((member) => member.id === openId) ?? null,
    [openId],
  )

  const openIndex = openMember
    ? members.findIndex((member) => member.id === openMember.id)
    : -1

  useEffect(() => {
    if (!openId) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenId(null)
    }

    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [openId])

  const scrollToRoster = () => {
    rosterRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="akatsuki-page">
      {/* ========================================
          CINEMATIC HERO
      ======================================== */}
      <section className="akatsuki-hero">
        <span className="akatsuki-hero__kanji" aria-hidden="true">
          暁
        </span>

        <span className="ak-cloud akatsuki-hero__cloud akatsuki-hero__cloud--a" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>

        <span className="ak-cloud akatsuki-hero__cloud akatsuki-hero__cloud--b" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>

        <span className="ak-cloud akatsuki-hero__cloud akatsuki-hero__cloud--c" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>

        <span className="akatsuki-hero__glow" aria-hidden="true" />

        <div className="akatsuki-hero__content">
          <p className="akatsuki-hero__eyebrow">暁 · The Hidden Dawn</p>

          <h1 className="akatsuki-hero__title">AKATSUKI</h1>

          <p className="akatsuki-hero__tagline">
            An organization of missing-nin gathered under a blood-red sky, bound
            by a single promise {'\u2014'} to give the world pain, and through
            that pain, peace.
          </p>

          <button
            type="button"
            className="akatsuki-hero__cta"
            onClick={scrollToRoster}
          >
            Meet the Members
            <span aria-hidden="true">↓</span>
          </button>
        </div>
      </section>

      {/* ========================================
          MEMBERS ARCHIVE
      ======================================== */}
      <section className="akatsuki-roster" id="roster" ref={rosterRef}>
        <div className="akatsuki-roster__head">
          <div>
            <p className="akatsuki-roster__eyebrow">{ROSTER_COPY.eyebrow}</p>
            <h2 className="akatsuki-roster__title">{ROSTER_COPY.title}</h2>
          </div>

          <span className="akatsuki-roster__count">{ROSTER_COPY.count}</span>
        </div>

        <div className="akatsuki-roster__body">
          {/* -- featured leader dossier -- */}

          <button
            type="button"
            className="akatsuki-feature"
            style={{ '--ak-member': leader.accent } as CSSProperties}
            onClick={() => setOpenId(leader.id)}
            aria-haspopup="dialog"
            aria-label={`Open details for ${leader.name}`}
          >
            <span className="akatsuki-feature__media">
              <img src={leader.image} alt="" />
            </span>

            <span className="akatsuki-feature__veil" />

            <span className="akatsuki-feature__body">
              <span className="akatsuki-feature__index">01</span>

              <span className="akatsuki-feature__leader">The Leader</span>

              <strong className="akatsuki-feature__name">{leader.name}</strong>

              <span className="akatsuki-feature__role">{leader.role}</span>

              <span className="akatsuki-feature__ring">
                <b>{leader.ring}</b> {leader.ringName} Ring
              </span>

              <span className="akatsuki-feature__meta">
                From {leader.origin} · Partner {'\u2014'} {leader.partner}
              </span>

              <span className="akatsuki-feature__hint">
                Open File
                <span aria-hidden="true">→</span>
              </span>
            </span>
          </button>

          {/* -- uniform member grid -- */}

          <div className="akatsuki-grid">
            {gridMembers.map((member, index) => (
              <button
                type="button"
                key={member.id}
                className="akatsuki-tile"
                style={
                  {
                    '--i': index,
                    '--ak-member': member.accent,
                  } as CSSProperties
                }
                onClick={() => setOpenId(member.id)}
                aria-haspopup="dialog"
                aria-label={`Open details for ${member.name}`}
              >
                <span className="akatsuki-tile__index">
                  {String(index + 2).padStart(2, '0')}
                </span>

                <span className="akatsuki-tile__ring">{member.ring}</span>

                <span className="akatsuki-tile__media">
                <img src={member.image} alt="" />
              </span>

                <span className="akatsuki-tile__veil" />

                <span className="ak-cloud akatsuki-tile__cloud">
                  <i />
                  <i />
                  <i />
                </span>

                <span className="akatsuki-tile__caption">
                  <span className="akatsuki-tile__role">{member.role}</span>
                  <strong className="akatsuki-tile__name">{member.name}</strong>
                  <span className="akatsuki-tile__partner">
                    Partner {'\u2014'} {member.partner}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          ORGANIZATION
      ======================================== */}
      <section className="akatsuki-org">
        <span className="ak-cloud akatsuki-org__cloud akatsuki-org__cloud--a" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>

        <span className="ak-cloud akatsuki-org__cloud akatsuki-org__cloud--b" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>

        <div className="akatsuki-org__grid">
          <div className="akatsuki-org__narrative">
            <p className="akatsuki-org__eyebrow">{ORG_COPY.eyebrow}</p>

            <h2 className="akatsuki-org__title">{ORG_COPY.title}</h2>

            <p className="akatsuki-org__lead">{ORG_COPY.lead}</p>
          </div>

          <dl className="akatsuki-org__facts">
            <div>
              <Cloud />
              <dt>Origins</dt>
              <dd>Amegakure</dd>
            </div>

            <div>
              <Cloud />
              <dt>Objective</dt>
              <dd>The Nine Tailed Beasts</dd>
            </div>

            <div>
              <Cloud />
              <dt>Mark</dt>
              <dd>The Red Cloud</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ========================================
          MEMBER DRAWER  ·  CLASSIFIED DOSSIER
      ======================================== */}
      <div
        className={`akatsuki-drawer ${
          openMember ? 'akatsuki-drawer--open' : ''
        }`}
        aria-hidden={!openMember}
      >
        <div
          className="akatsuki-drawer__overlay"
          onClick={() => setOpenId(null)}
        />

        <aside
          className="akatsuki-drawer__panel"
          role="dialog"
          aria-modal="true"
          aria-label={openMember ? openMember.name : undefined}
        >
          {openMember && (
            <>
              <div
                className="akatsuki-drawer__media"
                style={{ '--ak-member': openMember.accent } as CSSProperties}
              >
                <img
                  src={openMember.image}
                  alt={`${openMember.name} portrait`}
                />

                <span className="akatsuki-drawer__stamp">
                  {openMember.ring}
                </span>

                <span className="akatsuki-drawer__bingo">Bingo Book Entry</span>

                <span className="akatsuki-drawer__file-no">
                  NO. {String(openIndex + 1).padStart(2, '0')}
                </span>

                <button
                  type="button"
                  ref={closeRef}
                  className="akatsuki-drawer__close"
                  onClick={() => setOpenId(null)}
                  aria-label="Close member details"
                >
                  ×
                </button>
              </div>

              <div className="akatsuki-drawer__body">
                <p className="akatsuki-drawer__eyebrow">
                  Akatsuki Index {'\u2014'} {openMember.ringName} Ring
                </p>

                <h3 className="akatsuki-drawer__name">{openMember.name}</h3>

                <p className="akatsuki-drawer__role">{openMember.role}</p>

                <dl className="akatsuki-drawer__facts">
                  <div>
                    <dt>Origin</dt>
                    <dd>{openMember.origin}</dd>
                  </div>

                  <div>
                    <dt>Partner</dt>
                    <dd>{openMember.partner}</dd>
                  </div>

                  <div>
                    <dt>Ring</dt>
                    <dd>
                      <b>{openMember.ring}</b> {openMember.ringName}
                    </dd>
                  </div>
                </dl>

                <div className="akatsuki-drawer__notes">
                  <span className="akatsuki-drawer__notes-label">
                    Record Synopsis
                  </span>

                  <p className="akatsuki-drawer__short">{openMember.short}</p>
                </div>
              </div>

              <div className="akatsuki-drawer__footer">
                <Link
                  className="akatsuki-drawer__cta"
                  to={`/characters/${openMember.profileId}`}
                >
                  <span>View Character Profile</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}

export default AkatsukiPage