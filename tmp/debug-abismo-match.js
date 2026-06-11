function createSlug(title) {
  if (!title) return "";
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function nameSimilarity(tourTitle, atividade) {
  const t = createSlug(tourTitle);
  const a = createSlug(atividade);
  if (!a) return 0;
  const tourWords = t.split("-").filter((w) => w.length >= 2);
  const activityWords = a.split("-").filter((w) => w.length >= 2 && !/^\d+$/.test(w));
  if (activityWords.length === 0) return 0;
  let matches = 0;
  for (const aw of activityWords) {
    if (tourWords.some((tw) => tw.includes(aw) || aw.includes(tw))) matches++
  }
  let score = matches / activityWords.length;
  // No código real tem um bônus: if (primaryWord && a.includes(primaryWord)) score += 0.15
  return Math.min(1, score);
}

function matchesTour(row, tourSlug, tourTitle) {
  const tourTitleSlug = createSlug(tourTitle);
  const atividade = row.atividade ?? row.atrativo ?? "";
  const atrativo = row.atrativo ?? "";
  const ativSlug = atividade ? createSlug(atividade) : "";
  const atrSlug = atrativo ? createSlug(atrativo) : "";
  const tourForSimilarity = tourTitleSlug.replace(/-/g, " ");

  const ativSlugInTour = ativSlug && (tourSlug.includes(ativSlug) || tourTitleSlug.includes(ativSlug) || ativSlug.includes(tourSlug));
  const atrSlugInTour = atrSlug && (tourSlug.includes(atrSlug) || tourTitleSlug.includes(atrSlug) || atrSlug.includes(tourSlug));
  const ativSimilarity = atividade ? nameSimilarity(tourForSimilarity, atividade) : 0;
  const atrSimilarity = atrativo ? nameSimilarity(tourForSimilarity, atrativo) : 0;

  const atrativoMatch = atrSlugInTour || atrSimilarity >= 0.25;
  const atividadeMatch = ativSlugInTour || ativSimilarity >= 0.25;

  const ATRATIVOS_MULTI_TOUR = ["abismo-anhumas", "rio-da-prata"];
  const ehMultiTour = ATRATIVOS_MULTI_TOUR.some((a) => tourSlug.includes(a));

  const strongAtrativoMatch = !ehMultiTour && atrSlug && (tourSlug === atrSlug || (atrSlug.length >= 6 && tourSlug.endsWith("-" + atrSlug)));

  console.log(`Checking Atividade: "${atividade}"`);
  console.log(`  ativSlug: ${ativSlug}`);
  console.log(`  ativSlugInTour: ${ativSlugInTour}`);
  console.log(`  ativSimilarity: ${ativSimilarity}`);
  
  if (atrativo.trim() && atividade.trim()) {
    if (strongAtrativoMatch) return true;
    return atrativoMatch && atividadeMatch;
  }
  return atrativoMatch || atividadeMatch;
}

const tourSlug = "flutuacao-abismo-anhumas";
const tourTitle = "Flutuação Abismo Anhumas";

const rows = [
  { atividade: "Abismo Contemplação", atrativo: "Abismo Anhumas" },
  { atividade: "Abismo Flutuação", atrativo: "Abismo Anhumas" },
  { atividade: "Abismo Mergulho Batismo 08 MTS", atrativo: "Abismo Anhumas" }
];

rows.forEach(r => {
  const result = matchesTour(r, tourSlug, tourTitle);
  console.log(`Result: ${result}\n`);
});
