ALTER TABLE ficha
ADD COLUMN animal_id BIGINT;

ALTER TABLE ficha
ADD CONSTRAINT fk_ficha_animal
FOREIGN KEY (animal_id)
REFERENCES animal(id);