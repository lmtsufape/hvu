package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Especialidade;

public interface EspecialidadeServiceInterface {
	Especialidade saveEspecialidade(Especialidade o);
	Especialidade findEspecialidadeById(long id);
	Especialidade updateEspecialidade(Especialidade u);
	void deleteEspecialidade(long id);
	List<Especialidade> getAllEspecialidade();
    
    

    
}