ALTER TABLE ficha_solicitacao_servico
    DROP CONSTRAINT IF EXISTS ficha_solicitacao_servico_estado_conservacao_check;

ALTER TABLE ficha_solicitacao_servico
    ALTER COLUMN estado_conservacao TYPE VARCHAR(20)
        USING CASE estado_conservacao
                  WHEN 0 THEN 'BOM'
                  WHEN 1 THEN 'REGULAR'
                  WHEN 2 THEN 'RUIM'
        END;

ALTER TABLE ficha_solicitacao_servico
    ADD CONSTRAINT ficha_solicitacao_servico_estado_conservacao_check
        CHECK (estado_conservacao IN ('BOM', 'REGULAR', 'RUIM'));
