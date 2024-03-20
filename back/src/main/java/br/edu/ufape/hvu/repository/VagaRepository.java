package br.edu.ufape.hvu.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import br.edu.ufape.hvu.model.Vaga;
import br.edu.ufape.hvu.model.Agendamento;
import br.edu.ufape.hvu.model.Especialidade;
import br.edu.ufape.hvu.model.Medico;


@Repository
public interface VagaRepository extends JpaRepository<Vaga, Long> {

	List<Vaga> findByEspecialidade(Especialidade especialidade);
	Vaga findByAgendamento(Agendamento agendamento);
	@Query("SELECT v FROM Vaga v WHERE v.dataHora BETWEEN :inicioDoDia AND :fimDoDia")
	List<Vaga> findByData(@Param("inicioDoDia") LocalDateTime inicioDoDia, 
	                          @Param("fimDoDia") LocalDateTime fimDoDia);
	@Query("SELECT v FROM Vaga v WHERE v.dataHora BETWEEN :inicioDoDia AND :fimDoDia AND v.especialidade = :especialidade")
    List<Vaga> findByDataAndEspecialidade(@Param("inicioDoDia") LocalDateTime inicioDoDia, @Param("fimDoDia") 
    LocalDateTime fimDoDia, @Param("especialidade") Especialidade especialidade);
	
	@Query("SELECT v FROM Vaga v WHERE v.dataHora BETWEEN :inicioDoDia AND :fimDoDia AND v.medico = :medico AND v.especialidade = :especialidade")
    List<Vaga> findByDataAndEspecialidadeAndMedico(@Param("inicioDoDia") LocalDateTime inicioDoDia, @Param("fimDoDia") 
    LocalDateTime fimDoDia, @Param("especialidade") Especialidade especialidade, @Param("medico") Medico medico);
}