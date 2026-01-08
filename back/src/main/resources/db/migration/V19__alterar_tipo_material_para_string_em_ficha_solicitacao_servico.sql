ALTER TABLE ficha_solicitacao_servico
ALTER COLUMN material TYPE VARCHAR(50)
    USING CASE material
              WHEN 0 THEN 'CAAF'
              WHEN 1 THEN 'FRAGMENTO_BIOPSIA_CIRURGICA'
              WHEN 2 THEN 'FRAGMENTO_NECROPSIA'
              WHEN 3 THEN 'ANIMAL'
    END;
