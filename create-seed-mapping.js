// Create proper seed mapping preserving original stats where possible
const flowerData = [
  { num: 1, name: "Sailor Sktlz", file: "SZN2F_001_Sailor_Sktlz.png" },
  { num: 2, name: "NiftyNugz", file: "SZN2F_002_NiftyNugz.png" },
  { num: 3, name: "PNK Panther", file: "SZN2F_003_PNK_Panther.png" },
  { num: 4, name: "Ember-Sherb", file: "SZN2F_004_Ember-Sherb.png" },
  { num: 5, name: "Burzt", file: "SZN2F_005_Burzt.png" },
  { num: 6, name: "Vader-BreathX2", file: "SZN2F_006_Vader-BreathX2.png" },
  { num: 7, name: "Hufflepuffz", file: "SZN2F_007_Hufflepuffz.png" },
  { num: 8, name: "Grillz-Glue", file: "SZN2F_008_Grillz-Glue.png" },
  { num: 9, name: "Dripsicle", file: "SZN2F_009_Dripsicle.png" },
  { num: 10, name: "HotSauce", file: "SZN2F_010_HotSauce.png" },
  { num: 11, name: "Grillz-Gas", file: "SZN2F_011_Grillz-Gas.png" },
  { num: 12, name: "Gorilla-Grillz", file: "SZN2F_012_Gorilla-Grillz.png" },
  { num: 13, name: "Wisp-Widow", file: "SZN2F_013_Wisp-Widow.png" },
  { num: 14, name: "Pixie-Sherb", file: "SZN2F_014_Pixie-Sherb.png" },
  { num: 15, name: "Dunk-OG", file: "SZN2F_015_Dunk-OG.png" },
  { num: 16, name: "Red-Croptober", file: "SZN2F_016_Red-Croptober.png" },
  { num: 17, name: "Fuego42", file: "SZN2F_017_Fuego42.png" },
  { num: 18, name: "DragonScale", file: "SZN2F_018_DragonScale.png" },
  { num: 19, name: "Teslaterp", file: "SZN2F_019_Teslaterp.png" },
  { num: 20, name: "SkelliDream", file: "SZN2F_020_SkelliDream.png" },
  { num: 21, name: "Infernal-Gelato", file: "SZN2F_021_Infernal-Gelato.png" },
  { num: 22, name: "SlimeCap", file: "SZN2F_022_SlimeCap.png" },
  { num: 23, name: "NeoCaps", file: "SZN2F_023_NeoCaps.png" },
  { num: 25, name: "Ice Walker", file: "SZN2F_025_Ice Walker.png" },
  { num: 26, name: "Moon-Bat-Haze", file: "SZN2F_026_Moon-Bat-Haze.png" },
  { num: 27, name: "BlueGrim", file: "SZN2F_027_BlueGrim.png" },
  { num: 29, name: "Croiscrumble", file: "SZN2F_029_Croiscrumble.png" },
  { num: 30, name: "Dojo-Diesel", file: "SZN2F_030_Dojo-Diesel.png" },
  { num: 31, name: "Blutane", file: "SZN2F_031_Blutane.png" },
  { num: 32, name: "CthulKush", file: "SZN2F_032_CthulKush.png" },
  { num: 34, name: "BubblRntz", file: "SZN2F_034_BubblRntz.png" },
  { num: 35, name: "JediKush", file: "SZN2F_035_JediKush.png" },
  { num: 36, name: "Pepe-OG", file: "SZN2F_036_Pepe-OG.png" },
  { num: 37, name: "AquaTort-G41", file: "SZN2F_037_AquaTort-G41.png" },
  { num: 38, name: "VoltLa", file: "SZN2F_038_VoltLa.png" },
  { num: 39, name: "PandaManiaOG", file: "SZN2F_039_PandaManiaOG.png" },
  { num: 40, name: "SKFZGMO", file: "SZN2F_040_SKFZGMO.png" },
  { num: 43, name: "PassionPanda", file: "SZN2F_043_PassionPanda.png" },
  { num: 45, name: "Detox", file: "SZN2F_045_Detox.png" },
  { num: 47, name: "Grillz-Cookies", file: "SZN2F_047_Grillz-Cookies.png" },
  { num: 48, name: "PurpleHeartz", file: "SZN2F_048_PurpleHeartz.png" },
  { num: 49, name: "Lyle-OG", file: "SZN2F_049_Lyle-OG.png" },
  { num: 49, name: "Lyle-Purp", file: "SZN2F_049_Lyle-Purp.png" },
  { num: 50, name: "KuromiKush", file: "SZN2F_050_KuromiKush.png" },
  { num: 51, name: "HelloNuggy", file: "SZN2F_051_HelloNuggy.png" },
  { num: 54, name: "SKFZ Lights", file: "SZN2F_054_SKFZ Lights.png" },
  { num: 55, name: "PMFUNK", file: "SZN2F_055_PMFUNK.png" },
  { num: 56, name: "EthJack", file: "SZN2F_056_EthJack.png" },
  { num: 57, name: "BioPepe", file: "SZN2F_057_BioPepe.png" },
  { num: 58, name: "DOA47", file: "SZN2F_058_DOA47.png" },
  { num: 61, name: "GlizzyGoo", file: "SZN2F_061_GlizzyGoo.png" },
  { num: 62, name: "GrapeAPE", file: "SZN2F_062_GrapeAPE.png" },
  { num: 63, name: "RedOne", file: "SZN2F_063_RedOne.png" },
  { num: 64, name: "Prism-Zkit", file: "SZN2F_064_Prism-Zkit.png" },
  { num: 70, name: "HoloGramz", file: "SZN2F_070_HoloGramz.png" },
  { num: 72, name: "Fruityloopz", file: "SZN2F_072_Fruityloopz.png" },
  { num: 74, name: "PlasmaRoot-Cake", file: "SZN2F_074_PlasmaRoot-Cake.png" },
  { num: 76, name: "QuantumBud-Sherb", file: "SZN2F_076_QuantumBud-Sherb.png" },
  { num: 77, name: "Berries NCream", file: "SZN2F_077_Berries NCream.png" },
  { num: 79, name: "Sumi-sensi", file: "SZN2F_079_Sumi-sensi.png" },
  { num: 81, name: "Area51", file: "SZN2F_081_Area51.png" },
  { num: 82, name: "BoneBoof", file: "SZN2F_082_BoneBoof.png" },
  { num: 83, name: "Sundae-Driver", file: "SZN2F_083_Sundae-Driver.png" },
  { num: 85, name: "Moon-Bat-OG", file: "SZN2F_085_Moon-Bat-OG.png" },
  { num: 87, name: "BlitzdCoin", file: "SZN2F_087_BlitzdCoin.png" },
  { num: 88, name: "MontaukMilk", file: "SZN2F_088_MontaukMilk.png" },
  { num: 90, name: "Heatsync", file: "SZN2F_90_Heatsync.png" },
  { num: 91, name: "Fatboi", file: "SZN2F_91_Fatboi.png" }
];

