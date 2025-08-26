package br.edu.ufape.hvu.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import br.edu.ufape.hvu.model.*;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VagaRepository extends JpaRepository<Vaga, Long> {
	List<Vaga> findByEspecialidade(Especialidade especialidade);
	Vaga findByAgendamento(Agendamento agendamento);

	@Query("SELECT v FROM Vaga v WHERE v.dataHora BETWEEN :inicioDoDia AND :fimDoDia")
	List<Vaga> findByData(@Param("inicioDoDia") LocalDateTime inicioDoDia, 
	                          @Param("fimDoDia") LocalDateTime fimDoDia);

	List<Vaga> findByDataHoraBetween(LocalDateTime dataInicio, LocalDateTime dataFinal);

	@Query(value = "SELECT DISTINCT ON (animal.id) v.* FROM Vaga v " +
	           "JOIN agendamento a ON v.agendamento_id = a.id " +
	           "JOIN animal ON a.animal_id = animal.id " +
	           "JOIN consulta c ON v.consulta_id = c.id AND c.proxima_consulta = true " +
	           "ORDER BY animal.id, v.data_hora DESC", nativeQuery = true)
    List<Vaga> findLatestVagaForEachAnimal();
	
	@Query(value = "SELECT DISTINCT ON (animal.id) v.* FROM Vaga v " +
	           "JOIN agendamento a ON v.agendamento_id = a.id " +
	           "JOIN animal ON a.animal_id = animal.id " +
	           "JOIN consulta c ON v.consulta_id = c.id AND c.proxima_consulta = false " +
	           "ORDER BY animal.id, v.data_hora DESC", nativeQuery = true)
	List<Vaga> findLatestVagaForEachAnimalNotReturn();

	@Lock(LockModeType.PESSIMISTIC_WRITE)
	@Query("SELECT v FROM Vaga v WHERE v.id = :id")
	Optional<Vaga> findByIdWithLock(@Param("id") Long id);

	boolean existsByIdAndAgendamentoIsNotNull(Long id);

	List<Vaga> findVagasByDataHoraBetweenAndMedicoAndAgendamentoNotNull(LocalDateTime begin, LocalDateTime end, Medico medico);

    @Query("""
    SELECT v FROM Vaga v
    LEFT JOIN v.agendamento a
    LEFT JOIN a.animal an
    WHERE a IS NULL OR an.id IN :animalIds
    """)
    List<Vaga> findVagasForTutor(@Param("animalIds") List<Long> animalIds);

    List<Vaga> findVagasByMedicoId(Long medicoId);
}