ALTER TABLE ficha_solicitacao_servico
ALTER COLUMN estado_conservacao TYPE VARCHAR(20)
    USING CASE estado_conservacao
              WHEN 0 THEN 'BOM'
              WHEN 1 THEN 'REGULAR'
              WHEN 2 THEN 'RUIM'
    END;
