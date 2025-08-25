package br.edu.ufape.hvu.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import br.edu.ufape.hvu.model.Tutor;

@Repository
public interface TutorRepository extends JpaRepository<Tutor, Long> {
	Tutor findByUserId(String userId);
	@Query("SELECT t FROM Tutor t JOIN t.animal a WHERE :animalId IN (SELECT a.id FROM t.animal a)")
    Tutor findByAnimalId(@Param("animalId") Long animalId);
    boolean existsByCpf(String cpf);
    boolean existsByEmail(String email);
}