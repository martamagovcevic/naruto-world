import rasengan from '../assets/images/jutsu/jutsu-rasengan.png'
import rasenshuriken from '../assets/images/jutsu/rasenshuriken-jutsu.png'
import shadowClone from '../assets/images/jutsu/clone-jutsu.png'
import chidori from '../assets/images/jutsu/sasuke-jutsu/chidori-jutsu.png'
import amaterasu from '../assets/images/jutsu/sasuke-jutsu/amaterasu-jutsu.png'
import lightningBlade from '../assets/images/jutsu/kakashi-jutsu/kakashi-lightning-blade.webp'
import fireball from '../assets/images/jutsu/itachi-jutsu/itachi-fireball.webp'
import toadOilFlameBullet from '../assets/images/jutsu/jiraiya-jutsu/jiraiya-toad-oil-flame-bullet.webp'
import sandCoffin from '../assets/images/jutsu/gara-jutsu/gaara-sand-coffin.webp'
import sandTsunami from '../assets/images/jutsu/gara-jutsu/gaara-sand-tsunami.webp'

import waterDragon from '../assets/images/jutsu/water_dragon_jutsu.webp'
import hiddenMist from '../assets/images/jutsu/hidden_mist_jutsu.webp'

import mysticalPalm from '../assets/images/jutsu/tsunade-jutsu/tsunade-mystical-palm.webp'
import eightGates from '../assets/images/jutsu/lee-jutsu/lee-eight-gates.webp'

export type ChakraNature =
  | 'Fire'
  | 'Water'
  | 'Wind'
  | 'Lightning'
  | 'Earth'

export type JutsuType =
  | 'Ninjutsu'
  | 'Taijutsu'
  | 'Genjutsu'
  | 'Dōjutsu'
  | 'Medical'
  | 'Summoning'
  | 'Senjutsu'

export type JutsuRank = 'D' | 'C' | 'B' | 'A' | 'S'

export type JutsuUser = {
  id?: string
  name: string
}

export type JutsuEntry = {
  id: string
  name: string
  japanese: string
  romaji: string
  description: string
  image?: string
  /**
   * object-position (e.g. 'center center', 'center 35%') for the hero art
   * stage, so a technique's focal point stays visible inside the fixed
   * 4:3 crop. Defaults to 'center center'.
   */
  artPosition?: string
  /**
   * 'final'   → shipped artwork (default).
   * 'concept' → placeholder while the final image is being prepared;
   *             the card renders a dedicated fallback treatment.
   */
  artwork?: 'final' | 'concept'
  type: JutsuType
  rank: JutsuRank
  nature: ChakraNature | 'None'
  users: JutsuUser[]
}

