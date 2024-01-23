package br.edu.ufape.hvu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ufape.hvu.model.LaudoNecropsia;

@Repository
public interface LaudoNecropsiaRepository extends JpaRepository<LaudoNecropsia, Long> {

	

}