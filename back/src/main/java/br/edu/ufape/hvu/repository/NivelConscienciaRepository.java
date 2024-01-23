package br.edu.ufape.hvu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ufape.hvu.model.NivelConsciencia;

@Repository
public interface NivelConscienciaRepository extends JpaRepository<NivelConsciencia, Long> {

	

}