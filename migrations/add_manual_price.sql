-- Adiciona campo manual_price na tabela tours
-- Quando definido (NOT NULL e > 0), sobrescreve toda lógica de preço automática BTMS
-- e impede que a sincronização automática altere o preço do passeio.

ALTER TABLE tours
ADD COLUMN IF NOT EXISTS manual_price NUMERIC(10, 2) DEFAULT NULL;

COMMENT ON COLUMN tours.manual_price IS 'Preço manual override. Quando definido, ignora toda lógica BTMS/automática de preços.';
