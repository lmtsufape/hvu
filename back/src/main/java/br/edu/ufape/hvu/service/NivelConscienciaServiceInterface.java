package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.NivelConsciencia;

public interface NivelConscienciaServiceInterface {
	NivelConsciencia saveNivelConsciencia(NivelConsciencia o);
	NivelConsciencia findNivelConscienciaById(long id);
	NivelConsciencia updateNivelConsciencia(NivelConsciencia u);
	void deleteNivelConsciencia(NivelConsciencia u);
	void deleteNivelConsciencia(long id);
	List<NivelConsciencia> getAllNivelConsciencia();
    
    

    
}