/**
 * Clan archive.
 *
 * Member lists are derived from `character.ts` by matching each record's
 * `clan` field, so a clan never holds its own copy of a character.
 * Only relationships that are documented in the source material and
 * supported by the existing records live here.
 */

import { characters } from './character'

export type ClanMoodId =
  | 'uchiha'
  | 'hyuga'
  | 'uzumaki'
  | 'senju'
  | 'nara'
  | 'akimichi'
  | 'yamanaka'

export type ClanMood = {
  accent: string
  glow: string
  deep: string
  mist: string
  motif: string
}

export type ClanNotable = {
  name: string
  note: string
}

/**
 * Where a crest sits in the network. The network lays itself out in two
 * centred flow rows rather than free percentage coordinates, so no crest
 * can drift past the edge of its container or collide with its neighbour.
 * `lift` is a small vertical offset, in pixels, that keeps the rows from
 * reading as a table.
 */
export type ClanPosition = {
  row: 1 | 2
  order: number
  lift: number
}

export type Clan = {
  id: string
  name: string
  kanji: string
  reading: string
  seal: string
  village: string
  specialty: string
  kekkeiGenkai: string
  abilities: string[]
  history: string[]
  notable: ClanNotable[]
  mood: ClanMood
  position: ClanPosition
}

export type ClanRelationKind = 'marriage' | 'dōjutsu' | 'alliance'

export type ClanRelation = {
  id: string
  from: string
  to: string
  kind: ClanRelationKind
  label: string
  detail: string
}

/**
 * A person inside a clan tree. `characterId` is present only when the
 * archive already holds a profile for them, which is what makes a profile
 * link possible. `parents` draws one generation down. Naming two parents on
 * the same child is what draws a shared parent junction, so a couple is
 * stated once and every sibling reuses it.
 */
export type LineagePerson = {
  id: string
  name: string
  relation: string
  characterId?: string
  parents?: string[]
  note?: string
  extra?: string[]
}

export type ClanLineage = {
  clanId: string
  summary: string
  source: string
  people: LineagePerson[]
}

/**
 * One set of co-parents and the children they share. A single named parent
 * is still a union of one, which keeps the branch drawing uniform.
 */
export type LineageUnion = {
  id: string
  parents: LineagePerson[]
  children: LineagePerson[]
}

export const clanOrder = [
  'uchiha',
  'hyuga',
  'uzumaki',
  'senju',
  'nara',
  'akimichi',
  'yamanaka',
] as const

