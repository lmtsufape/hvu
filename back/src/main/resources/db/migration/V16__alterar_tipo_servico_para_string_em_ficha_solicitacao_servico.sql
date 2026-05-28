ALTER TABLE ficha_solicitacao_servico
    DROP CONSTRAINT IF EXISTS ficha_solicitacao_servico_tipo_servico_check;

ALTER TABLE ficha_solicitacao_servico
    ALTER COLUMN tipo_servico TYPE VARCHAR(50)
        USING CASE tipo_servico
                  WHEN 0 THEN 'NECROPSIA'
                  WHEN 1 THEN 'MICROSCOPIA'
                  WHEN 2 THEN 'NECROPSIA_COM_MICROSCOPIA'
        END;

ALTER TABLE ficha_solicitacao_servico
    ADD CONSTRAINT ficha_solicitacao_servico_tipo_servico_check
        CHECK (tipo_servico IN ('NECROPSIA', 'MICROSCOPIA', 'NECROPSIA_COM_MICROSCOPIA'));