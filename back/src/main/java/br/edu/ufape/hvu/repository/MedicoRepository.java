package br.edu.ufape.hvu.repository;

import java.util.List;
import java.util.Optional;

import br.edu.ufape.hvu.model.Instituicao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ufape.hvu.model.Medico;

@Repository
public interface MedicoRepository extends JpaRepository<Medico, Long> {
	
	Optional<Medico> findByuserId (String userId);
	List<Medico> findByInstituicao (Instituicao instituicao);

}