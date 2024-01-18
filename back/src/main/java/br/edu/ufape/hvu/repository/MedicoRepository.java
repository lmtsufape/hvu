package br.edu.ufape.hvu.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ufape.hvu.model.Medico;

@Repository
public interface MedicoRepository extends JpaRepository<Medico, Long> {
	
	Optional<Medico> findByuserId (String userId);

}