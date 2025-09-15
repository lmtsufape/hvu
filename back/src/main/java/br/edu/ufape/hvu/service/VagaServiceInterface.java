package br.edu.ufape.hvu.service;

import java.time.LocalDate;
import java.util.List;
import br.edu.ufape.hvu.model.*;

public interface VagaServiceInterface {
    List<Vaga> findAllVaga();
	Vaga saveVaga(Vaga o);
	Vaga findVagaByIdWithLock(long id);
	boolean existsByIdAndAgendamentoIsNotNull(long id);
	Vaga findVagaById(long id);
	Vaga updateVaga(Vaga u);
	void deleteVaga(long id);
	List<Vaga> findVagaByEspecialidade(Especialidade especialidade);
	Vaga findVagaByAgendamento(Agendamento agendamento);
	List<Vaga> findVagasByData(LocalDate data);
	List<Vaga> findVagasByDataAndTurno(LocalDate data, String turno);
	List<Vaga> findVagasAndAgendamentoByMedico (LocalDate data, Medico medico);
	List<Vaga> findLatestVagaForEachAnimal();
	List<Vaga> findLatestVagaForEachAnimalNotReturn();
	List<Vaga> findVagaBetweenInicialAndFinalDate(LocalDate dataInicial, LocalDate dataFinal);
    List<Vaga> findVagasForTutor(List<Long> animalIds);
    List<Vaga> findVagasByMedicoId(Long medicoId);
}