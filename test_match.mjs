import fs from 'fs';

const testRows = [{
  "atrativo": "Porto da Ilha",
  "atividade": "BIKE BOAT",
  "descricao": "",
  "nome_tabela_preco": "BIKE 2026 BT",
  "vig_inicio": "2026-01-01",
  "vig_fim": "2026-06-30",
  "publico_pax": 130,
  "publico_chd": 100,
  "publico_chd_free": 0,
  "publico_crt": 0,
  "atrativo_pax": 97.5,
  "atrativo_chd": 75,
  "atrativo_chd_free": 0,
  "atrativo_crt": 0
}];

const tourSlug = "bike-boat-eco-park-porto-da-ilha";
const tourTitle = "Bike Boat Eco Park Porto Da Ilha";

function createSlug(str) {
  if (!str) return ""
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")
}

function getPrice(row, suffix) {
  const pub = row[`publico_${suffix}`]
  const atr = row[`atrativo_${suffix}`]
  return pub ?? atr ?? null
}

function isNormalTable(nomeTabela) {
    if (!nomeTabela) return false
    const t = nomeTabela.toUpperCase()
    return t.includes("ALTA") || t.includes("FERIADO") || t.includes("NORMAL") || t.includes("2026")
}

function toDisplayRow(row, tourSlug) {
  return {
    vigInicio: row.vig_inicio ?? "",
    vigFim: row.vig_fim ?? "",
    nomeTabela: row.nome_tabela_preco,
    atrativo: row.atrativo,
    atividade: row.atividade,
    nomeTabelaAmigavel: row.nome_tabela_preco,
    isNormal: isNormalTable(row.nome_tabela_preco),
    adulto: getPrice(row, "pax"),
    crianca: getPrice(row, "chd"),
    tarifaMs: getPrice(row, "crt"),
    garupaAdulto: undefined,
    garupaCrianca: undefined,
  }
}

function matchesTour(row, tourSlug, tourTitleSlug) {
  const atividade = row.atividade ?? row.atrativo ?? ""
  const atrativo = row.atrativo ?? ""
  const atrSlug = createSlug(atrativo)
  const ativSlug = createSlug(atividade)

  if (tourSlug.includes("bike-boat") && tourSlug.includes("porto-da-ilha")) {
    if (!atrSlug.includes("porto-da-ilha")) return false
  }

  const atrativoMatch = tourSlug.includes(atrSlug) || atrSlug.includes(tourSlug)
  const atividadeMatch = tourSlug.includes(ativSlug) || ativSlug.includes(tourSlug)
  
  if (atrativo.trim() && atividade.trim()) {
    return atrativoMatch && atividadeMatch
  }
  return atrativoMatch || atividadeMatch
}

function getToursPricesMock() {
   const titleSlug = createSlug(tourTitle)
   
   // 1. match rows
   const matchedRows = testRows.filter(r => matchesTour(r, tourSlug, titleSlug));
   console.log("Matched rows:", matchedRows.length);
   
   // 2. map to display rows
   const displayRows = matchedRows.map(r => toDisplayRow(r, tourSlug));
   console.log("Display rows:", displayRows);
}

getToursPricesMock();
