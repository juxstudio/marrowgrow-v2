// Missing game data structures

// Seed properties: 69 seeds organized in 3 tiers with strategic "stinkers"
const seedProperties = {
  // TIER 1 (OK) - Basic seeds, some stinkers
  seed1: {
    name: "Crypt Cookies",
    waterDrain: 0.6,
    nutrientDrain: 0.6,
    image: "seeds/seed1.png",
    flowerImage: "flowers/SZN2F_001_Sailor_Sktlz.png",
    desc: "Balanced, classic strain.",
  },
  seed2: {
    name: "Slime 33",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed2.png",
    flowerImage: "flowers/SZN2F_002_NiftyNugz.png",
    desc: "Balanced, classic strain.",
  },
  seed3: {
    name: "Jet Fuel",
    waterDrain: 0.4,
    nutrientDrain: 0.6,
    image: "seeds/seed3.png",
    flowerImage: "flowers/SZN2F_003_PNK_Panther.png",
    desc: "Balanced, classic strain.",
  },
  seed4: {
    name: "Rotjaw",
    waterDrain: 0.5,
    nutrientDrain: 0.5,
    image: "seeds/seed4.png",
    flowerImage: "flowers/SZN2F_004_Ember-Sherb.png",
    desc: "Balanced, classic strain.",
  },
  seed5: {
    name: "Vader Breath",
    waterDrain: 0.5,
    nutrientDrain: 0.5,
    image: "seeds/seed5.png",
    flowerImage: "flowers/SZN2F_005_Burzt.png",
    desc: "Balanced, classic strain.",
  },
  seed6: {
    name: "Lazy Bones",
    waterDrain: 0.4,
    nutrientDrain: 0.5,
    image: "seeds/seed6.png",
    flowerImage: "flowers/SZN2F_006_Vader-BreathX2.png",
    desc: "Balanced, classic strain.",
  },

  // TIER 2 (GOOD) - Better seeds, some stinkers
  seed7: {
    name: "Gloomberry",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed7.png",
    flowerImage: "flowers/SZN2F_007_Hufflepuffz.png",
    desc: "Balanced, classic strain.",
  },
  seed8: {
    name: "Phantom Fruit",
    waterDrain: 0.4,
    nutrientDrain: 0.3,
    image: "seeds/seed8.png",
    flowerImage: "flowers/SZN2F_008_Grillz-Glue.png",
    desc: "TIER 2 GEM: slow drain.",
  },
  seed9: {
    name: "Diesel Drip",
    waterDrain: 0.5,
    nutrientDrain: 0.5,
    image: "seeds/seed9.png",
    flowerImage: "flowers/SZN2F_009_Dripsicle.png",
    desc: "Balanced, classic strain.",
  },
  seed10: {
    name: "Hotdog Water",
    waterDrain: 0.3,
    nutrientDrain: 0.4,
    image: "seeds/seed10.png",
    flowerImage: "flowers/SZN2F_010_HotSauce.png",
    desc: "TIER 2 GEM: slow drain.",
  },
  seed11: {
    name: "Sundaez",
    waterDrain: 0.3,
    nutrientDrain: 0.5,
    image: "seeds/seed11.png",
    flowerImage: "flowers/SZN2F_011_Grillz-Gas.png",
    desc: "Balanced, classic strain.",
  },
  seed12: {
    name: "Skele OG",
    waterDrain: 0.3,
    nutrientDrain: 0.3,
    image: "seeds/seed12.png",
    flowerImage: "flowers/SZN2F_012_Gorilla-Grillz.png",
    desc: "TIER 2 GEM: slow drain.",
  },
  seed13: {
    name: "Marrow Melon",
    waterDrain: 0.5,
    nutrientDrain: 0.5,
    image: "seeds/seed13.png",
    flowerImage: "flowers/SZN2F_013_Wisp-Widow.png",
    desc: "Balanced, classic strain.",
  },
  seed14: {
    name: "Pineal Punch",
    waterDrain: 0.5,
    nutrientDrain: 0.4,
    image: "seeds/seed14.png",
    flowerImage: "flowers/SZN2F_014_Pixie-Sherb.png",
    desc: "Balanced, classic strain.",
  },
  seed15: {
    name: "Ghoul Gas",
    waterDrain: 0.5,
    nutrientDrain: 0.4,
    image: "seeds/seed15.png",
    flowerImage: "flowers/SZN2F_015_Dunk-OG.png",
    desc: "Balanced, classic strain.",
  },
  seed16: {
    name: "Tomb Tangle",
    waterDrain: 0.3,
    nutrientDrain: 0.5,
    image: "seeds/seed16.png",
    flowerImage: "flowers/SZN2F_016_Red-Croptober.png",
    desc: "Balanced, classic strain.",
  },
  seed17: {
    name: "Wraithwreck",
    waterDrain: 0.5,
    nutrientDrain: 0.4,
    image: "seeds/seed17.png",
    flowerImage: "flowers/SZN2F_017_Fuego42.png",
    desc: "Balanced, classic strain.",
  },
  seed18: {
    name: "Grillz Glue",
    waterDrain: 0.5,
    nutrientDrain: 0.5,
    image: "seeds/seed18.png",
    flowerImage: "flowers/SZN2F_018_DragonScale.png",
    desc: "Balanced, classic strain.",
  },

  // TIER 3 (BEST) - Premium seeds, some stinkers
  seed19: {
    name: "Grave Grape",
    waterDrain: 0.3,
    nutrientDrain: 0.4,
    image: "seeds/seed19.png",
    flowerImage: "flowers/SZN2F_019_Teslaterp.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed20: {
    name: "Sour Spectre",
    waterDrain: 0.2,
    nutrientDrain: 0.3,
    image: "seeds/seed20.png",
    flowerImage: "flowers/SZN2F_020_SkelliDream.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed21: {
    name: "Ghastleaf",
    waterDrain: 0.4,
    nutrientDrain: 0.2,
    image: "seeds/seed21.png",
    flowerImage: "flowers/SZN2F_021_Infernal-Gelato.png",
    desc: "Balanced, classic strain.",
  },
  seed22: {
    name: "Eth Jack",
    waterDrain: 0.4,
    nutrientDrain: 0.3,
    image: "seeds/seed22.png",
    flowerImage: "flowers/SZN2F_022_SlimeCap.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed23: {
    name: "Pepe Zkittles",
    waterDrain: 0.4,
    nutrientDrain: 0.3,
    image: "seeds/seed23.png",
    flowerImage: "flowers/SZN2F_023_NeoCaps.png",
    desc: "Balanced, classic strain.",
  },
  seed24: {
    name: "Bitbudz",
    waterDrain: 0.2,
    nutrientDrain: 0.3,
    image: "seeds/seed24.png",
    flowerImage: "flowers/SZN2F_023_NeoCaps.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed25: {
    name: "Wet Dream",
    waterDrain: 0.3,
    nutrientDrain: 0.4,
    image: "seeds/seed25.png",
    flowerImage: "flowers/SZN2F_025_Ice Walker.png",
    desc: "Balanced, classic strain.",
  },
  seed26: {
    name: "Phantom Pheno",
    waterDrain: 0.3,
    nutrientDrain: 0.4,
    image: "seeds/seed26.png",
    flowerImage: "flowers/SZN2F_026_Moon-Bat-Haze.png",
    desc: "Balanced, classic strain.",
  },
  seed27: {
    name: "Hauntberry",
    waterDrain: 0.2,
    nutrientDrain: 0.4,
    image: "seeds/seed27.png",
    flowerImage: "flowers/SZN2F_027_BlueGrim.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed28: {
    name: "Panda Puff",
    waterDrain: 0.3,
    nutrientDrain: 0.2,
    image: "seeds/seed28.png",
    flowerImage: "flowers/SZN2F_027_BlueGrim.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed29: {
    name: "Moonbat OG",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed29.png",
    flowerImage: "flowers/SZN2F_029_Croiscrumble.png",
    desc: "Balanced, classic strain.",
  },
  seed30: {
    name: "Doom Daisy",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed30.png",
    flowerImage: "flowers/SZN2F_030_Dojo-Diesel.png",
    desc: "Balanced, classic strain.",
  },
  seed31: {
    name: "Skele Skunk",
    waterDrain: 0.2,
    nutrientDrain: 0.4,
    image: "seeds/seed31.png",
    flowerImage: "flowers/SZN2F_031_Blutane.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed32: {
    name: "CthulKush",
    waterDrain: 0.4,
    nutrientDrain: 0.2,
    image: "seeds/seed32.png",
    flowerImage: "flowers/SZN2F_032_CthulKush.png",
    desc: "Balanced, classic strain.",
  },
  seed33: {
    name: "CthulKush",
    waterDrain: 0.2,
    nutrientDrain: 0.4,
    image: "seeds/seed33.png",
    flowerImage: "flowers/SZN2F_032_CthulKush.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed34: {
    name: "BubblRntz",
    waterDrain: 0.3,
    nutrientDrain: 0.2,
    image: "seeds/seed34.png",
    flowerImage: "flowers/SZN2F_034_BubblRntz.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed35: {
    name: "JediKush",
    waterDrain: 0.3,
    nutrientDrain: 0.4,
    image: "seeds/seed35.png",
    flowerImage: "flowers/SZN2F_035_JediKush.png",
    desc: "Balanced, classic strain.",
  },
  seed36: {
    name: "Pepe-OG",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed36.png",
    flowerImage: "flowers/SZN2F_036_Pepe-OG.png",
    desc: "Balanced, classic strain.",
  },
  seed37: {
    name: "AquaTort-G41",
    waterDrain: 0.3,
    nutrientDrain: 0.2,
    image: "seeds/seed37.png",
    flowerImage: "flowers/SZN2F_037_AquaTort-G41.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed38: {
    name: "VoltLa",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed38.png",
    flowerImage: "flowers/SZN2F_038_VoltLa.png",
    desc: "Balanced, classic strain.",
  },
  seed39: {
    name: "PandaManiaOG",
    waterDrain: 0.2,
    nutrientDrain: 0.3,
    image: "seeds/seed39.png",
    flowerImage: "flowers/SZN2F_039_PandaManiaOG.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed40: {
    name: "SKFZGMO",
    waterDrain: 0.3,
    nutrientDrain: 0.3,
    image: "seeds/seed40.png",
    flowerImage: "flowers/SZN2F_040_SKFZGMO.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed41: {
    name: "SKFZGMO",
    waterDrain: 0.4,
    nutrientDrain: 0.3,
    image: "seeds/seed41.png",
    flowerImage: "flowers/SZN2F_040_SKFZGMO.png",
    desc: "Balanced, classic strain.",
  },
  seed42: {
    name: "SKFZGMO",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed42.png",
    flowerImage: "flowers/SZN2F_040_SKFZGMO.png",
    desc: "Balanced, classic strain.",
  },
  seed43: {
    name: "PassionPanda",
    waterDrain: 0.2,
    nutrientDrain: 0.2,
    image: "seeds/seed43.png",
    flowerImage: "flowers/SZN2F_043_PassionPanda.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed44: {
    name: "PassionPanda",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed44.png",
    flowerImage: "flowers/SZN2F_043_PassionPanda.png",
    desc: "Balanced, classic strain.",
  },
  seed45: {
    name: "Detox",
    waterDrain: 0.4,
    nutrientDrain: 0.3,
    image: "seeds/seed45.png",
    flowerImage: "flowers/SZN2F_045_Detox.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed46: {
    name: "Detox",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed46.png",
    flowerImage: "flowers/SZN2F_045_Detox.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed47: {
    name: "Grillz-Cookies",
    waterDrain: 0.3,
    nutrientDrain: 0.3,
    image: "seeds/seed47.png",
    flowerImage: "flowers/SZN2F_047_Grillz-Cookies.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed48: {
    name: "PurpleHeartz",
    waterDrain: 0.3,
    nutrientDrain: 0.2,
    image: "seeds/seed48.png",
    flowerImage: "flowers/SZN2F_048_PurpleHeartz.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed49: {
    name: "Lyle-OG",
    waterDrain: 0.4,
    nutrientDrain: 0.2,
    image: "seeds/seed49.png",
    flowerImage: "flowers/SZN2F_049_Lyle-OG.png",
    desc: "Balanced, classic strain.",
  },
  seed50: {
    name: "KuromiKush",
    waterDrain: 0.3,
    nutrientDrain: 0.4,
    image: "seeds/seed50.png",
    flowerImage: "flowers/SZN2F_050_KuromiKush.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed51: {
    name: "HelloNuggy",
    waterDrain: 0.4,
    nutrientDrain: 0.3,
    image: "seeds/seed51.png",
    flowerImage: "flowers/SZN2F_051_HelloNuggy.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed52: {
    name: "HelloNuggy",
    waterDrain: 0.4,
    nutrientDrain: 0.2,
    image: "seeds/seed52.png",
    flowerImage: "flowers/SZN2F_051_HelloNuggy.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed53: {
    name: "HelloNuggy",
    waterDrain: 0.3,
    nutrientDrain: 0.3,
    image: "seeds/seed53.png",
    flowerImage: "flowers/SZN2F_051_HelloNuggy.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed54: {
    name: "SKFZ Lights",
    waterDrain: 0.3,
    nutrientDrain: 0.3,
    image: "seeds/seed54.png",
    flowerImage: "flowers/SZN2F_054_SKFZ Lights.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed55: {
    name: "PMFUNK",
    waterDrain: 0.4,
    nutrientDrain: 0.2,
    image: "seeds/seed55.png",
    flowerImage: "flowers/SZN2F_055_PMFUNK.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed56: {
    name: "EthJack",
    waterDrain: 0.3,
    nutrientDrain: 0.3,
    image: "seeds/seed56.png",
    flowerImage: "flowers/SZN2F_056_EthJack.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed57: {
    name: "BioPepe",
    waterDrain: 0.2,
    nutrientDrain: 0.4,
    image: "seeds/seed57.png",
    flowerImage: "flowers/SZN2F_057_BioPepe.png",
    desc: "Balanced, classic strain.",
  },
  seed58: {
    name: "DOA47",
    waterDrain: 0.3,
    nutrientDrain: 0.3,
    image: "seeds/seed58.png",
    flowerImage: "flowers/SZN2F_058_DOA47.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed59: {
    name: "DOA47",
    waterDrain: 0.2,
    nutrientDrain: 0.2,
    image: "seeds/seed59.png",
    flowerImage: "flowers/SZN2F_058_DOA47.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed60: {
    name: "DOA47",
    waterDrain: 0.3,
    nutrientDrain: 0.2,
    image: "seeds/seed60.png",
    flowerImage: "flowers/SZN2F_058_DOA47.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed61: {
    name: "GlizzyGoo",
    waterDrain: 0.2,
    nutrientDrain: 0.4,
    image: "seeds/seed61.png",
    flowerImage: "flowers/SZN2F_061_GlizzyGoo.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed62: {
    name: "GrapeAPE",
    waterDrain: 0.3,
    nutrientDrain: 0.2,
    image: "seeds/seed62.png",
    flowerImage: "flowers/SZN2F_062_GrapeAPE.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed63: {
    name: "RedOne",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed63.png",
    flowerImage: "flowers/SZN2F_063_RedOne.png",
    desc: "Balanced, classic strain.",
  },
  seed64: {
    name: "Prism-Zkit",
    waterDrain: 0.2,
    nutrientDrain: 0.3,
    image: "seeds/seed64.png",
    flowerImage: "flowers/SZN2F_064_Prism-Zkit.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed65: {
    name: "Prism-Zkit",
    waterDrain: 0.3,
    nutrientDrain: 0.2,
    image: "seeds/seed65.png",
    flowerImage: "flowers/SZN2F_064_Prism-Zkit.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed66: {
    name: "Prism-Zkit",
    waterDrain: 0.3,
    nutrientDrain: 0.3,
    image: "seeds/seed66.png",
    flowerImage: "flowers/SZN2F_064_Prism-Zkit.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed67: {
    name: "Prism-Zkit",
    waterDrain: 0.3,
    nutrientDrain: 0.3,
    image: "seeds/seed67.png",
    flowerImage: "flowers/SZN2F_064_Prism-Zkit.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed68: {
    name: "Prism-Zkit",
    waterDrain: 0.3,
    nutrientDrain: 0.2,
    image: "seeds/seed68.png",
    flowerImage: "flowers/SZN2F_064_Prism-Zkit.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed69: {
    name: "Prism-Zkit",
    waterDrain: 0.3,
    nutrientDrain: 0.4,
    image: "seeds/seed69.png",
    flowerImage: "flowers/SZN2F_064_Prism-Zkit.png",
    desc: "Balanced, classic strain.",
  },
};

