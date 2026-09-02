ALTER TABLE animal
    DROP CONSTRAINT IF EXISTS animal_origem_animal_check;

ALTER TABLE animal
    ALTER COLUMN origem_animal TYPE VARCHAR(20)
        USING CASE origem_animal
                  WHEN 0 THEN 'HVU'
                  WHEN 1 THEN 'LAPA'
                  ELSE 'HVU'
        END;

ALTER TABLE animal
    ADD CONSTRAINT animal_origem_animal_check
        CHECK (origem_animal IN ('HVU','LAPA'));