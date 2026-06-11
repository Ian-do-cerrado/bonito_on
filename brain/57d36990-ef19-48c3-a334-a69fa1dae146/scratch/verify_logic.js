const { getFriendlyTableName } = require('./lib/table-name-map');
const { translateSeason } = require('./lib/dynamic-translations');

const testCases = [
  "BT 2026",
  "AT 2026",
  "BT MS 2026",
  "SUL-MATO BT",
  "BAIXA MELHOR IDADE",
  "AT PROMO",
  "GP 30 BT",
  "BONITENSE BT",
  "TAB BT MS 2026"
];

console.log("--- Testing getFriendlyTableName (PT) ---");
testCases.forEach(input => {
  const friendly = getFriendlyTableName(input);
  console.log(`Input: "${input}" -> Friendly: "${friendly}"`);
});

console.log("\n--- Testing translateSeason (EN) ---");
testCases.forEach(input => {
  const friendly = getFriendlyTableName(input);
  const translated = translateSeason(friendly, 'en');
  console.log(`Friendly (PT): "${friendly}" -> Translated (EN): "${translated}"`);
});

console.log("\n--- Testing translateSeason (ES) ---");
testCases.forEach(input => {
  const friendly = getFriendlyTableName(input);
  const translated = translateSeason(friendly, 'es');
  console.log(`Friendly (PT): "${friendly}" -> Translated (ES): "${translated}"`);
});
