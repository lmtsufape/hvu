package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.AvaliacaoFisicoGeral;

public interface AvaliacaoFisicoGeralServiceInterface {
	AvaliacaoFisicoGeral saveAvaliacaoFisicoGeral(AvaliacaoFisicoGeral o);
	AvaliacaoFisicoGeral findAvaliacaoFisicoGeralById(long id);
	AvaliacaoFisicoGeral updateAvaliacaoFisicoGeral(AvaliacaoFisicoGeral u);
	void deleteAvaliacaoFisicoGeral(AvaliacaoFisicoGeral u);
	void deleteAvaliacaoFisicoGeral(long id);
	List<AvaliacaoFisicoGeral> getAllAvaliacaoFisicoGeral();
    
    

    
}