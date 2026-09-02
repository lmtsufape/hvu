ALTER TABLE ficha_solicitacao_servico
    DROP CONSTRAINT IF EXISTS ficha_solicitacao_servico_material_check;

ALTER TABLE ficha_solicitacao_servico
    ALTER COLUMN material TYPE VARCHAR(50)
        USING CASE material
                  WHEN 0 THEN 'CAAF'
                  WHEN 1 THEN 'FRAGMENTO_BIOPSIA_CIRURGICA'
                  WHEN 2 THEN 'FRAGMENTO_NECROPSIA'
                  WHEN 3 THEN 'ANIMAL'
        END;

ALTER TABLE ficha_solicitacao_servico
    ADD CONSTRAINT ficha_solicitacao_servico_material_check
        CHECK (material IN ('CAAF',
                            'FRAGMENTO_BIOPSIA_CIRURGICA',
                            'FRAGMENTO_NECROPSIA',
                            'ANIMAL'));
