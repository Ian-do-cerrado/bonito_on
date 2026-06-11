function getDisplayPrice(tour) {
  // 1. Prioridade máxima: Cálculo oficial da tabela (BTMS Live)
  const main = tour.prices?.mainPriceRow
  if (main) {
    const adulto = main.adulto ?? main.garupaAdulto
    if (adulto != null && adulto > 0) return adulto
  }

  // 2. Fallack: preço manual fixado no painel administrativo
  if (tour.price && tour.price > 0) return tour.price

  // 3. Fallback final: preço mínimo da tabela
  return tour.prices?.precoMinimo ?? 0
}

const simulationTour = {
  slug: "flutuacao-abismo-anhumas",
  price: 997, // Preço "sujo" do banco de dados
  prices: {
    mainPriceRow: {
        adulto: 1598, // Cálculo LIVE correto do BTMS
        atividade: "Abismo Flutuação"
    },
    precoMinimo: 997
  }
};

const result = getDisplayPrice(simulationTour);
console.log("Input Price (DB):", simulationTour.price);
console.log("Calculated Price (Live):", simulationTour.prices.mainPriceRow.adulto);
console.log("Result (getDisplayPrice):", result);

if (result === 1598) {
  console.log("✓ SUCESSO: O preço agora prioriza o cálculo oficial (1598).");
} else {
  console.log("X FALHA: O sistema ainda prioriza o valor antigo (997).");
}
