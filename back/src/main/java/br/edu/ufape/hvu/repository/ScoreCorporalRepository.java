package br.edu.ufape.hvu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ufape.hvu.model.ScoreCorporal;

@Repository
public interface ScoreCorporalRepository extends JpaRepository<ScoreCorporal, Long> {

	

}