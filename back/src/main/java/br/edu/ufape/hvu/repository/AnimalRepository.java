package br.edu.ufape.hvu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import br.edu.ufape.hvu.model.Animal;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {

    @Query("SELECT a FROM Animal a where a.numeroFicha = :numeroFicha")
    Animal findAnimalByFicha(@Param("numeroFicha") String numeroFicha);

}