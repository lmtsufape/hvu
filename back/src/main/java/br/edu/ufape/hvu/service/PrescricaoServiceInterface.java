package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Prescricao;

public interface PrescricaoServiceInterface {
	Prescricao savePrescricao(Prescricao o);
	Prescricao findPrescricaoById(long id);
	Prescricao updatePrescricao(Prescricao u);
	void deletePrescricao(Prescricao u);
	void deletePrescricao(long id);
	List<Prescricao> getAllPrescricao();
    
    

    
}