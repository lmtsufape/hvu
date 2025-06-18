package br.edu.ufape.hvu.repository;

import br.edu.ufape.hvu.model.Patologista;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PatologistaRepository  extends JpaRepository<Patologista, Long> {

}
