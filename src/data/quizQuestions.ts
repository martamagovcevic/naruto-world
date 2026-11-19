/**
 * Personality Quiz data.
 *
 * Questions and the personality traits that go with each answer live here,
 * separate from the page that renders them, so adding a question is a pure
 * data change. Scores are hidden: the user never sees "courage" and "calm"
 * as two separate ledgers — they see one character at the end.
 */

export type PersonalityTrait = {
  id: string
  characterId: string
  name: string
  description: string
}

export type PersonalityOption = {
  text: string
  traits: { id: string; weight: number }[]
}

export type PersonalityQuestion = {
  id: string
  prompt: string
  options: PersonalityOption[]
}

export type PersonalityMatch = {
  characterId: string
  explanation: string
}

export type PersonalityScores = Record<string, number>

export const personalityTraits: PersonalityTrait[] = [
  {
    id: 'courage',
    characterId: 'naruto-uzumaki',
    name: 'Courage',
    description: 'Charge into danger to protect others without hesitation.',
  },
  {
    id: 'loyalty',
    characterId: 'kakashi-hatake',
    name: 'Loyalty',
    description: 'Keep bonds you can rely on through thick and thin.',
  },
  {
    id: 'calm',
    characterId: 'itachi-uchiha',
    name: 'Calm',
    description: 'Think quietly, act deliberately, and stay steady under pressure.',
  },
  {
    id: 'ambition',
    characterId: 'sasuke-uchiha',
    name: 'Ambition',
    description: 'Push yourself hard to reach higher goals, on your own.',
  },
  {
    id: 'empathy',
    characterId: 'sakura-haruno',
    name: 'Empathy',
    description: 'Feel others deeply and lift them with strength, not just muscle.',
  },
  {
    id: 'independence',
    characterId: 'shikamaru-nara',
    name: 'Independence',
    description: 'Plan things yourself instead of following the crowd.',
  },
  {
    id: 'strategy',
    characterId: 'shikamaru-nara',
    name: 'Strategy',
    description: 'Out-think opponents by reading the big picture before acting.',
  },
  {
    id: 'adaptability',
    characterId: 'kakashi-hatake',
    name: 'Adaptability',
    description: 'Adapt quickly to change and turn any situation into your advantage.',
  },
]

export const personalityResults: string[] = [
  'naruto-uzumaki',
  'sasuke-uchiha',
  'kakashi-hatake',
  'itachi-uchiha',
  'sakura-haruno',
  'shikamaru-nara',
]

