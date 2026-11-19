import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent, RefObject } from 'react'
import { Link } from 'react-router-dom'

import ClanCrest from '../  components/ClanCrest/ClanCrest'

import { characters } from '../data/character'

import {
  clanRelations,
  clans,
  getClanLineage,
  getClanMembers,
  getClanRelations,
  getLineageGenerations,
  type LineagePerson,
  type LineageUnion,
} from '../data/clans'

import './ClansPage.css'

type View = 'clans' | 'bloodlines'

const VIEW_COPY: Record<View, { kanji: string; hint: string }> = {
  clans: {
    kanji: '族',
    hint: 'Select a crest to open its record. The threads mark ties between clans.',
  },
  bloodlines: {
    kanji: '血',
    hint: 'The family line of the selected clan, as far as the archive records it.',
  },
}

const charactersById = new Map(characters.map((c) => [c.id, c]))

/**
 * The network is two centred flow rows. Keyboard travel works on a
 * fractional cell coordinate per row, so left and right follow the crests
 * a sighted user sees in that row, and up and down cross between rows.
 */
const rowMembers = (row: 1 | 2) =>
  clans
    .filter((clan) => clan.position.row === row)
    .sort((a, b) => a.position.order - b.position.order)

const ROWS: (1 | 2)[] = [1, 2]

const cellOf = (clan: (typeof clans)[number]) => {
  const row = rowMembers(clan.position.row)

  return {
    row: clan.position.row,
    x: (row.findIndex((item) => item.id === clan.id) + 0.5) / row.length,
  }
}

/* ========================================
   PIXEL MEASUREMENT

   Every connector on this page is drawn in
   real pixel space rather than in a 0-100
   viewBox. Percent boxes stretch strokes and
   dash patterns unevenly, and a line aimed at
   an estimated centre drifts off its crest.
   Measuring the DOM instead means a thread
   always terminates on the ring it belongs to,
   at any viewport width.
   ======================================== */

type Rect = { x: number; y: number; w: number; h: number }

/**
 * How much vertical room a junction needs, in pixels. A fan that splits into
 * several children is worth the extra height; a single parent above a single
 * child would just be a long line through a gap, so it is drawn tightly.
 */
const JUNCTION_TRAVEL = {
  wide: { parentDrop: 24, stem: 30 },
  narrow: { parentDrop: 15, stem: 20 },
} as const

type Density = keyof typeof JUNCTION_TRAVEL

/**
 * Reads the position and size of every `[data-node]` inside `containerRef`
 * relative to that container, and re-reads them whenever the layout can
 * change: a resize, a different selection, or late-arriving images and
 * webfonts shifting the cards.
 */
function useNodeRects(
  containerRef: RefObject<HTMLElement | null>,
  nodeKeys: string[],
  signature: string,
) {
  const [box, setBox] = useState({ w: 0, h: 0 })
  const [rects, setRects] = useState<Record<string, Rect>>({})

  useLayoutEffect(() => {
    const container = containerRef.current

    if (!container) return

    let frame = 0

    const measure = () => {
      const base = container.getBoundingClientRect()

      setBox({ w: base.width, h: base.height })

      const next: Record<string, Rect> = {}

      for (const key of nodeKeys) {
        const element = container.querySelector<HTMLElement>(
          `[data-node="${CSS.escape(key)}"]`,
        )

        if (!element) continue

        const rect = element.getBoundingClientRect()

        next[key] = {
          x: rect.left - base.left,
          y: rect.top - base.top,
          w: rect.width,
          h: rect.height,
        }
      }

      setRects(next)
    }

    /**
     * Measurement always happens off the effect body, on the next frame, so
     * the browser has already resolved layout and any image decode.
     */
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    schedule()

    const observer = new ResizeObserver(schedule)
    observer.observe(container)

    for (const key of nodeKeys) {
      const element = container.querySelector<HTMLElement>(
        `[data-node="${CSS.escape(key)}"]`,
      )

      if (element) observer.observe(element)
    }

    const settled = window.setTimeout(schedule, 400)
    const late = window.setTimeout(schedule, 1500)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(settled)
      clearTimeout(late)
      observer.disconnect()
    }
  }, [containerRef, nodeKeys, signature])

  return { box, rects }
}

/**
 * Trims a thread back to the edge of each crest it joins, so the line reads
 * as meeting the clan rather than vanishing into it. A slight perpendicular
 * bow keeps the network from looking like a spreadsheet.
 */
