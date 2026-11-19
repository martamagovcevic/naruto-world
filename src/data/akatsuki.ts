export type AkatsukiMember = {
  id: string
  partner: string
  ring: string
  ringName: string
  role: string
  glyph: string
  short: string
  accent: string
  characterId: string
}

export const akatsukiMembers: AkatsukiMember[] = [
  {
    id: 'pain',
    characterId: 'pain',
    partner: 'Konan',
    ring: '零',
    ringName: 'Zero',
    role: 'Leader',
    glyph: '痛',
    accent: '#ff4d5e',
    short:
      'Nagato rules through the Six Paths, hunting peace by making the world know suffering. Only Naruto\u2019s words, echoed from Jiraiya\u2019s old dream, made him finally let it all go.',
  },

  {
    id: 'deidara',
    characterId: 'deidara',
    partner: 'Sasori',
    ring: '青',
    ringName: 'Blue',
    role: 'Sculptor',
    glyph: '爆',
    accent: '#ff8b4a',
    short:
      'Iwagakure\u2019s exiled artist who believed true art is a single perfect explosion. He spent his final duel trying to erase the Sharingan that once humbled him and his clay.',
  },

  {
    id: 'konan',
    characterId: 'konan',
    partner: 'Pain',
    ring: '白',
    ringName: 'White',
    role: 'Angel',
    glyph: '紙',
    accent: '#a8bde0',
    short:
      'The Paper Angel of Amegakure and one of the three orphans Jiraiya once trained. Of everyone in the organization, she alone carried Nagato\u2019s faith in a world at peace.',
  },

  {
    id: 'itachi',
    characterId: 'itachi-uchiha',
    partner: 'Kisame',
    ring: '朱',
    ringName: 'Scarlet',
    role: 'Executioner',
    glyph: '写',
    accent: '#ff3b57',
    short:
      'A prodigy who carried a burden too heavy to tell anyone. Inside Akatsuki he lived as a hated traitor \u2014 secretly still protecting Konoha and, above all, his brother Sasuke.',
  },

  {
    id: 'kisame',
    characterId: 'kisame-hoshigaki',
    partner: 'Itachi',
    ring: '南',
    ringName: 'South',
    role: 'Tailless Tailed Beast',
    glyph: '鮫',
    accent: '#57a8ff',
    short:
      'A monster of the Bloody Mist who carried Samehada and asked no questions. Loyal to the bond of his partnership, he treated Itachi\u2019s respect as the highest mark he ever earned.',
  },

  {
    id: 'kakuzu',
    characterId: 'kakuzu',
    partner: 'Hidan',
    ring: '北',
    ringName: 'North',
    role: 'Mercenary',
    glyph: '金',
    accent: '#d8b14e',
    short:
      'A relic of Takigakure who cheated death by stitching the hearts of his victims into himself. He fought for one thing only \u2014 the bounty on the target\u2019s head.',
  },

  {
    id: 'hidan',
    characterId: 'hidan',
    partner: 'Kakuzu',
    ring: '三',
    ringName: 'Three',
    role: 'Priest',
    glyph: '呪',
    accent: '#b45bd4',
    short:
      'An unkillable zealot who turned ritual, prayer and self-mutilation into a weapon. Even a heart that could not die was no match for Shikamaru burying him alive in pieces.',
  },

  {
    id: 'sasori',
    characterId: 'sasori',
    partner: 'Deidara',
    ring: '玉',
    ringName: 'Jewel',
    role: 'Puppeteer',
    glyph: '傀',
    accent: '#e06a3b',
    short:
      'Sunagakure\u2019s reclusive master of puppetry who turned famine, war and most of himself into art. He wanted a collection that could never age or fade \u2014 and became one.',
  },

  {
    id: 'zetsu',
    characterId: 'zetsu',
    partner: 'Tobi',
    ring: '亥',
    ringName: 'Boar',
    role: 'Spy',
    glyph: '絶',
    accent: '#6cc07e',
    short:
      'The organization\u2019s silent watcher, split into White and Black halves that moved through shadows and earth. His true allegiance was older than Akatsuki \u2014 by a thousand years.',
  },

  {
    id: 'tobi',
    characterId: 'tobi',
    partner: 'Zetsu',
    ring: '空',
    ringName: 'Void',
    role: 'Masked Member',
    glyph: '瞳',
    accent: '#ff5f3c',
    short:
      'The masked fool who seemed almost comic \u2014 until the mask came off. Beneath it waited the true architect of the Fourth Great Ninja War, hiding in plain sight.',
  },
]