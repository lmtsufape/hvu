package br.edu.ufape.hvu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import br.edu.ufape.hvu.model.Ficha;
import java.util.List;

@Repository
public interface FichaRepository extends JpaRepository<Ficha, Long> {

    List<Ficha> findByAgendamentoId(Long agendamentoId);
    List<Ficha> findByAgendamentoAnimalId(Long animalId);

}