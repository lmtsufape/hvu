ALTER TABLE area
ADD COLUMN especie_id BIGINT;

ALTER TABLE area
ADD CONSTRAINT fk_area_especie
FOREIGN KEY (especie_id) REFERENCES especie(id);
