ALTER TABLE ficha_solicitacao_servico
ALTER COLUMN data_hora_obito
TYPE TIMESTAMP
USING data_hora_obito::TIMESTAMP;
