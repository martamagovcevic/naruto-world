import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { characters } from '../data/character'
import {
  accumulatePersonalityScores,
  computePersonalityMatch,
  personalityQuestions,
  personalityTraits,
} from '../data/quizQuestions'
import type { PersonalityOption, PersonalityQuestion } from '../data/quizQuestions'
import { knowledgeQuestions } from '../data/quizKnowledgeQuestions'
import type { KnowledgeOption, KnowledgeQuestion } from '../data/quizKnowledgeQuestions'

import discoverSvg from '../assets/svg/discover-your-shinobi.svg?raw'
import knowledgeSvg from '../assets/svg/test-your-knowledge.svg?raw'

import './QuizPage.css'

type Mode = 'landing' | 'personality' | 'knowledge' | 'personalityResult' | 'knowledgeResult'

const charactersById = new Map(characters.map((character) => [character.id, character]))

/** The knowledge quiz pauses briefly after each answer so the result is visible. */
const KNOWLEDGE_REVIEW_MS = 700

/** A shorter beat lets the selected answer read before the next question slides in. */
const PERSONALITY_REVIEW_MS = 420

/**
 * Rules for the five ranks the knowledge quiz gives.
 * 0–3 Academy Student · 4–6 Genin · 7–8 Chunin · 9 Jonin · 10 Hokage Level.
 */
const rankOfScore = (score: number): string => {
  if (score >= 10) return 'Hokage Level'
  if (score === 9) return 'Jonin'
  if (score >= 7) return 'Chunin'
  if (score >= 4) return 'Genin'
  return 'Academy Student'
}

/** Display order for the rank ladder shown on the knowledge result screen. */
const examRanks = ['Academy Student', 'Genin', 'Chunin', 'Jonin', 'Hokage Level']

const classNames = (...classes: (string | false | undefined)[]) =>
  classes.filter((value): value is string => Boolean(value)).join(' ')

/**
 * Renders the decorative, animated part of a screen. Inlined via `?raw` so
 * the SVG runs its SMIL animations and can be tinted/restyled by CSS, instead
 * of shipping it as a pixel asset.
 */
function QuizAmbient({ svg, className }: { svg: string; className: string }) {
  return (
    <div className={className} aria-hidden="true">
      <div className="quiz-step__ambient-svg" dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  )
}

function QuizStep({
  index,
  total,
  children,
  decorative,
  mode,
  onBack,
}: {
  index: number
  total: number
  children: ReactNode
  decorative?: ReactNode
  mode: 'personality' | 'knowledge'
  onBack: () => void
}) {
  return (
    <div className="quiz-step" data-mode={mode}>
      <div className="quiz-step__body">
        <button type="button" className="quiz-step__back" onClick={onBack}>
          <span aria-hidden="true">←</span> Back to Quiz Hub
        </button>

        <div className="quiz-progress">
          <span className="quiz-progress__text">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>

          <ol className="quiz-progress__seals" aria-hidden="true">
            {Array.from({ length: total }, (_, i) => {
              const done = i < index

              return (
                <li
                  key={i}
                  className={classNames(
                    'quiz-seal',
                    i === index ? 'quiz-seal--current' : 'quiz-seal--other',
                    done ? 'quiz-seal--done' : undefined,
                  )}
                />
              )
            })}
          </ol>
        </div>

        <div className="quiz-question-wrap">{children}</div>
      </div>

      <div className="quiz-step__decor" aria-hidden="true">
        <span className="quiz-step__kanji">{mode === 'personality' ? '忍' : '試'}</span>
        <span className="quiz-step__glow" />
        <span className="quiz-step__texture" />
      </div>

      {decorative}
    </div>
  )
}

function QuizQuestion({
  eyebrow,
  prompt,
  children,
  feedback,
}: {
  eyebrow: string
  prompt: string
  children: ReactNode
  feedback?: ReactNode
}) {
  return (
    <div className="quiz-question">
      <p className="quiz-question__eyebrow">{eyebrow}</p>

      <h2 className="quiz-question__prompt">{prompt}</h2>

      {feedback && (
        <p className="quiz-question__feedback" role="status">
          {feedback}
        </p>
      )}

      {children}
    </div>
  )
}

