CREATE TABLE secretario
(
    id BIGINT PRIMARY KEY,
    CONSTRAINT fk_secretario_usuario FOREIGN KEY (id) REFERENCES usuario(id)
);
