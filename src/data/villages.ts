
export type Village = {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  country: string;
  leaderTitle: string;
  symbol: string;
  accentColor: string;
  description: string;
  characterIds: string[];
};

export const villageOrder = [
  "suna",
  "kumo",
  "kiri",
  "konoha",
  "iwa",
] as const;

export type VillageOrderId = (typeof villageOrder)[number];

export const villages: Village[] = [
  {
    id: "konoha",
    name: "Konohagakure",
    shortName: "Hidden Leaf",
    subtitle: "The Village Hidden in the Leaves",
    country: "Land of Fire",
    leaderTitle: "Hokage",
    symbol: "葉",
    accentColor: "#ff7a2f",
    description:
      "A village founded on the Will of Fire, where bonds between shinobi shape its history and future.",
    characterIds: [
      "naruto-uzumaki",
      "sasuke-uchiha",
      "sakura-haruno",
      "kakashi-hatake",
      "itachi-uchiha",
      "hinata-hyuga",
      "shikamaru-nara",
      "tsunade",
      "rock-lee",
      "jiraiya",
      "orochimaru",
      "iruka-umino",
      "tobi",
    ],
  },
  {
    id: "suna",
    name: "Sunagakure",
    shortName: "Hidden Sand",
    subtitle: "The Village Hidden in the Sand",
    country: "Land of Wind",
    leaderTitle: "Kazekage",
    symbol: "砂",
    accentColor: "#e4bd78",
    description:
      "A resilient desert village known for its skilled shinobi, sand-based techniques, and puppetry.",
    characterIds: ["gaara", "sasori"],
  },
  {
    id: "kiri",
    name: "Kirigakure",
    shortName: "Hidden Mist",
    subtitle: "The Village Hidden in the Mist",
    country: "Land of Water",
    leaderTitle: "Mizukage",
    symbol: "霧",
    accentColor: "#78c7dd",
    description:
      "A village surrounded by mist, renowned for its swordsmen and its complex shinobi history.",
    characterIds: ["kisame-hoshigaki"],
  },
  {
    id: "kumo",
    name: "Kumogakure",
    shortName: "Hidden Cloud",
    subtitle: "The Village Hidden in the Clouds",
    country: "Land of Lightning",
    leaderTitle: "Raikage",
    symbol: "雲",
    accentColor: "#b7a0eb",
    description:
      "A mountain village known for powerful shinobi and its mastery of lightning-based techniques.",
    characterIds: [],
  },
  {
    id: "iwa",
    name: "Iwagakure",
    shortName: "Hidden Stone",
    subtitle: "The Village Hidden in the Stones",
    country: "Land of Earth",
    leaderTitle: "Tsuchikage",
    symbol: "岩",
    accentColor: "#c5a38b",
    description:
      "A fortified village surrounded by rocky terrain, known for its earth-style techniques.",
    characterIds: ["deidara"],
  },
];
