package br.edu.ufape.hvu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ufape.hvu.model.Cronograma;
import br.edu.ufape.hvu.model.Especialidade;
import br.edu.ufape.hvu.model.Medico;

@Repository
public interface CronogramaRepository extends JpaRepository<Cronograma, Long> {

	List<Cronograma>findByEspecialidade(Especialidade especialidade);
	
	List<Cronograma>findByMedico(Medico medico);
	
}