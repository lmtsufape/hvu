package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Etapa;

public interface EtapaServiceInterface {
	Etapa saveEtapa(Etapa o);
	Etapa findEtapaById(long id);
	Etapa updateEtapa(Etapa u);
	void deleteEtapa(Etapa u);
	void deleteEtapa(long id);
	List<Etapa> getAllEtapa();
    
    

    
}