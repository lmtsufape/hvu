package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.ExameComplementar;

public interface ExameComplementarServiceInterface {
	ExameComplementar saveExameComplementar(ExameComplementar o);
	ExameComplementar findExameComplementarById(long id);
	ExameComplementar updateExameComplementar(ExameComplementar u);
	void deleteExameComplementar(ExameComplementar u);
	void deleteExameComplementar(long id);
	List<ExameComplementar> getAllExameComplementar();
    
    

    
}