package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Medico;

public interface MedicoServiceInterface {
	Medico saveMedico(Medico o);
	Medico findMedicoById(long id);
	Medico updateMedico(Medico u);
	void deleteMedico(Medico u);
	void deleteMedico(long id);
	List<Medico> getAllMedico();
    
    

    
}