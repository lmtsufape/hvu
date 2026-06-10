ALTER TABLE ficha
ADD COLUMN medico_id BIGINT;

ALTER TABLE ficha
ADD CONSTRAINT fk_ficha_medico
    FOREIGN KEY (medico_id) REFERENCES usuario(id);