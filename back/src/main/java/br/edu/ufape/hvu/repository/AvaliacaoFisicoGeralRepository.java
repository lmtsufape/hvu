package br.edu.ufape.hvu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ufape.hvu.model.AvaliacaoFisicoGeral;

@Repository
public interface AvaliacaoFisicoGeralRepository extends JpaRepository<AvaliacaoFisicoGeral, Long> {

	

}