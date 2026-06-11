# Runbook de Sync BTMS (S1/S2)

## Ordem oficial

1. Rodar a ingestao BTMS externa:
   - `c:\Users\ian\Documents\integração btms\sync_to_supabase.py`
2. No painel admin, acionar `Sincronizar`.
3. O backend executa `refresh_btms_semester_tables(split_date)` para regenerar:
   - `btms_prices_1o_semestre`
   - `btms_prices_2o_semestre`
4. Verificar status da execucao no bloco de governanca (runs recentes).

## Validacoes minimas

- S1 e S2 com dados carregados.
- S2 com vigencias apos data de corte (`semester_split`).
- Card e pagina detalhada com mesmo preco principal por semestre.
- Linhas com override manual preservadas:
  - `manual_price`
  - `manual_price_2o_semester`

## Rollback

- Escolher ultimo run valido no historico (`price_sync_runs`).
- Reprocessar com fonte BTMS anterior (snapshot externo) e executar sync novamente.
- Confirmar cache publico atualizado apos novo run.
