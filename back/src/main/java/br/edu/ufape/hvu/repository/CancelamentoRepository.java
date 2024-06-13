package br.edu.ufape.hvu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.edu.ufape.hvu.model.Cancelamento;

import java.util.List;

@Repository
public interface CancelamentoRepository extends JpaRepository<Cancelamento, Long> {

    @Query("SELECT c FROM Cancelamento c " +
            "JOIN c.agendamento a " +
            "JOIN a.animal n " +
            "WHERE n.id IN (SELECT an.id FROM Tutor t JOIN t.animal an WHERE t.id = :tutorId)")
    List<Cancelamento> findCancelamentosByTutorId(@Param("tutorId") Long tutorId);


}