// Soil type definitions - now with names and images to match UI
const soilTypes = {
  ossuary: {
    name: "Bone Dust",
    waterDrain: 0.5,
    nutrientDrain: 0.6,
    image: "soil1.png",
  },
  graveblend: {
    name: "Magic Moss",
    waterDrain: 0.6,
    nutrientDrain: 0.4,
    image: "soil2.png",
  },
  marrowmoss: {
    name: "Eh.. Not sure",
    waterDrain: 0.5,
    nutrientDrain: 0.5,
    image: "soil3.png",
  },
};

// 10 unique nutrient mixes
const nutrientMixes = {
  basic: {
    name: "Basic Mix",
    desc: "Standard, reliable feed.",
    potency: 1.0,
    yield: 1.0,
    nutrientFeed: 10,
  },
  growth: {
    name: "Growth Boost",
    desc: "Bigger yields, less potency.",
    potency: 0.9,
    yield: 1.2,
    nutrientFeed: 25,
  },
  potent: {
    name: "Potency Plus",
    desc: "More potent, less yield.",
    potency: 1.2,
    yield: 0.9,
    nutrientFeed: 15,
  },
  balanced: {
    name: "Balanced",
    desc: "Slight boost to both.",
    potency: 1.1,
    yield: 1.1,
    nutrientFeed: 18,
  },
  fungal: {
    name: "Fungal Fizz",
    desc: "Risk of mold, big yields!",
    potency: 0.8,
    yield: 1.3,
    nutrientFeed: 30,
  },
  bonebroth: {
    name: "Bone Broth",
    desc: "Super potent, stunts growth.",
    potency: 1.3,
    yield: 0.8,
    nutrientFeed: 12,
  },
  phantom: {
    name: "Phantom Dew",
    desc: "Ghostly, high yield, low flavor.",
    potency: 1.0,
    yield: 1.3,
    nutrientFeed: 22,
  },
  rotjuice: {
    name: "Rot Juice",
    desc: "Smells bad, drains everything.",
    potency: 0.7,
    yield: 0.7,
    nutrientFeed: 8,
  },
  cosmic: {
    name: "Cosmic",
    desc: "Unpredictable, sometimes amazing.",
    potency: 1.4,
    yield: 1.0,
    nutrientFeed: 20,
  },
  doomdust: {
    name: "Doom Dust",
    desc: "Dangerous, huge yields if you survive.",
    potency: 0.6,
    yield: 1.4,
    nutrientFeed: 28,
  },
};

