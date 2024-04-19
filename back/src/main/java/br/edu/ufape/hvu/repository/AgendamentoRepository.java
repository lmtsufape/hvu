package br.edu.ufape.hvu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.edu.ufape.hvu.model.Agendamento;
import br.edu.ufape.hvu.model.Animal;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

	
	@Query("SELECT v.agendamento FROM Vaga v WHERE v.medico.id = :medicoId AND v.agendamento IS NOT NULL")
    List<Agendamento> findAgendamentosByMedicoId(@Param("medicoId") Long medicoId);
	
	List<Agendamento> findByAnimal( Animal animal);
}