// Original seed data to preserve stats/descriptions
const originalSeeds = {
  1: { name: "Crypt Cookies", waterDrain: 0.6, nutrientDrain: 0.5, desc: "Balanced, classic strain." },
  2: { name: "Slime 33", waterDrain: 0.5, nutrientDrain: 0.7, desc: "Potent, nutrient-hungry." },
  3: { name: "Jet Fuel", waterDrain: 0.4, nutrientDrain: 0.4, desc: "Resilient, fast finisher." },
  4: { name: "Rotjaw", waterDrain: 0.9, nutrientDrain: 0.9, desc: "TIER 1 STINKER: drains fast!" },
  5: { name: "Vader Breath", waterDrain: 0.3, nutrientDrain: 0.3, desc: "TIER 1 GEM: slow drain." },
  6: { name: "Lazy Bones", waterDrain: 0.7, nutrientDrain: 0.6, desc: "Mellow hybrid, mid stats." },
  7: { name: "Gloomberry", waterDrain: 0.4, nutrientDrain: 0.8, desc: "Dark, juicy, needs lots of nutrients." },
  8: { name: "Phantom Fruit", waterDrain: 0.5, nutrientDrain: 0.4, desc: "Ethereal, light on resources." },
  9: { name: "Diesel Drip", waterDrain: 0.8, nutrientDrain: 0.5, desc: "Heavy drinker, mellow yield." },
  10: { name: "Hotdog Water", waterDrain: 0.6, nutrientDrain: 0.8, desc: "TIER 2 STINKER: foul but weirdly dank." },
  11: { name: "Sundaez", waterDrain: 0.3, nutrientDrain: 0.6, desc: "TIER 2 GEM: cool and refreshing." },
  12: { name: "Skele OG", waterDrain: 0.7, nutrientDrain: 0.4, desc: "PRIZE 1: Tough, dries out quickly." },
  13: { name: "Marrow Melon", waterDrain: 0.5, nutrientDrain: 0.5, desc: "Juicy, balanced, easy to grow." },
  14: { name: "Pineal Punch", waterDrain: 0.6, nutrientDrain: 0.3, desc: "Hardy, low nutrient needs." },
  15: { name: "Ghoul Gas", waterDrain: 0.8, nutrientDrain: 0.7, desc: "TIER 2 STINKER: wild, gassy, unpredictable." },
  16: { name: "Tomb Tangle", waterDrain: 0.4, nutrientDrain: 0.6, desc: "Twisted, moderate needs." },
  17: { name: "Wraithwreck", waterDrain: 0.5, nutrientDrain: 0.8, desc: "Ghostly, nutrient-hungry." },
  18: { name: "Grillz Glue", waterDrain: 0.7, nutrientDrain: 0.7, desc: "PRIZE 2: Blinged out, sticky, hybrid king." },
  19: { name: "Grave Grape", waterDrain: 0.2, nutrientDrain: 0.3, desc: "TIER 3 GEM: sweet, easy, low drain." },
  20: { name: "Sour Spectre", waterDrain: 0.4, nutrientDrain: 0.4, desc: "Tart sativa, mid stats." },
  21: { name: "Ghastleaf", waterDrain: 0.5, nutrientDrain: 0.5, desc: "Eerie, balanced needs." },
  22: { name: "Eth Jack", waterDrain: 0.3, nutrientDrain: 0.6, desc: "Energizing, classic haze." },
  23: { name: "Pepe Zkittles", waterDrain: 0.6, nutrientDrain: 0.4, desc: "Loud, sweet, dries out." },
  24: { name: "Bitbudz", waterDrain: 0.2, nutrientDrain: 0.8, desc: "TIER 3 STINKER: corn from the crypt." },
  25: { name: "Wet Dream", waterDrain: 0.7, nutrientDrain: 0.2, desc: "Fast finisher, dries quick." },
  26: { name: "Phantom Pheno", waterDrain: 0.4, nutrientDrain: 0.5, desc: "Rare, small but persistent." },
  27: { name: "Hauntberry", waterDrain: 0.5, nutrientDrain: 0.3, desc: "Sweet, but spooky." },
  28: { name: "Panda Puff", waterDrain: 0.6, nutrientDrain: 0.6, desc: "PRIZE 3 STINKER: Soft, frosty, zen vibes." },
  29: { name: "Moonbat OG", waterDrain: 0.3, nutrientDrain: 0.4, desc: "TIER 3 GEM: Light and breezy." },
  30: { name: "Doom Daisy", waterDrain: 0.5, nutrientDrain: 0.5, desc: "Pretty, but deadly." },
  31: { name: "Skele Skunk", waterDrain: 0.4, nutrientDrain: 0.6, desc: "PRIZE 5: Pops up everywhere." }
};