// Fun, weird, and unique pest types
const pestTypes = [
  {
    name: "Space Slugs",
    damage: [4, 12],
    successRate: 0.5,
    message: "Space slugs are oozing over your plants!",
  },
  {
    name: "Brain Leeches",
    damage: [5, 15],
    successRate: 0.4,
    message: "Brain leeches are draining your plant's will to live!",
  },
  {
    name: "Crypt Mites",
    damage: [3, 10],
    successRate: 0.6,
    message: "Crypt mites are gnawing at your roots!",
  },
  {
    name: "Phantom Gnats",
    damage: [2, 8],
    successRate: 0.6,
    message: "Phantom gnats are haunting your soil!",
  },
  {
    name: "Mutant Aphids",
    damage: [6, 18],
    successRate: 0.35,
    message: "Mutant aphids are swarming your crop!",
  },
  {
    name: "Eyeball Spiders",
    damage: [5, 15],
    successRate: 0.3,
    message: "Eyeball spiders are staring at your leaves!",
  },
  {
    name: "Mini Martians",
    damage: [4, 14],
    successRate: 0.45,
    message: "Mini martians are abducting your nutrients!",
  },
  {
    name: "Fungal Gremlins",
    damage: [3, 12],
    successRate: 0.5,
    message: "Fungal gremlins are causing chaos in your soil!",
  },
];

