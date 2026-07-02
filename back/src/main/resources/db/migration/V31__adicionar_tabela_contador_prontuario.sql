CREATE TABLE contador_prontuario (
    id BIGSERIAL PRIMARY KEY,
    ultimo_valor INTEGER NOT NULL DEFAULT 0,
    valor_inicial_configurado BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO contador_prontuario (ultimo_valor, valor_inicial_configurado)
VALUES (0, FALSE);