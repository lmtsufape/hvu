package br.edu.ufape.hvu.repository;

import br.edu.ufape.hvu.model.ContadorProntuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContadorProntuarioRepository extends JpaRepository<ContadorProntuario, Long> {
}