// Fun, weird, and unique raider types
const raidTypes = [
  {
    name: "Crypt Bandits",
    damage: [10, 20],
    successRate: 0.3,
    message: "Crypt bandits are sneaking into your garden!",
  },
  {
    name: "Mutant Chickens",
    damage: [8, 18],
    successRate: 0.35,
    message: "Mutant chickens are pecking at your stash!",
  },
  {
    name: "Alien Harvesters",
    damage: [15, 25],
    successRate: 0.2,
    message: "Alien harvesters are beaming up your buds!",
  },
  {
    name: "Spectral Thieves",
    damage: [12, 22],
    successRate: 0.25,
    message: "Spectral thieves are phasing through your defenses!",
  },
  {
    name: "Corporate Thieves",
    damage: [20, 30],
    successRate: 0.25,
    message: "Corporate security forces are attempting to seize your crop!",
  },
  {
    name: "Mutant Horde",
    damage: [25, 35],
    successRate: 0.15,
    message: "A horde of mutants is descending on your grow site!",
  },
  {
    name: "Zombie Gardeners",
    damage: [10, 20],
    successRate: 0.3,
    message: "Zombie gardeners are pruning your plants... badly!",
  },
];

// Fun and funny acts of god
const actsOfGod = [
  // Water
  {
    type: "water",
    message: "Your mom's thirsty! There was a drought.",
    effect: (plant) => {
      plant.water = Math.max(10, plant.water - 30);
    },
  },
  {
    type: "water",
    message: "A pipe burst and flooded the street. Water supply is cut!",
    effect: (plant) => {
      plant.water = Math.max(10, plant.water - 30);
    },
  },
  {
    type: "water",
    message: "A rain of frogs absorbs all your water!",
    effect: (plant) => {
      plant.water = Math.max(10, plant.water - 30);
    },
  },
  // Light
  {
    type: "light",
    message: "A solar eclipse darkens the sky!",
    effect: (plant) => {
      plant.light = Math.max(10, plant.light - 30);
    },
  },
  {
    type: "light",
    message: "A dust storm blocks out the sun!",
    effect: (plant) => {
      plant.light = Math.max(10, plant.light - 30);
    },
  },
  {
    type: "light",
    message: "Cosmic rays mutate your crop!",
    effect: (plant) => {
      plant.light = Math.max(10, plant.light - 30);
    },
  },
  // Nutrients
  {
    type: "nutrients",
    message: "Hungry raccoons raided your compost pile!",
    effect: (plant) => {
      plant.nutrients = Math.max(10, plant.nutrients - 30);
    },
  },
  {
    type: "nutrients",
    message: "Toxic runoff ruined your fertilizer batch!",
    effect: (plant) => {
      plant.nutrients = Math.max(10, plant.nutrients - 30);
    },
  },
  {
    type: "nutrients",
    message: "A wormhole sucked up your nutrients!",
    effect: (plant) => {
      plant.nutrients = Math.max(10, plant.nutrients - 30);
    },
  },
  // Wild/funny
  {
    type: "wild",
    message: "A time traveler swapped your plant with a weaker version!",
    effect: (plant) => {
      plant.health = Math.max(10, plant.health - 30);
    },
  },
  {
    type: "wild",
    message: "A poltergeist rearranged your garden!",
    effect: (plant) => {
      plant.stress = Math.min(100, plant.stress + 30);
    },
  },
];