export const clans: Clan[] = [
  {
    id: 'uchiha',
    name: 'Uchiha',
    kanji: ' Uchiha no Kazu',
    reading: 'うちば',
    seal: '火',
    village: 'Konohagakure',
    specialty: 'Fire Release and bladework',
    kekkeiGenkai:
      'No kekkei genkai — but the Sharingan, a dōjutsu carried in the bloodline, is their birthright',
    abilities: [
      'Fire Release techniques',
      'Sharingan and Mangekyō Sharingan',
      'Amaterasu and Tsukuyomi',
      'Susanoo',
      'Chidori and the Uchiha blade',
    ],
    history: [
      'The Uchiha trace their descent from Indra, elder brother of the Sage of Six Paths, and settled in the Land of Fire long before the villages rose. Strong, proud and possessive of their fire, they built the Konoha Police Force under the Uchiha clan head.',
      'Their history turns on a single night. Convinced the clan was plotting a coup, Konoha ordered Itachi Uchiha — a thirteen-year-old prodigy — to destroy it. He spared only his brother Sasuke, and the massacre left the village without its police force and Sasuke without a family.',
      'What survived hardened rather than faded. Sasuke pursued the Sharingan and the truth his brother had buried, and the clan\'s eye, once a mark of pride, became a symbol of grief carried by nearly everyone who bore it.',
    ],
    notable: [
      {
        name: 'Madara Uchiha',
        note: 'The founder of Konoha and the man who started the Uchiha rebellion.',
      },
      {
        name: 'Fugaku Uchiha',
        note: 'Clan head during the massacre and father to Itachi and Sasuke.',
      },
    ],
    mood: {
      accent: '#d3302f',
      glow: '#ff5a4a',
      deep: '#190909',
      mist: '#3d0f0d',
      motif: 'sharingan',
    },
    position: { row: 1, order: 1, lift: 6 },
  },

  {
    id: 'hyuga',
    name: 'Hyuga',
    kanji: 'Sunlight on Distant Fields',
    reading: 'ひゅうが',
    seal: '日',
    village: 'Konohagakure',
    specialty: 'Taijutsu and precision chakra control',
    kekkeiGenkai: 'Byakugan, a dōjutsu that sees the full chakra network',
    abilities: [
      'Gentle Fist',
      'Eight Trigrams: Sixty-Four Palms',
      'Eight Trigrams: Thirty-Two Palms',
      'Byakugan and the Tenketsu system',
      'Heavenly Demon and Heron techniques',
    ],
    history: [
      'One of the clans that founded Konohagakure, the Hyuga hold the oldest bloodline records in the village and split long ago into a main house and a branch house bound by a single rule: the main house guards the clan\'s techniques.',
      'Their fighting style is built entirely on the Byakugan. Striking the tenketsu points shuts a shinobi\'s chakra system down entirely, so a Hyuga wins by reading an opponent rather than outlasting them.',
      'The branch house was locked out of those techniques for generations and Neji Hyuga led the movement that overturned it. From the Chunin Exams onward the division began to break down and the clan produced some of Konoha\'s finest kunoichi.',
    ],
    notable: [
      {
        name: 'Hiashi Hyuga',
        note: 'Head of the Hyuga clan and keeper of its techniques in the main house.',
      },
      {
        name: 'Neji Hyuga',
        note: 'Branch house heir who revived the Eight Trigrams technique.',
      },
    ],
    mood: {
      accent: '#6fb4e6',
      glow: '#cfe9ff',
      deep: '#0a1520',
      mist: '#123049',
      motif: 'chakra-line',
    },
    position: { row: 1, order: 0, lift: -7 },
  },

  {
    id: 'uzumaki',
    name: 'Uzumaki',
    kanji: 'Uzumaki no Kuni',
    reading: 'うずまき',
    seal: '渦',
    village: 'Formerly the Village Hidden in the Whirlpools',
    specialty: 'Sealing jutsu and vast chakra reserves',
    kekkeiGenkai:
      'No kekkei genkai — their strength is raw chakra volume and their mastery of seals',
    abilities: [
      'Destructive Seal and the Four Symbols Seal',
      'Kunai and blade sealing',
      'Chakra chains binding tailed beasts',
      'Sage Mode access',
      'Rasengan',
    ],
    history: [
      'Before the villages of the shinobi world, the Uzumaki ruled the Land of Whirlpools from a fortress above a great whirlpool. They defended the country from the invading Senju and earned the name of the people of the spinning vortex.',
      'Their chakra reserves were unmatched and their sealing arts unrivalled — the same arts Kushina Uzumaki used to cage the Nine-Tailed Fox inside her newborn son.',
      'Persecution scattered the clan to the ends of the world. Naruto Uzumaki, raised in Konoha without knowing who he was, is what remains of the Village Hidden in the Whirlpools, and the last of its bloodline.',
    ],
    notable: [
      {
        name: 'Kushina Uzumaki',
        note: 'The former jinchūriki of the Nine-Tailed Fox and mother of Naruto.',
      },
      {
        name: 'Karin',
        note: 'Survivor of the clan who spent decades sealed inside a wall.',
      },
    ],
    mood: {
      accent: '#ff7a2f',
      glow: '#ffa055',
      deep: '#1d0c05',
      mist: '#3f1b07',
      motif: 'spiral',
    },
    position: { row: 1, order: 3, lift: 5 },
  },

  {
    id: 'senju',
    name: 'Senju',
    kanji: 'Senju no Kimi',
    reading: 'せんじゅ',
    seal: '千',
    village: 'Konohagakure',
    specialty: 'Medical ninjutsu and raw physical power',
    kekkeiGenkai:
      'No kekkei genkai — the Senju distinguish themselves by mastering all five chakra natures',
    abilities: [
      'Medical ninjutsu and Mystical Palm',
      'Strength of a Hundred Seal',
      'Wood Release',
      'Katsuyu and the slug summons',
      'Destroying the Six Paths of Pain',
    ],
    history: [
      'The Senju and the Uchiha ended their generations of war and built Konohagakure together, with Hashirama Senju as the First Hokage. Where the Uchiha brought the Sharingan, the Senju brought the Will of Fire and the village\'s two founding truths: a shinobi protects the village, and the village protects its shinobi.',
      'Hashirama\'s Wood Release reshaped the battlefield, but the clan\'s quiet genius is medicine. The First\'s younger brother Tobirama invented the modern ninjutsu system, and the Senju were the first to see that cutting someone apart was the least effective way to treat them.',
      'Tsunade carries both inheritances. Granddaughter of the First Hokage and of Mito Uzumaki, she inherited the Senju reserves and became the greatest medical-nin alive.',
    ],
    notable: [
      {
        name: 'Hashirama Senju',
        note: 'The First Hokage and founder of Konohagakure.',
      },
      {
        name: 'Tobirama Senju',
        note: 'The Second Hokage and inventor of modern ninjutsu.',
      },
    ],
    mood: {
      accent: '#79b86a',
      glow: '#b6e6a4',
      deep: '#0a1a10',
      mist: '#153a22',
      motif: 'forest',
    },
    position: { row: 1, order: 2, lift: -5 },
  },

  {
    id: 'nara',
    name: 'Nara',
    kanji: 'Deer of the Shadowed Wood',
    reading: 'なら',
    seal: '鹿',
    village: 'Konohagakure',
    specialty: 'Intelligence work and shadow manipulation',
    kekkeiGenkai: 'No kekkei genkai — the clan\'s signature is its shadow techniques',
    abilities: [
      'Shadow Possession Jutsu',
      'Shadow Strangle Jutsu',
      'Shadow Sewing Jutsu',
      'Intelligence and interrogation',
      'Battlefield command',
    ],
    history: [
      'The Nara are a founding clan of Konohagakure, and their history is the village\'s history seen from behind a screen. Where other clans produced soldiers, the Nara produced the ones who decided which battles were fought at all.',
      'Their signature technique is the simplest kind of teamwork: extend a shadow, find a target\'s shadow, and once the two are joined the target cannot move without moving for you. The family crest is a stag, and their clan head carries the same flat, unreadable patience as their deer.',
      'The clan has produced the village\'s sharpest tacticians, and more than one plan that won a war was drawn up in the Nara compound while the field was still burning.',
    ],
    notable: [
      {
        name: 'Shikaku Nara',
        note: 'Clan head, intelligence chief and father of Shikamaru.',
      },
    ],
    mood: {
      accent: '#8b83c4',
      glow: '#c4bdf2',
      deep: '#0e0c17',
      mist: '#231f3a',
      motif: 'shadow',
    },
    position: { row: 2, order: 0, lift: -4 },
  },

  {
    id: 'akimichi',
    name: 'Akimichi',
    kanji: 'Autumn Road',
    reading: 'あきちち',
    seal: '秋',
    village: 'Konohagakure',
    specialty: 'Body reinforcement and close combat',
    kekkeiGenkai:
      'No kekkei genkai — the clan turns food directly into chakra',
    abilities: [
      'Body Reinforcement Technique',
      'Partial Transformation',
      'Destructive and Giratory attacks',
      'Taijutsu at extreme weight',
      'Chakra-enhanced constitution',
    ],
    history: [
      'A founding clan of Konohagakure, the Akimichi are the reason Konoha\'s strongest weapon was never a technique at all. Their bodies absorb whatever they eat and convert it straight into chakra, so a member can eat anything at all and still remain a fighting machine.',
      'Their specialty is Body Reinforcement: by converting part of themselves into pure chakra and hardening the body, an Akimichi can crush what it is holding and shrug off what it cannot. It is the most physically reckless art in Konoha, and it costs the user.',
      'Chōichi and his brother Inoichi held the clan through the wars that nearly emptied Konoha. Their strength depends entirely on having been able to eat, and on the village keeping them fed.',
    ],
    notable: [
      {
        name: 'Chōichi Akimichi',
        note: 'Clan head and the last of the Konoha War Effort trio alongside Shikaku and Shizuku.',
      },
    ],
    mood: {
      accent: '#c98a4b',
      glow: '#e8b478',
      deep: '#1a120a',
      mist: '#33210f',
      motif: 'earth',
    },
    position: { row: 2, order: 2, lift: 5 },
  },

  {
    id: 'yamanaka',
    name: 'Yamanaka',
    kanji: 'Yamanaka no Kuni',
    reading: 'やまなか',
    seal: '山',
    village: 'Konohagakure',
    specialty: 'Mental and sensory techniques',
    kekkeiGenkai:
      'No kekkei genkai — the clan works through the mind and the senses',
    abilities: [
      'Mind Transmission',
      'Personification',
      'Mental Destruction',
      'Body Replacement',
      'Clan Summoning',
    ],
    history: [
      'The Yamanaka held a position in Konoha that no fighting clan could hold: they ran the interrogation room. The clan\'s techniques enter the mind rather than the body, so a captured shinobi can be read, broken or turned without a single wound.',
      'That closeness to the enemy made the Yamanaka politically exposed and the clan small. Ino Yamanaka grew up in the same academy class as Shikamaru Nara, and the friendship that began there was the closest thing the two clans had to an alliance.',
      'The clan\'s technique is its inheritance and its burden. Being trusted with other people\'s minds means never getting to look away from what is in them.',
    ],
    notable: [
      {
        name: 'Ino Yamanaka',
        note: 'Third Hokage era kunoichi who carried the clan\'s mental arts.',
      },
    ],
    mood: {
      accent: '#b98ce0',
      glow: '#e0c2ff',
      deep: '#150e1d',
      mist: '#2c1b3d',
      motif: 'mental',
    },
    position: { row: 2, order: 1, lift: -2 },
  },
]

