# Tabela `atrativo_atividade_precos`

## Visão geral

A tabela **`atrativo_atividade_precos`** no Supabase armazena **preços de atrativos e atividades** (passeios) de Bonito-MS. Ela é usada pelo fluxo de pré-vendas (chatbot Onofre) para:

- Informar **preços de passeios** conforme a data da viagem do cliente (temporada) e a quantidade de pessoas (adultos/crianças).
- Apoiar a **montagem de sugestões de pacote**, considerando compatibilidade de horário, distância entre atrativos e ordem lógica do roteiro.

---

## Onde fica e como é acessada

| Item | Detalhe |
|------|--------|
| **Banco** | Supabase (projeto usado no fluxo n8n) |
| **Schema** | `public` (padrão) |
| **Nome da tabela** | `atrativo_atividade_precos` |
| **Acesso no fluxo** | Nó **"Buscar preços atrativos (Supabase)"** via REST: `GET /rest/v1/atrativo_atividade_precos?select=*` |

Os dados são carregados em toda execução relevante do fluxo, convertidos em texto (JSON) e enviados ao LLM no campo **DADOS_ATRATIVOS_PRECOS** do prompt, com limite de ~12.000 caracteres.

---

## Uso no fluxo de pré-vendas

1. **Entrada do cliente**  
   O lead informa (ou o sistema já tem): data da viagem, quantidade de adultos, quantidade de crianças e interesse em passeios.

2. **Temporada**  
   O nó **"Calcular temporada (alta/baixa)"** classifica a data em **alta** ou **baixa** temporada (com base na tabela de temporadas do projeto). Essa classificação é usada junto com os preços.

3. **Preços**  
   O assistente (Onofre) usa **DADOS_ATRATIVOS_PRECOS** para:
   - Responder perguntas do tipo “quanto custa o passeio X?”.
   - Dar valores por data (temporada) e por número de adultos/crianças.
   - Não inventar preços: só usar o que está nessa tabela.

4. **Pacotes**  
   O prompt orienta o Onofre a sugerir pacotes usando esses dados e considerando:
   - **Horário**: evitar sobreposição de horários no mesmo dia.
   - **Distância**: ordem e proximidade entre atrativos.
   - **Ordem lógica**: sequência de passeios que faça sentido no roteiro.

---

## Conteúdo esperado da tabela (conceitual)

A tabela deve permitir preços **por atrativo/atividade**, **por período (data/temporada)** e **por perfil de pessoa (ex.: adulto/criança)**. O fluxo não impõe nomes exatos de colunas; o importante é que o JSON retornado por `select=*` contenha informações que o LLM consiga interpretar.

Sugestão de conceitos que a tabela pode refletir (ajuste conforme seu schema real no Supabase):

| Conceito | Descrição |
|----------|-----------|
| **Identificação do atrativo/atividade** | Nome, ID ou slug do passeio (ex.: flutuação, gruta, cachoeira). |
| **Data / temporada** | Período ou indicação de alta/baixa temporada para o qual o preço vale. |
| **Preço por tipo de pessoa** | Valores para adulto, criança, senior etc., quando houver. |
| **Horário / duração** | Se existir, ajuda na montagem de pacotes (evitar conflito de horários). |
| **Outros** | Campos que ajudem a descrever o passeio ou a calcular totais (ex.: duração, local, categoria). |

Para conferir os **nomes reais das colunas** e o formato dos dados, use o **Table Editor** ou o **SQL Editor** do Supabase na tabela `atrativo_atividade_precos`.

---

## Regras de uso no prompt (Onofre)

As regras passadas ao LLM no fluxo são:

- Usar **apenas** os dados de **DADOS_ATRATIVOS_PRECOS** para informar preços e sugerir pacotes.
- Informar preços conforme a **data do cliente** (temporada) e a **quantidade de pessoas** (adultos/crianças).
- Ao sugerir pacotes, considerar **compatibilidade de horário**, **distância entre atrativos** e **ordem lógica do roteiro**.
- Não inventar valores; se não houver dado na tabela, o assistente deve dizer que vai confirmar com a equipe.

---

## Manutenção e limites

- **Atualização**: alterações na tabela (preços, novos passeios, novas temporadas) passam a valer na próxima execução do fluxo; não é necessário redeploy do workflow.
- **Tamanho**: o conteúdo é truncado em ~12.000 caracteres antes de ir para o prompt. Se a tabela crescer muito, pode ser necessário filtrar por temporada ou por atrativos ativos (ex.: coluna `ativo`) ou reduzir `select=*` para colunas essenciais.
- **Consistência**: manter nomes de atrativos e critérios de temporada alinhados ao que o fluxo e a **tabela de temporadas** (alta/baixa) consideram, para as respostas de preço e pacote fazerem sentido.

---

## Resumo

| Aspecto | Resumo |
|--------|--------|
| **Nome** | `atrativo_atividade_precos` |
| **Objetivo** | Preços de passeios por data/temporada e por perfil (adulto/criança etc.) e base para sugestão de pacotes. |
| **Onde** | Supabase (REST API), lida pelo nó "Buscar preços atrativos (Supabase)". |
| **No prompt** | Campo **DADOS_ATRATIVOS_PRECOS** (texto JSON). |
| **Quem usa** | Assistente Onofre (LLM) para respostas de preço e montagem de pacotes. |

Para ver o schema exato (tipos e colunas), consulte a tabela `atrativo_atividade_precos` no painel do Supabase.