export const personalityQuestions: PersonalityQuestion[] = [
  {
    id: 'q1',
    prompt: 'Your team is surrounded. What do you do?',
    options: [
      { text: 'Rush in first', traits: [{ id: 'courage', weight: 4 }] },
      { text: 'Create a strategy', traits: [{ id: 'strategy', weight: 4 }] },
      { text: 'Protect your teammates', traits: [{ id: 'loyalty', weight: 4 }] },
      {
        text: 'Observe before making a move',
        traits: [{ id: 'calm', weight: 4 }],
      },
    ],
  },
  {
    id: 'q2',
    prompt:
      'When a younger genin looks up to you with icons of admiration, what matters most to you?',
    options: [
      { text: 'You want them to aim even higher', traits: [{ id: 'ambition', weight: 3 }] },
      {
        text: 'You want their safety and respect you set an example',
        traits: [{ id: 'loyalty', weight: 3 }],
      },
      {
        text: 'You want to teach them by staying calm, helping them practice',
        traits: [{ id: 'calm', weight: 3 }],
      },
      {
        text: 'You want them to see someone reading the whole room before acting',
        traits: [{ id: 'strategy', weight: 3 }],
      },
    ],
  },
  {
    id: 'q3',
    prompt: 'A rival is brighter and faster than you. How do you respond?',
    options: [
      {
        text: 'You train harder and set your own pace, trusting your effort',
        traits: [{ id: 'courage', weight: 3 }],
      },
      {
        text: 'You try to spot a weakness and turn it against them',
        traits: [{ id: 'strategy', weight: 3 }],
      },
      {
        text: 'You look for a way to make friends and learn from their growth',
        traits: [{ id: 'empathy', weight: 3 }],
      },
      {
        text: 'You try to stay composed and count your own wins',
        traits: [{ id: 'calm', weight: 2 }, { id: 'ambition', weight: 2 }],
      },
    ],
  },
  {
    id: 'q4',
    prompt: 'Team 7 is doing a mission that goes wrong. What do you do?',
    options: [
      {
        text: 'You trust the bond and protect your allies with a risky plan',
        traits: [{ id: 'loyalty', weight: 4 }],
      },
      {
        text: 'You push your friends forward with words and faith in them',
        traits: [{ id: 'courage', weight: 3 }, { id: 'strategy', weight: 2 }],
      },
      {
        text: 'You hold your cards tight and observe what is really happening',
        traits: [{ id: 'calm', weight: 3 }],
      },
      {
        text: 'You plan a path that ends the fight quickly',
        traits: [{ id: 'strategy', weight: 4 }],
      },
    ],
  },
  {
    id: 'q5',
    prompt: 'The smarts are out there, but a teammate is stuck. What do you do?',
    options: [
      {
        text: 'You guide them through what you know without touching them',
        traits: [{ id: 'strategy', weight: 3 }, { id: 'independence', weight: 2 }],
      },
      {
        text: 'You gently say what you know, stepping back when they take over',
        traits: [{ id: 'independence', weight: 3 }],
      },
      {
        text: 'You listen to them and help them find a way themselves',
        traits: [{ id: 'empathy', weight: 3 }],
      },
      {
        text: 'You push them to finish it as fast as possible',
        traits: [{ id: 'courage', weight: 2 }, { id: 'ambition', weight: 2 }],
      },
    ],
  },
  {
    id: 'q6',
    prompt: 'The fight is hanging between two sides and your team is the balance.',
    options: [
      {
        text: 'You hold the line steady, letting your presence stabilize things',
        traits: [{ id: 'calm', weight: 3 }],
      },
      {
        text: 'You make a fast, decisive move to break the deadlock',
        traits: [{ id: 'courage', weight: 3 }],
      },
      {
        text: 'You plan the cleanest possible way out of the mess',
        traits: [{ id: 'strategy', weight: 3 }, { id: 'independence', weight: 2 }],
      },
      {
        text: 'You look for a way to make both sides feel heard',
        traits: [{ id: 'empathy', weight: 3 }],
      },
    ],
  },
  {
    id: 'q7',
    prompt: 'A fight ends quietly, and the truth needs to come out — how?',
    options: [
      {
        text: 'You say what you think is right, honestly and plainly',
        traits: [{ id: 'calm', weight: 3 }],
      },
      {
        text: 'You make them feel it through a quiet act of understanding',
        traits: [{ id: 'empathy', weight: 3 }],
      },
      {
        text: 'You walk away so it stops',
        traits: [{ id: 'independence', weight: 2 }, { id: 'ambition', weight: 2 }],
      },
      {
        text: 'You act on the parts you already know are true',
        traits: [{ id: 'strategy', weight: 3 }],
      },
    ],
  },
  {
    id: 'q8',
    prompt: 'When the mission ends without incident, what keeps you up at night?',
    options: [
      {
        text: 'Someone else was holding back, and now they feel like they owe me',
        traits: [{ id: 'ambition', weight: 3 }],
      },
      {
        text: 'I could have pushed them harder, but I do not want to break trust',
        traits: [{ id: 'loyalty', weight: 3 }],
      },
      {
        text: 'The plan looked sound, but there is a flaw I did not see',
        traits: [{ id: 'calm', weight: 3 }],
      },
      {
        text: 'I cut it close and it went too well',
        traits: [{ id: 'courage', weight: 2 }, { id: 'strategy', weight: 2 }],
      },
    ],
  },
  {
    id: 'q9',
    prompt: 'Which of these is your idea of the right kind of opponent?',
    options: [
      {
        text: 'Someone who forces me to be smarter than anyone around them',
        traits: [{ id: 'independence', weight: 3 }],
      },
      {
        text: 'Someone who out-thinks me and wins on ingenuity',
        traits: [{ id: 'strategy', weight: 3 }],
      },
      {
        text: 'Someone who gives up easily and I can show the way',
        traits: [{ id: 'courage', weight: 2 }, { id: 'empathy', weight: 2 }],
      },
      {
        text: 'Someone who stands tall without fear, like I want to be',
        traits: [{ id: 'ambition', weight: 3 }],
      },
    ],
  },
  {
    id: 'q10',
    prompt: 'If you could only keep one thing, what would it be?',
    options: [
      {
        text: 'Someone who gets my back even when I lose',
        traits: [{ id: 'loyalty', weight: 4 }],
      },
      {
        text: 'The idea that I do this for a reason beyond myself',
        traits: [{ id: 'ambition', weight: 4 }],
      },
      {
        text: 'A plan that has the same answer, with or without new people',
        traits: [{ id: 'independence', weight: 3 }, { id: 'strategy', weight: 3 }],
      },
      {
        text: 'The strength to stand when everyone looks away',
        traits: [{ id: 'calm', weight: 3 }, { id: 'courage', weight: 3 }],
      },
    ],
  },
]

