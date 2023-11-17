package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.AvaliacaoFisicoEspecial;

public interface AvaliacaoFisicoEspecialServiceInterface {
	AvaliacaoFisicoEspecial saveAvaliacaoFisicoEspecial(AvaliacaoFisicoEspecial o);
	AvaliacaoFisicoEspecial findAvaliacaoFisicoEspecialById(long id);
	AvaliacaoFisicoEspecial updateAvaliacaoFisicoEspecial(AvaliacaoFisicoEspecial u);
	void deleteAvaliacaoFisicoEspecial(AvaliacaoFisicoEspecial u);
	void deleteAvaliacaoFisicoEspecial(long id);
	List<AvaliacaoFisicoEspecial> getAllAvaliacaoFisicoEspecial();
    
    

    
}