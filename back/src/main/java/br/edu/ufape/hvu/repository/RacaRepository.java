package br.edu.ufape.hvu.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ufape.hvu.model.Especie;
import br.edu.ufape.hvu.model.Raca;

@Repository
public interface RacaRepository extends JpaRepository<Raca, Long> {

	List<Raca> findByEspecie(Especie especie);

}