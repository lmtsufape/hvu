package br.edu.ufape.hvu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import br.edu.ufape.hvu.model.Animal;
import java.util.List;
import br.edu.ufape.hvu.controller.dto.response.AnimalERacaPorOrigemResponse;
import br.edu.ufape.hvu.model.enums.OrigemAnimal;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {

    @Query("SELECT a FROM Animal a WHERE a.origemAnimal = :origem")
    List<Animal> findByOrigemAnimal(@Param("origem") br.edu.ufape.hvu.model.enums.OrigemAnimal origem);

    @Query("""
            SELECT new br.edu.ufape.hvu.controller.dto.response.AnimalERacaPorOrigemResponse(
                a.id,
                a.nome,
                a.raca.nome
            )
            FROM Animal a
            WHERE a.origemAnimal = :origem
            """)
    List<AnimalERacaPorOrigemResponse> findAnimaisERacasPorOrigem(
            @Param("origem") OrigemAnimal origem);
}