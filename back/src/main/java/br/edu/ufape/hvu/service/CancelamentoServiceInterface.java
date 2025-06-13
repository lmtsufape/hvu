package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Cancelamento;

public interface CancelamentoServiceInterface {
	Cancelamento saveCancelamento(Cancelamento o);
	Cancelamento findCancelamentoById(long id);
	List<Cancelamento> findCancelamentosByTutorId(long id);
	Cancelamento updateCancelamento(Cancelamento u);
	void deleteCancelamento(long id);
	List<Cancelamento> getAllCancelamento();

}
