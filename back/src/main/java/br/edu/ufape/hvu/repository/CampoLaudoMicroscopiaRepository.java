package br.edu.ufape.hvu.repository;

import br.edu.ufape.hvu.model.CampoLaudoMicroscopia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CampoLaudoMicroscopiaRepository extends JpaRepository<CampoLaudoMicroscopia, Long> {
}
