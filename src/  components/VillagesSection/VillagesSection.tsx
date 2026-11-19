import { Link } from 'react-router-dom'
import { useEffect, useRef, useState, type CSSProperties } from 'react'

import './VillagesSection.css'

import konoha from '../../assets/images/villages/hiddne-leaf-village.png'
import sunagakure from '../../assets/images/villages/sungakure.png'
import kirigakure from '../../assets/images/villages/misty-village.png'
import iwagakure from '../../assets/images/villages/hidden-stone-village.png'
import kumogakure from '../../assets/images/villages/cloud-village.png'
import { villages as villageData } from '../../data/villages'

const villages = [
  {
    id: 'konoha',
    name: 'Konoha',
    subtitle: 'Hidden Leaf',
    image: konoha,
  },
  {
    id: 'suna',
    name: 'Sunagakure',
    subtitle: 'Hidden Sand',
    image: sunagakure,
  },
  {
    id: 'kiri',
    name: 'Kirigakure',
    subtitle: 'Hidden Mist',
    image: kirigakure,
  },
  {
    id: 'iwa',
    name: 'Iwagakure',
    subtitle: 'Hidden Stone',
    image: iwagakure,
  },
  {
    id: 'kumo',
    name: 'Kumogakure',
    subtitle: 'Hidden Cloud',
    image: kumogakure,
  },
].map((village) => ({
  ...village,
  accent:
    villageData.find((item) => item.id === village.id)?.accentColor ?? '#ff7a2f',
}))

function VillagesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isInView, setIsInView] = useState(
    () =>
      typeof window === 'undefined' ||
      typeof IntersectionObserver === 'undefined',
  )

  useEffect(() => {
    const section = sectionRef.current
    if (!section || isInView) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [isInView])

  return (
    <section
      ref={sectionRef}
      className={`villages-section${isInView ? ' villages-section--is-in-view' : ''}`}
    >
      <div className="villages-section__heading">
        <p className="villages-section__eyebrow">EXPLORE</p>

        <h2 className="villages-section__title">THE HIDDEN VILLAGES</h2>

        <p className="villages-section__intro">
          Five great nations. Countless stories. Discover the villages
          that shaped the shinobi world.
        </p>
      </div>

      <div className="villages-grid">
        {villages.map((village, index) => (
          <Link
            key={village.id}
            to={{ pathname: '/villages', search: `?village=${village.id}` }}
            className="village-card"
            style={
              {
                '--village-accent': village.accent,
                '--card-index': index,
              } as CSSProperties
            }
            aria-label={`Open ${village.name} on the villages map`}
          >
            <div className="village-card__image-wrapper">
              <img
                className="village-card__image"
                src={village.image}
                alt={village.name}
                loading="lazy"
              />

              <div className="village-card__shade" aria-hidden="true" />
            </div>

            <div className="village-card__overlay" aria-hidden="true" />

            <span className="village-card__arrow" aria-hidden="true">→</span>

            <div className="village-card__name">
              <h3>{village.name}</h3>
              <span className="village-card__subtitle">
                {village.subtitle}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="villages-section__footer">
        <Link to="/villages" className="villages-section__explore">
          EXPLORE THE WORLD MAP{' '}
          <span className="villages-section__explore-arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  )
}

export default VillagesSection