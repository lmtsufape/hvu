package br.edu.ufape.hvu.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import br.edu.ufape.hvu.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
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

	@Query("SELECT v FROM Vaga v WHERE v.dataHora BETWEEN :inicioDoDia AND :fimDoDia AND v.especialidade = :especialidade")
    List<Vaga> findByDataAndEspecialidade(@Param("inicioDoDia") LocalDateTime inicioDoDia, @Param("fimDoDia") 
    LocalDateTime fimDoDia, @Param("especialidade") Especialidade especialidade);
	
	@Query("SELECT v FROM Vaga v WHERE v.dataHora BETWEEN :inicioDoDia AND :fimDoDia AND v.medico = :medico AND v.especialidade = :especialidade")
    List<Vaga> findByDataAndEspecialidadeAndMedico(@Param("inicioDoDia") LocalDateTime inicioDoDia, @Param("fimDoDia") 
    LocalDateTime fimDoDia, @Param("especialidade") Especialidade especialidade, @Param("medico") Medico medico);
	
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

	Vaga findByConsulta(Consulta consulta);
	
	List<Vaga> findVagasByDataHoraBetweenAndMedicoAndAgendamentoNotNull(LocalDateTime begin, LocalDateTime end, Medico medico);
}