// Add a flag to track if an act of god has occurred
var actOfGodOccurred = false;
var actOfGodTimeout = null;

// Utility to pick 3 random seeds
function getRandomSeeds() {
  const keys = Object.keys(seedProperties);
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }
  return keys.slice(0, 3);
}

// Render 3 random seeds on the selection screen
function renderSeedOptions() {
  const chosenSeeds = getRandomSeeds();
  const seedOptionsDiv = document.querySelector(".seed-options");
  if (!seedOptionsDiv) return; // Exit if element doesn't exist

  seedOptionsDiv.innerHTML = "";
  chosenSeeds.forEach((key) => {
    const seed = seedProperties[key];
    const div = document.createElement("div");
    div.className = "seed-option";
    div.setAttribute("data-seed-type", key);
    div.innerHTML = `
          <img src="img/selections/${seed.image}" alt="${seed.name}" class="seed-img" />
          <div class="seed-name">${seed.name}</div>
      `;
    seedOptionsDiv.appendChild(div);
  });
  // Re-attach event listeners for new options
  document.querySelectorAll(".seed-option").forEach(function (option) {
    option.addEventListener("click", function () {
      document.querySelectorAll(".seed-option").forEach(function (opt) {
        opt.classList.remove("selected");
      });
      option.classList.add("selected");
      plant.seedType = option.getAttribute("data-seed-type");
      updateStartButton();
    });
  });
  attachSoilSelectionHandlers();
}

