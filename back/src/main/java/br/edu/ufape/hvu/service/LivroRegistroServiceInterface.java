package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.LivroRegistro;

public interface LivroRegistroServiceInterface {
	LivroRegistro saveLivroRegistro(LivroRegistro o);
	LivroRegistro findLivroRegistroById(long id);
	LivroRegistro updateLivroRegistro(LivroRegistro u);
	void deleteLivroRegistro(LivroRegistro u);
	void deleteLivroRegistro(long id);
	List<LivroRegistro> getAllLivroRegistro();
    
    

    
}