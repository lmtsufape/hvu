CREATE TABLE admin_lapa
(
    id BIGINT PRIMARY KEY,
    CONSTRAINT fk_admin_lapa_usuario FOREIGN KEY (id) REFERENCES usuario(id)
);