export const jutsuArchive: JutsuEntry[] = [
  {
    id: 'rasengan',
    name: 'Rasengan',
    japanese: '螺旋丸',
    romaji: 'Rasengan',
    description:
      'A spiralling sphere of pure chakra, realised by shaping and rotating chakra in the palm. Created by the Fourth Hokage, it requires no hand seals and no elemental nature \u2014 only perfect shape manipulation \u2014 and grows stronger with the will behind it.',
    image: rasengan,
    type: 'Ninjutsu',
    rank: 'A',
    nature: 'None',
    users: [
      { id: 'naruto-uzumaki', name: 'Naruto Uzumaki' },
      { id: 'kakashi-hatake', name: 'Kakashi Hatake' },
      { id: 'jiraiya', name: 'Jiraiya' },
      { name: 'Minato Namikaze' },
    ],
  },
  {
    id: 'rasenshuriken',
    name: 'Rasenshuriken',
    japanese: '風遁・螺旋手里剣',
    romaji: 'Fūton: Rasenshuriken',
    description:
      'An evolution of the Rasengan fused with Wind Release. The user blends the sphere into a shuriken of slicing chakra that tears through its target at the cellular level, marking Naruto\u2019s first complete Nature Transformation.',
    image: rasenshuriken,
    type: 'Ninjutsu',
    rank: 'S',
    nature: 'Wind',
    users: [{ id: 'naruto-uzumaki', name: 'Naruto Uzumaki' }],
  },
  {
    id: 'shadow-clone-jutsu',
    name: 'Shadow Clone Jutsu',
    japanese: '影分身の術',
    romaji: 'Kage Bunshin no Jutsu',
    description:
      'A forbidden technique that divides the user\u2019s chakra into one or more tangible clones. Unlike ordinary illusions, the clones can fight and gather information on their own, passing their memories and experience back to the user on release.',
    image: shadowClone,
    type: 'Ninjutsu',
    rank: 'B',
    nature: 'None',
    users: [
      { id: 'naruto-uzumaki', name: 'Naruto Uzumaki' },
      { id: 'kakashi-hatake', name: 'Kakashi Hatake' },
    ],
  },
  {
    id: 'chidori',
    name: 'Chidori',
    japanese: '千鳥',
    romaji: 'Chidori',
    description:
      'A high-speed thrust that concentrates Lightning Release chakra into the user\u2019s hand, howling like a thousand birds. The immense speed narrows the field of vision, so mastery demands the Sharingan to remain safe on the chase.',
    image: chidori,
    type: 'Ninjutsu',
    rank: 'A',
    nature: 'Lightning',
    users: [
      { id: 'sasuke-uchiha', name: 'Sasuke Uchiha' },
      { id: 'kakashi-hatake', name: 'Kakashi Hatake' },
    ],
  },
  {
    id: 'lightning-blade',
    name: 'Lightning Blade',
    japanese: '雷切',
    romaji: 'Raikiri',
    description:
      'Kakashi\u2019s signature technique and a refined form of the Chidori. The concentrated lightning edge gained its name after reportedly cutting a bolt of lightning in half, and is treated as the user\u2019s strongest blade.',
    image: lightningBlade,
    type: 'Ninjutsu',
    rank: 'S',
    nature: 'Lightning',
    users: [{ id: 'kakashi-hatake', name: 'Kakashi Hatake' }],
  },
  {
    id: 'fireball-jutsu',
    name: 'Fireball Jutsu',
    japanese: '火遁・豪火球の術',
    romaji: 'Katon: Gōkakyū no Jutsu',
    description:
      'The emblematic fire technique of the Uchiha clan. The user kneads chakra in the chest and exhales a roaring orb of flame, channelling Fire Release into one of the most recognisable jutsu in the shinobi world.',
    image: fireball,
    type: 'Ninjutsu',
    rank: 'C',
    nature: 'Fire',
    users: [
      { id: 'sasuke-uchiha', name: 'Sasuke Uchiha' },
      { id: 'itachi-uchiha', name: 'Itachi Uchiha' },
    ],
  },
  {
    id: 'amaterasu',
    name: 'Amaterasu',
    japanese: '天照',
    romaji: 'Amaterasu',
    description:
      'The ultimate Fire Release of the Mangekyō Sharingan, referenced to the sun goddess. Pitch-black flames ignite at the focal point of the user\u2019s gaze and rage until the target is ash \u2014 or for seven days and seven nights.',
    image: amaterasu,
    type: 'Dōjutsu',
    rank: 'S',
    nature: 'Fire',
    users: [
      { id: 'itachi-uchiha', name: 'Itachi Uchiha' },
      { id: 'sasuke-uchiha', name: 'Sasuke Uchiha' },
    ],
  },
  {
    id: 'toad-oil-flame-bullet',
    name: 'Toad Oil Flame Bullet',
    japanese: '火遁・蛤油炎弾',
    romaji: 'Katon: Gamayu Endan',
    description:
      'A combination technique Jiraiya developed in Sage Mode. He releases a torrent of toad oil, then breathes flame onto it to ignite a burning vortex that clings to and consumes anything it touches.',
    image: toadOilFlameBullet,
    type: 'Ninjutsu',
    rank: 'B',
    nature: 'Fire',
    users: [{ id: 'jiraiya', name: 'Jiraiya' }],
  },
  {
    id: 'sand-coffin',
    name: 'Sand Coffin',
    japanese: '砂縛柩',
    romaji: 'Sabaku Kyū',
    description:
      'Gaara\u2019s crushing opener. He summons his sand to swallow the opponent whole and squeeze until the coffin collapses inward, rarely leaving survivors \u2014 the technique that earned him the fear of the desert.',
    image: sandCoffin,
    type: 'Ninjutsu',
    rank: 'B',
    nature: 'Earth',
    users: [{ id: 'gaara', name: 'Gaara' }],
  },
  {
    id: 'sand-tsunami',
    name: 'Sand Tsunami',
    japanese: '竜砂爆流',
    romaji: 'Ryūsa Bakuryū',
    description:
      'Named after the buried Sand Village\u2019s own history, this surge brings Gaara\u2019s sand up in a monumental wave that floods the battlefield, swallowing enemy forces whole before crushing them beneath the tide.',
    image: sandTsunami,
    type: 'Ninjutsu',
    rank: 'S',
    nature: 'Earth',
    users: [{ id: 'gaara', name: 'Gaara' }],
  },
  {
    id: 'hidden-mist-jutsu',
    name: 'Hidden Mist Jutsu',
    japanese: '霧隠れの術',
    romaji: 'Kirigakure no Jutsu',
    description:
      'A Water Release technique that drapes the battlefield in an unbroken veil of thick mist. Within its concealment, shinobi of the Hidden Mist stalk their targets and strike unseen, the very fog becoming a weapon of dread.',
    image: hiddenMist,
    type: 'Ninjutsu',
    rank: 'D',
    nature: 'Water',
    users: [{ name: 'Zabuza Momochi' }],
  },
  {
    id: 'water-dragon-jutsu',
    name: 'Water Dragon Jutsu',
    japanese: '水遁・水龍弾の術',
    romaji: 'Suiton: Suiryūdan no Jutsu',
    description:
      'A demanding Water Release that sculpts nearby water into a towering dragon and hurls it at the enemy with crushing force. Its sheer chakra cost and a long chain of hand seals make it a mark of true elemental mastery.',
    image: waterDragon,
    type: 'Ninjutsu',
    rank: 'B',
    nature: 'Water',
    users: [
      { id: 'kakashi-hatake', name: 'Kakashi Hatake' },
      { name: 'Tobirama Senju' },
    ],
  },
  {
    id: 'mystical-palm-jutsu',
    name: 'Mystical Palm Jutsu',
    japanese: '掌仙術',
    romaji: 'Shōsen Jutsu',
    description:
      'The foundation of medical ninjutsu, developed by Tsunade and carried on by her apprentice Sakura. Focused chakra in the palms mends torn flesh, knits bone and stops bleeding, turning the healers into the safest hands on any battlefield.',
    image: mysticalPalm,
    type: 'Medical',
    rank: 'A',
    nature: 'None',
    users: [
      { id: 'tsunade', name: 'Tsunade' },
      { id: 'sakura-haruno', name: 'Sakura Haruno' },
    ],
  },
  {
    id: 'eight-gates',
    name: 'Eight Gates',
    japanese: '八門遁甲',
    romaji: 'Hachimon Tonkō',
    description:
      'A forbidden taijutsu-based discipline that overrides the body\u2019s natural limiters by opening the eight inner gates. Raw power explodes far beyond the user\u2019s normal strength at the price of tearing their own body apart.',
    image: eightGates,
    type: 'Taijutsu',
    rank: 'S',
    nature: 'None',
    users: [
      { id: 'rock-lee', name: 'Rock Lee' },
      { name: 'Might Guy' },
    ],
  },
]