function QuizResult({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <section className={`quiz-result ${className}`}>{children}</section>
}

function QuizPage() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('landing')
  const [personalityIndex, setPersonalityIndex] = useState(0)
  const [personalityAnswers, setPersonalityAnswers] = useState<
    Record<string, PersonalityOption>
  >({})
  const [knowledgeIndex, setKnowledgeIndex] = useState(0)
  /** The chosen option is kept so the correct answer can be revealed properly. */
  const [knowledgeAnswers, setKnowledgeAnswers] = useState<Record<string, KnowledgeOption>>({})

  /** Clears the auto-advance timer no matter when we leave either quiz. */
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cancelAdvance = () => {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current)
      advanceTimer.current = null
    }
  }

  const resetPersonality = () => {
    setPersonalityIndex(0)
    setPersonalityAnswers({})
  }

  const resetKnowledge = () => {
    setKnowledgeIndex(0)
    setKnowledgeAnswers({})
  }

  /**
   * "Back" always goes through this: it navigates explicitly to `/quiz` (never
   * `history.back()`) and wipes the in-flight quiz so the hub is fresh.
   */
  const backToHub = () => {
    cancelAdvance()
    // We are already on /quiz, so replace this entry instead of stacking a
    // duplicate — browser Back then leaves the exam instead of replaying a
    // stale question/result entry.
    navigate('/quiz', { replace: true })
    setMode('landing')
    resetPersonality()
    resetKnowledge()
  }

  /**
   * Only the in-flight quiz is reset, so the result screens can read what the
   * user answered without it being wiped behind them.
   */
  const switchMode = (next: Mode) => {
    cancelAdvance()
    setMode(next)

    const restartAll = next === 'landing'
    const showPersonalityResult = next === 'personalityResult'

    if (next === 'personality' || restartAll) resetPersonality()
    if (next === 'knowledge' || restartAll) resetKnowledge()
    if (showPersonalityResult) resetKnowledge()
  }

  const startPersonality = () => switchMode('personality')
  const startKnowledge = () => switchMode('knowledge')

  // Browser back/forward: reset to a predictable hub, never a stale question
  // or result.
  useEffect(() => {
    const onPop = () => {
      cancelAdvance()
      setMode('landing')
      resetPersonality()
      resetKnowledge()
    }

    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const handlePersonalityAnswer = (question: PersonalityQuestion, option: PersonalityOption) => {
    if (personalityAnswers[question.id]) return

    setPersonalityAnswers((previous) => ({
      ...previous,
      [question.id]: option,
    }))

    cancelAdvance()
    advanceTimer.current = setTimeout(() => {
      advanceTimer.current = null
      if (personalityIndex >= personalityQuestions.length - 1) {
        switchMode('personalityResult')
        return
      }
      setPersonalityIndex(personalityIndex + 1)
    }, PERSONALITY_REVIEW_MS)
  }

  const handleKnowledgeAnswer = (question: KnowledgeQuestion, option: KnowledgeOption) => {
    if (knowledgeAnswers[question.id]) return

    setKnowledgeAnswers((previous) => ({
      ...previous,
      [question.id]: option,
    }))

    cancelAdvance()
    advanceTimer.current = setTimeout(() => {
      advanceTimer.current = null
      if (knowledgeIndex >= knowledgeQuestions.length - 1) {
        switchMode('knowledgeResult')
        return
      }
      setKnowledgeIndex(knowledgeIndex + 1)
    }, KNOWLEDGE_REVIEW_MS)
  }

  /* ---------------------------------- Landing ---------------------------------- */

  const renderLanding = () => (
    <>
      <section className="quiz-hero">
        <p className="quiz-hero__eyebrow">NARUTO WORLD</p>

        <h1 className="quiz-hero__title">SHINOBI EXAM</h1>

        <p className="quiz-hero__tagline">“Every choice reveals the ninja within.”</p>
      </section>

      <div className="quiz-modes">
        <button
          type="button"
          className="quiz-mode quiz-mode--personality"
          onClick={startPersonality}
        >
          <QuizAmbient svg={discoverSvg} className="quiz-mode__illustration" />

          <div className="quiz-mode__body">
            <h2 className="quiz-mode__title">DISCOVER YOUR SHINOBI</h2>

            <p className="quiz-mode__text">
              Personality quiz that determines which Naruto character the user is most
              similar to.
            </p>

            <span className="quiz-mode__cta">Start the Personality Quiz →</span>
          </div>
        </button>

        <button
          type="button"
          className="quiz-mode quiz-mode--knowledge"
          onClick={startKnowledge}
        >
          <QuizAmbient svg={knowledgeSvg} className="quiz-mode__illustration" />

          <div className="quiz-mode__body">
            <h2 className="quiz-mode__title">TEST YOUR KNOWLEDGE</h2>

            <p className="quiz-mode__text">
              Naruto knowledge quiz — pick the answers and earn your rank.
            </p>

            <span className="quiz-mode__cta">Begin the Knowledge Quiz →</span>
          </div>
        </button>
      </div>
    </>
  )

  /* --------------------------------- Personality ------------------------------- */

  const renderPersonality = () => {
    const question = personalityQuestions[personalityIndex]

    if (!question) return null

    const selected = personalityAnswers[question.id]
    const isLocked = Boolean(selected)

    return (
      <QuizStep
        index={personalityIndex}
        total={personalityQuestions.length}
        decorative={<QuizAmbient svg={discoverSvg} className="quiz-step__ambient" />}
        mode="personality"
        onBack={backToHub}
      >
        <QuizQuestion
          eyebrow={`Question ${String(personalityIndex + 1).padStart(2, '0')} / ${String(
            personalityQuestions.length,
          ).padStart(2, '0')}`}
          prompt={question.prompt}
        >
          <div className="quiz-answers">
            {question.options.map((option) => (
              <button
                key={option.text}
                type="button"
                disabled={isLocked}
                className={classNames(
                  'quiz-answer',
                  selected === option ? 'quiz-answer--selected' : undefined,
                  isLocked && selected !== option ? 'quiz-answer--other' : undefined,
                )}
                onClick={() => handlePersonalityAnswer(question, option)}
              >
                {option.text}
              </button>
            ))}
          </div>
        </QuizQuestion>
      </QuizStep>
    )
  }

  const personalityScores = accumulatePersonalityScores(personalityAnswers)
  const personalityResult = mode === 'personalityResult'
    ? computePersonalityMatch(personalityScores)
    : null

  const renderPersonalityResult = () => {
    if (!personalityResult) return null

    const character = charactersById.get(personalityResult.characterId)

    if (!character) return null

    const scores = personalityScores
    const rankedTraits = [...personalityTraits].sort(
      (a, b) => (scores[b.id] ?? 0) - (scores[a.id] ?? 0),
    )
    const matchingTraits = rankedTraits.filter(
      (trait) => trait.characterId === personalityResult.characterId,
    )
    // Some characters only own one or two traits, so top the list up with the
    // next strongest ones — the reveal always reads as three dominant traits.
    const dominantTraits = [
      ...matchingTraits,
      ...rankedTraits.filter((trait) => !matchingTraits.includes(trait)),
    ].slice(0, 3)

    return (
      <QuizResult className="quiz-result--personality">
        <div className="quiz-reveal">
          <div className="quiz-reveal__visual">
            <span className="quiz-reveal__halo" aria-hidden="true" />
            <span className="quiz-reveal__kanji" aria-hidden="true">忍</span>

            <img
              className="quiz-reveal__portrait"
              src={character.image}
              alt={character.name}
            />
          </div>

          <div className="quiz-reveal__content">
            <p className="quiz-result__eyebrow">YOUR SHINOBI MATCH IS</p>

            <h1 className="quiz-result__title">{character.name}</h1>

            <div className="quiz-result__reveal">
              <p className="quiz-result__message">{personalityResult.explanation}</p>
            </div>

            <section className="quiz-result__traits" aria-label="Dominant traits">
              {dominantTraits.map((trait) => (
                <span key={trait.id} className="quiz-result__trait">
                  {trait.name}
                </span>
              ))}
            </section>

            <footer className="quiz-result__actions">
              <Link
                to={`/characters/${character.id}`}
                className="quiz-result__link"
              >
                View Character Profile →
              </Link>

              <button
                type="button"
                className="quiz-result__cta"
                onClick={startPersonality}
              >
                Take Again
              </button>

              <button
                type="button"
                className="quiz-result__back"
                onClick={backToHub}
              >
                Back to Quiz Hub
              </button>
            </footer>
          </div>
        </div>
      </QuizResult>
    )
  }

  /* -------------------------------- Knowledge ------------------------------- */

  const renderKnowledge = () => {
    const question = knowledgeQuestions[knowledgeIndex]

    if (!question) return null

    const selected = knowledgeAnswers[question.id]
    const isLocked = Boolean(selected)
    const wasCorrect = selected?.isCorrect ?? false

    return (
      <QuizStep
        index={knowledgeIndex}
        total={knowledgeQuestions.length}
        decorative={<QuizAmbient svg={knowledgeSvg} className="quiz-step__ambient" />}
        mode="knowledge"
        onBack={backToHub}
      >
        <QuizQuestion
          eyebrow={`Question ${String(knowledgeIndex + 1).padStart(2, '0')} / ${knowledgeQuestions.length}`}
          prompt={question.prompt}
          feedback={
            isLocked
              ? wasCorrect
                ? 'CORRECT — stay on track.'
                : 'Not quite — the correct answer is highlighted.'
                : undefined
          }
        >
          <div className="quiz-answers">
            {question.options.map((option) => (
              <button
                key={option.text}
                type="button"
                disabled={isLocked}
                className={classNames(
                  'quiz-answer',
                  isLocked &&
                    selected === option &&
                    (option.isCorrect ? 'quiz-answer--correct' : 'quiz-answer--wrong'),
                  isLocked && option.isCorrect && selected !== option && 'quiz-answer--answer',
                )}
                onClick={() => handleKnowledgeAnswer(question, option)}
              >
                {option.text}
              </button>
            ))}
          </div>
        </QuizQuestion>
      </QuizStep>
    )
  }

  const knowledgeScore = Object.values(knowledgeAnswers).filter((option) => option.isCorrect).length
  const knowledgeRank = rankOfScore(knowledgeScore)

  const renderKnowledgeResult = () => {
    const achievedRankIndex = examRanks.indexOf(knowledgeRank)

    return (
      <QuizResult className="quiz-result--knowledge">
        <div className="rank-reveal">
          <div className="rank-reveal__emblem">
            <span className="rank-reveal__ring" aria-hidden="true" />
            <span className="rank-reveal__kanji" aria-hidden="true">試</span>

            <span className="rank-reveal__score">{knowledgeScore}</span>
            <span className="rank-reveal__total">/ {knowledgeQuestions.length}</span>

            <span className="rank-reveal__caption">SHINOBI EXAM</span>
          </div>

          <div className="rank-reveal__content">
            <p className="quiz-result__eyebrow">KNOWLEDGE RESULT</p>

            <h1 className="quiz-result__title">{knowledgeRank}</h1>

            <div className="quiz-result__reveal">
              <p className="quiz-result__message">
                {knowledgeScore === 0
                  ? 'Time to start an Academy Student journey.'
                  : `You earned your ${knowledgeRank} — keep training.`}
              </p>
            </div>

            <ol className="rank-ladder" aria-label="Rank progression">
              {examRanks.map((rank, index) => (
                <li
                  key={rank}
                  className={classNames(
                    'rank-ladder__step',
                    index === achievedRankIndex && 'rank-ladder__step--current',
                    index < achievedRankIndex && 'rank-ladder__step--passed',
                  )}
                >
                  <span className="rank-ladder__mark" aria-hidden="true" />
                  <span className="rank-ladder__name">{rank}</span>
                </li>
              ))}
            </ol>

            <footer className="quiz-result__actions quiz-result__actions--primary">
              <button
                type="button"
                className="quiz-result__cta"
                onClick={startKnowledge}
              >
                Try Again
              </button>

              <button
                type="button"
                className="quiz-result__back"
                onClick={backToHub}
              >
                Back to Quiz Hub
              </button>
            </footer>
          </div>
        </div>
      </QuizResult>
    )
  }

  const render = () => {
    switch (mode) {
      case 'personality':
        return renderPersonality()
      case 'personalityResult':
        return renderPersonalityResult()
      case 'knowledge':
        return renderKnowledge()
      case 'knowledgeResult':
        return renderKnowledgeResult()
      case 'landing':
      default:
        return renderLanding()
    }
  }

  return (
    <main
      className={classNames(
        'quiz-page',
        mode !== 'landing' && 'quiz-page--exam',
      )}
    >
      {render()}
    </main>
  )
}

export default QuizPage
