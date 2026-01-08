ALTER TABLE animal
    ADD COLUMN origem_animal INTEGER;

UPDATE animal
SET origem_animal = 0
WHERE origem_animal IS NULL;

ALTER TABLE animal
ALTER COLUMN origem_animal SET NOT NULL;