// Call renderSeedOptions on page load only if old UI exists
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector(".seed-options")) {
      renderSeedOptions();
    }
  });
} else {
  if (document.querySelector(".seed-options")) {
    renderSeedOptions();
  }
}

function attachSoilSelectionHandlers() {
  document.querySelectorAll(".soil-option").forEach(function (option) {
    option.addEventListener("click", function () {
      document.querySelectorAll(".soil-option").forEach(function (opt) {
        opt.classList.remove("selected");
      });
      option.classList.add("selected");
      plant.soilType = option.getAttribute("data-soil-type");
      updateStartButton();
    });
  });
}

// Set up soil selection only if old UI exists
if (document.querySelector(".soil-option")) {
  var soilOptions = document.querySelectorAll(".soil-option");
  soilOptions.forEach(function (option) {
    option.addEventListener("click", function () {
      // Remove selected class from all soil options
      soilOptions.forEach(function (opt) {
        opt.classList.remove("selected");
      });
      // Add selected class to clicked option
      option.classList.add("selected");
      // Store selected soil type
      plant.soilType = option.getAttribute("data-soil-type");
      updateStartButton();
    });
  });
}

// Update start button state
function updateStartButton() {
  const startButton = document.getElementById("startGameBtn");
  if (!startButton) return; // Exit if button doesn't exist
  startButton.disabled = !(
    plant.seedType &&
    plant.soilType &&
    plant.defenseType
  );
}

// Start the game
function startGame() {
  const selectionScreen = document.getElementById("selectionScreen");
  const gameSection = document.getElementById("gameSection");

  if (selectionScreen) selectionScreen.classList.add("hidden");
  if (gameSection) gameSection.classList.remove("hidden");

  var gameContainer = document.getElementById("gameContainer");
  if (gameContainer) gameContainer.classList.remove("hidden");

  // Show feeding schedule configuration
  if (typeof showFeedingScheduleConfig === "function") {
    showFeedingScheduleConfig();
  }
}

// Randomly trigger pest events during growth
function maybeTriggerEvent() {
  if (
    pestActive ||
    raiderActive ||
    nutrientActive ||
    plant.growthStage >= growthStages.length - 1
  )
    return;

  // Flowering stage: can trigger raiders or nutrient boost
  if (growthStages[plant.growthStage].name === "Flowering") {
    // 5% chance for raiders, 5% for nutrient boost (reduced from 15% and 10%)
    var rand = Math.random();
    if (rand < 0.05) {
      showNutrientEvent();
    } else if (rand < 0.1) {
      showRaiderEvent();
    }
  } else {
    // 5% chance for pests (reduced from 20%)
    if (Math.random() < 0.05) {
      showPestEvent();
    }
  }
}

// ===============================
// 🐛 PEST SWATTING MINI-GAME v2
// ===============================

// Map different pest types to emoji sets
const pestEmojiMap = {
  pest: ["🐛", "🪲", "🐌", "🦗", "🕷️"],
  raider: ["🏴‍☠️", "🧛‍♂️", "🦹‍♂️"],
  nutrient: ["🧪", "🍄", "💧"],
};

// UI state
let pestUIActive = false;
let pestOverlayEl = null;
let pestTimerId = null;
let pestWiggleInterval = null;

