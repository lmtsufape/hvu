package br.edu.ufape.hvu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ufape.hvu.model.Vaga;
import br.edu.ufape.hvu.model.Agendamento;
import br.edu.ufape.hvu.model.Especialidade;


@Repository
public interface VagaRepository extends JpaRepository<Vaga, Long> {

	List<Vaga> findByEspecialidade(Especialidade especialidade);
	Vaga findByAgendamento(Agendamento agendamento);

}