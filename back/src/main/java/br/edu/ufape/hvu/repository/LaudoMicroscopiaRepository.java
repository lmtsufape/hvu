package br.edu.ufape.hvu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ufape.hvu.model.LaudoMicroscopia;

@Repository
public interface LaudoMicroscopiaRepository extends JpaRepository<LaudoMicroscopia, Long> {

	

}