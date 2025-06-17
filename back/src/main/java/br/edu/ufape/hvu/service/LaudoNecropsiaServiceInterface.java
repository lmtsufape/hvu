package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.LaudoNecropsia;

public interface LaudoNecropsiaServiceInterface {
	LaudoNecropsia saveLaudoNecropsia(LaudoNecropsia o);
	LaudoNecropsia findLaudoNecropsiaById(long id);
	LaudoNecropsia updateLaudoNecropsia(LaudoNecropsia u);
    void deleteLaudoNecropsia(long id);
	List<LaudoNecropsia> getAllLaudoNecropsia();
    
    

    
}