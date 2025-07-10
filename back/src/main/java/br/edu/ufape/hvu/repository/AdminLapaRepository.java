package br.edu.ufape.hvu.repository;

import br.edu.ufape.hvu.model.AdminLapa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminLapaRepository extends JpaRepository<AdminLapa, Long> {

}
