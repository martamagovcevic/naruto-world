/**
 * Knowledge Quiz data.
 *
 * Pure data: ten Naruto knowledge questions, each with four options and one
 * correct answer. The page renders one question at a time and scores the
 * count of correct answers into a rank.
 */

export type KnowledgeOption = {
  text: string
  isCorrect: boolean
}

export type KnowledgeQuestion = {
  id: string
  prompt: string
  options: KnowledgeOption[]
}

export const knowledgeQuestions: KnowledgeQuestion[] = [
  {
    id: 'k1',
    prompt: 'Who awakened the Sharingan at the age of nine?',
    options: [
      { text: 'Itachi Uchiha', isCorrect: true },
      { text: 'Sasuke Uchiha', isCorrect: false },
      { text: 'Shisui Uchiha', isCorrect: false },
      { text: 'Fugaku Uchiha', isCorrect: false },
    ],
  },
  {
    id: 'k2',
    prompt: 'Who discovered the Rasengan and passed it to others?',
    options: [
      { text: 'Jiraiya', isCorrect: true },
      { text: 'Kakashi Hatake', isCorrect: false },
      { text: 'Naruto Uzumaki', isCorrect: false },
      { text: 'Sasuke Uchiha', isCorrect: false },
    ],
  },
  {
    id: 'k3',
    prompt: 'Which of the following is Tsunade’s signature medical technique?',
    options: [
      { text: 'Mystical Palm Jutsu', isCorrect: true },
      { text: 'Rasengan', isCorrect: false },
      { text: 'Chidori', isCorrect: false },
      { text: 'Shadow Clone Jutsu', isCorrect: false },
    ],
  },
  {
    id: 'k4',
    prompt: 'Which village do the Hyuga clan belong to?',
    options: [
      { text: 'Konoha', isCorrect: true },
      { text: 'Suna', isCorrect: false },
      { text: 'Mist', isCorrect: false },
      { text: 'Cloud', isCorrect: false },
    ],
  },
  {
    id: 'k5',
    prompt: 'In the Fourth Great Ninja War, who was Team 7’s leader?',
    options: [
      { text: 'Kakashi Hatake', isCorrect: true },
      { text: 'Naruto Uzumaki', isCorrect: false },
      { text: 'Shikamaru Nara', isCorrect: false },
      { text: 'Sasuke Uchiha', isCorrect: false },
    ],
  },
  {
    id: 'k6',
    prompt: 'Which jutsu is Gaara most famous for?',
    options: [
      { text: 'Sand Tsunami', isCorrect: true },
      { text: 'Rasenshuriken', isCorrect: false },
      { text: 'Susano', isCorrect: false },
      { text: 'Rasengan', isCorrect: false },
    ],
  },
  {
    id: 'k7',
    prompt: 'Who became the Sixth Hokage of Konoha?',
    options: [
      { text: 'Naruto Uzumaki', isCorrect: true },
      { text: 'Kakashi Hatake', isCorrect: false },
      { text: 'Kurama', isCorrect: false },
      { text: 'Sasuke Uchiha', isCorrect: false },
    ],
  },
  {
    id: 'k8',
    prompt: 'Who is the first person to awaken a Rinnegan?',
    options: [
      { text: 'Kaguya Ōtsutsuki', isCorrect: true },
      { text: 'Nagato', isCorrect: false },
      { text: 'Sage of Six Paths', isCorrect: false },
      { text: 'Jiraiya', isCorrect: false },
    ],
  },
  {
    id: 'k9',
    prompt: 'What is the primary nature of Shikamaru’s style?',
    options: [
      { text: 'Earth', isCorrect: true },
      { text: 'Fire', isCorrect: false },
      { text: 'Water', isCorrect: false },
      { text: 'Lightning', isCorrect: false },
    ],
  },
  {
    id: 'k10',
    prompt: 'Which character is the ultimate form of the Rinnegan?',
    options: [
      { text: 'Kaguya Ōtsutsuki', isCorrect: true },
      { text: 'Nagato', isCorrect: false },
      { text: 'Obito Uchiha', isCorrect: false },
      { text: 'Madara Uchiha', isCorrect: false },
    ],
  },
]
