package br.edu.ufape.hvu.repository;

import br.edu.ufape.hvu.model.Secretario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SecretarioRepository extends JpaRepository<Secretario, Long> {

}
