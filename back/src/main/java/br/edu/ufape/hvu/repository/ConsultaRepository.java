package br.edu.ufape.hvu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import br.edu.ufape.hvu.model.Consulta;
import java.util.List;

@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    
    @Query("SELECT c FROM Consulta c where c.animal.id = :animalId")
    List<Consulta> findConsultasByAnimalId(@Param("animalId") Long animalId);
}
