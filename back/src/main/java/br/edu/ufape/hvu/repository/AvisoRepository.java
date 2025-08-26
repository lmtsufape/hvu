package br.edu.ufape.hvu.repository;

import br.edu.ufape.hvu.model.Aviso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AvisoRepository extends JpaRepository<Aviso, Long> {
    List<Aviso> findByHabilitadoTrue();
}
