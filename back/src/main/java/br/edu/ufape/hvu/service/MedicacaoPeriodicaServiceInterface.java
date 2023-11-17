package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.MedicacaoPeriodica;

public interface MedicacaoPeriodicaServiceInterface {
	MedicacaoPeriodica saveMedicacaoPeriodica(MedicacaoPeriodica o);
	MedicacaoPeriodica findMedicacaoPeriodicaById(long id);
	MedicacaoPeriodica updateMedicacaoPeriodica(MedicacaoPeriodica u);
	void deleteMedicacaoPeriodica(MedicacaoPeriodica u);
	void deleteMedicacaoPeriodica(long id);
	List<MedicacaoPeriodica> getAllMedicacaoPeriodica();
    
    

    
}