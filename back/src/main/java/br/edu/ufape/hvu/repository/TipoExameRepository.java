package br.edu.ufape.hvu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ufape.hvu.model.TipoExame;

@Repository
public interface TipoExameRepository extends JpaRepository<TipoExame, Long> {

	

}