export const clanRelations: ClanRelation[] = [
  {
    id: 'senju-uzumaki',
    from: 'senju',
    to: 'uzumaki',
    kind: 'marriage',
    label: 'Marriage & shared descent',
    detail:
      'The First Hokage Hashirama Senju married Mito Uzumaki of the Village Hidden in the Whirlpools. Tsunade, whose profile is in this archive, is the granddaughter of both and the only recorded member of a clan joined by blood in two directions.',
  },
  {
    id: 'hyuga-uchiha',
    from: 'hyuga',
    to: 'uchiha',
    kind: 'dōjutsu',
    label: 'Origin of the Sharingan',
    detail:
      'The Sharingan was a Hyūga dōjutsu before it was handed to the Uchiha as a gesture of goodwill. It carries the Hyūga crest, which is why the eye that took the Uchiha massacre apart belongs to the clan of Hinata Hyuga.',
  },
  {
    id: 'senju-uchiha',
    from: 'senju',
    to: 'uchiha',
    kind: 'alliance',
    label: 'Founding alliance',
    detail:
      'The Senju and the Uchiha ended a long war and founded Konohagakure together, with the Senju leading and the Uchiha policing. Itachi Uchiha, also in this archive, carried out the massacre that ended it.',
  },
  {
    id: 'senju-hyuga',
    from: 'senju',
    to: 'hyuga',
    kind: 'alliance',
    label: 'Founding alliance',
    detail:
      'The Senju, the Uchiha and the Hyuga signed the charter that established Konohagakure and divided the land between them. The Hyuga received the northern district.',
  },
  {
    id: 'senju-nara',
    from: 'senju',
    to: 'nara',
    kind: 'alliance',
    label: 'Founding alliance',
    detail:
      'The Nara were a founding clan of Konohagakure and held the southern district. Their intelligence work served the First Hokage from the day the village opened.',
  },
  {
    id: 'senju-akimichi',
    from: 'senju',
    to: 'akimichi',
    kind: 'alliance',
    label: 'Founding alliance',
    detail:
      'The Akimichi were a founding clan of Konohagakure and took the eastern district, where the body reinforcement arts they mastered were put to work defending the village.',
  },
]

