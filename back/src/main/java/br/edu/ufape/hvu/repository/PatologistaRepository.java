package br.edu.ufape.hvu.repository;

import br.edu.ufape.hvu.model.Patologista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatologistaRepository  extends JpaRepository<Patologista, Long> {

}
