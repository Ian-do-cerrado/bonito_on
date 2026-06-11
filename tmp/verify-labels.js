
// Manual mock of getFriendlyTableName logic for verification
function getFriendlyTableName(raw, temporadaBD) {
  const upper = (raw ?? "").toUpperCase().trim()
  if (!upper && !temporadaBD) return "Preço padrão"

  let seasonLabel = "Alta Temporada"
  
  if (temporadaBD === "BT") {
    seasonLabel = "Baixa Temporada"
  } else if (temporadaBD === "AT") {
    seasonLabel = "Alta Temporada"
  } else {
    // Fallback logic check
    const isBaixa = /\bBT\b|\bBAIXA\b/i.test(upper)
    const isAlta = /\bAT\b|\bALTA\b/i.test(upper)
    
    if (isBaixa) {
      seasonLabel = "Baixa Temporada"
    } else if (isAlta) {
      seasonLabel = "Alta Temporada"
    }
  }

  const tags = []
  if (upper.includes("MS") || upper.includes("SUL-MATO") || upper.includes("SUL MATO")) {
    tags.push("Sul-mato-grossense")
  }
  if (upper.includes("BONITENSE")) {
    tags.push("Bonitense")
  }
  
  if (tags.length > 0) {
    return `${tags.join(" / ")} · ${seasonLabel}`
  }

  return seasonLabel
}

const testCases = [
  { name: "2026 - BONITENSE", temp: "BT", expected: "Bonitense · Baixa Temporada" },
  { name: "SUL-MATO-GROSSENSE", temp: "BT", expected: "Sul-mato-grossense · Baixa Temporada" },
  { name: "SUL-MATO-GROSSENSE", temp: "AT", expected: "Sul-mato-grossense · Alta Temporada" },
  { name: "Rio da Prata Alta", temp: null, expected: "Alta Temporada" },
  { name: "Rio da Prata BT", temp: null, expected: "Baixa Temporada" },
  { name: "Porto da Ilha Sul Mato", temp: "BT", expected: "Sul-mato-grossense · Baixa Temporada" },
  { name: "4. Sul Mato Grossense BT", temp: "BT", expected: "Sul-mato-grossense · Baixa Temporada" },
  { name: "Tarifa Bonitense", temp: "BT", expected: "Bonitense · Baixa Temporada" },
  { name: "SUL-MATO", temp: "BT", expected: "Sul-mato-grossense · Baixa Temporada" }
];

let failed = false;
testCases.forEach(c => {
  const result = getFriendlyTableName(c.name, c.temp);
  if (result !== c.expected) {
    console.error(`FAILED: "${c.name}" (temp: ${c.temp}) -> Expected "${c.expected}", got "${result}"`);
    failed = true;
  } else {
    console.log(`PASSED: "${c.name}" (temp: ${c.temp}) -> "${result}"`);
  }
});

if (failed) process.exit(1);
else console.log("\nAll tests passed successfully!");
