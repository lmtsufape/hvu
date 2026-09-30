DO $$
DECLARE
    qtd_grupos_duplicados bigint;
BEGIN
    SELECT count(*) INTO qtd_grupos_duplicados
    FROM (
        SELECT data_hora, medico_id
        FROM vaga
        WHERE medico_id IS NOT NULL
        GROUP BY data_hora, medico_id
        HAVING count(*) > 1
    ) duplicadas;

    IF qtd_grupos_duplicados = 0 THEN
        CREATE UNIQUE INDEX IF NOT EXISTS uq_vaga_data_hora_medico ON vaga (data_hora, medico_id);
    ELSE
        RAISE NOTICE 'Índice único uq_vaga_data_hora_medico não criado: existem % grupo(s) de vagas duplicadas (data_hora, medico_id).', qtd_grupos_duplicados;
    END IF;
END $$;
