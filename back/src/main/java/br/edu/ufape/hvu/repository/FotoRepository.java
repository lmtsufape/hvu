package br.edu.ufape.hvu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.edu.ufape.hvu.model.Foto;

@Repository
public interface FotoRepository extends JpaRepository<Foto, Long> {

	

}