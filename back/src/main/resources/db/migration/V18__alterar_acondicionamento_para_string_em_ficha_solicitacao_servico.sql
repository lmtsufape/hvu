ALTER TABLE ficha_solicitacao_servico
    DROP CONSTRAINT IF EXISTS ficha_solicitacao_servico_acondicionamento_check;

ALTER TABLE ficha_solicitacao_servico
    ALTER COLUMN acondicionamento TYPE VARCHAR(20)
        USING CASE acondicionamento
                  WHEN 0 THEN 'CONGELADO'
                  WHEN 1 THEN 'RESFRIADO'
                  WHEN 2 THEN 'NATURAL'
        END;

ALTER TABLE ficha_solicitacao_servico
    ADD CONSTRAINT ficha_solicitacao_servico_acondicionamento_check
        CHECK (acondicionamento IN ('CONGELADO', 'RESFRIADO', 'NATURAL'));
