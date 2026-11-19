import { useEffect, useState } from 'react'

import './QuoteSlider.css'

interface Quote {
  text: string
  character: string
  subtitle: string
}

const QUOTES: Quote[] = [
  {
    text: "I never go back on my word. That's my ninja way!",
    character: 'Naruto Uzumaki',
    subtitle: 'The Seventh Hokage',
  },
  {
    text: 'I am an avenger. I will bear this hatred, and take it upon myself.',
    character: 'Sasuke Uchiha',
    subtitle: 'The Last Uchiha',
  },
  {
    text: 'Those who abandon their friends are worse than trash.',
    character: 'Kakashi Hatake',
    subtitle: 'The Copy Ninja',
  },
  {
    text: 'People live their lives bound by what they accept as correct and true.',
    character: 'Itachi Uchiha',
    subtitle: 'The Uchiha Prodigy',
  },
  {
    text: 'A place where someone still thinks about you is a place you can call home.',
    character: 'Jiraiya',
    subtitle: 'The Legendary Sannin',
  },
]

const SLIDE_INTERVAL_MS = 5000

function QuoteSlider() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % QUOTES.length)
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [paused])

  const goPrev = () => {
    setIndex((current) => (current - 1 + QUOTES.length) % QUOTES.length)
  }

  const goNext = () => {
    setIndex((current) => (current + 1) % QUOTES.length)
  }

  return (
    <section
      className="quote-slider"
      aria-label="Memorable quotes from Naruto characters"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <span
        className="quote-slider__kanji"
        aria-hidden="true"
      >
        忍
      </span>

      <div className="quote-slider__inner">
        <span className="quote-slider__eyebrow">
          WORDS CARVED INTO LEGEND
        </span>

        <h2 className="quote-slider__heading">
          The Voice of the Hidden Leaf
        </h2>

        <div
          className="quote-slider__stage"
          aria-live="polite"
        >
          {QUOTES.map((quote, i) => (
            <figure
              key={quote.character}
              className={`quote-slider__slide${
                i === index ? ' quote-slider__slide--active' : ''
              }`}
              aria-hidden={i !== index}
            >
              <span
                className="quote-slider__mark"
                aria-hidden="true"
              >
                “
              </span>

              <blockquote className="quote-slider__text">
                {quote.text}
              </blockquote>

              <figcaption className="quote-slider__credit">
                <span className="quote-slider__name">
                  {quote.character}
                </span>

                <span className="quote-slider__subtitle">
                  {quote.subtitle}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="quote-slider__controls">
          <button
            type="button"
            className="quote-slider__arrow"
            onClick={goPrev}
            aria-label="Previous quote"
          >
            ‹
          </button>

          <div
            className="quote-slider__dots"
            role="tablist"
            aria-label="Choose a quote"
          >
            {QUOTES.map((quote, i) => (
              <button
                key={quote.character}
                type="button"
                className={`quote-slider__dot${
                  i === index ? ' quote-slider__dot--active' : ''
                }`}
                onClick={() => setIndex(i)}
                aria-label={`Show quote ${i + 1}`}
                aria-selected={i === index}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="quote-slider__arrow"
            onClick={goNext}
            aria-label="Next quote"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}

export default QuoteSlider