function threadBetween(a: Rect, b: Rect, bow: number) {
  const ax = a.x + a.w / 2
  const ay = a.y + a.h / 2
  const bx = b.x + b.w / 2
  const by = b.y + b.h / 2

  const dx = bx - ax
  const dy = by - ay
  const length = Math.hypot(dx, dy) || 1
  const ux = dx / length
  const uy = dy / length

  const x1 = ax + ux * (a.w / 2)
  const y1 = ay + uy * (a.h / 2)
  const x2 = bx - ux * (b.w / 2)
  const y2 = by - uy * (b.h / 2)

  const mx = (x1 + x2) / 2 - uy * (length * bow)
  const my = (y1 + y2) / 2 + ux * (length * bow)

  return {
    d: `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`,
    mx,
    my,
  }
}

/**
 * Turns one set of co-parents and their shared children into a pedigree.
 *
 * Each parent drops to a shared horizontal bar, the middle of that bar is
 * the junction, and the junction fans out to the children. Two parents
 * therefore read as one pair with one point of descent, and it stays
 * readable whatever the children are called.
 */
function buildPedigree(
  union: LineageUnion,
  rects: Record<string, Rect>,
  travel: (typeof JUNCTION_TRAVEL)[Density],
) {
  const parents = union.parents
    .map((person) => rects[`p:${union.id}:${person.id}`])
    .filter((rect): rect is Rect => Boolean(rect))

  const children = union.children
    .map((person) => rects[`c:${person.id}`])
    .filter((rect): rect is Rect => Boolean(rect))

  if (parents.length === 0 || children.length === 0) return null

  const parentFeet = parents.map((rect) => ({
    x: rect.x + rect.w / 2,
    y: rect.y + rect.h,
  }))

  const coupleY =
    Math.max(...parentFeet.map((foot) => foot.y)) + travel.parentDrop

  const junctionX =
    parentFeet.reduce((total, foot) => total + foot.x, 0) / parentFeet.length

  const siblingY = coupleY + travel.stem

  const childTops = children.map((rect) => ({
    x: rect.x + rect.w / 2,
    y: rect.y,
  }))

  const lines: string[] = []

  for (const foot of parentFeet) {
    lines.push(`M ${foot.x} ${foot.y} L ${foot.x} ${coupleY}`)
  }

  if (parentFeet.length > 1) {
    const xs = parentFeet.map((foot) => foot.x)

    lines.push(`M ${Math.min(...xs)} ${coupleY} L ${Math.max(...xs)} ${coupleY}`)
  }

  lines.push(`M ${junctionX} ${coupleY} L ${junctionX} ${siblingY}`)

  if (childTops.length > 1) {
    const xs = childTops.map((top) => top.x)

    lines.push(
      `M ${Math.min(...xs)} ${siblingY} L ${Math.max(...xs)} ${siblingY}`,
    )
  }

  for (const top of childTops) {
    lines.push(`M ${top.x} ${siblingY} L ${top.x} ${top.y}`)
  }

  return {
    d: lines.join(' '),
    junction: { x: junctionX, y: coupleY },
    isPair: parentFeet.length > 1,
  }
}

