ALTER TABLE ficha_solicitacao_servico
ALTER COLUMN data_recebimento
TYPE TIMESTAMP
USING data_recebimento::TIMESTAMP;
