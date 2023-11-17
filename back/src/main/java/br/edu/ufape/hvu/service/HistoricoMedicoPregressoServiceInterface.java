package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.HistoricoMedicoPregresso;

public interface HistoricoMedicoPregressoServiceInterface {
	HistoricoMedicoPregresso saveHistoricoMedicoPregresso(HistoricoMedicoPregresso o);
	HistoricoMedicoPregresso findHistoricoMedicoPregressoById(long id);
	HistoricoMedicoPregresso updateHistoricoMedicoPregresso(HistoricoMedicoPregresso u);
	void deleteHistoricoMedicoPregresso(HistoricoMedicoPregresso u);
	void deleteHistoricoMedicoPregresso(long id);
	List<HistoricoMedicoPregresso> getAllHistoricoMedicoPregresso();
    
    

    
}