/**
 * Lineage is deliberately sparse. Every person and every parent link below is
 * taken from an existing record in `character.ts` — if the archive does not
 * name someone or state a relationship, neither appears here.
 */
export const clanLineages: ClanLineage[] = [
  {
    clanId: 'uchiha',
    summary:
      'The archive records one family: the clan head Fugaku and his wife Mikoto, and their two sons Itachi and Sasuke. Itachi carried out the massacre and spared Sasuke, which is the whole of the line this archive can draw.',
    source: 'Sasuke Uchiha profile',
    people: [
      {
        id: 'uchiha-fugaku',
        name: 'Fugaku Uchiha',
        relation: 'Clan head',
        note: 'Father of Itachi and Sasuke. A prodigy of the clan who served the village as police chief.',
      },
      {
        id: 'uchiha-mikoto',
        name: 'Mikoto',
        relation: 'Clan head\u2019s wife',
        note: 'Mother of Itachi and Sasuke.',
      },
      {
        id: 'uchiha-itachi',
        name: 'Itachi Uchiha',
        relation: 'Eldest son',
        characterId: 'itachi-uchiha',
        parents: ['uchiha-fugaku', 'uchiha-mikoto'],
        note: 'Ch\u016bin at nine, ANBU captain at thirteen. Ordered to end his own clan and spared only Sasuke.',
      },
      {
        id: 'uchiha-sasuke',
        name: 'Sasuke Uchiha',
        relation: 'Youngest son',
        characterId: 'sasuke-uchiha',
        parents: ['uchiha-fugaku', 'uchiha-mikoto'],
        note: 'Left alive at thirteen and left alone in a village that feared his name.',
        extra: ['Elder brother: Itachi'],
      },
    ],
  },

  {
    clanId: 'hyuga',
    summary:
      'The archive records Hinata as the eldest daughter of the Hyuga clan leader, and names Neji as a member of the branch family. It does not name the clan leader or state how Neji is related to Hinata, so neither link is drawn.',
    source: 'Hinata Hyuga profile',
    people: [
      {
        id: 'hyuga-leader',
        name: 'The Hyuga clan leader',
        relation: 'Clan head',
        note: 'Named in the archive only by title. Hinata was expected to be his prodigy.',
      },
      {
        id: 'hyuga-hinata',
        name: 'Hinata Hyuga',
        relation: 'Eldest daughter',
        characterId: 'hinata-hyuga',
        parents: ['hyuga-leader'],
        note: 'Heiress of the main house and the reason Lee almost lost his career at the Chunin Exams.',
      },
      {
        id: 'hyuga-neji',
        name: 'Neji Hyuga',
        relation: 'Branch family',
        note: 'A member of the clan\u2019s branch family who resented Hinata for being born into the main house. The archive does not record his parents or his exact relation to Hinata.',
      },
    ],
  },

  {
    clanId: 'uzumaki',
    summary:
      'The archive names both of Naruto\u2019s parents: the Fourth Hokage Minato and Kushina Uzumaki. Kushina is the Uzumaki by birth, so she is the only member of the clan proper above him; Minato is shown beside her because the record names him as her partner.',
    source: 'Naruto Uzumaki profile',
    people: [
      {
        id: 'uzumaki-minato',
        name: 'Minato',
        relation: 'Father \u00b7 Fourth Hokage',
        note: 'Not an Uzumaki by birth. Named in the archive as one of the two parents who sealed the Nine-Tailed Fox inside their newborn son.',
      },
      {
        id: 'uzumaki-kushina',
        name: 'Kushina Uzumaki',
        relation: 'Mother',
        note: 'Jinch\u016briki of the Nine-Tailed Fox. Gave her life sealing the beast inside her newborn son.',
      },
      {
        id: 'uzumaki-naruto',
        name: 'Naruto Uzumaki',
        relation: 'Son',
        characterId: 'naruto-uzumaki',
        parents: ['uzumaki-minato', 'uzumaki-kushina'],
        note: 'The last of the Village Hidden in the Whirlpools, raised in Konoha without knowing who he was.',
      },
    ],
  },

  {
    clanId: 'senju',
    summary:
      'Tsunade is recorded as the granddaughter of the First Hokage and of Mito Uzumaki, and Nawaki as her brother, so both grandchildren hang from that one pair. The archive records none of their parents, and the tree stops there.',
    source: 'Tsunade profile',
    people: [
      {
        id: 'senju-hashirama',
        name: 'Hashirama Senju',
        relation: 'Grandfather',
        note: 'The First Hokage. Founder of Konohagakure and the man who ended the war with the Uchiha.',
      },
      {
        id: 'senju-mito',
        name: 'Mito Uzumaki',
        relation: 'Grandmother',
        note: 'An Uzumaki by birth, named in the archive as the First Hokage\u2019s wife and Tsunade\u2019s grandmother.',
      },
      {
        id: 'senju-tsunade',
        name: 'Tsunade',
        relation: 'Granddaughter',
        characterId: 'tsunade',
        parents: ['senju-hashirama', 'senju-mito'],
        note: 'Fifth Hokage, one of the Sannin and the greatest medical-nin alive.',
        extra: ['Brother: Nawaki', 'Lover: Dan'],
      },
      {
        id: 'senju-nawaki',
        name: 'Nawaki',
        relation: 'Grandson',
        parents: ['senju-hashirama', 'senju-mito'],
        note: 'Tsunade\u2019s brother, who died pursuing the dream of becoming Hokage alongside her lover Dan.',
      },
    ],
  },

  {
    clanId: 'nara',
    summary:
      'The archive records Shikamaru as the heir of the Nara clan and mentions a father who warned him about genius, but does not name him. One generation is all the data supports.',
    source: 'Shikamaru Nara profile',
    people: [
      {
        id: 'nara-shikamaru',
        name: 'Shikamaru Nara',
        relation: 'Clan heir',
        characterId: 'shikamaru-nara',
        note: 'Strategist of the Allied Shinobi Forces. His father is mentioned in the archive but never named.',
      },
    ],
  },

  {
    clanId: 'akimichi',
    summary:
      'No Akimichi appears in the character archive, so there is nothing to draw. The clan is recorded in this archive as history only.',
    source: 'No character record',
    people: [],
  },

  {
    clanId: 'yamanaka',
    summary:
      'No Yamanaka appears in the character archive, so there is nothing to draw. The clan is recorded in this archive as history only.',
    source: 'No character record',
    people: [],
  },
]

