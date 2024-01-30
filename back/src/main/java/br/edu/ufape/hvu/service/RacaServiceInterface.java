package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Especie;
import br.edu.ufape.hvu.model.Raca;

public interface RacaServiceInterface {
	Raca saveRaca(Raca o);
	Raca findRacaById(long id);
	Raca updateRaca(Raca u);
	void deleteRaca(Raca u);
	void deleteRaca(long id);
	List<Raca> getAllRaca();
	List<Raca> findByEspecie(Especie especie);
    
    

    
}