ALTER TABLE tours
ADD COLUMN price_ms_low_season REAL,
ADD COLUMN price_ms_high_season REAL,
ADD COLUMN price_child_high_season REAL,
ADD COLUMN price_child_low_season REAL,
ADD COLUMN price_senior_high_season REAL,
ADD COLUMN price_senior_low_season REAL,
ADD COLUMN price_ms REAL;