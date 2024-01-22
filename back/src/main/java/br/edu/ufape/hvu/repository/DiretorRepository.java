package br.edu.ufape.hvu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ufape.hvu.model.Diretor;

@Repository
public interface DiretorRepository extends JpaRepository<Diretor, Long> {
	Diretor findByuserId (String userId);
	

}