ALTER TABLE ficha_solicitacao_servico
DROP CONSTRAINT IF EXISTS "ficha_solicitacao_servico_animal_id)_key";

ALTER TABLE ficha_solicitacao_servico
DROP CONSTRAINT IF EXISTS "fk7735o7hr7k2fbvnr9susyja8j";

ALTER TABLE ficha_solicitacao_servico
RENAME COLUMN "animal_id)" TO animal_id;

ALTER TABLE ficha_solicitacao_servico
ADD CONSTRAINT ficha_solicitacao_servico_animal_id_fkey
FOREIGN KEY (animal_id) REFERENCES animal(id);