// Create flower map
const flowerMap = {};
flowerData.forEach(f => {
  if (!flowerMap[f.num]) flowerMap[f.num] = [];
  flowerMap[f.num].push(f);
});

// Get flower for seed number
function getFlower(seedNum) {
  if (flowerMap[seedNum] && flowerMap[seedNum].length > 0) {
    return flowerMap[seedNum][0];
  }
  // Find closest
  const nums = Object.keys(flowerMap).map(Number).sort((a,b) => a-b);
  let closest = nums[0];
  for (const n of nums) {
    if (n <= seedNum) closest = n;
    else break;
  }
  return flowerMap[closest] ? flowerMap[closest][0] : flowerData[0];
}

let output = "// Seed properties: 69 seeds organized in 3 tiers with strategic \"stinkers\"\n";
output += "const seedProperties = {\n";

for (let i = 1; i <= 69; i++) {
  const flower = getFlower(i);
  const original = originalSeeds[i];
  const tier = i <= 6 ? 1 : i <= 18 ? 2 : 3;
  
  if (i === 1) output += "  // TIER 1 (OK) - Basic seeds, some stinkers\n";
  if (i === 7) output += "\n  // TIER 2 (GOOD) - Better seeds, some stinkers\n";
  if (i === 19) output += "\n  // TIER 3 (BEST) - Premium seeds, some stinkers\n";
  
  output += `  seed${i}: {\n`;
  
  // Use flower name from filename (extracted from SZN2F_XXX_PlantName pattern)
  const seedName = flower.name;
  output += `    name: "${seedName}",\n`;
  
  // Preserve original stats or generate new ones
  if (original) {
    output += `    waterDrain: ${original.waterDrain},\n`;
    output += `    nutrientDrain: ${original.nutrientDrain},\n`;
  } else {
    const wd = (0.3 + Math.random() * 0.4).toFixed(1);
    const nd = (0.3 + Math.random() * 0.4).toFixed(1);
    output += `    waterDrain: ${wd},\n`;
    output += `    nutrientDrain: ${nd},\n`;
  }
  
  output += `    image: "seeds/seed${i}.png",\n`;
  output += `    flowerImage: "flowers/${flower.file}",\n`;
  
  // Preserve original desc or generate
  if (original) {
    output += `    desc: "${original.desc}",\n`;
  } else {
    const desc = "Balanced, classic strain.";
    output += `    desc: "${desc}",\n`;
  }
  
  output += `  },\n`;
}

output += "};\n";
console.log(output);