function ClansPage() {
  const [view, setView] = useState<View>('clans')
  const [selectedId, setSelectedId] = useState<string>(clans[0].id)
  const stageRef = useRef<HTMLElement | null>(null)
  const networkRef = useRef<HTMLDivElement | null>(null)
  const treeRef = useRef<HTMLDivElement | null>(null)

  const selected = useMemo(
    () => clans.find((clan) => clan.id === selectedId) ?? clans[0],
    [selectedId],
  )

  const members = useMemo(() => getClanMembers(selected.name), [selected.name])
  const relations = useMemo(() => getClanRelations(selected.id), [selected.id])
  const lineage = useMemo(() => getClanLineage(selected.id), [selected.id])
  const generations = useMemo(() => getLineageGenerations(lineage), [lineage])

  const profileCount = useMemo(
    () =>
      clans.reduce(
        (total, clan) => total + getClanMembers(clan.name).length,
        0,
      ),
    [],
  )

  /* ---- network threads, measured against the real crests ---- */
  const clanIds = useMemo(() => clans.map((clan) => clan.id), [])
  const network = useNodeRects(networkRef, clanIds, selectedId)

  const threads = useMemo(
    () =>
      clanRelations
        .map((relation, index) => {
          const from = network.rects[relation.from]
          const to = network.rects[relation.to]

          if (!from || !to) return null

          return {
            id: relation.id,
            ...threadBetween(from, to, index % 2 === 0 ? 0.05 : -0.05),
            lit:
              relation.from === selectedId || relation.to === selectedId,
          }
        })
        .filter((thread): thread is NonNullable<typeof thread> =>
          Boolean(thread),
        ),
    [network.rects, selectedId],
  )

  /* ---- family tree, measured against the real cards ---- */
  const treeNodes = useMemo(() => {
    const keys: string[] = []

    for (const union of generations.unions) {
      for (const parent of union.parents) {
        keys.push(`p:${union.id}:${parent.id}`)
      }

      for (const child of union.children) {
        keys.push(`c:${child.id}`)
      }
    }

    return keys
  }, [generations.unions])

  const tree = useNodeRects(
    treeRef,
    treeNodes,
    `${view}:${selectedId}:${generations.unions.length}`,
  )

  /**
   * A clan whose recorded line branches into more than one child earns the
   * full pedigree height. A single parent above a single child is drawn
   * tightly, so sparse clans stay short instead of being stretched to match
   * the largest tree on the page.
   */
  const density: Density = generations.children.length > 1 ? 'wide' : 'narrow'

  const pedigrees = useMemo(
    () =>
      generations.unions
        .map((union) => {
          const geometry = buildPedigree(
            union,
            tree.rects,
            JUNCTION_TRAVEL[density],
          )

          return geometry ? { key: union.id, ...geometry } : null
        })
        .filter(
          (item): item is NonNullable<typeof item> => Boolean(item),
        ),
    [generations.unions, tree.rects, density],
  )

  /**
   * `moveFocus` is false when the selection happens from inside the network,
   * because arrow-key travel has to stay on the crest row. When a clan is
   * picked from a tie or a list, focus follows the swap onto the new heading.
   */
  const selectClan = (clanId: string, moveFocus = true) => {
    if (clanId === selectedId) return

    if (moveFocus) {
      requestAnimationFrame(() => {
        stageRef.current
          ?.querySelector<HTMLElement>('[data-clan-heading]')
          ?.focus()
      })
    }

    setSelectedId(clanId)
  }

  /* ---- arrow-key travel across the network ---- */
  const handleNetworkKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      return
    }

    const trigger = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-clan-id]',
    )

    const current = clans.find((clan) => clan.id === trigger?.dataset.clanId)

    if (!current) return

    event.preventDefault()

    const origin = cellOf(current)

    const scored = clans
      .filter((clan) => clan.id !== current.id)
      .map((clan) => {
        const cell = cellOf(clan)

        const dx = cell.x - origin.x
        const dy = cell.row - origin.row

        const primary =
          event.key === 'ArrowRight'
            ? dx
            : event.key === 'ArrowLeft'
              ? -dx
              : event.key === 'ArrowDown'
                ? dy
                : -dy

        const secondary =
          event.key === 'ArrowRight' || event.key === 'ArrowLeft'
            ? Math.abs(dy)
            : Math.abs(dx)

        return { clan, distance: Math.hypot(primary, secondary) }
      })
      .filter((entry) => entry.distance > 0)
      .sort((a, b) => a.distance - b.distance)

    if (scored.length === 0) return

    const next = scored[0].clan

    selectClan(next.id, false)
    networkRef.current
      ?.querySelector<HTMLElement>(`[data-clan-id="${next.id}"]`)
      ?.focus()
  }

  const pageStyle = {
    '--clan-accent': selected.mood.accent,
    '--clan-glow': selected.mood.glow,
    '--clan-deep': selected.mood.deep,
    '--clan-mist': selected.mood.mist,
  } as CSSProperties

  return (
    <main className="clans-page" style={pageStyle} data-mood={selected.mood.motif}>
      {/* ========================================
          HERO
      ======================================== */}
      <section className="clans-hero">
        <span className="clans-hero__kanji" aria-hidden="true">
          族
        </span>

        <span className="clans-hero__seal" aria-hidden="true">
          <ClanCrest mood={selected.mood} clanId={selected.id} size="md" />
        </span>

        <div className="clans-hero__content">
          <p className="clans-hero__eyebrow">族 · SHINOBI BLOODLINES</p>

          <h1 className="clans-hero__title">THE CLAN ARCHIVE</h1>

          <p className="clans-hero__tagline">
            Bloodlines decide which jutsu a shinobi learns, which dōjutsu they
            wake and which village remembers their name.
          </p>

          <div className="clans-hero__meta">
            <span>{clans.length} Clans</span>
            <i aria-hidden="true" />
            <span>{profileCount} Profiles Linked</span>
          </div>
        </div>
      </section>

      {/* ========================================
          VIEW TOGGLE
      ======================================== */}
      <div className="clans-viewswitch">
        <div
          className="clans-viewswitch__track"
          role="group"
          aria-label="Archive view"
        >
          {(['clans', 'bloodlines'] as View[]).map((mode) => {
            const active = view === mode

            return (
              <button
                key={mode}
                type="button"
                className={`clans-viewswitch__option ${
                  active ? 'clans-viewswitch__option--active' : ''
                }`}
                aria-pressed={active}
                onClick={() => setView(mode)}
              >
                <span className="clans-viewswitch__kanji" aria-hidden="true">
                  {VIEW_COPY[mode].kanji}
                </span>

                <span className="clans-viewswitch__label">
                  {mode === 'clans' ? 'Clans' : 'Bloodlines'}
                </span>
              </button>
            )
          })}
        </div>

        <p className="clans-viewswitch__hint" aria-live="polite">
          {VIEW_COPY[view].hint}
        </p>
      </div>

      {/* ========================================
          CREST NETWORK  ·  SHARED BY BOTH VIEWS
      ======================================== */}
      <section className="clans-net">
        {threads.length > 0 && (
          <svg
            className="clans-net__links"
            viewBox={`0 0 ${network.box.w} ${network.box.h}`}
            width={network.box.w}
            height={network.box.h}
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="clan-thread"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2={network.box.w}
                y2={network.box.h}
              >
                <stop offset="0%" stopColor="var(--clan-accent)" />
                <stop offset="100%" stopColor="var(--clan-glow)" />
              </linearGradient>
            </defs>

            {threads.map((thread, index) => (
              <path
                key={thread.id}
                className={`clans-net__link ${
                  thread.lit ? 'clans-net__link--lit' : ''
                }`}
                d={thread.d}
                stroke="url(#clan-thread)"
                style={{ '--i': index } as CSSProperties}
              />
            ))}
          </svg>
        )}

        <div
          className="clans-net__nodes"
          ref={networkRef}
          onKeyDown={handleNetworkKeyDown}
        >
          {ROWS.map((row) => (
            <div className="clans-net__row" key={row}>
              {rowMembers(row).map((clan, index) => {
                const active = clan.id === selected.id
                const tied = relations.some(
                  (relation) =>
                    relation.from === clan.id || relation.to === clan.id,
                )

                return (
                  <button
                    key={clan.id}
                    type="button"
                    data-clan-id={clan.id}
                    className={`clans-node ${
                      active ? 'clans-node--active' : ''
                    }`}
                    style={
                      {
                        '--i': row * 4 + index,
                        '--lift': `${clan.position.lift}px`,
                        '--node-accent': clan.mood.accent,
                      } as CSSProperties
                    }
                    aria-pressed={active}
                    aria-label={`${clan.name} — ${
                      tied ? 'recorded tie' : 'no recorded tie'
                    }`}
                    onClick={() => selectClan(clan.id, false)}
                  >
                    <span className="clans-node__crest" data-node={clan.id}>
                      <ClanCrest mood={clan.mood} clanId={clan.id} size="lg" />
                    </span>

                    <span className="clans-node__label">{clan.name}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================
          CLANS MODE  ·  THE RECORD
      ======================================== */}
      {view === 'clans' && (
        <section className="clans-record" ref={stageRef} key={selected.id}>
          <span className="clans-record__seal" aria-hidden="true">
            {selected.seal}
          </span>

          <header className="clans-record__head">
            <div className="clans-record__crest">
              <ClanCrest
                mood={selected.mood}
                clanId={selected.id}
                size="md"
                title={`${selected.name} clan crest`}
              />
            </div>

            <div className="clans-record__titles">
              <p className="clans-record__reading">
                {selected.reading} · {selected.kanji}
              </p>

              <h2
                className="clans-record__name"
                data-clan-heading
                tabIndex={-1}
              >
                {selected.name}
              </h2>

              <p className="clans-record__village">{selected.village}</p>
            </div>

            <dl className="clans-record__facts">
              <div>
                <dt>Specialty</dt>
                <dd>{selected.specialty}</dd>
              </div>

              <div>
                <dt>Bloodline</dt>
                <dd>{selected.kekkeiGenkai}</dd>
              </div>
            </dl>
          </header>

          <section className="clans-record__block">
            <h3 className="clans-record__block-title">Signature Arts</h3>

            <ul className="clans-record__arts">
              {selected.abilities.map((ability) => (
                <li key={ability}>{ability}</li>
              ))}
            </ul>
          </section>

          <section className="clans-record__block">
            <h3 className="clans-record__block-title">History</h3>

            <div className="clans-record__history">
              {selected.history.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="clans-record__block">
            <h3 className="clans-record__block-title">Notable Members</h3>

            <div className="clans-record__members">
              {members.length > 0 ? (
                <ul className="clans-roster">
                  {members.map((member) => (
                    <li key={member.id}>
                      <Link
                        className="clans-profile"
                        to={`/characters/${member.id}`}
                      >
                        <span className="clans-profile__portrait">
                          <img
                            src={member.image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                        </span>

                        <span className="clans-profile__text">
                          <strong>{member.name}</strong>

                          <small>{member.rank}</small>
                        </span>

                        <span className="clans-profile__go" aria-hidden="true">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="clans-record__none">
                  No profile in the archive is recorded as {selected.name}.
                </p>
              )}

              <ul className="clans-figures">
                {selected.notable.map((figure) => (
                  <li key={figure.name}>
                    <strong>{figure.name}</strong>

                    <span>{figure.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {relations.length > 0 && (
            <details className="clans-ties">
              <summary>
                <span className="clans-ties__summary-label">
                  Recorded ties with other clans
                </span>

                <span className="clans-ties__summary-count">
                  {relations.length}
                </span>
              </summary>

              <ul className="clans-ties__list">
                {relations.map((relation) => {
                  const otherId =
                    relation.from === selected.id ? relation.to : relation.from
                  const other = clans.find((clan) => clan.id === otherId)

                  if (!other) return null

                  return (
                    <li key={relation.id}>
                      <button
                        type="button"
                        className="clans-tie"
                        style={
                          {
                            '--tie-accent': other.mood.accent,
                          } as CSSProperties
                        }
                        onClick={() => selectClan(other.id)}
                        aria-label={`Open the ${other.name} clan record`}
                      >
                        <span className="clans-tie__crest" aria-hidden="true">
                          <ClanCrest
                            mood={other.mood}
                            clanId={other.id}
                            size="sm"
                          />
                        </span>

                        <span className="clans-tie__body">
                          <span className="clans-tie__head">
                            <strong>{other.name}</strong>

                            <span className="clans-tie__kind">
                              {relation.label}
                            </span>
                          </span>

                          <span className="clans-tie__detail">
                            {relation.detail}
                          </span>

                          <span className="clans-tie__cta">
                            View Clan
                            <span aria-hidden="true"> →</span>
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </details>
          )}
        </section>
      )}

      {/* ========================================
          BLOODLINES MODE  ·  THE FAMILY LINE
      ======================================== */}
      {view === 'bloodlines' && (
        <section
          className="clans-tree"
          ref={stageRef}
          key={selected.id}
          data-density={density}
        >
          <header className="clans-tree__head">
            <div className="clans-tree__crest">
              <ClanCrest
                mood={selected.mood}
                clanId={selected.id}
                size="md"
              />
            </div>

            <div>
              <p className="clans-tree__eyebrow">Family Line</p>

              <h2 className="clans-tree__title" data-clan-heading tabIndex={-1}>
                {selected.name} Lineage
              </h2>

              <p className="clans-tree__summary">{lineage?.summary}</p>
            </div>
          </header>

          {lineage && lineage.people.length > 0 ? (
            <div className="clans-tree__body" ref={treeRef}>
              {pedigrees.length > 0 && (
                <svg
                  className="clans-tree__branches"
                  viewBox={`0 0 ${tree.box.w} ${tree.box.h}`}
                  width={tree.box.w}
                  height={tree.box.h}
                  aria-hidden="true"
                >
                  {pedigrees.map((pedigree, index) => (
                    <g key={pedigree.key}>
                      <path
                        className="clans-tree__branch"
                        d={pedigree.d}
                        style={{ '--i': index } as CSSProperties}
                      />

                      <circle
                        className="clans-tree__junction"
                        cx={pedigree.junction.x}
                        cy={pedigree.junction.y}
                        r={pedigree.isPair ? 5 : 4}
                      />
                    </g>
                  ))}
                </svg>
              )}

              <div className="clans-tree__unions">
                {generations.unions.map((union) => (
                  <section className="clans-tree__union" key={union.id}>
                    <div className="clans-tree__band">
                      <h3 className="clans-tree__band-title">
                        {union.parents.length > 1
                          ? 'Parents'
                          : 'Recorded parent'}
                      </h3>

                      <div className="clans-tree__row">
                        {union.parents.map((person) => (
                          <TreeNode
                            key={person.id}
                            person={person}
                            nodeKey={`p:${union.id}:${person.id}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="clans-tree__band clans-tree__band--below">
                      <h3 className="clans-tree__band-title">
                        {union.children.length > 1
                          ? 'Children'
                          : 'Recorded child'}
                      </h3>

                      <div className="clans-tree__row">
                        {union.children.map((person) => (
                          <TreeNode
                            key={person.id}
                            person={person}
                            nodeKey={`c:${person.id}`}
                          />
                        ))}
                      </div>
                    </div>
                  </section>
                ))}
              </div>

              {generations.unattributed.length > 0 && (
                <aside className="clans-tree__kin">
                  <div className="clans-tree__kin-head">
                    <h3 className="clans-tree__band-title">Recorded kin</h3>

                    <p>
                      Named in the archive as part of this clan, but the
                      archive gives no parent line, so nothing is drawn above
                      them.
                    </p>
                  </div>

                  <div className="clans-tree__row clans-tree__row--kin">
                    {generations.unattributed.map((person) => (
                      <TreeNode key={person.id} person={person} />
                    ))}
                  </div>
                </aside>
              )}
            </div>
          ) : (
            <div className="clans-tree__empty">
              <span className="clans-tree__empty-kanji" aria-hidden="true">
                無
              </span>

              <h3>No recorded line</h3>

              <p>
                The archive holds no family relationship for the{' '}
                {selected.name}. Nothing is drawn rather than guessing one.
              </p>
            </div>
          )}

          {lineage && lineage.people.length > 0 && (
            <section className="clans-tree__notes">
              <h3 className="clans-tree__notes-title">
                What the archive records
              </h3>

              <ul>
                {lineage?.people.map((person) => (
                  <li key={person.id}>
                    <span className="clans-tree__note-name">
                      {person.name}
                    </span>

                    <span className="clans-tree__note-relation">
                      {person.relation}
                    </span>

                    {person.note && (
                      <span className="clans-tree__note-text">
                        {person.note}
                      </span>
                    )}

                    {person.extra?.map((extra) => (
                      <span
                        key={extra}
                        className="clans-tree__note-extra"
                      >
                        {extra}
                      </span>
                    ))}
                  </li>
                ))}
              </ul>

              <p className="clans-tree__source">
                Source: {lineage?.source}. Anyone the archive does not name,
                or whose relationship it does not state, is left out.
              </p>
            </section>
          )}
        </section>
      )}
    </main>
  )
}

function TreeNode({
  person,
  nodeKey,
}: {
  person: LineagePerson
  nodeKey?: string
}) {
  const character = person.characterId
    ? charactersById.get(person.characterId)
    : undefined

  return (
    <div
      className="clans-tree__node"
      data-node={nodeKey}
      data-linked={character ? 'true' : undefined}
    >
      {nodeKey ? (
        <span className="clans-tree__node-dot" aria-hidden="true" />
      ) : null}

      <div className="clans-tree__node-card">
        {character ? (
          <Link
            className="clans-tree__person clans-tree__person--linked"
            to={`/characters/${character.id}`}
          >
            <span className="clans-tree__portrait">
              <img
                src={character.image}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </span>

            <strong>{person.name}</strong>

            <small>{person.relation}</small>

            <span className="clans-tree__person-go">
              Profile
              <span aria-hidden="true"> →</span>
            </span>
          </Link>
        ) : (
          <span className="clans-tree__person">
            <strong>{person.name}</strong>

            <small>{person.relation}</small>
          </span>
        )}
      </div>
    </div>
  )
}

export default ClansPage