export const personalityMatches: PersonalityMatch[] = [
  {
    characterId: 'naruto-uzumaki',
    explanation:
      'You charge into every situation with unshakable loyalty and a loud heart — the energetic, forceful ninja who refuses to back down and holds bonds sacred.',
  },
  {
    characterId: 'sasuke-uchiha',
    explanation:
      'You burn with a quiet, singular ambition and push yourself toward mastery on your own — the teasing, driven prodigy who leaves the past behind.',
  },
  {
    characterId: 'kakashi-hatake',
    explanation:
      'You read rooms with calm clarity and turn situations with trust and gentleness — the teacher who opens the shield of rules when the moment asks for it.',
  },
  {
    characterId: 'itachi-uchiha',
    explanation:
      'You move with flawless calm and quiet restraint, taking the weight the village or the heart demands without hesitation.',
  },
  {
    characterId: 'sakura-haruno',
    explanation:
      'You balance heartfelt empathy with relentless self-improvement — the fierce heart who turns weakness into strength and never leaves anyone behind.',
  },
  {
    characterId: 'shikamaru-nara',
    explanation:
      'You plan ahead of everyone else and let the smarter move win — the genius with a cloud to stare at, sobre about the game, not the battlefield.',
  },
]

/**
 * Sums the weights of every trait used by the answers the user picked.
 * Scores are accumulated by trait, never shown to the user.
 */
export const accumulatePersonalityScores = (
  answers: Record<string, PersonalityOption>,
): PersonalityScores => {
  const scores: PersonalityScores = {}

  for (const option of Object.values(answers)) {
    for (const trait of option.traits) {
      scores[trait.id] = (scores[trait.id] ?? 0) + trait.weight
    }
  }

  return scores
}

const characterTotal = (scores: PersonalityScores, characterId: string) =>
  personalityTraits
    .filter((trait) => trait.characterId === characterId)
    .reduce((sum, trait) => sum + (scores[trait.id] ?? 0), 0)

/**
 * Picks the match with the highest total, breaking ties toward the order of
 * `personalityMatches`, which starts with Naruto.
 */
export const computePersonalityMatch = (
  scores: PersonalityScores,
): PersonalityMatch => {
  let best = personalityMatches[0]
  let bestScore = characterTotal(scores, best.characterId)

  for (const match of personalityMatches) {
    const score = characterTotal(scores, match.characterId)
    if (score > bestScore) {
      best = match
      bestScore = score
    }
  }

  return best
}
