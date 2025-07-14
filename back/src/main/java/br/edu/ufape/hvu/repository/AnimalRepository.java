package br.edu.ufape.hvu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import br.edu.ufape.hvu.model.Animal;

import java.util.List;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {

    @Query("SELECT a FROM Animal a where a.numeroFicha = :numeroFicha")
    Animal findAnimalByFicha(@Param("numeroFicha") String numeroFicha);

    @Query("SELECT a FROM Animal a WHERE a.tipoAnimal = :tipo")
    List<Animal> findByTipoAnimal(@Param("tipo") br.edu.ufape.hvu.model.enums.TipoAnimal tipo);


}