/* ========================================
   DERIVED HELPERS
   Character records stay in `character.ts`.
   Members are resolved by matching `clan`.
======================================== */

export const getClanMembers = (clanName: string) =>
  characters.filter((character) => character.clan === clanName)

export const getClanRelations = (clanId: string) =>
  clanRelations.filter(
    (relation) => relation.from === clanId || relation.to === clanId,
  )

export const getClanLineage = (clanId: string) =>
  clanLineages.find((lineage) => lineage.clanId === clanId)

/**
 * Splits a lineage into what can actually be drawn: the ancestors, the
 * children, and the co-parent unions that link them. Anyone who is neither
 * an ancestor nor a child is returned as `unattributed`, because the
 * archive records them as kin without ever naming their parents.
 */
export const getLineageGenerations = (lineage?: ClanLineage) => {
  const people = lineage?.people ?? []
  const byId = new Map(people.map((person) => [person.id, person]))

  const children = people.filter((person) => (person.parents?.length ?? 0) > 0)

  const ancestorIds = new Set(
    children.flatMap((child) => child.parents ?? []),
  )

  const ancestors = people.filter((person) => ancestorIds.has(person.id))

  const unattributed = people.filter(
    (person) =>
      !ancestorIds.has(person.id) && (person.parents?.length ?? 0) === 0,
  )

  /**
   * Children that share the exact same set of parents are siblings, so they
   * hang from one junction. Sorting the ids makes the key order independent,
   * so Itachi and Sasuke collapse into a single Fugaku + Mikoto union.
   */
  const unions = new Map<string, LineageUnion>()

  for (const child of children) {
    const parentIds = child.parents ?? []
    const key = [...parentIds].sort().join('+')

    const union = unions.get(key) ?? {
      id: key,
      parents: [],
      children: [],
    }

    union.parents = parentIds
      .map((id) => byId.get(id))
      .filter((person): person is LineagePerson => Boolean(person))

    union.children.push(child)

    unions.set(key, union)
  }

  return { ancestors, unions: [...unions.values()], children, unattributed }
}

export const clanById = (clanId: string) =>
  clans.find((clan) => clan.id === clanId)