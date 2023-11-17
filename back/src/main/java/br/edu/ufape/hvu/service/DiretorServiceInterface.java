package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Diretor;

public interface DiretorServiceInterface {
	Diretor saveDiretor(Diretor o);
	Diretor findDiretorById(long id);
	Diretor updateDiretor(Diretor u);
	void deleteDiretor(Diretor u);
	void deleteDiretor(long id);
	List<Diretor> getAllDiretor();
    
    

    
}