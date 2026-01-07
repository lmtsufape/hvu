ALTER TABLE ficha
ADD COLUMN agendamento_id BIGINT;

ALTER TABLE ficha
ADD CONSTRAINT fk_ficha_agendamento
FOREIGN KEY (agendamento_id)
REFERENCES agendamento(id);
