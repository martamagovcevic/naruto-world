import './ClanCrest.css'

import type { CSSProperties, ReactElement } from 'react'

import type { ClanMood } from '../../data/clans'

type CrestProps = {
  mood: ClanMood
  clanId: string
  size?: 'sm' | 'md' | 'lg'
  title?: string
}

const MOTIF: Record<string, (() => ReactElement) | undefined> = {
  uchiha: () => (
    <g className="crest__motif crest__motif--sharingan">
      <circle className="crest__ring" cx="50" cy="50" r="34" />
      <path
        className="crest__stroke"
        d="M50 18a32 32 0 0 1 0 64 32 32 0 0 1 0-64Zm0 9a23 23 0 0 0 0 46 23 23 0 0 0 0-46Z"
      />
      <circle className="crest__stroke" cx="50" cy="50" r="15" />
      <circle className="crest__pupil" cx="50" cy="50" r="7" />
      <g className="crest__tomoe">
        <path
          className="crest__stroke"
          d="M50 35c6 0 9 4 9 8 0 3-2 5-5 5s-5-2-5-4 2-4 4-4"
        />
        <path
          className="crest__stroke"
          d="M64.5 58c-3 5-7.5 6.7-11.2 4.9-2.7-1.3-3.9-4-2.9-6.7 1-2.6 3.4-4 6-3.2 2.5.8 4 2.9 3.4 5"
        />
        <path
          className="crest__stroke"
          d="M35.5 58c3 5 7.5 6.7 11.2 4.9 2.7-1.3 3.9-4 2.9-6.7-1-2.6-3.4-4-6-3.2-2.5.8-4 2.9-3.4 5"
        />
      </g>
    </g>
  ),

  hyuga: () => (
    <g className="crest__motif crest__motif--chakra-line">
      <circle className="crest__ring" cx="50" cy="50" r="34" />
      <circle className="crest__stroke" cx="50" cy="50" r="26" />
      <circle className="crest__stroke" cx="50" cy="50" r="10" />
      <circle className="crest__pupil" cx="50" cy="50" r="4" />
      <g className="crest__chakra-vessels">
        <path className="crest__stroke" d="M50 24v16M50 60v16M24 50h16M60 50h16" />
        <path className="crest__stroke" d="M31.7 31.7l7 7M61.3 61.3l7 7M68.3 31.7l-7 7M38.7 61.3l-7 7" />
        <path className="crest__stroke" d="M50 40v-4M50 64v-4M40 50h-4M64 50h-4" />
      </g>
    </g>
  ),

  uzumaki: () => (
    <g className="crest__motif crest__motif--spiral">
      <circle className="crest__ring" cx="50" cy="50" r="34" />
      <g className="crest__spiral">
        <path
          className="crest__stroke"
          d="M50 50c0-9 7-16 16-16s16 7 16 16-7 16-16 16-16-7-16-16Zm0 0c0-5 4-9 9-9s9 4 9 9-4 9-9 9-9-4-9-9Z"
        />
        <path
          className="crest__stroke"
          d="M34 66c-9 0-16-7-16-16s7-16 16-16 16 7 16 16"
        />
        <path
          className="crest__stroke"
          d="M66 34c9 0 16 7 16 16s-7 16-16 16-16-7-16-16"
        />
      </g>
      <circle className="crest__pupil" cx="50" cy="50" r="5" />
    </g>
  ),

  senju: () => (
    <g className="crest__motif crest__motif--forest">
      <circle className="crest__ring" cx="50" cy="50" r="34" />
      <path
        className="crest__stroke"
        d="M50 22v44M50 40l-11-7M50 40l11-7M50 52l-13-8M50 52l13-8M50 64l-11-7M50 64l11-7"
      />
      <path
        className="crest__stroke"
        d="M50 66c-6 0-10-3-10-8 0-6 5-11 10-11s10 5 10 11c0 5-4 8-10 8Z"
      />
      <circle className="crest__pupil" cx="50" cy="72" r="4" />
    </g>
  ),

  nara: () => (
    <g className="crest__motif crest__motif--shadow">
      <circle className="crest__ring" cx="50" cy="50" r="34" />
      <path
        className="crest__stroke"
        d="M50 24c-6 8-9 15-9 22 0 6 4 11 9 11s9-5 9-11c0-7-3-14-9-22Z"
      />
      <path
        className="crest__stroke"
        d="M41 47c-8 4-13 10-13 17 0 8 9 14 22 14s22-6 22-14c0-7-5-13-13-17"
      />
      <path
        className="crest__stroke"
        d="M33 66c-4 3-6 6-6 9M67 66c4 3 6 6 6 9"
      />
      <circle className="crest__pupil" cx="50" cy="52" r="3" />
    </g>
  ),

  akimichi: () => (
    <g className="crest__motif crest__motif--earth">
      <circle className="crest__ring" cx="50" cy="50" r="34" />
      <path
        className="crest__stroke"
        d="M20 66c0-11 7-19 16-19 5 0 8 4 14 4s9-4 14-4c9 0 16 8 16 19"
      />
      <path className="crest__stroke" d="M26 72h48" />
      <path className="crest__stroke" d="M36 60l14-16 14 16" />
      <circle className="crest__stroke" cx="50" cy="34" r="9" />
      <circle className="crest__pupil" cx="50" cy="34" r="4" />
    </g>
  ),

  yamanaka: () => (
    <g className="crest__motif crest__motif--mental">
      <circle className="crest__ring" cx="50" cy="50" r="34" />
      <g className="crest__waves">
        <circle className="crest__stroke" cx="50" cy="50" r="9" />
        <circle className="crest__stroke" cx="50" cy="50" r="18" />
        <circle className="crest__stroke" cx="50" cy="50" r="27" />
      </g>
      <circle className="crest__pupil" cx="50" cy="50" r="5" />
    </g>
  ),
}

function ClanCrest({ mood, clanId, size = 'md', title }: CrestProps) {
  const renderMotif = MOTIF[clanId]

  return (
    <svg
      className={`clan-crest clan-crest--${size}`}
      viewBox="0 0 100 100"
      style={
        {
          '--crest-accent': mood.accent,
          '--crest-glow': mood.glow,
        } as CSSProperties
      }
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <circle className="crest__halo" cx="50" cy="50" r="46" />
      {renderMotif ? renderMotif() : <circle className="crest__ring" cx="50" cy="50" r="34" />}
    </svg>
  )
}

export default ClanCrest