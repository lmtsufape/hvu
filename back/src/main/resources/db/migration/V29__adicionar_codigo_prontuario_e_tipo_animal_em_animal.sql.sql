ALTER TABLE animal
    ADD COLUMN codigo_prontuario VARCHAR(20),
    ADD COLUMN tipo VARCHAR(20) NOT NULL DEFAULT 'COMUM';

ALTER TABLE animal
    ADD CONSTRAINT uk_animal_codigo_prontuario UNIQUE (codigo_prontuario);

ALTER TABLE animal
    ADD CONSTRAINT animal_tipo_check
        CHECK (tipo IN ('COMUM', 'SILVESTRE'));