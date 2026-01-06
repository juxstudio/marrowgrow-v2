// Script to generate complete seed data from flower files
const fs = require("fs");
const path = require("path");

const flowersDir = path.join(__dirname, "img", "selections", "flowers");
const files = fs
  .readdirSync(flowersDir)
  .filter((f) => f.startsWith("SZN2F_") && f.endsWith(".png"))
  .map((f) => {
    const match = f.match(/SZN2F_(\d+)_(.+)\.png/);
    if (match) {
      const num = parseInt(match[1]);
      const name = match[2].replace(/_/g, " ");
      return { num, name, filename: f };
    }
    return null;
  })
  .filter(Boolean)
  .sort((a, b) => a.num - b.num);

// Create a map of flower number to flower data
const flowerMap = {};
files.forEach((f) => {
  if (!flowerMap[f.num]) {
    flowerMap[f.num] = [];
  }
  flowerMap[f.num].push(f);
});

// Generate seed entries for seeds 1-69
let output =
  '// Seed properties: 69 seeds organized in 3 tiers with strategic "stinkers"\n';
output += "const seedProperties = {\n";

// Helper function to generate random stats
function getRandomStats(tier) {
  const baseWater = tier === 1 ? 0.5 : tier === 2 ? 0.4 : 0.3;
  const baseNutrient = tier === 1 ? 0.5 : tier === 2 ? 0.4 : 0.3;
  const variation = 0.3;

  return {
    waterDrain: Math.max(
      0.2,
      Math.min(0.9, baseWater + (Math.random() - 0.5) * variation)
    ),
    nutrientDrain: Math.max(
      0.2,
      Math.min(0.9, baseNutrient + (Math.random() - 0.5) * variation)
    ),
  };
}

// Helper to get flower for seed number
function getFlowerForSeed(seedNum) {
  // Try exact match first
  if (flowerMap[seedNum] && flowerMap[seedNum].length > 0) {
    return flowerMap[seedNum][0]; // Use first if multiple
  }

  // Find closest available flower
  const availableNums = Object.keys(flowerMap)
    .map(Number)
    .sort((a, b) => a - b);
  let closest = availableNums[0];
  for (const num of availableNums) {
    if (num <= seedNum) {
      closest = num;
    } else {
      break;
    }
  }

  if (flowerMap[closest]) {
    return flowerMap[closest][0];
  }

  // Fallback to first available
  return files[0];
}

// Existing seed names to preserve (if they exist)
const existingNames = {
  1: "Crypt Cookies",
  2: "Slime 33",
  3: "Jet Fuel",
  4: "Rotjaw",
  5: "Vader Breath",
  6: "Lazy Bones",
  7: "Gloomberry",
  8: "Phantom Fruit",
  9: "Diesel Drip",
  10: "Hotdog Water",
  11: "Sundaez",
  12: "Skele OG",
  13: "Marrow Melon",
  14: "Pineal Punch",
  15: "Ghoul Gas",
  16: "Tomb Tangle",
  17: "Wraithwreck",
  18: "Grillz Glue",
  19: "Grave Grape",
  20: "Sour Spectre",
  21: "Ghastleaf",
  22: "Eth Jack",
  23: "Pepe Zkittles",
  24: "Bitbudz",
  25: "Wet Dream",
  26: "Phantom Pheno",
  27: "Hauntberry",
  28: "Panda Puff",
  29: "Moonbat OG",
  30: "Doom Daisy",
  31: "Skele Skunk",
};

// Generate seeds 1-69
for (let i = 1; i <= 69; i++) {
  const flower = getFlowerForSeed(i);
  const tier = i <= 6 ? 1 : i <= 18 ? 2 : 3;
  const stats = getRandomStats(tier);

  // Use existing name if available, otherwise use flower name
  const seedName = existingNames[i] || flower.name;

  // Determine tier comment
  let tierComment = "";
  if (i === 1) tierComment = "  // TIER 1 (OK) - Basic seeds, some stinkers\n";
  if (i === 7)
    tierComment = "\n  // TIER 2 (GOOD) - Better seeds, some stinkers\n";
  if (i === 19)
    tierComment = "\n  // TIER 3 (BEST) - Premium seeds, some stinkers\n";

  output += tierComment;
  output += `  seed${i}: {\n`;
  output += `    name: "${seedName}",\n`;
  output += `    waterDrain: ${stats.waterDrain.toFixed(1)},\n`;
  output += `    nutrientDrain: ${stats.nutrientDrain.toFixed(1)},\n`;
  output += `    image: "seeds/seed${i}.png",\n`;
  output += `    flowerImage: "flowers/${flower.filename}",\n`;

  // Generate description based on stats
  let desc = "";
  if (stats.waterDrain > 0.7 || stats.nutrientDrain > 0.7) {
    desc = `TIER ${tier} STINKER: drains fast!`;
  } else if (stats.waterDrain < 0.4 && stats.nutrientDrain < 0.4) {
    desc = `TIER ${tier} GEM: slow drain.`;
  } else {
    desc = "Balanced, classic strain.";
  }

  output += `    desc: "${desc}",\n`;
  output += `  },\n`;
}

output += "};\n";

console.log(output);

