// Missing game data structures

// Seed properties: 69 seeds organized in 3 tiers with strategic "stinkers"
const seedProperties = {
  // TIER 1 (OK) - Basic seeds, some stinkers
  seed1: {
    name: "Sailor Sktlz",
    waterDrain: 0.6,
    nutrientDrain: 0.6,
    image: "seeds/seed1.png",
    flowerImage: "flowers/SZN2F_001_Sailor_Sktlz.png",
    desc: "Balanced, classic strain.",
  },
  seed2: {
    name: "Nifty Nugz",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed2.png",
    flowerImage: "flowers/SZN2F_002_NiftyNugz.png",
    desc: "Balanced, classic strain.",
  },
  seed3: {
    name: "PNK Panther",
    waterDrain: 0.4,
    nutrientDrain: 0.6,
    image: "seeds/seed3.png",
    flowerImage: "flowers/SZN2F_003_PNK_Panther.png",
    desc: "Balanced, classic strain.",
  },
  seed4: {
    name: "Ember Sherb",
    waterDrain: 0.5,
    nutrientDrain: 0.5,
    image: "seeds/seed4.png",
    flowerImage: "flowers/SZN2F_004_Ember-Sherb.png",
    desc: "Balanced, classic strain.",
  },
  seed5: {
    name: "Burzt",
    waterDrain: 0.5,
    nutrientDrain: 0.5,
    image: "seeds/seed5.png",
    flowerImage: "flowers/SZN2F_005_Burzt.png",
    desc: "Balanced, classic strain.",
  },
  seed6: {
    name: "Vader Breath X2",
    waterDrain: 0.4,
    nutrientDrain: 0.5,
    image: "seeds/seed6.png",
    flowerImage: "flowers/SZN2F_006_Vader-BreathX2.png",
    desc: "Balanced, classic strain.",
  },

  // TIER 2 (GOOD) - Better seeds, some stinkers
  seed7: {
    name: "Hufflepuffz",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed7.png",
    flowerImage: "flowers/SZN2F_007_Hufflepuffz.png",
    desc: "Balanced, classic strain.",
  },
  seed8: {
    name: "Grillz Glue",
    waterDrain: 0.4,
    nutrientDrain: 0.3,
    image: "seeds/seed8.png",
    flowerImage: "flowers/SZN2F_008_Grillz-Glue.png",
    desc: "TIER 2 GEM: slow drain.",
  },
  seed9: {
    name: "Dripsicle",
    waterDrain: 0.5,
    nutrientDrain: 0.5,
    image: "seeds/seed9.png",
    flowerImage: "flowers/SZN2F_009_Dripsicle.png",
    desc: "Balanced, classic strain.",
  },
  seed10: {
    name: "Hot Sauce",
    waterDrain: 0.3,
    nutrientDrain: 0.4,
    image: "seeds/seed10.png",
    flowerImage: "flowers/SZN2F_010_HotSauce.png",
    desc: "TIER 2 GEM: slow drain.",
  },
  seed11: {
    name: "Grillz Gas",
    waterDrain: 0.3,
    nutrientDrain: 0.5,
    image: "seeds/seed11.png",
    flowerImage: "flowers/SZN2F_011_Grillz-Gas.png",
    desc: "Balanced, classic strain.",
  },
  seed12: {
    name: "Gorilla Grillz",
    waterDrain: 0.3,
    nutrientDrain: 0.3,
    image: "seeds/seed12.png",
    flowerImage: "flowers/SZN2F_012_Gorilla-Grillz.png",
    desc: "TIER 2 GEM: slow drain.",
  },
  seed13: {
    name: "Wisp Widow",
    waterDrain: 0.5,
    nutrientDrain: 0.5,
    image: "seeds/seed13.png",
    flowerImage: "flowers/SZN2F_013_Wisp-Widow.png",
    desc: "Balanced, classic strain.",
  },
  seed14: {
    name: "Pixie Sherb",
    waterDrain: 0.5,
    nutrientDrain: 0.4,
    image: "seeds/seed14.png",
    flowerImage: "flowers/SZN2F_014_Pixie-Sherb.png",
    desc: "Balanced, classic strain.",
  },
  seed15: {
    name: "Dunk OG",
    waterDrain: 0.5,
    nutrientDrain: 0.4,
    image: "seeds/seed15.png",
    flowerImage: "flowers/SZN2F_015_Dunk-OG.png",
    desc: "Balanced, classic strain.",
  },
  seed16: {
    name: "Red Croptober",
    waterDrain: 0.3,
    nutrientDrain: 0.5,
    image: "seeds/seed16.png",
    flowerImage: "flowers/SZN2F_016_Red-Croptober.png",
    desc: "Balanced, classic strain.",
  },
  seed17: {
    name: "Fuego 42",
    waterDrain: 0.5,
    nutrientDrain: 0.4,
    image: "seeds/seed17.png",
    flowerImage: "flowers/SZN2F_017_Fuego42.png",
    desc: "Balanced, classic strain.",
  },
  seed18: {
    name: "Dragon Scale",
    waterDrain: 0.5,
    nutrientDrain: 0.5,
    image: "seeds/seed18.png",
    flowerImage: "flowers/SZN2F_018_DragonScale.png",
    desc: "Balanced, classic strain.",
  },

  // TIER 3 (BEST) - Premium seeds, some stinkers
  seed19: {
    name: "Teslaterp",
    waterDrain: 0.3,
    nutrientDrain: 0.4,
    image: "seeds/seed19.png",
    flowerImage: "flowers/SZN2F_019_Teslaterp.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed20: {
    name: "Skelli Dream",
    waterDrain: 0.2,
    nutrientDrain: 0.3,
    image: "seeds/seed20.png",
    flowerImage: "flowers/SZN2F_020_SkelliDream.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed21: {
    name: "Infernal Gelato",
    waterDrain: 0.4,
    nutrientDrain: 0.2,
    image: "seeds/seed21.png",
    flowerImage: "flowers/SZN2F_021_Infernal-Gelato.png",
    desc: "Balanced, classic strain.",
  },
  seed22: {
    name: "Slime Cap",
    waterDrain: 0.4,
    nutrientDrain: 0.3,
    image: "seeds/seed22.png",
    flowerImage: "flowers/SZN2F_022_SlimeCap.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed23: {
    name: "Neo Caps",
    waterDrain: 0.4,
    nutrientDrain: 0.3,
    image: "seeds/seed23.png",
    flowerImage: "flowers/SZN2F_023_NeoCaps.png",
    desc: "Balanced, classic strain.",
  },
  seed24: {
    name: "Neo Caps II",
    waterDrain: 0.2,
    nutrientDrain: 0.3,
    image: "seeds/seed24.png",
    flowerImage: "flowers/SZN2F_023_NeoCaps.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed25: {
    name: "Ice Walker",
    waterDrain: 0.3,
    nutrientDrain: 0.4,
    image: "seeds/seed25.png",
    flowerImage: "flowers/SZN2F_025_Ice Walker.png",
    desc: "Balanced, classic strain.",
  },
  seed26: {
    name: "Moon Bat Haze",
    waterDrain: 0.3,
    nutrientDrain: 0.4,
    image: "seeds/seed26.png",
    flowerImage: "flowers/SZN2F_026_Moon-Bat-Haze.png",
    desc: "Balanced, classic strain.",
  },
  seed27: {
    name: "Blue Grim",
    waterDrain: 0.2,
    nutrientDrain: 0.4,
    image: "seeds/seed27.png",
    flowerImage: "flowers/SZN2F_027_BlueGrim.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed28: {
    name: "Blue Grim II",
    waterDrain: 0.3,
    nutrientDrain: 0.2,
    image: "seeds/seed28.png",
    flowerImage: "flowers/SZN2F_027_BlueGrim.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed29: {
    name: "Croiscrumble",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed29.png",
    flowerImage: "flowers/SZN2F_029_Croiscrumble.png",
    desc: "Balanced, classic strain.",
  },
  seed30: {
    name: "Dojo Diesel",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed30.png",
    flowerImage: "flowers/SZN2F_030_Dojo-Diesel.png",
    desc: "Balanced, classic strain.",
  },
  seed31: {
    name: "Blutane",
    waterDrain: 0.2,
    nutrientDrain: 0.4,
    image: "seeds/seed31.png",
    flowerImage: "flowers/SZN2F_031_Blutane.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed32: {
    name: "Cthul Kush",
    waterDrain: 0.4,
    nutrientDrain: 0.2,
    image: "seeds/seed32.png",
    flowerImage: "flowers/SZN2F_032_CthulKush.png",
    desc: "Balanced, classic strain.",
  },
  seed33: {
    name: "Cthul Kush II",
    waterDrain: 0.2,
    nutrientDrain: 0.4,
    image: "seeds/seed33.png",
    flowerImage: "flowers/SZN2F_032_CthulKush.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed34: {
    name: "Bubbl Rntz",
    waterDrain: 0.3,
    nutrientDrain: 0.2,
    image: "seeds/seed34.png",
    flowerImage: "flowers/SZN2F_034_BubblRntz.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed35: {
    name: "Jedi Kush",
    waterDrain: 0.3,
    nutrientDrain: 0.4,
    image: "seeds/seed35.png",
    flowerImage: "flowers/SZN2F_035_JediKush.png",
    desc: "Balanced, classic strain.",
  },
  seed36: {
    name: "Pepe OG",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed36.png",
    flowerImage: "flowers/SZN2F_036_Pepe-OG.png",
    desc: "Balanced, classic strain.",
  },
  seed37: {
    name: "Aqua Tort G41",
    waterDrain: 0.3,
    nutrientDrain: 0.2,
    image: "seeds/seed37.png",
    flowerImage: "flowers/SZN2F_037_AquaTort-G41.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed38: {
    name: "Volt La",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed38.png",
    flowerImage: "flowers/SZN2F_038_VoltLa.png",
    desc: "Balanced, classic strain.",
  },
  seed39: {
    name: "Panda Mania OG",
    waterDrain: 0.2,
    nutrientDrain: 0.3,
    image: "seeds/seed39.png",
    flowerImage: "flowers/SZN2F_039_PandaManiaOG.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed40: {
    name: "SKFZ GMO",
    waterDrain: 0.3,
    nutrientDrain: 0.3,
    image: "seeds/seed40.png",
    flowerImage: "flowers/SZN2F_040_SKFZGMO.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed41: {
    name: "SKFZ GMO II",
    waterDrain: 0.4,
    nutrientDrain: 0.3,
    image: "seeds/seed41.png",
    flowerImage: "flowers/SZN2F_040_SKFZGMO.png",
    desc: "Balanced, classic strain.",
  },
  seed42: {
    name: "SKFZ GMO III",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed42.png",
    flowerImage: "flowers/SZN2F_040_SKFZGMO.png",
    desc: "Balanced, classic strain.",
  },
  seed43: {
    name: "Passion Panda",
    waterDrain: 0.2,
    nutrientDrain: 0.2,
    image: "seeds/seed43.png",
    flowerImage: "flowers/SZN2F_043_PassionPanda.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed44: {
    name: "Passion Panda II",
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
    name: "Detox II",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed46.png",
    flowerImage: "flowers/SZN2F_045_Detox.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed47: {
    name: "Grillz Cookies",
    waterDrain: 0.3,
    nutrientDrain: 0.3,
    image: "seeds/seed47.png",
    flowerImage: "flowers/SZN2F_047_Grillz-Cookies.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed48: {
    name: "Purple Heartz",
    waterDrain: 0.3,
    nutrientDrain: 0.2,
    image: "seeds/seed48.png",
    flowerImage: "flowers/SZN2F_048_PurpleHeartz.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed49: {
    name: "Lyle OG",
    waterDrain: 0.4,
    nutrientDrain: 0.2,
    image: "seeds/seed49.png",
    flowerImage: "flowers/SZN2F_049_Lyle-OG.png",
    desc: "Balanced, classic strain.",
  },
  seed50: {
    name: "Kuromi Kush",
    waterDrain: 0.3,
    nutrientDrain: 0.4,
    image: "seeds/seed50.png",
    flowerImage: "flowers/SZN2F_050_KuromiKush.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed51: {
    name: "Hello Nuggy",
    waterDrain: 0.4,
    nutrientDrain: 0.3,
    image: "seeds/seed51.png",
    flowerImage: "flowers/SZN2F_051_HelloNuggy.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed52: {
    name: "Hello Nuggy II",
    waterDrain: 0.4,
    nutrientDrain: 0.2,
    image: "seeds/seed52.png",
    flowerImage: "flowers/SZN2F_051_HelloNuggy.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed53: {
    name: "Hello Nuggy III",
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
    name: "PM Funk",
    waterDrain: 0.4,
    nutrientDrain: 0.2,
    image: "seeds/seed55.png",
    flowerImage: "flowers/SZN2F_055_PMFUNK.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed56: {
    name: "Eth Jack",
    waterDrain: 0.3,
    nutrientDrain: 0.3,
    image: "seeds/seed56.png",
    flowerImage: "flowers/SZN2F_056_EthJack.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed57: {
    name: "Bio Pepe",
    waterDrain: 0.2,
    nutrientDrain: 0.4,
    image: "seeds/seed57.png",
    flowerImage: "flowers/SZN2F_057_BioPepe.png",
    desc: "Balanced, classic strain.",
  },
  seed58: {
    name: "DOA 47",
    waterDrain: 0.3,
    nutrientDrain: 0.3,
    image: "seeds/seed58.png",
    flowerImage: "flowers/SZN2F_058_DOA47.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed59: {
    name: "DOA 47 II",
    waterDrain: 0.2,
    nutrientDrain: 0.2,
    image: "seeds/seed59.png",
    flowerImage: "flowers/SZN2F_058_DOA47.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed60: {
    name: "DOA 47 III",
    waterDrain: 0.3,
    nutrientDrain: 0.2,
    image: "seeds/seed60.png",
    flowerImage: "flowers/SZN2F_058_DOA47.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed61: {
    name: "Glizzy Goo",
    waterDrain: 0.2,
    nutrientDrain: 0.4,
    image: "seeds/seed61.png",
    flowerImage: "flowers/SZN2F_061_GlizzyGoo.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed62: {
    name: "Grape APE",
    waterDrain: 0.3,
    nutrientDrain: 0.2,
    image: "seeds/seed62.png",
    flowerImage: "flowers/SZN2F_062_GrapeAPE.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed63: {
    name: "Red One",
    waterDrain: 0.4,
    nutrientDrain: 0.4,
    image: "seeds/seed63.png",
    flowerImage: "flowers/SZN2F_063_RedOne.png",
    desc: "Balanced, classic strain.",
  },
  seed64: {
    name: "Prism Zkit",
    waterDrain: 0.2,
    nutrientDrain: 0.3,
    image: "seeds/seed64.png",
    flowerImage: "flowers/SZN2F_064_Prism-Zkit.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed65: {
    name: "Prism Zkit II",
    waterDrain: 0.3,
    nutrientDrain: 0.2,
    image: "seeds/seed65.png",
    flowerImage: "flowers/SZN2F_064_Prism-Zkit.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed66: {
    name: "Prism Zkit III",
    waterDrain: 0.3,
    nutrientDrain: 0.3,
    image: "seeds/seed66.png",
    flowerImage: "flowers/SZN2F_064_Prism-Zkit.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed67: {
    name: "Prism Zkit IV",
    waterDrain: 0.3,
    nutrientDrain: 0.3,
    image: "seeds/seed67.png",
    flowerImage: "flowers/SZN2F_064_Prism-Zkit.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed68: {
    name: "Prism Zkit V",
    waterDrain: 0.3,
    nutrientDrain: 0.2,
    image: "seeds/seed68.png",
    flowerImage: "flowers/SZN2F_064_Prism-Zkit.png",
    desc: "TIER 3 GEM: slow drain.",
  },
  seed69: {
    name: "Prism Zkit VI",
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
    // 8% chance for nutrient boost, 5% for raiders
    var rand = Math.random();
    if (rand < 0.08 && !nutrientActive) {
      showNutrientEvent();
    } else if (rand < 0.13) {
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

// Map different pest types to emoji sets - all bug emojis
const pestEmojiMap = {
  pest: ["🐛", "🐜", "🐝", "🦗", "🕷️", "🐞"],
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
      @keyframes pestFall {
        0% {
          top: -40px;
          opacity: 0;
        }
        5% {
          opacity: 1;
        }
        100% {
          top: 100%;
          opacity: 1;
        }
      }
      @keyframes pestSway {
        0%, 100% {
          margin-left: 0;
        }
        50% {
          margin-left: 15px;
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

// Make showPestEvent and testPest globally accessible (development only)
if (typeof CURRENT_ENV !== 'undefined' && CURRENT_ENV.DEBUG) {
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
}

function startPestMinigame(
  type = "pest",
  { count = 1, duration = 8000, pestType = null } = {}
) {
  // Inject CSS keyframes for pest animations BEFORE spawning
  if (!document.getElementById("pestAnimations")) {
    const style = document.createElement("style");
    style.id = "pestAnimations";
    style.textContent = `
      @keyframes pestFall {
        0% {
          top: -40px;
          opacity: 0;
        }
        5% {
          opacity: 1;
        }
        100% {
          top: 100%;
          opacity: 1;
        }
      }
      @keyframes pestSway {
        0%, 100% {
          margin-left: 0;
        }
        50% {
          margin-left: 15px;
        }
      }
    `;
    document.head.appendChild(style);
  }

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
  const maxSpawn = Math.floor(Math.random() * 8) + 4; // Random 4-11 pests

  function spawnPest() {
    if (totalSpawned >= maxSpawn || !pestUIActive) return;
    totalSpawned++;
    activePests++;

    const pest = document.createElement("span");
    pest.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    console.log("Spawning pest emoji", pest.textContent);

    // Start from top, random X position
    const startX = Math.random() * (width - 40);
    const fallDuration = 4000 + Math.random() * 2000; // 4-6 seconds to fall

    pest.style.cssText = `
      position: absolute;
      left: ${startX}px;
      top: -40px;
      font-size: clamp(22px, 4vw, 38px);
      cursor: pointer;
      user-select: none;
      pointer-events: auto;
      z-index: 10000;
      animation: pestFall ${fallDuration}ms linear forwards, pestSway 0.8s ease-in-out infinite;
    `;

    // Direction for sway (left or right bias)
    const swayDirection = Math.random() > 0.5 ? 1 : -1;
    pest.dataset.swayDir = swayDirection;
    pest.dataset.startX = startX;

    pest.addEventListener("click", () => {
      if (!pest.parentNode) return; // Already removed

      swatted++;
      activePests--;

      // Show "SWAT!" feedback
      showSwatFeedback(pest);

      pest.style.animation = "none";
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

    // Bug missed when it reaches the bottom (animation ends)
    pest.addEventListener("animationend", (e) => {
      if (e.animationName === "pestFall" && pest.parentNode) {
        missed++;
        activePests--;
        pest.style.opacity = "0";
        setTimeout(() => {
          if (pest.parentNode) pest.remove();
        }, 200);
      }
    });
  }

  // Wiggle animation is now handled by CSS (pestSway keyframes)
  // Just clear any existing interval
  clearInterval(pestWiggleInterval);

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
    pestOverlayEl.innerHTML = "";
  }

  clearInterval(pestWiggleInterval);
  clearTimeout(pestTimerId);
  pestUIActive = false;

  // Calculate missed as total - swatted (more reliable than animation-based counting)
  const actualMissed = total - swatted;
  const successRate = swatted / Math.max(1, total);
  const missedRate = actualMissed / Math.max(1, total);

  // Calculate penalty based on missed bugs (each missed bug = 2.5% penalty, max 25%)
  let penaltyPercent = 0;
  if (actualMissed > 0) {
    penaltyPercent = Math.min(25, actualMissed * 2.5);
    penaltyPercent = Math.round(penaltyPercent);

    if (type === "pest") {
      plant.pestPenalty *= 1 - (penaltyPercent / 100);
    }
  }

  // Show results popup over the plant container
  showPestResultsPopup(swatted, total, penaltyPercent, successRate);

  // Also add to event log
  if (missed === 0 && successRate > 0.8) {
    addEventToLog("Excellent pest control!", "info");
  } else if (penaltyPercent > 0) {
    addEventToLog(`Pests dealt with. -${penaltyPercent}% potency.`, "warning");
  } else {
    addEventToLog("Pest situation resolved.", "info");
  }

  pestActive = false;
}

// Show a popup with pest mini-game results
function showPestResultsPopup(swatted, total, penaltyPercent, successRate) {
  const plantContainer = document.querySelector(".plantImageContainer");
  if (!plantContainer) return;

  // Create popup element
  const popup = document.createElement("div");
  popup.className = "pestResultsPopup";

  // Determine result message and color
  let resultText, resultClass;
  if (successRate >= 0.9) {
    resultText = "PERFECT!";
    resultClass = "perfect";
  } else if (successRate >= 0.7) {
    resultText = "GOOD!";
    resultClass = "good";
  } else if (successRate >= 0.5) {
    resultText = "OK";
    resultClass = "ok";
  } else {
    resultText = "OUCH!";
    resultClass = "bad";
  }

  popup.innerHTML = `
    <div class="pestResultTitle ${resultClass}">${resultText}</div>
    <div class="pestResultStats">
      <div class="pestResultRow">${swatted}/${total} SWATTED</div>
      ${penaltyPercent > 0 ? `<div class="pestResultRow penalty">-${penaltyPercent}% POTENCY</div>` : `<div class="pestResultRow bonus">NO DAMAGE!</div>`}
    </div>
  `;

  // Add styles if not already added
  if (!document.getElementById("pestResultsStyles")) {
    const style = document.createElement("style");
    style.id = "pestResultsStyles";
    style.textContent = `
      .pestResultsPopup {
        position: absolute;
        top: 8px;
        left: 8px;
        width: 40%;
        background: #000000;
        border: 2px solid #00ff41;
        border-radius: 6px;
        padding: 6px;
        z-index: 10001;
        text-align: center;
        font-family: 'Press Start 2P', monospace;
        animation: pestPopupIn 0.4s ease-out forwards;
        box-shadow: 0 0 15px rgba(0, 255, 65, 0.5);
      }
      
      @keyframes pestPopupIn {
        0% {
          transform: scale(0.5);
          opacity: 0;
        }
        50% {
          transform: scale(1.05);
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      
      @keyframes pestPopupOut {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        100% {
          transform: scale(0.5);
          opacity: 0;
        }
      }
      
      .pestResultTitle {
        font-size: 0.9em;
        margin-bottom: 8px;
        text-shadow: 0 0 10px currentColor;
      }
      
      .pestResultTitle.perfect { color: #00ff41; }
      .pestResultTitle.good { color: #7fff00; }
      .pestResultTitle.ok { color: #ffd700; }
      .pestResultTitle.bad { color: #ff4444; }
      
      .pestResultStats {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .pestResultRow {
        font-size: 0.5em;
        color: #ffffff;
      }
      
      .pestResultRow.penalty {
        color: #ff4444;
      }
      
      .pestResultRow.bonus {
        color: #00ff41;
      }
    `;
    document.head.appendChild(style);
  }

  // Add to plant container
  plantContainer.appendChild(popup);

  // Hide overlay now that popup is showing
  if (pestOverlayEl) {
    pestOverlayEl.style.display = "none";
  }

  // Remove popup after delay
  setTimeout(() => {
    popup.style.animation = "pestPopupOut 0.3s ease-out forwards";
    setTimeout(() => {
      if (popup.parentNode) popup.remove();
    }, 300);
  }, 2500);
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
  // Don't spawn if one is already active
  if (nutrientActive) return;

  nutrientActive = true;
  addEventToLog("Nutrient bubble incoming! Click to collect!", "info");

  // Weighted random: 70% chance for 1-3%, 20% for 3-6%, 10% for 8-15%
  let boostPercent;
  const roll = Math.random();
  if (roll < 0.85) {
    boostPercent = Math.floor(Math.random() * 3) + 1; // 1-3% (85% chance)
  } else if (roll < 0.97) {
    boostPercent = Math.floor(Math.random() * 3) + 4; // 4-6% (12% chance)
  } else {
    boostPercent = Math.floor(Math.random() * 5) + 10; // 10-15% (3% chance - rare!)
  }

  // Create the nutrient bubble
  spawnNutrientBubble(boostPercent);
}

function spawnNutrientBubble(boostPercent) {
  const plantContainer = document.querySelector(".plantImageContainer");
  if (!plantContainer) {
    nutrientActive = false;
    return;
  }

  // Clean up any existing bubbles first
  const existingBubbles = plantContainer.querySelectorAll(".nutrient-bubble");
  existingBubbles.forEach(b => b.remove());

  // Create bubble element
  const bubble = document.createElement("div");
  bubble.className = "nutrient-bubble";
  bubble.innerHTML = `+${boostPercent}%`;
  bubble.dataset.boost = boostPercent;

  // Random horizontal position
  const containerWidth = plantContainer.offsetWidth;
  const randomX = Math.floor(Math.random() * (containerWidth - 60)) + 10;
  bubble.style.left = `${randomX}px`;
  bubble.style.bottom = "-50px";

  // Higher boost = faster rise (faster overall: 2-4 seconds)
  const riseDuration = Math.max(2, 4 - (boostPercent * 0.15));
  bubble.style.animationDuration = `${riseDuration}s, 0.8s`;

  // Click handler
  bubble.onclick = function (e) {
    e.stopPropagation();
    collectNutrientBubble(bubble, boostPercent, riseDuration);
  };

  // Add styles if not present
  if (!document.getElementById("nutrientBubbleStyles")) {
    const style = document.createElement("style");
    style.id = "nutrientBubbleStyles";
    style.textContent = `
      .nutrient-bubble {
        position: absolute;
        width: 50px;
        height: 50px;
        background: radial-gradient(circle at 30% 30%, #4da6ff, #0066cc);
        border: 3px solid #00ccff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Press Start 2P', monospace;
        font-size: 0.5em;
        color: white;
        text-shadow: 0 0 5px #000;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 0 20px rgba(0, 200, 255, 0.6), inset 0 -10px 20px rgba(0,0,0,0.3);
        animation: bubbleRise 6s linear forwards, bubbleWobble 0.8s ease-in-out infinite;
      }
      
      .nutrient-bubble:hover {
        transform: scale(1.2);
        box-shadow: 0 0 30px rgba(0, 200, 255, 0.9), inset 0 -10px 20px rgba(0,0,0,0.3);
      }
      
      @keyframes bubbleRise {
        0% { bottom: -50px; }
        100% { bottom: calc(100% + 50px); }
      }
      
      @keyframes bubbleWobble {
        0%, 100% { margin-left: -5px; }
        50% { margin-left: 5px; }
      }
      
      .nutrient-bubble.collected {
        animation: bubblePop 0.3s ease-out forwards !important;
      }
      
      @keyframes bubblePop {
        0% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.5); opacity: 0.5; }
        100% { transform: scale(0); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  plantContainer.appendChild(bubble);

  // Remove bubble after animation completes (missed)
  setTimeout(function () {
    if (bubble.parentNode && !bubble.classList.contains("collected")) {
      bubble.remove();
      addEventToLog("Nutrient bubble escaped!", "warning");
      nutrientActive = false;
    }
  }, riseDuration * 1000);
}

function collectNutrientBubble(bubble, boostPercent, fallDuration) {
  if (bubble.classList.contains("collected")) return;

  bubble.classList.add("collected");

  // Apply the boost
  plant.potencyBoost *= 1 + boostPercent / 100;
  addEventToLog(`Nutrient boost collected! +${boostPercent}% Potency!`, "info");

  // Show collection feedback
  showNutrientCollectedPopup(boostPercent);

  // Remove bubble and reset state immediately
  if (bubble.parentNode) bubble.remove();
  nutrientActive = false;
}

function showNutrientCollectedPopup(boostPercent) {
  const plantContainer = document.querySelector(".plantImageContainer");
  if (!plantContainer) return;

  const popup = document.createElement("div");
  popup.className = "nutrientCollectedPopup";
  popup.innerHTML = `
    <div class="nutrientTitle">COLLECTED!</div>
    <div class="nutrientBoost">+${boostPercent}% POTENCY</div>
  `;

  // Add styles if not present
  if (!document.getElementById("nutrientPopupStyles")) {
    const style = document.createElement("style");
    style.id = "nutrientPopupStyles";
    style.textContent = `
      .nutrientCollectedPopup {
        position: absolute;
        top: 8px;
        left: 8px;
        width: 40%;
        background: #000000;
        border: 2px solid #00ccff;
        border-radius: 6px;
        padding: 6px;
        z-index: 10001;
        text-align: center;
        font-family: 'Press Start 2P', monospace;
        animation: nutrientPopIn 0.4s ease-out forwards;
        box-shadow: 0 0 15px rgba(0, 200, 255, 0.5);
      }
      
      @keyframes nutrientPopIn {
        0% { transform: scale(0.5); opacity: 0; }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); opacity: 1; }
      }
      
      .nutrientTitle {
        font-size: 0.8em;
        color: #00ccff;
        margin-bottom: 5px;
        text-shadow: 0 0 10px #00ccff;
      }
      
      .nutrientBoost {
        font-size: 0.6em;
        color: #00ff41;
      }
    `;
    document.head.appendChild(style);
  }

  plantContainer.appendChild(popup);

  // Close popup after 800ms (faster)
  setTimeout(function () {
    popup.style.animation = "nutrientPopIn 0.2s ease-out reverse forwards";
    setTimeout(function () {
      if (popup.parentNode) popup.remove();
    }, 200);
  }, 800);
}
