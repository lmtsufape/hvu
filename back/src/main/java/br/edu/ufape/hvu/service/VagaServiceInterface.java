package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Agendamento;
import br.edu.ufape.hvu.model.Especialidade;
import br.edu.ufape.hvu.model.Vaga;

public interface VagaServiceInterface {
	Vaga saveVaga(Vaga o);
	Vaga findVagaById(long id);
	Vaga updateVaga(Vaga u);
	void deleteVaga(Vaga u);
	void deleteVaga(long id);
	List<Vaga> getAllVaga();
	List<Vaga> findVagaByEspecialidade(Especialidade especialidade);
	Vaga findVagaByAgendamento(Agendamento agendamento);
        
}