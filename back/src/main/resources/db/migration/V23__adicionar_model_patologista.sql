CREATE TABLE patologista
(
    id BIGINT PRIMARY KEY,
    CONSTRAINT fk_patologista_medico FOREIGN KEY (id) REFERENCES medico(id)
);