// Show "SWAT!" feedback when pest is clicked
function showSwatFeedback(pestElement) {
  const swatText = document.createElement("div");
  swatText.textContent = "SWAT!";
  swatText.style.cssText = `
    position: absolute;
    left: ${pestElement.style.left};
    top: ${pestElement.style.top};
    font-family: 'Press Start 2P', monospace;
    font-size: 16px;
    color: #00ff00;
    font-weight: bold;
    pointer-events: none;
    z-index: 20000;
    text-shadow: 2px 2px 0px #000000;
    animation: swatPulse 0.8s ease-out forwards;
  `;

  // Add CSS animation if not already added
  if (!document.getElementById("swatAnimation")) {
    const style = document.createElement("style");
    style.id = "swatAnimation";
    style.textContent = `
      @keyframes swatPulse {
        0% { 
          transform: scale(0.5) translateY(0px);
          opacity: 1;
        }
        50% { 
          transform: scale(1.2) translateY(-20px);
          opacity: 1;
        }
        100% { 
          transform: scale(1) translateY(-40px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  pestOverlayEl.appendChild(swatText);

  // Remove after animation
  setTimeout(() => {
    if (swatText.parentNode) {
      swatText.remove();
    }
  }, 800);
}

// Initialize pest event system
function showPestEvent() {
  try {
    console.log("🐛 showPestEvent() called");
    console.log("🔍 Debug info:", {
      pestUIActive,
      lightIsOn,
      plantExists: !!plant,
      plantDefenseType: plant?.defenseType,
      plantContainer: !!document.querySelector(".plantImageContainer"),
    });

    if (pestUIActive) {
      console.log("⚠️ Pest UI already active, skipping");
      return "Pest UI already active";
    }

    // Check if lights are off (pests hate dark)
    if (!lightIsOn) {
      console.log("🌙 Lights are off, pests hate dark");
      addEventToLog("Pests hate the dark. They scurried away!", "info");
      return "Lights are off";
    }

    console.log("🌱 Starting pest event...");
    pestActive = true;
    const pestType = pestTypes[Math.floor(Math.random() * pestTypes.length)];
    addEventToLog(`${pestType.message}`, "warning");

    // If Grower defense, block pest penalty
    if (plant.defenseType === "grower") {
      console.log("🛡️ Grower defense active, blocking pests");
      setTimeout(function () {
        addEventToLog("Your Grower defended against the pests!", "info");
        pestActive = false;
      }, 2000);
      return "Grower defense active";
    }

    console.log("🚀 About to start pest mini-game...");

    // Wait until the plant container is actually visible
    const waitForPlantContainer = () => {
      const plantContainer = document.querySelector(".plantImageContainer");

      if (!plantContainer || plantContainer.offsetParent === null) {
        // Retry until game screen is visible
        console.log("⏳ Waiting for plant container...");
        setTimeout(waitForPlantContainer, 500);
        return;
      }

      // When found, continue
      console.log("✅ Found plant container, starting pest mini-game");
      startPestMinigame("pest", {
        count: 1,
        duration: 8000,
        pestType: pestType,
      });
    };

    waitForPlantContainer();
    console.log("🏁 Function ending, returning...");
    return "Pest event started";
  } catch (error) {
    console.error("❌ Error in showPestEvent:", error);
    return "Error: " + error.message;
  }
}

// Make showPestEvent globally accessible for testing
window.showPestEvent = showPestEvent;
console.log(
  "🔧 showPestEvent function attached to window:",
  typeof window.showPestEvent
);

// Add a simple test function
window.testPest = function () {
  console.log("🧪 Test function called - pest system is working!");
  console.log("Pest UI active:", pestUIActive);
  console.log("Light is on:", lightIsOn);
  console.log(
    "Plant container exists:",
    !!document.querySelector(".plantImageContainer")
  );
  return "Test successful!";
};

function startPestMinigame(
  type = "pest",
  { count = 1, duration = 8000, pestType = null } = {}
) {
  const plantContainer = document.querySelector(".plantImageContainer");
  console.log("🌿 Pest container found:", plantContainer);

  // Find the plant image container where the plant animation and light overlay are

  // Check if container exists and is visible
  if (!plantContainer || plantContainer.offsetParent === null) {
    console.warn("No visible plant container found for pest mini-game");
    // Fallback to automatic resolution
    const defenseSuccess = Math.random() < (pestType?.successRate || 0.5);
    setTimeout(() => {
      if (defenseSuccess) {
        addEventToLog(
          `${pestType?.name || "Pests"} were successfully repelled!`,
          "info"
        );
      } else {
        const damagePercent = Math.floor(Math.random() * 10) + 5;
        plant.pestPenalty *= 1 - damagePercent / 100;
        addEventToLog(
          `${pestType?.name || "Pests"} reduced potency by ${damagePercent}%.`,
          "error"
        );
      }
      pestActive = false;
    }, 3000);
    return;
  }

  pestUIActive = true;

  // Create overlay above the plant image
  if (!pestOverlayEl) {
    pestOverlayEl = document.createElement("div");
    pestOverlayEl.className = "pest-overlay";
    plantContainer.appendChild(pestOverlayEl);
  } else {
    pestOverlayEl.innerHTML = "";
    pestOverlayEl.style.display = "block";
  }

  // ensure container has proper positioning context
  if (getComputedStyle(plantContainer).position === "static") {
    plantContainer.style.position = "relative";
  }

  const emojis = pestEmojiMap[type] || pestEmojiMap.pest;
  const { width, height } = plantContainer.getBoundingClientRect();

  let activePests = 0;
  let totalSpawned = 0;
  let swatted = 0;
  let missed = 0;
  const maxSpawn = Math.floor(duration / 700);

  function spawnPest() {
    if (totalSpawned >= maxSpawn || !pestUIActive) return;
    totalSpawned++;
    activePests++;

    const pest = document.createElement("span");
    pest.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    console.log("Spawning pest emoji", pest.textContent);
    pest.style.cssText = `
      position: absolute;
      left: ${Math.random() * (width - 40)}px;
      top: ${Math.random() * (height - 40)}px;
      font-size: clamp(22px, 4vw, 38px);
      cursor: pointer;
      user-select: none;
      pointer-events: auto;
      transition: transform 0.1s, opacity 0.15s;
      z-index: 10000;
    `;

    const dx = (Math.random() - 0.5) * 3;
    const dy = (Math.random() - 0.5) * 3;
    pest.dataset.dx = dx;
    pest.dataset.dy = dy;

    pest.addEventListener("click", () => {
      if (!pest.parentNode) return; // Already removed

      swatted++;
      activePests--;

      // Show "SWAT!" feedback
      showSwatFeedback(pest);

      pest.style.transform = "scale(0.3) rotate(45deg)";
      pest.style.opacity = "0";
      setTimeout(() => {
        if (pest.parentNode) pest.remove();
      }, 150);

      // Spawn replacement after delay
      setTimeout(() => {
        if (pestUIActive && totalSpawned < maxSpawn) spawnPest();
      }, 300 + Math.random() * 500);
    });

    pestOverlayEl.appendChild(pest);

    // Auto-remove after timeout (longer duration)
    setTimeout(() => {
      if (pest.parentNode) {
        missed++;
        activePests--;
        pest.style.opacity = "0";
        setTimeout(() => {
          if (pest.parentNode) pest.remove();
        }, 200);
      }
    }, 4000 + Math.random() * 2000);
  }

  // Wiggle animation
  clearInterval(pestWiggleInterval);
  pestWiggleInterval = setInterval(() => {
    if (!pestUIActive) return;

    pestOverlayEl.querySelectorAll("span").forEach((p) => {
      if (!p.parentNode) return;

      const currentLeft = parseFloat(p.style.left) || 0;
      const currentTop = parseFloat(p.style.top) || 0;
      const dx = parseFloat(p.dataset.dx) || 0;
      const dy = parseFloat(p.dataset.dy) || 0;

      const newLeft = Math.max(0, Math.min(width - 40, currentLeft + dx));
      const newTop = Math.max(0, Math.min(height - 40, currentTop + dy));

      p.style.left = newLeft + "px";
      p.style.top = newTop + "px";
    });
  }, 80);

  // Start spawning
  const spawnInterval = setInterval(() => {
    if (!pestUIActive) {
      clearInterval(spawnInterval);
      return;
    }
    if (totalSpawned < maxSpawn) spawnPest();
  }, 600);

  // End game after duration
  clearTimeout(pestTimerId);
  pestTimerId = setTimeout(() => {
    finishPestMinigame(type, missed, swatted, totalSpawned, pestType);
  }, duration);
}

function finishPestMinigame(type, missed, swatted, total, pestType) {
  // Clean up UI
  if (pestOverlayEl) {
    pestOverlayEl.style.display = "none";
    pestOverlayEl.innerHTML = "";
  }

  clearInterval(pestWiggleInterval);
  clearTimeout(pestTimerId);
  pestUIActive = false;

  // Calculate results (keep mysterious)
  const missedRate = missed / Math.max(1, total);
  const successRate = swatted / Math.max(1, total);

  // Apply penalties based on performance (silently)
  if (missed > 0) {
    const penalty = Math.min(0.25, missedRate * 0.3); // Max 25% penalty

    if (type === "pest") {
      plant.pestPenalty *= 1 - penalty;
      // Keep it mysterious - no specific feedback
      addEventToLog("The pests have been dealt with.", "info");
    }
  } else if (successRate > 0.8) {
    addEventToLog("Excellent pest control!", "info");
  } else {
    addEventToLog("Pest situation resolved.", "info");
  }

  pestActive = false;
}

function showRaiderEvent() {
  raiderActive = true;
  const raidType = raidTypes[Math.floor(Math.random() * raidTypes.length)];
  addEventToLog(`${raidType.message}`, "warning");
  // If Hound defense, block raider penalty
  if (plant.defenseType === "hound") {
    setTimeout(function () {
      addEventToLog("Your Hound chased off the raiders!", "info");
      raiderActive = false;
    }, 2000);
    return;
  }
  // Random chance to successfully defend against raiders
  const defenseSuccess = Math.random() < raidType.successRate;
  setTimeout(function () {
    if (defenseSuccess) {
      addEventToLog(`${raidType.name} were successfully repelled!`, "info");
    } else {
      const damagePercent = Math.floor(Math.random() * 10) + 5; // Reduced damage range (5-15%)
      plant.raiderPenalty *= 1 - damagePercent / 100;
      addEventToLog(
        `${raidType.name} reduced yield by ${damagePercent}%.`,
        "error"
      );
    }
    raiderActive = false;
  }, 5000);
}

function showNutrientEvent() {
  nutrientActive = true;
  addEventToLog("Nutrient boost available!", "info");

  // Random chance to get a nutrient boost
  const boostSuccess = Math.random() < 0.5; // 50% chance to get boost

  setTimeout(function () {
    if (boostSuccess) {
      const boostPercent = Math.floor(Math.random() * 10) + 5; // Random boost between 5-15%
      plant.potencyBoost *= 1 + boostPercent / 100;
      addEventToLog(
        `Nutrient boost applied! Potency increased by ${boostPercent}%.`,
        "info"
      );
    } else {
      addEventToLog("Nutrient boost opportunity missed.", "info");
    }
    nutrientActive = false;
  }, 5000);
}
